import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Smartphone } from "lucide-react";
import { cn } from "@/lib/utils";

type Lang = "en" | "sw";

interface Option {
  label: { en: string; sw: string };
  target: string;
}

interface Screen {
  title: { en: string; sw: string };
  lines: { en: string[]; sw: string[] };
  options: Option[];
  loading?: boolean;
  success?: boolean;
  autoAdvance?: { to: string; delay: number };
}

const screens: Record<string, Screen> = {
  home: {
    title: { en: "Main Menu", sw: "Menyu Kuu" },
    lines: {
      en: ["Welcome to VeriFarm", "Select an option:"],
      sw: ["Karibu VeriFarm", "Chagua chaguo:"],
    },
    options: [
      { label: { en: "1. Apply for Loan", sw: "1. Omba Mkopo" }, target: "applyFarmSize" },
      { label: { en: "2. Check Status", sw: "2. Angalia Hali" }, target: "statusMenu" },
      { label: { en: "3. Why this amount?", sw: "3. Kwa Nini Kiasi Hiki?" }, target: "why" },
      { label: { en: "4. Improve my score", sw: "4. Boresha Alama Zangu" }, target: "improve" },
      { label: { en: "5. Repay Loan", sw: "5. Lipa Mkopo" }, target: "repayAmount" },
    ],
  },

  applyFarmSize: {
    title: { en: "Step 1 of 3", sw: "Hatua 1 ya 3" },
    lines: { en: ["Enter farm size (acres):"], sw: ["Ingiza ukubwa wa shamba (eka):"] },
    options: [
      { label: { en: "1. 1–3 acres", sw: "1. eka 1–3" }, target: "applyLivestock" },
      { label: { en: "2. 4–6 acres", sw: "2. eka 4–6" }, target: "applyLivestock" },
      { label: { en: "3. 7+ acres", sw: "3. eka 7+" }, target: "applyLivestock" },
      { label: { en: "0. Back", sw: "0. Rudi" }, target: "home" },
    ],
  },
  applyLivestock: {
    title: { en: "Step 2 of 3", sw: "Hatua 2 ya 3" },
    lines: { en: ["Number of livestock:"], sw: ["Idadi ya mifugo:"] },
    options: [
      { label: { en: "1. 0–5 animals", sw: "1. wanyama 0–5" }, target: "applyActiveLoan" },
      { label: { en: "2. 6–15 animals", sw: "2. wanyama 6–15" }, target: "applyActiveLoan" },
      { label: { en: "3. 16+ animals", sw: "3. wanyama 16+" }, target: "applyActiveLoan" },
      { label: { en: "0. Back", sw: "0. Rudi" }, target: "applyFarmSize" },
    ],
  },
  applyActiveLoan: {
    title: { en: "Step 3 of 3", sw: "Hatua 3 ya 3" },
    lines: {
      en: ["Do you have an", "active loan?"],
      sw: ["Una mkopo unaoendelea", "kwa sasa?"],
    },
    options: [
      { label: { en: "1. Yes", sw: "1. Ndiyo" }, target: "applyConfirm" },
      { label: { en: "2. No", sw: "2. Hapana" }, target: "applyConfirm" },
      { label: { en: "0. Back", sw: "0. Rudi" }, target: "applyLivestock" },
    ],
  },
  applyConfirm: {
    title: { en: "Confirm", sw: "Thibitisha" },
    lines: {
      en: ["Submit application?", "", "Your details will be", "sent for verification."],
      sw: ["Wasilisha maombi?", "", "Taarifa zako zitatumwa", "kwa uthibitisho."],
    },
    options: [
      { label: { en: "1. Confirm", sw: "1. Thibitisha" }, target: "verifying" },
      { label: { en: "2. Cancel", sw: "2. Ghairi" }, target: "home" },
      { label: { en: "0. Back", sw: "0. Rudi" }, target: "applyActiveLoan" },
    ],
  },

  verifying: {
    title: { en: "Verifying", sw: "Inathibitisha" },
    lines: {
      en: ["Verifying farm data...", "Checking land records", "Confirming livestock"],
      sw: ["Inathibitisha data...", "Inakagua hati za ardhi", "Inathibitisha mifugo"],
    },
    options: [],
    loading: true,
    autoAdvance: { to: "fieldAgent", delay: 2600 },
  },
  fieldAgent: {
    title: { en: "Field Visit", sw: "Ukaguzi wa Shamba" },
    lines: {
      en: [
        "A field agent may",
        "visit your farm for",
        "physical verification.",
        "",
        "Please prepare your",
        "land and livestock",
        "documents.",
      ],
      sw: [
        "Afisa wa shamba",
        "anaweza kutembelea",
        "shamba lako kwa ukaguzi.",
        "",
        "Tafadhali andaa hati",
        "za ardhi na mifugo",
        "yako.",
      ],
    },
    options: [{ label: { en: "1. Continue", sw: "1. Endelea" }, target: "analyzing" }],
  },

  analyzing: {
    title: { en: "Analyzing", sw: "Inachanganua" },
    lines: {
      en: ["Analyzing farm profile...", "Calculating eligibility..."],
      sw: ["Inachanganua wasifu...", "Inakokotoa ustahiki..."],
    },
    options: [],
    loading: true,
    autoAdvance: { to: "received", delay: 2400 },
  },
  received: {
    title: { en: "Submitted", sw: "Imewasilishwa" },
    lines: {
      en: [
        "✓ Application received",
        "",
        "Your data is under",
        "review.",
        "",
        "Verification in progress.",
        "You will receive a",
        "response within 48 hours.",
      ],
      sw: [
        "✓ Maombi yamepokelewa",
        "",
        "Data yako inakaguliwa.",
        "",
        "Uthibitisho unaendelea.",
        "Utapata jibu ndani",
        "ya saa 48.",
      ],
    },
    options: [{ label: { en: "0. Main Menu", sw: "0. Menyu Kuu" }, target: "home" }],
    success: true,
  },

  statusMenu: {
    title: { en: "Check Status", sw: "Angalia Hali" },
    lines: { en: ["Select application:"], sw: ["Chagua maombi:"] },
    options: [
      { label: { en: "1. Pending", sw: "1. Inasubiri" }, target: "statusPending" },
      { label: { en: "2. Verified", sw: "2. Imethibitishwa" }, target: "statusVerified" },
      { label: { en: "3. Approved", sw: "3. Imeidhinishwa" }, target: "statusApproved" },
      { label: { en: "0. Back", sw: "0. Rudi" }, target: "home" },
    ],
  },
  statusPending: {
    title: { en: "Under Review", sw: "Inakaguliwa" },
    lines: {
      en: [
        "Status: Under Review",
        "",
        "We are verifying your",
        "land and livestock",
        "data.",
        "",
        "Please wait 1–2 days.",
      ],
      sw: [
        "Hali: Inakaguliwa",
        "",
        "Tunathibitisha data",
        "ya ardhi na mifugo",
        "yako.",
        "",
        "Subiri siku 1–2.",
      ],
    },
    options: [{ label: { en: "0. Back", sw: "0. Rudi" }, target: "statusMenu" }],
  },
  statusVerified: {
    title: { en: "Verified", sw: "Imethibitishwa" },
    lines: {
      en: [
        "Status: Verified ✓",
        "",
        "Your farm data has",
        "been confirmed.",
        "",
        "Final decision in",
        "progress.",
      ],
      sw: [
        "Hali: Imethibitishwa ✓",
        "",
        "Data ya shamba lako",
        "imethibitishwa.",
        "",
        "Uamuzi wa mwisho",
        "unaendelea.",
      ],
    },
    options: [{ label: { en: "0. Back", sw: "0. Rudi" }, target: "statusMenu" }],
    success: true,
  },
  statusApproved: {
    title: { en: "Approved", sw: "Imeidhinishwa" },
    lines: {
      en: [
        "✓ Loan Approved",
        "",
        "Amount: 300,000 TZS",
        "Sent to your mobile",
        "money account.",
        "",
        "Asante!",
      ],
      sw: [
        "✓ Mkopo Umeidhinishwa",
        "",
        "Kiasi: TZS 300,000",
        "Kimetumwa kwenye",
        "akaunti yako ya simu.",
        "",
        "Asante!",
      ],
    },
    options: [{ label: { en: "0. Back", sw: "0. Rudi" }, target: "statusMenu" }],
    success: true,
  },

  why: {
    title: { en: "Why this amount?", sw: "Kwa Nini Kiasi Hiki?" },
    lines: {
      en: [
        "Your loan is based on:",
        "",
        "▸ Farm size",
        "▸ Livestock owned",
        "▸ Repayment history",
        "",
        "Status: Good",
      ],
      sw: [
        "Mkopo wako unategemea:",
        "",
        "▸ Ukubwa wa shamba",
        "▸ Mifugo unayomiliki",
        "▸ Historia ya marejesho",
        "",
        "Hali: Nzuri",
      ],
    },
    options: [{ label: { en: "0. Back", sw: "0. Rudi" }, target: "home" }],
  },
  improve: {
    title: { en: "Improve Score", sw: "Boresha Alama" },
    lines: {
      en: [
        "To increase your loan:",
        "",
        "▸ Expand farm size",
        "▸ Maintain healthy",
        "  livestock",
        "▸ Repay loans on time",
      ],
      sw: [
        "Kuongeza mkopo wako:",
        "",
        "▸ Panua shamba",
        "▸ Tunza mifugo",
        "  vizuri",
        "▸ Lipa mikopo kwa wakati",
      ],
    },
    options: [{ label: { en: "0. Back", sw: "0. Rudi" }, target: "home" }],
  },

  repayAmount: {
    title: { en: "Repay Loan", sw: "Lipa Mkopo" },
    lines: { en: ["Select amount to repay:"], sw: ["Chagua kiasi cha kulipa:"] },
    options: [
      { label: { en: "1. 50,000 TZS", sw: "1. TZS 50,000" }, target: "repayConfirm" },
      { label: { en: "2. 100,000 TZS", sw: "2. TZS 100,000" }, target: "repayConfirm" },
      { label: { en: "3. 300,000 TZS", sw: "3. TZS 300,000" }, target: "repayConfirm" },
      { label: { en: "0. Back", sw: "0. Rudi" }, target: "home" },
    ],
  },
  repayConfirm: {
    title: { en: "Confirm Repayment", sw: "Thibitisha Malipo" },
    lines: {
      en: [
        "Repay via M-Pesa?",
        "",
        "Amount: 100,000 TZS",
        "Loan ref: VF-7PVFE6",
        "",
        "You will receive an",
        "M-Pesa STK prompt.",
      ],
      sw: [
        "Lipa kupitia M-Pesa?",
        "",
        "Kiasi: TZS 100,000",
        "Kumb. mkopo: VF-7PVFE6",
        "",
        "Utapata ombi la",
        "M-Pesa kwenye simu.",
      ],
    },
    options: [
      { label: { en: "1. Confirm", sw: "1. Thibitisha" }, target: "repayProcessing" },
      { label: { en: "2. Cancel", sw: "2. Ghairi" }, target: "home" },
      { label: { en: "0. Back", sw: "0. Rudi" }, target: "repayAmount" },
    ],
  },
  repayProcessing: {
    title: { en: "Processing", sw: "Inashughulikia" },
    lines: {
      en: ["Initiating M-Pesa...", "Sending STK push..."],
      sw: ["Inaanzisha M-Pesa...", "Inatuma ombi..."],
    },
    options: [],
    loading: true,
    autoAdvance: { to: "repaySuccess", delay: 2400 },
  },
  repaySuccess: {
    title: { en: "Payment Sent", sw: "Malipo Yametumwa" },
    lines: {
      en: [
        "✓ STK push sent",
        "",
        "Check your phone and",
        "enter your M-Pesa PIN",
        "to complete payment.",
        "",
        "Ref: VF-7PVFE6",
      ],
      sw: [
        "✓ Ombi limetumwa",
        "",
        "Angalia simu yako na",
        "ingiza PIN ya M-Pesa",
        "kukamilisha malipo.",
        "",
        "Kumb: VF-7PVFE6",
      ],
    },
    options: [{ label: { en: "0. Main Menu", sw: "0. Menyu Kuu" }, target: "home" }],
    success: true,
  },
};

