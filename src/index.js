import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import "./assets/style/main.scss"
import reportWebVitals from './reportWebVitals';
import "bootstrap/dist/css/bootstrap.min.css";
import { store } from './store'
import { Provider } from 'react-redux'
import { WagmiConfig, createConfig, createStorage } from 'wagmi'
import { publicProvider } from 'wagmi/providers/public'
import { configureChains } from '@wagmi/core'
import { goerli } from '@wagmi/core/chains'
import { jsonRpcProvider } from 'wagmi/providers/jsonRpc';
import { InjectedConnector } from 'wagmi/connectors/injected'
import { WalletConnectConnector } from 'wagmi/connectors/walletConnect'
import { alchemyProvider } from 'wagmi/providers/alchemy'
import { MetaMaskConnector } from 'wagmi/connectors/metaMask'
import { createPublicClient, http } from 'viem'
export const RACE = {
    id: Number(process.env.REACT_APP_L2_CHAIN_ID),
    name: "RACE Testnet",
    network: "RACE",
    iconUrl: "https://i.imgur.com/Q3oIdip.png",
    iconBackground: "#000000",
    nativeCurrency: {
        decimals: 18,
        name: 'ETHEREUM',
        symbol: 'ETH'
    },
    rpcUrls: {
        default: {
            http: ["https://racetestnet.io"]
        },
    },
    blockExplorers: {
        default: { name: "RACE Testnet Explorer", url: "https://testnet.racescan.io" }
    },
    testnet: true

}

const { chains, publicClient, webSocketPublicClient } = configureChains(
    [goerli, RACE],
    [
        jsonRpcProvider({
            rpc: chain => ({ http: chain.rpcUrls.default.http[0] })

        })
    ])

export const connectors = [
    // new WalletConnectConnector({
    //     chains,
    //     options: {
    //         projectId: "9ab3c65ab8829967bba6f99b37b2e868",
    //     },
    // }),
    new MetaMaskConnector({
        chains,
        options : {
            shimDisconnect: false,
        }
    }),
];

const config = createConfig({
    autoConnect: true,
    connectors,
    storage: createStorage({ storage: window.localStorage }),
    publicClient,
})
const root = ReactDOM.createRoot(document.getElementById('root'));

root.render(
    <WagmiConfig config={config}>
        <Provider store={store}>
            <App />
        </Provider>,
    </WagmiConfig>
);
reportWebVitals();
