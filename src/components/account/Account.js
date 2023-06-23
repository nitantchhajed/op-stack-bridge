import React  from 'react'
import "../../assets/style/account/account.scss"
import WithdrawAccount from './WithdrawAccount'
import { Container, Tabs, Tab } from 'react-bootstrap'
import { MdContentCopy } from "react-icons/md"
import { useAccount } from "wagmi"
import DepositAccount from './DepositAccount'
const Account = () => {
    const [successCopy, setSuccessCopy] = useState("");
    const ref = useRef(null);
    const { address, isConnected } = useAccount();
    const handleCopy = () => {
        navigator.clipboard.writeText(ref.current.innerText)
        setSuccessCopy("Copied")
        setTimeout(() => {
            setSuccessCopy("")
        }, 1000);
    }

    return (
        <>
            <div className='account_wrap'>
                <Container>
                    <div className='account_inner_wrap'>
                        <div className='account_title'>
                            <h3>Account</h3>
                            {isConnected && <h6><span ref={ref}>{address}</span> <MdContentCopy onClick={handleCopy} />{successCopy && <span className='text_copied'>{successCopy}</span>}</h6>}
                        </div>
                        <div className='account_tabs'>
                            <Tabs defaultActiveKey="withdraw" id="account-details">
                                <Tab eventKey="deposit" title="Deposit">
                                    <DepositAccount />
                                </Tab>
                                <Tab eventKey="withdraw" title="Withdraw">
                                    <WithdrawAccount />
                                </Tab>
                            </Tabs>
                        </div>
                    </div>
                </Container>
            </div>
        </>
    )
}

export default Account