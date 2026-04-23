import { useMemo } from "react";
import { ConnectionProvider, WalletProvider as SolanaWalletProvider } from "@solana/wallet-adapter-react";
import { WalletModalProvider } from "@solana/wallet-adapter-react-ui";
import { DEVNET_RPC } from "@/lib/solana";

import "@solana/wallet-adapter-react-ui/styles.css";

export function WalletProvider({ children }: { children: React.ReactNode }) {
  // Empty array — Phantom (and other wallets) self-register via the Wallet Standard.
  // Explicitly passing PhantomWalletAdapter creates a legacy duplicate that silently no-ops.
  const wallets = useMemo(() => [], []);

  return (
    <ConnectionProvider endpoint={DEVNET_RPC}>
      <SolanaWalletProvider wallets={wallets} autoConnect={false}>
        <WalletModalProvider>
          {children}
        </WalletModalProvider>
      </SolanaWalletProvider>
    </ConnectionProvider>
  );
}
