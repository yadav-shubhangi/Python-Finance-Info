import React, { Component } from 'react'
import './App.css'
import axios from 'axios'

class App extends Component {
  constructor(props) {
    //Call the constrictor of Super class i.e The Component
    super(props);
    this.state = {
      stockSymbol: null,
      currentDateTime: null,
      fullCompanyName: null,
      stockPrice: null,
      valueChanges: null,
      percentChanges: null,
      result: false,
      error : false,
      scrollMessage : false
    }
  }
  // Initializing the state variables
  componentWillMount() {
    this.setState({
      stockSymbol: '',
      currentDateTime: null,
      fullCompanyName: null,
      stockPrice: null,
      valueChanges: null,
      percentChanges: null
    })
  }
  fetchInfo = () => {
    let dataToSend = {
      stockSymbol: this.state.stockSymbol
    }
    axios.post(`http://localhost:5000/getStockInfo`, dataToSend)
      .then(response => {
        console.log("response-->", response)
        if(response.status === 200) {
          console.log("hererererer")
          this.setState({
            currentDateTime : response.data.currentDateTime,
            fullCompanyName : response.data.fullCompanyName,
            stockPrice : response.data.stockPrice,
            valueChanges : response.data.valueChanges,
            percentChanges : response.data.percentChanges,
          })
          this.setState({
            result : true,
            error: false,
            scrollMessage: true
          })
          this.clearData();
        } else {
          this.setState({
            error: true,
            scrollMessage:false
          })
          this.clearResponseData();
        }
      }).catch(err => {
        console.log(`Error in calling api to fetch info ${err}`)
        this.setState({
          error: true,
          scrollMessage:false
        })
        this.clearResponseData();
      })
  }

  // Clear the input fields
  clearData = () => {
    this.setState({
      stockSymbol: ''
    })
  }

  clearResponseData = () => {
    this.setState({
      currentDateTime: null,
      fullCompanyName: null,
      stockPrice: null,
      valueChanges: null,
      percentChanges: null
    })
  }

  // Render the html view
  render() {
    let success = this.state.result;
    let data;
    if (success) {
      data = <div class="text-center">
      <h3 class="heading">Stock Finance Info</h3>
      <table class="table table-striped table-heading">
        <tr>
          <th> Current date and time :  </th>
          <td> { this.state.currentDateTime } </td>
        </tr>
        <tr>
          <th> Full name of the company :  </th>
          <td> { this.state.fullCompanyName } </td>
        </tr>
        <tr>
          <th> Stock price :  </th>
          <td> { this.state.stockPrice } </td>
        </tr>
        <tr>
          <th> Value changes (+ for increase and - for decrease) :  </th>
          <td> { this.state.valueChanges } </td>
        </tr>
        <tr>
          <th> Percent changes (+ for increase and - for decrease) :  </th>
          <td> { this.state.percentChanges } </td>
        </tr>
      </table>
    </div>;
    }
    return (
      <body>
        <div class="text-center heading">
          <h3 class="heading">Get your Stock Finance Info</h3>
        </div>
        <form class="container form-group form-heading" method="post">
          <p>Enter Stock Symbol:</p>
          <input type="text"
            name="stockSymbol"
            value={this.state.stockSymbol}
            onChange={(event) => {
              this.setState({
                stockSymbol: event.target.value
              })
            }}
            required
            class="form-control"
          />
          {this.state.error ? <p className="text-center">Invalid stock symbol. Try again with valid data.</p> : <p></p>}
          {this.state.scrollMessage ? <p className="text-center">Scroll down to see results.</p> : <p></p>}
          <div className="text-center">
            <button className="btn btn-primary margin-top" type="button" onClick={() => this.fetchInfo()}>Get Stock Finance Data</button>
          </div>
        </form>
        {data}
      </body>
    )
  }
}

export default App
