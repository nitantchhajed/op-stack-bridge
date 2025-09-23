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
    name: "Wibe Testnet",
    network: "Wibe",
    iconUrl: "https://via.placeholder.com/32x32/000000/FFFFFF?text=W",
    iconBackground: "#000000",
    nativeCurrency: {
        decimals: 18,
        name: 'Wibe Coin',
        symbol: 'WIBE'
    },
    rpcUrls: {
        default: {
            http: [String(process.env.REACT_APP_L2_RPC_URL)]
        },
    },
    blockExplorers: {
        default: { name: "Wibe Testnet Explorer", url: process.env.REACT_APP_L2_EXPLORER_URL }
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
