import React  from 'react'
import "../../assets/style/account/account.scss"
import WithdrawAccount from './WithdrawAccount'
import { Container, Tabs, Tab } from 'react-bootstrap'
import DepositAccount from './DepositAccount'
const Account = () => {
    return (
        <>
            <div className='account_wrap'>
                <Container>
                    <div className='account_inner_wrap'>
                        <div className='account_title'>
                            <h3>Account</h3>
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