# Pangolin — Pre-Build Validation Playbook
## 48-Hour Sprint Before Writing Code | May 2026

---

## The Go/No-Go Decision Framework

Before writing any application code, run this scoring exercise at end of Day 2:

| Signal | Score |
|---|---|
| 100+ landing page signups | +2 |
| 40%+ have personal chargeback experience (Typeform Q1) | +2 |
| 5+ interviews completed | +1 |
| 3+ interviewees brought up problem WITHOUT prompting | +3 |
| 1+ client says they would use escrow | +2 |
| No one mentions crypto as dealbreaker | +2 |
| Average commission size over ₱5,000 | +1 |
| Kill signal: client refusal pattern | **-5** |
| Kill signal: "I already solved this with Wise/GCash" | **-3** |

| Score | Decision |
|---|---|
| 10+ | Build Pangolin as planned. Prioritize client onboarding UX above everything. |
| 6-9 | Build Pangolin but add "traditional escrow" mode (Wise/bank) as fallback for non-crypto clients. |
| 3-5 | Build freelancer-side tool only. Skip client crypto requirement for MVP. |
| Below 3 | Pivot to contract + invoice tooling. Still on Stellar, still for PH freelancers, no client crypto requirement. |

---

## Section 1: Unvalidated Assumptions — Risk Assessment

### Assumption 1: "Freelancers will onboard to a crypto wallet to get paid"
**Risk: HIGH — Existential assumption.**

What's NOT yet validated:
- Whether freelancers have ever touched crypto (not just heard of it)
- Whether they understand USDC is stable (not speculative like BTC)
- Whether onboarding friction is dealbreaker vs mild inconvenience
- Whether their clients (often Western, not Filipino) will agree to it

Validate in 48 hours: Post in r/artcommissions and PH Facebook groups: *"If a platform could guarantee you'd never lose a payment to a chargeback, would you switch from PayPal — even if setup took 20 minutes?"* Count yes / "only if my client agrees" / "I don't do crypto."

**Kill signal: >60% say "never used crypto AND not willing to learn."** This is a product-design crisis, not a marketing problem.

---

### Assumption 2: "Clients will deposit crypto instead of using PayPal"
**Risk: HIGH — The harder sell. Clients have no pain. They already have chargeback power.**

What's NOT validated:
- Whether clients know they're abusing chargebacks (some think they're being fair)
- Whether high-quality clients would accept this constraint
- Whether clients frame USDC deposit as "I trust you" vs "I'm being handcuffed"

Validate: DM 10 people who post in r/artcommissions as buyers. Ask 3 questions about their payment dispute process (not "would you use our product"). Ask: *"If a freelancer asked you to deposit payment into escrow before they started, what would you think?"*

**Kill signal: "I'd just find another artist who takes PayPal"** — means Pangolin only works in zero-competition market, which art commissions are not.

---

### Assumption 3: "25-30% minimum guarantee is acceptable to both sides"
**Risk: MEDIUM**

Not validated: Whether 25% feels arbitrary, whether it should scale with project size, whether clients see it as "fair" or "free money for incomplete work."

Validate: Ask in interviews — *"If you started a $200 commission, did half the work, and the client disputed — what dollar amount would feel fair to receive, guaranteed, no questions asked?"* Let them name the number. Don't anchor with 25%.

**Kill signal: Freelancers say "100% or nothing — if I did the work, I deserve full pay."** They won't accept the core mechanic.

---

### Assumption 4: "2.5% platform fee is acceptable"
**Risk: LOW-MEDIUM**

PayPal charges 4.4%+ internationally. Fee is probably fine. What's unvalidated: psychological frame where "victim should not pay." 

Validate: *"If this saved you from one $300 chargeback per year and charged 2.5% per transaction — how many transactions before it pays for itself?"* Make them do the math. If they calculate and still object, fee is the problem. If they go quiet and nod, fee is fine.

---

### Assumption 5: "Filipino freelancers are the right beachhead"
**Risk: MEDIUM**

