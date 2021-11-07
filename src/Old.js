import React from "react"
import { WidthProvider, Responsive } from "react-grid-layout"
import _ from "lodash"
import axios from "axios"
import { ethers, utils } from "ethers"
import { BsFillSunFill } from 'react-icons/bs'
import { BsTwitter } from 'react-icons/bs'
import { BrowserRouter as Router, Switch, Route, Link } from "react-router-dom"
import { GiGasPump } from 'react-icons/gi'
import html2canvas from 'html2canvas'
import $ from 'jquery'

import 'bootstrap/dist/css/bootstrap.css'
import Navbar from 'react-bootstrap/Navbar'
import Nav from 'react-bootstrap/Nav'
import Container from 'react-bootstrap/Container'
import { FormControl, Button, InputGroup } from 'react-bootstrap'
import { PopoverPicker } from "./ColorPicker.js";


const ResponsiveReactGridLayout = WidthProvider(Responsive);

export default class AddRemoveLayout extends React.PureComponent {
  static defaultProps = {
    className: "layout",
    cols: { lg: 12, md: 10, sm: 6, xs: 4, xxs: 2 },
    rowHeight: 100
  };

  constructor(props) {
    super(props);

    this.state = {
      items: [],
      newCounter: 0,
      items_active: [],
      newCounter_active: 0,

      amount: 0.01,
      gas: '0',
      imgBack: "#ffffff",
      address: "Connect",
      theme: 'light     ',
      color: 'black' /*Set this as the primary text colour*/
    }

    this.donate = this.donate.bind(this)
    this.connect = this.connect.bind(this)

    this.init = this.init.bind(this)
    this.onAddItem = this.onAddItem.bind(this)
    this.onBreakpointChange = this.onBreakpointChange.bind(this)
  }

  createElement(el) {
    const removeStyle = {
      position: "absolute",
      right: "5px",
      top: 0,
      cursor: "pointer"
    };
    const i = el.i;
    if (this.state.items[i] !== undefined) {
      if (this.state.items[i].img.search("mp4") === -1) {
        return (
          <button key={i} style={{ background: "none", padding: 0, margin: 0, outline: 0, border: 0 }} dataimage={`${this.state.items[i].img}`} onClick={this.onAddItem}>
            <img src={`${this.state.items[i].img}`} style={{ backgroundSize: 'contain', display: `${this.state.items[i].display}`, width: "150px", height: "150px" }} />
          </button>
        );
      }
    }
  }

  createGridElement(el) {
    const removeStyle = {
      position: "absolute",
      right: "5px",
      top: 0,
      cursor: "pointer"
    };
    const i = el.i;
    if (this.state.items_active[i] !== undefined) {
      return (
        <div id={i} key={i} data-grid={el} style={{ backgroundImage: `url(${this.state.items_active[i].img})`, backgroundSize: 'cover', backgroundRepeat: 'no-repeat', display: `${this.state.items_active[i].display}` }}>
          <span className="text"></span>
          <span
            className="remove"
            style={removeStyle}
            onClick={this.onRemoveItem.bind(this, i)}
          >
            x
          </span>
        </div>
      );
    }
  }

  onAddItem(props) {
    this.setState({
      items_active: this.state.items_active.concat({
        i: this.state.newCounter_active.toString(),
        x: (this.state.items_active.length * 2) % (this.state.cols || 12),
        y: Infinity,
        w: 2,
        h: 2,
        img: props.target.currentSrc,
        display: 'block'
      }),
      newCounter_active: this.state.newCounter_active + 1
    });
  }

  async init() {
    let data = await axios.get(
      `https://api.opensea.io/api/v1/assets?owner=${this.state.address}&order_direction=desc&offset=0&limit=50`, { 'X-API-KEY': '5bc5b989e0024f40be940b1f938bd627' }
    )
    data.data.assets.forEach(element => {
      this.setState({
        items: this.state.items.concat({
          i: this.state.newCounter.toString(),
          x: (this.state.items.length * 2) % (this.state.cols || 12),
          y: 10,
          w: 2,
          h: 2,
          img: element.image_url,
          display: 'block'
        }),
        newCounter: this.state.newCounter + 1,
        address: this.state.address,
      });
    });
  }

  onResize(layout, oldLayoutItem, layoutItem, placeholder) {
    // if((layoutItem.h / layoutItem.w % 1) != 0) {
    //   layoutItem.h = 1
    //   layoutItem.w = 1
    // }
    // Lock item to square
  }


  onBreakpointChange(breakpoint, cols) {
    this.setState({
      breakpoint: breakpoint,
      cols: cols
    });
  }

  onRemoveItem(i) {
    this.setState(prevState => {
      const newItems = [...prevState.items_active];
      newItems[i].display = 'none';
      newItems[i].img = 'none';
      return { items_active: newItems };
    })
  }

  async connect() {
    try {
      const { ethereum } = window;

      if (!ethereum) {
        alert("Get an Ethereum Wallet!");
        return;
      }
      let provider = new ethers.providers.Web3Provider(ethereum);
      const accounts = await ethereum.request({ method: "eth_requestAccounts" })
      let gasPrice = await provider.getGasPrice()
      gasPrice = Math.round(utils.formatUnits(gasPrice, "gwei"))

      this.setState({ address: accounts[0], gas: gasPrice.toString() })
      this.init()
    } catch (error) {
      console.log(error)
    }
  }

