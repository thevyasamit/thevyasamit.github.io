#!/usr/bin/env ruby
# frozen_string_literal: true

# Validates every post against the controlled vocabularies before the site is
# built, so a bad tag fails the build with a clear message instead of quietly
# creating an orphan tag nobody can filter by.
#
#   ruby script/validate-content.rb
#
# Runs in CI on pushes AND pull requests, so mistakes are caught before merge.

require "yaml"
require "date"

ROOT = File.expand_path("..", __dir__)
DESC_MIN = 50
DESC_MAX = 160

def load_vocab(file, what)
  path = File.join(ROOT, "_data", file)
  abort "FATAL: #{file} is missing; #{what} cannot be validated." unless File.exist?(path)
  entries = YAML.safe_load(File.read(path)) || []
  slugs = entries.map { |e| e["slug"] }
  dupes = slugs.tally.select { |_, n| n > 1 }.keys
  abort "FATAL: duplicate #{what} slug(s) in #{file}: #{dupes.join(', ')}" if dupes.any?
  missing = entries.reject { |e| e["slug"] && e["label"] }
  abort "FATAL: every #{what} entry needs a slug and a label (#{file})" if missing.any?
  slugs
end

TAGS       = load_vocab("tags.yml", "tag")
AUTHORSHIP = load_vocab("authorship.yml", "authorship")

# Cheap "did you mean" via Levenshtein, so a typo names its own fix.
def distance(a, b)
  m = Array.new(a.length + 1) { |i| [i] + Array.new(b.length, 0) }
  (0..b.length).each { |j| m[0][j] = j }
  (1..a.length).each do |i|
    (1..b.length).each do |j|
      cost = a[i - 1] == b[j - 1] ? 0 : 1
      m[i][j] = [m[i - 1][j] + 1, m[i][j - 1] + 1, m[i - 1][j - 1] + cost].min
    end
  end
  m[a.length][b.length]
end

def suggest(value, candidates)
  best = candidates.min_by { |c| distance(value.to_s.downcase, c) }
  return "" unless best && distance(value.to_s.downcase, best) <= 3
  %( - did you mean "#{best}"?)
end

errors = []
posts  = Dir[File.join(ROOT, "_posts", "*.{md,markdown,html}")].sort
warn "No posts found in _posts/." if posts.empty?

posts.each do |path|
  name = path.sub("#{ROOT}/", "")
  raw  = File.read(path)

  unless raw.start_with?("---")
    errors << "#{name}: no YAML front matter."
    next
  end

  front = begin
    YAML.safe_load(raw.split(/^---\s*$/)[1].to_s, permitted_classes: [Date, Time])
  rescue StandardError => e
    errors << "#{name}: front matter is not valid YAML (#{e.message.lines.first.strip})."
    next
  end

  unless front.is_a?(Hash)
    errors << "#{name}: front matter did not parse into a mapping."
    next
  end

  # --- title -------------------------------------------------------------
  errors << "#{name}: missing `title`." if front["title"].to_s.strip.empty?

  # --- description -------------------------------------------------------
  desc = front["description"].to_s.gsub(/\s+/, " ").strip
  if desc.empty?
    errors << "#{name}: missing `description`. It becomes the Google snippet " \
              "and the post-list excerpt; without one both get invented for you."
  elsif desc.length < DESC_MIN || desc.length > DESC_MAX
    errors << "#{name}: `description` is #{desc.length} chars (want #{DESC_MIN}-#{DESC_MAX})."
  end

  # --- tags --------------------------------------------------------------
  tags = front["tags"]
  tags = [tags] if tags.is_a?(String)
  tags = Array(tags)
  if tags.empty?
    errors << "#{name}: no `tags`. Pick at least one from _data/tags.yml."
  else
    tags.each do |t|
      next if TAGS.include?(t.to_s)
      errors << %(#{name}: unknown tag "#{t}"#{suggest(t, TAGS)} ) +
                "Allowed: #{TAGS.join(', ')}."
    end
  end

  # --- authorship --------------------------------------------------------
  auth = front["authorship"].to_s
  if auth.empty?
    errors << "#{name}: missing `authorship`. Choose one of: #{AUTHORSHIP.join(', ')}."
  elsif !AUTHORSHIP.include?(auth)
    errors << %(#{name}: unknown authorship "#{auth}"#{suggest(auth, AUTHORSHIP)} ) +
              "Allowed: #{AUTHORSHIP.join(', ')}."
  end

  # --- filename date vs front-matter date --------------------------------
  # A classic Jekyll trap: they disagree, the post silently does not publish.
  if (m = File.basename(path).match(/\A(\d{4}-\d{2}-\d{2})-/))
    file_date = m[1]
    fm_date = front["date"]
    fm_date = fm_date.strftime("%Y-%m-%d") if fm_date.respond_to?(:strftime)
    fm_date = fm_date.to_s[0, 10]
    unless fm_date.empty? || fm_date == file_date
      errors << "#{name}: filename says #{file_date} but front matter says #{fm_date}."
    end
  else
    errors << "#{name}: filename must start with YYYY-MM-DD-."
  end
end

if errors.empty?
  puts "Content OK: #{posts.size} post(s), #{TAGS.size} tags, #{AUTHORSHIP.size} authorship values."
  exit 0
end

warn "\nContent validation failed:\n\n"
errors.each { |e| warn "  x #{e}" }
warn "\n#{errors.size} problem(s). Fix the front matter, or update _data/tags.yml.\n\n"
exit 1
