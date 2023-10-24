# @op-stack/bridge

The `op-Bridge` is a service for op-stack chains which provides a functional UI for the Bridging between L1 and L2.

## Installation

Clone this repo

```
git clone https://github.com/nitantchhajed/op-stack-bridge.git

yarn 
```

## Running the application

- Copy `.env.example` into a new file named `.env`, then set the environment variables listed there.

- Update the contract addresses of `USDT, DAI, USDC, wBTC` `(L1_Token_Address, L2_Token_Address)` https://github.com/nitantchhajed/op-stack-bridge/blob/be390d177cdb6bea0d1745830a2ee490b06ebe7e/src/components/Deposit.js#L138 in `src/components/Deposit.js` & `Withdraw.js` 
  or you can remove their functionality if you don't want to bridge tokens.

Once your environment variables or flags have been set, run the service via:

```
yarn start
```

## What this service does

The `op-bridge` uses the @eth-optimism/sdk https://sdk.optimism.io/ to provide the bridgining functionality by using CrossChainMessenger. It provides the Deposit and withdraw functionality.


