import { coins, StdFee } from '@cosmjs/stargate'

export const defaultExecuteFee: StdFee = {
  amount: coins(5000, process.env.NEXT_PUBLIC_STAKING_DENOM!),
  gas: '1000000',
}

export const defaultMintFee: StdFee = {
  amount: coins(
    process.env.NEXT_PUBLIC_MINT_FEE!,
    process.env.NEXT_PUBLIC_STAKING_DENOM!
  ),
  gas: '1000000',
}
