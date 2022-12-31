import {
  BrowserRouter,
  Routes,
  Route
} from "react-router-dom";
import Navigation from './Navbar';
import Home from './Home.js'
import Sell from './Sell.js'
import {Register} from './Register.js'
import Dashboard from './Dashboard.js'
import MyPurchasedItems from './MyPurchasedItems.js'
import Verify from './Verify.js'
import Admin from './Admin.js'
import CertGen from './CertGen.js'
import MarketplaceAbi from '../contractsData/Marketplace.json'
import MarketplaceAddress from '../contractsData/Marketplace-address.json'
import NFTAbi from '../contractsData/NFT.json'
import NFTAddress from '../contractsData/NFT-address.json'
import RegisteritemsAbi from '../contractsData/Registeritems.json'
import RegisteritemsAddress from '../contractsData/Registeritems-address.json'
import { useState, useEffect } from 'react'
import { ethers } from "ethers"
import { Spinner } from 'react-bootstrap'
import { Button } from 'react-bootstrap'
import {toast, ToastContainer } from "react-toastify";

import './App.css';

function App() {
  const [loading, setLoading] = useState(true)
  const [isMetamaskInstalled, setIsMetamaskInstalled] = useState(false)
  const [connected, setConnected] = useState(false)
  const [account, setAccount] = useState(null)
  const [nft, setNFT] = useState({})
  const [marketplace, setMarketplace] = useState({})
  const [walletAddress, setWallet] = useState("");
  const [registeritems, setRegisterItem] = useState("");

    // Get provider from Metamask
    const provider = new ethers.providers.Web3Provider(window.ethereum)
    // Set signer
    const signer = provider.getSigner()

  useEffect(async () => {
    const { address} = await getCurrentWalletConnected();
    console.log(address);
    if (address) {
      setConnected(true);
      setAccount(address);
      loadContracts(signer);
      setLoading(false);
    }
    addWalletListener();
  }, []);

  const addWalletListener = () => {
    window.ethereum.on('chainChanged', (chainId) => {
      window.location.reload();
    })

    window.ethereum.on('accountsChanged', async function (accounts) {
      setAccount(accounts[0])
      await web3Handler()
    })
  } 

  // MetaMask Login/Connect
  const web3Handler = async () => {
    if (!account) {
      const accounts = await window.ethereum.request({ method: 'eth_requestAccounts' });
      setAccount(accounts[0]);
      setConnected(true);
    }
    
    loadContracts(signer);
    setLoading(false);
    addWalletListener();
  }

  const getCurrentWalletConnected = async () => {
    if (window.ethereum) {
      setIsMetamaskInstalled(true);
      try {
        const addressArray = await window.ethereum.request({
          method: "eth_accounts",
        });
        if (addressArray.length > 0) {
          return {
            address: addressArray[0]
          };
        } else {
          return {
            address: null
          };
        }
      } catch (err) {
        return {
          address: null
        };
      }
    }
  }
  const loadContracts = async (signer) => {
    // Get deployed copies of contracts
    const marketplace = new ethers.Contract(MarketplaceAddress.address, MarketplaceAbi.abi, signer)
    setMarketplace(marketplace)
    const nft = new ethers.Contract(NFTAddress.address, NFTAbi.abi, signer)
    const registeritems = new ethers.Contract(RegisteritemsAddress.address, RegisteritemsAbi.abi, signer)
    setRegisterItem(registeritems);
    console.log(nft.owner === marketplace.owner,marketplace.getOwner());
    console.log(nft, marketplace)
    setNFT(nft)
    setLoading(false)
  }


  const Footer = () => {
    const year = new Date().getFullYear();
  
    return(
      <footer id="footer-Section">
    <div className="footer-bottom-layout">
      <div className="copyright-tag">{`Copyright © ${year} BLOCK TRANXACT. All Rights Reserved.`}</div>
    </div>
  </footer>
    )
  }

  const handle = () => {
    console.log("Init....");
  }
  return (
    <>
    <ToastContainer position='top-center' />
    <BrowserRouter>
      <div className="App">
        <>
          <Navigation web3Handler={web3Handler} account={account} />
        </>
        <div>
          {isMetamaskInstalled ? 
                  (loading ? (
                    <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '80vh' }}>
                      <Spinner animation="border" style={{ display: 'flex' }} />
                      <p className='mx-3 my-0'>{connected ? (<span>Please wait, connecting to blockchain...</span>) : (<><span>Please connect your wallet to access the contents of this site!</span> <div  className="connect-mobile"><Button onClick={handle} className="connect-mobile" variant="outline-light">Connect Wallet</Button></div></>)}</p>
                    </div>
                  ) : (
                    <Routes>
                      <Route path="/" element={
                        <Home marketplace={marketplace} nft={nft} account={account} />
                      } />
                      <Route path="/register-item" element={
                        <Register marketplace={marketplace} nft={nft} registeritems={registeritems} />
                      } />
                      <Route path="/sell-item" element={
                        <Sell marketplace={marketplace} nft={nft}  registeritems={registeritems} />
                      } />
                      <Route path="/dashboard" element={
                        <Dashboard marketplace={marketplace} nft={nft} account={account}  registeritems={registeritems} />
                      } />
                      <Route path="/verify-item" element={
                        <Verify marketplace={marketplace} nft={nft} account={account} registeritems={registeritems}/>
                      } />
                      <Route path="/admin" element={
                        <Admin marketplace={marketplace} nft={nft} account={account} registeritems={registeritems}/>
                      } />
                      {/* <Route path="/cert" element={
                        <CertGen marketplace={marketplace} nft={nft} account={account} registeritems={registeritems}/>
                      } /> */}
                    </Routes>
                  )) : ( <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '80vh' }}>
                  <Spinner animation="border" style={{ display: 'flex' }} />
                  <p className='mx-3 my-0'><a href="">Please install Metamask to use this site!</a></p>
                </div> )
        
        }

        </div>
      </div>
    </BrowserRouter>
    <Footer/>
    </>

  );
}

export default App;