What's validated: They exist (1.5M registered), design is #1 category, chargebacks hurt them.
What's NOT validated: Whether average commission size is high enough (market of freelancers doing ₱2,000 commissions vs ₱15,000 commissions is very different).

**Kill signal: Average commission under ₱2,000 ($36).** At that size, crypto onboarding friction exceeds value of chargeback protection.

Validate fast: Ask in PH Facebook groups *"What is your average commission size?"*

---

### Assumption 6: "Stellar + USDC is right beyond regulatory safety"
**Risk: LOW for hackathon, MEDIUM post-launch**

What remains unvalidated: Whether Stellar-based wallets (Lobstr, Solar) have enough PH user base to reduce onboarding friction.

Validate: Search "Lobstr Philippines" and "USDC Stellar GCash" on YouTube and Facebook. Filipino tutorials = ecosystem already exists. Absence = you'll need to build on-ramp yourself.

---

## Section 2: The 48-Hour Validation Sprint

### Hour 0-2: Setup

Build simultaneously:
1. **Typeform** (free, 10 min) — 5 validation questions
2. **Carrd landing page** (free, 2 hrs) — value prop + link to Typeform
3. **Team spreadsheet** — columns: Source, Response, Sentiment (Positive/Negative/Neutral), Quote Worth Keeping

**Landing page copy:**

---
**Pangolin — Get Paid. Always.**
*For digital art freelancers tired of PayPal chargebacks.*

- Client deposits payment on-chain before you start
- You receive a guaranteed % even if they dispute
- No chargebacks. No ₱900 dispute fees. No lost work.

[Join the waitlist + help us build this right]

---

### Hour 2-6: Deploy Posts (All Channels at Once)

**r/artcommissions**
Post title: *"PSA: PayPal officially excludes digital services from seller protection — what are you using instead?"*
Do NOT mention your product. Information post + community data. End with: *"We're exploring alternatives — drop a comment if you've been hit by this."* Link in profile or later comment.

**r/Philippines / r/buhaydigital**
Different angle: *"Filipino freelancers — has anyone found a safe way to take international commissions without PayPal chargeback risk?"* Frame as seeking advice.

**Twitter/X — Thread**
Opening: *"PayPal's seller protection excludes digital services. If you're a digital artist taking commissions, you have ZERO protection from chargebacks. Thread with receipts:"*
- Tweet 2: Actual policy language (screenshot)
- Tweet 3: Community quotes about real incidents
- Tweet 4: The ₱900 dispute fee fact
- Final: "We're building a fix. DM if you want early access."

Hashtags: `#DigitalArt #ArtCommissions #FreelanceLife #PhilippineArtists #PinoyArtist`

**Discord (join and wait 24hrs before posting):**
- Artists & Clients Discord (Disboard.org)
- r/artcommissions wiki server list
- Filipino creator servers (search Disboard.org for "Filipino artist")

Post in #rant, #work-talk, or #business-advice: *"Has anyone dealt with PayPal chargebacks for commissions? Researching this for a project and want to hear real experiences."*

**Facebook Groups (Philippines-specific):**
- "Filipino Digital Artists"
- "Philippine Freelancers Association"
- "Digital Art Philippines"
- "Trabahong Online Philippines"
- "OFW Digital Nomads Philippines"

**Post in Filipino (Taglish = higher response rate):**
*"Tanong lang — sino na nakaka-experience ng PayPal chargeback as a digital artist? Gusto ko lang malaman kung malaki ang problema nito sa atin."*

---

### Hour 6-24: DM Campaign

Identify 30 targets:
- Anyone who commented on r/artcommissions chargeback posts in last 6 months
- Filipino artists with 500-10K Twitter followers (micro-influencers respond more)
- Anyone who replied to your posts

**DM script (5 sentences max):**

> "Hey [name] — I saw your comment about the PayPal situation. I'm Lawrence, part of a small team building something for this. We're doing 15-minute calls this week with artists who've dealt with chargebacks. No pitch, just listening. Would you be open to a quick call?"

