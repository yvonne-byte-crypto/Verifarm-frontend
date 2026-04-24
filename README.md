# 🌾 VeriFarm

> VeriFarm is the trust bridge between smallholder farmers and lending institutions
> verifying assets on one side, delivering confident lending decisions on the other, 
> and managing the full loan lifecycle on-chain until every loan is repaid.

![Solana](https://img.shields.io/badge/Solana-Devnet-9945FF?style=flat&logo=solana)
![Anchor](https://img.shields.io/badge/Anchor-0.31.0-blue)
![Tests](https://img.shields.io/badge/Tests-33%20Passing-brightgreen)
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
- 🐄 Livestock counts — unique QR/RFID tag per animal, PDA per tag
- 🌧️ Environmental data — rainfall index, soil conditions
- 👤 Identity verification — field agent signature on every record

The agricultural lending product is the first application of 
this data layer. The oracle network is the actual innovation.

---

## 💰 Capital Model

VeriFarm does not hold or lend capital directly.

**How it works:**
- Licensed MFIs and SACCOs in Kenya and Tanzania 
  provide the regulated loan capital
- VeriFarm provides the verification and scoring rails
- Initial pilot capital: partnering with 2 target MFIs 
  in Tanzania and Kenya for the Mainnet launch
- VeriFarm earns an oracle attestation fee per verified 
  farmer — not a lending margin

**Why this matters:**
- Regulatory compliance sits with licensed partners
- VeriFarm never touches customer funds
- DeFi liquidity can flow through compliant 
  institutional layer as we scale
- Farmers get credit. MFIs get reach. 
  VeriFarm gets the oracle fee.

---

## 🌍 The Problem

In Tanzania and Kenya, millions of smallholder farmers own real
value — land, livestock, crops. But they have:

- No formal records
- No verification system  
- No on-chain representation of their assets
- No credit history

The result? DeFi and traditional banks cannot lend to them —
not because they have nothing, but because their assets are
invisible to financial infrastructure.

**This is a problem I have seen firsthand, back home in Tanzania.**

---

## 💡 The Solution

```
Physical Farm Assets
        ↓
Field Verification Nodes (GPS + RFID + Agent signature)
        ↓
On-Chain Attestations (Solana Anchor Program)
        ↓
AI Risk Scoring with Full Explainability
        ↓
Licensed MFI Partners (regulated capital)
        ↓
Loan Disbursement → Farmer (USSD + Mobile Money)
```

**Capital model:** VeriFarm provides verification and scoring 
rails — licensed MFIs and SACCOs in Kenya and Tanzania provide 
regulated capital. VeriFarm earns an oracle data fee per 
verified attestation.

---

## 🖥️ Live Demo

**Dashboard:** [verifarm-frontend.vercel.app](https://verifarm-frontend.vercel.app)

**Solana Program:** [View on Explorer](https://explorer.solana.com/address/9teMVR4r2AB9T5bB4YgXJ38G6mMbxTF6bFm8UYizqx8N?cluster=devnet)

**Backend Repo:** [Verifarm-backend](https://github.com/yvonne-byte-crypto/Verifarm-backend)

---

## ⛓️ On-Chain Program

**Program ID:** `9teMVR4r2AB9T5bB4YgXJ38G6mMbxTF6bFm8UYizqx8N`
**Network:** Devnet
**Tests:** 33 bankrun tests passing

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

---

## 🤖 AI Risk Scoring — Fully Explainable

VeriFarm's AI engine produces transparent, auditable scores:

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

Explainability is not optional — it is required for regulatory 
approval and community trust in East African markets.

---

## 📱 Farmer Access — USSD

Farmers dial `*384*26730#` on any basic phone:

```
Welcome to VeriFarm / Karibu VeriFarm
1. Apply for Loan     / Omba Mkopo
2. Check Status       / Angalia Hali  
3. Why this amount?   / Kwa Nini Kiasi Hiki?
4. Improve my score   / Boresha Alama Zangu
```

✅ No smartphone required
✅ No internet required
✅ English and Swahili
✅ Session persists 30 mins if signal drops

---

## 🏦 Lender Dashboard Features

- **Portfolio KPIs** — live on-chain data + demo mode toggle
- **Farmer profiles** — verified asset data + GPS location
- **AI risk assessment** — score ring + full breakdown panel
- **Early warning system** — drought alerts, payment flags,
  livestock mismatches, GPS boundary overlaps
- **Loan book** — repayment tracking + status badges
- **Verification queue** — field agent workflow management
- **Trust & Transparency** — full audit trail

---

## 🔐 Oracle Verification Architecture

| Layer | Method | Anti-Attack Measure |
|---|---|---|
| Land | GPS polygon → SHA256 hash on-chain | Prevents double claims |
| Livestock | QR/RFID → unique PDA per animal | Prevents duplication |
| Agent | Cryptographic signature per verification | Accountability trail |
| Collateral | 50% LTV limit | Reflects illiquidity risk |

_Land boundary coordinates are hashed before on-chain storage and are only accessible to program-gated MFI PDAs. Raw GPS data is never publicly readable. Farmer consent is logged on-chain during USSD registration in compliance with Kenya's Data Protection Act 2019 and Tanzania's PDPA framework._
---

## 🆚 Why Not Just Use Claude?

| Challenge | Claude | VeriFarm |
|---|---|---|
| Verify land physically | ❌ Cannot | ✅ GPS nodes on-ground |
| Permanent records | ❌ No memory | ✅ Solana on-chain |
| Works on basic phones | ❌ Needs internet | ✅ USSD *384*26730# |
| Regulatory compliance | ❌ Not a legal entity | ✅ MFI partnership layer |
| Community trust | ❌ Black box | ✅ Full explainability |

**"AI is our engine. Physical oracle infrastructure is our moat."**

---

## 🛠️ Built With

- **Solana + Anchor 0.31.0** — blockchain oracle layer
- **Rust** — smart contract language
- **React + Tailwind** — lender dashboard
- **React + Vite + shadcn/ui** — frontend stack
- **solana.new + Claude Code** — agentic engineering
- **Vercel** — frontend deployment
- **Bankrun** — 33 passing tests

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
- [x] 33 bankrun tests passing
- [x] Lender dashboard live on Vercel
- [x] AI explainability breakdown
- [x] Early warning alert system
- [x] USSD demo — English + Swahili
- [x] Wallet connection + live chain status
- [ ] Africa's Talking USSD integration
- [ ] Continuous livestock health oracle
- [ ] MFI partner API integration
- [ ] IoT sensor integration for land monitoring
- [ ] Mainnet launch

---

## 👩🏾‍💻 Builder

**Yvonne Yuvenali** — Tanzanian innovator building DePIN 
oracle infrastructure for agricultural credit in East Africa.

- 🌍 solana.new Founding Builder — Pass #0142
- 🏆 Top 500 Global Finalist, RISE for the World (2022)
- 🎓 African Leadership Academy — Humility Award
- 📚 BSc Business Studies with AI for Enterprise, TUS Ireland
- 💡 Founder — OptiGrow, Creative Minds and Talents,
  Endelea Connective

---

*Built for the Colosseum Hackathon 2026 — for the farmers 
back home in Tanzania who deserve access to the financial 
system they've always been excluded from.* 🌍🌾
