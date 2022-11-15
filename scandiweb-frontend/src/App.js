import { Header } from './components/Header'
import { Category, Products } from './components/Products'
import { Component } from 'react';
import './App.css';
import { client } from '@tilework/opus'

const endpointUrl = 'http://localhost:4000/'
client.setEndpoint(endpointUrl)

class App extends Component {
  constructor(props) {
    super(props)

    this.state = {
      pickedCategory: 'CLOTHES',
      pickedCurrency: '$'
    }
    this.changeState = this.changeState.bind(this)
    this.changeCurrency = this.changeCurrency.bind(this)
  }

  changeState(newCategory) {
    this.setState({ pickedCategory: newCategory })
  }

  changeCurrency(newCurrency) {
    const symbol = newCurrency.split(' ')[0]
    this.setState({ pickedCurrency: symbol })
  }

  // query{
  //   category{products{
  //     id, 
  //     name, 
  //     inStock, 
  //     gallery, 
  //     description, 
  //     category, 
  //     attributes{id,name,type,items{displayValue,value,id}}, 
  //     prices{currency{label,symbol},amount}, 
  //     brand}}
  // }


  render() {
    return (
      <div className='container'>
        <Header pickedCategory={this.state.pickedCategory} pickedCurrency={this.state.pickedCurrency} changeCategory={this.changeState} changeCurrency={this.changeCurrency} />
        <Category pickedCategory={this.state.pickedCategory} />
        <Products pickedCategory={this.state.pickedCategory} pickedCurrency={this.state.pickedCurrency} />
      </div>
    )
  }

}

export default App
