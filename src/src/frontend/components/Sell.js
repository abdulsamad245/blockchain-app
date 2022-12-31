import { useState } from 'react'
import { ethers } from "ethers"
import { Row, Form, Button } from 'react-bootstrap'
import CryptoJS from "crypto-js"
import {toast, ToastContainer } from "react-toastify";
import 'react-toastify/dist/ReactToastify.min.css'; 
import { Buffer } from 'buffer'
const ipfsClient = require('ipfs-http-client')

const Sell = ({ marketplace, nft, registeritems }) => {
  const [image, setImage] = useState('');
  const [price, setPrice] = useState(null);
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('')
  const [address, setAddress] = useState('')
  const [description, setDescription] = useState('');
  const [location, setLocation] = useState('')
  const [documentHash, setDocumentHash] = useState('');
  const [sellButton, setSellButton] = useState('Sell!');
  const [disabled, setDisabled] = useState();
  const [isRegistered, setRegistered] = useState(false);


const projectId = '2IJSOKQiianytdqVQZBsUrB81gm';   // <---------- your Infura Project ID. Note: This was revealed for testing purpose

const projectSecret = '3dc29d23ac68c767ebd466f78777c928';  // <---------- your Infura Secret. Note: This was revealed for testing purpose

const auth = 'Basic ' + Buffer.from(projectId + ':' + projectSecret).toString('base64');




const client = ipfsClient.create({
    host: 'ipfs.infura.io',
    port: 5001,
    protocol: 'https',
    headers: {
        authorization: auth,
    },
});

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


  const uploadToIPFS = async (event) => {
    event.preventDefault()
    console.log("init...");
    const file = event.target.files[0]
    if (typeof file !== 'undefined') {
      try {
        const result = await client.add(file);
        console.log(result.path);
        setImage(`https://polygonhackathon.infura-ipfs.io/ipfs/${result.path}`);
        hashDocument(file)
      } catch (error){
        console.log("ipfs image upload error: ", error)
      }
    }
  }
  const sellItem = async () => {
    console.log("init...");
    setDisabled(true);
    if (!image || !price || !name || !description || !address || !phone){
      toast.error("All fields are required!")
        setDisabled(false);
        return;

    } 
    try{
      const result = await client.add(JSON.stringify({name, image, price, name, description, location, phone, address, documentHash}))
      handleSell(result)
      setDisabled(false)
    } catch(error) {
      toast.error("Failed. Please check your network and try again!");  
      setDisabled(false);
      console.log("ipfs uri upload error: ", error);
      toast.error("An error occured. Please check your network and try again!") ;

    }
  }
  const handleSell = async (result) => {
      while (documentHash === null) toast.info("Please re-upload the document and try again!");  
      register(result);
      sell(result);
}

const register = async (result) => {
  console.log("init3");
  const filter =  registeritems.filters.Registered(null,null,null,null,null,null,null,null,null,null,null,documentHash);
  const filtered_result = await registeritems.queryFilter(filter);
  console.log({filtered_result},filter);
  // console.log(await registeritems.registeredItems(3))
  console.log("length", filtered_result.length);
  if (!filtered_result.length) {
  console.log("init...");
  const uri = `https://polygonhackathon.infura-ipfs.io/ipfs/${result.path}`
  console.log(uri);
  // mint nft 

  await(await nft.mint(uri)).wait();
  // get tokenId of new nft 
  // const id = await nft.tokenCountRegister();
  const id = await nft.tokenCount();
  const id1 = await nft.getOwner();
  console.log("number",id1,id.toNumber());
  // approve marketplace to spend nft
  await(await nft.setApprovalForAll(registeritems.address, true)).wait()
  const toWei = (num) => ethers.utils.parseEther(num.toString());
  // add nft to marketplace
  const listingPrice = toWei(1);
  await(await registeritems.registerItem(nft.address, name, id, listingPrice, description, location, phone, address, image,documentHash)).wait();
  // await(await marketplace.sellItem(nft.address, id, 3, description, location)).wait();
}else {
  setRegistered(true);
  toast.error("This item has already been registered with this document!");
  return;
}
 
}


  const sell = async (result) => {
    if (isRegistered) return
    console.log("init...")
    const uri = `https://polygonhackathon.infura-ipfs.io/ipfs/${result.path}`;
    console.log(nft);
    const id = await nft.tokenCount();
    await(await nft.mint(uri)).wait();

    // approve marketplace to spend nft
    await(await nft.setApprovalForAll(marketplace.address, true)).wait()
    // add nft to marketplace
    const listingPrice = ethers.utils.parseEther(price.toString())
    await(await marketplace.sellItem(nft.address, name, id, listingPrice, description, location, phone, address, image, documentHash)).wait();
    toast.info("Item registered and added successfully!");
  }

  return (
    <>
    <div className="div-h1">
    <h1 className="page-title">Sell Item</h1>
    </div>
    <div className="container-fluid mt-5">
      <div className="row justify-content-center">
        <main role="main" className="col-md-6" style={{ maxWidth: '1000px' }}>
          <div className="content mx-auto">
            <Row className="g-4">
            <p>Upload document</p>
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
              <Form.Control onChange={(e) => setPrice(e.target.value)} size="lg" required type="number" placeholder="Price in ETH" />
              <div className="d-grid px-0">
                <Button className="theme-primary" disabled={disabled} onClick={sellItem} variant="primary" size="lg">
                  {sellButton}
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

export default Sell;