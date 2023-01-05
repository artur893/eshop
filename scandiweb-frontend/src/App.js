import { Header } from './components/Header'
import { Category, Products } from './components/Products'
import { Pdp } from './components/Pdp'
import React, { Component } from 'react';
import './App.css';
import { client, Query } from '@tilework/opus'
import { Bagview } from './components/Bagview';

const endpointUrl = 'http://localhost:4000/'
client.setEndpoint(endpointUrl)

class App extends Component {
  constructor(props) {
    super(props)

    this.header = React.createRef();

    this.state = {
      pickedCategory: 'ALL',
      pickedCurrency: '$',
      pickedProduct: null,
      isDetailCardActive: false,
      isBagViewActive: false,
      productsData: null
    }
    this.changeCategory = this.changeCategory.bind(this)
    this.changeCurrency = this.changeCurrency.bind(this)
    this.changeProduct = this.changeProduct.bind(this)
    this.setDetailCardActive = this.setDetailCardActive.bind(this)
    this.setBagviewActive = this.setBagviewActive.bind(this)
    this.addToCart = this.addToCart.bind(this)
    this.sendCartData = this.sendCartData.bind(this)
  }

  componentDidMount() {
    const currency = localStorage.getItem('currency')
    if (currency) {
      this.setState({ pickedCurrency: currency })
    }
  }

  componentDidUpdate() {
    localStorage.setItem('currency', this.state.pickedCurrency)
  }

  changeCategory(newCategory) {
    this.setState({ pickedCategory: newCategory })
  }

  changeCurrency(newCurrency) {
    const symbol = newCurrency.split(' ')[0]
    this.setState({ pickedCurrency: symbol })
  }

  changeProduct(newProduct) {
    this.setState({ pickedProduct: newProduct })
  }

  setDetailCardActive(value) {
    this.setState({ isDetailCardActive: value })
  }

  setBagviewActive(value) {
    this.setState({ isBagViewActive: value })
  }

  sendCartData(cartData) {
    this.setState({ cart: cartData })
  }

  addToCart(id, attributesToCart) {
    this.setState({
      productToCart: {
        id,
        attributesToCart
      }
    })
  }

  displayHeader() {
    return <Header pickedCategory={this.state.pickedCategory} pickedCurrency={this.state.pickedCurrency} productsData={this.state.productsData}
      changeCategory={this.changeCategory} changeCurrency={this.changeCurrency} setBagviewActive={this.setBagviewActive}
      hideProducts={this.setDetailCardActive} sendToCart={this.state.productToCart} sendCartData={this.sendCartData} ref={this.header} />
  }

  displayCategoryName() {
    if (this.state.isDetailCardActive === false && this.state.isBagViewActive === false) {
      return <Category pickedCategory={this.state.pickedCategory} />
    }
  }

  displayProductsList() {
    if (this.state.isDetailCardActive === false && this.state.isBagViewActive === false) {
      return <Products pickedCategory={this.state.pickedCategory} pickedCurrency={this.state.pickedCurrency} addToCart={this.addToCart}
        changeProduct={this.changeProduct} hideProducts={this.setDetailCardActive} />
    }
  }

  displayPDP() {
    if (this.state.isDetailCardActive === true) {
      return <Pdp pickedProduct={this.state.pickedProduct} pickedCurrency={this.state.pickedCurrency} addToCart={this.addToCart} />
    }
  }

  displayBagView() {
    if (this.state.isBagViewActive === true) {
      return <Bagview cart={this.state.cart} pickedCurrency={this.state.pickedCurrency} cartComponent={this.header.current.cartComponent} />
    }
  }

  render() {
    return (
      <div className='viewport' onClick={() => {
        this.header.current.cartComponent.current.closeCartDetails()
        this.header.current.currencyComponent.current.closeDropMenu()
      }}>
        <div className='container'>
          {this.displayHeader()}
          {this.displayCategoryName()}
          {this.displayProductsList()}
          {this.displayPDP()}
          {this.displayBagView()}
        </div>
      </div>
    )
  }

}

export default App
