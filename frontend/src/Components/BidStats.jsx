// import { Component } from "react";
// import { Container, Row, Col, Card, Button, Dropdown ,Spinner,Modal,Form } from "react-bootstrap";
// import Bulb from 'react-bulb';
// import { auctions } from "../Resources/auctions";
// import {abi} from "../Resources/abi";
// import {AiFillHeart} from 'react-icons/ai';
// import {FaEthereum} from 'react-icons/fa';
// import {TiPlus} from 'react-icons/ti';
// import {Link} from 'react-router-dom';
// import io from 'socket.io-client'
// import NavBar from './NavBar';
// var endpoint="http://localhost:4000";
// const Web3 = require('web3');

// const socket = io.connect(endpoint); //new change

// class BidStats extends Component{
//     constructor(props){
//         super(props);
//         this.state = {
//             bulbColor:['#00cc00', '#fafafa' ],
//             bulbColorIndex: 0,
//             auctionFilter: ['Live', 'Upcoming', 'Ended', 'All'],
//             wins_payment_filter: 'Payment Pending',
//             auctions:[],
//             b:0,
//             connectwalletstatus: 'Connect Wallet',
//             account_addr: '',
//             web3: null,
//             setshow:false,
//             contractval:'',
//             connect_web3_modal:false,
//             metamask_installed:false,
//             not_logged_in:false,
//             auction_listed_modal:false,
//             blockchain_auction_data:[],
//             hosted_auctions_filter: "Ongoing",
//         };
//         this.addproducts=this.addproducts.bind(this);
//         this.connect=this.connect.bind(this);
//         this.initialiseAddress=this.initialiseAddress.bind(this);
//         this.unixToDate=this.unixToDate.bind(this);
//     }
   
 
//     componentDidMount =async () => {
//         var tempvalas = (JSON.parse(localStorage.getItem('user')))
//         if(tempvalas==null){
//             window.location.href="http://localhost:3000";
//         }

//         var web3;
//          const Web3 = require('web3');
//          if(typeof window.web3 !== 'undefined'){
//              web3 = new Web3(window.ethereum);
//              console.log(web3);
//             //  var address = "0x1de39873ba5fa574D322d0cE8f8dca17A00205aF";
//              var address = "0x03759FED743Ee7C5c972ce2109b0c2dE073a0172";
//              var contract = new web3.eth.Contract(abi, address);
//              this.setState({contractval: contract});
//              await contract.methods.view_all_auctions().call().then(async (result)=> {
//                 console.log("All auctions data")
//                 console.log(result);
//                 this.setState({blockchain_auction_data:result});
//             })
//              this.setState({web3: web3});
//              web3.eth.getAccounts().then((accounts) => {
//                 if(accounts.length == 0){
//                     this.setState({connect_web3_modal: true});
//                 }
//                 else{
//                     this.initialiseAddress(web3);
//                 }
//              });
//          }
//          else{
//              this.setState({metamask_installed:true});
//          }
 
//          if(window.ethereum) {
//              window.ethereum.on('accountsChanged', () => {
//                  this.initialiseAddress(web3);
//                  console.log("Account changed");
//              });
//          }

//         setInterval(async() => {
//             await this.setState({bulbColorIndex: (this.state.bulbColorIndex+1)%2});
//         }, 600);
//         fetch('http://localhost:8000/home',{
//         method: 'GET',
//         headers: {
//             'Content-Type' : 'application/json'
//         }
//         }).then((res)=>{
//             if(res.ok)
//             return res.json();
//         }).then((res)=>{
//             this.setState({auctions:res});
//             this.setState({b:1});
          
            
//         })

//         socket.on('message', data => {
//             console.log("recieved");
//             var currprodid = data["id"];
//             var allprods=this.state.auctions;
//             for(var i=0;i<allprods.length;i++){
//                 if(allprods[i]["_id"]==currprodid){
//                     allprods[i]["bid_count"]=data["bidcount"];
//                     allprods[i]["price"]=data["news"];
//                     this.setState({auctions:allprods});
//                     break;
//                 }
//             }
//          });

//          socket.on('update', data => {
//              console.log("Update received on update socket")
//              this.setState({auctions:data});
//          });

         

 
         
//     }

//     unixToDate(unix_timestamp) {
//         unix_timestamp = parseInt(unix_timestamp);
//         const timeStamp = unix_timestamp;
//         const date = new Date(timeStamp).toLocaleDateString('en-UK');
//         return date;
//     }

//     addproducts(filtercriteria)
//     {
//         if(this.state.b==0)
//         {
//             return( 
//                 <Spinner style={{marginTop:"10%", marginLeft:"10%", marginBottom:"10%", height:"50px",width:"50px"}}  animation="border" role="status">
//                 </Spinner>
//             )
//         }
//         else{
//             return(
//                 <Row>
//                     {this.state.auctions.map((auction)=>{
//                         var blockchain_data = this.state.blockchain_auction_data[auction._id];
//                         console.log({
//     currentTimeSeconds: parseInt(Date.now()/1000),
//     blockchainDeadline: blockchain_data.time_of_deadline,
//     dbDeadline: auction.ending_date,
//     isEndedByBlockchain: parseInt(Date.now()/1000) > blockchain_data.time_of_deadline,
//     isEndedByDB: parseInt(Date.now()) > auction.ending_date
// });
// if((filtercriteria=="wins") && (this.state.wins_payment_filter==="Payment Pending") && 
//    (parseInt(Date.now()/1000) > parseInt(blockchain_data.time_of_deadline)) && // CHANGEMENT ICI
//    (auction.winner_address===this.state.account_addr) && 
//    (blockchain_data.amount_status==false)){
    
