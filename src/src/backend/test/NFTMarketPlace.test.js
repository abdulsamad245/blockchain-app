const { expect } = require("chai");

const toWei = (num) => ethers.utils.parseEther(num.toString());
const fromWei = (num) => ethers.utils.formatEther(num);

describe("NFTMarketplace", function(){
    let deployer, addr1, addr2, nft, marketplace;
    let feePercent = 1;
    let URI = "sample URL";
    
    beforeEach(async function(){
        //Get contract factories
        const NFT = await ethers.getContractFactory("NFT");
        const Marketplace = await ethers.getContractFactory("Marketplace");

        [deployer, addr1, addr2] = await ethers.getSigners();

        //Deploy contracts

        nft = await NFT.deploy();
        marketplace = await Marketplace.deploy(feePercent);
    });

    describe("Deployment", function(){
        it("Tracks symbol of the nft collection", async function(){
            expect(await nft.name()).to.equal("DApp NFT")
            expect(await nft.symbol()).to.equal("DAPP")
            
        });
        it("Tracks the fee account and fee percent of the marketplace", async function(){
            expect(await marketplace.feeAccount()).to.equal(deployer.address)
            expect(await marketplace.feePercent()).to.equal(feePercent)
        
        });
    });
    describe("Minting NFTs", function(){
        it("Tracks minted NFT 1", async function(){
            //addr1 mints an nft
            await nft.connect(addr1).mint(URI);
            expect(await nft.tokenCount()).to.equal(1)
            expect(await nft.balanceOf(addr1.address)).to.equal(1)
            expect(await nft.tokenURI(1)).to.equal(URI)

            await nft.connect(addr2).mint(URI);
            expect(await nft.tokenCount()).to.equal(2)
            expect(await nft.balanceOf(addr2.address)).to.equal(1)
            expect(await nft.tokenURI(2)).to.equal(URI)
            
        });
        // it("Tracks minted NFT 2", async function(){
        //     //addr1 mints an nft
        //     await nft.connect(addr2).mint(URI);
        //     expect(await nft.tokenCount()).to.equal(2)
        //     expect(await nft.balanceOf(addr2.address)).to.equal(1)
        //     expect(await nft.tokenURI(2)).to.equal(URI)
            
        // });
    });

describe("Making marketplace items", async function () {
    let price = 1
        beforeEach(async function () {
           //addr 1 mints an nft
           await nft.connect(addr1).mint(URI);
           //addr 2 approves market place to spend nft
           await nft.connect(addr1).setApprovalForAll(marketplace.address, true) 
        });
    
           
    it("Tracks newly created item, transfer NFT from seller to marketplace and emit offered event", async function () {
    await expect(marketplace.connect(addr1).makeItem(nft.address, 1, toWei(1)))
    .to.emit(marketplace, "Offered")
    .withArgs(
        1,
        nft.address,
        1,
        toWei(1),
        addr1.address
    )
    //Marketplace should now own the NFT
    expect(await nft.ownerOf(1)).to.equal(marketplace.address);
    expect(await marketplace.itemCount()).to.equal(1);
    
    const item = await marketplace.items(1);
    expect(item.itemId).to.equal(1);
    expect(item.nft).to.equal(nft.address);
    expect(item._token_id).to.equal(1);
    expect(item.price).to.equal(toWei(1));
    expect(item.sold).to.equal(false);
    })
    
        it("Fails if price is set to zero", async function(){
            await expect(marketplace.connect(addr1).makeItem(nft.address, 1, 0)).to.be.revertedWith("Price must be greater than zero");
        })
    
    
    
    });

    describe("Purchasing marketplace items", function () {
        let price = 1;
        // let fee = (feePercent/100)*price
        let totalPriceInWei
        beforeEach(async function () {
            await nft.connect(addr1).mint(URI);
            await nft.connect(addr1).setApprovalForAll(marketplace.address, true);
            await marketplace.connect(addr1).makeItem(nft.address, 1, toWei(price));
            // let totalPriceInWei = await marketplace.getTotalPrice(1);
            console.log("initiiiiiiiiiiiiiiii");
        })
        it("Updates item as sold, pay seller, transfer NFT to buyer, charge fees and emit a Bought event", async function () {
            const sellerinitialEthBal = await addr1.getBalance();
            const feeAccountInitialEthBal = await deployer.getBalance();
            // console.log({feeAccountInitialEthBal, sellerinitialEthBal}, fromWei(sellerinitialEthBal));
            let totalPriceInWei = await marketplace.getTotalPrice(1);
        
            await expect(marketplace.connect(addr2).purchaseItem(1, { value : totalPriceInWei}))
            .to.emit(marketplace, "Bought")
            .withArgs(
                1,
                nft.address,
                1,
                toWei(price),
                addr1.address,
                addr2.address
            )

            // await deployer.sendTransaction({
            //     to: "0x70997970C51812dc3A010C7d01b50e0d17dc79C8",
            //     value: ethers.utils.parseEther("9999.0"), // Sends exactly 1.0 ether
            //   });

              console.log("balance", await ethers.provider.getBalance("0x70997970C51812dc3A010C7d01b50e0d17dc79C8"));
            // price_1 = toWei(price);
            console.log( await marketplace.connect(addr2).getStruct(1));
            const sellerFinalEthBal = await addr1.getBalance();
            const feeAccountFinalEthBal = await deployer.getBalance();
            console.log({feeAccountFinalEthBal,price},fromWei(sellerFinalEthBal));
            console.log(+price + +fromWei(sellerinitialEthBal));

            
        
            expect(+fromWei(sellerFinalEthBal)).to.equal(+price + +fromWei(sellerinitialEthBal))
        
            const fee = (feePercent / 100) * price;
        
            expect(+fromWei(feeAccountFinalEthBal)).to.equal(+fee + +fromWei(feeAccountInitialEthBal));
            expect(await nft.ownerOf(1)).to.equal(addr2.address);
            expect((await marketplace.items(1)).sold).to.equal(true);
        })
        it("Fails for invalid item ids, sold item and when not enough item is paid ", async function () {
            await expect(
                marketplace.connect(addr2).purchaseItem(2, { value : totalPriceInWei})).to.be.revertedWith("Item doesn't exist");
            await expect(
                marketplace.connect(addr2).purchaseItem(0, { value : totalPriceInWei})).to.be.revertedWith("Item doesn't exist");
            
            await expect(
                marketplace.connect(addr2).purchaseItem(1, { value : toWei(price)})
            )
            .to.be.revertedWith("not enough ether to cover item price and market fee");

             

            console.log("balance", await ethers.provider.getBalance("0x70997970C51812dc3A010C7d01b50e0d17dc79C8"));
            // console.log(totalPriceInWei);
            let addr3 = await  (ethers.getSigners());
            console.log(addr3);
 
            var a = [5,4,6];
            [f] = a; 
            console.log(typeof(a),f);
            await marketplace.connect(addr2).purchaseItem(1, { value :toWei(2*price)})
            // await marketplace.connect(addr3[3]).purchaseItem(1, { value :toWei(2*price)})1`c

            console.log("balance", await ethers.provider.getBalance(deployer.address));
        
            await expect(
                marketplace.connect(deployer).purchaseItem(1, { value :toWei(2*price)})
            ).to.be.revertedWith("item already sold");
     
                
        })
        })


   
}) 





