import { registerAs } from '@nestjs/config';

export default registerAs('solana', () => ({
  rpcPrimary: process.env.RPC_URL_PRIMARY,
  rpcSecondary: process.env.RPC_URL_SECONDARY,
  rpcTertiary: process.env.RPC_URL_TERTIARY,
  rpcWssUrl: process.env.RPC_WSS_URL,
  pumpFunProgramWssUrl: process.env.PUMPFUN_PROGRAM_WSS_URL,
}));