// console.log("Mon horloge:", Date.now()/1000);
// // console.log("Dernier bloc blockchain:", await web3.eth.getBlock('latest').timestamp);
// console.log("Deadline blockchain:", blockchain_data.time_of_deadline);
// console.log("Deadline DB:", auction.ending_date/1000);
//                             // if((filtercriteria=="wins") && (this.state.wins_payment_filter==="Payment Pending") && (parseInt(Date.now()) > auction.ending_date) && (auction.winner_address===this.state.account_addr) && (blockchain_data.amount_status==false)){
//                         //     console.log(Date.now(),' / ' ,auction.ending_date);
                            
//                         return(
//                                 <Col key={auction._id} md={4} 
//                                     style={{padding: '30px'}}>
//                                     <Card 
//                                         style={{borderTop:"1px solid black"}}>
//                                             <Card.Img 
//                                                 style={{height:"270px", objectFit:'cover'}}
//                                                 src={auction.link}/>
//                                             <Row style={{marginTop: '20px'}}>
//                                                 <Col md={8}>
//                                                     <h4
//                                                     style={{paddingLeft:'20px',fontWeight:'bolder'}}
//                                                 >{auction.title}</h4>
//                                                 </Col>
//                                                 <Col md={4} style={{fontSize:'20px'}}>
//                                                     <AiFillHeart style={{color:'#FFA0A0'}}/>
//                                                     <span style={{marginLeft:'10px'}}>{auction.bid_count}
                                                    
//                                                     </span>
//                                                 </Col>
//                                             </Row> 
//                                             <Row style={{paddingLeft:'20px'}}>
//                                                 <Col md={12} style={{}}>
//                                                     <p>{auction.description.slice(0,50)}</p>
//                                                 </Col>
//                                             </Row>
//                                             <Row style={{paddingLeft:'20px'}}>
//                                                 <Col md={12} style={{}}>
//                                                     <h5> Your Bid:  
//                                                     <span style={{fontWeight:'bolder'}}> {auction.price} ETH 
//                                                     <FaEthereum style={{color:'#21325E'}}/>
//                                                     </span></h5>
//                                                 </Col>
//                                             </Row>
//                                             <hr></hr>
//                                             <Row style={{paddingLeft:'20px', paddingRight:'20px'}}>
//                                                 <Col md={12} style={{}}>
//                                                     <h6> Auction Owner:  
//                                                     <span style={{fontWeight:'normal', fontSize:'17px'}}> {blockchain_data.auction_owner}  
//                                                     </span></h6>
//                                                 </Col>
//                                             </Row>
                                            
//                                             <Row style={{textAlign:'center', padding:'20px'}}>
//                                                 <Col md={12} style={{}}>
//                                                 <Button  
//                                                         style={{width:'100%', backgroundColor:'#FFA0A0', border:'none', color:'#21325E' }}
//                                                         // onClick = { () => {
//                                                         //     var web3 = this.state.web3;
//                                                         //     var contract = this.state.contractval;
//                                                         //     var account_addr = this.state.account_addr;
//                                                         //     var amount = (auction.price).toString();
//                                                         //     amount =web3.utils.toWei(amount, 'ether');
//                                                         //     contract.methods.make_payment(auction._id).send({from:account_addr, value:amount})
//                                                         //     .on('receipt', function(receipt){
//                                                         //         alert("Payment Successful");
//                                                         //     })
//                                                         //     .on('error', function(error){
//                                                         //         alert("Payment Failed");
//                                                         //     })
//                                                         // }}
//                                                         onClick = { () => {
//                                                             var web3 = this.state.web3;
//                                                             var contract = this.state.contractval;
//                                                             var account_addr = this.state.account_addr;
                                                            
//                                                             // Get the winning bid amount from blockchain data instead of auction.price
//                                                             var blockchain_data = this.state.blockchain_auction_data[auction._id];
//                                                             var amount = blockchain_data.winning_bid_amt; // This is already in wei
                                                            
//                                                             // No need to convert again - it's already in wei
//                                                             contract.methods.make_payment(auction._id).send({from: account_addr, value: amount})
//                                                                 .on('receipt', function(receipt){
//                                                                     alert("Payment Successful");
//                                                                     // Refresh the data
//                                                                     contract.methods.view_all_auctions().call().then((result) => {
//                                                                         this.setState({blockchain_auction_data: result});
//                                                                     });
//                                                                 })
//                                                                 .on('error', function(error){
//                                                                     console.error("Payment error:", error);
//                                                                     alert("Payment Failed: " + (error.message || "Unknown error"));
//                                                                 });
//                                                         }}
//                                                     > Make payment </Button>
                                                    
//                                                 </Col>
//                                             </Row>
                                            
//                                     </Card>    
//                                 </Col>
//                             )
//                             }
//                             if((filtercriteria=="wins") &&(this.state.wins_payment_filter==="Paid") && (parseInt(Date.now()) > auction.ending_date) && (auction.winner_address===this.state.account_addr) && (blockchain_data.amount_status==true)){
//                                 return(
//                                     <Col key={auction._id} md={4} 
//                                         style={{padding: '30px'}}>
//                                         <Card 
//                                             style={{borderTop:"1px solid black"}}>
//                                                 <Card.Img 
//                                                     style={{height:"270px", objectFit:'cover'}}
//                                                     src={auction.link}/>
//                                                 <Row style={{marginTop: '20px'}}>
//                                                     <Col md={8}>
//                                                         <h4
//                                                         style={{paddingLeft:'20px',fontWeight:'bolder'}}
//                                                     >{auction.title}</h4>
//                                                     </Col>
//                                                     <Col md={4} style={{fontSize:'20px'}}>
//                                                         <AiFillHeart style={{color:'#FFA0A0'}}/>
//                                                         <span style={{marginLeft:'10px'}}>{auction.bid_count}
                                                        
