import { useState, useEffect } from 'react'
import { ethers } from "ethers"
import { Row, Col, Card, Spinner } from 'react-bootstrap'

function MyListedItems({ marketplace, nft, account }) {
  console.log({account});
  const [loading, setLoading] = useState(true)
  const [listedItems, setListedItems] = useState([])
  const loadListedItems = async () => {
    // Load all sold items that the user listed
    const itemCount = await marketplace.itemCount()
    let listedItems = []
    for (let cnt = 1; cnt <= itemCount; cnt++) {
      const i = await marketplace.saleItems(cnt)
      console.log({i},i.seller.toLowerCase(),{account});
      
      
      if (i.seller.toLowerCase() === account.toLowerCase()) {
        console.log("jwjhwhjwej");
        // get uri url from nft contract
        let uri = await nft.tokenURI(i._token_id)
        uri = uri.replace("[1]", "")
        console.log({uri})
        // use uri to fetch the nft metadata stored on ipfs 
        const response = await fetch(uri)
        const metadata = await response.json()
        // get total price of item (item price + fee)
        const totalPrice = await marketplace.getTotalPrice(i.itemId)
        // define listed item object
        let myItems = {
          totalPrice,
          price: i.price,
          itemId: i.itemId,
          name: metadata.name,
          description: metadata.description,
          image: metadata.image,
          isApproved: i.approved,
          isSold: i.sold

        }

        listedItems.push(myItems)
        console.log("jwjhwhjwej",22222);
      }
    }
    setLoading(false)
    setListedItems(listedItems)
  }
  useEffect(() => {
    loadListedItems()
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
      <div className="div-h1">
    <h1 className="page-title">MY LISTED ITEMS</h1>
    </div>
    <div className="flex justify-center">
    {listedItems.length > 0 ?
      <div className="px-5 container">
        <Row xs={1} md={2} lg={4} className="g-4 py-5">
          {listedItems.map((item, idx) => (
            <Col key={idx} className="overflow-hidden">
              <Card>
                <Card.Img variant="top" src={item.image} />
                <Card.Body color="secondary">
                  <Card.Text><div className="title">Item's Name </div>{item.name}</Card.Text>
                  <Card.Text>
                  <div className="title">Item's Description </div>{item.description}
                  </Card.Text>
                  <Card.Text>
                  <div className="title">Item's price </div>{ethers.utils.formatEther(item.price)}  ETH
                  </Card.Text>
                </Card.Body>
                  <Card.Text>
                  <div className="title">Approval Status</div>{item.approved}
                  </Card.Text>
                  <Card.Text>
                  <div className="title"> Sold</div>{item.sold}
                  </Card.Text>
                  {}
              </Card>
            </Col>
          ))}
        </Row>
      </div>
      : (
        <main style={{ padding: "1rem 0" }}>
          <h2>No listed items</h2>
        </main>
      )}
  </div>
  </>
  );
        
  
}
export default MyListedItems;