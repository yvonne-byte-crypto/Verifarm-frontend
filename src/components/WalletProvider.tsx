import { useCallback, useMemo } from "react";
import { ConnectionProvider, WalletProvider as SolanaWalletProvider } from "@solana/wallet-adapter-react";
import { WalletModalProvider } from "@solana/wallet-adapter-react-ui";
import { WalletError } from "@solana/wallet-adapter-base";
import { DEVNET_RPC } from "@/lib/solana";
import { toast } from "@/hooks/use-toast";

import "@solana/wallet-adapter-react-ui/styles.css";

export function WalletProvider({ children }: { children: React.ReactNode }) {
  // Empty array — Phantom (and other wallets) self-register via the Wallet Standard.
  // Explicitly passing PhantomWalletAdapter creates a legacy duplicate that silently no-ops.
  const wallets = useMemo(() => [], []);

  const onError = useCallback((error: WalletError) => {
    if (error.name === "WalletNotReadyError") return; // extension not installed — no toast needed
    toast({
      title: "Wallet error",
      description: error.message,
      variant: "destructive",
    });
  }, []);

  return (
    <ConnectionProvider endpoint={DEVNET_RPC}>
      <SolanaWalletProvider wallets={wallets} autoConnect onError={onError}>
        <WalletModalProvider>
          {children}
        </WalletModalProvider>
      </SolanaWalletProvider>
    </ConnectionProvider>
  );
}