Target: 30 DMs sent → 8-10 responses → 5 calls scheduled for Day 2.

---

### Hour 24-48: Interviews + Analysis

Run 5 interviews on Day 2 (see Section 5 for questions).
While interviews run, 2 other team members analyze landing page + post responses.

Look for:
- **Exact words** people use to describe the problem → use their language in product copy
- **Objections appearing 2+ times** → real blockers, not outliers
- **Surprise use cases** you didn't anticipate

---

## Section 3: Community Map

### Reddit

| Community | Size | Best Angle |
|---|---|---|
| r/artcommissions | 420K | Primary. Best time: Tue-Thu 10am-2pm US Eastern. |
| r/buhaydigital | Active PH community | Financial pain points, high engagement |
| r/learnart | Younger artists | Planting seeds early |
| r/freelance | Business-focused | Fee/business model feedback |
| r/Philippines | PH-specific | Crypto adoption context, BSP |

---

### Facebook (Philippines)

Search these exact terms, join highest member count with recent activity (<48hr last post):
- "Filipino Digital Artists"
- "Philippine Digital Art Community"
- "Pinoy Freelancers"
- "Work From Home Philippines"
- "Digital Nomad Philippines"
- "Philippine Creatives"
- "Artista Philippines"

**Rule:** Post in Filipino/Taglish. Questions, not announcements.

---

### Twitter/X Hashtags to Monitor

`#ArtCommissions` `#CommissionsOpen` `#PhilippineArtists` `#PinoyArtist` `#FreelanceArtist` `#DigitalArtist`

Search daily. Find payment complaints → reply helpfully FIRST (share PayPal policy info) → THEN mention you're building something. Never lead with the product.

Target accounts: Filipino artists with 1K-15K followers (micro-influencers) who post about commissions. Don't cold-DM large accounts.

---

### Discord

Priority servers:
- Artists & Clients (search Disboard.org — commission-specific)
- r/artcommissions wiki server list
- "Pinoy" Filipino creator communities (search Disboard.org "Filipino artist")

Rule: Be a participant 24 hours before posting anything. Engage genuinely in 2-3 existing threads first.

---

### Local PH Platforms

- **Kumu** — Filipino live streaming, large creator community. Find art-focused channels.
- **TikTok PH** — Search "digital art commission Philippines" — comments on these videos are research gold.
- **Facebook Live** — Filipino artists do commission livestreams. Engage in chat.

---

## Section 4: Typeform Validation Questions

*5 questions max. In this order:*

**Q1 (Behavioral — not attitudinal):**
"Have you personally experienced a PayPal chargeback or payment dispute in the last 12 months?"
- Yes, lost money
- Yes, but recovered it
- No, but I know someone who has
- No, never

**Q2 (Sizing the pain):**
"How much money have you lost to chargebacks or non-payment in the last year?"
- Nothing yet
- Under ₱5,000
- ₱5,000–₱20,000
- Over ₱20,000
- I don't take PayPal anymore because of this

**Q3 (Crypto barrier — CRITICAL):**
"Have you ever used a crypto wallet or received cryptocurrency?"
- Never, and not interested
- Never, but I'd try it if it meant getting paid safely
- Yes, casually (bought BTC or ETH once)
- Yes, I use it regularly

**Q4 (Willingness to pay — indirect):**
"PayPal charges about 4.4% on international transactions. If a safer platform charged 2.5% with escrow protection, what would you do?"
- Switch immediately
- Switch once my clients agree
- Probably stay with PayPal (too complicated)
- Depends on how easy it is

**Q5 (Open text — most valuable field):**
"What's the ONE thing about getting paid for commissions that stresses you out the most?"
*(Free text — read every single answer, use their exact words in product copy)*

Then: Email field + "Notify me when Pangolin launches."

---

## Section 5: Interview Questions (The Mom Test)

