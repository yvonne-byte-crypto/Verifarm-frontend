import { useEffect, useState } from "react";
import { useAnchorWallet, useConnection } from "@solana/wallet-adapter-react";
import { AnchorProvider } from "@coral-xyz/anchor";
import { PublicKey } from "@solana/web3.js";
import { connection, getAdminConfigPda, getAgentStakePda, getFarmerPda, getProgram } from "@/lib/solana";

export interface ChainStatus {
  adminInitialized: boolean;
  adminKey: string | null;
  loading: boolean;
  error: string | null;
}

export interface FarmerChainData {
  fullName: string;
  status: string;
  loanCount: number;
  latestRiskScore: number;
  loading: boolean;
  exists: boolean;
}

/** Reads AdminConfig PDA — proves live devnet connection */
export function useChainStatus(): ChainStatus {
  const [state, setState] = useState<ChainStatus>({
    adminInitialized: false,
    adminKey: null,
    loading: true,
    error: null,
  });

  useEffect(() => {
    let cancelled = false;
    async function fetch() {
      try {
        const adminPda = getAdminConfigPda();
        const info = await connection.getAccountInfo(adminPda);
        if (cancelled) return;
        if (info && info.data.length > 8) {
          // Admin key is bytes 8..40 (after 8-byte discriminator)
          const adminKey = new PublicKey(info.data.slice(8, 40));
          setState({ adminInitialized: true, adminKey: adminKey.toString(), loading: false, error: null });
        } else {
          setState({ adminInitialized: false, adminKey: null, loading: false, error: null });
        }
      } catch (e: unknown) {
        if (!cancelled) setState({ adminInitialized: false, adminKey: null, loading: false, error: String(e) });
      }
    }
    fetch();
    return () => { cancelled = true; };
  }, []);

  return state;
}

/** Reads the connected wallet's Farmer PDA if it exists */
export function useMyFarmer(): FarmerChainData {
  const wallet = useAnchorWallet();
  const { connection: conn } = useConnection();
  const [state, setState] = useState<FarmerChainData>({
    fullName: "", status: "", loanCount: 0, latestRiskScore: 0, loading: false, exists: false,
  });

  useEffect(() => {
    if (!wallet) {
      setState((s) => ({ ...s, exists: false, loading: false }));
      return;
    }
    let cancelled = false;
    async function fetch() {
      setState((s) => ({ ...s, loading: true }));
      try {
        const provider = new AnchorProvider(conn, wallet!, { commitment: "confirmed" });
        const program = getProgram(provider);
        const farmerPda = getFarmerPda(wallet!.publicKey);
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const farmer = await (program.account as any).farmer.fetch(farmerPda);
        if (cancelled) return;
        const statusKey = Object.keys(farmer.status)[0];
        setState({
          fullName: farmer.fullName,
          status: statusKey.charAt(0).toUpperCase() + statusKey.slice(1),
          loanCount: farmer.loanCount,
          latestRiskScore: farmer.latestRiskScore,
          loading: false,
          exists: true,
        });
      } catch {
        if (!cancelled) setState({ fullName: "", status: "", loanCount: 0, latestRiskScore: 0, loading: false, exists: false });
      }
    }
    fetch();
    return () => { cancelled = true; };
  }, [wallet, conn]);

  return state;
}

export interface AgentStakeData {
  exists: boolean;
  loading: boolean;
  stakedLamports: number;
  worldIdVerified: boolean;
  status: "active" | "suspended" | null;
  activeVerifications: number;
}

/** Reads the connected wallet's AgentStake PDA if it exists */
export function useMyAgentStake(): AgentStakeData {
  const wallet = useAnchorWallet();
  const { connection: conn } = useConnection();
  const [state, setState] = useState<AgentStakeData>({
    exists: false,
    loading: false,
    stakedLamports: 0,
    worldIdVerified: false,
    status: null,
    activeVerifications: 0,
  });

  useEffect(() => {
    if (!wallet) {
      setState((s) => ({ ...s, exists: false, loading: false }));
      return;
    }
    let cancelled = false;
    async function fetch() {
      setState((s) => ({ ...s, loading: true }));
      try {
        const provider = new AnchorProvider(conn, wallet!, { commitment: "confirmed" });
        const program = getProgram(provider);
        const pda = getAgentStakePda(wallet!.publicKey);
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const stake = await (program.account as any).agentStake.fetch(pda);
        if (cancelled) return;
        setState({
          exists: true,
          loading: false,
          stakedLamports: stake.stakedLamports.toNumber(),
          worldIdVerified: stake.worldIdVerified ?? false,
          status: "active" in stake.status ? "active" : "suspended",
          activeVerifications: stake.activeVerifications,
        });
      } catch {
        if (!cancelled) setState({ exists: false, loading: false, stakedLamports: 0, worldIdVerified: false, status: null, activeVerifications: 0 });
      }
    }
    fetch();
    return () => { cancelled = true; };
  }, [wallet, conn]);

  return state;
}
