---
title: "Artificial Belief"
date: 2026-10-04
tags: [ai, society, psychology, philosophy]
# I drafted this post, so it is disclosed as such. Change to human-written
# once you rewrite it in your own words.
authorship: ai-written
description: >-
  If you half-know a subject, AI can make you believe almost anything about it.
  I call that artificial belief, and it costs you when it matters.
---

Nietzsche wrote: *"It is better to know nothing than to half-know many
things."* I used to think that was a bit harsh. After a year of working with
AI every day, I think it is exactly right.

## What I mean by "artificial belief"

If you know nothing about a topic, you know that you don't know. You stay
careful. You ask someone.

If you know a subject well, you can tell when an answer is wrong.

The danger is in the middle. When you half-know something, you know just
enough to follow an answer, but not enough to check it. So when an AI gives
you a confident, well-written answer, it feels right, and you believe it. You
didn't earn that belief by understanding anything. It was handed to you.

That is what I call **artificial belief**: a belief that comes from how sure
the answer sounded, not from what you actually know.

## 2 + 3 = 5, and so does 6 + (−1)

Take the number 5. You can get there with 2 + 3. You can also get there with
6 + (−1). Same answer, completely different paths.

If all you look at is the 5, both look the same. But the answer is the
smallest part of it. What matters is how you got there: understanding what the
question is really asking, the context around it, and then making a decision.

Now imagine you don't really understand the question. You can't see the path.
All you can see is the final answer, 5, and it looks right. So you trust it,
and because it looked right, you start to feel that you understand too. That
is how artificial belief gets into you. Not through the reasoning, which you
never saw, but through a final answer that looked correct.

AI is very, very good at giving you the 5.

## Two screenshots

Here is a real example. I was working with Claude Opus 5 on some code, and it
had picked a number for when the program should switch to using threads. It
said 200,000 elements. It sounded sure. Then the numbers came back:

![Claude's response: "Crossover is ~30–40K elements, not 200K — and it's noisy right at the boundary. My threshold was 5× too high, leaving the common case inline where threading wins. Correcting it:"](/images/posts/artificial-belief/pic-1.png)
*The first answer was off by five times, and it sounded just as sure as the fix did.*

And another time, after I pushed back on how it had explained something:

![Claude's response: "You're right, and my framing was sloppy. Let me correct it."](/images/posts/artificial-belief/pic-2.png)
*It corrected itself only because I questioned it.*

Look at what happened in both cases. The model fixed its mistake, which is
good. But it fixed it only because something checked it: a measurement in the
first case, and me in the second. If I had half-known the subject, I would
have nodded along and kept the wrong answer. Nothing in the first reply would
have warned me.

## Why this happens

A language model like this writes one word at a time, picking whatever is
most likely to come next. That is a very powerful trick, and it is often
right. But "likely" is not the same as "true," and the model sounds the same
either way. It doesn't sound less sure when it is wrong.

So the confidence you hear tells you nothing. The only thing that tells you
whether it is right is your own knowledge, or a test in the real world.

## Where it costs you

Artificial belief is cheap to pick up and expensive to keep. It sits quietly
in your head until the day it matters: a production system goes down, a
doctor's report needs reading, money is on the line, a decision can't be
undone. That is when you reach for what you "know," and find that part of it
was never really yours.

Half-knowledge doesn't fail when things are easy. It fails at the critical
moment, later in life, when you have the least time to find out.

## Why we need more experts, not fewer

There is a growing idea that we don't need to learn things deeply anymore,
because the AI knows. I think it is the other way around. The better AI gets,
the more we need people who really understand their field, because they are
the only ones who can catch it when it is confidently wrong.

We should not run the things that truly matter, in our own lives or in the
world, by fully trusting a system that predicts the next likely word. Use it,
yes. Hand it the final say on something that can't be undone, no.

## Become the expert, then let AI do the heavy lifting

None of this means "don't use AI." I use it all day. It is the best helper I
have ever had.

But it works best for people who already know the subject. Once you are a
real expert, AI is a huge multiplier: it does the heavy lifting, and you can
spot the 200K-instead-of-30K mistakes in seconds. For someone who half-knows,
the same tool quietly fills their head with things that aren't true.

So learn the thing properly first. Then let the machine help you go faster.
Better to know nothing than to half-know, and best of all, to actually know.
