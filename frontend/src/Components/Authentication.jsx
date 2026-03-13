// import {Component} from 'react';
// import { Button, Image, Row, Col, Container, Form, Modal} from 'react-bootstrap';
// import globe from '../Resources/globe.png';
// import key from '../Resources/key.png';
// import clock from '../Resources/clock.png';
// import NavBar from './NavBar_Auth';
// class Authentication extends Component{
//     constructor(props){
//         super(props);
//         this.state = {
//             currentState: 'Login',
//             lusermail: '',
//             lpassword: '',
//             susermail: '',
//             spassword: '',
//             sconfirmpassword: '',
//             failed_login: false,
//             signup_success: false,
//             no_user_exists: false,
//             password_mismatch: false,
//         }
//         this.chooseLogin = this.chooseLogin.bind(this);
//         this.handleLogin=this.handleLogin.bind(this);
//         this.handleSignup=this.handleSignup.bind(this);
//     }
//     componentDidMount = () => {
//         setTimeout(() => {
//             document.querySelector('.animate-image1').classList.add('change-image')
//         }, 1000);
//         setTimeout(() => {
//             document.querySelector('.animate-image2').classList.add('change-image2')
//         }, 1000);
        
        
//     }
//     handleSignup(){
//         if(this.state.lpassword !== this.state.sconfirmpassword){
//             this.setState({password_mismatch:true});
//             return;
//         }
//         var newUser = {
//             username: this.state.lusermail.split("@")[0],
//             password: this.state.lpassword
//         }
//         console.log(newUser);
//         fetch('http://localhost:8000/signup',{
//             method: 'POST',
//             headers: {
//                 'Content-Type' : 'application/json'
//             },
//             body: JSON.stringify(newUser),

//         }).then((response) => {
//             if(response.ok) return response.json();
//         }).then(async(res) => {
//             if(res.success == 1){
//                 this.setState({signup_success:true});
//                 window.location.href = 'http://localhost:3000/explore';
//             }
//             else{
//                 this.setState({user_already_exists:true});
//             }
//         })
//     }
//     handleLogin()
//     {
//         console.log(this.state.lusermail);
//         console.log(this.state.lpassword);
//         var key={name:this.state.lusermail.split("@")[0],password:this.state.lpassword};
     
//         fetch('http://localhost:8000/login',{
//         method: 'POST',
//         headers: {
//             'Content-Type' : 'application/json'
//         },
//         body:JSON.stringify(key)
//         }).then((res)=>{
//             return res.json();
//         }).then(async(res)=>{
//             console.log("Login status")
//             console.log(res.success)
//             if(res.success==1)
//             {
//                 await this.props.func(this.state.lusermail.split("@")[0]);
//                 localStorage.setItem('user',JSON.stringify({token: "logged_in", status: 1}));
//                 window.location.href = 'http://localhost:3000/explore';
//             }
//             else if(res.success==-1){
//                 this.setState({no_user_exists:true});
//             }
//             else{
//                 this.setState({failed_login:true})
//             }

//         })
//     }
//     chooseLogin = () => {
//         if(this.state.currentState === "Login"){
//             return(
//                 <>
//                     <Form>
//                         <Form.Group>
//                             <Form.Label style={{fontSize:"20px"}}>Email address</Form.Label>
//                             <Form.Control style={{height:"45px"}} type="email" placeholder="Enter email" 
//                                 onChange={async(event) => {
//                                     await this.setState({lusermail: event.target.value});
//                                 }}
//                             />
//                         </Form.Group>

//                         <Form.Group>
//                             <Form.Label style={{fontSize:"20px", marginTop:"30px"}}>Password</Form.Label>
//                             <Form.Control style={{height:"45px"}}  type="password" placeholder="Password" 
//                                 onChange={async(event) => {
//                                     await this.setState({lpassword: event.target.value});
//                                 }}
//                             />
//                         </Form.Group>
                        
                        
//                         <Button variant="dark" style={{margin:"30px 20px 30px 0px", backgroundColor:"#262A53"}} 
//                             onClick={this.handleLogin}
//                         >
//                             Login
//                         </Button>

