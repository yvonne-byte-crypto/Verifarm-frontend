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

export function getAgentStakePda(agent: PublicKey): PublicKey {
  const [pda] = PublicKey.findProgramAddressSync(
    [Buffer.from("agent_stake"), agent.toBuffer()],
    PROGRAM_ID
  );
  return pda;
}

export function getNullifierUsedPda(nullifierHashBytes: Uint8Array): PublicKey {
  const [pda] = PublicKey.findProgramAddressSync(
    [Buffer.from("nullifier"), Buffer.from(nullifierHashBytes)],
    PROGRAM_ID
  );
  return pda;
}

/** Convert a World ID nullifier_hash (BigInt string) to a 32-byte big-endian Uint8Array */
export function nullifierHashToBytes(nullifierHash: string): Uint8Array {
  const bytes = new Uint8Array(32);
  let v = BigInt(nullifierHash);
  for (let i = 31; i >= 0; i--) {
    bytes[i] = Number(v & 0xffn);
    v >>= 8n;
  }
  return bytes;
}

export function getProgram(provider: AnchorProvider): Program {
  return new Program(idl as Idl, provider);
}
