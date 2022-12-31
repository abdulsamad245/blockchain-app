import { useState, useEffect } from 'react'
import certGen from "./CertGen.js"
import { ethers } from "ethers"
import { Row, Col, Card, Spinner, Button } from 'react-bootstrap'

function MyRegisteredItems({ registeritems, nft, account,certGen }) {
  console.log({account});
  const [loading, setLoading] = useState(true)
  const [itemsRegister, setItemsRegister] = useState([])
  const loadRegisteredItems = async () => {
    // Load all sold items that the user listed
    const itemCount = await registeritems.itemCount()
    console.log(itemCount.toNumber());
    let itemRegister = []
    for (let cnt = 1; cnt <= itemCount; cnt++) {
      const i = await registeritems.registeredItems(cnt)
      console.log(i.registrant.toLowerCase());
      if (i.registrant.toLowerCase() === account.toLowerCase()) {
            itemRegister.push(i);
            console.log({itemRegister});
        };
        setItemsRegister(itemRegister);
        console.log("wjewheh");
      
  }
  setItemsRegister(itemRegister);
  console.log(itemsRegister.length);
  setLoading(false)




}


  useEffect(() => {
    loadRegisteredItems()
  }, [])

  if (loading) return (
    <main style={{ padding: "1rem 0", justifyContent: 'center' }}>
      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '80vh' }}>
                      <Spinner animation="border" style={{ display: 'flex' }} />
                      <p className='mx-3 my-0'>Loading contents, please wait!</p>
                    </div>
    </main>
  )
  return (
    <>
    {/* <div className='d-grid'>
                      <Button onClick={() => setVisibility()} variant="primary" size="lg">
                        DOWNLOAD NFT CERTIFICATE
                      </Button>
                    </div>
                    <div style={{display:'none'}} className={visibility === 1 ? "visible" : "" }>
                      <HomePage name={"john"}/>
                    </div> */}
                    
      <div className="div-h1">
    <h1 className="page-title">MY REGISTERED ITEMS</h1>
    </div>
    <div className="flex justify-center">
    {itemsRegister.length > 0 ?
      <div className="px-5 container">
        <Row xs={1} md={2} lg={4} className="g-4 py-5">
          {itemsRegister.map((item, idx) => (
            <Col key={idx} className="overflow-hidden">
              <Card>
                <Card.Img variant="top" src={item.image_url} />
                <Card.Body color="secondary">
                  <Card.Text><div className="title">Item's Name </div>{item.name}</Card.Text>
                  <Card.Text>
                  <div className="title">Item's Description </div>{item.description}
                  </Card.Text>
                </Card.Body>
                  <Card.Text>
                  <div className="title">Approval Status</div>{item.approved ? "Approved" : "Not Approved"}
                  </Card.Text>
                  <Card.Text>
                  <div className="title"> NFT'S ADDRESS</div>{item.nft}
                  </Card.Text>
                  {item.approved && (
                  <Card.Footer>
                    <div className='d-grid'>
                      <Button onClick={() => certGen({name:item.name, description:item.desc, nft:item.nft, registrantAddress:item.registrant, document_id: item.documentHash})} variant="primary" size="lg">
                        DOWNLOAD NFT CERTIFICATE
                      </Button>
                    </div>
                  </Card.Footer>
                  )}
 
              </Card>
            </Col>
          ))}
        </Row>
      </div>
      : (
        <main style={{ padding: "1rem 0" }}>
          <h2>No registered items</h2>
        </main>
      )}
  </div>
  </>
  );
        
  
}
export default MyRegisteredItems;