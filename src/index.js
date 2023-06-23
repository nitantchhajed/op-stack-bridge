import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import "./assets/style/main.scss"
import reportWebVitals from './reportWebVitals';
import "bootstrap/dist/css/bootstrap.min.css";
import { store } from './store'
import { Provider } from 'react-redux'
import { WagmiConfig, createConfig, createStorage } from 'wagmi'
import { configureChains } from '@wagmi/core'
import { goerli } from '@wagmi/core/chains'
import { jsonRpcProvider } from 'wagmi/providers/jsonRpc';
import { MetaMaskConnector } from 'wagmi/connectors/metaMask';
import { InjectedConnector } from 'wagmi/connectors/injected';
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

const { chains, publicClient } = configureChains(
    [RACE, goerli],
    [
        jsonRpcProvider({
            rpc: chain => ({ http: chain.rpcUrls.default.http[0] })

        })
    ])
// const web3AuthInstance = new Web3Auth({
//     clientId: "YOUR_CLIENT_ID",
//     chainConfig: {
//         chainNamespace: CHAIN_NAMESPACES.EIP155,
//         chainId: "0x" + chains[0].id.toString(16),
//         rpcTarget: chains[0].rpcUrls.default, // This is the public RPC we have added, please pass on your own endpoint while creating an app
//         displayName: chains[0].name,
//         tickerName: chains[0].nativeCurrency?.name,
//         ticker: chains[0].nativeCurrency?.symbol,
//         blockExplorer: chains[0]?.blockExplorers.default?.url,
//     },
// });
export const connectors = [
    // new Web3AuthConnector(chains),
    new InjectedConnector({
        chains,
        options: {
            name: "Injected",
            shimDisconnect: true,
        },
    }),
    new MetaMaskConnector({
        chains,
        options: {
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
