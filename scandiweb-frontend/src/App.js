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
      pickedCategory: 'TECH',
      pickedCurrency: '$',
      pickedProduct: null,
      isDetailCardActive: false,
    }
    this.changeState = this.changeState.bind(this)
    this.changeCurrency = this.changeCurrency.bind(this)
    this.changeProduct = this.changeProduct.bind(this)
    this.setIsDetailCardActiveToTrue = this.setIsDetailCardActiveToTrue.bind(this)
  }

  changeState(newCategory) {
    this.setState({ pickedCategory: newCategory })
  }

  changeCurrency(newCurrency) {
    const symbol = newCurrency.split(' ')[0]
    this.setState({ pickedCurrency: symbol })
  }

  changeProduct(newProduct) {
    this.setState({ pickedProduct: newProduct })
  }

  setIsDetailCardActiveToTrue() {
    this.setState({ isDetailCardActive: true })
  }

  displayCategoryName() {
    if (this.state.isDetailCardActive === false) {
      return <Category pickedCategory={this.state.pickedCategory} />
    }
  }

  displayProductsList() {
    if (this.state.isDetailCardActive === false) {
      return <Products pickedCategory={this.state.pickedCategory} pickedCurrency={this.state.pickedCurrency}
        changeProduct={this.changeProduct} hideProducts={this.setIsDetailCardActiveToTrue} />
    }
  }

  render() {
    return (
      <div className='container'>
        <Header pickedCategory={this.state.pickedCategory} pickedCurrency={this.state.pickedCurrency}
          changeCategory={this.changeState} changeCurrency={this.changeCurrency} />
        {this.displayCategoryName()}
        {this.displayProductsList()}
      </div>
    )
  }

}

export default App
