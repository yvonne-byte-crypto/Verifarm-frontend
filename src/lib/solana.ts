import { Connection, PublicKey, clusterApiUrl } from "@solana/web3.js";
import { AnchorProvider, Program, Idl } from "@coral-xyz/anchor";
import idl from "./verifarm-idl.json";

export const PROGRAM_ID = new PublicKey("9teMVR4r2AB9T5bB4YgXJ38G6mMbxTF6bFm8UYizqx8N");
export const DEVNET_RPC = clusterApiUrl("devnet");
export const connection = new Connection(DEVNET_RPC, "confirmed");

export const ADMIN_CONFIG_SEED = Buffer.from("admin_config");

export function getAdminConfigPda(): PublicKey {
  const [pda] = PublicKey.findProgramAddressSync([ADMIN_CONFIG_SEED], PROGRAM_ID);
  return pda;
}

export function getFarmerPda(authority: PublicKey): PublicKey {
  const [pda] = PublicKey.findProgramAddressSync(
    [Buffer.from("farmer"), authority.toBuffer()],
    PROGRAM_ID
  );
  return pda;
}

export function getProgram(provider: AnchorProvider): Program {
  return new Program(idl as Idl, provider);
}