//                     </Form>
//                 </>
//             );
//         }
//         else{
//             return(
//                 <>
//                     <Form>
//                         <Form.Group>
//                             <Form.Label style={{fontSize:"20px"}}>Email address</Form.Label>
//                             <Form.Control style={{height:"45px"}} type="email" placeholder="Your Email" 
//                             onChange={async(event) => {
//                                 await this.setState({lusermail: event.target.value});
//                             }}
//                             />
//                         </Form.Group>

//                         <Form.Group>
//                             <Form.Label style={{fontSize:"20px", marginTop:"30px"}}>Password</Form.Label>
//                             <Form.Control style={{height:"45px"}}  type="password" placeholder="Choose a Password"
//                                 onChange={async(event) => {
//                                     await this.setState({lpassword: event.target.value});
//                                 }}
//                              />
//                         </Form.Group>
                        
//                         <Form.Group>
//                             <Form.Label style={{fontSize:"20px", marginTop:"30px"}}>Confirm Password</Form.Label>
//                             <Form.Control style={{height:"45px"}}  type="password" placeholder="Confirm it" 
//                                 onChange={async(event) => {
//                                     await this.setState({sconfirmpassword: event.target.value});
//                                 }}
//                             />
//                         </Form.Group> 

//                         <Button variant="dark" style={{margin:"30px 20px 30px 0px", backgroundColor:"#262A53"}}
//                             onClick={this.handleSignup}
//                         >
//                             Create Account
//                         </Button>
//                     </Form>
//                 </>
//             );
//         }
//     }
//     login = async() => {
//         await this.setState({currentState: "Login"})
//         document.querySelector("#login-btn").classList.add("authenticate-btn-active");
//         document.querySelector("#signup-btn").classList.remove("authenticate-btn-active");
       

//     }
//     signup = async() => {
//         await this.setState({currentState: "Sign Up"})
//         document.querySelector("#login-btn").classList.remove("authenticate-btn-active");
//         document.querySelector("#signup-btn").classList.add("authenticate-btn-active");

//     }

//     render(){
//         return(
//         <>
//             <NavBar/>
//             <Image src={globe} className="image" width='100%' height='auto' 
//                 style={{objectFit:'cover', position:'absolute', zIndex:'-1'}}
//             />
//             <Image src={key} className="animate-image1" width='100%' height='auto' 
//                 style={{objectFit:'cover', position:'absolute', zIndex:'-1', opacity:'1'}}
//             />
//             <Image src={clock} className="animate-image2" width='100%' height='auto' 
//                 style={{objectFit:'cover', position:'absolute', zIndex:'-1', opacity:'1'}}
//             />
//             <Row>
//                 <Col md={7} style={{padding:'80px', color:'white'}}>
//                     <h1 
//                     style={{fontSize:'500%', fontWeight:'bolder'}}>Value For Your Valuables.</h1> 
                    
//                     <h3 style={{marginTop:'30px'}}> Your one-stop decentralized auctioning platform </h3>
//                     {/* <h5> <span style={{fontSize:'40px'}}> 20942548 </span> Antiques Sold </h5> */}

//                     <h5 style={{marginTop:'100px', fontWeight:'light'}} > Leading Platform to sell your Antiques </h5>
//                     <h6 style={{fontWeight:'lighter'}}> © Copyright Reserved by StartBid 2022 </h6>
//                 </Col>
//                 <Col md={5} style={{}}>
//                     <Container fluid 
//                     style={{borderRadius:'10px', backgroundColor:'white', width:'70%', padding:'20px', marginTop:'100px'}}>
//                     <Row style={{marginTop:"30px", }}>
//                         <Col md={6}> 
//                             <Button onClick={this.login} className="btn-lg authenticate-btn authenticate-btn-active" id='login-btn'> 
//                             Login </Button>
//                         </Col>
//                         <Col md={6}> 
//                             <Button onClick={this.signup} className="btn-lg authenticate-btn"  id='signup-btn'> 
//                             Sign Up </Button>
//                         </Col>
//                     </Row>
//                     <hr />

