// import { Component } from "react";
// import { Row, Col, Image, Button, Container, Breadcrumb, BreadcrumbItem, Modal, Table } from 'react-bootstrap';
// import { FaEthereum } from 'react-icons/fa';
// import { abi } from "../Resources/abi";
// import io from 'socket.io-client';
// import NavBar from './NavBar';
// const Web3 = require('web3');

// const endpoint = "http://localhost:4000";
// const socket = io.connect(endpoint);

// class MakeBid extends Component {
//     constructor(props) {
//         super(props);
//         this.state = {
//             product: {},
//             amount: 0,
//             starttime: 0,
//             endtime: 0,
//             auction_bid_modal: false,
//             latency: 0,
//             connectwalletstatus: 'Connect Wallet',
//             account_addr: '',
//             account_bal: 0,
//             web3: null,
//             setshow: false,
//             a: 0,
//             contractval: '',
//             tablearr: [],
//             tabletoggle: 0,
//             connect_web3_modal: false,
//             metamask_installed: false,
//             balance_modal: false,
//             transaction_sucess_modal: false,
//         };
//         this.rendercomponent = this.rendercomponent.bind(this);
//         this.rendertable = this.rendertable.bind(this);
//         this.renderrow = this.renderrow.bind(this);
//     }

//     async componentDidMount() {
//         const user = JSON.parse(localStorage.getItem('user'));
//         if (!user) {
//             window.location.href = "http://localhost:3000";
//             return;
//         }

//         let web3;
//         if (typeof window.web3 !== 'undefined') {
//             web3 = new Web3(window.ethereum);
//             const address = "0x03759FED743Ee7C5c972ce2109b0c2dE073a0172";
//             const contract = new web3.eth.Contract(abi, address);
//             this.setState({ contractval: contract, web3 });

//             const accounts = await web3.eth.getAccounts();
//             if (accounts.length === 0) {
//                 this.setState({ connect_web3_modal: true });
//             } else {
//                 this.initialiseAddress(web3);
//             }
//         } else {
//             this.setState({ metamask_installed: true });
//         }

//         if (window.ethereum) {
//             window.ethereum.on('accountsChanged', () => {
//                 this.initialiseAddress(web3);
//             });
//         }

//         const key = { id: this.props.productId };
//         const res = await fetch('http://localhost:8000/product', {
//             method: 'POST',
//             headers: { 'Content-Type': 'application/json' },
//             body: JSON.stringify(key)
//         }).then(r => r.ok ? r.json() : null);

//         if (res) {
//             this.setState({ product: res, a: 1, tabletoggle: 1 });
//             console.log("res :",res);
            

//             const auc_id = res.blockchain_id;
//             const contract = this.state.contractval;

//             if (auc_id !== undefined) {
//                 const result = await contract.methods.view_all_transactions(auc_id).call();
//                 let arr = [];
//                 for (let i = result.length - 1; i >= 0; i--) {
//                     arr.push({
//                         order: result[i].order,
//                         bid_placer: result[i].bid_placer,
//                         bidded_value: web3.utils.fromWei(result[i].bidded_value, 'ether'),
//                         timestamp: result[i].timestamp,
//                     });
//                 }
//                 arr.sort((a, b) => parseInt(b.timestamp) - parseInt(a.timestamp));
//                 this.setState({ tablearr: arr });
//             } else {
//                 console.warn("Aucun blockchain_id trouvé pour cette enchère");
//             }
//         }

//         socket.on('message', data => {
//             console.log("Message socket reçu", data);
//             const prod_id = this.state.product.blockchain_id;
//             if (data["id"] === prod_id) {
//                 const prod2 = { ...this.state.product };
//                 prod2.price = data['news'];
//                 prod2.bid_count = data['bidcount'];
//                 this.setState({ product: prod2, endtime: Date.now() });
//                 const latencyval = this.state.endtime - this.state.starttime;
//                 this.setState({ latency: latencyval });
//             }
//         });
//     }

//     initialiseAddress(web3) {
//         web3.eth.getAccounts().then(accounts => {
//             const account_addr = accounts[0];
//             this.setState({ account_addr });

//             if (!account_addr) {
//                 this.setState({ connectwalletstatus: 'Connect Wallet' });
//                 return;
//             }

//             const cropped = account_addr.substring(0, 6) + "..." + account_addr.substring(account_addr.length - 4);
//             web3.eth.getBalance(account_addr).then(balance => {
//                 const bal = Math.round(web3.utils.fromWei(balance) * 100) / 100;
//                 this.setState({
//                     account_bal: bal,
//                     connectwalletstatus: `${cropped} (${bal} ETH)`
//                 });
//             });
//         });
//     }

//     connect(web3) {
//         window.ethereum.request({ method: 'eth_requestAccounts' })
//             .then(() => this.initialiseAddress(web3))
//             .catch(err => {
//                 if (err.code === 4001) alert('Connexion MetaMask annulée');
//                 else console.error(err);
//             });
//     }

//     rendercomponent() {
//         if (this.state.a === 0) return <div></div>;

//         const isActive = parseInt(Date.now()) < this.state.product.ending_date;

//         return (
//             <>
//                 <Modal show={this.state.connect_web3_modal}> {/* ... */} </Modal>
//                 <Modal show={this.state.metamask_installed}> {/* ... */} </Modal>
//                 <Modal show={this.state.transaction_sucess_modal}> {/* ... */} </Modal>
//                 <Modal show={this.state.balance_modal}> {/* ... */} </Modal>
//                 <Modal show={this.state.auction_bid_modal}> {/* ... */} </Modal>

//                 <Container>
//                     <Row style={{ marginTop: '20px' }}>
//                         <Col md={9}>
//                             <Breadcrumb>
//                                 <BreadcrumbItem href="/explore">Explore</BreadcrumbItem>
//                                 <BreadcrumbItem active>{this.state.product.title}</BreadcrumbItem>
//                             </Breadcrumb>
//                         </Col>
//                         <Col md={3}>
//                             <Button
//                                 style={{ width: '90%', height: '45px', backgroundColor: '#FFA0A0', fontWeight: 'bolder', border: 'none', color: '#21325E' }}
//                                 onClick={() => {
//                                     const web3 = this.state.web3;
//                                     if (this.state.connectwalletstatus === 'Connect Wallet') {
//                                         this.connect(web3);
//                                     } else {
//                                         navigator.clipboard.writeText(this.state.account_addr);
//                                         this.setState({ connectwalletstatus: 'Copied' });
//                                         setTimeout(() => this.initialiseAddress(web3), 400);
//                                     }
//                                 }}
//                             >
//                                 {this.state.connectwalletstatus}
//                             </Button>
//                         </Col>
//                     </Row>

//                     <Row style={{ marginTop: '30px' }}>
//                         <Col md={5}>
//                             <Image src={this.state.product.link} height='350px' width='350px' style={{ margin: '50px', objectFit: 'cover' }} />
//                         </Col>

//                         <Col md={7} style={{ padding: '50px' }}>
//                             <Row>
//                                 <Col md={1}>
//                                     <svg viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
//                                         <circle cx="50" cy="50" r="30" className={isActive ? "live-icon" : "live-icon-finished"} />
//                                     </svg>
//                                 </Col>
//                                 <Col md={11} style={{ paddingLeft: '0px' }}>
//                                     <h1 style={{ fontWeight: 'bolder' }}>{this.state.product.title}</h1>
//                                 </Col>
//                             </Row>

//                             <h5>{this.state.product.description}</h5>
//                             <hr />

//                             {isActive ? (
//                                 <>
//                                     <h3>Current Bid : <strong style={{ color: 'green' }}>{this.state.product.price}</strong> <FaEthereum /></h3>
//                                     <h5>Nombre d'enchérisseurs : <strong>{this.state.product.bid_count}</strong></h5>
//                                     <h5>Gagnant actuel : <span style={{ fontWeight: 'light', fontSize: '17px' }}>{this.state.product.winner_address || "Aucun"}</span></h5>
//                                     <hr />

//                                     <Row>
//                                         <Col md={3}>
//                                             <input
//                                                 id="bidinput"
//                                                 onChange={e => this.setState({ amount: e.target.value })}
//                                                 type='number'
//                                                 style={{ height: '45px', width: '100%', fontSize: '30px' }}
//                                             />
//                                         </Col>
//                                         <Col md={5}>
//                                             <Button
//                                                 className="btn-lg"
//                                                 style={{ width: '90%', backgroundColor: '#FFA0A0', fontWeight: 'bolder', border: 'none', color: '#21325E' }}
//                                                 onClick={async () => {
//                                                     const amount = parseFloat(this.state.amount);
//                                                     if (!amount || amount <= parseFloat(this.state.product.price)) {
//                                                         this.setState({ auction_bid_modal: true });
//                                                         return;
//                                                     }

//                                                     if (this.state.account_bal < amount + 0.01) {
//                                                         this.setState({ balance_modal: true });
//                                                         return;
//                                                     }

//                                                     try {
//                                                         const web3 = this.state.web3;
//                                                         const contract = this.state.contractval;
//                                                         const account_addr = this.state.account_addr;
//                                                         const auc_id = this.state.product.blockchain_id; // ← CHANGEMENT CLÉ

//                                                         if (!auc_id) {
//                                                             alert("Erreur : ID blockchain non trouvé pour cette enchère");
//                                                             return;
//                                                         }

//                                                         const order = (this.state.product.bid_count || 0) + 1;
//                                                         const biddedValueWei = web3.utils.toWei(amount.toString(), 'ether');

//                                                         console.log("Params make_bid :", { auction_id: auc_id, order, valueWei: biddedValueWei, from: account_addr });

//                                                         await contract.methods.make_bid(auc_id, order, biddedValueWei).estimateGas({ from: account_addr });

//                                                         const s = {
//                                                             news: amount,
//                                                             id: auc_id,               // ← blockchain_id
//                                                             address: account_addr,
//                                                             bidcount: order,
//                                                         };

//                                                         contract.methods.make_bid(auc_id, order, biddedValueWei)
//                                                             .send({ from: account_addr })
//                                                             .on('transactionHash', hash => {
//                                                                 this.setState({ starttime: Date.now() });
//                                                                 socket.emit('change', s);
//                                                                 console.log("Tx hash:", hash);
//                                                             })
//                                                             .on('receipt', () => {
//                                                                 this.setState({ transaction_sucess_modal: true });
//                                                                 // Rafraîchir l'historique ici si besoin
//                                                             })
//                                                             .on('error', error => {
//                                                                 console.error("Erreur tx:", error);
//                                                                 alert("Échec enchère : " + (error.message || "Transaction rejetée"));
//                                                             });
//                                                     } catch (err) {
//                                                         console.error("Erreur préparation:", err);
//                                                         alert("Échec simulation : " + (err.reason || err.message || "Rejet contrat"));
//                                                     }
//                                                 }}
//                                             >
//                                                 Make a Bid
//                                             </Button>
//                                         </Col>
//                                     </Row>
//                                     <p>Measured latency: {this.state.latency} ms</p>
//                                 </>
//                             ) : (
//                                 <>
//                                     <hr />
//                                     <p className="ml-5" style={{ fontSize: 'larger' }}><strong>Auction Status:</strong> Terminée</p>
//                                     <p className="ml-5" style={{ fontSize: 'larger' }}><strong>Gagnant:</strong> {this.state.product.winner_address || "Aucun"}</p>
//                                     <p className="ml-5" style={{ fontSize: 'larger' }}><strong>Montant gagnant:</strong> {this.state.product.price} <FaEthereum /></p>
//                                     <p className="ml-5" style={{ fontSize: 'larger' }}><strong>Nombre d'enchères:</strong> {this.state.product.bid_count}</p>
//                                 </>
//                             )}
//                         </Col>
//                     </Row>

//                     <Row>
//                         <Col md={9}>
//                             <h1 className="mt-5">Historique des enchères (Blockchain)</h1>
//                         </Col>
//                     </Row>
//                     {this.rendertable()}
//                 </Container>
//             </>
//         );
//     }

//     renderrow(arr) {
//         return (
//             <tr key={arr.timestamp}>
//                 <td>{new Date(parseInt(arr.timestamp) * 1000).toLocaleString()}</td>
//                 <td>{arr.bid_placer}</td>
//                 <td>{arr.bidded_value} ETH</td>
//             </tr>
//         );
//     }

//     rendertable() {
//         if (this.state.tabletoggle !== 1) return <div></div>;

//         return (
//             <Table striped bordered hover>
//                 <thead>
//                     <tr>
//                         <th>Timestamp</th>
//                         <th>Enchérisseur</th>
//                         <th>Montant</th>
//                     </tr>
//                 </thead>
//                 <tbody>
//                     {this.state.tablearr.map(arr => this.renderrow(arr))}
//                 </tbody>
//             </Table>
//         );
//     }

//     render() {
//         return (
//             <>
//                 <NavBar />
//                 {this.rendercomponent()}
//             </>
//         );
//     }
// }