### For Freelancers

Ask about **past behavior**, not future intention. Never ask "would you use our product."

1. "Walk me through the last time you took a commission from someone you didn't know. How did you handle payment?"
2. "Have you ever started work before receiving payment? What happened?"
3. "Tell me about a commission that went wrong. What did you do?"
4. "When a client goes silent, what do you do? Have you ever lost money this way?"
5. "How do you decide whether to trust a new client? What signals do you look for?"
6. "Have you ever turned down a commission because of payment uncertainty? What made you say no?"
7. "Have you ever used anything other than PayPal for international commissions? Why or why not?"
8. "When you get paid, what do you do with it — GCash, bank, directly to expenses?" *(Reveals on-ramp/off-ramp needs)*
9. "If you knew a client was going to dispute — not if, but when — what would you do differently at the start?"
10. "What do other artists in your circle use to get paid? Do you compare notes on this?" *(Reveals referral dynamics)*

### For Clients Who Hire Freelancers

1. "How do you usually find artists? Walk me through your last commission hire."
2. "How do you decide how much to pay upfront versus after seeing the work?"
3. "Have you ever been disappointed with a commission? What did you do?"
4. "Have you ever filed a dispute or chargeback for digital art? What happened?"
5. "When an artist asks for full payment upfront, what goes through your mind?"
6. "Have you ever lost money to an artist who disappeared after your deposit?"
7. "If your money was locked and the artist could only access it when you approved — more or less willing to pay upfront?"
8. "How important is being able to get a refund if you're unhappy with the work?"
9. "If an artist insisted on a payment method you hadn't heard of, would you still work with them?"
10. "What would make you trust a new artist enough to pay before seeing the final work?"

---

## Section 6: The Riskiest Assumption

**Single riskiest assumption: Clients will agree to use Pangolin.**

This is riskier than the crypto onboarding assumption because:
- Crypto onboarding = UX problem. Solvable with better design.
- Client unwillingness = behavior problem. Cannot be designed away.

The freelancer's adoption is driven by pain. The client has no pain. They already have a system that works in THEIR favor. Chargebacks are their safety net. You're asking them to voluntarily give it up.

If clients refuse → freelancers can't force them → freelancers lose gig to someone who accepts PayPal → product has no supply-side forcing function.

**Validate in 48 hours:**

Step 1: Post in r/artcommissions from client perspective (secondary account): *"Freelancers — if you required me to use an escrow platform instead of PayPal, would you lose me as a client?"* Read freelancer responses about how they'd handle it.

Step 2: DM 10 "looking for artist" / "commission request" posters: *"Quick question — if an artist you liked said they only accept escrow payment now, not PayPal, would you work with them?"*

Step 3: Check Escrow.com and Contra for client reviews — are clients saying "too complicated" or "I liked that it protected both of us"?

**Strong validation:** 6 of 10 DMs say "yes, I'd use escrow if artist required it" OR "I've already used escrow and prefer it."

**Kill signal:** 7 of 10 say "I'd just find another artist who takes PayPal."

**If assumption fails — Pivot Option:** Freelancer-only tooling. Contract + invoice platform with built-in DMCA-ready legal protection language, terms of service generator. Does NOT require client participation. Monetize freelancer side through premium tiers. Still on Stellar, still for PH freelancers.

---

## Section 7: Signal Interpretation

### Landing Page Signups (48 hours)

| Result | Interpretation |
|---|---|
| 200+ signups + 40%+ have personal chargeback | Strong signal |
| 80-200 signups + high DM/comment engagement | Moderate signal |
| Under 40 signups BUT strong qualitative interviews | Weak — pivotable |
| Under 20 signups + no organic sharing + client refusal pattern | Kill signal |

*Hackathon niche landing pages without paid promo typically get 50-150 signups. Quality > quantity.*

### Interview Responses

**Build immediately:**
- Interviewees bring up chargeback problem WITHOUT you mentioning it
- They ask "when is this available?" before you finish explaining
- They describe crypto onboarding as "annoying but worth it"
- They volunteer to beta test or refer friends

