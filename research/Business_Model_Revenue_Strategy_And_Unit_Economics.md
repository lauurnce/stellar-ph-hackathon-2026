# Pangolin — Business Model & Unit Economics
## Revenue Strategy Deep Dive | May 2026

---

## The Three Numbers That Win the Pitch

**9.4%** — What Vgen charges today. The status quo.
**2.5%** — What Pangolin charges. 75% cheaper. More protection. On-chain.
**$0** — What PayPal gives freelancers in seller protection for digital work.

---

## Revenue Stream Analysis

### Recommended by Phase

| Phase | Model | Rationale |
|---|---|---|
| **Hackathon MVP** | Pure 2.5% transaction fee | Simple, credible, buildable in 7 days, explainable to judges |
| **12-month post-hackathon** | Transaction fee + Pro tier at Month 9 | Add subscriptions after trust is built |
| **3-year scale** | Transaction fee + Pro + B2B API | Platform becomes infrastructure |

---

### Option A: Transaction Fee Only (2.5%) — RECOMMENDED FOR HACKATHON

**Pros:**
- Value-aligned: users pay only when transaction succeeds
- One sentence to explain: "We take 2.5%"
- Scales linearly with GTV
- Implementable in smart contract at release step
- Revenue from Day 1, no user commitment required

**Cons:**
- No recurring revenue base (unpredictable cash flow)
- High-volume users will eventually comparison-shop subscriptions

**Verdict: Start here. Only viable hackathon model.**

---

### Option B: Tiered Subscription — Year 2 Only

Free tier: basic escrow, limited transactions
Pro tier ($12/month): unlimited, 1.5% fee, priority dispute support, milestone splits

**Not for MVP.** Subscription friction kills early conversion. Art commissions are lumpy (big project then nothing for weeks) — subscriptions punish irregular earners.

---

### Option C: Split Fee (Client pays X%, Freelancer pays Y%)

**Skip for MVP.** Charging the freelancer any portion damages core narrative ("you always get exactly what was agreed"). More complex smart contract logic.

**If used later:** Client pays 2.0%, Freelancer pays 0.5%.

---

### Option D: Freemium + Premium Features — Year 2-3

Premium features to build over time:
- Milestone-based multi-release contracts
- File delivery hosting (replaces WeTransfer links)
- On-chain reputation scores / NFT credentials
- Priority dispute arbitration
- Transaction receipt PDFs

**Never lead with freemium.** Free escrow = zero revenue until upgrade, burns runway, trains users that escrow has no cost.

---

### Option E: EaaS — Escrow-as-a-Service B2B API — Year 3

**Revenue structure:**
- Starter: $99/month (500 escrows/month)
- Growth: $299/month (5,000 escrows/month)
- Enterprise: $999+/month (white-label, unlimited)

**This is your 3-year exit narrative.** Mention in pitch roadmap slide. Don't build it now. One enterprise client = $12,000/year ARR. Platform companies command far higher valuation multiples.

---

## Unit Economics

### Revenue per Transaction

```
Transaction value:       $150.00
Pangolin fee (2.5%):     $3.75
Freelancer receives:     $146.25
Stellar network fee:     ~$0.00001 (essentially zero)
```

**Revenue per transaction: $3.75**

---

### Cost per Transaction

| Cost Item | MVP | Post-MVP (with AML/fraud) |
|---|---|---|
| Stellar ledger fees | $0.00002 | $0.00002 |
| Database writes | ~$0.002 | ~$0.002 |
| Email notification | ~$0.001 | ~$0.001 |
| Cloud compute | ~$0.003 | ~$0.003 |
| AML/fraud check | — | ~$0.05 |
| Dispute reserve provision | — | ~$0.10 |
| **Total variable cost** | **~$0.006** | **~$0.15** |

**Fixed monthly costs (MVP, 0-500 users): $11.50/month** (Vercel free, Railway $10, domain $1.50)

---

### Gross Margin

| Phase | Revenue | Variable Cost | Gross Margin |
|---|---|---|---|
| Year 1 MVP | $3.75 | $0.006 | **99.8%** |
| Year 2 (with AML) | $3.75 | $0.15 | **96.0%** |

