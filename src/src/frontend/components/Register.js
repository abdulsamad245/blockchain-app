import { useState } from 'react'
import { ethers } from "ethers"
import { Row, Form, Button } from 'react-bootstrap'
import CryptoJS from "crypto-js"
import {toast, ToastContainer } from "react-toastify";
import 'react-toastify/dist/ReactToastify.min.css'; 
import { Buffer } from 'buffer'
const ipfsClient = require('ipfs-http-client')

const Register = ({ marketplace, nft, registeritems }) => {
  const [image, setImage] = useState('')
  const [price, setPrice] = useState(null)
  const [name, setName] = useState('')
  const [phone, setPhone] = useState('')
  const [address, setAddress] = useState('')
  const [documentHash, setDocumentHash] = useState(null);
  const [description, setDescription] = useState('')
  const [location, setLocation] = useState('')
  const [registerButton, setRegisterButton] = useState('Register!')
  const [isRegistered, setRegistered] = useState(false);
  const [disabled, setDisabled] = useState();

const projectId = '2IJSOKQiianytdqVQZBsUrB81gm';   // <---------- your Infura Project ID

const projectSecret = '3dc29d23ac68c767ebd466f78777c928';  // <---------- your Infura Secret
// (for security concerns, consider saving these values in .env files)

const auth = 'Basic ' + Buffer.from(projectId + ':' + projectSecret).toString('base64');




const client = ipfsClient.create({
    host: 'ipfs.infura.io',
    port: 5001,
    protocol: 'https',
    headers: {
        authorization: auth,
    },
});
  const uploadToIPFS = async (event) => {
    console.log("init");
    setImage(event.target.files[0]);
    event.preventDefault()
    const file = event.target.files[0]
    if (typeof file !== 'undefined') {
      try {
        const result = await client.add(file);
        console.log(result.path);
        setImage(`https://polygonhackathon.infura-ipfs.io/ipfs/${result.path}`);
        hashDocument(file);
      } catch (error){
        console.log("ipfs image upload error: ", error)
      }
    }
  }
 

const hashDocument = async (file) => {
    var reader = new FileReader();
        
        reader.readAsArrayBuffer(file);
        
            reader.onload = function () {
                
                var file_result = this.result; 
                var file_wordArr = CryptoJS.lib.WordArray.create(file_result);
                var sha256_hash = CryptoJS.SHA256(file_wordArr); 
                var Hash = sha256_hash.toString(); //output result
                setDocumentHash(Hash)
                console.log({Hash});
            }

  }


          

  const handleRegister = async (result) => {
    while (documentHash === null) toast.info("Please re-upload the document and try again!");  
    console.log("init3");
    const filter =  registeritems.filters.Registered(null,null,null,null,null,null,null,null,null,null,null,documentHash);
    const filtered_result = await registeritems.queryFilter(filter);
    console.log({filtered_result},filter);
    // console.log(await registeritems.registeredItems(3))
    console.log(filtered_result.length);
    if (!filtered_result.length) {
    console.log("init...");
    const uri = `https://polygonhackathon.infura-ipfs.io/ipfs/${result.path}[0]`
    console.log(uri);
    // mint nft 
  
    await(await nft.mint(uri)).wait();
    // get tokenId of new nft 
    const id = await nft.tokenCount();
    const id1 = await nft.getOwner();
    console.log("number",id1,id.toNumber());
    // approve marketplace to spend nft
    await(await nft.setApprovalForAll(registeritems.address, true)).wait()
    const toWei = (num) => ethers.utils.parseEther(num.toString());
    // add nft to marketplace
    const listingPrice = toWei(1);
    await(await registeritems.registerItem(nft.address, name, id, listingPrice, description, location, phone, address, image,documentHash)).wait();
    toast.info("Item added successfully!");
  }else {
    setRegistered(true)
    toast.error("This item has already been registered with this document!");
    return;
  }
   
  }


  const registerItem = async () => {
    setDisabled(true);
    setRegisterButton("Please wait!")
    console.log("init");
    if (!image || !location || !description || !location){
        toast.error("All fields are required!");
        setDisabled(false);
        setRegisterButton("Register Item!")
        return;

    } 
    try{ 
      const result = await client.add(JSON.stringify({name, image, price, name, description, location, phone, address, image, documentHash}))
      handleRegister(result)
      
      setRegisterButton("Register Item!")
      setDisabled(false)
      console.log("init2");
    } catch(error) {
      toast.error("An error occured. Please check your network and try again!");
      setRegisterButton("Register Item!");  
      setDisabled(false);
      console.log("ipfs uri upload error: ", error)

    }

  }

  return (
    <>
      <div className="div-h1">
    <h1 className="page-title">Register Item</h1>
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
                onChange={uploadToIPFS}
              />
              <Form.Control onChange={(e) => setName(e.target.value)} size="lg" required type="text" placeholder="Name" />
              <Form.Control onChange={(e) => setPhone(e.target.value)} size="lg" required type="text" placeholder="Phone or Email" />
              <Form.Control onChange={(e) => setAddress(e.target.value)} size="lg" required type="text" placeholder=" Your Adddress" />
              <Form.Control onChange={(e) => setDescription(e.target.value)} size="lg" required as="textarea" placeholder="Item's Description" />
              <Form.Control onChange={(e) => setLocation(e.target.value)} size="lg" required as="textarea" placeholder="Item's Location" />
              {/* <Form.Control onChange={(e) => setPrice(e.target.value)} size="lg" required type="number" placeholder="Price in ETH" /> */}
             
              <div className="d-grid px-0">
                <Button className="theme-primary" disabled={disabled} onClick={registerItem} variant="primary" size="lg">
                  {registerButton}
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


export {Register,};