//                                                         </span>
//                                                     </Col>
//                                                 </Row> 
//                                                 <Row style={{paddingLeft:'20px'}}>
//                                                     <Col md={12} style={{}}>
//                                                         <p>{auction.description.slice(0,50)}</p>
//                                                     </Col>
//                                                 </Row>
//                                                 <Row style={{paddingLeft:'20px'}}>
//                                                 <Col md={12} style={{}}>
//                                                     <h5> Your Bid:  
//                                                     <span style={{fontWeight:'bolder'}}> {auction.price} ETH 
//                                                     <FaEthereum style={{color:'#21325E'}}/>
//                                                     </span></h5>
//                                                 </Col>
//                                             </Row>
//                                             <hr></hr>
//                                             <Row style={{paddingLeft:'20px', paddingRight:'20px'}}>
//                                                 <Col md={12} style={{}}>
//                                                     <h6> Auction Owner:  
//                                                     <span style={{fontWeight:'normal', fontSize:'17px'}}> {blockchain_data.auction_owner}  
//                                                     </span></h6>
//                                                 </Col>
//                                             </Row>
                                                
//                                                 <Row style={{textAlign:'center', padding:'20px'}}>
//                                                     <Col md={12} style={{}}>
                                                        
//                                                     </Col>
//                                                 </Row>
                                                
//                                         </Card>    
//                                     </Col>
//                                 )
//                                 }
//                                 if((filtercriteria=="hosted") &&(this.state.hosted_auctions_filter==="Ongoing") && (parseInt(Date.now()) < auction.ending_date) && (blockchain_data.auction_owner===this.state.account_addr)){
//                                     return(
//                                         <Col key={auction._id} md={4} 
//                                             style={{padding: '30px'}}>
//                                             <Card 
//                                                 style={{borderTop:"1px solid black"}}>
//                                                     <Card.Img 
//                                                         style={{height:"270px", objectFit:'cover'}}
//                                                         src={auction.link}/>
//                                                     <Row style={{marginTop: '20px'}}>
//                                                         <Col md={8}>
//                                                             <h4
//                                                             style={{paddingLeft:'20px',fontWeight:'bolder'}}
//                                                         >{auction.title}</h4>
//                                                         </Col>
//                                                         <Col md={4} style={{fontSize:'20px'}}>
//                                                             <AiFillHeart style={{color:'#FFA0A0'}}/>
//                                                             <span style={{marginLeft:'10px'}}>{auction.bid_count}
                                                            
//                                                             </span>
//                                                         </Col>
//                                                     </Row> 
//                                                     <Row style={{paddingLeft:'20px'}}>
//                                                         <Col md={12} style={{}}>
//                                                             <p>{auction.description.slice(0,50)}</p>
//                                                         </Col>
//                                                     </Row>
//                                                     <Row style={{paddingLeft:'20px'}}>
//                                                         <Col md={12} style={{}}>
//                                                             <h5> Current Bid:  
//                                                             <span style={{fontWeight:'bolder'}}> {auction.price} ETH 
//                                                             <FaEthereum style={{color:'#21325E'}}/>
//                                                             </span></h5>
//                                                         </Col>
//                                                     </Row>
//                                                     <hr></hr>
//                                                     <Row style={{paddingLeft:'20px', paddingRight:'20px'}}>
//                                                         <Col md={12} style={{}}>
//                                                             <h6> Current Highest Bidder:  
//                                                             <span style={{fontWeight:'normal', fontSize:'17px'}}> {auction.winner_address}
//                                                             </span></h6>
//                                                         </Col>
//                                                     </Row>
                                                    
//                                                     <Row style={{textAlign:'center', padding:'20px'}}>
//                                                         <Col md={12} style={{}}>
                                                            
//                                                         </Col>
//                                                     </Row>
                                                    
//                                             </Card>    
//                                         </Col>
//                                     )
//                                     }

//                                     if((filtercriteria=="hosted") &&(this.state.hosted_auctions_filter==="Completed") && (parseInt(Date.now()) > auction.ending_date) && (blockchain_data.auction_owner===this.state.account_addr) && (blockchain_data.is_active==true) && (blockchain_data.amount_status==true)){
//                                         return(
//                                             <Col key={auction._id} md={4} 
//                                                 style={{padding: '30px'}}>
//                                                 <Card 
//                                                     style={{borderTop:"1px solid black"}}>
//                                                         <Card.Img 
//                                                             style={{height:"270px", objectFit:'cover'}}
//                                                             src={auction.link}/>
//                                                         <Row style={{marginTop: '20px'}}>
//                                                             <Col md={8}>
//                                                                 <h4
//                                                                 style={{paddingLeft:'20px',fontWeight:'bolder'}}
//                                                             >{auction.title}</h4>
//                                                             </Col>
//                                                             <Col md={4} style={{fontSize:'20px'}}>
//                                                                 <AiFillHeart style={{color:'#FFA0A0'}}/>
//                                                                 <span style={{marginLeft:'10px'}}>{auction.bid_count}
                                                                
//                                                                 </span>
//                                                             </Col>
//                                                         </Row> 
//                                                         <Row style={{paddingLeft:'20px'}}>
//                                                             <Col md={12} style={{}}>
//                                                                 <p>{auction.description.slice(0,50)}</p>
//                                                             </Col>
//                                                         </Row>
//                                                         <Row style={{paddingLeft:'20px'}}>
//                                                             <Col md={12} style={{}}>
//                                                                 <h5> Winning Bid:  
//                                                                 <span style={{fontWeight:'bolder'}}> {auction.price} ETH 
//                                                                 <FaEthereum style={{color:'#21325E'}}/>
//                                                                 </span></h5>
//                                                             </Col>
//                                                         </Row>

