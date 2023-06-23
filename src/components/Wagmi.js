import { useAccount, useConnect, useEnsName } from 'wagmi'
import { InjectedConnector } from 'wagmi/connectors/injected'
import { useNetwork, useSwitchNetwork } from 'wagmi'

function Wagmi() {
    const { chain } = useNetwork()
    const { chains, error, isLoading, pendingChainId, switchNetwork } = useSwitchNetwork()
    const { address, isConnected } = useAccount()
    const { data: ensName } = useEnsName({ address })
    const { connect } = useConnect({
        connector: new InjectedConnector(),
    })
    return (
        <>
            {chain && <div>Connected to {chain.name}</div>}
            {chains.map((x) => (
                <button
                    disabled={!switchNetwork || x.id === chain?.id}
                    key={x.id}
                    onClick={() => switchNetwork?.(x.id)}
                >
                    {x.name}
                    {isLoading && pendingChainId === x.id && ' (switching)'}
                </button>
            ))}

            <div>{error && error.message}</div>
            {/* {address ? <div className='text-light'>Connected to {ensName ?? address}</div> : <button onClick={() => connect()}>Connect Wallet</button>} */}
        </>
    )
}
export default Wagmi