// export default MakeBid;




// import { Component } from "react";
// import { Container, Row, Col, Spinner, Modal, Table } from 'react-bootstrap';
// import { FaEthereum } from 'react-icons/fa';
// import { abi } from "../Resources/abi";
// import io from 'socket.io-client';
// import NavBar from './NavBar';

// const Web3 = require('web3');
// const endpoint = "http://localhost:4000";
// const socket = io.connect(endpoint);

// class MakeBid extends Component {
//   constructor(props) {
//     super(props);
//     this.state = {
//       product: {},
//       amount: 0,
//       starttime: 0,
//       endtime: 0,
//       auction_bid_modal: false,
//       latency: 0,
//       connectwalletstatus: 'Connect Wallet',
//       account_addr: '',
//       account_bal: 0,
//       web3: null,
//       a: 0,
//       contractval: '',
//       tablearr: [],
//       tabletoggle: 0,
//       connect_web3_modal: false,
//       metamask_installed: false,
//       balance_modal: false,
//       transaction_sucess_modal: false,
//     };
//     this.rendercomponent = this.rendercomponent.bind(this);
//     this.rendertable = this.rendertable.bind(this);
//   }

//   async componentDidMount() {
//     const user = JSON.parse(localStorage.getItem('user'));
//     if (!user) { window.location.href = "http://localhost:3000"; return; }

//     let web3;
//     if (typeof window.web3 !== 'undefined') {
//       web3 = new Web3(window.ethereum);
//       const address = "0x03759FED743Ee7C5c972ce2109b0c2dE073a0172";
//       const contract = new web3.eth.Contract(abi, address);
//       this.setState({ contractval: contract, web3 });
//       const accounts = await web3.eth.getAccounts();
//       if (accounts.length === 0) this.setState({ connect_web3_modal: true });
//       else this.initialiseAddress(web3);
//     } else {
//       this.setState({ metamask_installed: true });
//     }
//     if (window.ethereum) window.ethereum.on('accountsChanged', () => this.initialiseAddress(web3));

//     const res = await fetch('http://localhost:8000/product', {
//       method: 'POST',
//       headers: { 'Content-Type': 'application/json' },
//       body: JSON.stringify({ id: this.props.productId }),
//     }).then(r => r.ok ? r.json() : null);

//     if (res) {
//       this.setState({ product: res, a: 1, tabletoggle: 1 });
//       const auc_id = res.blockchain_id;
//       const contract = this.state.contractval;
//       if (auc_id !== undefined) {
//         const result = await contract.methods.view_all_transactions(auc_id).call();
//         let arr = [];
//         for (let i = result.length - 1; i >= 0; i--) {
//           arr.push({
//             order: result[i].order,
//             bid_placer: result[i].bid_placer,
//             bidded_value: web3.utils.fromWei(result[i].bidded_value, 'ether'),
//             timestamp: result[i].timestamp,
//           });
//         }
//         arr.sort((a, b) => parseInt(b.timestamp) - parseInt(a.timestamp));
//         this.setState({ tablearr: arr });
//       }
//     }

//     socket.on('message', data => {
//       const prod_id = this.state.product.blockchain_id;
//       if (data["id"] === prod_id) {
//         const prod2 = { ...this.state.product, price: data['news'], bid_count: data['bidcount'] };
//         this.setState({ product: prod2, endtime: Date.now(), latency: Date.now() - this.state.starttime });
//       }
//     });
//   }

//   initialiseAddress(web3) {
//     web3.eth.getAccounts().then(accounts => {
//       const account_addr = accounts[0];
//       this.setState({ account_addr });
//       if (!account_addr) { this.setState({ connectwalletstatus: 'Connect Wallet' }); return; }
//       const cropped = account_addr.substring(0, 6) + "..." + account_addr.substring(account_addr.length - 4);
//       web3.eth.getBalance(account_addr).then(balance => {
//         const bal = Math.round(web3.utils.fromWei(balance) * 100) / 100;
//         this.setState({ account_bal: bal, connectwalletstatus: `${cropped} (${bal} ETH)` });
//       });
//     });
//   }

//   connect(web3) {
//     window.ethereum.request({ method: 'eth_requestAccounts' })
//       .then(() => this.initialiseAddress(web3))
//       .catch(err => { if (err.code === 4001) alert('MetaMask connection cancelled'); else console.error(err); });
//   }

//   rendercomponent() {
//     if (this.state.a === 0) return (
//       <div style={{ display: 'flex', justifyContent: 'center', padding: '80px 0' }}>
//         <Spinner animation="grow" style={{ width: '60px', height: '60px' }} />
//       </div>
//     );

//     const { product } = this.state;
//     const isActive = parseInt(Date.now()) < product.ending_date;
//     const isConnected = this.state.connectwalletstatus !== 'Connect Wallet';

//     return (
//       <Container style={{ padding: '0 24px' }}>
//         {/* Top bar */}
//         <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '24px 0 16px' }}>
//           <nav aria-label="breadcrumb">
//             <ol className="breadcrumb" style={{ marginBottom: 0 }}>
//               <li className="breadcrumb-item"><a href="/explore">Explore</a></li>
//               <li className="breadcrumb-item active">{product.title}</li>
//             </ol>
//           </nav>
//           <button
//             className={`wallet-btn${isConnected ? ' connected' : ''}`}
//             onClick={() => {
//               const web3 = this.state.web3;
//               if (!isConnected) { this.connect(web3); }
//               else {
//                 navigator.clipboard.writeText(this.state.account_addr);
//                 this.setState({ connectwalletstatus: 'Copied ✓' });
//                 setTimeout(() => this.initialiseAddress(web3), 500);
//               }
//             }}
//           >
//             {isConnected ? '⬡ ' : ''}{this.state.connectwalletstatus}
//           </button>
//         </div>

//         {/* Main content */}
//         <Row style={{ marginTop: '16px', marginBottom: '40px' }}>
//           {/* Image */}
//           <Col md={5}>
//             <div className="bid-image-wrap">
//               <img
//                 className="bid-image"
//                 src={product.link}
//                 alt={product.title}
//               />
//             </div>
//           </Col>

//           {/* Info panel */}
//           <Col md={7} className="bid-info-panel">
//             <div className="bid-status-label">
//               {isActive
//                 ? <><span className="live-dot" />Live Auction</>
//                 : <><span className="ended-dot" />Auction Ended</>
//               }
//             </div>

//             <h1 style={{ fontFamily: 'var(--font-display)', fontSize: 'clamp(24px, 3vw, 38px)', fontWeight: 800, letterSpacing: '-0.03em', marginBottom: '10px' }}>
//               {product.title}
//             </h1>

//             <p style={{ color: 'var(--text-secondary)', fontSize: '14px', lineHeight: 1.7, marginBottom: '20px' }}>
//               {product.description}
//             </p>

//             <div style={{ height: '1px', background: 'var(--border)', marginBottom: '20px' }} />

//             {isActive ? (
//               <>
//                 <div style={{ marginBottom: '20px' }}>
//                   <div className="meta-label" style={{ marginBottom: '6px' }}>Current Bid</div>
//                   <div className="bid-current-price">
//                     {product.price}
//                     <FaEthereum className="eth-sym" />
//                   </div>
//                 </div>

//                 <div style={{ display: 'flex', gap: '24px', marginBottom: '20px' }}>
//                   <div>
//                     <div className="meta-label">Bidders</div>
//                     <div style={{ fontFamily: 'var(--font-display)', fontSize: '18px', fontWeight: 700, color: 'var(--text-primary)' }}>
//                       {product.bid_count || 0}
//                     </div>
//                   </div>
//                   <div>
//                     <div className="meta-label">Current Leader</div>
//                     <div className="address-chip" style={{ marginTop: '4px' }}>
//                       {product.winner_address || 'No bids yet'}
//                     </div>
//                   </div>
//                 </div>

//                 <div style={{ height: '1px', background: 'var(--border)', marginBottom: '20px' }} />

//                 <div style={{ marginBottom: '8px' }}>
//                   <div className="meta-label" style={{ marginBottom: '8px' }}>Your Bid (ETH)</div>
//                   <div className="bid-input-row">
//                     <input
//                       id="bidinput"
//                       type="number"
//                       className="form-control bid-input"
//                       placeholder="0.0"
//                       onChange={e => this.setState({ amount: e.target.value })}
//                     />
//                     <button
//                       className="btn-primary-sb"
//                       style={{ flex: 1, padding: '12px', fontSize: '15px' }}
//                       onClick={async () => {
//                         const amount = parseFloat(this.state.amount);
//                         if (!amount || amount <= parseFloat(product.price)) {
//                           this.setState({ auction_bid_modal: true }); return;
//                         }
//                         if (this.state.account_bal < amount + 0.01) {
//                           this.setState({ balance_modal: true }); return;
//                         }
//                         try {
//                           const { web3, contractval: contract, account_addr } = this.state;
//                           const auc_id = product.blockchain_id;
//                           if (!auc_id) { alert("Auction blockchain ID not found"); return; }
//                           const order = (product.bid_count || 0) + 1;
//                           const biddedValueWei = web3.utils.toWei(amount.toString(), 'ether');
//                           await contract.methods.make_bid(auc_id, order, biddedValueWei).estimateGas({ from: account_addr });
//                           const s = { news: amount, id: auc_id, address: account_addr, bidcount: order };
//                           contract.methods.make_bid(auc_id, order, biddedValueWei)
//                             .send({ from: account_addr })
//                             .on('transactionHash', () => { this.setState({ starttime: Date.now() }); socket.emit('change', s); })
//                             .on('receipt', () => this.setState({ transaction_sucess_modal: true }))
//                             .on('error', err => alert("Bid failed: " + (err.message || "Rejected")));
//                         } catch (err) {
//                           alert("Simulation failed: " + (err.reason || err.message));
//                         }
//                       }}
//                     >
//                       Place Bid →
//                     </button>
//                   </div>
//                 </div>
//                 {this.state.latency > 0 && (
//                   <div className="latency-badge">
//                     ⚡ Latency: {this.state.latency}ms
//                   </div>
//                 )}
//               </>
//             ) : (
//               <div style={{ background: 'var(--bg-surface)', borderRadius: 'var(--radius-md)', padding: '20px', display: 'flex', flexDirection: 'column', gap: '12px' }}>
//                 <div>
//                   <div className="meta-label">Final Price</div>
//                   <div className="bid-current-price">{product.price}<FaEthereum className="eth-sym" /></div>
//                 </div>
//                 <div style={{ height: '1px', background: 'var(--border)' }} />
//                 <div>
//                   <div className="meta-label">Winner</div>
//                   <div className="address-chip" style={{ marginTop: '4px' }}>{product.winner_address || 'None'}</div>
//                 </div>
//                 <div>
//                   <div className="meta-label">Total Bids</div>
//                   <div style={{ fontFamily: 'var(--font-display)', fontWeight: 700, color: 'var(--text-primary)' }}>{product.bid_count}</div>
//                 </div>
//               </div>
//             )}
//           </Col>
//         </Row>

//         {/* Bid History */}
//         <div style={{ marginBottom: '60px' }}>
//           <div style={{ marginBottom: '16px' }}>
//             <h2 style={{ fontFamily: 'var(--font-display)', fontSize: '22px', fontWeight: 700 }}>
//               Bid History
//             </h2>
//             <div className="gradient-hr" />
//           </div>
//           {this.rendertable()}
//         </div>

//         {/* Modals */}
//         <Modal show={this.state.auction_bid_modal} centered>
//           <Modal.Header><Modal.Title>Invalid Bid</Modal.Title></Modal.Header>
//           <Modal.Body><p>Your bid must be higher than the current bid of {product.price} ETH.</p></Modal.Body>
//           <Modal.Footer>
//             <button className="btn-ghost-sb" onClick={() => this.setState({ auction_bid_modal: false })}>Close</button>
//           </Modal.Footer>
//         </Modal>

//         <Modal show={this.state.balance_modal} centered>
//           <Modal.Header><Modal.Title>Insufficient Balance</Modal.Title></Modal.Header>
//           <Modal.Body><p>You need at least {this.state.amount} ETH + gas fees in your wallet.</p></Modal.Body>
//           <Modal.Footer>
//             <button className="btn-ghost-sb" onClick={() => this.setState({ balance_modal: false })}>Close</button>
//           </Modal.Footer>
//         </Modal>

//         <Modal show={this.state.transaction_sucess_modal} centered>
//           <Modal.Header><Modal.Title>Bid Placed! 🎉</Modal.Title></Modal.Header>
//           <Modal.Body><p>Your bid has been successfully recorded on the blockchain.</p></Modal.Body>
//           <Modal.Footer>
//             <button className="btn-primary-sb" onClick={() => this.setState({ transaction_sucess_modal: false })}>Continue</button>
//           </Modal.Footer>
//         </Modal>

