import React from "react";
import { Link } from "react-router-dom";
import BannerImage from "../assets/plain.jpeg";
import "../styles/Home.css";

function Home() {
  return (
    <div className="home" style={{ backgroundImage: `url(${BannerImage})` }}>
      <div className="headerContainer">
        <div>
          {/* <img link="../assets/itb.png" alt="sasas"></img> */}
          <h1>Tanda Tangan Digital</h1>
          <p>Menggunakan Infrastruktur Kunci Publik</p>
        </div>
        <div>  
          <Link to="/signing">
            <button id="Sign">Sign</button>
          </Link>
            <a href="http://34.101.251.251:8080/" target='_blank' rel="noreferrer">
              <button id="Verify">Verify </button>
            </a>
            <a href="http://google.com/" target='_blank' rel="noreferrer">
              <button id="ejbca">Get Certificate </button>
            </a>
        </div>
      </div>
    </div>
  );
}

export default Home;