Stripe operates at 20-25% gross margin (pays interchange + bank fees). Pangolin's Stellar-native architecture eliminates that entire cost layer.

---

### Customer Acquisition Cost (CAC)

| Channel | Estimated CAC |
|---|---|
| Twitter/X organic (art community posts) | $0 |
| Filipino freelancer Facebook groups | $0 |
| Discord server partnerships | $0–5 |
| Referral program | $1–3 |
| Paid social (Facebook/IG) | $8–15 |
| Content marketing (YouTube tutorials) | $2–5 amortized |

**Blended CAC: $5.00** (80% organic at $1, 20% paid at $12)

*One post in a 50K-member Filipino freelancer Facebook group can generate 200+ signups at effectively zero cost.*

---

### Lifetime Value (2-Year LTV)

**Assumptions:**
- 3 commissions/month per freelancer
- 60% adoption rate (not every client agrees to crypto)
- 1.8 Pangolin transactions/month at $150 each
- Monthly revenue per user: $270 × 2.5% = **$6.75**
- Monthly churn rate: 3%

```
LTV = $6.75 × (1 - 0.97^24) / 0.03
LTV = $6.75 × 17.2
LTV = $116.10
```

| User Type | 2-Year LTV |
|---|---|
| Standard freelancer | $116 |
| Power user ($500/month through Pangolin) | $215 |
| Pro tier subscriber (Year 2+) | $260 |

---

### LTV:CAC Ratio

| Scenario | LTV | CAC | Ratio |
|---|---|---|---|
| Conservative base | $116 | $5 | **23.2:1** |
| Paid growth | $116 | $12 | **9.7:1** |
| Pro tier Year 2 | $260 | $5 | **52:1** |

Industry benchmark is 3:1. Pangolin exceeds it by 7×.

**Pitch statement:**
> "At a $5 CAC and $116 LTV, every dollar we spend on acquisition returns $23 in lifetime revenue — far above the 3:1 fintech benchmark — driven by near-zero Stellar transaction costs and deeply networked art communities."

---

## Pricing Strategy

### Why 2.5% is the Optimal Fee

| Fee | Revenue on $150 | Assessment |
|---|---|---|
| 1.0% | $1.50 | Too low |
| 1.5% | $2.25 | Viable but tight margin |
| **2.5%** | **$3.75** | **Sweet spot** |
| 3.0% | $4.50 | Acceptable upper bound |
| 4.0%+ | $6.00+ | Users ask "why not just PayPal?" |

**Why 2.5% wins:**
1. **Beats PayPal on price AND protection.** PayPal: 2.9% + $0.30 = $4.65 on $150 (3.1% effective). Pangolin is cheaper + gives protection PayPal explicitly excludes.
2. **Crushes Vgen on price.** Vgen: 9.4-10.4% = $14.10 minimum. Pangolin = 4× cheaper.
3. **99%+ gross margin.** Room to absorb disputes, run promotions, invest in growth.
4. **Psychologically simple.** "$150 project = $3.75 fee." Users calculate in their head.
5. **Room for Pro discount.** Starting at 2.5% allows Pro tier at 1.5% — a 40% savings.

---

### Who Pays the Fee?

**Recommendation: Client pays, added on top of agreed price.**

```
Project price agreed:     $150
Client deposits:          $153.75 ($150 + 2.5%)
Freelancer receives:      $150.00 exactly
Pangolin earns:           $3.75
```

**Why:** Freelancers are fee-sensitive from every platform they use. Pangolin's positioning = "freelancer always gets exactly what was agreed." Never call it a "commission cut" — frame as "transaction protection fee" added to client total.

---

### Competitor Positioning Table

| Method | Fee on $150 | Seller Protection | Min Guaranteed Payment |
|---|---|---|---|
| PayPal | $4.65 (3.1%) | ZERO for digital work | No |
| Vgen | $14.10–15.60 (9.4–10.4%) | Yes (simple art only) | No |
| Escrow.com | $25 minimum or 3.25% | Yes | No |
| **Pangolin** | **$3.75 (2.5%)** | **Yes, on-chain** | **Yes — code enforced** |