//         <Modal show={this.state.connect_web3_modal} centered>
//           <Modal.Header><Modal.Title>Connect Wallet</Modal.Title></Modal.Header>
//           <Modal.Body><p>Please connect your MetaMask wallet to place bids.</p></Modal.Body>
//           <Modal.Footer>
//             <button className="btn-primary-sb" onClick={() => { this.connect(this.state.web3); this.initialiseAddress(this.state.web3); }}>Connect</button>
//           </Modal.Footer>
//         </Modal>

//         <Modal show={this.state.metamask_installed} centered>
//           <Modal.Header><Modal.Title>MetaMask Required</Modal.Title></Modal.Header>
//           <Modal.Body><p>Please install MetaMask and reload the page.</p></Modal.Body>
//         </Modal>
//       </Container>
//     );
//   }

//   rendertable() {
//     if (this.state.tabletoggle !== 1) return null;
//     if (this.state.tablearr.length === 0) return (
//       <div className="empty-state">
//         <div className="empty-icon">📋</div>
//         <p>No bids have been placed yet.</p>
//       </div>
//     );

//     return (
//       <table className="sb-table">
//         <thead>
//           <tr>
//             <th>Timestamp</th>
//             <th>Bidder</th>
//             <th>Amount</th>
//           </tr>
//         </thead>
//         <tbody>
//           {this.state.tablearr.map((row, i) => (
//             <tr key={i}>
//               <td>{new Date(parseInt(row.timestamp) * 1000).toLocaleString()}</td>
//               <td>
//                 <span className="address-chip">{row.bid_placer}</span>
//               </td>
//               <td>{row.bidded_value} ETH</td>
//             </tr>
//           ))}
//         </tbody>
//       </table>
//     );
//   }

//   render() {
//     return (
//       <>
//         <NavBar />
//         {this.rendercomponent()}
//       </>
//     );
//   }
// }

// export default MakeBid;

// import { Component } from "react";
// import { Modal } from 'react-bootstrap';
// import { FaEthereum } from 'react-icons/fa';
// import { abi } from "../Resources/abi";
// import io from 'socket.io-client';
// import NavBar from './NavBar';
// const Web3 = require('web3');

// const endpoint = "http://localhost:4000";
// const socket = io.connect(endpoint);

// /* ─── Theme ─────────────────────────────────────────────── */
// const NAVY   = '#21325E';
// const CORAL  = '#FFA0A0';
// const CORAL2 = '#ff8080';
// const LIGHT  = '#F7F8FC';
// const CARD   = '#ffffff';
// const BORDER = '#e4e8f0';

// const S = {
//   page: { minHeight: '100vh', backgroundColor: LIGHT, fontFamily: "'Georgia', 'Times New Roman', serif" },
//   container: { maxWidth: '1100px', margin: '0 auto', padding: '0 24px 60px' },

//   /* breadcrumb */
//   topRow: { display:'flex', alignItems:'center', justifyContent:'space-between', padding:'24px 0 20px', borderBottom:`1px solid ${BORDER}`, marginBottom:'36px' },
//   crumbText: { fontSize:'13px', color:'#8a93a8', letterSpacing:'0.04em' },
//   crumbLink: { color:NAVY, textDecoration:'none', fontWeight:'600', cursor:'pointer' },
//   crumbSep: { margin:'0 8px', color:'#c0c8d8' },

//   /* wallet button */
//   walletBtn: { backgroundColor:NAVY, color:'white', border:'none', borderRadius:'8px', padding:'10px 20px', fontSize:'13px', fontFamily:"'Georgia', serif", fontWeight:'600', cursor:'pointer', letterSpacing:'0.02em' },

//   /* grid */
//   grid: { display:'grid', gridTemplateColumns:'1fr 1fr', gap:'48px', alignItems:'start' },

//   /* image */
//   imgWrap: { position:'relative', borderRadius:'16px', overflow:'hidden', boxShadow:'0 8px 40px rgba(33,50,94,0.12)', aspectRatio:'1/1' },
//   img: { width:'100%', height:'100%', objectFit:'cover', display:'block' },
//   badge: { position:'absolute', top:'16px', left:'16px', display:'flex', alignItems:'center', gap:'7px', backgroundColor:'rgba(255,255,255,0.92)', backdropFilter:'blur(6px)', borderRadius:'20px', padding:'6px 14px', fontSize:'12px', fontWeight:'700', color:NAVY, letterSpacing:'0.06em', textTransform:'uppercase' },
//   liveDot: { width:'8px', height:'8px', borderRadius:'50%', backgroundColor:'#22c55e', animation:'makebid-pulse 1.2s infinite' },
//   endedDot: { width:'8px', height:'8px', borderRadius:'50%', backgroundColor:'#94a3b8' },

//   /* detail */
//   detail: { display:'flex', flexDirection:'column' },
//   title: { fontSize:'32px', fontWeight:'700', color:NAVY, lineHeight:'1.2', marginBottom:'10px', fontFamily:"'Georgia', serif" },
//   desc: { fontSize:'15px', color:'#5a6478', lineHeight:'1.6', marginBottom:'28px' },
//   divider: { height:'1px', backgroundColor:BORDER, margin:'0 0 24px' },

//   /* stat cards */
//   statsRow: { display:'grid', gridTemplateColumns:'1fr 1fr', gap:'16px', marginBottom:'24px' },
//   statCard: { backgroundColor:CARD, border:`1px solid ${BORDER}`, borderRadius:'12px', padding:'18px 20px' },
//   statLabel: { fontSize:'11px', fontWeight:'700', color:'#94a3b8', letterSpacing:'0.08em', textTransform:'uppercase', marginBottom:'6px' },
//   statVal: { fontSize:'22px', fontWeight:'700', color:NAVY, display:'flex', alignItems:'center', gap:'6px' },
//   statValGreen: { fontSize:'22px', fontWeight:'700', color:'#16a34a', display:'flex', alignItems:'center', gap:'6px' },
//   statSub: { fontSize:'13px', color:'#94a3b8', fontWeight:'500' },

//   /* leader */
//   leaderBox: { backgroundColor:CARD, border:`1px solid ${BORDER}`, borderRadius:'12px', padding:'16px 20px', marginBottom:'24px' },
//   leaderLabel: { fontSize:'11px', fontWeight:'700', color:'#94a3b8', letterSpacing:'0.08em', textTransform:'uppercase', marginBottom:'6px' },
//   leaderAddr: { fontSize:'13px', color:NAVY, fontFamily:"'Courier New', monospace", wordBreak:'break-all' },

//   /* bid input */
//   bidRow: { display:'flex', gap:'12px', marginBottom:'10px' },
//   bidInput: { flex:'1', border:`2px solid ${BORDER}`, borderRadius:'10px', padding:'12px 16px', fontSize:'18px', fontFamily:"'Georgia', serif", color:NAVY, outline:'none', backgroundColor:CARD },
//   bidBtn: { backgroundColor:CORAL, color:NAVY, border:'none', borderRadius:'10px', padding:'12px 28px', fontSize:'15px', fontWeight:'700', fontFamily:"'Georgia', serif", cursor:'pointer', whiteSpace:'nowrap', letterSpacing:'0.02em' },
//   latency: { fontSize:'12px', color:'#94a3b8' },

//   /* ended box */
//   endedBox: { backgroundColor:CARD, border:`1px solid ${BORDER}`, borderRadius:'12px', padding:'24px' },
//   endedRow: { display:'flex', justifyContent:'space-between', alignItems:'center', padding:'10px 0', borderBottom:`1px solid ${BORDER}`, fontSize:'15px' },
//   endedLabel: { color:'#94a3b8', fontWeight:'600', fontSize:'13px', letterSpacing:'0.04em' },
//   endedVal: { color:NAVY, fontWeight:'700', fontFamily:"'Courier New', monospace", fontSize:'13px', maxWidth:'260px', textAlign:'right', wordBreak:'break-all' },

//   /* history */
//   histSection: { marginTop:'48px' },
//   histTitle: { fontSize:'20px', fontWeight:'700', color:NAVY, marginBottom:'20px', fontFamily:"'Georgia', serif", display:'flex', alignItems:'center', gap:'10px' },
//   histChip: { fontSize:'11px', backgroundColor:`${NAVY}18`, color:NAVY, borderRadius:'20px', padding:'3px 10px', fontWeight:'700', letterSpacing:'0.06em' },
//   table: { width:'100%', borderCollapse:'separate', borderSpacing:'0', backgroundColor:CARD, borderRadius:'12px', overflow:'hidden', boxShadow:'0 2px 12px rgba(33,50,94,0.06)', border:`1px solid ${BORDER}` },
//   th: { backgroundColor:NAVY, color:'white', padding:'14px 20px', fontSize:'11px', fontWeight:'700', letterSpacing:'0.08em', textTransform:'uppercase', textAlign:'left', fontFamily:"'Georgia', serif" },
//   td: { padding:'14px 20px', fontSize:'13px', color:'#374151', borderBottom:`1px solid ${BORDER}`, fontFamily:"'Courier New', monospace" },
//   tdAmt: { padding:'14px 20px', fontSize:'13px', color:'#16a34a', borderBottom:`1px solid ${BORDER}`, fontWeight:'700', fontFamily:"'Georgia', serif" },
//   tdEmpty: { padding:'32px', textAlign:'center', color:'#94a3b8', fontFamily:"'Georgia', serif", fontSize:'14px' },
// };

// /* ── inject keyframes once ── */
// const injectCSS = () => {
//   if (document.getElementById('makebid-css')) return;
//   const el = document.createElement('style');
//   el.id = 'makebid-css';
//   el.textContent = `
//     @keyframes makebid-pulse {
//       0%,100%{opacity:1;transform:scale(1)} 50%{opacity:.5;transform:scale(1.35)}
//     }
//     .mb-bid-btn:hover { background-color: ${CORAL2} !important; transform: translateY(-1px); transition: all .15s; }
//     .mb-wallet-btn:hover { background-color: #2d4480 !important; transition: background .2s; }
//     .mb-bid-input:focus { border-color: ${NAVY} !important; }
//     .mb-tr:hover td { background-color: #f0f3fa !important; transition: background .15s; }
//   `;
//   document.head.appendChild(el);
// };

// class MakeBid extends Component {
//     constructor(props) {
//         super(props);
//         this.state = {
//             product: {}, amount: 0, starttime: 0, endtime: 0,
//             auction_bid_modal: false, latency: 0,
//             connectwalletstatus: 'Connect Wallet',
//             account_addr: '', account_bal: 0, web3: null,
//             a: 0, contractval: '', tablearr: [], tabletoggle: 0,
//             connect_web3_modal: false, metamask_installed: false,
//             balance_modal: false, transaction_sucess_modal: false,
//         };
//         this.rendercomponent = this.rendercomponent.bind(this);
//         this.rendertable = this.rendertable.bind(this);
//         this.renderrow = this.renderrow.bind(this);
//     }

//     async componentDidMount() {
//         injectCSS();
//         const user = JSON.parse(localStorage.getItem('user'));
//         if (!user) { window.location.href = "http://localhost:3000"; return; }

//         let web3;
//         if (typeof window.web3 !== 'undefined') {
//             web3 = new Web3(window.ethereum);
//             const contract = new web3.eth.Contract(abi, "0x03759FED743Ee7C5c972ce2109b0c2dE073a0172");
//             this.setState({ contractval: contract, web3 });
//             const accounts = await web3.eth.getAccounts();
//             if (accounts.length === 0) this.setState({ connect_web3_modal: true });
//             else this.initialiseAddress(web3);
//         } else {
//             this.setState({ metamask_installed: true });
//         }

//         if (window.ethereum) window.ethereum.on('accountsChanged', () => this.initialiseAddress(web3));

//         const res = await fetch('http://localhost:8000/product', {
//             method: 'POST', headers: { 'Content-Type': 'application/json' },
//             body: JSON.stringify({ id: this.props.productId })
//         }).then(r => r.ok ? r.json() : null);

//         if (res) {
//             this.setState({ product: res, a: 1, tabletoggle: 1 });
//             const auc_id = res.blockchain_id;
//             const contract = this.state.contractval;
//             if (auc_id !== undefined) {
//                 const result = await contract.methods.view_all_transactions(auc_id).call();
//                 let arr = [];
//                 for (let i = result.length - 1; i >= 0; i--) {
//                     arr.push({
//                         order: result[i].order,
//                         bid_placer: result[i].bid_placer,
//                         bidded_value: web3.utils.fromWei(result[i].bidded_value, 'ether'),
//                         timestamp: result[i].timestamp,
//                     });
//                 }
//                 arr.sort((a, b) => parseInt(b.timestamp) - parseInt(a.timestamp));
//                 this.setState({ tablearr: arr });
//             }
//         }

