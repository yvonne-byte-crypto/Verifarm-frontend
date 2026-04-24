# 🌾 VeriFarm

> The trust bridge between smallholder farmers and lending 
> institutions in East Africa — verifying assets on one side, 
> delivering confident lending decisions on the other, and 
> managing the full loan lifecycle on-chain until every loan 
> is repaid.

![Solana](https://img.shields.io/badge/Solana-Devnet-9945FF?style=flat&logo=solana)
![Anchor](https://img.shields.io/badge/Anchor-0.31.0-blue)
![Tests](https://img.shields.io/badge/Tests-37%20Passing-brightgreen)
![Status](https://img.shields.io/badge/Status-Live%20on%20Devnet-brightgreen)
![Built With](https://img.shields.io/badge/Built%20with-Claude%20Code%20%2B%20solana.new-orange)

---

## 🔭 What VeriFarm Actually Is

DeFi cannot lend to farmers because it cannot see their assets.
Land and livestock exist in the physical world with no on-chain
representation. VeriFarm is the oracle layer that fixes this.

We deploy a distributed network of field verification nodes —
agents on the ground who read physical farms and write trusted,
permanent attestations to Solana:

- 📍 GPS land boundary polygons — hashed and stored on-chain
- 🐄 Livestock counts — unique QR/RFID tag per animal
- 🌧️ Environmental data — rainfall index, soil conditions
- 👤 Identity verification — field agent signature + SOL stake

**This is a two-sided platform:**
- Farmers apply via USSD on any basic phone in English or Swahili
- Lenders access verified borrower profiles with explainable AI scores

The agricultural lending product is the first application of
this data layer. The oracle network is the actual innovation.

---

## 🌍 The Problem

In Tanzania and Kenya, millions of smallholder farmers own real
value — land, livestock, crops. But they have no formal records,
no verification system, and no on-chain representation of assets.

Banks cannot lend to them — not because they have nothing, but
because their assets are invisible to financial infrastructure.

**This is a problem I have seen firsthand, back home in Tanzania.**

---

## 💡 The Solution

```
Physical Farm Assets
        ↓
Field Verification Nodes (GPS + RFID + Agent SOL stake)
        ↓
On-Chain Attestations (Solana Anchor Program)
        ↓
AI Risk Scoring with Full Explainability
        ↓
Licensed MFI Partners (regulated capital)
        ↓
Loan Disbursement → Farmer (USSD + M-Pesa)
```

**Capital model:** VeriFarm provides verification and scoring
rails — licensed MFIs and SACCOs in Kenya and Tanzania provide
regulated capital. VeriFarm earns an oracle attestation fee per
verified farmer.

---

## 🖥️ Live Demo

**Dashboard:** [verifarm-frontend.vercel.app](https://verifarm-frontend.vercel.app)

**Solana Program:** [View on Explorer](https://explorer.solana.com/address/9teMVR4r2AB9T5bB4YgXJ38G6mMbxTF6bFm8UYizqx8N?cluster=devnet)

**Backend Repo:** [Verifarm-backend](https://github.com/yvonne-byte-crypto/Verifarm-backend)

**USSD Server:** [verifarm-ussd](https://github.com/yvonne-byte-crypto/verifarm-ussd)

---

## ⛓️ On-Chain Program

**Program ID:** `9teMVR4r2AB9T5bB4YgXJ38G6mMbxTF6bFm8UYizqx8N`
**Network:** Devnet
**Tests:** 37 bankrun tests passing

| Instruction | Description |
|---|---|
| `register_farmer` | Creates PDA per farmer with GPS coordinates |
| `declare_assets` | Farmer submits land + livestock data |
| `verify_farmer` | Field node writes GPS boundary hash on-chain |
| `tag_livestock` | Unique on-chain ID per animal — anti-fraud |
| `update_risk_score` | Oracle writes explainable score on-chain |
| `apply_for_loan` | Enforces 50% LTV — reflects asset illiquidity |
| `approve_loan` | MFI partner sets rate and approves |
| `disburse_loan` | USDC vault disbursement |
| `record_repayment` | Tracks payments + adjusts score |
| `flag_default` | Marks default + penalises score |
| `register_agent` | Agent stakes SOL to become verified node |
| `dispute_verification` | Flags a verification as fraudulent |
| `confirm_dispute` | Admin confirms fraud — triggers slash |
| `withdraw_stake` | Agent in good standing withdraws stake |

---

## 🛡️ Anti-Fraud: Agent Staking

Field agents must stake SOL on-chain before submitting any
verification. If they submit fraudulent data:

1. Any authorised party can call `dispute_verification`
2. Admin reviews and calls `confirm_dispute`
3. Agent's staked SOL is slashed to protocol treasury
4. Agent account is suspended — cannot submit further verifications

**Economic deterrent:** The cost of staking across a colluding
ring exceeds the fraudulent loan value at 50% LTV.

World ID IDKit widget integrated for agent registration 
UX — server-side proof verification scoped for 
production deployment

---

## 🤖 AI Risk Scoring — Fully Explainable

```
Score Breakdown — Amina Juma, Dodoma:

📐 Farm Size (5 acres — verified)      +28 pts  ✅
🐄 Livestock Health (verified on-site) +32 pts  ✅
💳 Repayment History (first loan)      ±0  pts  ➖
🌧️ Rainfall Index (below average)     -8  pts  ❌
────────────────────────────────────────────────
Total: 85 / 100 — Low Risk — Approved
Max Loan: TZS 420,000 at 50% LTV
```
Scores are decomposed into four weighted factors: GPS 
polygon quality, attestation age, agent stake history, 
and M-Pesa repayment record — displayed as a visual 
breakdown per borrower profile on the lender dashboard.

---

## 🏦 Lender Dashboard Features

- **Portfolio KPIs** — live on-chain data + demo mode toggle
- **Farmer profiles** — verified asset data + GPS location
- **AI risk assessment** — score ring + full breakdown panel
- **Early warning system** — drought alerts, payment flags,
  livestock mismatches, GPS boundary overlaps
- **Loan lifecycle timeline** — 6 stages per farmer profile
- **Live USSD activity feed** — SSE broadcasts farmer interactions
- **Loan book** — repayment tracking + status badges
- **Verification queue** — field agent workflow management
- **Trust & Transparency** — full audit trail
- **Phantom wallet connection** — via Wallet Standard
- **Full mobile responsiveness**

---

## 📱 Farmer Access — USSD

Farmers dial `*384*26730#` on any basic phone:

```
Welcome to VeriFarm / Karibu VeriFarm

1. Apply for Loan     / Omba Mkopo
2. Check Status       / Angalia Hali
3. Why This Amount?   / Kwa Nini Kiasi Hiki?
4. Improve My Score   / Boresha Alama Zangu
5. Repay Loan         / Lipa Mkopo
```

✅ No smartphone required
✅ No internet required
✅ English and Swahili
✅ Session persists 30 mins if signal drops
✅ M-Pesa STK push on repayment
✅ SMS confirmation after every action

---

## 🔐 Privacy & Compliance

Land boundary coordinates are hashed before on-chain storage
and are only accessible to program-gated MFI PDAs. Raw GPS
data is never publicly readable.

Farmer consent is logged on-chain during USSD registration
in compliance with Kenya's Data Protection Act 2019 and
Tanzania's PDPA framework.

MFI partners access full off-chain KYC data through their
existing Customer Due Diligence processes. On-chain stores
only the scored hash — fully compatible with CBK and BoT
AML requirements.

---

## 🛡️ Threat Model

**Colluding Agent Ring Defense:**
VeriFarm requires a minimum of 2 independent agents from
different geographic zones to attest the same boundary
before it becomes eligible for loan scoring. Agents cannot
attest boundaries in zones where they are registered as
landowners. Combined with SOL staking and slashing,
coordinated fraud is economically irrational — the cost
of staking across multiple agents exceeds the fraudulent
loan value at our 50% LTV limit.

**GPS Spoofing Defense:**
Cross-validation between independent agents in different
geographic zones makes coordinate spoofing detectable.
A staleness TTL ensures boundary attestations older than
180 days require re-verification before scoring.

**Data Privacy:**
All sensitive farmer data is hashed on-chain. Raw data
is only accessible to authorized MFI PDAs through
program-gated instructions.

**Community Collusion Defense:**
World ID prevents sybil attacks — one human, one agent 
account. To prevent self-dealing between legitimate agents 
in the same community, VeriFarm enforces geographic 
independence: cross-attesting agents must operate from GPS 
coordinates more than 50km from the primary agent's 
registered location. Any agent can challenge a boundary 
attestation and earn the slashed stake if the dispute is 
upheld by a threshold of geographically distant observers.
This makes community-level collusion economically irrational 
even among World ID verified agents.

---

## 💰 Capital Model

VeriFarm does not hold or lend capital directly.

- Licensed MFIs and SACCOs provide regulated loan capital
- VeriFarm provides verification and scoring rails
- Initial pilot: farming families in Manyara, Tanzania
- Currently in conversations with FINCA Tanzania, BRAC
  Tanzania, Equity Bank Tanzania, and NMB Bank
- VeriFarm earns an oracle attestation fee per verified farmer

CASH (Phantom Frontier) is used for loan disbursement. 
The lender dashboard allows MFI partners to configure 
an alternative stablecoin fallback (USDC, USDT) to 
mitigate single-stablecoin concentration risk.

---

## 🛠️ Built With

- **Solana + Anchor 0.31.0** — blockchain oracle layer
- **Rust** — smart contract language
- **React + Tailwind** — lender dashboard
- **solana.new + Claude Code** — agentic engineering
- **Vercel** — frontend deployment
- **Bankrun** — 37 passing tests

---

## 🚀 Running Locally

```bash
git clone https://github.com/yvonne-byte-crypto/verifarm-frontend.git
cd verifarm-frontend
npm install
npm run dev
```

---

## 🌱 Roadmap

- [x] Anchor oracle program deployed on Solana Devnet
- [x] 37 bankrun tests passing
- [x] Agent staking anti-fraud layer
- [x] Lender dashboard live on Vercel
- [x] AI explainability breakdown
- [x] Early warning alert system
- [x] Loan lifecycle timeline
- [x] Live USSD activity feed via SSE
- [x] USSD demo — English + Swahili
- [x] Wallet connection + live chain status
- [x] Full mobile responsiveness
- [ ] Africa's Talking production number
- [ ] Enhanced livestock attestation — mandatory photo 
  hash on-chain (Arweave) + higher stake requirement 
  (Phase 2)
- [ ] Real phone testing in Tanzania
- [ ] MFI partner pilot — Manyara, Tanzania
- [ ] Mainnet launch

---

## 👩🏾‍💻 Builder

**Yvonne Yuvenali** — Tanzanian innovator building DePIN
oracle infrastructure for agricultural credit in East Africa.

- 🌍 solana.new Founding Builder — Pass #0142
- 🏆 1st Place — Junior Achievement Africa Competition (2024)
- 🌍 Top 500 Global Finalist — RISE for the World (2023)
- 🎓 Valedictorian — 10 Million African Girls programme (2025)
- 💰 Ei Electronics Scholar — TUS Ireland
- 💡 Founder — OptiGrow, Creative Minds, Endelea Connective

---

*Built for the Colosseum Hackathon 2026 — for the farmers
back home in Tanzania who deserve access to the financial
system they've always been excluded from.* 🌍🌾
