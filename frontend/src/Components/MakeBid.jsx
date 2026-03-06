import { Component } from "react";
import { Row, Col, Image, Button, Container, Breadcrumb, BreadcrumbItem, Modal, Table } from 'react-bootstrap';
import { FaEthereum } from 'react-icons/fa';
import { abi } from "../Resources/abi";
import io from 'socket.io-client';
import NavBar from './NavBar';
const Web3 = require('web3');

const endpoint = "http://localhost:4000";
const socket = io.connect(endpoint);

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
            setshow: false,
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
        const user = JSON.parse(localStorage.getItem('user'));
        if (!user) {
            window.location.href = "http://localhost:3000";
            return;
        }

        let web3;
        if (typeof window.web3 !== 'undefined') {
            web3 = new Web3(window.ethereum);
            const address = "0x03759FED743Ee7C5c972ce2109b0c2dE073a0172";
            const contract = new web3.eth.Contract(abi, address);
            this.setState({ contractval: contract, web3 });

            const accounts = await web3.eth.getAccounts();
            if (accounts.length === 0) {
                this.setState({ connect_web3_modal: true });
            } else {
                this.initialiseAddress(web3);
            }
        } else {
            this.setState({ metamask_installed: true });
        }

        if (window.ethereum) {
            window.ethereum.on('accountsChanged', () => {
                this.initialiseAddress(web3);
            });
        }

        const key = { id: this.props.productId };
        const res = await fetch('http://localhost:8000/product', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(key)
        }).then(r => r.ok ? r.json() : null);

        if (res) {
            this.setState({ product: res, a: 1, tabletoggle: 1 });
            console.log("res :",res);
            

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
            } else {
                console.warn("Aucun blockchain_id trouvé pour cette enchère");
            }
        }

        socket.on('message', data => {
            console.log("Message socket reçu", data);
            const prod_id = this.state.product.blockchain_id;
            if (data["id"] === prod_id) {
                const prod2 = { ...this.state.product };
                prod2.price = data['news'];
                prod2.bid_count = data['bidcount'];
                this.setState({ product: prod2, endtime: Date.now() });
                const latencyval = this.state.endtime - this.state.starttime;
                this.setState({ latency: latencyval });
            }
        });
    }

    initialiseAddress(web3) {
        web3.eth.getAccounts().then(accounts => {
            const account_addr = accounts[0];
            this.setState({ account_addr });

            if (!account_addr) {
                this.setState({ connectwalletstatus: 'Connect Wallet' });
                return;
            }

            const cropped = account_addr.substring(0, 6) + "..." + account_addr.substring(account_addr.length - 4);
            web3.eth.getBalance(account_addr).then(balance => {
                const bal = Math.round(web3.utils.fromWei(balance) * 100) / 100;
                this.setState({
                    account_bal: bal,
                    connectwalletstatus: `${cropped} (${bal} ETH)`
                });
            });
        });
    }

    connect(web3) {
        window.ethereum.request({ method: 'eth_requestAccounts' })
            .then(() => this.initialiseAddress(web3))
            .catch(err => {
                if (err.code === 4001) alert('Connexion MetaMask annulée');
                else console.error(err);
            });
    }

    rendercomponent() {
        if (this.state.a === 0) return <div></div>;

        const isActive = parseInt(Date.now()) < this.state.product.ending_date;

        return (
            <>
                <Modal show={this.state.connect_web3_modal}> {/* ... */} </Modal>
                <Modal show={this.state.metamask_installed}> {/* ... */} </Modal>
                <Modal show={this.state.transaction_sucess_modal}> {/* ... */} </Modal>
                <Modal show={this.state.balance_modal}> {/* ... */} </Modal>
                <Modal show={this.state.auction_bid_modal}> {/* ... */} </Modal>

                <Container>
                    <Row style={{ marginTop: '20px' }}>
                        <Col md={9}>
                            <Breadcrumb>
                                <BreadcrumbItem href="/explore">Explore</BreadcrumbItem>
                                <BreadcrumbItem active>{this.state.product.title}</BreadcrumbItem>
                            </Breadcrumb>
                        </Col>
                        <Col md={3}>
                            <Button
                                style={{ width: '90%', height: '45px', backgroundColor: '#FFA0A0', fontWeight: 'bolder', border: 'none', color: '#21325E' }}
                                onClick={() => {
                                    const web3 = this.state.web3;
                                    if (this.state.connectwalletstatus === 'Connect Wallet') {
                                        this.connect(web3);
                                    } else {
                                        navigator.clipboard.writeText(this.state.account_addr);
                                        this.setState({ connectwalletstatus: 'Copied' });
                                        setTimeout(() => this.initialiseAddress(web3), 400);
                                    }
                                }}
                            >
                                {this.state.connectwalletstatus}
                            </Button>
                        </Col>
                    </Row>

                    <Row style={{ marginTop: '30px' }}>
                        <Col md={5}>
                            <Image src={this.state.product.link} height='350px' width='350px' style={{ margin: '50px', objectFit: 'cover' }} />
                        </Col>

                        <Col md={7} style={{ padding: '50px' }}>
                            <Row>
                                <Col md={1}>
                                    <svg viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
                                        <circle cx="50" cy="50" r="30" className={isActive ? "live-icon" : "live-icon-finished"} />
                                    </svg>
                                </Col>
                                <Col md={11} style={{ paddingLeft: '0px' }}>
                                    <h1 style={{ fontWeight: 'bolder' }}>{this.state.product.title}</h1>
                                </Col>
                            </Row>

                            <h5>{this.state.product.description}</h5>
                            <hr />

                            {isActive ? (
                                <>
                                    <h3>Current Bid : <strong style={{ color: 'green' }}>{this.state.product.price}</strong> <FaEthereum /></h3>
                                    <h5>Nombre d'enchérisseurs : <strong>{this.state.product.bid_count}</strong></h5>
                                    <h5>Gagnant actuel : <span style={{ fontWeight: 'light', fontSize: '17px' }}>{this.state.product.winner_address || "Aucun"}</span></h5>
                                    <hr />

                                    <Row>
                                        <Col md={3}>
                                            <input
                                                id="bidinput"
                                                onChange={e => this.setState({ amount: e.target.value })}
                                                type='number'
                                                style={{ height: '45px', width: '100%', fontSize: '30px' }}
                                            />
                                        </Col>
                                        <Col md={5}>
                                            <Button
                                                className="btn-lg"
                                                style={{ width: '90%', backgroundColor: '#FFA0A0', fontWeight: 'bolder', border: 'none', color: '#21325E' }}
                                                onClick={async () => {
                                                    const amount = parseFloat(this.state.amount);
                                                    if (!amount || amount <= parseFloat(this.state.product.price)) {
                                                        this.setState({ auction_bid_modal: true });
                                                        return;
                                                    }

                                                    if (this.state.account_bal < amount + 0.01) {
                                                        this.setState({ balance_modal: true });
                                                        return;
                                                    }

                                                    try {
                                                        const web3 = this.state.web3;
                                                        const contract = this.state.contractval;
                                                        const account_addr = this.state.account_addr;
                                                        const auc_id = this.state.product.blockchain_id; // ← CHANGEMENT CLÉ

                                                        if (!auc_id) {
                                                            alert("Erreur : ID blockchain non trouvé pour cette enchère");
                                                            return;
                                                        }

                                                        const order = (this.state.product.bid_count || 0) + 1;
                                                        const biddedValueWei = web3.utils.toWei(amount.toString(), 'ether');

                                                        console.log("Params make_bid :", { auction_id: auc_id, order, valueWei: biddedValueWei, from: account_addr });

                                                        await contract.methods.make_bid(auc_id, order, biddedValueWei).estimateGas({ from: account_addr });

                                                        const s = {
                                                            news: amount,
                                                            id: auc_id,               // ← blockchain_id
                                                            address: account_addr,
                                                            bidcount: order,
                                                        };

                                                        contract.methods.make_bid(auc_id, order, biddedValueWei)
                                                            .send({ from: account_addr })
                                                            .on('transactionHash', hash => {
                                                                this.setState({ starttime: Date.now() });
                                                                socket.emit('change', s);
                                                                console.log("Tx hash:", hash);
                                                            })
                                                            .on('receipt', () => {
                                                                this.setState({ transaction_sucess_modal: true });
                                                                // Rafraîchir l'historique ici si besoin
                                                            })
                                                            .on('error', error => {
                                                                console.error("Erreur tx:", error);
                                                                alert("Échec enchère : " + (error.message || "Transaction rejetée"));
                                                            });
                                                    } catch (err) {
                                                        console.error("Erreur préparation:", err);
                                                        alert("Échec simulation : " + (err.reason || err.message || "Rejet contrat"));
                                                    }
                                                }}
                                            >
                                                Make a Bid
                                            </Button>
                                        </Col>
                                    </Row>
                                    <p>Measured latency: {this.state.latency} ms</p>
                                </>
                            ) : (
                                <>
                                    <hr />
                                    <p className="ml-5" style={{ fontSize: 'larger' }}><strong>Auction Status:</strong> Terminée</p>
                                    <p className="ml-5" style={{ fontSize: 'larger' }}><strong>Gagnant:</strong> {this.state.product.winner_address || "Aucun"}</p>
                                    <p className="ml-5" style={{ fontSize: 'larger' }}><strong>Montant gagnant:</strong> {this.state.product.price} <FaEthereum /></p>
                                    <p className="ml-5" style={{ fontSize: 'larger' }}><strong>Nombre d'enchères:</strong> {this.state.product.bid_count}</p>
                                </>
                            )}
                        </Col>
                    </Row>

                    <Row>
                        <Col md={9}>
                            <h1 className="mt-5">Historique des enchères (Blockchain)</h1>
                        </Col>
                    </Row>
                    {this.rendertable()}
                </Container>
            </>
        );
    }

    renderrow(arr) {
        return (
            <tr key={arr.timestamp}>
                <td>{new Date(parseInt(arr.timestamp) * 1000).toLocaleString()}</td>
                <td>{arr.bid_placer}</td>
                <td>{arr.bidded_value} ETH</td>
            </tr>
        );
    }

    rendertable() {
        if (this.state.tabletoggle !== 1) return <div></div>;

        return (
            <Table striped bordered hover>
                <thead>
                    <tr>
                        <th>Timestamp</th>
                        <th>Enchérisseur</th>
                        <th>Montant</th>
                    </tr>
                </thead>
                <tbody>
                    {this.state.tablearr.map(arr => this.renderrow(arr))}
                </tbody>
            </Table>
        );
    }

    render() {
        return (
            <>
                <NavBar />
                {this.rendercomponent()}
            </>
        );
    }
}

export default MakeBid;