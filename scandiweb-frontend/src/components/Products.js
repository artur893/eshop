import React, { Component } from 'react';
import './Products.css';
import { client, Query } from '@tilework/opus'

const endpointUrl = 'http://localhost:4000/'
client.setEndpoint(endpointUrl)

class Category extends Component {

    render() {
        return (
            <div className='category'>
                {this.props.pickedCategory}
            </div>)
    }
}

class Products extends Component {
    constructor(props) {
        super(props)

        this.state = {
            isLoadedData: false
        }

        this.pickProductDetails = this.pickProductDetails.bind(this)
    }

    componentDidUpdate(prevProps) {
        if (this.props !== prevProps) {
            this.getCategoryData(this.props.pickedCategory.toLowerCase())
        }
    }

    async getCategoryData(category) {
        const productQuery = new Query(`category(input:{title: "${category}"})
        {products{id, name, category, inStock, brand, gallery, prices{currency{label, symbol}, amount}}}`)
        try {
            const productsData = await client.post(productQuery)
            this.setState(productsData)
        } catch (error) {
            console.log(`Unable to get data from server: ${error}`)
        }
    }

    pickProductDetails(e) {
        const name = e.target.getAttribute('productname')
        this.props.changeProduct(name)
        this.props.hideProducts(true)
        window.scrollTo(0, 0);
    }

    displayOutOfStock(product) {
        if (!product.inStock) {
            return <p className='out-of-stock'>OUT OF STOCK</p>
        }
    }

    addOutOfStockClass(product) {
        if (!product.inStock) {
            return 'out-of-stock'
        }
    }

    displayProductName(product) {
        return <p className='product-name'>{`${product.brand} ${product.name}`}</p>
    }

    displayProductPrice(product) {
        const indexOfCurrency = product.prices.findIndex((currency) => currency.currency.symbol === this.props.pickedCurrency)
        return <p className='product-price'>{product.prices[indexOfCurrency].currency.symbol}{product.prices[indexOfCurrency].amount.toFixed(2)}</p>
    }

    displayProductImage(product) {
        return <img src={product.gallery[0]} alt={product.name} className='product-img'></img>
    }

    displayCartBuyCirlce() {
        return <div className='cart-circle'>
            <svg xmlns="http://www.w3.org/2000/svg" width="30" height="30" fill="white" className="bi bi-cart2" viewBox="0 0 16 16">
                <path d="M0 2.5A.5.5 0 0 1 .5 2H2a.5.5 0 0 1 .485.379L2.89 4H14.5a.5.5 0 0 1 .485.621l-1.5 6A.5.5 0 0 1 13 11H4a.5.5 0 0 1-.485-.379L1.61 3H.5a.5.5 0 0 1-.5-.5zM3.14 5l1.25 5h8.22l1.25-5H3.14zM5 13a1 1 0 1 0 0 2 1 1 0 0 0 0-2zm-2 1a2 2 0 1 1 4 0 2 2 0 0 1-4 0zm9-1a1 1 0 1 0 0 2 1 1 0 0 0 0-2zm-2 1a2 2 0 1 1 4 0 2 2 0 0 1-4 0z" />
            </svg>
        </div>
    }

    populateCards() {
        if (this.state.category) {
            const productCards = this.state.category.products.map((product) => {
                return (
                    <div className="product-card" id={this.addOutOfStockClass(product)} key={product.name}
                        onClick={this.pickProductDetails} productid={product.name} productname={product.id}>
                        {this.displayOutOfStock(product)}
                        {this.displayProductImage(product)}
                        {this.displayCartBuyCirlce()}
                        <div className="product-info">
                            {this.displayProductName(product)}
                            {this.displayProductPrice(product)}
                        </div>
                    </div>
                )
            })
            return productCards
        }
    }
    render() {
        return (
            <div className="products">
                {this.populateCards()}
            </div>
        )
    }

}


export { Category, Products }