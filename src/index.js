import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import "./assets/style/main.scss"
import reportWebVitals from './reportWebVitals';
import "bootstrap/dist/css/bootstrap.min.css";
import { store } from './store'
import { Provider } from 'react-redux'
import { WagmiConfig, createConfig } from 'wagmi'
import { publicProvider } from 'wagmi/providers/public'
import { configureChains } from '@wagmi/core'
import { goerli } from '@wagmi/core/chains'
import { jsonRpcProvider } from 'wagmi/providers/jsonRpc';
export const RACE ={
  id:Number(process.env.REACT_APP_L2_CHAIN_ID),
  name:"RACE Testnet",
  network:"RACE",
  iconUrl:"https://i.imgur.com/Q3oIdip.png",
  iconBackground:"#000000",
  nativeCurrency:  {
    decimals:18,
    name:'ETHEREUM',
    symbol:'ETH'
  },
  rpcUrls:{
    default:{
      http:["https://racetestnet.io"]
// public rpc url
    },
  },
  blockExplorers:{
    default:{name:"RACE Testnet Explorer", url:"https://testnet.racetestnet.io"}
  },
  testnet:true

}

const { chains, publicClient } = configureChains(
  [goerli,RACE],
  // [publicProvider()]
  [
    jsonRpcProvider({
      rpc:chain=>({http:chain.rpcUrls.default.http[0]})

    })
  ]
)
const config = createConfig({
  autoConnect: true,
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

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
