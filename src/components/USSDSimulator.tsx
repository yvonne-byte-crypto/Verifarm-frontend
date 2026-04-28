import { useState, useEffect, useRef, useCallback } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Smartphone, Delete } from "lucide-react";
import { cn } from "@/lib/utils";

type Lang = "en" | "sw";

interface Option {
  key: string;
  label: { en: string; sw: string };
  target: string;
}

interface Screen {
  title: { en: string; sw: string };
  lines: { en: string[]; sw: string[] };
  options: Option[];
  loading?: boolean;
  success?: boolean;
  error?: boolean;
  autoAdvance?: { to: string; delay: number };
  inputHint?: { en: string; sw: string };
}

const screens: Record<string, Screen> = {
  // ── Main Menu ──────────────────────────────────────────────────────────────
  home: {
    title: { en: "Main Menu", sw: "Menyu Kuu" },
    lines: {
      en: ["Welcome to VeriFarm", "Agricultural Lending", ""],
      sw: ["Karibu VeriFarm", "Mkopo wa Kilimo", ""],
    },
    options: [
      { key: "1", label: { en: "1. Apply for Loan", sw: "1. Omba Mkopo" }, target: "applyFarmSize" },
      { key: "2", label: { en: "2. My Loans & Balance", sw: "2. Mikopo Yangu" }, target: "myLoans" },
      { key: "3", label: { en: "3. Repay Loan", sw: "3. Lipa Mkopo" }, target: "repayAmount" },
      { key: "4", label: { en: "4. Check Status", sw: "4. Angalia Hali" }, target: "statusMenu" },
      { key: "5", label: { en: "5. Why my amount?", sw: "5. Kwa Nini Kiasi Hiki?" }, target: "whyAmount" },
      { key: "6", label: { en: "6. Improve my score", sw: "6. Boresha Alama" }, target: "improve" },
      { key: "7", label: { en: "7. Help & FAQ", sw: "7. Msaada & Maswali" }, target: "help" },
      { key: "0", label: { en: "0. About VeriFarm", sw: "0. Kuhusu VeriFarm" }, target: "about" },
    ],
  },

  // ── Apply for Loan ─────────────────────────────────────────────────────────
  applyFarmSize: {
    title: { en: "Apply — Step 1/4", sw: "Omba — Hatua 1/4" },
    lines: { en: ["Farm size (acres)?", ""], sw: ["Ukubwa wa shamba (eka)?", ""] },
    options: [
      { key: "1", label: { en: "1.  1–3 acres", sw: "1.  eka 1–3" }, target: "applyCrop" },
      { key: "2", label: { en: "2.  4–6 acres", sw: "2.  eka 4–6" }, target: "applyCrop" },
      { key: "3", label: { en: "3.  7–15 acres", sw: "3.  eka 7–15" }, target: "applyCrop" },
      { key: "4", label: { en: "4.  16+ acres", sw: "4.  eka 16+" }, target: "applyCrop" },
      { key: "0", label: { en: "0.  Back", sw: "0.  Rudi" }, target: "home" },
    ],
  },
  applyCrop: {
    title: { en: "Apply — Step 2/4", sw: "Omba — Hatua 2/4" },
    lines: { en: ["Main crop grown?", ""], sw: ["Zao kuu unalolima?", ""] },
    options: [
      { key: "1", label: { en: "1.  Maize / Corn", sw: "1.  Mahindi" }, target: "applyLivestock" },
      { key: "2", label: { en: "2.  Rice", sw: "2.  Mchele" }, target: "applyLivestock" },
      { key: "3", label: { en: "3.  Vegetables", sw: "3.  Mboga" }, target: "applyLivestock" },
      { key: "4", label: { en: "4.  Cash crops (coffee, tea)", sw: "4.  Mazao ya biashara" }, target: "applyLivestock" },
      { key: "5", label: { en: "5.  Mixed / Other", sw: "5.  Mchanganyiko / Nyingine" }, target: "applyLivestock" },
      { key: "0", label: { en: "0.  Back", sw: "0.  Rudi" }, target: "applyFarmSize" },
    ],
  },
  applyLivestock: {
    title: { en: "Apply — Step 3/4", sw: "Omba — Hatua 3/4" },
    lines: { en: ["Number of livestock?", ""], sw: ["Idadi ya mifugo?", ""] },
    options: [
      { key: "1", label: { en: "1.  None", sw: "1.  Hakuna" }, target: "applyActiveLoan" },
      { key: "2", label: { en: "2.  1–5 animals", sw: "2.  wanyama 1–5" }, target: "applyActiveLoan" },
      { key: "3", label: { en: "3.  6–15 animals", sw: "3.  wanyama 6–15" }, target: "applyActiveLoan" },
      { key: "4", label: { en: "4.  16+ animals", sw: "4.  wanyama 16+" }, target: "applyActiveLoan" },
      { key: "0", label: { en: "0.  Back", sw: "0.  Rudi" }, target: "applyCrop" },
    ],
  },
  applyActiveLoan: {
    title: { en: "Apply — Step 4/4", sw: "Omba — Hatua 4/4" },
    lines: {
      en: ["Do you have an", "active loan?", ""],
      sw: ["Una mkopo unaoendelea", "kwa sasa?", ""],
    },
    options: [
      { key: "1", label: { en: "1.  Yes — active loan", sw: "1.  Ndiyo — nina mkopo" }, target: "applyHasLoan" },
      { key: "2", label: { en: "2.  No active loan", sw: "2.  Hapana mkopo" }, target: "applyConfirm" },
      { key: "0", label: { en: "0.  Back", sw: "0.  Rudi" }, target: "applyLivestock" },
    ],
  },
  applyHasLoan: {
    title: { en: "Active Loan", sw: "Mkopo Unaoendelea" },
    lines: {
      en: [
        "You have an active loan.",
        "",
        "You may apply again",
        "after 50% repayment.",
        "",
        "Current repayment:",
        "Need 150,000 TZS more.",
      ],
      sw: [
        "Una mkopo unaoendelea.",
        "",
        "Unaweza kuomba tena",
        "baada ya kulipa 50%.",
        "",
        "Malipo ya sasa:",
        "Huhitaji TZS 150,000 zaidi.",
      ],
    },
    options: [
      { key: "1", label: { en: "1.  Repay now", sw: "1.  Lipa sasa" }, target: "repayAmount" },
      { key: "0", label: { en: "0.  Main Menu", sw: "0.  Menyu Kuu" }, target: "home" },
    ],
    error: true,
  },
  applyConfirm: {
    title: { en: "Confirm Application", sw: "Thibitisha Maombi" },
    lines: {
      en: [
        "Submit application?",
        "",
        "Your farm details will",
        "be sent for on-chain",
        "verification.",
        "",
        "A field agent may visit.",
      ],
      sw: [
        "Wasilisha maombi?",
        "",
        "Taarifa za shamba lako",
        "zitatumwa kwa uthibitisho",
        "wa blockchain.",
        "",
        "Afisa wa shamba anaweza kutembelea.",
      ],
    },
    options: [
      { key: "1", label: { en: "1.  Confirm & Submit", sw: "1.  Thibitisha na Wasilisha" }, target: "verifying" },
      { key: "2", label: { en: "2.  Cancel", sw: "2.  Ghairi" }, target: "home" },
      { key: "0", label: { en: "0.  Back", sw: "0.  Rudi" }, target: "applyActiveLoan" },
    ],
  },
  verifying: {
    title: { en: "Verifying...", sw: "Inathibitisha..." },
    lines: {
      en: ["Uploading farm data...", "Checking land records...", "Confirming livestock..."],
      sw: ["Inapakia data ya shamba...", "Inakagua hati za ardhi...", "Inathibitisha mifugo..."],
    },
    options: [],
    loading: true,
    autoAdvance: { to: "fieldAgent", delay: 2800 },
  },
  fieldAgent: {
    title: { en: "Field Verification", sw: "Ukaguzi wa Shamba" },
    lines: {
      en: [
        "A VeriFarm field agent",
        "may visit your farm.",
        "",
        "Please prepare:",
        "▸ Land ownership docs",
        "▸ Livestock records",
        "▸ National ID / NIDA",
      ],
      sw: [
        "Afisa wa VeriFarm",
        "anaweza kutembelea shamba.",
        "",
        "Tafadhali andaa:",
        "▸ Hati za umiliki wa ardhi",
        "▸ Rekodi za mifugo",
        "▸ Kitambulisho / NIDA",
      ],
    },
    options: [{ key: "1", label: { en: "1.  OK, Continue", sw: "1.  Sawa, Endelea" }, target: "analyzing" }],
  },
  analyzing: {
    title: { en: "Analyzing...", sw: "Inachanganua..." },
    lines: {
      en: ["Analyzing farm profile...", "Scoring eligibility...", "Calculating amount..."],
      sw: ["Inachanganua wasifu...", "Inakokotoa ustahiki...", "Inakokotoa kiasi..."],
    },
    options: [],
    loading: true,
    autoAdvance: { to: "received", delay: 2600 },
  },
  received: {
    title: { en: "Submitted!", sw: "Imewasilishwa!" },
    lines: {
      en: [
        "✓ Application received",
        "",
        "Reference: VF-2026-A41",
        "",
        "Verification in progress.",
        "Response within 48 hrs.",
        "",
        "You will receive an",
        "SMS confirmation.",
      ],
      sw: [
        "✓ Maombi yamepokelewa",
        "",
        "Kumb.: VF-2026-A41",
        "",
        "Uthibitisho unaendelea.",
        "Jibu ndani ya saa 48.",
        "",
        "Utapata ujumbe wa",
        "SMS wa uthibitisho.",
      ],
    },
    options: [{ key: "0", label: { en: "0.  Main Menu", sw: "0.  Menyu Kuu" }, target: "home" }],
    success: true,
  },

  // ── My Loans & Balance ─────────────────────────────────────────────────────
  myLoans: {
    title: { en: "My Loans", sw: "Mikopo Yangu" },
    lines: { en: ["Select option:", ""], sw: ["Chagua chaguo:", ""] },
    options: [
      { key: "1", label: { en: "1.  Outstanding Balance", sw: "1.  Salio la Deni" }, target: "balance" },
      { key: "2", label: { en: "2.  Repayment Schedule", sw: "2.  Ratiba ya Malipo" }, target: "schedule" },
      { key: "3", label: { en: "3.  Loan History", sw: "3.  Historia ya Mikopo" }, target: "loanHistory" },
      { key: "4", label: { en: "4.  Early Repayment", sw: "4.  Lipa Mapema" }, target: "earlyRepay" },
      { key: "0", label: { en: "0.  Back", sw: "0.  Rudi" }, target: "home" },
    ],
  },
  balance: {
    title: { en: "Outstanding Balance", sw: "Salio la Deni" },
    lines: {
      en: [
        "Active Loan: VF-2026-A18",
        "",
        "Principal:  300,000 TZS",
        "Interest:    18,000 TZS",
        "Paid:       150,000 TZS",
        "─────────────────────",
        "Balance:    168,000 TZS",
        "",
        "Due date: 15 May 2026",
      ],
      sw: [
        "Mkopo: VF-2026-A18",
        "",
        "Mkopo:      TZS 300,000",
        "Riba:        TZS 18,000",
        "Umelipa:    TZS 150,000",
        "─────────────────────",
        "Salio:      TZS 168,000",
        "",
        "Tarehe ya kulipa: 15 Mei 2026",
      ],
    },
    options: [
      { key: "1", label: { en: "1.  Repay Now", sw: "1.  Lipa Sasa" }, target: "repayAmount" },
      { key: "0", label: { en: "0.  Back", sw: "0.  Rudi" }, target: "myLoans" },
    ],
  },
  schedule: {
    title: { en: "Repayment Schedule", sw: "Ratiba ya Malipo" },
    lines: {
      en: [
        "Loan: VF-2026-A18",
        "Amount: 300,000 TZS",
        "",
        "Month 1  100,000 ✓ Paid",
        "Month 2   50,000 ✓ Paid",
        "Month 3  100,000 ● Due soon",
        "Month 4   68,000 ○ Pending",
        "",
        "Total: 318,000 TZS",
        "(incl. 6% interest)",
      ],
      sw: [
        "Mkopo: VF-2026-A18",
        "Kiasi: TZS 300,000",
        "",
        "Mwezi 1  100,000 ✓ Imelipwa",
        "Mwezi 2   50,000 ✓ Imelipwa",
        "Mwezi 3  100,000 ● Inakaribia",
        "Mwezi 4   68,000 ○ Inangojea",
        "",
        "Jumla: TZS 318,000",
        "(incl. riba 6%)",
      ],
    },
    options: [
      { key: "1", label: { en: "1.  Repay Month 3", sw: "1.  Lipa Mwezi 3" }, target: "repayAmount" },
      { key: "0", label: { en: "0.  Back", sw: "0.  Rudi" }, target: "myLoans" },
    ],
  },
  loanHistory: {
    title: { en: "Loan History", sw: "Historia ya Mikopo" },
    lines: {
      en: [
        "Past Loans:",
        "",
        "VF-2025-A06",
        "  200,000 TZS — ✓ Repaid",
        "  Jan–Apr 2025",
        "",
        "VF-2026-A18",
        "  300,000 TZS — ● Active",
        "  Feb–May 2026",
        "",
        "Repayment rate: 100%",
      ],
      sw: [
        "Mikopo Iliyopita:",
        "",
        "VF-2025-A06",
        "  TZS 200,000 — ✓ Imelipwa",
        "  Jan–Apr 2025",
        "",
        "VF-2026-A18",
        "  TZS 300,000 — ● Inafanya kazi",
        "  Feb–Mei 2026",
        "",
        "Kiwango cha malipo: 100%",
      ],
    },
    options: [{ key: "0", label: { en: "0.  Back", sw: "0.  Rudi" }, target: "myLoans" }],
    success: true,
  },
  earlyRepay: {
    title: { en: "Early Repayment", sw: "Lipa Mapema" },
    lines: {
      en: [
        "Early Repayment Benefit:",
        "",
        "Pay off full balance now",
        "and save on interest.",
        "",
        "Remaining: 168,000 TZS",
        "Early savings: 3,200 TZS",
        "",
        "Pay now: 164,800 TZS",
      ],
      sw: [
        "Faida ya Kulipa Mapema:",
        "",
        "Lipa salio lote sasa",
        "na okoa riba.",
        "",
        "Kilichobaki: TZS 168,000",
        "Unaokaoa: TZS 3,200",
        "",
        "Lipa sasa: TZS 164,800",
      ],
    },
    options: [
      { key: "1", label: { en: "1.  Pay 164,800 TZS now", sw: "1.  Lipa TZS 164,800 sasa" }, target: "repayMethod" },
      { key: "2", label: { en: "2.  Cancel", sw: "2.  Ghairi" }, target: "myLoans" },
      { key: "0", label: { en: "0.  Back", sw: "0.  Rudi" }, target: "myLoans" },
    ],
  },

  // ── Repay Loan ─────────────────────────────────────────────────────────────
  repayAmount: {
    title: { en: "Repay Loan", sw: "Lipa Mkopo" },
    lines: { en: ["Balance: 168,000 TZS", "", "How much to repay?", ""], sw: ["Salio: TZS 168,000", "", "Lipa kiasi gani?", ""] },
    options: [
      { key: "1", label: { en: "1.  50,000 TZS", sw: "1.  TZS 50,000" }, target: "repayMethod" },
      { key: "2", label: { en: "2.  100,000 TZS", sw: "2.  TZS 100,000" }, target: "repayMethod" },
      { key: "3", label: { en: "3.  Full balance (168,000)", sw: "3.  Salio lote (168,000)" }, target: "repayMethod" },
      { key: "0", label: { en: "0.  Back", sw: "0.  Rudi" }, target: "home" },
    ],
  },
  repayMethod: {
    title: { en: "Payment Method", sw: "Njia ya Malipo" },
    lines: { en: ["Choose payment method:", ""], sw: ["Chagua njia ya malipo:", ""] },
    options: [
      { key: "1", label: { en: "1.  M-Pesa", sw: "1.  M-Pesa" }, target: "repayConfirm" },
      { key: "2", label: { en: "2.  Airtel Money", sw: "2.  Airtel Money" }, target: "repayConfirm" },
      { key: "3", label: { en: "3.  Tigo Pesa", sw: "3.  Tigo Pesa" }, target: "repayConfirm" },
      { key: "4", label: { en: "4.  HaloPesa", sw: "4.  HaloPesa" }, target: "repayConfirm" },
      { key: "0", label: { en: "0.  Back", sw: "0.  Rudi" }, target: "repayAmount" },
    ],
  },
  repayConfirm: {
    title: { en: "Confirm Payment", sw: "Thibitisha Malipo" },
    lines: {
      en: [
        "Confirm repayment?",
        "",
        "Amount:  100,000 TZS",
        "Method:  M-Pesa",
        "Ref:     VF-2026-A18",
        "",
        "An STK push will be",
        "sent to your phone.",
      ],
      sw: [
        "Thibitisha malipo?",
        "",
        "Kiasi:   TZS 100,000",
        "Njia:    M-Pesa",
        "Kumb.:   VF-2026-A18",
        "",
        "Ombi la STK litatumwa",
        "kwenye simu yako.",
      ],
    },
    options: [
      { key: "1", label: { en: "1.  Confirm", sw: "1.  Thibitisha" }, target: "repayProcessing" },
      { key: "2", label: { en: "2.  Cancel", sw: "2.  Ghairi" }, target: "home" },
      { key: "0", label: { en: "0.  Back", sw: "0.  Rudi" }, target: "repayMethod" },
    ],
  },
  repayProcessing: {
    title: { en: "Processing...", sw: "Inashughulikia..." },
    lines: {
      en: ["Connecting to M-Pesa...", "Sending STK push...", "Awaiting confirmation..."],
      sw: ["Inaunganisha M-Pesa...", "Inatuma ombi la STK...", "Inasubiri uthibitisho..."],
    },
    options: [],
    loading: true,
    autoAdvance: { to: "repaySuccess", delay: 2600 },
  },
  repaySuccess: {
    title: { en: "Payment Sent!", sw: "Malipo Yametumwa!" },
    lines: {
      en: [
        "✓ STK push sent",
        "",
        "Enter your M-Pesa PIN",
        "to complete payment.",
        "",
        "Ref: VF-2026-A18",
        "Amount: 100,000 TZS",
        "",
        "New balance: 68,000 TZS",
      ],
      sw: [
        "✓ Ombi la STK limetumwa",
        "",
        "Ingiza PIN yako ya M-Pesa",
        "kukamilisha malipo.",
        "",
        "Kumb: VF-2026-A18",
        "Kiasi: TZS 100,000",
        "",
        "Salio jipya: TZS 68,000",
      ],
    },
    options: [{ key: "0", label: { en: "0.  Main Menu", sw: "0.  Menyu Kuu" }, target: "home" }],
    success: true,
  },

  // ── Check Status ───────────────────────────────────────────────────────────
  statusMenu: {
    title: { en: "Check Status", sw: "Angalia Hali" },
    lines: { en: ["Select application:", ""], sw: ["Chagua maombi:", ""] },
    options: [
      { key: "1", label: { en: "1.  Under Review", sw: "1.  Inakaguliwa" }, target: "statusPending" },
      { key: "2", label: { en: "2.  Farm Verified", sw: "2.  Shamba Limethibitishwa" }, target: "statusVerified" },
      { key: "3", label: { en: "3.  Loan Approved", sw: "3.  Mkopo Umeidhinishwa" }, target: "statusApproved" },
      { key: "4", label: { en: "4.  Not Approved", sw: "4.  Haikuidhinishwa" }, target: "statusRejected" },
      { key: "0", label: { en: "0.  Back", sw: "0.  Rudi" }, target: "home" },
    ],
  },
  statusPending: {
    title: { en: "Under Review", sw: "Inakaguliwa" },
    lines: {
      en: [
        "Status: Under Review",
        "Ref: VF-2026-A41",
        "",
        "We are verifying your",
        "farm data on-chain.",
        "",
        "▸ Land records: ✓",
        "▸ Livestock: checking",
        "▸ Credit history: ✓",
        "",
        "Expected: 1–2 days.",
      ],
      sw: [
        "Hali: Inakaguliwa",
        "Kumb: VF-2026-A41",
        "",
        "Tunathibitisha data ya",
        "shamba lako kwenye",
        "blockchain.",
        "",
        "▸ Hati za ardhi: ✓",
        "▸ Mifugo: inakaguliwa",
        "▸ Historia ya mkopo: ✓",
        "",
        "Inatarajiwa: siku 1–2.",
      ],
    },
    options: [{ key: "0", label: { en: "0.  Back", sw: "0.  Rudi" }, target: "statusMenu" }],
  },
  statusVerified: {
    title: { en: "Farm Verified ✓", sw: "Shamba Limethibitishwa ✓" },
    lines: {
      en: [
        "Status: Verified ✓",
        "Ref: VF-2026-A41",
        "",
        "Your farm has been",
        "confirmed on-chain.",
        "",
        "▸ Land: 4 acres ✓",
        "▸ Livestock: 8 cattle ✓",
        "▸ Crop: Maize ✓",
        "",
        "Final decision coming.",
      ],
      sw: [
        "Hali: Imethibitishwa ✓",
        "Kumb: VF-2026-A41",
        "",
        "Shamba lako limethibitishwa",
        "kwenye blockchain.",
        "",
        "▸ Ardhi: eka 4 ✓",
        "▸ Mifugo: ng'ombe 8 ✓",
        "▸ Zao: Mahindi ✓",
        "",
        "Uamuzi wa mwisho unakuja.",
      ],
    },
    options: [{ key: "0", label: { en: "0.  Back", sw: "0.  Rudi" }, target: "statusMenu" }],
    success: true,
  },
  statusApproved: {
    title: { en: "Loan Approved! ✓", sw: "Mkopo Umeidhinishwa! ✓" },
    lines: {
      en: [
        "✓ Loan Approved",
        "Ref: VF-2026-A18",
        "",
        "Amount: 300,000 TZS",
        "Disbursed: 14 Feb 2026",
        "Method: M-Pesa",
        "",
        "Repayment due:",
        "15 May 2026",
        "",
        "Asante!",
      ],
      sw: [
        "✓ Mkopo Umeidhinishwa",
        "Kumb: VF-2026-A18",
        "",
        "Kiasi: TZS 300,000",
        "Imetumwa: 14 Feb 2026",
        "Njia: M-Pesa",
        "",
        "Malipo yanastahili:",
        "15 Mei 2026",
        "",
        "Asante!",
      ],
    },
    options: [
      { key: "1", label: { en: "1.  Repay Loan", sw: "1.  Lipa Mkopo" }, target: "repayAmount" },
      { key: "0", label: { en: "0.  Back", sw: "0.  Rudi" }, target: "statusMenu" },
    ],
    success: true,
  },
  statusRejected: {
    title: { en: "Not Approved", sw: "Haikuidhinishwa" },
    lines: {
      en: [
        "Status: Not Approved",
        "Ref: VF-2026-A39",
        "",
        "Reason:",
        "Insufficient farm data",
        "for verification.",
        "",
        "You may re-apply after",
        "updating your records.",
        "",
        "Contact: 0800-VERIFARM",
      ],
      sw: [
        "Hali: Haikuidhinishwa",
        "Kumb: VF-2026-A39",
        "",
        "Sababu:",
        "Data ya shamba haitoshi",
        "kwa uthibitisho.",
        "",
        "Unaweza kuomba tena",
        "baada ya kusasisha rekodi.",
        "",
        "Wasiliana: 0800-VERIFARM",
      ],
    },
    options: [
      { key: "1", label: { en: "1.  Re-apply", sw: "1.  Omba Tena" }, target: "applyFarmSize" },
      { key: "2", label: { en: "2.  Improve score", sw: "2.  Boresha Alama" }, target: "improve" },
      { key: "0", label: { en: "0.  Back", sw: "0.  Rudi" }, target: "statusMenu" },
    ],
    error: true,
  },

  // ── Why my amount ──────────────────────────────────────────────────────────
  whyAmount: {
    title: { en: "Why This Amount?", sw: "Kwa Nini Kiasi Hiki?" },
    lines: { en: ["Your loan is based on:", ""], sw: ["Mkopo wako unategemea:", ""] },
    options: [
      { key: "1", label: { en: "1.  Farm size score", sw: "1.  Alama za ukubwa" }, target: "whyFarm" },
      { key: "2", label: { en: "2.  Livestock score", sw: "2.  Alama za mifugo" }, target: "whyLivestock" },
      { key: "3", label: { en: "3.  Repayment history", sw: "3.  Historia ya malipo" }, target: "whyHistory" },
      { key: "4", label: { en: "4.  Full breakdown", sw: "4.  Muhtasari kamili" }, target: "whyFull" },
      { key: "0", label: { en: "0.  Back", sw: "0.  Rudi" }, target: "home" },
    ],
  },
  whyFarm: {
    title: { en: "Farm Size Score", sw: "Alama za Ukubwa" },
    lines: {
      en: [
        "Farm Size: 4 acres",
        "Score: 68 / 100",
        "",
        "▸ 1–3 acres:  40 pts",
        "▸ 4–6 acres:  68 pts ←",
        "▸ 7–15 acres: 85 pts",
        "▸ 16+ acres: 100 pts",
        "",
        "Expand to 7+ acres to",
        "unlock higher loans.",
      ],
      sw: [
        "Ukubwa wa Shamba: eka 4",
        "Alama: 68 / 100",
        "",
        "▸ eka 1–3:  pointi 40",
        "▸ eka 4–6:  pointi 68 ←",
        "▸ eka 7–15: pointi 85",
        "▸ eka 16+: pointi 100",
        "",
        "Panua hadi eka 7+ ili",
        "kupata mikopo zaidi.",
      ],
    },
    options: [{ key: "0", label: { en: "0.  Back", sw: "0.  Rudi" }, target: "whyAmount" }],
  },
  whyLivestock: {
    title: { en: "Livestock Score", sw: "Alama za Mifugo" },
    lines: {
      en: [
        "Livestock: 8 cattle",
        "Score: 72 / 100",
        "",
        "▸ None:       20 pts",
        "▸ 1–5 anim:  55 pts",
        "▸ 6–15 anim: 72 pts ←",
        "▸ 16+ anim: 100 pts",
        "",
        "Livestock = collateral.",
        "More animals = more trust.",
      ],
      sw: [
        "Mifugo: ng'ombe 8",
        "Alama: 72 / 100",
        "",
        "▸ Hakuna:       pointi 20",
        "▸ wanyama 1–5:  pointi 55",
        "▸ wanyama 6–15: pointi 72 ←",
        "▸ wanyama 16+: pointi 100",
        "",
        "Mifugo = dhamana.",
        "Wanyama zaidi = imani zaidi.",
      ],
    },
    options: [{ key: "0", label: { en: "0.  Back", sw: "0.  Rudi" }, target: "whyAmount" }],
  },
  whyHistory: {
    title: { en: "Repayment History", sw: "Historia ya Malipo" },
    lines: {
      en: [
        "Repayment Score: 100/100",
        "",
        "▸ VF-2025-A06: ✓ Repaid",
        "  On time — full amount",
        "",
        "Perfect repayment",
        "history gives you the",
        "maximum trust score.",
        "",
        "This unlocks larger",
        "loans in future.",
      ],
      sw: [
        "Alama za Malipo: 100/100",
        "",
        "▸ VF-2025-A06: ✓ Imelipwa",
        "  Kwa wakati — kiasi kamili",
        "",
        "Historia kamili ya malipo",
        "inakupa alama za juu",
        "za imani.",
        "",
        "Hii inafungua mikopo",
        "zaidi ya wakati ujao.",
      ],
    },
    options: [{ key: "0", label: { en: "0.  Back", sw: "0.  Rudi" }, target: "whyAmount" }],
    success: true,
  },
  whyFull: {
    title: { en: "Full Score Breakdown", sw: "Muhtasari Kamili wa Alama" },
    lines: {
      en: [
        "Your Credit Score:",
        "",
        "Farm size:    68/100",
        "Livestock:    72/100",
        "Repayment:   100/100",
        "Crop value:   75/100",
        "Field verify: 80/100",
        "─────────────────",
        "Total:        79/100",
        "",
        "Loan limit: 300,000 TZS",
      ],
      sw: [
        "Alama yako ya Mkopo:",
        "",
        "Ukubwa shamba: 68/100",
        "Mifugo:        72/100",
        "Malipo:       100/100",
        "Thamani zao:   75/100",
        "Ukaguzi:       80/100",
        "─────────────────",
        "Jumla:         79/100",
        "",
        "Kikomo cha mkopo: TZS 300,000",
      ],
    },
    options: [
      { key: "1", label: { en: "1.  How to improve?", sw: "1.  Jinsi ya kuboresha?" }, target: "improve" },
      { key: "0", label: { en: "0.  Back", sw: "0.  Rudi" }, target: "whyAmount" },
    ],
  },

  // ── Improve Score ──────────────────────────────────────────────────────────
  improve: {
    title: { en: "Improve My Score", sw: "Boresha Alama Zangu" },
    lines: { en: ["How to increase your loan:", ""], sw: ["Jinsi ya kuongeza mkopo:", ""] },
    options: [
      { key: "1", label: { en: "1.  Expand farm size", sw: "1.  Panua shamba" }, target: "improveExpand" },
      { key: "2", label: { en: "2.  Repay on time", sw: "2.  Lipa kwa wakati" }, target: "improveRepay" },
      { key: "3", label: { en: "3.  Add more livestock", sw: "3.  Ongeza mifugo" }, target: "improveLivestock" },
      { key: "4", label: { en: "4.  Update farm records", sw: "4.  Sasisha rekodi za shamba" }, target: "improveRecords" },
      { key: "0", label: { en: "0.  Back", sw: "0.  Rudi" }, target: "home" },
    ],
  },
  improveExpand: {
    title: { en: "Expand Farm Size", sw: "Panua Shamba" },
    lines: {
      en: [
        "Farm size is a key",
        "factor in your loan.",
        "",
        "Current: 4 acres (68 pts)",
        "Target:  7+ acres (85 pts)",
        "",
        "Adding 3+ acres could",
        "increase your loan",
        "limit by ~60,000 TZS.",
        "",
        "Talk to your local",
        "land office for help.",
      ],
      sw: [
        "Ukubwa wa shamba ni",
        "sababu muhimu.",
        "",
        "Sasa hivi: eka 4 (alama 68)",
        "Lengo:     eka 7+ (alama 85)",
        "",
        "Kuongeza eka 3+ kunaweza",
        "kuongeza mkopo wako",
        "kwa TZS ~60,000.",
        "",
        "Wasiliana na ofisi ya",
        "ardhi ya eneo lako.",
      ],
    },
    options: [{ key: "0", label: { en: "0.  Back", sw: "0.  Rudi" }, target: "improve" }],
  },
  improveRepay: {
    title: { en: "Repayment Tips", sw: "Vidokezo vya Malipo" },
    lines: {
      en: [
        "On-time repayment is",
        "the fastest way to",
        "grow your loan limit.",
        "",
        "▸ Set payment reminders",
        "▸ Pay before due date",
        "▸ Avoid partial payments",
        "▸ Repay early for bonus",
        "",
        "Every on-time payment",
        "boosts your score.",
      ],
      sw: [
        "Kulipa kwa wakati ni",
        "njia ya haraka ya",
        "kuongeza mkopo wako.",
        "",
        "▸ Weka vikumbusha vya malipo",
        "▸ Lipa kabla ya tarehe",
        "▸ Epuka malipo ya sehemu",
        "▸ Lipa mapema kwa bonasi",
        "",
        "Kila malipo kwa wakati",
        "huongeza alama yako.",
      ],
    },
    options: [
      { key: "1", label: { en: "1.  Repay Loan Now", sw: "1.  Lipa Mkopo Sasa" }, target: "repayAmount" },
      { key: "0", label: { en: "0.  Back", sw: "0.  Rudi" }, target: "improve" },
    ],
  },
  improveLivestock: {
    title: { en: "Add Livestock", sw: "Ongeza Mifugo" },
    lines: {
      en: [
        "Livestock = collateral",
        "on the VeriFarm oracle.",
        "",
        "Current: 8 cattle (72 pts)",
        "Target:  16+ (100 pts)",
        "",
        "Adding 8+ more animals",
        "could unlock up to",
        "500,000 TZS in loans.",
        "",
        "Agent will re-verify",
        "when you update.",
      ],
      sw: [
        "Mifugo = dhamana",
        "kwenye oracle ya VeriFarm.",
        "",
        "Sasa: ng'ombe 8 (alama 72)",
        "Lengo: 16+ (alama 100)",
        "",
        "Kuongeza wanyama 8+",
        "kunaweza kufungua hadi",
        "TZS 500,000 kwa mikopo.",
        "",
        "Afisa atathibitisha tena",
        "utaposasisha.",
      ],
    },
    options: [{ key: "0", label: { en: "0.  Back", sw: "0.  Rudi" }, target: "improve" }],
  },
  improveRecords: {
    title: { en: "Update Farm Records", sw: "Sasisha Rekodi za Shamba" },
    lines: {
      en: [
        "Keep your records",
        "up to date:",
        "",
        "▸ Land title / lease",
        "▸ Livestock count",
        "▸ Crop type & season",
        "▸ Water source",
        "▸ Past harvest data",
        "",
        "Request a field agent",
        "visit to update records.",
        "Call: 0800-VERIFARM",
      ],
      sw: [
        "Weka rekodi zako",
        "zimesasishwa:",
        "",
        "▸ Hati ya ardhi / kukodisha",
        "▸ Idadi ya mifugo",
        "▸ Aina ya zao na msimu",
        "▸ Chanzo cha maji",
        "▸ Data ya mavuno ya zamani",
        "",
        "Omba ziara ya afisa wa shamba",
        "kusasisha rekodi.",
        "Piga: 0800-VERIFARM",
      ],
    },
    options: [{ key: "0", label: { en: "0.  Back", sw: "0.  Rudi" }, target: "improve" }],
  },

  // ── Help & FAQ ─────────────────────────────────────────────────────────────
  help: {
    title: { en: "Help & FAQ", sw: "Msaada & Maswali" },
    lines: { en: ["What do you need help with?", ""], sw: ["Unahitaji msaada gani?", ""] },
    options: [
      { key: "1", label: { en: "1.  What is VeriFarm?", sw: "1.  VeriFarm ni nini?" }, target: "helpWhat" },
      { key: "2", label: { en: "2.  Documents needed", sw: "2.  Hati zinazohitajika" }, target: "helpDocs" },
      { key: "3", label: { en: "3.  Interest & fees", sw: "3.  Riba na ada" }, target: "helpFees" },
      { key: "4", label: { en: "4.  How long to approve?", sw: "4.  Inachukua muda gani?" }, target: "helpTimeline" },
      { key: "5", label: { en: "5.  Is my data safe?", sw: "5.  Data yangu iko salama?" }, target: "helpPrivacy" },
      { key: "6", label: { en: "6.  Contact support", sw: "6.  Wasiliana na msaada" }, target: "helpContact" },
      { key: "0", label: { en: "0.  Back", sw: "0.  Rudi" }, target: "home" },
    ],
  },
  helpWhat: {
    title: { en: "What is VeriFarm?", sw: "VeriFarm ni Nini?" },
    lines: {
      en: [
        "VeriFarm is a Solana",
        "blockchain platform for",
        "agricultural lending",
        "in East Africa.",
        "",
        "We verify farms using",
        "field agents and put",
        "the data on-chain so",
        "banks can trust it.",
        "",
        "No paperwork. Fast.",
        "Transparent. Fair.",
      ],
      sw: [
        "VeriFarm ni jukwaa la",
        "blockchain ya Solana kwa",
        "mikopo ya kilimo",
        "Afrika Mashariki.",
        "",
        "Tunathibitisha mashamba",
        "kwa mawakala wa shamba",
        "na kuweka data kwenye",
        "blockchain.",
        "",
        "Bila karatasi. Haraka.",
        "Uwazi. Haki.",
      ],
    },
    options: [{ key: "0", label: { en: "0.  Back", sw: "0.  Rudi" }, target: "help" }],
  },
  helpDocs: {
    title: { en: "Documents Needed", sw: "Hati Zinazohitajika" },
    lines: {
      en: [
        "For loan application:",
        "",
        "Required:",
        "▸ National ID / NIDA",
        "▸ Land title or lease",
        "▸ Phone number (M-Pesa)",
        "",
        "Optional (boosts score):",
        "▸ Livestock records",
        "▸ Past harvest receipts",
        "▸ Water access proof",
      ],
      sw: [
        "Kwa ombi la mkopo:",
        "",
        "Zinazohitajika:",
        "▸ Kitambulisho / NIDA",
        "▸ Hati ya ardhi / kukodisha",
        "▸ Nambari ya simu (M-Pesa)",
        "",
        "Za hiari (huongeza alama):",
        "▸ Rekodi za mifugo",
        "▸ Stakabadhi za mavuno",
        "▸ Ushahidi wa maji",
      ],
    },
    options: [{ key: "0", label: { en: "0.  Back", sw: "0.  Rudi" }, target: "help" }],
  },
  helpFees: {
    title: { en: "Interest & Fees", sw: "Riba na Ada" },
    lines: {
      en: [
        "VeriFarm Loan Fees:",
        "",
        "Interest rate: 6% / yr",
        "(flat, not compound)",
        "",
        "Processing fee: 0%",
        "Early repayment: 0 fee",
        "Late fee: 2% / month",
        "",
        "Example — 300,000 TZS",
        "for 4 months:",
        "Total repay: 318,000 TZS",
      ],
      sw: [
        "Ada za Mkopo wa VeriFarm:",
        "",
        "Riba: 6% / mwaka",
        "(gorofa, si kiwango kinachoongezeka)",
        "",
        "Ada ya usindikaji: 0%",
        "Kulipa mapema: ada 0",
        "Ada ya kuchelewa: 2% / mwezi",
        "",
        "Mfano — TZS 300,000",
        "kwa miezi 4:",
        "Jumla ya kulipa: TZS 318,000",
      ],
    },
    options: [{ key: "0", label: { en: "0.  Back", sw: "0.  Rudi" }, target: "help" }],
  },
  helpTimeline: {
    title: { en: "Approval Timeline", sw: "Ratiba ya Idhini" },
    lines: {
      en: [
        "How long does it take?",
        "",
        "Day 1: Application",
        "  Submit via USSD",
        "",
        "Day 1–2: Field Visit",
        "  Agent verifies farm",
        "",
        "Day 2: On-chain",
        "  Data recorded to",
        "  Solana blockchain",
        "",
        "Day 2–3: Bank Decision",
        "",
        "Day 3: Disbursement",
        "  M-Pesa transfer",
      ],
      sw: [
        "Inachukua muda gani?",
        "",
        "Siku 1: Maombi",
        "  Wasilisha kupitia USSD",
        "",
        "Siku 1–2: Ziara ya Shamba",
        "  Afisa anathibitisha",
        "",
        "Siku 2: Kwenye blockchain",
        "  Data inawekwa Solana",
        "",
        "Siku 2–3: Uamuzi wa Benki",
        "",
        "Siku 3: Uhamishaji",
        "  Uhamisho wa M-Pesa",
      ],
    },
    options: [{ key: "0", label: { en: "0.  Back", sw: "0.  Rudi" }, target: "help" }],
  },
  helpPrivacy: {
    title: { en: "Data Privacy", sw: "Faragha ya Data" },
    lines: {
      en: [
        "Is my data safe?",
        "",
        "▸ Your personal ID is",
        "  never stored on-chain.",
        "",
        "▸ Only farm data and",
        "  a cryptographic hash",
        "  of your identity goes",
        "  on the blockchain.",
        "",
        "▸ Banks see farm scores,",
        "  not your private info.",
        "",
        "▸ You can request data",
        "  deletion anytime.",
      ],
      sw: [
        "Je, data yangu iko salama?",
        "",
        "▸ Kitambulisho chako",
        "  hakihifadhiwi kwenye",
        "  blockchain.",
        "",
        "▸ Data ya shamba na hash",
        "  ya siri ya utambulisho",
        "  wako tu ndio inayokwenda",
        "  kwenye blockchain.",
        "",
        "▸ Benki zinaona alama,",
        "  si taarifa zako za siri.",
        "",
        "▸ Unaweza kuomba kufutwa",
        "  kwa data wakati wowote.",
      ],
    },
    options: [{ key: "0", label: { en: "0.  Back", sw: "0.  Rudi" }, target: "help" }],
  },
  helpContact: {
    title: { en: "Contact Support", sw: "Wasiliana na Msaada" },
    lines: {
      en: [
        "VeriFarm Support:",
        "",
        "▸ USSD: *123#",
        "▸ Toll-free: 0800-VERIFARM",
        "▸ SMS: 40400",
        "▸ WhatsApp: +255 700 123 456",
        "",
        "Office hours:",
        "Mon–Fri: 8am – 6pm",
        "Sat: 9am – 1pm",
        "",
        "Email:",
        "support@verifarm.co.tz",
      ],
      sw: [
        "Msaada wa VeriFarm:",
        "",
        "▸ USSD: *123#",
        "▸ Simu bila malipo: 0800-VERIFARM",
        "▸ SMS: 40400",
        "▸ WhatsApp: +255 700 123 456",
        "",
        "Masaa ya kazi:",
        "Juma–Ijumaa: 8am – 6pm",
        "Jumamosi: 9am – 1pm",
        "",
        "Barua pepe:",
        "support@verifarm.co.tz",
      ],
    },
    options: [{ key: "0", label: { en: "0.  Back", sw: "0.  Rudi" }, target: "help" }],
  },

  // ── About ──────────────────────────────────────────────────────────────────
  about: {
    title: { en: "About VeriFarm", sw: "Kuhusu VeriFarm" },
    lines: {
      en: [
        "VeriFarm — Solana",
        "Agricultural Oracle",
        "",
        "Founded: 2026",
        "Region: East Africa",
        "",
        "Mission: Make farm",
        "loans accessible to",
        "every smallholder",
        "farmer in Africa.",
        "",
        "Powered by Solana",
        "blockchain & World ID.",
        "",
        "verifarm.co.tz",
      ],
      sw: [
        "VeriFarm — Oracle ya",
        "Kilimo ya Solana",
        "",
        "Ilianzishwa: 2026",
        "Eneo: Afrika Mashariki",
        "",
        "Dhamira: Kufanya mikopo",
        "ya shamba ipatikane kwa",
        "kila mkulima mdogo",
        "Afrika.",
        "",
        "Inafanywa kazi na Solana",
        "blockchain & World ID.",
        "",
        "verifarm.co.tz",
      ],
    },
    options: [{ key: "0", label: { en: "0.  Back", sw: "0.  Rudi" }, target: "home" }],
  },
};

