// import react, { Component } from "react";
// import { Image } from "react-bootstrap";

// import logo from "../Resources/logo.png";
// import { Container, Navbar, Nav } from "react-bootstrap";


// class NavBar extends Component {
//   constructor(props) {
//     super(props);
//     this.state = {};
//   }
//   render() {
//     return (
//       <div>
//          <Navbar expand="lg"
//             style={{backgroundColor: '#21325E', color:'white'}} 

//         >
//           <Container fluid>
//             <Navbar.Toggle aria-controls="basic-navbar-nav" />
            
//               <Navbar.Brand href="/explore" className="navbrandname">
//               <Image style={{height:"60px",width:"60px"}} src={logo}
              
//                 /> 
//               </Navbar.Brand>

//               <Navbar.Brand href="/explore" className="navbrandname">
//               <h2 style={{color:"white", fontWeight:'light'}}>StartBid</h2>
//               </Navbar.Brand>
            
//             <Navbar.Collapse id="basic-navbar-nav">
//               <Nav 
//                 style={{padding:"20px"}}
//               className="ml-auto mr-3">
//               <div className="navdiv navstyle ">
                  
//                 </div>
              
                
                
                
//               </Nav>
//             </Navbar.Collapse>
//           </Container>
//         </Navbar>
       
//       </div>
//     );
//   }
// }

// export default NavBar;


import { Component } from "react";
import { Image } from "react-bootstrap";
import logo from "../Resources/logo.png";

class NavBar extends Component {
  constructor(props) {
    super(props);
    this.state = {
      theme: localStorage.getItem('sb-theme') || 'dark',
    };
    this.toggleTheme = this.toggleTheme.bind(this);
  }

  componentDidMount() {
    document.documentElement.setAttribute('data-theme', this.state.theme);
  }

  toggleTheme() {
    const next = this.state.theme === 'dark' ? 'light' : 'dark';
    this.setState({ theme: next });
    document.documentElement.setAttribute('data-theme', next);
    localStorage.setItem('sb-theme', next);
  }

  render() {
    const { theme } = this.state;
    return (
      <nav className="sb-navbar">
        <a href="/" className="navbar-brand-wrap" style={{ textDecoration: 'none' }}>
          <Image src={logo} className="brand-logo" />
          <span className="brand-name">StartBid</span>
        </a>
        <div className="nav-links">
          <button className="nav-theme-toggle" onClick={this.toggleTheme} title="Toggle theme">
            {theme === 'dark' ? '☀' : '☽'}
          </button>
        </div>
      </nav>
    );
  }
}

export default NavBar;