//         socket.on('message', data => {
//             const prod = this.state.product;
//             const match = String(data["id"]) === String(prod.blockchain_id) || String(data["id"]) === String(prod._id);
//             if (match) {
//                 const prod2 = { ...prod, price: data['news'], bid_count: data['bidcount'] };
//                 if (data['address']) prod2.winner_address = data['address'];
//                 this.setState({ product: prod2, endtime: Date.now() });
//                 this.setState({ latency: this.state.endtime - this.state.starttime });
//             }
//         });
//     }

//     initialiseAddress(web3) {
//         web3.eth.getAccounts().then(accounts => {
//             const addr = accounts[0];
//             this.setState({ account_addr: addr });
//             if (!addr) { this.setState({ connectwalletstatus: 'Connect Wallet' }); return; }
//             const cropped = addr.substring(0, 6) + "..." + addr.substring(addr.length - 4);
//             web3.eth.getBalance(addr).then(bal => {
//                 const eth = Math.round(web3.utils.fromWei(bal) * 100) / 100;
//                 this.setState({ account_bal: eth, connectwalletstatus: `${cropped} (${eth} ETH)` });
//             });
//         });
//     }

//     connect(web3) {
//         window.ethereum.request({ method: 'eth_requestAccounts' })
//             .then(() => this.initialiseAddress(web3))
//             .catch(err => { if (err.code === 4001) alert('MetaMask connection cancelled'); else console.error(err); });
//     }

//     rendercomponent() {
//         if (this.state.a === 0) return (
//             <div style={{ display:'flex', justifyContent:'center', alignItems:'center', height:'300px', color:'#94a3b8' }}>
//                 <div style={{ textAlign:'center' }}>
//                     <div style={{ fontSize:'36px', marginBottom:'12px' }}>⏳</div>
//                     <p style={{ fontFamily:"'Georgia', serif" }}>Loading auction…</p>
//                 </div>
//             </div>
//         );

//         const isActive = parseInt(Date.now()) < this.state.product.ending_date;

//         return (
//             <>
//                 {/* Modals */}
//                 <Modal show={this.state.connect_web3_modal}>
//                     <Modal.Header><Modal.Title>Connect Wallet</Modal.Title></Modal.Header>
//                     <Modal.Body><p>Please connect your MetaMask wallet to continue bidding.</p></Modal.Body>
//                     <Modal.Footer>
//                         <button className="mb-wallet-btn" style={S.walletBtn} onClick={async () => {
//                             if (typeof window.web3 !== 'undefined') {
//                                 const w3 = new Web3(window.ethereum);
//                                 this.setState({ web3: w3 });
//                                 this.connect(w3);
//                                 this.initialiseAddress(w3);
//                                 this.setState({ contractval: new w3.eth.Contract(abi, "0x03759FED743Ee7C5c972ce2109b0c2dE073a0172") });
//                             }
//                         }}>Connect MetaMask</button>
//                     </Modal.Footer>
//                 </Modal>

//                 <Modal show={this.state.metamask_installed}>
//                     <Modal.Header><Modal.Title>MetaMask Required</Modal.Title></Modal.Header>
//                     <Modal.Body><p>Please install MetaMask and reload the page.</p></Modal.Body>
//                 </Modal>

//                 <Modal show={this.state.transaction_sucess_modal}>
//                     <Modal.Header><Modal.Title>🎉 Bid Placed!</Modal.Title></Modal.Header>
//                     <Modal.Body><p>Your bid was successfully submitted to the blockchain.</p></Modal.Body>
//                     <Modal.Footer><button className="mb-wallet-btn" style={S.walletBtn} onClick={() => this.setState({ transaction_sucess_modal: false })}>Close</button></Modal.Footer>
//                 </Modal>

//                 <Modal show={this.state.balance_modal}>
//                     <Modal.Header><Modal.Title>Insufficient Balance</Modal.Title></Modal.Header>
//                     <Modal.Body><p>Your wallet balance is too low for this bid (including gas fees).</p></Modal.Body>
//                     <Modal.Footer><button className="mb-wallet-btn" style={S.walletBtn} onClick={() => this.setState({ balance_modal: false })}>Close</button></Modal.Footer>
//                 </Modal>

//                 <Modal show={this.state.auction_bid_modal}>
//                     <Modal.Header><Modal.Title>Invalid Bid</Modal.Title></Modal.Header>
//                     <Modal.Body><p>Your bid must be higher than the current highest bid of {this.state.product.price} ETH.</p></Modal.Body>
//                     <Modal.Footer><button className="mb-wallet-btn" style={S.walletBtn} onClick={() => this.setState({ auction_bid_modal: false })}>Close</button></Modal.Footer>
//                 </Modal>

//                 {/* Top row */}
//                 <div style={S.topRow}>
//                     <div style={S.crumbText}>
//                         <a href="/explore" style={S.crumbLink}>Explore</a>
//                         <span style={S.crumbSep}>›</span>
//                         <span>{this.state.product.title}</span>
//                     </div>
//                     <button className="mb-wallet-btn" style={S.walletBtn} onClick={() => {
//                         const web3 = this.state.web3;
//                         if (this.state.connectwalletstatus === 'Connect Wallet') { this.connect(web3); this.initialiseAddress(web3); }
//                         else { navigator.clipboard.writeText(this.state.account_addr); this.setState({ connectwalletstatus: 'Copied!' }); setTimeout(() => this.initialiseAddress(web3), 400); }
//                     }}>
//                         <FaEthereum style={{ marginRight:'6px', verticalAlign:'middle' }} />
//                         {this.state.connectwalletstatus}
//                     </button>
//                 </div>

//                 {/* Main grid */}
//                 <div style={S.grid}>
//                     {/* Image */}
//                     <div style={S.imgWrap}>
//                         <img src={this.state.product.link} alt={this.state.product.title} style={S.img} />
//                         <div style={S.badge}>
//                             <div style={isActive ? S.liveDot : S.endedDot} />
//                             {isActive ? 'Live' : 'Ended'}
//                         </div>
//                     </div>

//                     {/* Details */}
//                     <div style={S.detail}>
//                         <h1 style={S.title}>{this.state.product.title}</h1>
//                         <p style={S.desc}>{this.state.product.description}</p>
//                         <div style={S.divider} />

//                         {isActive ? (
//                             <>
//                                 <div style={S.statsRow}>
//                                     <div style={S.statCard}>
//                                         <div style={S.statLabel}>Current Bid</div>
//                                         <div style={S.statValGreen}>
//                                             {this.state.product.price}
//                                             <FaEthereum style={{ color: NAVY, fontSize:'16px' }} />
//                                             <span style={S.statSub}>ETH</span>
//                                         </div>
//                                     </div>
//                                     <div style={S.statCard}>
//                                         <div style={S.statLabel}>Total Bidders</div>
//                                         <div style={S.statVal}>
//                                             {this.state.product.bid_count || 0}
//                                             <span style={S.statSub}>bids</span>
//                                         </div>
//                                     </div>
//                                 </div>

//                                 <div style={S.leaderBox}>
//                                     <div style={S.leaderLabel}>Current Leader</div>
//                                     <div style={S.leaderAddr}>{this.state.product.winner_address || 'No bids yet'}</div>
//                                 </div>

//                                 <div style={S.bidRow}>
//                                     <input
//                                         id="bidinput"
//                                         className="mb-bid-input"
//                                         onChange={e => this.setState({ amount: e.target.value })}
//                                         type='number'
//                                         placeholder={`> ${this.state.product.price} ETH`}
//                                         style={S.bidInput}
//                                     />
//                                     <button className="mb-bid-btn" style={S.bidBtn} onClick={async () => {
//                                         const amount = parseFloat(this.state.amount);
//                                         if (!amount || amount <= parseFloat(this.state.product.price)) { this.setState({ auction_bid_modal: true }); return; }
//                                         if (this.state.account_bal < amount + 0.01) { this.setState({ balance_modal: true }); return; }
//                                         try {
//                                             const web3 = this.state.web3;
//                                             const contract = this.state.contractval;
//                                             const account_addr = this.state.account_addr;
//                                             const auc_id = this.state.product.blockchain_id;
//                                             if (!auc_id && auc_id !== 0) { alert("Blockchain ID not found"); return; }
//                                             const order = (this.state.product.bid_count || 0) + 1;
//                                             const biddedValueWei = web3.utils.toWei(amount.toString(), 'ether');
//                                             await contract.methods.make_bid(auc_id, order, biddedValueWei).estimateGas({ from: account_addr });
//                                             const s = { news: amount, id: this.state.product._id, blockchain_id: auc_id, address: account_addr, bidcount: order };
//                                             contract.methods.make_bid(auc_id, order, biddedValueWei).send({ from: account_addr })
//                                                 .on('transactionHash', () => { this.setState({ starttime: Date.now() }); socket.emit('change', s); })
//                                                 .on('receipt', () => this.setState({ transaction_sucess_modal: true }))
//                                                 .on('error', err => alert("Bid failed: " + (err.message || "rejected")));
//                                         } catch (err) {
//                                             alert("Simulation failed: " + (err.reason || err.message || "Contract rejected"));
//                                         }
//                                     }}>
//                                         Place Bid →
//                                     </button>
//                                 </div>
//                                 <p style={S.latency}>{this.state.latency > 0 ? `⚡ Latency: ${this.state.latency} ms` : 'Place a bid to measure latency'}</p>
//                             </>
//                         ) : (
//                             <div style={S.endedBox}>
//                                 <div style={S.endedRow}><span style={S.endedLabel}>Status</span><span style={{ ...S.endedVal, color:'#dc2626', fontFamily:"'Georgia', serif" }}>Auction Ended</span></div>
//                                 <div style={S.endedRow}><span style={S.endedLabel}>Winner</span><span style={S.endedVal}>{this.state.product.winner_address || 'None'}</span></div>
//                                 <div style={S.endedRow}><span style={S.endedLabel}>Winning Bid</span><span style={{ ...S.endedVal, color:'#16a34a', fontFamily:"'Georgia', serif" }}>{this.state.product.price} ETH</span></div>
//                                 <div style={{ ...S.endedRow, borderBottom:'none' }}><span style={S.endedLabel}>Total Bids</span><span style={S.endedVal}>{this.state.product.bid_count}</span></div>
//                             </div>
//                         )}
//                     </div>
//                 </div>

//                 {this.rendertable()}
//             </>
//         );
//     }

//     renderrow(row) {
//         return (
//             <tr key={row.timestamp} className="mb-tr">
//                 <td style={{ ...S.td, color:'#64748b' }}>{new Date(parseInt(row.timestamp) * 1000).toLocaleString()}</td>
//                 <td style={S.td}>{row.bid_placer}</td>
//                 <td style={S.tdAmt}><FaEthereum style={{ marginRight:'4px', color:NAVY, verticalAlign:'middle' }} />{row.bidded_value} ETH</td>
//             </tr>
//         );
//     }

//     rendertable() {
//         if (this.state.tabletoggle !== 1) return null;
//         return (
//             <div style={S.histSection}>
//                 <div style={S.histTitle}>
//                     Bid History
//                     <span style={S.histChip}>Blockchain</span>
//                 </div>
//                 <table style={S.table}>
//                     <thead>
//                         <tr>
//                             <th style={S.th}>Timestamp</th>
//                             <th style={S.th}>Bidder</th>
//                             <th style={S.th}>Amount</th>
//                         </tr>
//                     </thead>
//                     <tbody>
//                         {this.state.tablearr.length === 0
//                             ? <tr><td colSpan="3" style={S.tdEmpty}>No bids placed yet</td></tr>
//                             : this.state.tablearr.map(row => this.renderrow(row))
//                         }
//                     </tbody>
//                 </table>
//             </div>
//         );
//     }

//     render() {
//         return (
//             <div style={S.page}>
//                 <NavBar />
//                 <div style={S.container}>
//                     {this.rendercomponent()}
//                 </div>
//             </div>
//         );
//     }
// }

// // export default MakeBid;
// import { Component } from "react";
// import { Modal } from 'react-bootstrap';
// import { FaEthereum } from 'react-icons/fa';
// import { abi } from "../Resources/abi";
// import io from 'socket.io-client';
// import NavBar from './NavBar';
// const Web3 = require('web3');

// const endpoint = "http://localhost:4000";
// const socket = io.connect(endpoint);