// ── Simulator Component ────────────────────────────────────────────────────

const USSDSimulator = () => {
  const [currentScreen, setCurrentScreen] = useState("home");
  const [transitioning, setTransitioning] = useState(false);
  const [lang, setLang] = useState<Lang>("en");
  const [inputVal, setInputVal] = useState("");
  const [inputError, setInputError] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  const screen = screens[currentScreen];

  const navigate = useCallback((target: string) => {
    setTransitioning(true);
    setInputVal("");
    setInputError(false);
    setTimeout(() => {
      setCurrentScreen(target);
      setTransitioning(false);
    }, 180);
  }, []);

  useEffect(() => {
    if (screen?.autoAdvance) {
      const t = setTimeout(() => navigate(screen.autoAdvance!.to), screen.autoAdvance.delay);
      return () => clearTimeout(t);
    }
  }, [currentScreen, navigate]);

  const handleSend = useCallback(() => {
    const val = inputVal.trim();
    if (!val) return;
    const match = screen.options.find((o) => o.key === val);
    if (match) {
      navigate(match.target);
    } else {
      setInputError(true);
      setTimeout(() => setInputError(false), 600);
      setInputVal("");
    }
  }, [inputVal, screen, navigate]);

  const handleKeyDown = useCallback((e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      e.preventDefault();
      handleSend();
    }
  }, [handleSend]);

  const handlePadPress = (key: string) => {
    if (key === "del") {
      setInputVal((v) => v.slice(0, -1));
      return;
    }
    if (key === "send") {
      handleSend();
      return;
    }
    setInputVal((v) => (v + key).slice(0, 3));
    inputRef.current?.focus();
  };

  const optionLines = screen.options.length > 0;

  return (
    <Card className="border-0 shadow-sm">
      <CardHeader className="pb-2">
        <div className="flex items-center justify-between gap-2">
          <div className="flex items-center gap-2">
            <Smartphone className="h-4 w-4 text-primary" />
            <CardTitle className="text-base font-semibold">USSD Demo (*123#)</CardTitle>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={() => navigate("home")}
              className="text-xs text-muted-foreground hover:text-foreground px-2 py-1 rounded border border-border hover:border-primary/40 transition-colors"
            >
              Reset
            </button>
            <div className="flex rounded-md border border-border overflow-hidden text-xs">
              {(["en", "sw"] as Lang[]).map((l) => (
                <button
                  key={l}
                  onClick={() => setLang(l)}
                  className={cn(
                    "px-2.5 py-1 font-medium transition-colors",
                    lang === l
                      ? "bg-primary text-primary-foreground"
                      : "bg-background text-muted-foreground hover:bg-muted"
                  )}
                >
                  {l === "en" ? "EN" : "SW"}
                </button>
              ))}
            </div>
          </div>
        </div>
        <p className="text-xs text-muted-foreground">
          {lang === "en"
            ? "How farmers access VeriFarm on basic feature phones"
            : "Jinsi wakulima wanavyotumia VeriFarm kwa simu za kawaida"}
        </p>
      </CardHeader>

      <CardContent className="flex justify-center overflow-hidden">
        <div className="w-[270px] max-w-full rounded-[30px] bg-[#1a1a1a] p-3 shadow-2xl border-2 border-[#333]">
          {/* Speaker */}
          <div className="flex justify-center mb-2">
            <div className="w-16 h-1.5 rounded-full bg-[#2a2a2a]" />
          </div>

          {/* Screen */}
          <div className="bg-[#0a1a0a] rounded-2xl overflow-hidden flex flex-col font-mono text-[12px]" style={{ minHeight: 320 }}>
            {/* Status bar */}
            <div className="bg-[#143a14] px-3 py-1.5 text-[#4ade80] text-[10px] font-bold tracking-wide flex justify-between items-center shrink-0">
              <span className="font-bold">*123#</span>
              <span className="opacity-70 truncate max-w-[130px]">{screen.title[lang]}</span>
            </div>

            {/* Content */}
            <div
              className={cn(
                "flex-1 px-3 py-2.5 overflow-y-auto transition-opacity duration-180",
                transitioning ? "opacity-0" : "opacity-100"
              )}
              style={{ minHeight: 220, maxHeight: 280 }}
            >
              {screen.loading ? (
                <div className="flex flex-col items-center justify-center h-full gap-2 py-4">
                  <div className="h-6 w-6 rounded-full border-2 border-[#4ade80] border-t-transparent animate-spin" />
                  <div className="space-y-1">
                    {screen.lines[lang].map((line, i) => (
                      <p key={i} className="text-[#4ade80]/70 text-center text-[11px] animate-pulse" style={{ animationDelay: `${i * 350}ms` }}>
                        {line}
                      </p>
                    ))}
                  </div>
                </div>
              ) : (
                <>
                  <div className="space-y-0.5 mb-1.5">
                    {screen.lines[lang].map((line, i) => (
                      <p
                        key={i}
                        className={cn(
                          line === "" ? "h-1.5" : "",
                          screen.success && i === 0 ? "text-[#4ade80] font-bold text-[13px]" : "",
                          screen.error && i === 0 ? "text-[#f87171] font-bold" : "",
                          !screen.success && !screen.error ? "text-[#b0f0b0]" : "",
                          screen.error && i > 0 ? "text-[#fca5a5]/80" : "",
                          screen.success && i > 0 ? "text-[#86efac]/90" : ""
                        )}
                      >
                        {line}
                      </p>
                    ))}
                  </div>

                  {optionLines && (
                    <div className="space-y-0.5 pt-1 border-t border-[#1a3a1a]">
                      {screen.options.map((opt) => (
                        <button
                          key={opt.key}
                          onClick={() => navigate(opt.target)}
                          className="block w-full text-left text-[#4ade80] hover:bg-[#1a3a1a] active:bg-[#2a4a2a] rounded px-1.5 py-1 transition-colors cursor-pointer text-[11px] leading-snug"
                        >
                          {opt.label[lang]}
                        </button>
                      ))}
                    </div>
                  )}
                </>
              )}
            </div>

            {/* Input row */}
            {!screen.loading && optionLines && (
              <div className="shrink-0 border-t border-[#1a3a1a] px-2 py-1.5 flex gap-1.5 items-center">
                <input
                  ref={inputRef}
                  type="text"
                  inputMode="numeric"
                  maxLength={3}
                  value={inputVal}
                  onChange={(e) => {
                    setInputError(false);
                    setInputVal(e.target.value.replace(/\D/g, "").slice(0, 3));
                  }}
                  onKeyDown={handleKeyDown}
                  placeholder={lang === "en" ? "Enter number…" : "Ingiza nambari…"}
                  className={cn(
                    "flex-1 bg-[#0f2a0f] border rounded px-2 py-1 text-[11px] font-mono text-[#4ade80] placeholder-[#4ade80]/30 outline-none transition-colors",
                    inputError ? "border-[#f87171] animate-pulse" : "border-[#1a4a1a] focus:border-[#4ade80]/50"
                  )}
                />
                <button
                  onClick={handleSend}
                  className="bg-[#4ade80] text-[#0a1a0a] text-[10px] font-bold px-2 py-1 rounded hover:bg-[#22c55e] active:scale-95 transition-all shrink-0"
                >
                  {lang === "en" ? "SEND" : "TUMA"}
                </button>
              </div>
            )}

            {/* Footer */}
            <div className="px-3 py-1 shrink-0 text-[9px] text-[#4ade80]/30 text-center">
              VeriFarm · {lang === "en" ? "Type a number + SEND or tap an option" : "Andika nambari + TUMA au gusa chaguo"}
            </div>
          </div>

          {/* Number pad */}
          <div className="mt-2 grid grid-cols-3 gap-1.5">
            {["1","2","3","4","5","6","7","8","9","*","0","#"].map((k) => (
              <button
                key={k}
                onClick={() => handlePadPress(k)}
                className="h-9 rounded-lg bg-[#2a2a2a] hover:bg-[#3a3a3a] active:bg-[#4a4a4a] active:scale-95 text-white text-sm font-medium transition-all"
              >
                {k}
              </button>
            ))}
          </div>

          {/* Bottom controls row */}
          <div className="mt-1.5 grid grid-cols-3 gap-1.5">
            <button
              onClick={() => handlePadPress("del")}
              className="h-8 rounded-lg bg-[#2a2a2a] hover:bg-[#3a3a3a] active:scale-95 transition-all flex items-center justify-center"
              aria-label="Delete"
            >
              <Delete className="h-3.5 w-3.5 text-[#aaa]" />
            </button>
            <button
              onClick={() => navigate("home")}
              className="h-8 rounded-full border-2 border-[#444] hover:border-[#666] active:scale-95 transition-all"
              aria-label="Home"
            />
            <button
              onClick={() => handlePadPress("send")}
              className="h-8 rounded-lg bg-[#4ade80]/20 hover:bg-[#4ade80]/30 active:scale-95 transition-all text-[#4ade80] text-[10px] font-bold"
            >
              {lang === "en" ? "OK" : "SAWA"}
            </button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default USSDSimulator;
