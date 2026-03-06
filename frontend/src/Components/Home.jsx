import { Component } from "react";
import { Container, Row, Col, Card, Button, Dropdown ,Spinner,Modal,Form } from "react-bootstrap";
import Bulb from 'react-bulb';
import { auctions } from "../Resources/auctions";
import {abi} from "../Resources/abi";
import {AiFillHeart} from 'react-icons/ai';
import {FaEthereum} from 'react-icons/fa';
import {TiPlus} from 'react-icons/ti';
import {Link} from 'react-router-dom';
import io from 'socket.io-client'
import NavBar from './NavBar';
var endpoint="http://localhost:4000";
const Web3 = require('web3');

const socket = io.connect(endpoint); //new change

class Home extends Component{
    constructor(props){
        super(props);
        this.state = {
            bulbColor:['#00cc00', '#fafafa' ],
            bulbColorIndex: 0,
            auctionFilter: ['Live', 'Upcoming', 'Ended', 'All'],
            auctionFilterActive: 'Live',
            auctions:[],
            b:0,
            connectwalletstatus: 'Connect Wallet',
            account_addr: '',
            web3: null,
            setshow:false,
            contractval:'',
            connect_web3_modal:false,
            metamask_installed:false,
            not_logged_in:false,
            auction_listed_modal:false,
        };
        this.addproducts=this.addproducts.bind(this);
        this.connect=this.connect.bind(this);
        this.initialiseAddress=this.initialiseAddress.bind(this);
        this.unixToDate=this.unixToDate.bind(this);
    }
   
 
    componentDidMount = () => {
        var tempvalas = (JSON.parse(localStorage.getItem('user')))
        if(tempvalas==null){
            window.location.href="http://localhost:3000";
        }
        setInterval(async() => {
            await this.setState({bulbColorIndex: (this.state.bulbColorIndex+1)%2});
        }, 600);
        fetch('http://localhost:8000/home',{
        method: 'GET',
        headers: {
            'Content-Type' : 'application/json'
        }
        }).then((res)=>{
            if(res.ok)
            return res.json();
        }).then((res)=>{
            this.setState({auctions:res});
            this.setState({b:1});
          
            
        })

        socket.on('message', data => {
            console.log("recieved");
            var currprodid = data["id"];
            var allprods=this.state.auctions;
            for(var i=0;i<allprods.length;i++){
                if(allprods[i]["_id"]==currprodid){
                    allprods[i]["bid_count"]=data["bidcount"];
                    allprods[i]["price"]=data["news"];
                    this.setState({auctions:allprods});
                    break;
                }
            }
         });

         socket.on('update', data => {
             console.log("Update received on update socket")
             this.setState({auctions:data});
         });

         var web3;
         const Web3 = require('web3');
         if(typeof window.web3 !== 'undefined'){
             web3 = new Web3(window.ethereum);
             console.log(web3);
             var address = "0x03759FED743Ee7C5c972ce2109b0c2dE073a0172";
             var contract = new web3.eth.Contract(abi, address);
             this.setState({contractval: contract});
             this.setState({web3: web3});
             web3.eth.getAccounts().then((accounts) => {
                if(accounts.length == 0){
                    this.setState({connect_web3_modal: true});
                }
                else{
                    this.initialiseAddress(web3);
                }
             });
         }
         else{
             this.setState({metamask_installed:true});
         }
 
         if(window.ethereum) {
             window.ethereum.on('accountsChanged', () => {
                 this.initialiseAddress(web3);
                 console.log("Account changed");
             });
         }
 
         
    }

    unixToDate(unix_timestamp) {
        unix_timestamp = parseInt(unix_timestamp);
        const timeStamp = unix_timestamp;
        const date = new Date(timeStamp).toLocaleDateString('en-UK');
        return date;
    }