// /* ── inject one-time keyframes ── */
// const injectCSS = () => {
//   if (document.getElementById('makebid-css')) return;
//   const el = document.createElement('style');
//   el.id = 'makebid-css';
//   el.textContent = `
//     @keyframes makebid-pulse {
//       0%,100%{ opacity:1; transform:scale(1); }
//       50%    { opacity:.45; transform:scale(1.4); }
//     }
//     .mb-live-dot {
//       width: 9px; height: 9px; border-radius: 50%;
//       background: var(--success);
//       animation: makebid-pulse 1.4s ease infinite;
//       display: inline-block;
//     }
//     .mb-ended-dot {
//       width: 9px; height: 9px; border-radius: 50%;
//       background: var(--text-muted);
//       display: inline-block;
//     }
//     .mb-bid-btn:hover {
//       background: var(--accent-hover) !important;
//       transform: translateY(-1px);
//       box-shadow: 0 4px 16px var(--accent-glow);
//     }
//     .mb-bid-btn:active { transform: translateY(0); }
//     .mb-wallet-btn:hover {
//       background: var(--bg-surface-2) !important;
//       border-color: var(--accent) !important;
//       color: var(--accent) !important;
//     }
//     .mb-bid-input:focus {
//       border-color: var(--border-active) !important;
//       box-shadow: 0 0 0 3px var(--accent-soft) !important;
//       outline: none;
//     }
//     .mb-stat-card {
//       background: var(--bg-surface);
//       border: 1px solid var(--border);
//       border-radius: var(--radius-md);
//       padding: 16px 20px;
//       transition: var(--transition);
//     }
//     .mb-stat-card:hover {
//       background: var(--bg-surface-2);
//       border-color: var(--border-active);
//     }
//     .mb-table-row:hover td {
//       background: var(--bg-card-hover) !important;
//       transition: background 0.15s;
//     }
//     .mb-modal-btn {
//       font-family: var(--font-body);
//       font-size: 14px;
//       font-weight: 500;
//       background: var(--accent);
//       color: #fff;
//       border: none;
//       border-radius: var(--radius-sm);
//       padding: 9px 20px;
//       cursor: pointer;
//       transition: var(--transition);
//     }
//     .mb-modal-btn:hover { background: var(--accent-hover); }
//     .mb-modal-btn-ghost {
//       font-family: var(--font-body);
//       font-size: 14px;
//       font-weight: 500;
//       background: transparent;
//       color: var(--text-secondary);
//       border: 1px solid var(--border);
//       border-radius: var(--radius-sm);
//       padding: 9px 20px;
//       cursor: pointer;
//       transition: var(--transition);
//     }
//     .mb-modal-btn-ghost:hover {
//       background: var(--bg-surface);
//       border-color: var(--border-active);
//       color: var(--text-primary);
//     }
//   `;
//   document.head.appendChild(el);
// };

// class MakeBid extends Component {
//     constructor(props) {
//         super(props);
//         this.state = {
//             product: {},
//             amount: 0,
//             starttime: 0,
//             endtime: 0,
//             auction_bid_modal: false,
//             latency: 0,
//             connectwalletstatus: 'Connect Wallet',
//             account_addr: '',
//             account_bal: 0,
//             web3: null,
//             a: 0,
//             contractval: '',
//             tablearr: [],
//             tabletoggle: 0,
//             connect_web3_modal: false,
//             metamask_installed: false,
//             balance_modal: false,
//             transaction_sucess_modal: false,
//         };
//         this.rendercomponent = this.rendercomponent.bind(this);
//         this.rendertable = this.rendertable.bind(this);
//         this.renderrow = this.renderrow.bind(this);
//     }

//     async componentDidMount() {
//         injectCSS();
//         const user = JSON.parse(localStorage.getItem('user'));
//         if (!user) { window.location.href = "http://localhost:3000"; return; }

//         let web3;
//         if (typeof window.web3 !== 'undefined') {
//             web3 = new Web3(window.ethereum);
//             const contract = new web3.eth.Contract(abi, "0x03759FED743Ee7C5c972ce2109b0c2dE073a0172");
//             this.setState({ contractval: contract, web3 });
//             const accounts = await web3.eth.getAccounts();
//             if (accounts.length === 0) this.setState({ connect_web3_modal: true });
//             else this.initialiseAddress(web3);
//         } else {
//             this.setState({ metamask_installed: true });
//         }

//         if (window.ethereum) window.ethereum.on('accountsChanged', () => this.initialiseAddress(web3));

//         const res = await fetch('http://localhost:8000/product', {
//             method: 'POST',
//             headers: { 'Content-Type': 'application/json' },
//             body: JSON.stringify({ id: this.props.productId })
//         }).then(r => r.ok ? r.json() : null);

//         if (res) {
//             this.setState({ product: res, a: 1, tabletoggle: 1 });
//             const auc_id = res.blockchain_id;
//             const contract = this.state.contractval;
//             if (auc_id !== undefined) {
//                 const result = await contract.methods.view_all_transactions(auc_id).call();
//                 let arr = [];
//                 for (let i = result.length - 1; i >= 0; i--) {
//                     arr.push({
//                         order: result[i].order,
//                         bid_placer: result[i].bid_placer,
//                         bidded_value: web3.utils.fromWei(result[i].bidded_value, 'ether'),
//                         timestamp: result[i].timestamp,
//                     });
//                 }
//                 arr.sort((a, b) => parseInt(b.timestamp) - parseInt(a.timestamp));
//                 this.setState({ tablearr: arr });
//             }
//         }

//         socket.on('message', data => {
//             const prod = this.state.product;
//             const match =
//                 String(data["id"]) === String(prod.blockchain_id) ||
//                 String(data["id"]) === String(prod._id);
//             if (match) {
//                 const prod2 = { ...prod, price: data['news'], bid_count: data['bidcount'] };
//                 if (data['address']) prod2.winner_address = data['address'];

//                 // Prepend new bid row so history updates instantly without refresh
//                 const newRow = {
//                     order: data['bidcount'],
//                     bid_placer: data['address'] || '',
//                     bidded_value: String(data['news']),   // already ETH value
//                     timestamp: String(Math.floor(Date.now() / 1000)),
//                 };

//                 const now = Date.now();
//                 this.setState({
//                     product: prod2,
//                     endtime: now,
//                     tablearr: [newRow, ...this.state.tablearr],
//                     latency: now - this.state.starttime,
//                 });
//             }
//         });
//     }

//     initialiseAddress(web3) {
//         web3.eth.getAccounts().then(accounts => {
//             const addr = accounts[0];
//             this.setState({ account_addr: addr });
//             if (!addr) { this.setState({ connectwalletstatus: 'Connect Wallet' }); return; }
//             const cropped = addr.substring(0, 6) + "..." + addr.substring(addr.length - 4);
//             web3.eth.getBalance(addr).then(bal => {
//                 const eth = Math.round(web3.utils.fromWei(bal) * 100) / 100;
//                 this.setState({ account_bal: eth, connectwalletstatus: `${cropped} (${eth} ETH)` });
//             });
//         });
//     }

//     connect(web3) {
//         window.ethereum.request({ method: 'eth_requestAccounts' })
//             .then(() => this.initialiseAddress(web3))
//             .catch(err => { if (err.code === 4001) alert('MetaMask connection cancelled'); else console.error(err); });
//     }

//     handleBid = async () => {
//         const amount = parseFloat(this.state.amount);
//         if (!amount || amount <= parseFloat(this.state.product.price)) { this.setState({ auction_bid_modal: true }); return; }
//         if (this.state.account_bal < amount + 0.01) { this.setState({ balance_modal: true }); return; }
//         try {
//             const { web3, contractval: contract, account_addr, product } = this.state;
//             const auc_id = product.blockchain_id;
//             if (!auc_id && auc_id !== 0) { alert("Blockchain ID not found"); return; }
//             const order = (product.bid_count || 0) + 1;
//             const biddedValueWei = web3.utils.toWei(amount.toString(), 'ether');
//             await contract.methods.make_bid(auc_id, order, biddedValueWei).estimateGas({ from: account_addr });
//             const s = { news: amount, id: product._id, blockchain_id: auc_id, address: account_addr, bidcount: order };
//             contract.methods.make_bid(auc_id, order, biddedValueWei).send({ from: account_addr })
//                 .on('transactionHash', () => { this.setState({ starttime: Date.now() }); socket.emit('change', s); })
//                 .on('receipt', () => this.setState({ transaction_sucess_modal: true }))
//                 .on('error', err => alert("Bid failed: " + (err.message || "rejected")));
//         } catch (err) {
//             alert("Simulation failed: " + (err.reason || err.message || "Contract rejected"));
//         }
//     }

//     rendercomponent() {
//         if (this.state.a === 0) return (
//             <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '300px', flexDirection: 'column', gap: '12px', color: 'var(--text-muted)' }}>
//                 <div style={{ fontSize: '40px', opacity: 0.4 }}>⏳</div>
//                 <p style={{ fontFamily: 'var(--font-body)' }}>Loading auction…</p>
//             </div>
//         );

//         const { product, connectwalletstatus, latency } = this.state;
//         const isActive = parseInt(Date.now()) < product.ending_date;
//         const isConnected = connectwalletstatus !== 'Connect Wallet';

//         return (
//             <>
//                 {/* ── Modals ── */}
//                 <Modal show={this.state.connect_web3_modal}>
//                     <Modal.Header><Modal.Title>Connect Wallet</Modal.Title></Modal.Header>
//                     <Modal.Body>Please connect your MetaMask wallet to place bids.</Modal.Body>
//                     <Modal.Footer>
//                         <button className="mb-modal-btn" onClick={async () => {
//                             if (typeof window.web3 !== 'undefined') {
//                                 const w3 = new Web3(window.ethereum);
//                                 this.setState({ web3: w3, contractval: new w3.eth.Contract(abi, "0x03759FED743Ee7C5c972ce2109b0c2dE073a0172") });
//                                 this.connect(w3); this.initialiseAddress(w3);
//                             }
//                         }}>Connect MetaMask</button>
//                     </Modal.Footer>
//                 </Modal>

//                 <Modal show={this.state.metamask_installed}>
//                     <Modal.Header><Modal.Title>MetaMask Required</Modal.Title></Modal.Header>
//                     <Modal.Body>Please install MetaMask and reload the page.</Modal.Body>
//                 </Modal>

//                 <Modal show={this.state.transaction_sucess_modal}>
//                     <Modal.Header><Modal.Title>🎉 Bid Placed!</Modal.Title></Modal.Header>
//                     <Modal.Body>Your bid was successfully submitted to the blockchain.</Modal.Body>
//                     <Modal.Footer>
//                         <button className="mb-modal-btn-ghost" onClick={() => this.setState({ transaction_sucess_modal: false })}>Close</button>
//                     </Modal.Footer>
//                 </Modal>

//                 <Modal show={this.state.balance_modal}>
//                     <Modal.Header><Modal.Title>Insufficient Balance</Modal.Title></Modal.Header>
//                     <Modal.Body>Your wallet balance is too low for this bid (including gas fees).</Modal.Body>
//                     <Modal.Footer>
//                         <button className="mb-modal-btn-ghost" onClick={() => this.setState({ balance_modal: false })}>Close</button>
//                     </Modal.Footer>
//                 </Modal>

//                 <Modal show={this.state.auction_bid_modal}>
//                     <Modal.Header><Modal.Title>Invalid Bid</Modal.Title></Modal.Header>
//                     <Modal.Body>Your bid must be higher than the current highest bid of <strong>{product.price} ETH</strong>.</Modal.Body>
//                     <Modal.Footer>
//                         <button className="mb-modal-btn-ghost" onClick={() => this.setState({ auction_bid_modal: false })}>Close</button>
//                     </Modal.Footer>
//                 </Modal>

//                 {/* ── Breadcrumb row ── */}
//                 <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '28px 0 24px', borderBottom: '1px solid var(--border)', marginBottom: '36px', flexWrap: 'wrap', gap: '12px' }}>
//                     <div style={{ fontFamily: 'var(--font-body)', fontSize: '13px', color: 'var(--text-muted)', display: 'flex', alignItems: 'center', gap: '6px' }}>
//                         <a href="/explore" style={{ color: 'var(--text-secondary)', textDecoration: 'none', transition: 'color 0.2s' }}
//                             onMouseEnter={e => e.target.style.color = 'var(--accent)'}
//                             onMouseLeave={e => e.target.style.color = 'var(--text-secondary)'}
//                         >Explore</a>
//                         <span style={{ color: 'var(--border-active)' }}>›</span>
//                         <span style={{ color: 'var(--text-primary)', fontWeight: '500' }}>{product.title}</span>
//                     </div>
//                     <button
//                         className="mb-wallet-btn"
//                         style={{
//                             fontFamily: 'var(--font-body)', fontSize: '13px', fontWeight: '500',
//                             background: isConnected ? 'var(--success-soft)' : 'var(--bg-surface)',
//                             border: `1px solid ${isConnected ? 'rgba(45,212,160,0.3)' : 'var(--border)'}`,
//                             color: isConnected ? 'var(--success)' : 'var(--text-secondary)',
//                             borderRadius: 'var(--radius-sm)', padding: '9px 18px',
//                             cursor: 'pointer', whiteSpace: 'nowrap',
//                             maxWidth: '260px', overflow: 'hidden', textOverflow: 'ellipsis',
//                             transition: 'var(--transition)',
//                         }}
//                         onClick={() => {
//                             const web3 = this.state.web3;
//                             if (!isConnected) { this.connect(web3); this.initialiseAddress(web3); }
//                             else {
//                                 navigator.clipboard.writeText(this.state.account_addr);
//                                 this.setState({ connectwalletstatus: 'Copied!' });
//                                 setTimeout(() => this.initialiseAddress(web3), 400);
//                             }
//                         }}
//                     >
//                         <FaEthereum style={{ marginRight: '6px', verticalAlign: 'middle' }} />
//                         {connectwalletstatus}
//                     </button>
//                 </div>

