import { Header } from './components/Header'
import { Category, Products } from './components/Products'
import { Pdp } from './components/Pdp'
import { Component } from 'react';
import './App.css';
import { client, Query } from '@tilework/opus'
import { Bagview } from './components/Bagview';

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
      isBagViewActive: false,
      productsData: null
    }
    this.changeState = this.changeState.bind(this)
    this.changeCurrency = this.changeCurrency.bind(this)
    this.changeProduct = this.changeProduct.bind(this)
    this.setIsDetailCard = this.setIsDetailCard.bind(this)
    this.changeBagviewActive = this.changeBagviewActive.bind(this)
    this.addToCart = this.addToCart.bind(this)
  }

  componentDidMount() {
    if (this.state.productsData === null) {
      this.getProductsData()
    }
  }

  async getProductsData() {
    const productsQuery = new Query('category{products{id, name, inStock, gallery, description, category, attributes{id,name,type,items{displayValue,value,id}}, prices{currency{label,symbol},amount}, brand}}')
    try {
      const productsData = await client.post(productsQuery)
      this.setState({ productsData: productsData.category.products })
    } catch (error) {
      console.log(`Unable to get data from server: ${error}`)
    }
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

  setIsDetailCard(value) {
    this.setState({ isDetailCardActive: value })
  }

  changeBagviewActive(value) {
    this.setState({ isBagViewActive: value })
  }

  addToCart(id, attributesToCart) {
    this.setState({
      productToCart: {
        id,
        attributesToCart
      }
    })
  }

  displayCategoryName() {
    if (this.state.isDetailCardActive === false && this.state.isBagViewActive === false) {
      return <Category pickedCategory={this.state.pickedCategory} />
    }
  }

  displayProductsList() {
    if (this.state.isDetailCardActive === false && this.state.isBagViewActive === false) {
      return <Products pickedCategory={this.state.pickedCategory} pickedCurrency={this.state.pickedCurrency} addToCart={this.addToCart}
        productsData={this.state.productsData} changeProduct={this.changeProduct} hideProducts={this.setIsDetailCard} />
    }
  }

  displayPDP() {
    if (this.state.isDetailCardActive === true) {
      return <Pdp productsData={this.state.productsData} pickedProduct={this.state.pickedProduct} pickedCurrency={this.state.pickedCurrency} addToCart={this.addToCart} />
    }
  }

  displayBagView() {
    if (this.state.isBagViewActive === true) {
      return <Bagview />
    }
  }

  render() {
    return (
      <div className='container'>
        <Header pickedCategory={this.state.pickedCategory} pickedCurrency={this.state.pickedCurrency} productsData={this.state.productsData}
          changeCategory={this.changeState} changeCurrency={this.changeCurrency} changeBagviewActive={this.changeBagviewActive}
          hideProducts={this.setIsDetailCard} sendToCart={this.state.productToCart} />
        {this.displayCategoryName()}
        {this.displayProductsList()}
        {this.displayPDP()}
        {this.displayBagView()}
      </div>
    )
  }

}

export default App
