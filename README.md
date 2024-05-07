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

The `op-bridge` uses the @eth-optimism/sdk https://sdk.optimism.io/ to provide the bridging functionality by using CrossChainMessenger. It provides the Deposit and withdraw functionality.

## Tutorial

### Deposits

The Deposit process is an easy one step process which Bridges the Assets from L1(Sepolia) to L2 layer.
- go the the deposit page, choose your asset and initiate the deposit process.

![image](https://github.com/nitantchhajed/op-stack-bridge/assets/96972634/7fc12271-838d-4948-a276-d400b92bee4c)

### Withdrawal

Withdrawal is a three step process

  1. Initiate withdrawal on L2
  2. Prove withdrawal on L1 (available after state root is published, usually takes 25-50 mins to change the status)
  3. Caim the Withdrawal on L1 (available after challenge period is over)

--------------------------------------------------------------------------------------------------

- Initiate the withdrawal on L2 

![image](https://github.com/nitantchhajed/op-stack-bridge/assets/96972634/2a6a0af7-4175-4cdb-a351-e211e32454ab)


- View your withdrawals from Account section -

 ![image](https://github.com/nitantchhajed/op-stack-bridge/assets/96972634/7b0d1c73-4636-4c7f-8c27-e92b503a3e7a)


- You will see that your withdrawal status is `Waiting for Confirmation` which means your state root is not published yet

![image](https://github.com/nitantchhajed/op-stack-bridge/assets/96972634/8688f68b-a005-4177-acf3-8e5bbd78acf4)


- After your state root is published you can see the status change to `Prove` Button

- After proving your Transaction on L1 by clicking on prove button the status will change to `In challenge Period`

- When the Challenge period is complete the Status will change to `Claim`

  ![image](https://github.com/nitantchhajed/op-stack-bridge/assets/96972634/d5caed48-8a39-4100-be15-560ec871cee8)

- After you Claim the Withdrawal on L1 the withdrawal process is fully completed.

** NOTE - Refresh the page to see the status changes


### Please Give a star and Follow if you liked the Application.

Thank you !!!