//                 {/* ── Main two-column grid ── */}
//                 <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '52px', alignItems: 'start' }}>

//                     {/* ── Left: Image ── */}
//                     <div style={{ position: 'relative', borderRadius: 'var(--radius-lg)', overflow: 'hidden', boxShadow: 'var(--shadow-md)', aspectRatio: '1/1' }}>
//                         <img
//                             src={product.link}
//                             alt={product.title}
//                             style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }}
//                         />
//                         {/* status badge on image */}
//                         <div style={{
//                             position: 'absolute', top: '14px', left: '14px',
//                             display: 'flex', alignItems: 'center', gap: '7px',
//                             background: isActive ? 'rgba(45,212,160,0.15)' : 'rgba(255,255,255,0.08)',
//                             border: `1px solid ${isActive ? 'rgba(45,212,160,0.3)' : 'var(--border)'}`,
//                             color: isActive ? 'var(--success)' : 'var(--text-muted)',
//                             backdropFilter: 'blur(8px)',
//                             borderRadius: '20px', padding: '5px 12px',
//                             fontSize: '11px', fontWeight: '700',
//                             fontFamily: 'var(--font-display)', letterSpacing: '0.07em', textTransform: 'uppercase',
//                         }}>
//                             <span className={isActive ? 'mb-live-dot' : 'mb-ended-dot'} />
//                             {isActive ? 'Live' : 'Ended'}
//                         </div>
//                     </div>

//                     {/* ── Right: Info panel ── */}
//                     <div style={{ display: 'flex', flexDirection: 'column', gap: '0' }}>

//                         {/* Status label */}
//                         <div style={{ display: 'inline-flex', alignItems: 'center', gap: '7px', fontSize: '12px', fontWeight: '700', textTransform: 'uppercase', letterSpacing: '0.08em', color: 'var(--text-muted)', fontFamily: 'var(--font-display)', marginBottom: '10px' }}>
//                             <span className={isActive ? 'mb-live-dot' : 'mb-ended-dot'} />
//                             {isActive ? 'Live Auction' : 'Auction Ended'}
//                         </div>

//                         {/* Title */}
//                         <h1 style={{ fontFamily: 'var(--font-display)', fontSize: 'clamp(24px,3vw,36px)', fontWeight: '800', color: 'var(--text-primary)', letterSpacing: '-0.03em', lineHeight: '1.15', marginBottom: '10px' }}>
//                             {product.title}
//                         </h1>

//                         {/* Description */}
//                         <p style={{ fontFamily: 'var(--font-body)', fontSize: '14px', color: 'var(--text-secondary)', lineHeight: '1.65', marginBottom: '24px' }}>
//                             {product.description}
//                         </p>

//                         {/* Divider */}
//                         <div style={{ height: '1px', background: 'linear-gradient(90deg, var(--accent), transparent)', marginBottom: '24px' }} />

//                         {isActive ? (
//                             <>
//                                 {/* Current bid */}
//                                 <div style={{ marginBottom: '20px' }}>
//                                     <div style={{ fontSize: '11px', fontWeight: '700', textTransform: 'uppercase', letterSpacing: '0.08em', color: 'var(--text-muted)', fontFamily: 'var(--font-display)', marginBottom: '6px' }}>
//                                         Current Bid
//                                     </div>
//                                     <div style={{ fontFamily: 'var(--font-display)', fontSize: '40px', fontWeight: '800', color: 'var(--text-primary)', letterSpacing: '-0.04em', display: 'flex', alignItems: 'center', gap: '8px', lineHeight: '1' }}>
//                                         {product.price}
//                                         <FaEthereum style={{ color: 'var(--accent)', fontSize: '30px' }} />
//                                         <span style={{ fontSize: '16px', color: 'var(--text-muted)', fontWeight: '500' }}>ETH</span>
//                                     </div>
//                                 </div>

//                                 {/* Stats: bidders + leader */}
//                                 <div style={{ display: 'grid', gridTemplateColumns: '1fr 2fr', gap: '12px', marginBottom: '24px' }}>
//                                     <div className="mb-stat-card">
//                                         <div style={{ fontSize: '11px', fontWeight: '700', textTransform: 'uppercase', letterSpacing: '0.08em', color: 'var(--text-muted)', fontFamily: 'var(--font-display)', marginBottom: '6px' }}>Bidders</div>
//                                         <div style={{ fontFamily: 'var(--font-display)', fontSize: '26px', fontWeight: '800', color: 'var(--text-primary)' }}>
//                                             {product.bid_count || 0}
//                                         </div>
//                                     </div>
//                                     <div className="mb-stat-card">
//                                         <div style={{ fontSize: '11px', fontWeight: '700', textTransform: 'uppercase', letterSpacing: '0.08em', color: 'var(--text-muted)', fontFamily: 'var(--font-display)', marginBottom: '6px' }}>Current Leader</div>
//                                         <div style={{ fontFamily: 'monospace', fontSize: '12px', color: 'var(--text-secondary)', wordBreak: 'break-all', lineHeight: '1.5' }}>
//                                             {product.winner_address || 'No bids yet'}
//                                         </div>
//                                     </div>
//                                 </div>

//                                 {/* Divider */}
//                                 <div style={{ height: '1px', background: 'var(--border)', marginBottom: '20px' }} />

//                                 {/* Bid input row */}
//                                 <div style={{ display: 'flex', gap: '10px', marginBottom: '10px' }}>
//                                     <input
//                                         id="bidinput"
//                                         className="mb-bid-input"
//                                         onChange={e => this.setState({ amount: e.target.value })}
//                                         type='number'
//                                         placeholder={`> ${product.price} ETH`}
//                                         style={{
//                                             flex: '0 0 130px',
//                                             background: 'var(--bg-surface)',
//                                             border: '1px solid var(--border)',
//                                             borderRadius: 'var(--radius-sm)',
//                                             color: 'var(--text-primary)',
//                                             fontFamily: 'var(--font-display)',
//                                             fontSize: '22px', fontWeight: '700',
//                                             padding: '10px 14px',
//                                             textAlign: 'center',
//                                             transition: 'var(--transition)',
//                                         }}
//                                     />
//                                     <button
//                                         className="mb-bid-btn"
//                                         style={{
//                                             flex: '1',
//                                             background: 'var(--accent)',
//                                             color: '#fff',
//                                             border: 'none',
//                                             borderRadius: 'var(--radius-sm)',
//                                             fontFamily: 'var(--font-body)',
//                                             fontSize: '15px', fontWeight: '600',
//                                             cursor: 'pointer',
//                                             display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '7px',
//                                             transition: 'var(--transition)',
//                                         }}
//                                         onClick={this.handleBid}
//                                     >
//                                         <FaEthereum />
//                                         Place Bid
//                                     </button>
//                                 </div>

//                                 {/* Latency */}
//                                 <div style={{ fontSize: '11px', color: 'var(--text-muted)', fontFamily: 'var(--font-body)', display: 'flex', alignItems: 'center', gap: '5px' }}>
//                                     ⚡ {latency > 0 ? `Latency: ${latency} ms` : 'Latency measured on first bid'}
//                                 </div>
//                             </>
//                         ) : (
//                             /* Ended state */
//                             <div style={{ background: 'var(--bg-surface)', border: '1px solid var(--border)', borderRadius: 'var(--radius-md)', overflow: 'hidden' }}>
//                                 {[
//                                     { label: 'Status', value: 'Ended', color: 'var(--danger)' },
//                                     { label: 'Winner', value: product.winner_address || 'None', mono: true },
//                                     { label: 'Winning Bid', value: `${product.price} ETH`, color: 'var(--success)' },
//                                     { label: 'Total Bids', value: product.bid_count },
//                                 ].map(({ label, value, color, mono }, i, arr) => (
//                                     <div key={label} style={{
//                                         display: 'flex', justifyContent: 'space-between', alignItems: 'center',
//                                         padding: '14px 20px',
//                                         borderBottom: i < arr.length - 1 ? '1px solid var(--border)' : 'none',
//                                     }}>
//                                         <span style={{ fontSize: '11px', fontWeight: '700', textTransform: 'uppercase', letterSpacing: '0.07em', color: 'var(--text-muted)', fontFamily: 'var(--font-display)' }}>{label}</span>
//                                         <span style={{
//                                             fontFamily: mono ? 'monospace' : 'var(--font-display)',
//                                             fontSize: mono ? '12px' : '14px',
//                                             fontWeight: '700',
//                                             color: color || 'var(--text-primary)',
//                                             maxWidth: '220px', textAlign: 'right',
//                                             overflow: 'hidden', textOverflow: 'ellipsis', wordBreak: 'break-all',
//                                         }}>{value}</span>
//                                     </div>
//                                 ))}
//                             </div>
//                         )}
//                     </div>
//                 </div>

//                 {/* ── Bid History ── */}
//                 {this.rendertable()}
//             </>
//         );
//     }

//     renderrow(row) {
//         return (
//             <tr key={row.timestamp} className="mb-table-row">
//                 <td style={{ padding: '14px 16px', fontSize: '13px', color: 'var(--text-muted)', background: 'var(--bg-card)', borderTop: '1px solid var(--border)', borderBottom: '1px solid var(--border)', borderLeft: '1px solid var(--border)', borderRadius: 'var(--radius-sm) 0 0 var(--radius-sm)' }}>
//                     {new Date(parseInt(row.timestamp) * 1000).toLocaleString()}
//                 </td>
//                 <td style={{ padding: '14px 16px', fontSize: '12px', color: 'var(--text-secondary)', fontFamily: 'monospace', background: 'var(--bg-card)', borderTop: '1px solid var(--border)', borderBottom: '1px solid var(--border)' }}>
//                     {row.bid_placer}
//                 </td>
//                 <td style={{ padding: '14px 16px', fontSize: '13px', fontFamily: 'var(--font-display)', fontWeight: '600', color: 'var(--accent)', background: 'var(--bg-card)', borderTop: '1px solid var(--border)', borderBottom: '1px solid var(--border)', borderRight: '1px solid var(--border)', borderRadius: '0 var(--radius-sm) var(--radius-sm) 0' }}>
//                     <FaEthereum style={{ marginRight: '5px', verticalAlign: 'middle' }} />
//                     {row.bidded_value} ETH
//                 </td>
//             </tr>
//         );
//     }

//     rendertable() {
//         if (this.state.tabletoggle !== 1) return null;

//         return (
//             <div style={{ marginTop: '52px', paddingBottom: '40px' }}>
//                 {/* Section header */}
//                 <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '8px' }}>
//                     <h2 style={{ fontFamily: 'var(--font-display)', fontSize: '22px', fontWeight: '700', color: 'var(--text-primary)', letterSpacing: '-0.02em' }}>
//                         Bid History
//                     </h2>
//                     <div style={{ display: 'inline-flex', alignItems: 'center', gap: '5px', padding: '4px 12px', background: 'var(--accent-soft)', borderRadius: '20px', fontSize: '12px', fontWeight: '600', color: 'var(--accent)', fontFamily: 'var(--font-display)' }}>
//                         <FaEthereum /> Blockchain
//                     </div>
//                 </div>
//                 {/* Gradient rule */}
//                 <div style={{ height: '1px', background: 'linear-gradient(90deg, var(--accent), transparent)', marginBottom: '20px' }} />

//                 {this.state.tablearr.length === 0 ? (
//                     <div style={{ textAlign: 'center', padding: '48px 20px', color: 'var(--text-muted)' }}>
//                         <div style={{ fontSize: '40px', marginBottom: '12px', opacity: 0.4 }}>📋</div>
//                         <p style={{ fontFamily: 'var(--font-body)', fontSize: '14px' }}>No bids placed yet</p>
//                     </div>
//                 ) : (
//                     <table style={{ width: '100%', borderCollapse: 'separate', borderSpacing: '0 6px' }}>
//                         <thead>
//                             <tr>
//                                 {['Timestamp', 'Bidder', 'Amount'].map(h => (
//                                     <th key={h} style={{ fontFamily: 'var(--font-display)', fontSize: '11px', fontWeight: '600', textTransform: 'uppercase', letterSpacing: '0.08em', color: 'var(--text-muted)', padding: '0 16px 8px', borderBottom: '1px solid var(--border)', textAlign: 'left' }}>
//                                         {h}
//                                     </th>
//                                 ))}
//                             </tr>
//                         </thead>
//                         <tbody>
//                             {this.state.tablearr.map(row => this.renderrow(row))}
//                         </tbody>
//                     </table>
//                 )}
//             </div>
//         );
//     }

