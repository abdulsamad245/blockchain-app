import { useState, useEffect } from 'react'
import { ethers } from "ethers"
import { Row, Col, Card, Button } from 'react-bootstrap'
import { Spinner } from 'react-bootstrap'

const Home = ({ marketplace, nft, account }) => {
  const [loading, setLoading] = useState(true)
  const [items, setItems] = useState([])
  const [owner, setOwner] = useState("");

  const MarketplaceItems = async () => {
    const itemCount = await marketplace.itemCount();
    const owner =  await marketplace.getOwner()
    console.log("Owner =>",owner);
    console.log("compare",owner == account);
    setOwner(owner);
    console.log({itemCount});

    let items = []
    for (let i = 1; i <= itemCount; i++) {
      const item = await marketplace.saleItems(i);
      console.log("Count",itemCount.toNumber());
      
      if (!item.sold && item.approved) {
        let uri = await nft.tokenURI(item._token_id);
        uri = uri.toString().replace("[1]","");
        if (uri[uri.length-2] == 0) continue;
        console.log({uri});
        
        // use uri to fetch the nft metadata stored on ipfs 
        const response = await fetch(uri)
        const metadata = await response.json()

        const totalPrice = await marketplace.getTotalPrice(item.itemId)
        // Add item to items array
        items.push({
          totalPrice,
          itemId: item.itemId,
          seller: item.seller,
          name: metadata.name,
          description: metadata.description,
          image: metadata.image,
          phone: item.phone
        })
        console.log('2');
      }
    }
    setLoading(false)
    setItems(items)
    console.log(items);
  }




  const buyMarketItem = async (item) => {
    await (await marketplace.purchaseItem(item.itemId, { value: item.totalPrice })).wait()
    MarketplaceItems()
  }

  useEffect(() => {
    MarketplaceItems();
  },[])

  if (loading) return (
    <main style={{ padding: "1rem 0", justifyContent: 'center' }}>
      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '80vh' }}>
                      <Spinner animation="border" style={{ display: 'flex' }} />
                      <p className='mx-3 my-0'>Loading contents, please wait!</p>
                    </div>
    </main>
  )
  return (
    <div className="flex justify-center">

      {items.length > 0 ?
        <div className="px-5 container">
          <Row xs={1} md={2} lg={4} className="g-4 py-5">
            {items.map((item, idx) => (
              <Col key={idx} className="overflow-hidden">
                <Card>
                  <Card.Img variant="top" src={item.image} />
                  <Card.Body color="secondary">
                    <Card.Text><div className="title">Item's Name </div>{item.name}</Card.Text>
                    <Card.Text>
                    <div className="title">Item's Description </div>{item.description}
                    </Card.Text>
                    <Card.Text>
                    <div className="title">Phone Number </div>{item.phone}
                    </Card.Text>
                    {/* <Card.Text>
                    <div className="title">Item's price </div>{ethers.utils.formatEther(item.totalPrice)}  ETH
                    </Card.Text> */}
                  </Card.Body>
                  <Card.Footer>
                    <div className='d-grid'>
                      <Button onClick={() => buyMarketItem(item)} variant="primary" size="lg">
                        BUY FOR {ethers.utils.formatEther(item.totalPrice)}  ETH
                      </Button>
                    </div>
                  </Card.Footer>
                </Card>
              </Col>
            ))}
          </Row>
        </div>
        : (
          <main style={{ padding: "1rem 0" }}>
            <h2>No listed assets</h2>
          </main>
        )}
    </div>
  );
}
export default Home;