//                                                         <hr></hr>
//                                                         <Row style={{paddingLeft:'20px', paddingRight:'20px'}}>
//                                                             <Col md={12} style={{}}>
//                                                                 <h6> Winner Address:  
//                                                                 <span style={{fontWeight:'normal', fontSize:'17px'}}> {auction.winner_address}  
//                                                                 </span></h6>
//                                                             </Col>
//                                                         </Row>
                                                        
//                                                         <Row style={{textAlign:'center', padding:'20px'}}>
//                                                             <Col md={12} style={{}}>
//                                                             <Button  
//                                                         style={{width:'100%', backgroundColor:'#FFA0A0', border:'none', color:'#21325E' }}
//                                                         onClick = { () => {
//                                                             var web3 = this.state.web3;
//                                                             var contract = this.state.contractval;
//                                                             var account_addr = this.state.account_addr;
//                                                             contract.methods.withdraw_from_auction(auction._id).send({from:account_addr})
//                                                             .on('receipt', function(receipt){
//                                                                 alert("Withdrawal Successful");
//                                                             })
//                                                             .on('error', function(error){
//                                                                 alert("Withdrawal Failed");
//                                                             })
//                                                         }}
//                                                     > Collect Funds </Button>
//                                                             </Col>
//                                                         </Row>
                                                        
//                                                 </Card>    
//                                             </Col>
//                                         )
//                                         }

//                                         if((filtercriteria=="hosted") &&(this.state.hosted_auctions_filter==="Completed") && (parseInt(Date.now()) > auction.ending_date) && (blockchain_data.auction_owner===this.state.account_addr) && (blockchain_data.is_active==true) && (blockchain_data.amount_status==false)){
//                                             return(
//                                                 <Col key={auction._id} md={4} 
//                                                     style={{padding: '30px'}}>
//                                                     <Card 
//                                                         style={{borderTop:"1px solid black"}}>
//                                                             <Card.Img 
//                                                                 style={{height:"270px", objectFit:'cover'}}
//                                                                 src={auction.link}/>
//                                                             <Row style={{marginTop: '20px'}}>
//                                                                 <Col md={8}>
//                                                                     <h4
//                                                                     style={{paddingLeft:'20px',fontWeight:'bolder'}}
//                                                                 >{auction.title}</h4>
//                                                                 </Col>
//                                                                 <Col md={4} style={{fontSize:'20px'}}>
//                                                                     <AiFillHeart style={{color:'#FFA0A0'}}/>
//                                                                     <span style={{marginLeft:'10px'}}>{auction.bid_count}
                                                                    
//                                                                     </span>
//                                                                 </Col>
//                                                             </Row> 
//                                                             <Row style={{paddingLeft:'20px'}}>
//                                                                 <Col md={12} style={{}}>
//                                                                     <p>{auction.description.slice(0,50)}</p>
//                                                                 </Col>
//                                                             </Row>
//                                                             <Row style={{paddingLeft:'20px'}}>
//                                                                 <Col md={12} style={{}}>
//                                                                     <h5> Winning Bid:  
//                                                                     <span style={{fontWeight:'bolder'}}> {auction.price} ETH 
//                                                                     <FaEthereum style={{color:'#21325E'}}/>
//                                                                     </span></h5>
//                                                                 </Col>
//                                                             </Row>

//                                                             <hr></hr>
//                                                             <Row style={{paddingLeft:'20px', paddingRight:'20px'}}>
//                                                                 <Col md={12} style={{}}>
//                                                                     <h6> Winner Address:  
//                                                                     <span style={{fontWeight:'normal', fontSize:'17px'}}> {auction.winner_address}  
//                                                                     </span></h6>
//                                                                 </Col>
//                                                             </Row>
                                                            
//                                                             <Row style={{textAlign:'center', padding:'20px'}}>
//                                                                 <Col md={12} style={{}}>
//                                                                 <Button disabled  
//                                                             style={{width:'100%', backgroundColor:'#FFA0A0', border:'none', color:'#21325E' }}
//                                                             onClick = { () => {
//                                                                 var web3 = this.state.web3;
//                                                                 var contract = this.state.contractval;
//                                                                 var account_addr = this.state.account_addr;
//                                                                 contract.methods.withdraw_from_auction(auction._id).send({from:account_addr})
//                                                                 .on('receipt', function(receipt){
//                                                                     alert("Withdrawal Successful");
//                                                                 })
//                                                                 .on('error', function(error){
//                                                                     alert("Withdrawal Failed");
//                                                                 })
//                                                             }}
//                                                         > Awaiting payment </Button>
//                                                                 </Col>
//                                                             </Row>
                                                            
//                                                     </Card>    
//                                                 </Col>
//                                             )
//                                             }

//                                             if((filtercriteria=="leading")  && (parseInt(Date.now()) < auction.ending_date) && (auction.winner_address===this.state.account_addr)){
//                                                 return(
//                                                     <Col key={auction._id} md={4} 
//                                                         style={{padding: '30px'}}>
//                                                         <Card 
//                                                             style={{borderTop:"1px solid black"}}>
//                                                                 <Card.Img 
//                                                                     style={{height:"270px", objectFit:'cover'}}
//                                                                     src={auction.link}/>
//                                                                 <Row style={{marginTop: '20px'}}>
//                                                                     <Col md={8}>
//                                                                         <h4
//                                                                         style={{paddingLeft:'20px',fontWeight:'bolder'}}
//                                                                     >{auction.title}</h4>
//                                                                     </Col>
//                                                                     <Col md={4} style={{fontSize:'20px'}}>
//                                                                         <AiFillHeart style={{color:'#FFA0A0'}}/>
//                                                                         <span style={{marginLeft:'10px'}}>{auction.bid_count}
                                                                        
