# Infrastructure Cost Overview

Event: Walking event Aug 29 2026, ~500 users
Audio: 5 files × 7MB = 35MB per user → ~17.5 GB total bandwidth

## Vercel Hobby (Free)

| Metric | Free Limit | Estimated Usage | Overage Cost |
|---|---|---|---|
| Bandwidth | 100 GB/month | ~17.5 GB | $0.15/GB |
| Serverless Functions | 100 GB-hrs/month | Minimal | Upgrade to Pro ($20/mo) |
| Build minutes | 6,000/month | Minimal | Upgrade to Pro ($20/mo) |
| Deployments | Unlimited | — | — |
| CDN / Edge Network | Included | Included | — |

## Supabase Free

| Metric | Free Limit | Estimated Usage | Overage Cost |
|---|---|---|---|
| Database storage | 500 MB | ~1 MB (500 rows) | Upgrade to Pro ($25/mo) |
| Egress bandwidth | 2 GB/month | ~1 MB (registration writes only) | Upgrade to Pro ($25/mo) |
| Monthly active users | 50,000 | ~500 | Upgrade to Pro ($25/mo) |
| Project pausing | After 1 week inactivity | **Risk if idle before Aug 29** | Upgrade to Pro ($25/mo) |

> Supabase free has no per-unit overages — hitting any limit requires upgrading to Pro at $25/month flat.

## Resend (Free)

Used for sending registration confirmation emails to subscribers.

| Metric | Free Limit | Estimated Usage | Overage Cost |
|---|---|---|---|
| Emails per month | 3,000 | ~500 (one per registration) | Upgrade to Pro ($20/mo) |
| Emails per day | 100 | Low (spread over weeks) | — |
| Custom domain | Included | Included | — |

> 500 registration emails is well within the free tier. No cost expected.

## Map tiles — CARTO / OpenStreetMap (Free)

The walking route map uses CARTO's tile layer, which is free for non-commercial use.
OpenStreetMap data is open source. No cost.

## Domain name — indeschaduwvandeooievaar.be

| Period | Cost |
|---|---|
| Year 1 (paid) | €14.79 |
| Year 2 (renewal) | ~€12–15 |
| Year 3 (renewal) | ~€12–15 |
| 5-year total (estimate) | ~€65–75 |

> Renewal price depends on the registrar. Typically slightly cheaper than the first year (no setup fee). Check your registrar for exact renewal pricing.

## Bottom line

| Service | Monthly cost | Notes |
|---|---|---|
| Vercel | €0 | Free tier sufficient |
| Supabase | €0 | Free tier sufficient — see risk below |
| Resend | €0 | Free tier sufficient |
| CARTO / OpenStreetMap | €0 | Free for non-commercial use |
| Domain | ~€1.25/month | Averaged over 1 year (€14.79) |
| **Total** | **~€1.25/month** | **= €14.79/year** |

Worst case (Supabase Pro for 1 month around the event): **+€25 one-time**.

## Key risk

Supabase pauses free projects after 1 week of inactivity. If registrations close well
before Aug 29 and no one touches the DB, it will be asleep on event day. Options:

- Upgrade to Supabase Pro ($25) the week before the event and cancel after.
- Manually open the Supabase dashboard the morning of the event to wake it up.
