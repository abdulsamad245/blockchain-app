import { useState } from 'react'
import { ethers } from "ethers"
import { Row, Form, Button } from 'react-bootstrap'
import CryptoJS from "crypto-js"
import {sha1,sha256,sha384,sha512} from 'crypto-hash';
import { saveAs } from 'file-saver';
import {toast, ToastContainer } from "react-toastify";
import 'react-toastify/dist/ReactToastify.min.css'; 
import { Buffer } from 'buffer'
const ipfsClient = require('ipfs-http-client')


const Verify = ({ marketplace, nft, registeritems }) => {
  const [documentHash, setDocumentHash] = useState('');
  const [documentId, setDocumentId] = useState('');
  const [description, setDescription] = useState('')
  const [location, setLocation] = useState('');
  const [verifyButton, setVerifyButton] = useState('Verify!');
  const [disabled, setDisabled] = useState();
  const [loading, setLoading] = useState(true);
  const [isVerified, setVerified] = useState(false);
 

const hashDocument = async (event) => {
    var reader = new FileReader();
        
        reader.readAsArrayBuffer(event.target.files[0]);
        
            reader.onload = function () {
                
                var file_result = this.result; 
                var file_wordArr = CryptoJS.lib.WordArray.create(file_result);
                var sha256_hash = CryptoJS.SHA256(file_wordArr); 
                var Hash = sha256_hash.toString(); //output result
                setDocumentHash(Hash)
                console.log({Hash});
            }

  }

  



  const verifyItem = async () => {
    setDisabled(true);
    if (!documentId && !documentHash){
        setDisabled(false);
        toast.error("All fields are required!")
        return;

  }


    // Fetch purchased items from marketplace by quering Offered events with the buyer set as the user
    const filter =  registeritems.filters.Registered(null,null,null,null,null,null,null,documentHash);
    const filtered_result = await registeritems.queryFilter(filter);
    const filter_id =  registeritems.filters.Registered(null,null,null,null,null,null,null,documentId);
    const filtered_id_result = await registeritems.queryFilter(filter_id);
    console.log(filtered_result);
    if (filtered_result.length || filtered_id_result) {
        setVerified(true);
        toast.info("Item verified successfully!")
        setDisabled(false);
    }else {
        setVerified(false);
        toast.error("Item verification failed!")
        setDisabled(false);
    }
}
    


  return (
    <>
      <div className="div-h1">
    <h1 className="page-title">Verify Item</h1>
    </div>
    <div className="container-fluid mt-5">
      <div className="row justify-content-center">
        <main role="main" className="col-md-6" style={{ maxWidth: '1000px' }}>
        <div className="content mx-auto">
            <Row className="g-4">
              <Form.Control
                type="file"
                required
                name="file"
                onChange={hashDocument}
              />
              <Form.Control onChange={(e) => setDocumentId(e.target.value)} size="lg" required type="text" placeholder="Enter certificate ID" />
              <div className="d-grid px-0">
                <Button className="theme-primary" disabled={disabled} onClick={verifyItem} variant="primary" size="lg">
                  {verifyButton}
                </Button>
              </div>
              </Row>
            </div>  
        </main>
      </div>
    </div>
    </>
  );
}



export default Verify;