**Competitive narrative:** "PayPal is cheaper but zero protection. Vgen has protection but 4× the fee. Pangolin is the only platform both cheaper than PayPal AND stronger protection than Vgen — with the world's first on-chain minimum payment guarantee."

---

### Price Anchoring for the Pitch

**The Loss Anchor:**
"Average freelancer loses $150 per disputed project. 1-2 chargebacks/year = $300 lost annually. Pangolin's 2.5% fee on those projects would have cost $7.50. Protection is worth 40× the fee."

**The Competitor Anchor:**
"Freelancer doing $3,000/month in commissions pays $282/month on Vgen. On Pangolin: $75/month. Pangolin saves $2,484/year — enough to buy professional art equipment every year, purely from the fee difference."

**The Scale Anchor:**
"1% of SEA's 1.45M digital art freelancers × 2 transactions/month × $150 = $87M annual GTV. At 2.5%: $2.18M annually from just 1% penetration."

---

## The Minimum Guarantee % as Business Lever

### Recommended Default: 20% (User-Configurable: 10%–50%)

| Minimum % | Client Willingness | Freelancer Confidence | Dispute Deterrence |
|---|---|---|---|
| 5–10% | Very high | Low | Weak |
| **15–25%** | **High** | **Good** | **Meaningful** |
| 30–40% | Moderate | High | Strong |
| 50%+ | Low (feels like upfront payment) | Very high | Maximum |

**Why 20% is the sweet spot:**
On $150 project: 20% = $30 guaranteed. Deters bad-faith disputes (client still loses $30). Covers concept/sketch phase — most vulnerable creative period. Psychologically equivalent to a "non-refundable deposit" — concept both parties already understand.

**Framing:** Not "money you might lose" but "your project commitment percentage — the amount that goes to the artist for starting work, regardless of outcome."

---

### Should Pangolin Take a Cut of the Minimum Guarantee?

**No. Absolutely not.**

The 2.5% fee is collected once when client deposits the full escrow amount. This covers all scenarios.

```
$150 escrow — Pangolin fee collected upfront: $3.75
Minimum guarantee triggers at 20%:
  Freelancer receives:    $30
  Client receives back:   $116.25 ($150 - $30 - $3.75)
  Pangolin earned:        $3.75 (same as successful transaction)
```

This makes disputes revenue-neutral for Pangolin — no perverse incentive to trigger disputes.

---

### Minimum Guarantee as Retention Flywheel

Freelancers who experience even one successful minimum guarantee payout (bad-faith client disputes, Pangolin enforces the floor) become platform evangelists. They post in art communities. One genuine "I would have lost $200 but Pangolin paid me $40" story = 10× any Facebook ad.

**Year 1 campaign:** "The Floor Stories" — collect testimonials from protected freelancers. Authenticity converts far better than advertising in art communities.

---

## Moat & Defensibility

### What Prevents Vgen or PayPal from Copying?

**Vgen cannot copy because:**
1. **Blockchain rebuild required.** Integrating Stellar + USDC + smart contracts = 12-24 month engineering project, not a sprint.
2. **Minimum guarantee creates legal liability for centralized platforms.** A policy denying 100% refunds creates consumer protection risk under traditional payment law. A smart contract enforcing it is math, not a corporate decision. Vgen faces legal risk Pangolin sidesteps.
3. **Product architecture mismatch.** Vgen optimized for simple single-asset commissions. Milestone escrow with on-chain settlement requires ground-up rebuild.

**PayPal cannot copy because:**
1. **Their model depends on unconditional buyer protection.** Introducing "no full refunds" would require SEC disclosures, bank renegotiations, mass customer complaints. Years of risk they won't take.
2. **Their fees cannot come down.** PayPal's 2.9%+ pays interchange, bank fees, fraud reserves. Cannot price like Pangolin without losing money per transaction.
3. **Philippines is low-priority.** Limited payout support in PH. Pangolin is building natively for this market while PayPal's attention is elsewhere.

---

### Network Effects That Build Over Time

