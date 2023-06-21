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
 
const { chains, publicClient } = configureChains(
  [goerli],
  [publicProvider()]
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
