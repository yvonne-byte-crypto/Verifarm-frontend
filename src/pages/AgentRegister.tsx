import { useState, useRef } from "react";
import { IDKitWidget, VerificationLevel, type ISuccessResult } from "@worldcoin/idkit";
import { useAnchorWallet, useConnection } from "@solana/wallet-adapter-react";
import { AnchorProvider, BN } from "@coral-xyz/anchor";
import { SystemProgram } from "@solana/web3.js";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Label } from "@/components/ui/label";
import { ShieldCheck, Wallet, AlertCircle, CheckCircle2, Loader2, Globe, CreditCard, Camera, Clock, Info } from "lucide-react";
import { toast } from "@/hooks/use-toast";
import WorldIdBadge from "@/components/WorldIdBadge";
import { useMyAgentStake } from "@/hooks/useVerifarm";
import { getAgentStakePda, getNullifierUsedPda, getProgram, nullifierHashToBytes } from "@/lib/solana";
import { storeIdPhoto } from "@/lib/auth";

const MIN_STAKE_SOL = 0.1;
const MIN_STAKE_LAMPORTS = MIN_STAKE_SOL * 1e9;
const WORLD_ID_APP_ID = (import.meta.env.VITE_WORLD_ID_APP_ID ?? "app_staging_placeholder") as `app_${string}`;
const WORLD_ID_ACTION = "register-field-agent";
const WORLD_ID_VERIFY_URL = `https://developer.worldcoin.org/api/v2/verify/${WORLD_ID_APP_ID}`;