**Layer 1 — On-Chain Transaction History (Immediate)**
Every Pangolin escrow = permanent Stellar record. Freelancer with 50 successful escrows has immutable portfolio of verified completions. Cannot be faked or deleted.

**Layer 2 — Reputation Scores (Month 9+)**
"Pangolin Trust Score" = dispute rate, completion rate, avg project value, response time. Portable credential. Freelancers include in Twitter bios: "98% completion rate | 0 disputes | Verified on Pangolin." Self-reinforcing — freelancers market Pangolin by using their credential.

**Layer 3 — Commission Market Data (Year 2+)**
Most comprehensive dataset on digital art commission pricing in SEA. Powers: fair pricing advice, fraud models, future insurance products, industry research partnerships.

**Layer 4 — Two-Sided Network Effects (Year 2+)**
More verified freelancers → more clients willing to use Pangolin. More verified clients (low dispute rate) → more freelancers willing to take clients via Pangolin.

**The Reputation Moat:**
A freelancer's on-chain Pangolin history is tied to their Stellar wallet address — not their Pangolin account. Even if a superior competitor launches, the freelancer cannot take reputation elsewhere. Starting over on a competing platform = zero history. Same moat Airbnb has over hosts — years of reviews don't transfer.

---

## Financial Model — Hackathon Pitch Numbers

### Key Assumptions

| Assumption | Value |
|---|---|
| SAM (SEA art freelancers) | 1.45M |
| Average commission value | $150 |
| Pangolin Year 1 adoption | 0.1% of SAM = 1,450 users |
| Transactions per user per month | 1.5 |
| Pangolin fee | 2.5% |
| Monthly churn | 3% |
| CAC | $5 |

---

### Year 1 Revenue Projection (Conservative)

| Month | Active Users | Monthly GTV | Monthly Revenue |
|---|---|---|---|
| 1 | 50 | $11,250 | $281 |
| 3 | 220 | $49,500 | $1,238 |
| 6 | 700 | $157,500 | $3,938 |
| 9 | 1,180 | $265,500 | $6,638 |
| 12 | 1,450 | $326,250 | **$8,156** |

**Year 1 Totals:**
- Total GTV: $2,074,000 (~₱118.2M)
- Total revenue: **$51,850** (~₱2.96M)
- Year-end monthly run rate: $8,156/month (~₱465K/month)
- Annualized run rate (December): $97,872

---

### Year 3 Revenue Projection

**Assumptions:** 1% SAM penetration (14,500 users), avg $175 transaction, 2.0% fee, 15% on Pro at $15/month, 5 B2B API clients

| Stream | Monthly Revenue |
|---|---|
| Transaction fees | $126,875 |
| Pro subscriptions (14,500 × 15% × $15) | $32,625 |
| B2B API licenses (5 × $299) | $1,495 |
| **Total** | **$160,995** |

**Year 3 Annual Revenue: $1,931,940 (~₱110.1M)**
**Conservative (50% of aggressive): $965,970**

---

### Break-Even Analysis

**Monthly fixed costs at MVP scale: $11.50** (Vercel free, Railway $10, domain $1.50)

```
Break-even transactions = $161.50 / $3.75 = 43 transactions/month
At 1.5 tx/user/month = 29 active users needed
```

Even with $595/month realistic operating costs:
```
$595 / $3.75 = 159 transactions = 106 active users
```

**Pangolin breaks even within 60-90 days of launch.**

---

### Funding Requirements

**Scenario 1: Bootstrapped**
- Team defers salaries 6 months
- Infrastructure + marketing: ~$2,200 total
- Month 6 revenue covers all costs
- **Profitable for under $3,000**

**Scenario 2: Seed Funding**

| Use of Funds | Amount |
|---|---|
| 1 full-time growth/community hire (12 months) | $18,000 |
| Paid acquisition (Facebook/IG) | $12,000 |
| Legal and BSP/VASP compliance | $5,000 |
| Technical infrastructure scaling | $3,000 |
| Operational buffer | $2,000 |
| **Total Seed Ask** | **$40,000** |

