import React from 'react'
import { Tabs, Tab, Container } from "react-bootstrap"
import Deposit from './Deposit'
import Withdraw from './Withdraw'
const Main = () => {
    return (
        <>
            <main className='main_wrap'>
                <Container>
                    <div className='bridge_wrap'>
                        <Tabs defaultActiveKey="deposit" id="uncontrolled-tab-example">
                            <Tab eventKey="deposit" title="Deposit">
                                <Deposit/>
                                true
                            </Tab>
                            <Tab eventKey="withdraw" title="Withdraw">
                                <Withdraw />
                            </Tab>
                        </Tabs>
                    </div>
                </Container>
            </main>
        </>
    )
}

export default Main