//                     {this.chooseLogin()}
//                     </Container>
                   
//                 </Col>
//             </Row>

//             <Modal show={this.state.failed_login}>
//                         <Modal.Header >
//                         <Modal.Title>Incorrect Password</Modal.Title>
//                         </Modal.Header>
//                         <Modal.Body>
//                         <p>Please ensure you type in your correct credentials</p>
//                         </Modal.Body>
//                         <Modal.Footer>
//                         <Button variant="secondary" onClick={()=>{this.setState({failed_login:false})
//                     }}>
//                         Close
//                     </Button>
//                     </Modal.Footer>
//                 </Modal>

//                 <Modal show={this.state.user_already_exists}>
//                         <Modal.Header >
//                         <Modal.Title>Account exists</Modal.Title>
//                         </Modal.Header>
//                         <Modal.Body>
//                         <p>This email has already been used for creating an account. Please enter a different email. </p>
//                         </Modal.Body>
//                         <Modal.Footer>
//                         <Button variant="secondary" onClick={()=>{this.setState({user_already_exists:false})
//                     }}>
//                         Close
//                     </Button>
//                     </Modal.Footer>
//                 </Modal>

//                 <Modal show={this.state.password_mismatch}>
//                         <Modal.Header >
//                         <Modal.Title>Password Mismatch</Modal.Title>
//                         </Modal.Header>
//                         <Modal.Body>
//                         <p>Please ensure password and confirm password are same.</p>
//                         </Modal.Body>
//                         <Modal.Footer>
//                         <Button variant="secondary" onClick={()=>{this.setState({password_mismatch:false})
//                     }}>
//                         Close
//                     </Button>
//                     </Modal.Footer>
//                 </Modal>
           
//                 <Modal show={this.state.signup_success}>
//                         <Modal.Header >
//                         <Modal.Title>Success</Modal.Title>
//                         </Modal.Header>
//                         <Modal.Body>
//                         <p>Your account has been successfully created</p>
//                         </Modal.Body>
//                         <Modal.Footer>
//                         <Button variant="secondary" onClick={()=>{this.setState({signup_success:false})
//                     }}>
//                         Close
//                     </Button>
//                     </Modal.Footer>
//                 </Modal>

//                 <Modal show={this.state.no_user_exists}>
//                         <Modal.Header >
//                         <Modal.Title>Invalid Login</Modal.Title>
//                         </Modal.Header>
//                         <Modal.Body>
//                         <p>You dont have an account yet, please create one and try again!</p>
//                         </Modal.Body>
//                         <Modal.Footer>
//                         <Button variant="secondary" onClick={()=>{this.setState({no_user_exists:false})
//                     }}>
//                         Close
//                     </Button>
//                     </Modal.Footer>
//                 </Modal>
            
//         </>        
//         );
//     }
// }

// export default Authentication;

import { Component } from 'react';
import { Modal, Button } from 'react-bootstrap';
import globe from '../Resources/globe.png';
import key from '../Resources/key.png';
import clock from '../Resources/clock.png';
import NavBar from './NavBar_Auth';

class Authentication extends Component {
  constructor(props) {
    super(props);
    this.state = {
      currentState: 'Login',
      lusermail: '',
      lpassword: '',
      susermail: '',
      spassword: '',
      sconfirmpassword: '',
      failed_login: false,
      signup_success: false,
      no_user_exists: false,
      password_mismatch: false,
    };
    this.chooseLogin = this.chooseLogin.bind(this);
    this.handleLogin = this.handleLogin.bind(this);
    this.handleSignup = this.handleSignup.bind(this);
  }