//                                                                         </span>
//                                                                     </Col>
//                                                                 </Row> 
//                                                                 <Row style={{paddingLeft:'20px'}}>
//                                                                     <Col md={12} style={{}}>
//                                                                         <p>{auction.description.slice(0,50)}</p>
//                                                                     </Col>
//                                                                 </Row>
//                                                                 <Row style={{paddingLeft:'20px'}}>
//                                                                     <Col md={12} style={{}}>
//                                                                         <h5> Current Bid:  
//                                                                         <span style={{fontWeight:'bolder'}}> {auction.price} ETH 
//                                                                         <FaEthereum style={{color:'#21325E'}}/>
//                                                                         </span></h5>
//                                                                     </Col>
//                                                                 </Row>
//                                                                 <hr></hr>
//                                                                 <Row style={{paddingLeft:'20px', paddingRight:'20px'}}>
//                                                                     <Col md={12} style={{}}>
//                                                                         <h6> Current Highest Bidder:  
//                                                                         <span style={{fontWeight:'normal', fontSize:'17px'}}> {auction.winner_address}
//                                                                         </span></h6>
//                                                                     </Col>
//                                                                 </Row>
                                                                
//                                                                 <Row style={{textAlign:'center', padding:'20px'}}>
//                                                                     <Col md={12} style={{}}>
                                                                        
//                                                                     </Col>
//                                                                 </Row>
                                                                
//                                                         </Card>    
//                                                     </Col>
//                                                 )
//                                                 }
                            
//                         }
                        
//                         )}
//                 </Row>
//             );
//         }
//     }


//     initialiseAddress(web3) {

//         web3.eth.getAccounts().then((accounts) => {

//             var account_addr = accounts[0];
//             console.log(account_addr);
    
//             this.setState({account_addr: accounts[0]});
    
//             if(!account_addr) {
                
//                 this.setState({connectwalletstatus: 'Connect Wallet'});
//                 return;
//             }
    
//             const len = account_addr.length;
//             const croppedAddress = account_addr.substring(0,6) + "..." + account_addr.substring(len-4, len);
    
//             web3.eth.getBalance(account_addr).then((balance) => {
    
//                 var account_bal = (Math.round(web3.utils.fromWei(balance) * 100) / 100);
//                 var temp = "Connected :"  + croppedAddress + " (" + account_bal + " ETH)";
//                 this.setState({connectwalletstatus: temp});
//                 this.setState({connect_web3_modal: false});
//                 console.log(temp);
//             });
//         });
//     }

//     connect(web3) {

//         window.ethereum
//         .request({ method: 'eth_requestAccounts' })
//         .catch((err) => {
//         if (err.code === 4001) {
//             alert('You refused connection to our website. Please connect to MetaMask.');
//             this.setState({connect_web3_modal: true});
//         } else {
//             console.error(err);
//         }
//         })
//     }

//     render(){
        
//         return(
//             <>
//             <NavBar/>
//             <Container>
//             <Modal show={this.state.connect_web3_modal}>
//                         <Modal.Header >
//                         <Modal.Title>Connect to Web3</Modal.Title>
//                         </Modal.Header>
//                         <Modal.Body>
//                         <p>Hi, welcome to StartBid. Please click the below button to connect your wallet our website. Once metamask opens, simply click connect. </p>
//                         </Modal.Body>
//                         <Modal.Footer>
//                         <Button variant="secondary" onClick={async() => {
//                             var web3;
//                             if(typeof window.web3 !== 'undefined'){
//                                 web3 = new Web3(window.ethereum);
//                                 this.setState({web3: web3});
//                                 this.connect(web3);
//                                 this.initialiseAddress(web3);

//                                 var address = "0x03759FED743Ee7C5c972ce2109b0c2dE073a0172";
 
//                                 var contract = new web3.eth.Contract(abi, address);
 
//                                 this.setState({contractval: contract});
//                             }
//                             else{
//                                 alert('No web3? Please install the metamask extension and refresh the page');
//                                 return;
//                             }
//                         }}>Connect Wallet</Button>
//                     </Modal.Footer>
//                 </Modal>

//                 <Modal show={this.state.auction_listed_modal}>
//                         <Modal.Header >
//                         <Modal.Title>Transaction Successful</Modal.Title>
//                         </Modal.Header>
//                         <Modal.Body>
//                         <p>Your product has been successfully listed in the auction.</p>
//                         </Modal.Body>
//                         <Modal.Footer>
//                         <Button variant="secondary" onClick={()=>{this.setState({auction_listed_modal:false})
//                     }}>
//                         Close
//                     </Button>
//                     </Modal.Footer>
//                 </Modal>

//                 <Modal show={this.state.metamask_installed}>
//                         <Modal.Header >
//                         <Modal.Title>No Metamask?</Modal.Title>
//                         </Modal.Header>
//                         <Modal.Body>
//                         <p>Hi, please install Metamask and reload the page. </p>
//                         </Modal.Body>
//                         <Modal.Footer>
//                     </Modal.Footer>
//                 </Modal>
         
//                 <Row style={{paddingTop:'20px'}}>

//                     <Col md={8}>
//                     <h1
//                     style={{ fontWeight:'bold', paddingLeft: '20px'}}
//                     > Your Stats</h1>
//                     </Col>

