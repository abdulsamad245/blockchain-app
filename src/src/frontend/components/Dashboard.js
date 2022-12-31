import { useState, useEffect } from 'react'
import {toast, ToastContainer } from "react-toastify";
import { ethers } from "ethers"
import AdminMarketplaceItems from "./Admin"
import MyListedItems from "./MyListedItems.js"
import MyPurchasedItems from "./MyPurchasedItems.js"
import MyRegisteredItems from "./MyRegisteredItems.js"
import CertGen from "./CertGen.js"
import { Row, Col, Card, Button } from 'react-bootstrap'
import BigNumber from 'bignumber';
import Certificate from "./certificate.js"
import { Spinner } from 'react-bootstrap'
import icon from "./icon.png";

const Dashboard = ({ marketplace, nft, account, registeritems }) => {
  const [owner, setOwner] = useState("")

  const getUserRole = async () => {
     console.log("init....");
    const owner =  await marketplace.getOwner()
    console.log({owner});
    
  }

useEffect(() => {
  getUserRole()
})

  return(
  owner.toLowerCase() === account.toLowerCase() ? 
  (
     <AdminMarketplaceItems/>
  ):
  (
  <>
  <MyListedItems  marketplace={marketplace} nft={nft} account={account}/>
  <MyPurchasedItems  marketplace={marketplace} nft={nft} account={account}/>
  <MyRegisteredItems certGen={CertGen} registeritems={registeritems} nft={nft} account={account}/>
  </>
  ));
        
  }

export default Dashboard;