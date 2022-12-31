import { useState, useEffect } from 'react'
import {toast, ToastContainer } from "react-toastify";
import { ethers } from "ethers"
import MyListedItems from "./MyListedItems.js"
import MyPurchasedItems from "./MyPurchasedItems.js"
import MyRegisteredItems from "./MyRegisteredItems.js"
import { Row, Col, Card, Button } from 'react-bootstrap'
import BigNumber from 'bignumber';
import { Spinner } from 'react-bootstrap'
import icon from "./icon.png";

const Admin = ({ marketplace, nft, account, registeritems }) => {
  const [loading, setLoading] = useState(true)
  const [items, setItems] = useState([])
  const [itemRegister, setItemRegister] = useState([])
  const [approve, setApprove] = useState("Approve")
  const [disapprove, setDisapprove] = useState("Disapprove")
  
  const AdminMarketplaceItems = async () => {
    const itemCount = await marketplace.itemCount();
    const itemCountRegister = await registeritems.itemCount();
    const owner =  await marketplace.getOwner() 
      let itemsMarketPlace = []
      let itemsRegister = []
      for (let i = 1; i <= itemCount; i++) {
        const item = await marketplace.saleItems(i);
        console.log({item},{itemCountRegister});
        itemsMarketPlace.push(item);
        
      };
      console.log({itemsMarketPlace});
      setItems(itemsMarketPlace);
      console.log({items},itemCount.toNumber());
      for (let i = 1; i <= itemCountRegister; i++) {
        const itemRegister = await registeritems.registeredItems(i);
          itemsRegister.push(itemRegister);
          console.log({itemRegister});
      };
      setItemRegister(itemsRegister);
      
        
      setLoading(false)
  
  }
    
  const validateSell = async (id) => {
    const isVerified = await marketplace.handleApprove(id);
    isVerified ? toast.info("Item approved!") : toast.info("Item disapproved!")
    AdminMarketplaceItems();
    console.log({isVerified}, id.toNumber());
  }
  const validateRegister = async (id) => {
    const isVerified = await registeritems.handleApprove(id);
    isVerified ? toast.info("Item approved!") : toast.info("Item disapproved!")
     const itemRegister = await registeritems.registeredItems(id)
     console.log(itemRegister.approved);
    AdminMarketplaceItems()
    console.log({isVerified});
    console.log({itemRegister});
   

  }

  useEffect(() => {
   AdminMarketplaceItems()
  }, []);

  if (loading) return (
    <main style={{ padding: "1rem 0", justifyContent: 'center' }}>
      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '80vh' }}>
                      <Spinner animation="border" style={{ display: 'flex' }} />
                      <p className='mx-3 my-0'>Loading contents, please wait!</p>
                    </div>
    </main>
  )
  return(  
    <>
    <div className="div-h1">
    <h1 className="page-title">Admin DashBoard</h1>
    </div>
    <div className="row justify-content-center mt-10">
    <div className="col-md-8 table-responsive ">
      <table className="table table-bordered">
        <thead className="table-dark">
    <tr>
      <th scope="col">#</th>
      <th scope="col">TYPE</th>
      <th scope="col">NAME</th>
      <th scope="col">DESCRIPTION</th>
      <th scope="col">NFT'S ADDRESS</th>
      <th scope="col">PRICE</th>
      <th scope="col">LOCATION</th>
      <th scope="col">SELLER'S ADDRESS(WALLET)</th>
      <th scope="col">PHONE</th>
      <th scope="col">DOCUMENT</th>
      <th scope="col">SOLD STATUS</th>
      <th scope="col">ADDRESS(LOCATION)</th>
      <th scope="col">VALIDATE</th>
    </tr>
  </thead>
  <tbody>
    <>
       {itemRegister && itemRegister.map((item, idx) => (
              <tr key={idx}>
              <th scope="row">{idx+1}</th>
              <td><Button className="btn-info">REGISTER ITEM</Button></td>
              <td>{item.name}</td>
              <td>{item.description}</td>
              <td>{item.nft}</td>
              <td>NA</td>
              <td>{item.location}</td>
              <td>{item.registrant}</td>
              <td>{item.phone_address.split("[--]")[0]}</td>
              <td> <a className="btn btn-info" href={item.image_url} target="blank">VIEW IMAGE</a></td>
              <td>{item.sold ? "SOLD" : "NOT SOLD"}</td>
              <td>{item.phone_address.split("[--]")[1]}</td>
              <td>
                <Button title={!item.approved ? "Set item's status to approved" : "Set item's status to disapproved"} className={!item.approved ? "btn-danger approve" : "btn-success disapprove"} onClick={() => validateRegister(item._token_id)} variant="primary" size="lg"> {!item.approved ? approve : disapprove} </Button>
              </td>

            </tr>  
       ))}
       {items && items.map((item, idx) => (
               <tr key={itemRegister.length+idx+1}>
             <th scope="row">{itemRegister.length+idx+1}</th>
              <td><Button className="btn-success">SALE ITEM</Button></td>
              <td>{item.name}</td>
              <td>{item.description}</td>
              <td>{item.nft}</td>
              <td>price</td>
              <td>{item.location}</td>
              <td>{item.seller}</td>
              <td>{item.phone}</td>
              <td> <a className="btn btn-info" href={item.image_url} target="blank">VIEW IMAGE</a></td>
              <td>{item.sold ? "SOLD" : "NOT SOLD"}</td>
              <td>{item.phone_address}</td>
              <td>
                <Button title={!item.approved ? "Set item's status to approved" : "Set item's status to disapproved"} className={!item.approved ? "btn-danger approve" : "btn-success disapprove"} onClick={() => validateSell(item._token_id)} variant="primary" size="lg"> {!item.approved ? approve : disapprove} </Button>
              </td>

            </tr>  
       ))}

       </>
  </tbody>
</table>
      </div>
    </div>
    
    </>
  
  );
        
  }

export default Admin;