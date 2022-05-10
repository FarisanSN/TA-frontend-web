import React from "react";
import "../styles/Signing.css";
import SignPDF from "./SignPDF.js";
import Navbar from "../components/Navbar";
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';


function Signing() {
  const [document, setDocument] = React.useState();
  const [certificate, setCertificate] = React.useState();
  const [password, setPassword] = React.useState();
  const [result, setResult] = React.useState();
  const [reason, setReason] = React.useState();
  const [passwordShown, setPasswordShown] = React.useState(false);
  const [docname, setDocname] = React.useState();
  const [certname, setCertname] = React.useState();
  const togglePassword = () => {
    setPasswordShown(!passwordShown);
  };
  
  const notifySuccess = () => {
    toast.success('Dokumen bertanda tangan berhasil dibuat!', {position: toast.POSITION.TOP_CENTER})
  };

  const notifyFail = () => {
    toast.error('Password Salah!!!', {position: toast.POSITION.TOP_CENTER})
  };

  async function signDocument() {
    const pdfBuffer = new SignPDF(
      document,
      certificate,
      password
    );

    try {
      const signedDocs = await pdfBuffer.signPDF(reason);
      //const pdfFileName = `signed-document.pdf`;
      var fileURL = URL.createObjectURL(new Blob([signedDocs], {type: 'application/pdf'}));
      setResult(fileURL);
      notifySuccess()
      console.log(`New Signed PDF created!`);
    } catch(err) {
      notifyFail()
    }
    
  }

  function onChangeDocument(event) {
    event.stopPropagation();
    event.preventDefault();
    const reader = new FileReader()
    reader.onload = async (event) => { 
      setDocument(event.target.result)
    };
    reader.readAsArrayBuffer(event.target.files[0])
    setDocname(event.target.files[0].name)
  }

  function onChangeCertificate(event) {
    event.stopPropagation();
    event.preventDefault();
    const reader = new FileReader()
    reader.onload = async (event) => { 
     setCertificate(event.target.result)
    };
    reader.readAsArrayBuffer(event.target.files[0])
    setCertname(event.target.files[0].name)
  }

  function onChangePassword(event) {
    setPassword(event.target.value)
  }

  function onChangeReason(event) {
    setReason(event.target.value)
  }

  return (
    <div className="signing">
      <Navbar/>
        <div className="signingContent">
        <h1 className="signingTitle">Signing</h1>
          <div>
            <label for='document'>
              File PDF
            </label>
            <input type='file' id='document' accept="application/pdf" onChange={onChangeDocument}/>
            <label for='docname'>{docname}</label>
          </div>
          <div>
            <label for='certificate'>
              File Sertifikat
            </label>
            <input type='file' id='certificate' accept=".p12" onChange={onChangeCertificate}/>
            <label for='certname'>{certname}</label>
          </div>
          <div>
            <input type={passwordShown ? "text" : "password"} placeholder="Password" id="password" onChange={onChangePassword}/>
            <button id="showpass" onClick={togglePassword}>
              Show
            </button>
          </div>
          <div>
            <input id="reason" placeholder="Alasan" onChange={onChangeReason}/>
          </div>
          <button id="signbutton" onClick={signDocument}>Sign</button>
          <ToastContainer/>
          {result && <a id="download" href={result} target='_blank' rel="noreferrer">Download</a>}
        </div>
    </div>
  );
}

export default Signing;