//     render() {
//         return (
//             <>
//                 <NavBar />
//                 <div style={{ maxWidth: '1100px', margin: '0 auto', padding: '0 28px 80px' }}>
//                     {this.rendercomponent()}
//                 </div>
//             </>
//         );
//     }
// }

// export default MakeBid;






import { Component } from "react";
import { Modal } from 'react-bootstrap';
import { FaEthereum } from 'react-icons/fa';
import { abi } from "../Resources/abi";
import io from 'socket.io-client';
import NavBar from './NavBar';
const Web3 = require('web3');

const endpoint = "http://localhost:4000";
const socket = io.connect(endpoint);

/* ── inject one-time keyframes ── */
const injectCSS = () => {
  if (document.getElementById('makebid-css')) return;
  const el = document.createElement('style');
  el.id = 'makebid-css';
  el.textContent = `
    @keyframes makebid-pulse {
      0%,100%{ opacity:1; transform:scale(1); }
      50%    { opacity:.45; transform:scale(1.4); }
    }
    .mb-live-dot {
      width: 9px; height: 9px; border-radius: 50%;
      background: var(--success);
      animation: makebid-pulse 1.4s ease infinite;
      display: inline-block;
    }
    .mb-ended-dot {
      width: 9px; height: 9px; border-radius: 50%;
      background: var(--danger);
      display: inline-block;
    }
    .mb-bid-btn:hover {
      background: var(--accent-hover) !important;
      transform: translateY(-1px);
      box-shadow: 0 4px 16px var(--accent-glow);
    }
    .mb-bid-btn:active { transform: translateY(0); }
    .mb-wallet-btn:hover {
      background: var(--bg-surface-2) !important;
      border-color: var(--accent) !important;
      color: var(--accent) !important;
    }
    .mb-bid-input:focus {
      border-color: var(--border-active) !important;
      box-shadow: 0 0 0 3px var(--accent-soft) !important;
      outline: none;
    }
    .mb-stat-card {
      background: var(--bg-surface);
      border: 1px solid var(--border);
      border-radius: var(--radius-md);
      padding: 16px 20px;
      transition: var(--transition);
    }
    .mb-stat-card:hover {
      background: var(--bg-surface-2);
      border-color: var(--border-active);
    }
    .mb-table-row:hover td {
      background: var(--bg-card-hover) !important;
      transition: background 0.15s;
    }
    .mb-modal-btn {
      font-family: var(--font-body);
      font-size: 14px;
      font-weight: 500;
      background: var(--accent);
      color: #fff;
      border: none;
      border-radius: var(--radius-sm);
      padding: 9px 20px;
      cursor: pointer;
      transition: var(--transition);
    }
    .mb-modal-btn:hover { background: var(--accent-hover); }
    .mb-modal-btn-ghost {
      font-family: var(--font-body);
      font-size: 14px;
      font-weight: 500;
      background: transparent;
      color: var(--text-secondary);
      border: 1px solid var(--border);
      border-radius: var(--radius-sm);
      padding: 9px 20px;
      cursor: pointer;
      transition: var(--transition);
    }
    .mb-modal-btn-ghost:hover {
      background: var(--bg-surface);
      border-color: var(--border-active);
      color: var(--text-primary);
    }
  `;
  document.head.appendChild(el);
};

class MakeBid extends Component {
    constructor(props) {
        super(props);
        this.state = {
            product: {},
            amount: 0,
            starttime: 0,
            endtime: 0,
            auction_bid_modal: false,
            latency: 0,
            connectwalletstatus: 'Connect Wallet',
            account_addr: '',
            account_bal: 0,
            web3: null,
            a: 0,
            contractval: '',
            tablearr: [],
            tabletoggle: 0,
            connect_web3_modal: false,
            metamask_installed: false,
            balance_modal: false,
            transaction_sucess_modal: false,
        };
        this.rendercomponent = this.rendercomponent.bind(this);
        this.rendertable = this.rendertable.bind(this);
        this.renderrow = this.renderrow.bind(this);
    }

