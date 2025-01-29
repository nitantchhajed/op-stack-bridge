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
import { sepolia } from '@wagmi/core/chains'
import { jsonRpcProvider } from 'wagmi/providers/jsonRpc';
import { MetaMaskConnector } from 'wagmi/connectors/metaMask'
export const RACE = {
    id: Number(process.env.REACT_APP_L2_CHAIN_ID),
    name: "Styleo Testnet",
    network: "Styleo",
    iconUrl: "https://i.imgur.com/Q3oIdip.png",
    iconBackground: "#000000",
    nativeCurrency: {
        decimals: 18,
        name: 'Styleo Coin',
        symbol: 'STC'
    },
    rpcUrls: {
        default: {
            http: [String(process.env.REACT_APP_L2_RPC_URL)]
        },
    },
    blockExplorers: {
        default: { name: "Styleo Testnet Explorer", url: process.env.REACT_APP_L2_EXPLORER_URL }
    },
    testnet: true

}
const sepoliaRpcUrl = process.env.REACT_APP_L1_RPC_URL || 'https://rpc.sepolia.org'; // Fallback to default if not provided

const { chains, publicClient } = configureChains(
    [sepolia, RACE],
    [
        jsonRpcProvider({
            rpc: (chain) => {
                // Return the custom RPC URL for Sepolia if defined, otherwise use the default one
                if (chain.id === sepolia.id) {
                    return { http: sepoliaRpcUrl };
                }
                return { http: chain.rpcUrls.default.http[0] };
            },
        })
    ])

export const connectors = [
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