With $40K seed: 3,000 active users by Month 12 (vs 1,450 bootstrapped), $202,500 annualized ARR.

**Pitch ask slide:**
> "We are raising $40,000 in seed funding to accelerate community growth and build our Pro tier. At LTV:CAC of 23:1, every dollar invested in acquisition returns $23 in lifetime revenue. Break-even at 110 active users — approximately 90 days."

---

### The Math Slide (Maximum Impact, One Slide)

```
$3,000/month in commissions:
  On Vgen:      $282/month in fees → $3,384/year to the platform
  On PayPal:    $90/month in fees + zero seller protection
  On Pangolin:  $75/month in fees + on-chain protection + minimum guarantee

Switching to Pangolin from Vgen saves $2,484/year.
That is a Cintiq tablet. Every single year.
```

---

### Quick Reference — All Numbers for Pitch Deck

| Metric | Value |
|---|---|
| Pangolin fee | 2.5% |
| Revenue per $150 transaction | $3.75 |
| Gross margin | ~99% |
| CAC (blended) | $5 |
| LTV (2-year, conservative) | $116 |
| LTV:CAC ratio | **23:1** |
| Break-even active users | ~110 |
| Break-even month | Month 3 |
| Year 1 annual revenue | $51,850 (~₱2.96M) |
| Year 1 end monthly run rate | $8,156 (~₱465K/month) |
| Year 3 conservative revenue | $966K (~₱55M) |
| Year 3 aggressive revenue | $1.93M (~₱110M) |
| Seed ask | $40,000 |
| Default minimum guarantee % | 20% |
| Vgen competitor fee | 9.4–10.4% |
| Pangolin fee advantage vs Vgen | **75% lower** |

---

### The 3-Year Exit Narrative

> "In 3 years, Pangolin becomes the escrow layer for all digital creative work in Southeast Asia — not just art commissions. We expand from visual art to music production, video editing, voice acting, and game asset creation. We open our API to platforms like RaketPH, Discord bot developers, and regional freelance marketplaces. At $2M ARR with 10+ B2B integrations, Pangolin is positioned for strategic acquisition by a regional fintech player — GCash, Maya, or Sea Group — or a Series A to build toward $20M ARR as the Stripe for creative freelancers in Southeast Asia."

---

## References

### Internal Source Documents

These files are in the `source-documents/` folder and contain the primary data inputs used in this analysis:

- **`source-documents/Payment_Platforms_Comparison_Why_They_Fail_Freelancers.md`** — Vgen fee structure (9.4–10.4%) used as the primary competitor benchmark throughout pricing strategy; PayPal fee data (2.9% + $0.30, effective 3.1% on $150) used in the competitor positioning table; Etsy and RaketPH data supporting the competitive narrative.
- **`source-documents/Pangolin_API_Stack_Recommendations_KYC_AML_Blockchain.md`** — AML/fraud detection API providers (Chainalysis, TRM Labs) that inform the post-MVP AML cost estimates (~$0.05/transaction) in the unit economics section.
- **`source-documents/Pangolin_Initial_Business_Analysis_And_SafeVault_Concept.md`** — Original escrow model, dispute management framework, and revenue concept that the unit economics model is built upon.

---

### External Sources

1. Stellar Development Foundation — Stellar ledger transaction fee (~$0.00001 per operation) used in cost-per-transaction breakdown
2. Stripe public pricing — 2.9% + $0.30 per transaction; 20–25% gross margin benchmark cited in gross margin comparison
3. Escrow.com public pricing — $25 minimum or 3.25% fee used in competitor positioning table
4. Payoneer Global Freelancer Income Report 2022–2023 — SAM of 1.45M SEA digital art freelancers; Philippines #3 globally
5. Chainalysis Global Crypto Adoption Index 2023 — 55% SEA crypto-accessible rate used in SAM calculation
6. Industry LTV:CAC benchmarks — 3:1 standard fintech ratio; Pangolin 23:1 compared against this
7. GCash/Maya adoption data — 15–25% Y1 adoption rate benchmark for digital payment products in Philippines
8. Vgen platform statistics 2024 — 250K artists in ~3 years used as SOM adoption benchmark