  componentDidMount() {
    setTimeout(() => {
      const el = document.querySelector('.animate-image1');
      if (el) el.classList.add('change-image');
    }, 1000);
    setTimeout(() => {
      const el = document.querySelector('.animate-image2');
      if (el) el.classList.add('change-image2');
    }, 1000);
  }

  handleSignup() {
    if (this.state.lpassword !== this.state.sconfirmpassword) {
      this.setState({ password_mismatch: true });
      return;
    }
    const newUser = {
      username: this.state.lusermail.split('@')[0],
      password: this.state.lpassword,
    };
    fetch('http://localhost:8000/signup', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(newUser),
    })
      .then(r => r.ok ? r.json() : null)
      .then(res => {
        if (res && res.success === 1) {
          this.setState({ signup_success: true });
          window.location.href = 'http://localhost:3000/explore';
        } else {
          this.setState({ user_already_exists: true });
        }
      });
  }

  handleLogin() {
    const key = {
      name: this.state.lusermail.split('@')[0],
      password: this.state.lpassword,
    };
    fetch('http://localhost:8000/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(key),
    })
      .then(r => r.json())
      .then(async res => {
        if (res.success === 1) {
          await this.props.func(this.state.lusermail.split('@')[0]);
          localStorage.setItem('user', JSON.stringify({ token: 'logged_in', status: 1 }));
          window.location.href = 'http://localhost:3000/explore';
        } else if (res.success === -1) {
          this.setState({ no_user_exists: true });
        } else {
          this.setState({ failed_login: true });
        }
      });
  }

  chooseLogin() {
    const isLogin = this.state.currentState === 'Login';
    return (
      <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
        <div className="auth-form-group">
          <label className="form-label">Email address</label>
          <input
            className="form-control"
            type="email"
            placeholder="you@example.com"
            onChange={e => this.setState({ lusermail: e.target.value })}
          />
        </div>

        <div className="auth-form-group">
          <label className="form-label">Password</label>
          <input
            className="form-control"
            type="password"
            placeholder="••••••••"
            onChange={e => this.setState({ lpassword: e.target.value })}
          />
        </div>

        {!isLogin && (
          <div className="auth-form-group">
            <label className="form-label">Confirm Password</label>
            <input
              className="form-control"
              type="password"
              placeholder="••••••••"
              onChange={e => this.setState({ sconfirmpassword: e.target.value })}
            />
          </div>
        )}

        <button
          className="btn-primary-sb btn-full"
          style={{ marginTop: '8px', padding: '13px' }}
          onClick={isLogin ? this.handleLogin : this.handleSignup}
        >
          {isLogin ? 'Sign in →' : 'Create Account →'}
        </button>
      </div>
    );
  }

  render() {
    const { currentState } = this.state;

    return (
      <>
        <NavBar />
        <div style={{
          minHeight: 'calc(100vh - 70px)',
          display: 'flex',
          background: 'var(--bg-primary)',
        }}>
          {/* ── Hero left panel ── */}
          <div className="auth-hero" style={{ display: 'none' }}>
            <div className="auth-hero-bg" />
            <img src={globe} className="auth-hero-img animate-image1" alt="" />
            <img src={key} className="auth-hero-img animate-image2" alt="" />
            <div className="auth-hero-content">
              <div className="hero-stats">
                <div className="hero-stat-chip">
                  <div className="stat-val">2M+</div>
                  <div className="stat-label">Auctions</div>
                </div>
                <div className="hero-stat-chip">
                  <div className="stat-val">$4.2B</div>
                  <div className="stat-label">Volume</div>
                </div>
              </div>
              <h1 className="auth-hero-title">
                Value For Your<br />
                <span>Valuables.</span>
              </h1>
              <p className="auth-hero-sub">
                Your decentralized auctioning platform. Secure, transparent, and powered by blockchain.
              </p>
              <p className="auth-hero-footer">© 2022 StartBid. All rights reserved.</p>
            </div>
          </div>

          {/* ── Full-width centered auth ── */}
          <div style={{
            flex: 1,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '40px 20px',
            position: 'relative',
            overflow: 'hidden',
          }}>
            {/* Background decoration */}
            <div style={{
              position: 'absolute',
              inset: 0,
              background: `
                radial-gradient(ellipse at 30% 40%, rgba(124,107,255,0.07) 0%, transparent 60%),
                radial-gradient(ellipse at 70% 70%, rgba(45,212,160,0.04) 0%, transparent 50%)
              `,
              pointerEvents: 'none',
            }} />

            {/* Hero text */}
            <div style={{ textAlign: 'center', marginBottom: '40px', position: 'relative' }}>
              <h1 style={{
                fontFamily: 'var(--font-display)',
                fontSize: 'clamp(32px, 5vw, 56px)',
                fontWeight: 800,
                letterSpacing: '-0.04em',
                background: 'linear-gradient(135deg, var(--text-primary) 0%, var(--text-secondary) 100%)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                backgroundClip: 'text',
                marginBottom: '10px',
              }}>
                Value For Your Valuables.
              </h1>
              <p style={{ color: 'var(--text-muted)', fontSize: '15px' }}>
                Your decentralized auctioning platform
              </p>
            </div>

            {/* Auth card */}
            <div style={{
              width: '100%',
              maxWidth: '400px',
              background: 'var(--bg-card)',
              border: '1px solid var(--border)',
              borderRadius: 'var(--radius-xl)',
              padding: '32px',
              boxShadow: 'var(--shadow-lg)',
              position: 'relative',
            }}>
              {/* Tab switcher */}
              <div className="auth-tabs" style={{ marginBottom: '28px' }}>
                <button
                  className={`auth-tab${currentState === 'Login' ? ' active' : ''}`}
                  onClick={() => this.setState({ currentState: 'Login' })}
                >
                  Sign In
                </button>
                <button
                  className={`auth-tab${currentState === 'Sign Up' ? ' active' : ''}`}
                  onClick={() => this.setState({ currentState: 'Sign Up' })}
                >
                  Create Account
                </button>
              </div>

              <h2 style={{ marginBottom: '4px', fontSize: '22px' }}>
                {currentState === 'Login' ? 'Welcome back' : 'Join StartBid'}
              </h2>
              <p className="auth-subtitle" style={{ color: 'var(--text-muted)', fontSize: '13px', marginBottom: '24px' }}>
                {currentState === 'Login'
                  ? 'Sign in to your account to continue'
                  : 'Create a free account and start bidding'}
              </p>

              {this.chooseLogin()}
            </div>
          </div>
        </div>

        {/* ── Modals ── */}
        {[
          { show: this.state.failed_login, title: 'Incorrect Password', body: 'Please ensure you type in your correct credentials.', key: 'failed_login' },
          { show: this.state.user_already_exists, title: 'Account Exists', body: 'This email is already registered. Please use a different email.', key: 'user_already_exists' },
          { show: this.state.password_mismatch, title: 'Password Mismatch', body: 'Password and confirm password do not match.', key: 'password_mismatch' },
          { show: this.state.signup_success, title: 'Account Created!', body: 'Your account has been successfully created.', key: 'signup_success' },
          { show: this.state.no_user_exists, title: 'No Account Found', body: "You don't have an account yet. Please create one and try again!", key: 'no_user_exists' },
        ].map(m => (
          <Modal key={m.key} show={m.show} centered>
            <Modal.Header>
              <Modal.Title>{m.title}</Modal.Title>
            </Modal.Header>
            <Modal.Body><p>{m.body}</p></Modal.Body>
            <Modal.Footer>
              <button className="btn-ghost-sb" onClick={() => this.setState({ [m.key]: false })}>
                Close
              </button>
            </Modal.Footer>
          </Modal>
        ))}
      </>
    );
  }
}

export default Authentication;