const USSDSimulator = () => {
  const [currentScreen, setCurrentScreen] = useState("home");
  const [transitioning, setTransitioning] = useState(false);
  const [lang, setLang] = useState<Lang>("en");

  const screen = screens[currentScreen];

  const navigate = (target: string) => {
    setTransitioning(true);
    setTimeout(() => {
      setCurrentScreen(target);
      setTransitioning(false);
    }, 150);
  };

  useEffect(() => {
    if (screen.autoAdvance) {
      const t = setTimeout(() => navigate(screen.autoAdvance!.to), screen.autoAdvance.delay);
      return () => clearTimeout(t);
    }
  }, [currentScreen]);

  return (
    <Card className="border-0 shadow-sm">
      <CardHeader className="pb-2">
        <div className="flex items-center justify-between gap-2">
          <div className="flex items-center gap-2">
            <Smartphone className="h-4 w-4 text-primary" />
            <CardTitle className="text-base font-semibold">USSD Demo (*123#)</CardTitle>
          </div>
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
        <p className="text-xs text-muted-foreground">
          {lang === "en"
            ? "How farmers access the system on basic phones"
            : "Jinsi wakulima wanavyotumia mfumo kwa simu za kawaida"}
        </p>
      </CardHeader>
      <CardContent className="flex justify-center overflow-hidden">
        <div className="w-[260px] max-w-full rounded-[28px] bg-[#1a1a1a] p-3 shadow-xl border-2 border-[#333]">
          <div className="flex justify-center mb-2">
            <div className="w-16 h-1.5 rounded-full bg-[#333]" />
          </div>

          <div className="bg-[#0a1a0a] rounded-xl min-h-[340px] flex flex-col font-mono text-[13px] overflow-hidden">
            <div className="bg-[#143a14] px-3 py-2 text-[#4ade80] text-xs font-bold tracking-wide flex justify-between items-center">
              <span>*123#</span>
              <span className="text-[10px] opacity-60">{screen.title[lang]}</span>
            </div>

            <div className={`flex-1 px-3 py-3 space-y-1 transition-opacity duration-150 ${transitioning ? "opacity-0" : "opacity-100"}`}>
              {screen.loading ? (
                <div className="flex flex-col items-center justify-center h-full gap-3 py-8">
                  <div className="h-6 w-6 rounded-full border-2 border-[#4ade80] border-t-transparent animate-spin" />
                  {screen.lines[lang].map((line, i) => (
                    <p key={i} className="text-[#4ade80]/80 text-center text-xs animate-pulse" style={{ animationDelay: `${i * 400}ms` }}>
                      {line}
                    </p>
                  ))}
                </div>
              ) : (
                <>
                  {screen.lines[lang].map((line, i) => (
                    <p key={i} className={`${line === "" ? "h-2" : ""} ${screen.success && i === 0 ? "text-[#4ade80] font-bold text-sm" : "text-[#b0f0b0]"}`}>
                      {line}
                    </p>
                  ))}

                  {screen.options.length > 0 && (
                    <div className="pt-2 space-y-1">
                      {screen.options.map((opt) => (
                        <button
                          key={opt.label.en}
                          onClick={() => navigate(opt.target)}
                          className="block w-full text-left text-[#4ade80] hover:bg-[#1a3a1a] active:bg-[#2a4a2a] rounded px-2 py-1.5 transition-colors cursor-pointer text-xs"
                        >
                          {opt.label[lang]}
                        </button>
                      ))}
                    </div>
                  )}
                </>
              )}
            </div>

            <div className="px-3 py-2 border-t border-[#1a3a1a] text-[10px] text-[#4ade80]/40 text-center">
              VeriFarm • {lang === "en" ? "Trusted Agri-Lending" : "Mkopo wa Kilimo Unaoaminika"}
            </div>
          </div>

          <div className="flex justify-center mt-2">
            <button
              onClick={() => navigate("home")}
              className="w-10 h-10 rounded-full border-2 border-[#333] hover:border-[#555] transition-colors"
              aria-label="Home"
            />
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default USSDSimulator;
