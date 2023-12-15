# @op-stack/bridge

The `op-Bridge` is a service for op-stack chains which provides a functional UI for the Bridging between L1 and L2.

## Installation

Clone this repo

```
git clone https://github.com/nitantchhajed/op-stack-bridge.git

yarn 
```

## Running the service

Copy `.env.example` into a new file named `.env`, then set the environment variables listed there.



Once your environment variables or flags have been set, run the service via:

```
yarn start
```

## What this service does

The `op-bridge` uses the @eth-optimism/sdk https://sdk.optimism.io/ to provide the bridgining functionality by using CrossChainMessenger. It provides the Deposit and withdraw functionality.


