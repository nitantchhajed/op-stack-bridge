import React from 'react';
import { Link } from 'react-router-dom';
import "../../assets/style/common/footer.scss";
import { BsDiscord } from "react-icons/bs";
import { AiFillLinkedin, AiFillTwitterCircle } from "react-icons/ai";
import { FaFacebook } from "react-icons/fa"
const Footer = () => {
  return (
    <>
      <footer className='app_footer'>
        {/* <Container fluid> */}
        <div className='footer_text_wrap'>
          <ul>
            <li><Link to="/">Help center</Link></li>
          </ul>
        </div>
        <div className='footer_icn_wrap'>
          <ul>
            <li><Link to="/"><FaFacebook /></Link></li>
            <li><Link to="/"><AiFillTwitterCircle /></Link></li>
            <li><Link to="/"><AiFillLinkedin /></Link></li>
            <li><Link to="/"><BsDiscord /></Link></li>
          </ul>
        </div>
        {/* </Container> */}
      </footer>
    </>
  )
}

export default Footer