**Build but modify:**
- Understand the problem but reservations about crypto
- Like escrow but want traditional payment options too
- Would use it "for big commissions only"

**Revisit core assumptions:**
- Heard of the problem but it hasn't personally happened to them
- Have workarounds that already mostly work (50% upfront via GCash is common in PH)
- Like the idea but wouldn't pay 2.5%

**Kill signal — pivot:**
- Every client interviewee says they wouldn't use a platform the freelancer chose
- Freelancers say real problem is getting clients, not getting paid
- Multiple people already solved this with Wise/bank transfer

### The "Already Solved It" Quiet Kill Signal

Sounds like: *"Oh, I just don't take PayPal anymore for international clients. I use Wise now and it works fine."*

If 3 of 5 interviews say this → the problem is real but the market has self-selected away from PayPal. Your addressable market = new/inexperienced freelancers, not the experienced core community. Different product, different GTM, different revenue model.

---

## Day-by-Day Validation Execution

| Day | Actions |
|---|---|
| **May 18 (Morning)** | Set up Carrd + Typeform (2 hrs). Post to all Reddit communities + join Facebook groups. Send 30 DMs. Post Twitter thread. Join Discord servers, engage in 5 existing threads. |
| **May 19 (Morning)** | Run 3 interviews via Google Meet (15 min each, record with permission). Review all Typeform responses. |
| **May 19 (Afternoon)** | Run 2 more interviews. Team debrief — Go/No-Go scoring exercise. |
| **May 19 (Evening)** | Lock MVP scope for Days 3-7 based on validation findings. |
| **May 20+** | Build with confidence. Reference interview quotes in demo. "We interviewed 15 people and here is what they said" = major credibility with judges. |

---

*The biggest mistake hackathon teams make is treating validation as optional pre-work. It is actually the highest-leverage 48 hours of your week — because it tells you which 80% of features to skip.*

---

## References

### Internal Source Documents

These files are in the `source-documents/` folder and contain the primary data inputs used in this analysis:

- **`source-documents/Payment_Platforms_Comparison_Why_They_Fail_Freelancers.md`** — Platform-by-platform protection gaps that directly define the 6 unvalidated assumptions: PayPal chargeback policy (Assumptions 1 & 2), GCash dispute parity with PayPal (Assumption 2), Vgen fee structure and no-milestones limitation (Assumption 4 context), RaketPH zero-protection status. The verbatim post scripts and DM templates in this playbook cite PayPal policy language sourced from this document.
- **`source-documents/Pangolin_Initial_Business_Analysis_And_SafeVault_Concept.md`** — Original business assumptions (escrow model, two-sided trust gap, user types) that this playbook is designed to validate or kill before code is written.
- **`source-documents/Hackathon_Rules_Schedule_And_Judging_Criteria.md`** — 7-day hackathon timeline (May 18–24, 2026) that defines the 48-hour validation window constraint; Day 1 Launch Day schedule that the validation sprint is mapped against.

---

### External Sources

1. Payoneer Global Freelancer Income Report 2022–2023 — 1.5M PH freelancers baseline; design as #1 skill category (used in Assumption 5 validation framing)
2. PayPal Seller Protection Policy (official PayPal policy page) — Digital and intangible services exclusion clause used verbatim in validation post scripts and DM templates
3. r/artcommissions (subreddit public stats) — 420K+ members; chargeback post frequency (primary validation community target)
4. Chainalysis Global Crypto Adoption Index 2023 — Philippines crypto accessibility data supporting Assumption 6 (Stellar + USDC viability)
5. Rob Fitzpatrick, "The Mom Test" (2013) — Interview methodology framework: ask about past behavior not future intent; never ask "would you use our product" — applied throughout Section 5 interview questions
6. Escrow.com and Contra — Referenced in Section 6 (Riskiest Assumption) for client-side review research validation step
