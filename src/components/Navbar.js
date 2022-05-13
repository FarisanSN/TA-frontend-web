import React, { useState } from "react";
import Logo from "../assets/itb.png";
import { Link } from "react-router-dom";
import ReorderIcon from "@material-ui/icons/Reorder";
import "../styles/Navbar.css";

function Navbar() {
  const [openLinks, setOpenLinks] = useState(false);

  const toggleNavbar = () => {
    setOpenLinks(!openLinks);
  };
  return (
    <div className="navbar">
      <div className="leftSide" id={openLinks ? "open" : "close"}>
        <img src={Logo} alt="ITB the best"/>
        <a href="/">Tanda Tangan Digital</a>        
        <div className="hiddenLinks">
          <Link to="/"> Home </Link>
          <Link to="/signing"> Sign </Link>
          <a href="http://34.101.147.94:8080/" target='_blank' rel="noreferrer">Verify</a>
          {/* <Link to="/verify"> Verify </Link> */}
          <a href="https://34.101.36.152:8442/ejbca/ra/index.xhtml" target='_blank' rel="noreferrer">Get Certificate</a>
          {/* <Link to="/getcertificate">  </Link> */}
        </div>
      </div>
      <div className="rightSide">
        <Link to="/"> Home </Link>
        <Link to="/signing"> Sign </Link>
        <a href="http://34.101.147.94:8080/" target='_blank' rel="noreferrer">Verify</a>
        {/* <Link to="/verify"> Verify </Link> */}
        <a href="https://34.101.36.152:8442/ejbca/ra/index.xhtml" target='_blank' rel="noreferrer">Get Certificate</a>
        {/* <Link to="/getcertificate"> Get Certificate </Link> */}
        <button onClick={toggleNavbar}>
          <ReorderIcon />
        </button>
      </div>
    </div>
  );
}

export default Navbar;