//                     <Col md={4} style={{textAlign:'right'}}>
//                     <Button className= "authenticate-btn-active"  
//                         style={{height:'3rem'}} onClick={
//                             () => {
//                                 var web3 = this.state.web3;
//                                 if(this.state.connectwalletstatus === 'Connect Wallet') {
//                                 this.connect(web3);
//                                 this.initialiseAddress(web3);
//                                 }
//                                 else {
//                                     var tempact = this.state.account_addr;
//                                     navigator.clipboard.writeText(tempact);
// 		                            this.setState({connectwalletstatus: 'Copied'});
// 		                            setTimeout(() => this.initialiseAddress(web3), 400);
//                                 }
//                             }
//                         }>{this.state.connectwalletstatus} 
//                     </Button>
//                     </Col>

//                 </Row>

//                 <hr></hr>
//                 <h4 className="ml-3">Your Auction Wins</h4>
//                 <Row>
//                 <Col md={6}>
//                 <Dropdown style={{margin:'10px'}}>
//                         <Dropdown.Toggle id="auction-filter"
//                             style={{paddingLeft:'20px', paddingRight:'20px', backgroundColor:'#21325E'}}
//                         >
//                             {this.state.wins_payment_filter}
//                         </Dropdown.Toggle>

//                         <Dropdown.Menu>
//                             <Dropdown.Item onClick={async()=>{await this.setState({wins_payment_filter:'Payment Pending'})}}>Payment Pending</Dropdown.Item>
//                             <Dropdown.Item onClick={async()=>{await this.setState({wins_payment_filter:'Paid'})}}>Paid</Dropdown.Item>
//                         </Dropdown.Menu>
//                         </Dropdown>
//                 </Col>
//                 <Col md={6} style={{textAlign:'right'}}>
//                 </Col>
//                 </Row>
                
                
//                 {this.addproducts("wins")}
//                 <hr></hr>
//                 <h4 className="ml-3">Your hosted auctions</h4>
//                 <Row>
//                 <Col md={6}>
//                 <Dropdown style={{margin:'10px'}}>
//                         <Dropdown.Toggle id="auction-filter"
//                             style={{paddingLeft:'20px', paddingRight:'20px', backgroundColor:'#21325E'}}
//                         >
//                             {this.state.hosted_auctions_filter}
//                         </Dropdown.Toggle>

//                         <Dropdown.Menu>
//                             <Dropdown.Item onClick={async()=>{await this.setState({hosted_auctions_filter:'Ongoing'})}}>Ongoing</Dropdown.Item>
//                             <Dropdown.Item onClick={async()=>{await this.setState({hosted_auctions_filter:'Completed'})}}>Completed</Dropdown.Item>
//                         </Dropdown.Menu>
//                         </Dropdown>
//                 </Col>
//                 <Col md={6} style={{textAlign:'right'}}>
//                 </Col>
//                 </Row>
                
                
//                 {this.addproducts("hosted")}

//                 <hr></hr>
//                 <Row>
//                 <h4 className="ml-3">Currently leading auctions</h4>
//                 </Row>

//                 {this.addproducts("leading")}

//             </Container>
//             </>
//         );
//     }
// }

// export default BidStats;


import { Component } from "react";
import { Container, Row, Col, Spinner, Modal } from "react-bootstrap";
import { abi } from "../Resources/abi";
import { AiFillHeart } from 'react-icons/ai';
import { FaEthereum } from 'react-icons/fa';
import io from 'socket.io-client';
import NavBar from './NavBar';

var endpoint = "http://localhost:4000";
const Web3 = require('web3');
const socket = io.connect(endpoint);

class BidStats extends Component {
  constructor(props) {
    super(props);
    this.state = {
      auctions: [],
      b: 0,
      connectwalletstatus: 'Connect Wallet',
      account_addr: '',
      web3: null,
      contractval: '',
      connect_web3_modal: false,
      metamask_installed: false,
      auction_listed_modal: false,
      blockchain_auction_data: [],
      wins_payment_filter: 'Payment Pending',
      hosted_auctions_filter: 'Ongoing',
    };
    this.addproducts = this.addproducts.bind(this);
    this.connect = this.connect.bind(this);
    this.initialiseAddress = this.initialiseAddress.bind(this);
    this.unixToDate = this.unixToDate.bind(this);
  }

  componentDidMount = async () => {
    if (!JSON.parse(localStorage.getItem('user'))) {
      window.location.href = "http://localhost:3000";
    }

    var web3;
    if (typeof window.web3 !== 'undefined') {
      web3 = new Web3(window.ethereum);
      const address = "0x03759FED743Ee7C5c972ce2109b0c2dE073a0172";
      const contract = new web3.eth.Contract(abi, address);
      this.setState({ contractval: contract });
      await contract.methods.view_all_auctions().call().then(result => {
        this.setState({ blockchain_auction_data: result });
      });
      this.setState({ web3 });
      web3.eth.getAccounts().then(accounts => {
        if (accounts.length === 0) this.setState({ connect_web3_modal: true });
        else this.initialiseAddress(web3);
      });
    } else {
      this.setState({ metamask_installed: true });
    }
    if (window.ethereum) {
      window.ethereum.on('accountsChanged', () => this.initialiseAddress(web3));
    }

    fetch('http://localhost:8000/home', { method: 'GET', headers: { 'Content-Type': 'application/json' } })
      .then(r => r.ok ? r.json() : null)
      .then(res => { if (res) this.setState({ auctions: res, b: 1 }); });

    socket.on('message', data => {
      const allprods = [...this.state.auctions];
      for (let i = 0; i < allprods.length; i++) {
        if (allprods[i]["_id"] === data["id"]) {
          allprods[i]["bid_count"] = data["bidcount"];
          allprods[i]["price"] = data["news"];
          this.setState({ auctions: allprods });
          break;
        }
      }
    });
    socket.on('update', data => this.setState({ auctions: data }));
  }

  unixToDate(unix_timestamp) {
    return new Date(parseInt(unix_timestamp)).toLocaleDateString('en-UK');
  }

