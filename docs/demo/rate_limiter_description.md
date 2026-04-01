# Rate Limiter — Project Description

> **Give this description to the LLM for both the vibe prompt and the
> PromptKit prompt. Do NOT add any extra context — the point is to see
> how much structure each approach extracts from the same sparse input.**

---

## The Ask

We need a rate limiter for our REST API. It should limit each
authenticated user to a configurable number of requests per time window.
When the limit is exceeded, return HTTP 429 Too Many Requests.
