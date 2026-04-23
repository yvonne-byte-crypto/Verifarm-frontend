import { useEffect, useState } from "react";
import { connection, PROGRAM_ID } from "@/lib/solana";
import { GetProgramAccountsFilter } from "@solana/web3.js";

// Anchor account discriminators (first 8 bytes of sha256("account:<Name>"))
const DISCRIMINATORS = {
  farmer:  [254, 63, 81, 98, 130, 38, 28, 219],
  loan:    [20, 195, 70, 117, 165, 227, 182, 1],
  asset:   [234, 180, 241, 252, 139, 224, 160, 8],
};

// Byte offsets within Loan account (after 8-byte discriminator)
// farmer(32) + token_mint(32) + principal(8) + outstanding(8) + interest_bps(2) + term_days(2) + status(1)
const LOAN_PRINCIPAL_OFFSET = 8 + 32 + 32;          // bytes 72–79
const LOAN_STATUS_OFFSET    = 8 + 32 + 32 + 8 + 8 + 2 + 2; // byte 92

const LOAN_STATUS_ACTIVE = 2;

function discriminatorFilter(disc: number[]): GetProgramAccountsFilter {
  return { memcmp: { offset: 0, bytes: Buffer.from(disc).toString("base64"), encoding: "base64" } };
}

function readU64LE(data: Buffer, offset: number): number {
  // Safe JS read of u64 LE — limits to Number.MAX_SAFE_INTEGER
  const lo = data.readUInt32LE(offset);
  const hi = data.readUInt32LE(offset + 4);
  return hi * 0x100000000 + lo;
}

export interface OnChainStats {
  farmerCount: number;
  assetCount: number;
  totalLoans: number;
  activeLoans: number;
  totalPrincipalUsdCents: number;
  loading: boolean;
  isLive: boolean;
  lastFetched: Date | null;
}

export function useOnChainStats(): OnChainStats {
  const [state, setState] = useState<OnChainStats>({
    farmerCount: 0,
    assetCount: 0,
    totalLoans: 0,
    activeLoans: 0,
    totalPrincipalUsdCents: 0,
    loading: true,
    isLive: false,
    lastFetched: null,
  });

  useEffect(() => {
    let cancelled = false;

    async function fetchStats() {
      try {
        const [farmers, loans, assets] = await Promise.all([
          connection.getProgramAccounts(PROGRAM_ID, {
            filters: [discriminatorFilter(DISCRIMINATORS.farmer)],
            dataSlice: { offset: 0, length: 8 },
          }),
          connection.getProgramAccounts(PROGRAM_ID, {
            filters: [discriminatorFilter(DISCRIMINATORS.loan)],
            dataSlice: { offset: 0, length: 93 + 1 }, // include status byte
          }),
          connection.getProgramAccounts(PROGRAM_ID, {
            filters: [discriminatorFilter(DISCRIMINATORS.asset)],
            dataSlice: { offset: 0, length: 8 },
          }),
        ]);

        if (cancelled) return;

        let totalPrincipal = 0;
        let activeCount = 0;

        for (const { account } of loans) {
          const buf = Buffer.from(account.data);
          if (buf.length > LOAN_PRINCIPAL_OFFSET + 8) {
            totalPrincipal += readU64LE(buf, LOAN_PRINCIPAL_OFFSET);
          }
          if (buf.length > LOAN_STATUS_OFFSET) {
            if (buf[LOAN_STATUS_OFFSET] === LOAN_STATUS_ACTIVE) activeCount++;
          }
        }

        setState({
          farmerCount: farmers.length,
          assetCount: assets.length,
          totalLoans: loans.length,
          activeLoans: activeCount,
          totalPrincipalUsdCents: totalPrincipal,
          loading: false,
          isLive: true,
          lastFetched: new Date(),
        });
      } catch {
        if (!cancelled) setState((s) => ({ ...s, loading: false, isLive: false }));
      }
    }

    fetchStats();
    // Refresh every 60 seconds
    const interval = setInterval(fetchStats, 60_000);
    return () => { cancelled = true; clearInterval(interval); };
  }, []);

  return state;
}