  initialiseAddress(web3) {
    web3.eth.getAccounts().then(accounts => {
      const account_addr = accounts[0];
      this.setState({ account_addr });
      if (!account_addr) { this.setState({ connectwalletstatus: 'Connect Wallet' }); return; }
      const len = account_addr.length;
      const cropped = account_addr.substring(0, 6) + "..." + account_addr.substring(len - 4, len);
      web3.eth.getBalance(account_addr).then(balance => {
        const bal = Math.round(web3.utils.fromWei(balance) * 100) / 100;
        this.setState({ connectwalletstatus: `${cropped} (${bal} ETH)`, connect_web3_modal: false });
      });
    });
  }

  connect(web3) {
    window.ethereum.request({ method: 'eth_requestAccounts' }).catch(err => {
      if (err.code === 4001) { alert('Please connect to MetaMask.'); this.setState({ connect_web3_modal: true }); }
      else console.error(err);
    });
  }

  // Renders a single auction card given auction data and type
  renderAuctionCard(auction, blockchain_data, type) {
    const isWinPayment = type === 'win-payment';
    const isWinPaid = type === 'win-paid';
    const isHostedOngoing = type === 'hosted-ongoing';
    const isHostedCompletedReady = type === 'hosted-completed-ready';
    const isHostedCompletedWaiting = type === 'hosted-completed-waiting';
    const isLeading = type === 'leading';

    const getActionButton = () => {
      if (isWinPayment) return (
        <button className="btn-success-sb btn-full" onClick={() => {
          const web3 = this.state.web3;
          const contract = this.state.contractval;
          const account_addr = this.state.account_addr;
          const bd = this.state.blockchain_auction_data[auction._id];
          const amount = bd.winning_bid_amt;
          contract.methods.make_payment(auction._id).send({ from: account_addr, value: amount })
            .on('receipt', () => { alert("Payment Successful"); })
            .on('error', err => alert("Payment Failed: " + (err.message || "Unknown error")));
        }}>
          Make Payment
        </button>
      );
      if (isHostedCompletedReady) return (
        <button className="btn-primary-sb btn-full" onClick={() => {
          const { web3, contractval: contract, account_addr } = this.state;
          contract.methods.withdraw_from_auction(auction._id).send({ from: account_addr })
            .on('receipt', () => alert("Withdrawal Successful"))
            .on('error', err => alert("Withdrawal Failed"));
        }}>
          Collect Funds
        </button>
      );
      if (isHostedCompletedWaiting) return (
        <button className="btn-ghost-sb btn-full" disabled style={{ opacity: 0.5, cursor: 'not-allowed' }}>
          Awaiting Payment
        </button>
      );
      return null;
    };

    const getSubInfo = () => {
      if (isWinPayment || isWinPaid) return (
        <div style={{ marginBottom: '12px' }}>
          <div className="meta-label">Auction Owner</div>
          <div className="address-chip">{blockchain_data.auction_owner}</div>
        </div>
      );
      if (isHostedOngoing || isLeading) return (
        <div style={{ marginBottom: '12px' }}>
          <div className="meta-label">Current Leader</div>
          <div className="address-chip">{auction.winner_address || 'No bids yet'}</div>
        </div>
      );
      if (isHostedCompletedReady || isHostedCompletedWaiting) return (
        <div style={{ marginBottom: '12px' }}>
          <div className="meta-label">Winner</div>
          <div className="address-chip">{auction.winner_address}</div>
        </div>
      );
      return null;
    };

    const bidLabel = (isHostedOngoing || isLeading) ? 'Current Bid' :
                     (isWinPayment || isWinPaid) ? 'Your Bid' : 'Winning Bid';

    return (
      <div key={auction._id} className="auction-card fade-in-up" style={{ marginBottom: '0' }}>
        <div className="card-img-wrap">
          <img className="card-img" src={auction.link} alt={auction.title} />
        </div>
        <div className="card-body-sb">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '6px' }}>
            <h4 className="card-title" style={{ flex: 1 }}>{auction.title}</h4>
            <div className="bid-chip" style={{ marginLeft: '10px', flexShrink: 0 }}>
              <AiFillHeart style={{ fontSize: '11px' }} />
              {auction.bid_count}
            </div>
          </div>
          <p className="card-desc">{auction.description.slice(0, 60)}…</p>

          <div className="card-divider" />

          <div style={{ marginBottom: '12px' }}>
            <div className="meta-label">{bidLabel}</div>
            <div className="meta-value">
              {auction.price}
              <FaEthereum className="eth-icon" />
            </div>
          </div>

          {getSubInfo()}

