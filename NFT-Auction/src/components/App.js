import React, { Component} from 'react';
import Web3 from 'web3';
import './App.css';
import ArtAuction from '../abis/ArtAuction.json'
import Acution from '../components/Acution'
import { Link } from 'react-router-dom'
import { Route } from 'react-router-dom';
import { Routes } from 'react-router-dom';

const ipfsClient = require('ipfs-http-client')
const ipfs = ipfsClient({ host: 'ipfs.infura.io', port: 5001, protocol: 'https' }) // Infura IPFS API

class App extends Component {
  constructor(props) {
    super(props)
     
    this.state = {
      ipfsHash: '',  //Final Hash 
      contract: null,
      web3: null,
      buffer: null,  //DAta to be sent to IPFS
      account: null,
      price: null,
      totalSupply: 0,
      arthash: [],
      infoTrans:''
    }
    this.handleSubmit = this.handleSubmit.bind(this);
  }  
  

  //Metamask componenet appears on screen
  async componentWillMount() {

    await this.loadBlockchainData()
  }
  
  async loadBlockchainData() {
    const web3 = new Web3(Web3.givenProvider || "https://localhost:9545")  //To be replaced!
    
    var accounts = await web3.eth.getAccounts()
    console.log("account  ",  accounts)
    this.setState({  account: accounts[0] })
    console.log("Account set", this.state.account)
    var networkId = await web3.eth.net.getId()
    var networkData = ArtAuction.networks[networkId]
    if(networkData) {
      var contract = new web3.eth.Contract(ArtAuction.abi, networkData.address)
      this.setState({ contract })
      const totalSupply = await contract.methods.totalSupply().call()
      this.setState({ totalSupply })

      //load hashes
    } else {
      window.alert('Smart contract not deployed to detected network.')
    }
  }
    
    
  

 
  //Capture the File
  captureFile = (event) => {
    event.preventDefault()   //Prevent default behaviour like opening new tab
    var file = event.target.files[0]  //{0:File 1:Length}
    var reader = new window.FileReader()  //Convert to a buffer
    reader.readAsArrayBuffer(file)  //Pass file
    //Fired after reading operation is completed
    reader.onloadend = () => {  
      this.setState({ buffer: Buffer(reader.result) }) //Data to send to IPFS
      console.log('buffer', this.state.buffer)
      
    }
  }

  //Submitting file to IPFS
  onSubmit = (event) => {
    event.preventDefault()  //Preventing default behaviour
    console.log("Submitting file to ipfs")
    
    ipfs.add(this.state.buffer, (error, result) => {  //add file to ipfs. 2 args in callback fn
      console.log('Ipfs result', result)
      const ipfsHash = result[0].hash //Saving hash
      this.setState({ipfsHash: ipfsHash})
      if(error) {
        console.error(error)
        return
      }     
      
      })
   }

   getImage = (event) =>{
     event.preventDefault()
   
   }
   Bid = (event) =>{
    event.preventDefault()
    
  }

   handleSubmit(event) {
    event.preventDefault();

  }

  render() {
    return (
      <div>
        
        <nav className="navbar navbar-dark fixed-top bg-dark flex-md-nowrap p-0 shadow">
          <ul className="navbar-nav px-3">
            <li className="nav-item text-nowrap d-none d-sm-none d-sm-block">
             <small className="text-white">钱包： {this.state.account}</small>
            </li>
          </ul>
        </nav>
        
        <div className="container-fluid mt-5" >
          <div className="row">
            <main role="main" className="col-lg-12 d-flex ">
              <div className="content mr-auto ml-auto">
                <a
                  href="https://in.linkedin.com/in/sachinmatta"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                </a>

                <div id='navigation' >
                  <a
                  href='./Acution.js'>
                      <button>竞价购买</button>
                     
                  </a>
                  <button>出售图片</button><button>查看已购入图片</button>
                </div>
                <h2>添加拍卖图片：</h2>
                <label style={{backgroundColor:'lightgray',width:450}}>
                
                  <form onSubmit={this.onSubmit} >
                  <input type='file' onChange={this.captureFile} />
                  <button type='submit'>提交</button>
                  </form>
                <form
          
                href={"https://ipfs.infura.io/ipfs/" + this.state.ipfsHash}
                target="_blank"
                rel="noopener noreferrer"
                >
         
                <label>图片的IPFS CID：<br/>{this.state.ipfsHash}
                </label>
       
                </form>
                </label>
            
                <form  onSubmit={(event) => {
                  event.preventDefault()
                  var price = document.getElementById("p").value 
                  var limit = document.getElementById("i").value 
                 this.state.contract.methods.addArtItem(price, this.state.ipfsHash, limit).send({ from: this.state.account })
                 
                }}>
                  <label style={{backgroundColor:'lightgray',width:450}}>
                  输入初始价格：
                  <input id="p" type="number" name="price" />
                  <br/>
                   输入最小增长价格：
                  <input id="i" type="number" name="limit" />
                  
                  <input type='submit' />
                  </label>
                </form>  

                <label style={{backgroundColor:'lightgray',width:450}} >
                拍卖人次序：{'    '}
                  <input id="t" type="number" name="price" />

                 <button onClick={async(event) => {
                   var tid = document.getElementById("t").value 
                  event.preventDefault()
                 var x= await this.state.contract.methods.getArtItem(tid).call({ from: this.state.account })  
                 console.log(x)
                //  
                this.setState({infoTrans:x})
                 
                }}
                >详情</button>   
                <br/>
                当前图片IPFS CID：<textarea style={{height:30}}value={this.state.infoTrans[2]} readOnly={true}/><br/>
                当前拍卖人出价：<textarea style={{height:30}}value={this.state.infoTrans[1]} readOnly={true}/><br/>
                图片最高出价：<textarea style={{height:30}}value={this.state.infoTrans[3]} readOnly={true}/>

                </label>
                <br/>
                  <label>
                
                <button>结束拍卖</button>
                  </label>
                  
              </div>
            </main>
          </div>
        </div>
       
      </div>
    );
  }
}

export default App;