    async componentDidMount() {
        injectCSS();
        const user = JSON.parse(localStorage.getItem('user'));
        if (!user) { window.location.href = "http://localhost:3000"; return; }

        let web3;
        if (typeof window.web3 !== 'undefined') {
            web3 = new Web3(window.ethereum);
            const contract = new web3.eth.Contract(abi, "0x03759FED743Ee7C5c972ce2109b0c2dE073a0172");
            this.setState({ contractval: contract, web3 });
            const accounts = await web3.eth.getAccounts();
            if (accounts.length === 0) this.setState({ connect_web3_modal: true });
            else this.initialiseAddress(web3);
        } else {
            this.setState({ metamask_installed: true });
        }

        if (window.ethereum) window.ethereum.on('accountsChanged', () => this.initialiseAddress(web3));

        const res = await fetch('http://localhost:8000/product', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ id: this.props.productId })
        }).then(r => r.ok ? r.json() : null);

        if (res) {
            this.setState({ product: res, a: 1, tabletoggle: 1 });
            const auc_id = res.blockchain_id;
            const contract = this.state.contractval;
            if (auc_id !== undefined) {
                const result = await contract.methods.view_all_transactions(auc_id).call();
                let arr = [];
                for (let i = result.length - 1; i >= 0; i--) {
                    arr.push({
                        order: result[i].order,
                        bid_placer: result[i].bid_placer,
                        bidded_value: web3.utils.fromWei(result[i].bidded_value, 'ether'),
                        timestamp: result[i].timestamp,
                    });
                }
                arr.sort((a, b) => parseInt(b.timestamp) - parseInt(a.timestamp));
                this.setState({ tablearr: arr });
            }
        }

        socket.on('message', data => {
            const prod = this.state.product;
            const match =
                String(data["id"]) === String(prod.blockchain_id) ||
                String(data["id"]) === String(prod._id);
            if (match) {
                const prod2 = { ...prod, price: data['news'], bid_count: data['bidcount'] };
                if (data['address']) prod2.winner_address = data['address'];

                // Prepend new bid row so history updates instantly without refresh
                const newRow = {
                    order: data['bidcount'],
                    bid_placer: data['address'] || '',
                    bidded_value: String(data['news']),   // already ETH value
                    timestamp: String(Math.floor(Date.now() / 1000)),
                };

                const now = Date.now();
                this.setState({
                    product: prod2,
                    endtime: now,
                    tablearr: [newRow, ...this.state.tablearr],
                    latency: now - this.state.starttime,
                });
            }
        });
    }

    initialiseAddress(web3) {
        web3.eth.getAccounts().then(accounts => {
            const addr = accounts[0];
            this.setState({ account_addr: addr });
            if (!addr) { this.setState({ connectwalletstatus: 'Connect Wallet' }); return; }
            const cropped = addr.substring(0, 6) + "..." + addr.substring(addr.length - 4);
            web3.eth.getBalance(addr).then(bal => {
                const eth = Math.round(web3.utils.fromWei(bal) * 100) / 100;
                this.setState({ account_bal: eth, connectwalletstatus: `${cropped} (${eth} ETH)` });
            });
        });
    }

    connect(web3) {
        window.ethereum.request({ method: 'eth_requestAccounts' })
            .then(() => this.initialiseAddress(web3))
            .catch(err => { if (err.code === 4001) alert('MetaMask connection cancelled'); else console.error(err); });
    }

    handleBid = async () => {
        const amount = parseFloat(this.state.amount);
        if (!amount || amount <= parseFloat(this.state.product.price)) { this.setState({ auction_bid_modal: true }); return; }
        if (this.state.account_bal < amount + 0.01) { this.setState({ balance_modal: true }); return; }
        try {
            const { web3, contractval: contract, account_addr, product } = this.state;
            const auc_id = product.blockchain_id;
            if (!auc_id && auc_id !== 0) { alert("Blockchain ID not found"); return; }
            const order = (product.bid_count || 0) + 1;
            const biddedValueWei = web3.utils.toWei(amount.toString(), 'ether');
            await contract.methods.make_bid(auc_id, order, biddedValueWei).estimateGas({ from: account_addr });
            const s = { news: amount, id: product._id, blockchain_id: auc_id, address: account_addr, bidcount: order };
            contract.methods.make_bid(auc_id, order, biddedValueWei).send({ from: account_addr })
                .on('transactionHash', () => { this.setState({ starttime: Date.now() }); socket.emit('change', s); })
                .on('receipt', () => this.setState({ transaction_sucess_modal: true }))
                .on('error', err => alert("Bid failed: " + (err.message || "rejected")));
        } catch (err) {
            alert("Simulation failed: " + (err.reason || err.message || "Contract rejected"));
        }
    }

    rendercomponent() {
        if (this.state.a === 0) return (
            <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '300px', flexDirection: 'column', gap: '12px', color: 'var(--text-muted)' }}>
                <div style={{ fontSize: '40px', opacity: 0.4 }}>⏳</div>
                <p style={{ fontFamily: 'var(--font-body)' }}>Loading auction…</p>
            </div>
        );

        const { product, connectwalletstatus, latency } = this.state;
        const isActive = parseInt(Date.now()) < product.ending_date;
        const isConnected = connectwalletstatus !== 'Connect Wallet';

        return (
            <>
                {/* ── Modals ── */}
                <Modal show={this.state.connect_web3_modal}>
                    <Modal.Header><Modal.Title>Connect Wallet</Modal.Title></Modal.Header>
                    <Modal.Body>Please connect your MetaMask wallet to place bids.</Modal.Body>
                    <Modal.Footer>
                        <button className="mb-modal-btn" onClick={async () => {
                            if (typeof window.web3 !== 'undefined') {
                                const w3 = new Web3(window.ethereum);
                                this.setState({ web3: w3, contractval: new w3.eth.Contract(abi, "0x03759FED743Ee7C5c972ce2109b0c2dE073a0172") });
                                this.connect(w3); this.initialiseAddress(w3);
                            }
                        }}>Connect MetaMask</button>
                    </Modal.Footer>
                </Modal>

                <Modal show={this.state.metamask_installed}>
                    <Modal.Header><Modal.Title>MetaMask Required</Modal.Title></Modal.Header>
                    <Modal.Body>Please install MetaMask and reload the page.</Modal.Body>
                </Modal>

                <Modal show={this.state.transaction_sucess_modal}>
                    <Modal.Header><Modal.Title>🎉 Bid Placed!</Modal.Title></Modal.Header>
                    <Modal.Body>Your bid was successfully submitted to the blockchain.</Modal.Body>
                    <Modal.Footer>
                        <button className="mb-modal-btn-ghost" onClick={() => this.setState({ transaction_sucess_modal: false })}>Close</button>
                    </Modal.Footer>
                </Modal>

                <Modal show={this.state.balance_modal}>
                    <Modal.Header><Modal.Title>Insufficient Balance</Modal.Title></Modal.Header>
                    <Modal.Body>Your wallet balance is too low for this bid (including gas fees).</Modal.Body>
                    <Modal.Footer>
                        <button className="mb-modal-btn-ghost" onClick={() => this.setState({ balance_modal: false })}>Close</button>
                    </Modal.Footer>
                </Modal>

                <Modal show={this.state.auction_bid_modal}>
                    <Modal.Header><Modal.Title>Invalid Bid</Modal.Title></Modal.Header>
                    <Modal.Body>Your bid must be higher than the current highest bid of <strong>{product.price} ETH</strong>.</Modal.Body>
                    <Modal.Footer>
                        <button className="mb-modal-btn-ghost" onClick={() => this.setState({ auction_bid_modal: false })}>Close</button>
                    </Modal.Footer>
                </Modal>

                {/* ── Breadcrumb row ── */}
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '28px 0 24px', borderBottom: '1px solid var(--border)', marginBottom: '36px', flexWrap: 'wrap', gap: '12px' }}>
                    <div style={{ fontFamily: 'var(--font-body)', fontSize: '13px', color: 'var(--text-muted)', display: 'flex', alignItems: 'center', gap: '6px' }}>
                        <a href="/explore" style={{ color: 'var(--text-secondary)', textDecoration: 'none', transition: 'color 0.2s' }}
                            onMouseEnter={e => e.target.style.color = 'var(--accent)'}
                            onMouseLeave={e => e.target.style.color = 'var(--text-secondary)'}
                        >Explore</a>
                        <span style={{ color: 'var(--border-active)' }}>›</span>
                        <span style={{ color: 'var(--text-primary)', fontWeight: '500' }}>{product.title}</span>
                    </div>
                    <button
                        className="mb-wallet-btn"
                        style={{
                            fontFamily: 'var(--font-body)', fontSize: '13px', fontWeight: '500',
                            background: isConnected ? 'var(--success-soft)' : 'var(--bg-surface)',
                            border: `1px solid ${isConnected ? 'rgba(45,212,160,0.3)' : 'var(--border)'}`,
                            color: isConnected ? 'var(--success)' : 'var(--text-secondary)',
                            borderRadius: 'var(--radius-sm)', padding: '9px 18px',
                            cursor: 'pointer', whiteSpace: 'nowrap',
                            maxWidth: '260px', overflow: 'hidden', textOverflow: 'ellipsis',
                            transition: 'var(--transition)',
                        }}
                        onClick={() => {
                            const web3 = this.state.web3;
                            if (!isConnected) { this.connect(web3); this.initialiseAddress(web3); }
                            else {
                                navigator.clipboard.writeText(this.state.account_addr);
                                this.setState({ connectwalletstatus: 'Copied!' });
                                setTimeout(() => this.initialiseAddress(web3), 400);
                            }
                        }}
                    >
                        <FaEthereum style={{ marginRight: '6px', verticalAlign: 'middle' }} />
                        {connectwalletstatus}
                    </button>
                </div>

                {/* ── Main two-column grid ── */}
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '52px', alignItems: 'start' }}>

                    {/* ── Left: Image ── */}
                    <div style={{ position: 'relative', borderRadius: 'var(--radius-lg)', overflow: 'hidden', boxShadow: 'var(--shadow-md)', aspectRatio: '1/1' }}>
                        <img
                            src={product.link}
                            alt={product.title}
                            style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }}
                        />
                        {/* status badge on image */}
                        <div style={{
                            position: 'absolute', top: '14px', left: '14px',
                            display: 'flex', alignItems: 'center', gap: '7px',
                            background: isActive ? 'rgba(45,212,160,0.15)' : 'rgba(255,255,255,0.08)',
                            border: `1px solid ${isActive ? 'rgba(45,212,160,0.3)' : 'var(--border)'}`,
                            color: isActive ? 'var(--success)' : 'var(--danger)',
                            backdropFilter: 'blur(8px)',
                            borderRadius: '20px', padding: '5px 12px',
                            fontSize: '11px', fontWeight: '700',
                            fontFamily: 'var(--font-display)', letterSpacing: '0.07em', textTransform: 'uppercase',
                        }}>
                            <span className={isActive ? 'mb-live-dot' : 'mb-ended-dot'} />
                            {isActive ? 'Live' : 'Ended'}
                        </div>
                    </div>

                    {/* ── Right: Info panel ── */}
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '0' }}>

                        {/* Status label */}
                        <div style={{ display: 'inline-flex', alignItems: 'center', gap: '7px', fontSize: '12px', fontWeight: '700', textTransform: 'uppercase', letterSpacing: '0.08em', color: isActive ? 'var(--success)' : 'var(--danger)', fontFamily: 'var(--font-display)', marginBottom: '10px' }}>
                            <span className={isActive ? 'mb-live-dot' : 'mb-ended-dot'} />
                            {isActive ? 'Live Auction' : 'Auction Ended'}
                        </div>

                        {/* Title */}
                        <h1 style={{ fontFamily: 'var(--font-display)', fontSize: 'clamp(24px,3vw,36px)', fontWeight: '800', color: 'var(--text-primary)', letterSpacing: '-0.03em', lineHeight: '1.15', marginBottom: '10px' }}>
                            {product.title}
                        </h1>

                        {/* Description */}
                        <p style={{ fontFamily: 'var(--font-body)', fontSize: '14px', color: 'var(--text-secondary)', lineHeight: '1.65', marginBottom: '24px' }}>
                            {product.description}
                        </p>

                        {/* Divider */}
                        <div style={{ height: '1px', background: 'linear-gradient(90deg, var(--accent), transparent)', marginBottom: '24px' }} />

                        {isActive ? (
                            <>
                                {/* Current bid */}
                                <div style={{ marginBottom: '20px' }}>
                                    <div style={{ fontSize: '11px', fontWeight: '700', textTransform: 'uppercase', letterSpacing: '0.08em', color: 'var(--text-muted)', fontFamily: 'var(--font-display)', marginBottom: '6px' }}>
                                        Current Bid
                                    </div>
                                    <div style={{ fontFamily: 'var(--font-display)', fontSize: '40px', fontWeight: '800', color: 'var(--text-primary)', letterSpacing: '-0.04em', display: 'flex', alignItems: 'center', gap: '8px', lineHeight: '1' }}>
                                        {product.price}
                                        <FaEthereum style={{ color: 'var(--accent)', fontSize: '30px' }} />
                                        <span style={{ fontSize: '16px', color: 'var(--text-muted)', fontWeight: '500' }}>ETH</span>
                                    </div>
                                </div>

                                {/* Stats: bidders + leader */}
                                <div style={{ display: 'grid', gridTemplateColumns: '1fr 2fr', gap: '12px', marginBottom: '24px' }}>
                                    <div className="mb-stat-card">
                                        <div style={{ fontSize: '11px', fontWeight: '700', textTransform: 'uppercase', letterSpacing: '0.08em', color: 'var(--text-muted)', fontFamily: 'var(--font-display)', marginBottom: '6px' }}>Bidders</div>
                                        <div style={{ fontFamily: 'var(--font-display)', fontSize: '26px', fontWeight: '800', color: 'var(--text-primary)' }}>
                                            {product.bid_count || 0}
                                        </div>
                                    </div>
                                    <div className="mb-stat-card">
                                        <div style={{ fontSize: '11px', fontWeight: '700', textTransform: 'uppercase', letterSpacing: '0.08em', color: 'var(--text-muted)', fontFamily: 'var(--font-display)', marginBottom: '6px' }}>Current Leader</div>
                                        <div style={{ fontFamily: 'monospace', fontSize: '12px', color: 'var(--text-secondary)', wordBreak: 'break-all', lineHeight: '1.5' }}>
                                            {product.winner_address || 'No bids yet'}
                                        </div>
                                    </div>
                                </div>

                                {/* Divider */}
                                <div style={{ height: '1px', background: 'var(--border)', marginBottom: '20px' }} />

                                {/* Bid input row — flat, no card wrapper */}
                                <div style={{ display: 'flex', gap: '10px', marginBottom: '10px' }}>
                                    <input
                                        id="bidinput"
                                        className="mb-bid-input"
                                        onChange={e => this.setState({ amount: e.target.value })}
                                        type='number'
                                        placeholder={`> ${product.price} ETH`}
                                        style={{
                                            flex: '0 0 130px',
                                            background: 'var(--bg-surface)',
                                            border: '1px solid var(--border)',
                                            borderRadius: 'var(--radius-sm)',
                                            color: 'var(--text-primary)',
                                            fontFamily: 'var(--font-display)',
                                            fontSize: '22px', fontWeight: '700',
                                            padding: '10px 14px',
                                            textAlign: 'center',
                                            transition: 'var(--transition)',
                                        }}
                                    />
                                    <button
                                        className="mb-bid-btn"
                                        style={{
                                            flex: '1',
                                            background: 'var(--accent)',
                                            color: '#fff',
                                            border: 'none',
                                            borderRadius: 'var(--radius-sm)',
                                            fontFamily: 'var(--font-body)',
                                            fontSize: '15px', fontWeight: '600',
                                            cursor: 'pointer',
                                            display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '7px',
                                            transition: 'var(--transition)',
                                        }}
                                        onClick={this.handleBid}
                                    >
                                        <FaEthereum />
                                        Place Bid
                                    </button>
                                </div>

                                {/* Latency */}
                                <div style={{ fontSize: '11px', color: 'var(--text-muted)', fontFamily: 'var(--font-body)', display: 'flex', alignItems: 'center', gap: '5px' }}>
                                    ⚡ {latency > 0 ? `Latency: ${latency} ms` : 'Latency measured on first bid'}
                                </div>
                            </>
                        ) : (
                            /* Ended state */
                            <div style={{ background: 'var(--bg-surface)', border: '1px solid var(--border)', borderRadius: 'var(--radius-md)', overflow: 'hidden' }}>
                                {[
                                    { label: 'Status', value: 'Ended', color: 'var(--danger)' },
                                    { label: 'Winner', value: product.winner_address || 'None', mono: true },
                                    { label: 'Winning Bid', value: `${product.price} ETH`, color: 'var(--success)' },
                                    { label: 'Total Bids', value: product.bid_count },
                                ].map(({ label, value, color, mono }, i, arr) => (
                                    <div key={label} style={{
                                        display: 'flex', justifyContent: 'space-between', alignItems: 'center',
                                        padding: '14px 20px',
                                        borderBottom: i < arr.length - 1 ? '1px solid var(--border)' : 'none',
                                    }}>
                                        <span style={{ fontSize: '11px', fontWeight: '700', textTransform: 'uppercase', letterSpacing: '0.07em', color: 'var(--text-muted)', fontFamily: 'var(--font-display)' }}>{label}</span>
                                        <span style={{
                                            fontFamily: mono ? 'monospace' : 'var(--font-display)',
                                            fontSize: mono ? '12px' : '14px',
                                            fontWeight: '700',
                                            color: color || 'var(--text-primary)',
                                            maxWidth: '220px', textAlign: 'right',
                                            overflow: 'hidden', textOverflow: 'ellipsis', wordBreak: 'break-all',
                                        }}>{value}</span>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                </div>

                {/* ── Bid History ── */}
                {this.rendertable()}
            </>
        );
    }

    renderrow(row) {
        return (
            <tr key={row.timestamp} className="mb-table-row">
                <td style={{ padding: '14px 16px', fontSize: '13px', color: 'var(--text-muted)', background: 'var(--bg-card)', borderTop: '1px solid var(--border)', borderBottom: '1px solid var(--border)', borderLeft: '1px solid var(--border)', borderRadius: 'var(--radius-sm) 0 0 var(--radius-sm)' }}>
                    {new Date(parseInt(row.timestamp) * 1000).toLocaleString()}
                </td>
                <td style={{ padding: '14px 16px', fontSize: '12px', color: 'var(--text-secondary)', fontFamily: 'monospace', background: 'var(--bg-card)', borderTop: '1px solid var(--border)', borderBottom: '1px solid var(--border)' }}>
                    {row.bid_placer}
                </td>
                <td style={{ padding: '14px 16px', fontSize: '13px', fontFamily: 'var(--font-display)', fontWeight: '600', color: 'var(--accent)', background: 'var(--bg-card)', borderTop: '1px solid var(--border)', borderBottom: '1px solid var(--border)', borderRight: '1px solid var(--border)', borderRadius: '0 var(--radius-sm) var(--radius-sm) 0' }}>
                    <FaEthereum style={{ marginRight: '5px', verticalAlign: 'middle' }} />
                    {row.bidded_value} ETH
                </td>
            </tr>
        );
    }

    rendertable() {
        if (this.state.tabletoggle !== 1) return null;

        return (
            <div style={{ marginTop: '52px', paddingBottom: '40px' }}>
                {/* Section header */}
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '8px' }}>
                    <h2 style={{ fontFamily: 'var(--font-display)', fontSize: '22px', fontWeight: '700', color: 'var(--text-primary)', letterSpacing: '-0.02em' }}>
                        Bid History
                    </h2>
                    <div style={{ display: 'inline-flex', alignItems: 'center', gap: '5px', padding: '4px 12px', background: 'var(--accent-soft)', borderRadius: '20px', fontSize: '12px', fontWeight: '600', color: 'var(--accent)', fontFamily: 'var(--font-display)' }}>
                        <FaEthereum /> Blockchain
                    </div>
                </div>
                {/* Gradient rule */}
                <div style={{ height: '1px', background: 'linear-gradient(90deg, var(--accent), transparent)', marginBottom: '20px' }} />

                {this.state.tablearr.length === 0 ? (
                    <div style={{ textAlign: 'center', padding: '48px 20px', color: 'var(--text-muted)' }}>
                        <div style={{ fontSize: '40px', marginBottom: '12px', opacity: 0.4 }}>📋</div>
                        <p style={{ fontFamily: 'var(--font-body)', fontSize: '14px' }}>No bids placed yet</p>
                    </div>
                ) : (
                    <table style={{ width: '100%', borderCollapse: 'separate', borderSpacing: '0 6px' }}>
                        <thead>
                            <tr>
                                {['Timestamp', 'Bidder', 'Amount'].map(h => (
                                    <th key={h} style={{ fontFamily: 'var(--font-display)', fontSize: '11px', fontWeight: '600', textTransform: 'uppercase', letterSpacing: '0.08em', color: 'var(--text-muted)', padding: '0 16px 8px', borderBottom: '1px solid var(--border)', textAlign: 'left' }}>
                                        {h}
                                    </th>
                                ))}
                            </tr>
                        </thead>
                        <tbody>
                            {this.state.tablearr.map(row => this.renderrow(row))}
                        </tbody>
                    </table>
                )}
            </div>
        );
    }

    render() {
        return (
            <>
                <NavBar />
                <div style={{ maxWidth: '1100px', margin: '0 auto', padding: '0 28px 80px' }}>
                    {this.rendercomponent()}
                </div>
            </>
        );
    }
}

export default MakeBid;