    addproducts()
    {
        if(this.state.b==0)
        {
            return( 
                <Spinner style={{marginLeft:"40%",marginTop:"10%",height:"70px",width:"70px"}}  animation="grow" role="status">
                </Spinner>
            )
        }
        else{
            return(
                <Row>
                    
                    {this.state.auctions.map((auction)=>{
                        if((this.state.auctionFilterActive==="Live") && (parseInt(Date.now()) < auction.ending_date)){
                        return(
                            <Col key={auction._id} md={4} 
                                style={{padding: '30px'}}>
                                <Card 
                                    style={{borderTop:"1px solid black"}}>
                                        <Card.Img 
                                            style={{height:"270px", objectFit:'cover'}}
                                            src={auction.link}/>
                                        <Row style={{marginTop: '20px'}}>
                                            <Col md={8}>
                                                <h4
                                                style={{paddingLeft:'20px',fontWeight:'bolder'}}
                                            >{auction.title}</h4>
                                            </Col>
                                            <Col md={4} style={{fontSize:'20px'}}>
                                                <AiFillHeart style={{color:'#FFA0A0'}}/>
                                                <span style={{marginLeft:'10px'}}>{auction.bid_count} 
                                                
                                                </span>
                                            </Col>
                                        </Row> 
                                        <Row style={{padding:'20px'}}>
                                            <Col md={6} style={{}}>
                                                <h5> Current Bid </h5>
                                                <h5 style={{fontWeight:'bolder'}}> {auction.price} ETH 
                                                <FaEthereum style={{color:'#21325E'}}/>
                                                </h5>
                                            </Col>
                                            <Col md={6}>
                                                <h5> Expiring on</h5>
                                                <h5 style={{fontWeight:'bolder'}}>{this.unixToDate(auction.ending_date)}</h5>
                                            </Col>
                                        </Row>
                                        <Row style={{textAlign:'center', paddingBottom:'20px'}}>
                                            <Col md={6} style={{}}>
                                                
                                                <Button  
                                                    style={{width:'80%', backgroundColor:'#FFA0A0', border:'none', color:'#21325E' }}
                                                    onClick = { () => {
                                                        window.location.replace(`explore/${auction._id}`);
                                                    }}
                                                > Place bid </Button>
                                                
                                            </Col>
                                            <Col md={6}>
                                                <Button onClick = { () => {
                                                        window.location.replace(`explore/${auction._id}`);
                                                    }} variant='light' style={{width:'80%'}}> View History </Button>
                                            </Col>
                                        </Row>
                                        
                                </Card>    
                            </Col>
                        )
                                                }
                    if((this.state.auctionFilterActive==="Live") && (parseInt(Date.now()) < auction.ending_date)){
                        return(
                            <Col key={auction._id} md={4} 
                                style={{padding: '30px'}}>
                                <Card 
                                    style={{borderTop:"1px solid black"}}>
                                        <Card.Img 
                                            style={{height:"270px", objectFit:'cover'}}
                                            src={auction.link}/>
                                        <Row style={{marginTop: '20px'}}>
                                            <Col md={8}>
                                                <h4
                                                style={{paddingLeft:'20px',fontWeight:'bolder'}}
                                            >{auction.title}</h4>
                                            </Col>
                                            <Col md={4} style={{fontSize:'20px'}}>
                                                <AiFillHeart style={{color:'#FFA0A0'}}/>
                                                <span style={{marginLeft:'10px'}}>{auction.bid_count} 
                                                
                                                </span>
                                            </Col>
                                        </Row> 
                                        <Row style={{padding:'20px'}}>
                                            <Col md={6} style={{}}>
                                                <h5> Current Bid </h5>
                                                <h5 style={{fontWeight:'bolder'}}> {auction.price} ETH 
                                                <FaEthereum style={{color:'#21325E'}}/>
                                                </h5>
                                            </Col>
                                            <Col md={6}>
                                                <h5> Expiring on</h5>
                                                <h5 style={{fontWeight:'bolder'}}>{this.unixToDate(auction.ending_date)}</h5>
                                            </Col>
                                        </Row>
                                        <Row style={{textAlign:'center', paddingBottom:'20px'}}>
                                            <Col md={6} style={{}}>
                                                
                                                <Button  
                                                    style={{width:'80%', backgroundColor:'#FFA0A0', border:'none', color:'#21325E' }}
                                                    onClick = { () => {
                                                        window.location.replace(`explore/${auction._id}`);
                                                    }}
                                                > Place bid </Button>
                                                
                                            </Col>
                                            <Col md={6}>
                                                <Button onClick = { () => {
                                                        window.location.replace(`explore/${auction._id}`);
                                                    }} variant='light' style={{width:'80%'}}> View History </Button>
                                            </Col>
                                        </Row>
                                        
                                </Card>    
                            </Col>
                        )
                        }
                        else if((this.state.auctionFilterActive==="Ended") && (parseInt(Date.now()) > auction.ending_date)){
                            return(
                                <Col key={auction._id} md={4} 
                                    style={{padding: '30px'}}>
                                    <Card 
                                        style={{borderTop:"1px solid black"}}>
                                            <Card.Img 
                                                style={{height:"270px", objectFit:'cover'}}
                                                src={auction.link}/>
                                            <Row style={{marginTop: '20px'}}>
                                                <Col md={8}>
                                                    <h4
                                                    style={{paddingLeft:'20px',fontWeight:'bolder'}}
                                                >{auction.title}</h4>
                                                </Col>
                                                <Col md={4} style={{fontSize:'20px'}}>
                                                    <AiFillHeart style={{color:'#FFA0A0'}}/>
                                                    <span style={{marginLeft:'10px'}}>{auction.bid_count}
                                                    
                                                    </span>
                                                </Col>
                                            </Row> 
                                            <Row style={{padding:'20px'}}>
                                                <Col md={6} style={{}}>
                                                    <h5> Current Bid </h5>
                                                    <h5 style={{fontWeight:'bolder'}}> {auction.price} ETH 
                                                    <FaEthereum style={{color:'#21325E'}}/>
                                                    </h5>
                                                </Col>
                                                <Col md={6}>
                                                    <h5> Expiring on</h5>
                                                    <h5 style={{fontWeight:'bolder'}}>{this.unixToDate(auction.ending_date)}</h5>
                                                </Col>
                                            </Row>
                                            <Row style={{textAlign:'center', padding:'20px'}}>
                                                <Col md={12} style={{}}>
                                                    
                                                    <Button  
                                                        style={{width:'100%', backgroundColor:'#FFA0A0', border:'none', color:'#21325E' }}
                                                        onClick = { () => {
                                                            window.location.replace(`explore/${auction._id}`);
                                                        }}
                                                    > View status </Button>
                                                    
                                                </Col>
                                            </Row>
                                            
                                    </Card>    
                                </Col>
                            )
                            }
                            else if(this.state.auctionFilterActive==="All"){
                                return(
                                    <Col md={4} 
                                        style={{padding: '30px'}}>
                                        <Card 
                                            style={{borderTop:"1px solid black"}}>
                                                <Card.Img 
                                                    style={{height:"270px", objectFit:'cover'}}
                                                    src={auction.link}/>
                                                <Row style={{marginTop: '20px'}}>
                                                    <Col md={8}>
                                                        <h4
                                                        style={{paddingLeft:'20px',fontWeight:'bolder'}}
                                                    >{auction.title}</h4>
                                                    </Col>
                                                    <Col md={4} style={{fontSize:'20px'}}>
                                                        <AiFillHeart style={{color:'#FFA0A0'}}/>
                                                        <span style={{marginLeft:'10px'}}>{auction.bid_count} 
                                                        
                                                        </span>
                                                    </Col>
                                                </Row> 
                                                <Row style={{padding:'20px'}}>
                                                    <Col md={6} style={{}}>
                                                        <h5> Current Bid </h5>
                                                        <h5 style={{fontWeight:'bolder'}}> {auction.price} ETH 
                                                        <FaEthereum style={{color:'#21325E'}}/>
                                                        </h5>
                                                    </Col>
                                                    <Col md={6}>
                                                        <h5> Expiring on</h5>
                                                        <h5 style={{fontWeight:'bolder'}}>{this.unixToDate(auction.ending_date)}</h5>
                                                    </Col>
                                                </Row>
                                                <Row style={{textAlign:'center', paddingBottom:'20px'}}>
                                                    <Col md={6} style={{}}>
                                                        
                                                        <Button  
                                                            style={{width:'80%', backgroundColor:'#FFA0A0', border:'none', color:'#21325E' }}
                                                            onClick = { () => {
                                                                window.location.replace(`explore/${auction._id}`);
                                                            }}
                                                        > Place bid </Button>
                                                        
                                                    </Col>
                                                    <Col md={6}>
                                                        <Button onClick = { () => {
                                                                window.location.replace(`explore/${auction._id}`);
                                                            }} variant='light' style={{width:'80%'}}> View History </Button>
                                                    </Col>
                                                </Row>
                                                
                                        </Card>    
                                    </Col>
                                )
                            }
                    })}
                </Row>
            );
        }
    }