const AgentRegister = () => {
  const wallet = useAnchorWallet();
  const { connection } = useConnection();
  const agentStake = useMyAgentStake();

  const [worldIdProof, setWorldIdProof] = useState<ISuccessResult | null>(null);
  const [stakeInput, setStakeInput] = useState(String(MIN_STAKE_SOL));
  const [registering, setRegistering] = useState(false);
  const [txSig, setTxSig] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  // National ID alternative
  const [idMethod, setIdMethod] = useState<"world_id" | "national_id" | null>(null);
  const [nationalIdNumber, setNationalIdNumber] = useState("");
  const [nationalIdPhoto, setNationalIdPhoto] = useState<string | null>(null);
  const [nationalIdPending, setNationalIdPending] = useState(false);
  const [nationalIdError, setNationalIdError] = useState<string | null>(null);
  const photoInputRef = useRef<HTMLInputElement>(null);

  const handlePhotoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (ev) => setNationalIdPhoto(ev.target?.result as string);
    reader.readAsDataURL(file);
  };

  const handleNationalIdSubmit = () => {
    if (!nationalIdNumber.trim()) {
      setNationalIdError("Please enter your national ID number.");
      return;
    }
    if (!nationalIdPhoto) {
      setNationalIdError("Please upload a photo of your national ID.");
      return;
    }
    if (wallet) {
      storeIdPhoto(wallet.publicKey.toBase58(), nationalIdPhoto);
      localStorage.setItem(`verifarm_natid_${wallet.publicKey.toBase58()}`, nationalIdNumber.trim());
    }
    setNationalIdPending(true);
  };

  // ── World ID handlers ────────────────────────────────────────────────────

  /**
   * Called by IDKit before onSuccess — verifies the ZK proof with the World ID cloud API.
   * This is the server-side step that prevents proof replay across different apps/actions.
   * The signal (wallet pubkey) binds the proof to this specific wallet, preventing reuse.
   */
  const handleVerify = async (proof: ISuccessResult) => {
    const res = await fetch(WORLD_ID_VERIFY_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        nullifier_hash: proof.nullifier_hash,
        merkle_root: proof.merkle_root,
        proof: proof.proof,
        verification_level: proof.verification_level,
        action: WORLD_ID_ACTION,
        signal: wallet?.publicKey.toBase58() ?? "",
      }),
    });
    if (!res.ok) {
      const err = await res.json().catch(() => ({}));
      throw new Error((err as { detail?: string }).detail ?? "World ID cloud verification failed — proof rejected.");
    }
  };

  const onWorldIdSuccess = (result: ISuccessResult) => {
    setWorldIdProof(result);
    toast({ title: "Identity verified ✓", description: "World ID proof confirmed by cloud API. You can now stake and register." });
  };

  // ── On-chain registration ────────────────────────────────────────────────

  const handleRegister = async () => {
    if (!wallet) { setError("Connect your wallet first."); return; }
    if (!worldIdProof) { setError("Complete World ID verification first."); return; }

    const stakeSol = parseFloat(stakeInput);
    if (isNaN(stakeSol) || stakeSol < MIN_STAKE_SOL) {
      setError(`Minimum stake is ${MIN_STAKE_SOL} SOL.`);
      return;
    }

    setError(null);
    setRegistering(true);

    try {
      const provider = new AnchorProvider(connection, wallet, { commitment: "confirmed" });
      const program = getProgram(provider);

      const nullifierBytes = nullifierHashToBytes(worldIdProof.nullifier_hash);
      const stakeLamports = new BN(Math.round(stakeSol * 1e9));

      const sig = await (program.methods as any)
        .registerAgent(stakeLamports, Array.from(nullifierBytes))
        .accounts({
          nullifierUsed: getNullifierUsedPda(nullifierBytes),
          agentStake: getAgentStakePda(wallet.publicKey),
          agent: wallet.publicKey,
          systemProgram: SystemProgram.programId,
        })
        .rpc();

      setTxSig(sig);
      toast({ title: "Registered as field agent", description: `Staked ${stakeSol} SOL. Tx: ${sig.slice(0, 8)}…` });
    } catch (e: unknown) {
      const msg = e instanceof Error ? e.message : String(e);
      if (msg.includes("already in use") || msg.includes("custom program error: 0x0")) {
        setError("This World ID has already been used to register an agent. One human, one agent account.");
      } else if (msg.includes("InsufficientStake")) {
        setError(`Stake must be at least ${MIN_STAKE_SOL} SOL.`);
      } else {
        setError(msg);
      }
    } finally {
      setRegistering(false);
    }
  };

  // ── Already registered ───────────────────────────────────────────────────

  if (nationalIdPending) {
    return (
      <div className="max-w-lg mx-auto mt-10 space-y-6 animate-fade-in">
        <Card className="border-0 shadow-sm">
          <CardHeader>
            <div className="flex items-center gap-3">
              <div className="h-10 w-10 rounded-full bg-amber-100 flex items-center justify-center">
                <Clock className="h-5 w-5 text-amber-600" />
              </div>
              <div>
                <CardTitle>Application Under Review</CardTitle>
                <CardDescription>Your National ID has been submitted for manual verification.</CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-2 gap-3 text-sm">
              <div className="bg-muted rounded-lg p-3">
                <p className="text-muted-foreground text-xs mb-1">ID Number</p>
                <p className="font-semibold font-mono text-xs truncate">{nationalIdNumber}</p>
              </div>
              <div className="bg-muted rounded-lg p-3">
                <p className="text-muted-foreground text-xs mb-1">Review time</p>
                <p className="font-semibold text-xs">Within 24 hours</p>
              </div>
            </div>
            {nationalIdPhoto && (
              <div className="space-y-1">
                <p className="text-xs text-muted-foreground">Uploaded ID photo</p>
                <img src={nationalIdPhoto} alt="National ID" className="h-20 rounded-lg object-cover border border-border" />
              </div>
            )}
            <div className="flex gap-2 rounded-lg bg-amber-50 border border-amber-200 px-3 py-2.5">
              <Info className="h-4 w-4 text-amber-600 shrink-0 mt-0.5" />
              <p className="text-xs text-amber-800 leading-relaxed">
                A VeriFarm administrator will review your National ID within 24 hours and activate your agent account. You will receive an SMS confirmation.
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (agentStake.exists) {
    return (
      <div className="max-w-lg mx-auto mt-10 space-y-6 animate-fade-in">
        <Card className="border-0 shadow-sm">
          <CardHeader>
            <div className="flex items-center gap-3">
              <div className="h-10 w-10 rounded-full bg-emerald-100 flex items-center justify-center">
                <CheckCircle2 className="h-5 w-5 text-emerald-600" />
              </div>
              <div>
                <CardTitle>Registered Field Agent</CardTitle>
                <CardDescription>Your agent account is active on-chain.</CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-2 gap-3 text-sm">
              <div className="bg-muted rounded-lg p-3">
                <p className="text-muted-foreground text-xs mb-1">Staked</p>
                <p className="font-semibold">{(agentStake.stakedLamports / 1e9).toFixed(3)} SOL</p>
              </div>
              <div className="bg-muted rounded-lg p-3">
                <p className="text-muted-foreground text-xs mb-1">Status</p>
                <Badge variant={agentStake.status === "active" ? "default" : "destructive"} className="capitalize text-xs">
                  {agentStake.status}
                </Badge>
              </div>
            </div>
            <WorldIdBadge verified={agentStake.worldIdVerified} />
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="max-w-lg mx-auto mt-6 space-y-6 animate-fade-in">
      <div>
        <h1 className="text-2xl font-bold">Agent Registration</h1>
        <p className="text-sm text-muted-foreground mt-1">
          Become a VeriFarm field agent — verify farms, stake SOL, earn trust.
        </p>
      </div>

      {/* Step 1 — World ID */}
      <Card className={`border-0 shadow-sm transition-opacity ${wallet ? "" : "opacity-50 pointer-events-none"}`}>
        <CardHeader className="pb-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Globe className="h-5 w-5 text-primary" />
              <CardTitle className="text-base">Step 1 — Verify Human Identity</CardTitle>
            </div>
            {worldIdProof && <WorldIdBadge verified />}
          </div>
          <CardDescription className="text-xs space-y-1.5">
            <span className="block">
              One human, one agent. World ID prevents sybil attacks via zero-knowledge proof of personhood.
              Your identity is never stored — only a nullifier hash that proves uniqueness.
            </span>
            <span className="block rounded-lg bg-secondary/10 border border-secondary/20 px-2.5 py-2 text-secondary/90">
              <strong>Demo / judges:</strong> Use the{" "}
              <a
                href="https://simulator.worldcoin.org"
                target="_blank"
                rel="noopener noreferrer"
                className="underline hover:text-secondary"
              >
                World ID Simulator
              </a>{" "}
              to generate a test proof — no Orb scan required. Scan the QR code in the Simulator app to complete verification.
            </span>
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* ── World ID option ── */}
          {idMethod !== "national_id" && (
            <>
              {!worldIdProof ? (
                <IDKitWidget
                  app_id={WORLD_ID_APP_ID}
                  action={WORLD_ID_ACTION}
                  signal={wallet?.publicKey.toBase58() ?? ""}
                  verification_level={VerificationLevel.Orb}
                  handleVerify={handleVerify}
                  onSuccess={onWorldIdSuccess}
                >
                  {({ open }) => (
                    <Button
                      onClick={() => { setIdMethod("world_id"); open(); }}
                      disabled={!wallet}
                      className="w-full gap-2"
                      variant="outline"
                    >
                      <ShieldCheck className="h-4 w-4" />
                      Verify Human Identity with World ID
                    </Button>
                  )}
                </IDKitWidget>
              ) : (
                <div className="flex items-center gap-2 text-sm text-emerald-700 bg-emerald-50 rounded-lg p-3">
                  <CheckCircle2 className="h-4 w-4 shrink-0" />
                  World ID proof verified. Nullifier hash secured.
                </div>
              )}
              {!wallet && (
                <p className="text-xs text-muted-foreground flex items-center gap-1">
                  <Wallet className="h-3 w-3" /> Connect your wallet to begin verification.
                </p>
              )}
            </>
          )}

          {/* ── OR divider ── */}
          {!worldIdProof && idMethod !== "national_id" && (
            <div className="relative flex items-center gap-3 py-1">
              <div className="flex-1 border-t border-border" />
              <span className="text-xs font-medium text-muted-foreground bg-card px-1">OR</span>
              <div className="flex-1 border-t border-border" />
            </div>
          )}

          {/* ── National ID option ── */}
          {!worldIdProof && (
            <div className="rounded-xl border border-border bg-muted/20 p-4 space-y-3">
              <div className="flex items-center gap-2">
                <CreditCard className="h-4 w-4 text-muted-foreground" />
                <p className="text-sm font-semibold">Verify with National ID</p>
                <span className="ml-auto text-[10px] bg-secondary/10 text-secondary border border-secondary/20 rounded px-1.5 py-0.5 font-medium">
                  No smartphone needed
                </span>
              </div>
              <p className="text-xs text-muted-foreground leading-relaxed">
                For agents without smartphone access. Upload a photo of your government-issued national ID card and enter your ID number below.
              </p>

              {idMethod !== "national_id" ? (
                <Button
                  type="button"
                  variant="outline"
                  className="w-full gap-2 text-sm"
                  onClick={() => setIdMethod("national_id")}
                  disabled={!wallet}
                >
                  <CreditCard className="h-4 w-4" />
                  Use National ID instead
                </Button>
              ) : (
                <div className="space-y-3">
                  {/* ID number */}
                  <div className="space-y-1.5">
                    <Label htmlFor="nat-id-number" className="text-xs">National ID number</Label>
                    <Input
                      id="nat-id-number"
                      placeholder="e.g. NIDA-19870412-00001-5"
                      value={nationalIdNumber}
                      onChange={(e) => { setNationalIdNumber(e.target.value); setNationalIdError(null); }}
                      className="h-10 text-sm font-mono"
                    />
                  </div>

                  {/* Photo upload */}
                  <div className="space-y-1.5">
                    <Label className="text-xs">ID photo</Label>
                    <input
                      ref={photoInputRef}
                      type="file"
                      accept="image/*"
                      className="hidden"
                      onChange={handlePhotoChange}
                    />
                    {nationalIdPhoto ? (
                      <div className="flex items-center gap-3">
                        <img
                          src={nationalIdPhoto}
                          alt="National ID preview"
                          className="h-14 w-22 object-cover rounded-lg border border-border"
                        />
                        <div className="space-y-1">
                          <p className="text-xs text-emerald-700 flex items-center gap-1">
                            <CheckCircle2 className="h-3 w-3" /> Photo uploaded
                          </p>
                          <Button
                            type="button"
                            variant="ghost"
                            size="sm"
                            className="text-xs h-7 px-2"
                            onClick={() => photoInputRef.current?.click()}
                          >
                            Change photo
                          </Button>
                        </div>
                      </div>
                    ) : (
                      <Button
                        type="button"
                        variant="outline"
                        className="w-full gap-2 h-10 text-sm border-dashed"
                        onClick={() => photoInputRef.current?.click()}
                      >
                        <Camera className="h-4 w-4" />
                        Upload national ID photo
                      </Button>
                    )}
                  </div>

                  {/* Manual review note */}
                  <div className="flex gap-2 rounded-lg bg-amber-50 border border-amber-200 px-3 py-2.5">
                    <Clock className="h-3.5 w-3.5 text-amber-600 shrink-0 mt-0.5" />
                    <p className="text-xs text-amber-800 leading-relaxed">
                      National ID verification is reviewed manually by VeriFarm admin within 24 hours. You will receive an SMS once your account is activated.
                    </p>
                  </div>

                  {nationalIdError && (
                    <Alert variant="destructive" className="py-2">
                      <AlertCircle className="h-4 w-4" />
                      <AlertDescription className="text-xs">{nationalIdError}</AlertDescription>
                    </Alert>
                  )}

                  <div className="flex gap-2">
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      className="text-xs"
                      onClick={() => { setIdMethod(null); setNationalIdError(null); }}
                    >
                      ← Back
                    </Button>
                    <Button
                      type="button"
                      className="flex-1 gap-2 text-sm"
                      onClick={handleNationalIdSubmit}
                      disabled={!wallet}
                    >
                      <CreditCard className="h-4 w-4" />
                      Submit for Manual Review
                    </Button>
                  </div>
                </div>
              )}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Step 2 — Stake & Register (World ID path only) */}
      <Card className={`border-0 shadow-sm transition-opacity ${idMethod === "national_id" ? "hidden" : ""} ${worldIdProof ? "" : "opacity-50 pointer-events-none"}`}>
        <CardHeader className="pb-3">
          <div className="flex items-center gap-2">
            <Wallet className="h-5 w-5 text-primary" />
            <CardTitle className="text-base">Step 2 — Stake SOL & Register</CardTitle>
          </div>
          <CardDescription className="text-xs">
            Minimum {MIN_STAKE_SOL} SOL. Your stake is locked while you have active verifications.
            Bad actors lose their stake to the treasury.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-3">
          <div className="flex gap-2 items-center">
            <Input
              type="number"
              min={MIN_STAKE_SOL}
              step={0.1}
              value={stakeInput}
              onChange={(e) => setStakeInput(e.target.value)}
              className="w-32 font-mono"
              disabled={!worldIdProof || registering}
            />
            <span className="text-sm text-muted-foreground">SOL</span>
            <span className="ml-auto text-xs text-muted-foreground">min {MIN_STAKE_SOL} SOL</span>
          </div>

          {error && (
            <Alert variant="destructive" className="py-2">
              <AlertCircle className="h-4 w-4" />
              <AlertDescription className="text-xs">{error}</AlertDescription>
            </Alert>
          )}

          <Button
            className="w-full gap-2"
            onClick={handleRegister}
            disabled={!worldIdProof || registering || agentStake.loading}
          >
            {registering ? (
              <><Loader2 className="h-4 w-4 animate-spin" /> Registering…</>
            ) : (
              <>Stake & Register as Field Agent</>
            )}
          </Button>

          {txSig && (
            <p className="text-xs text-muted-foreground text-center">
              Transaction:{" "}
              <span className="font-mono">
                {txSig.slice(0, 16)}…
              </span>
            </p>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default AgentRegister;