  async donate() {
    try {
      const { ethereum } = window;

      if (!ethereum) {
        alert("Get an Ethereum Wallet!");
        return;
      }
      const accounts = await ethereum.request({ method: "eth_requestAccounts" })
      let provider = new ethers.providers.Web3Provider(ethereum);

      const params = [{
        from: accounts[0],
        to: "0x1Dac794d333ce41461540a0BCF8195029EFE6557",
        value: ethers.utils.parseUnits(this.state.amount, 'ether').toHexString()
      }];
      await provider.send('eth_sendTransaction', params)
    } catch (error) {
      console.log(error)
    }
  }

  render() {
    return (
      <>
        <Router>
          <Navbar bg="black" variant={this.state.theme} expand="lg" sticky="top" style={{ paddingLeft: "15%", paddingRight: "15%" }}>
            <Container fluid>
              <Navbar.Brand href="#home">
                <img
                  src="/frogie.png"
                  height="50"
                  className="d-inline-block align-bottom"
                  style={{ marginBottom: "-13px" }}
                />
              </Navbar.Brand>
              <Navbar.Toggle aria-controls="navbarScroll" />
              <Navbar.Collapse id="navbarScroll">
                <Nav
                  className="me-auto my-2 my-lg-0"
                  navbarScroll
                >
                  <Link to="/" style={{ color: "white", textDecoration: 'none' }}>Home</Link>
                </Nav>
                <GiGasPump style={{ color: "white", fontSize: "1.45rem", marginTop: '1px', padding: 0 }} /><a style={{ color: "lightgrey", marginLeft: "2px" }}>{this.state.gas}</a>
                <Button variant="light" onClick={this.connect} style={{ marginLeft: "10px" }}>{this.state.address == "Connect" ? "Connect" : `${this.state.address.slice(0, 10)}...`}</Button>
                <Button variant="light" onClick={() => {
                  $(".remove").hide()
                  html2canvas(document.querySelector(".react-grid-layout"), { useCORS: true, backgroundColor: this.state.imgBack }).then(canvas => {
                    var url = canvas.toDataURL();
                    $("<a>", {
                      href: url,
                      download: "banner"
                    })
                      .on("click", function () { $(this).remove() })
                      .appendTo("body")[0].click()
                    $(".remove").show()
                  });
                }} style={{ marginLeft: "3px" }}>Save</Button>
                <Button variant="light" style={{ marginLeft: "3px" }} onClick={() => {
                  window.location.href = 'https://twitter.com/'
                }}> <BsTwitter /></Button>
                <PopoverPicker color={this.state.imgBack} onChange={(ev) => { this.setState({ imgBack: ev }) }} />
              </Navbar.Collapse>
            </Container>
          </Navbar>
          <Switch>
            <Route exact path="/">
              <Container fluid style={{ paddingLeft: "15%", paddingRight: "15%", paddingTop: "5%", paddingBottom: "1px", color: this.state.color, background: '#7ed957' }} >
                <h1 className="display-4">NFT Playground</h1>
                <p className="lead">An interactive NFT playground created in React, utilising EthersJS, Bootstrap and the Opensea API. You can view all of your current NFTs in an interactive playground
                  by clicking the 'Connect' button; in this playground you can resize, remove & drag your NFTs, positioning them however you wish.  </p>
                <InputGroup className="mb-3">
                  <FormControl
                    placeholder="Donation Amount (Ether)"
                    aria-label="Donation Amount"
                    className={`bg-${this.state.theme}`}
                    onChange={(ev) => {
                      this.setState({ amount: ev.target.value })
                    }}
                    style={{ border: `1px solid white`, maxWidth: '250px', color: "black", background: "#90e26d !important" }}
                  />
                  <Button variant="light" onClick={this.donate}>
                    Donate
                  </Button>
                </InputGroup>
              </Container>

              <Container fluid style={{ paddingLeft: "15%", paddingRight: "15%", paddingTop: "5%", paddingBottom: "5%", color: this.state.color, paddingBottom: "500px", background: "#7ed957" }}>
                <Container fluid className="d-flex flex-wrap align-content-center justify-content-center">
                  {_.map(this.state.items, el => this.createElement(el))}
                </Container>

                <ResponsiveReactGridLayout
                  id="layout"
                  onResize={this.onResize}
                  onBreakpointChange={this.onBreakpointChange}
                  {...this.props}
                >
                  {_.map(this.state.items_active, el => this.createGridElement(el))}
                </ResponsiveReactGridLayout>
              </Container>
              <Container fluid className="d-flex justify-content-center" style={{ paddingBottom: "10px", paddingTop: "10px", background: "#1f1940", color: "white" }}>
                <Button variant="dark" style={{ marginLeft: "3px", background: "none", border: "none", marginTop: "-3px" }} onClick={() => {
                  window.location.href = 'https://twitter.com/'
                }}> <BsTwitter /></Button>
              </Container>
              <div id="canvas"></div>
            </Route>
          </Switch>
        </Router>
      </>
    );
  }
}