          {getActionButton()}
        </div>
      </div>
    );
  }

  addproducts(filtercriteria) {
    if (this.state.b === 0) return (
      <div style={{ display: 'flex', justifyContent: 'center', padding: '40px 0' }}>
        <Spinner animation="border" style={{ width: '40px', height: '40px' }} />
      </div>
    );

    const cards = [];
    this.state.auctions.forEach(auction => {
      const blockchain_data = this.state.blockchain_auction_data[auction._id];
      if (!blockchain_data) return;

      if (filtercriteria === "wins" && this.state.wins_payment_filter === "Payment Pending" &&
          parseInt(Date.now() / 1000) > parseInt(blockchain_data.time_of_deadline) &&
          auction.winner_address === this.state.account_addr && !blockchain_data.amount_status) {
        cards.push(this.renderAuctionCard(auction, blockchain_data, 'win-payment'));
      }
      else if (filtercriteria === "wins" && this.state.wins_payment_filter === "Paid" &&
          parseInt(Date.now()) > auction.ending_date &&
          auction.winner_address === this.state.account_addr && blockchain_data.amount_status) {
        cards.push(this.renderAuctionCard(auction, blockchain_data, 'win-paid'));
      }
      else if (filtercriteria === "hosted" && this.state.hosted_auctions_filter === "Ongoing" &&
          parseInt(Date.now()) < auction.ending_date && blockchain_data.auction_owner === this.state.account_addr) {
        cards.push(this.renderAuctionCard(auction, blockchain_data, 'hosted-ongoing'));
      }
      else if (filtercriteria === "hosted" && this.state.hosted_auctions_filter === "Completed" &&
          parseInt(Date.now()) > auction.ending_date && blockchain_data.auction_owner === this.state.account_addr &&
          blockchain_data.is_active && blockchain_data.amount_status) {
        cards.push(this.renderAuctionCard(auction, blockchain_data, 'hosted-completed-ready'));
      }
      else if (filtercriteria === "hosted" && this.state.hosted_auctions_filter === "Completed" &&
          parseInt(Date.now()) > auction.ending_date && blockchain_data.auction_owner === this.state.account_addr &&
          blockchain_data.is_active && !blockchain_data.amount_status) {
        cards.push(this.renderAuctionCard(auction, blockchain_data, 'hosted-completed-waiting'));
      }
      else if (filtercriteria === "leading" &&
          parseInt(Date.now()) < auction.ending_date && auction.winner_address === this.state.account_addr) {
        cards.push(this.renderAuctionCard(auction, blockchain_data, 'leading'));
      }
    });

    if (cards.length === 0) return (
      <div className="empty-state">
        <div className="empty-icon">📭</div>
        <p>No auctions in this category yet.</p>
      </div>
    );

    return <div className="auction-grid">{cards}</div>;
  }

  render() {
    const isConnected = this.state.connectwalletstatus !== 'Connect Wallet';

    return (
      <>
        <NavBar />
        <Container style={{ padding: '0 24px' }}>
          {/* Page Header */}
          <div className="page-header">
            <h1 className="page-title">Your Stats</h1>
            <button
              className={`wallet-btn${isConnected ? ' connected' : ''}`}
              onClick={() => {
                const web3 = this.state.web3;
                if (!isConnected) { this.connect(web3); this.initialiseAddress(web3); }
                else {
                  navigator.clipboard.writeText(this.state.account_addr);
                  this.setState({ connectwalletstatus: 'Copied ✓' });
                  setTimeout(() => this.initialiseAddress(web3), 500);
                }
              }}
            >
              {isConnected ? '⬡ ' : ''}{this.state.connectwalletstatus}
            </button>
          </div>

          <div className="section-divider" />

          {/* Wins Section */}
          <div className="stats-section">
            <div className="section-header">
              <h2 className="section-title">Auction Wins</h2>
              <div style={{ display: 'flex', gap: '6px' }}>
                {['Payment Pending', 'Paid'].map(f => (
                  <button
                    key={f}
                    className={this.state.wins_payment_filter === f ? 'btn-primary-sb' : 'btn-ghost-sb'}
                    style={{ padding: '7px 14px', fontSize: '12px' }}
                    onClick={() => this.setState({ wins_payment_filter: f })}
                  >
                    {f}
                  </button>
                ))}
              </div>
            </div>
            {this.addproducts("wins")}
          </div>

          <div className="section-divider" />

          {/* Hosted Section */}
          <div className="stats-section">
            <div className="section-header">
              <h2 className="section-title">Hosted Auctions</h2>
              <div style={{ display: 'flex', gap: '6px' }}>
                {['Ongoing', 'Completed'].map(f => (
                  <button
                    key={f}
                    className={this.state.hosted_auctions_filter === f ? 'btn-primary-sb' : 'btn-ghost-sb'}
                    style={{ padding: '7px 14px', fontSize: '12px' }}
                    onClick={() => this.setState({ hosted_auctions_filter: f })}
                  >
                    {f}
                  </button>
                ))}
              </div>
            </div>
            {this.addproducts("hosted")}
          </div>

          <div className="section-divider" />

          {/* Leading Section */}
          <div className="stats-section">
            <div className="section-header">
              <h2 className="section-title">Currently Leading</h2>
            </div>
            {this.addproducts("leading")}
          </div>

        </Container>

        {/* Modals */}
        <Modal show={this.state.connect_web3_modal} centered>
          <Modal.Header><Modal.Title>Connect Wallet</Modal.Title></Modal.Header>
          <Modal.Body><p>Connect your MetaMask wallet to use StartBid.</p></Modal.Body>
          <Modal.Footer>
            <button className="btn-primary-sb" onClick={async () => {
              if (typeof window.web3 !== 'undefined') {
                const web3 = new Web3(window.ethereum);
                this.setState({ web3 });
                this.connect(web3);
                this.initialiseAddress(web3);
                const contract = new web3.eth.Contract(abi, "0x03759FED743Ee7C5c972ce2109b0c2dE073a0172");
                this.setState({ contractval: contract });
              } else {
                alert('Please install MetaMask and refresh.');
              }
            }}>Connect Wallet</button>
          </Modal.Footer>
        </Modal>

        <Modal show={this.state.metamask_installed} centered>
          <Modal.Header><Modal.Title>MetaMask Required</Modal.Title></Modal.Header>
          <Modal.Body><p>Please install MetaMask and reload the page.</p></Modal.Body>
        </Modal>

        <Modal show={this.state.auction_listed_modal} centered>
          <Modal.Header><Modal.Title>Success</Modal.Title></Modal.Header>
          <Modal.Body><p>Transaction completed successfully.</p></Modal.Body>
          <Modal.Footer>
            <button className="btn-ghost-sb" onClick={() => this.setState({ auction_listed_modal: false })}>Close</button>
          </Modal.Footer>
        </Modal>
      </>
    );
  }
}

export default BidStats;