    initialiseAddress(web3) {

        web3.eth.getAccounts().then((accounts) => {

            var account_addr = accounts[0];
            console.log(account_addr);
    
            this.setState({account_addr: accounts[0]});
    
            if(!account_addr) {
                
                this.setState({connectwalletstatus: 'Connect Wallet'});
                return;
            }
    
            const len = account_addr.length;
            const croppedAddress = account_addr.substring(0,6) + "..." + account_addr.substring(len-4, len);
    
            web3.eth.getBalance(account_addr).then((balance) => {
    
                var account_bal = (Math.round(web3.utils.fromWei(balance) * 100) / 100);
                var temp = "Connected :"  + croppedAddress + " (" + account_bal + " ETH)";
                this.setState({connectwalletstatus: temp});
                this.setState({connect_web3_modal: false});
                console.log(temp);
            });
        });
    }

    connect(web3) {

        window.ethereum
        .request({ method: 'eth_requestAccounts' })
        .catch((err) => {
        if (err.code === 4001) {
            alert('You refused connection to our website. Please connect to MetaMask.');
            this.setState({connect_web3_modal: true});
        } else {
            console.error(err);
        }
        })
    }

    render(){
        
        return(
            <>
            <NavBar/>
            <Container>
            <Modal show={this.state.connect_web3_modal}>
                        <Modal.Header >
                        <Modal.Title>Connect to Web3</Modal.Title>
                        </Modal.Header>
                        <Modal.Body>
                        <p>Hi, welcome to StartBid. Please click the below button to connect your wallet our website. Once metamask opens, simply click connect. </p>
                        </Modal.Body>
                        <Modal.Footer>
                        <Button variant="secondary" onClick={async() => {
                            var web3;
                            if(typeof window.web3 !== 'undefined'){
                                web3 = new Web3(window.ethereum);
                                this.setState({web3: web3});
                                this.connect(web3);
                                this.initialiseAddress(web3);

                                var address = "0x03759FED743Ee7C5c972ce2109b0c2dE073a0172";
 
                                var contract = new web3.eth.Contract(abi, address);
 
                                this.setState({contractval: contract});
                            }
                            else{
                                alert('No web3? Please install the metamask extension and refresh the page');
                                return;
                            }
                        }}>Connect Wallet</Button>
                    </Modal.Footer>
                </Modal>

                <Modal show={this.state.auction_listed_modal}>
                        <Modal.Header >
                        <Modal.Title>Transaction Successful</Modal.Title>
                        </Modal.Header>
                        <Modal.Body>
                        <p>Your product has been successfully listed in the auction.</p>
                        </Modal.Body>
                        <Modal.Footer>
                        <Button variant="secondary" onClick={()=>{this.setState({auction_listed_modal:false})
                    }}>
                        Close
                    </Button>
                    </Modal.Footer>
                </Modal>

                <Modal show={this.state.metamask_installed}>
                        <Modal.Header >
                        <Modal.Title>No Metamask?</Modal.Title>
                        </Modal.Header>
                        <Modal.Body>
                        <p>Hi, please install Metamask and reload the page. </p>
                        </Modal.Body>
                        <Modal.Footer>
                    </Modal.Footer>
                </Modal>
         
                <Row style={{paddingTop:'20px'}}>

                    <Col md={8}>
                    <h1
                    style={{ fontWeight:'bolder', paddingLeft: '20px'}}
                    > Start Bid  </h1>
                    </Col>

                    <Col md={4} style={{textAlign:'right'}}>
                    <Button className= "authenticate-btn-active"  
                        style={{height:'3rem'}} onClick={
                            () => {
                                var web3 = this.state.web3;
                                if(this.state.connectwalletstatus === 'Connect Wallet') {
                                this.connect(web3);
                                this.initialiseAddress(web3);
                                }
                                else {
                                    var tempact = this.state.account_addr;
                                    navigator.clipboard.writeText(tempact);
		                            this.setState({connectwalletstatus: 'Copied'});
		                            setTimeout(() => this.initialiseAddress(web3), 400);
                                }
                            }
                        }>{this.state.connectwalletstatus} 
                    </Button>
                    </Col>

                </Row>

                <hr></hr>
                
                <Row>
                <Col md={6}>

                {/* <h4 style={{marginLeft:'20px'}}>{this.state.auctionFilterActive} Auctions</h4>  */}
                <Dropdown style={{margin:'10px'}}>
                        <Dropdown.Toggle id="auction-filter"
                            style={{paddingLeft:'20px', paddingRight:'20px', backgroundColor:'#21325E'}}
                        >
                            {this.state.auctionFilterActive} Auctions
                        </Dropdown.Toggle>

                        <Dropdown.Menu>
                            <Dropdown.Item onClick={async()=>{await this.setState({auctionFilterActive:'Live'})}}>Live </Dropdown.Item>
                            <Dropdown.Item onClick={async()=>{await this.setState({auctionFilterActive:'Ended'})}}>Ended</Dropdown.Item>
                            <Dropdown.Item onClick={async()=>{await this.setState({auctionFilterActive:'All'})}}>All</Dropdown.Item>
                        </Dropdown.Menu>
                        </Dropdown>
                
                </Col>
                <Col md={6} style={{textAlign:'right'}}>
                <Button 
                    style={{backgroundColor:'#FFA0A0', color:'#21325E',border:'none'}}
                    onClick={()=>{
                     this.setState({setshow:true})
                }}> <span style={{fontSize:'20px'}} > <TiPlus /> </span>New Auction</Button>
                </Col>
                </Row>
                
                <Modal show={this.state.setshow}>
            <Modal.Header >
              <Modal.Title>Enter Auction's details</Modal.Title>
            </Modal.Header>
            <Modal.Body>
                <div >
                <Form>
                    <Form.Group className="mb-3" controlId="formBasicEmail">
                        <Form.Label>Title</Form.Label>
                        <Form.Control id="title" type="text"  />
                        
                    </Form.Group>
                    <Form.Group className="mb-3" controlId="formBasicEmail">
                        <Form.Label>Price</Form.Label>
                        <Form.Control  id="Price" type="text"  />
                        
                    </Form.Group>
                    <Form.Group className="mb-3" controlId="formBasicEmail">
                        <Form.Label>Description</Form.Label>
                        <Form.Control  id="Description" type="text"  />
                        
                    </Form.Group>
                    <Form.Group className="mb-3" controlId="formBasicEmail">
                        <Form.Label>Enter Image Link</Form.Label>
                        <Form.Control  id="link" type="text"  />
                        
                    </Form.Group>
                    <Form.Group className="mb-3" controlId="formBasicEmail">
                        <Form.Label>Duration of Auction</Form.Label>
                        <Form.Control  id="ending_date" type="text"  />
                        
                    </Form.Group>
                    
                    
                    {/* <Button onClick={async()=>{
                        var title=document.getElementById("title").value;
                        var price=document.getElementById("Price").value;
                        var description=document.getElementById("Description").value;
                        var link=document.getElementById("link").value;
                        var ending_date=document.getElementById("ending_date").value;
                        ending_date=parseInt(ending_date);
                        console.log(ending_date);
                        ending_date=parseInt(Date.now())+(ending_date*86400000)
                        console.log(ending_date);
                        
                        var key={title:title,price:price,description:description,link:link,ending_date:ending_date};
                        console.log(key)     


                        this.setState({setshow:false})
                        var web3 = this.state.web3;
                        var account_addr = this.state.account_addr;
                        var contract = this.state.contractval;
                        contract.methods.list_new_auction(title, ending_date, price).send({from:account_addr})
                        .on('transactionHash', (hash)=> {
                            this.setState({auction_listed_modal:true});
                            socket.emit('add_auction', key);
                        })
                        }} variant="primary" >
                        Submit
                    </Button> */}
                    {/* <Button onClick={async () => {
    var title = document.getElementById("title").value;
    var price = document.getElementById("Price").value;
    var description = document.getElementById("Description").value;
    var link = document.getElementById("link").value;
    var ending_date = document.getElementById("ending_date").value;

    ending_date = parseInt(ending_date); // jours
    var unix_deadline = parseInt(Date.now()) + (ending_date * 86400000); // ms

    // var key = { title, price, description, link, ending_date: unix_deadline };

    // 1. Appel au contrat blockchain
    try {
        const web3 = this.state.web3;
        const contract = this.state.contractval;
        const account_addr = this.state.account_addr;

        // Conversion price en wei (si c'est en ETH)
        const starting_bid_wei = web3.utils.toWei(price.toString(), 'ether');

        const tx = await contract.methods.list_new_auction(
            title,
            ending_date, // jours
            starting_bid_wei
        ).send({ from: account_addr });

        console.log("Enchère créée sur blockchain ! Tx:", tx);
        const auction_id = tx.events.listed_auction.returnValues.auction_id;
        console.log("ID blockchain:", auction_id);

        // 2. Envoi au backend (comme avant)
        const key = {
            title,
            price,
            description,
            link,
            ending_date: unix_deadline,
            blockchain_id: auction_id,
        };
        socket.emit('add_auction', key);

        this.setState({ auction_listed_modal: true });
        this.setState({ setshow: false });
    } catch (err) {
        console.error("Erreur création enchère blockchain:", err);
        alert("Échec création sur blockchain : " + (err.reason || err.message));
    }
}} variant="primary">
    Submit
</Button> */}

{/* <Button
    onClick={async () => {
        const title = document.getElementById("title").value.trim();
        const price = document.getElementById("Price").value.trim();
        const description = document.getElementById("Description").value.trim();
        const link = document.getElementById("link").value.trim();
        const daysStr = document.getElementById("ending_date").value.trim();

        if (!title || !price || !description || !link || !daysStr) {
            alert("Tous les champs sont obligatoires !");
            return;
        }

        const days = parseInt(daysStr);
        if (isNaN(days) || days <= 0) {
            alert("La durée doit être un nombre de jours positif.");
            return;
        }

        const unix_deadline = Date.now() + days * 86400000;

        try {
            const web3 = this.state.web3;
            if (!web3) throw new Error("Web3 non initialisé");

            const contract = this.state.contractval;
            if (!contract) throw new Error("Contrat non chargé");

            const account_addr = this.state.account_addr;
            if (!account_addr) throw new Error("Wallet non connecté");

            const starting_bid_wei = web3.utils.toWei(price, 'ether');

            console.log("→ Envoi list_new_auction :", {
                title,
                days,
                starting_bid_wei,
                from: account_addr
            });

            // Estimation du gaz (très utile pour détecter les revert avant envoi)
            await contract.methods.list_new_auction(title, days, starting_bid_wei)
                .estimateGas({ from: account_addr });

            const tx = await contract.methods.list_new_auction(
                title,
                days,
                starting_bid_wei
            ).send({ from: account_addr });
            console.log("Transaction complète :", tx);
console.log("Transaction hash :", tx.transactionHash);
console.log("Status :", tx.status);                   // true = succès
console.log("Events présents :", Object.keys(tx.events || {}));
console.log("listed_auction existe ?", !!tx.events?.listed_auction);

            console.log("Transaction réussie :", tx);

            let auction_id = null;

            // Méthode sécurisée pour récupérer l'ID
            if (tx.events && tx.events.listed_auction) {
                auction_id = tx.events.listed_auction.returnValues.auction_id;
                console.log("ID via événement :", auction_id);
            } else {
                console.warn("Événement 'listed_auction' non trouvé dans tx.events");
                // Alternative : on peut appeler id_counter() après la tx
                const currentCounter = await contract.methods.id_counter().call();
                auction_id = parseInt(currentCounter) - 1; // dernier ID créé
                console.log("ID récupéré via id_counter :", auction_id);
            }

            if (!auction_id && auction_id !== 0) {
                throw new Error("Impossible de récupérer l'ID de l'enchère");
            }

            const key = {
                title,
                price,
                description,
                link,
                ending_date: unix_deadline,
                blockchain_id: auction_id,
            };

            console.log("Envoi au backend/socket :", key);

            socket.emit('add_auction', key);

            this.setState({ 
                auction_listed_modal: true,
                setshow: false 
            });

        } catch (err) {
            console.error("Erreur complète :", err);

            let errorMsg = "Échec création enchère";

            if (err.code === 4001) {
                errorMsg += " : Transaction rejetée par l'utilisateur";
            } else if (err.message?.includes("revert")) {
                errorMsg += " : Rejet par le contrat (require non satisfait)";
                if (err.data?.reason) errorMsg += ` → ${err.data.reason}`;
            } else if (err.message?.includes("gas")) {
                errorMsg += " : Problème de gas (solde insuffisant ?)";
            } else {
                errorMsg += ` : ${err.message || err.toString()}`;
            }

            alert(errorMsg);
        }
    }}
    variant="primary"
>
    Submit
</Button> */}
<Button
    variant="primary"
    onClick={async () => {
        // Récupération des inputs
        const titleEl = document.getElementById("title");
        const priceEl = document.getElementById("Price");
        const descEl = document.getElementById("Description");
        const linkEl = document.getElementById("link");
        const daysEl = document.getElementById("ending_date");

        const title = titleEl?.value?.trim() || "";
        const priceStr = priceEl?.value?.trim() || "";
        const description = descEl?.value?.trim() || "";
        const link = linkEl?.value?.trim() || "";
        const daysStr = daysEl?.value?.trim() || "";

        // Validation stricte AVANT tout appel
        if (!title || !priceStr || !description || !link || !daysStr) {
            alert("Veuillez remplir TOUS les champs.");
            return;
        }

        const days = parseInt(daysStr, 10);
        if (isNaN(days) || days < 1) {
            alert("La durée doit être un nombre entier ≥ 1 jour.");
            return;
        }

        const price = parseFloat(priceStr);
        if (isNaN(price) || price <= 0) {
            alert("Le prix de départ doit être un nombre positif.");
            return;
        }

        try {
            const web3 = this.state.web3;
            if (!web3 || !this.state.contractval || !this.state.account_addr) {
                alert("Wallet ou contrat non chargé. Connectez MetaMask.");
                return;
            }

            const contract = this.state.contractval;
            const from = this.state.account_addr;

            const starting_bid_wei = web3.utils.toWei(price.toString(), "ether");

            const paramsLog = {
                title,
                days_to_deadline: days,
                starting_bid_wei,
                starting_bid_eth: price,
                from
            };
            console.log("Paramètres envoyés :", paramsLog);

            // Simulation (doit réussir si require passent)
            const gasEst = await contract.methods
                .list_new_auction(title, days, starting_bid_wei)
                .estimateGas({ from });

            console.log("Gas estimé :", gasEst);

            // Envoi réel
            const tx = await contract.methods
                .list_new_auction(title, days, starting_bid_wei)
                .send({ from });

            console.log("Transaction minée :", {
                hash: tx.transactionHash,
                block: tx.blockNumber,
                events: Object.keys(tx.events || {})
            });

            // Récupération ID
            let auction_id = tx.events?.ListedAuction?.returnValues?.auction_id ||
                            tx.events?.listed_auction?.returnValues?.auction_id;

            if (!auction_id) {
                const counter = await contract.methods.id_counter().call();
                auction_id = Number(counter) - 1;
                console.log("ID via counter fallback :", auction_id);
            }

            if (!auction_id && auction_id !== 0) {
                throw new Error("ID enchère non récupéré");
            }

            const unix_deadline = Date.now() + days * 86400000;

            const key = {
                title,
                price,
                description,
                link,
                ending_date: unix_deadline,
                blockchain_id: Number(auction_id)
            };

            console.log("Envoi socket :", key);
            socket.emit('add_auction', key);

            this.setState({ auction_listed_modal: true, setshow: false });

        } catch (err) {
            console.error("Erreur détaillée :", err);

            let message = "Échec création enchère";

            if (err.code === 4001) {
                message += " → Annulée par l'utilisateur";
            } else if (err.message?.includes("revert")) {
                if (err.data?.includes("Duration")) {
                    message += " → Durée ≤ 0 jours";
                } else if (err.data?.includes("Starting bid")) {
                    message += " → Prix de départ ≤ 0";
                } else {
                    message += " → Require échoué (autre)";
                }
            } else if (err.message?.includes("toWei")) {
                message += " → Format prix invalide";
            } else {
                message += ` → ${err.message || "Erreur inconnue"}`;
            }

            alert(message);
        }
    }}
>
    Submit
</Button>
                    </Form>
                </div>
            </Modal.Body>
            <Modal.Footer>
            <Button variant="secondary" onClick={()=>{this.setState({setshow:false})}}>
            Close
          </Button>
         
            </Modal.Footer>
          </Modal>
                {this.addproducts()}
            </Container>
            </>
        );
    }
}

export default Home;