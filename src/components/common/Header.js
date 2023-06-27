import React, { useEffect, useState } from 'react';
import "../../assets/style/common/header.scss"
import { Navbar, Container, Nav, Image, Dropdown } from "react-bootstrap";
import logo from "../../assets/images/logo.png";
import { Link } from 'react-router-dom';
import { useAccount, useConnect, useNetwork } from 'wagmi'
import { InjectedConnector } from 'wagmi/connectors/injected'
import { disconnect } from '@wagmi/core'
import { FaEthereum } from "react-icons/fa"
import { BiInfoCircle, BiPowerOff } from "react-icons/bi"
import { MdContentCopy } from "react-icons/md"
import { AiOutlineDownload, AiOutlineUpload } from "react-icons/ai"
// import { BiPowerOff } from "react-icons/bi"
import { useDisconnect } from 'wagmi'

const HeaderNew = () => {

    // const [successCopy, setSuccessCopy] = useState("");
    const { address, isConnected } = useAccount();
    const [getNetwork, setNetwork] = useState();
    const { chain, chains } = useNetwork()
    const { connect } = useConnect({
        connector: new InjectedConnector({
            chains
        })
    })
    const handleDisconnect = async () => {
        await disconnect()
    }
    useEffect(() => {
        // console.log({ isConnected, address })
        if (chain?.id == 90001 || chain?.id == 5) {
            setNetwork(chain.name)
        }
        else {
            setNetwork("Unsupported Network")
        }
        // console.log(getNetwork, isConnected, address)
    }, [chain])
    const handleCopy = async () => {
        await navigator.clipboard.writeText(address)
    }
    return (
        <>
            <header className='app_header'>
                <Navbar expand="lg" variant="dark">
                    <Container fluid>
                        <Link to="/" className='app_logo'>
                            <Image src={logo} alt="logo" fluid />
                        </Link>
                        <Navbar.Toggle aria-controls="navbarScroll" />
                        <Navbar.Collapse id="navbarScroll">
                            <Nav
                                className="me-auto my-2 my-lg-0"
                                style={{ maxHeight: '100px' }}
                                navbarScroll
                            >

                                <Link to="/">Bridge</Link>
                                <Link to="/account">Account</Link>
                            </Nav>
                            <div className='header_btn_wrap'>
                                {
                                    isConnected ? <button className='btn disconnect_btn header_btn me-2'>{getNetwork}</button> : ""
                                }

                                {/* {
                                    getNetwork !== "Unsupported Network" ? <button className='btn disconnect_btn header_btn me-2'><FaEthereum /> {getNetwork}</button> : <button className='btn disconnect_btn header_btn me-2'><BiInfoCircle /> {getNetwork} </button>
                                } */}
                            </div>
                            {/* <div className='header_btn_wrap'>

                                {address ? <button className='btn disconnect_btn header_btn' onClick={() => handleDisconnect()}>
                                    <img src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACAAAAAgCAYAAABzenr0AAAAsElEQVRYR2PslBX+z4AHHLiVgiLroDYHn3IGUtUzjjpg0IUAehyiRzipaYCQfow0MOoAuoeA5/dylHIAPY7RHWSt9Q5vOXD0mhDecgPdPMZRBwx4CJBaEOFNAFgkCZUbJNcFow4YDYHREBjwEKC0LkD3AMnlwKgDqB4CLYqpKO0BQvX5b5YgvOmQ9c86FHlC7QnGUQcMeAigN0jQIxg90aGnEUrVY7QJKTWQVAePOgAAXAoAZIiZ6M4AAAAASUVORK5CYII=" alt="Profile Icon" />
                                    {address.slice(0, 5)}...{address.slice(-5)}</button> : <button onClick={() => connect()} className='btn disconnect_btn header_btn'>Connect Wallet</button>}
                            </div> */}

                            <div className='dropdown_wrap'>
                                {address ? <Dropdown>
                                    <Dropdown.Toggle variant="success" id="race_header_dropdown" >
                                        {address.slice(0, 5)}...{address.slice(-5)}
                                    </Dropdown.Toggle>
                                    <Dropdown.Menu>
                                        <div className='user_profile_wrap'>
                                            <figure className='user_profile'>
                                                <Image src='data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACAAAAAgCAYAAABzenr0AAAAsElEQVRYR2PslBX+z4AHHLiVgiLroDYHn3IGUtUzjjpg0IUAehyiRzipaYCQfow0MOoAuoeA5/dylHIAPY7RHWSt9Q5vOXD0mhDecgPdPMZRBwx4CJBaEOFNAFgkCZUbJNcFow4YDYHREBjwEKC0LkD3AMnlwKgDqB4CLYqpKO0BQvX5b5YgvOmQ9c86FHlC7QnGUQcMeAigN0jQIxg90aGnEUrVY7QJKTWQVAePOgAAXAoAZIiZ6M4AAAAASUVORK5CYII=' alt="Profile Icon" />
                                            </figure>
                                            <h4>{address.slice(0, 5)}...{address.slice(-5)} <span><MdContentCopy onClick={handleCopy} /></span></h4>
                                        </div>
                                        <Dropdown.Item as={Link} to="/account"><AiOutlineDownload /> View Deposit</Dropdown.Item>
                                        <Dropdown.Item as={Link} to="/account"><AiOutlineUpload /> View Withdrawals</Dropdown.Item>
                                        <Dropdown.Item onClick={() => handleDisconnect()}><BiPowerOff /> Disconnect</Dropdown.Item>
                                    </Dropdown.Menu>
                                </Dropdown> : <button onClick={() => connect()} className='btn disconnect_btn header_btn'>Connect Wallet</button>}


                            </div>
                        </Navbar.Collapse>
                    </Container>
                </Navbar>
            </header>
        </>
    )
}
export default HeaderNew