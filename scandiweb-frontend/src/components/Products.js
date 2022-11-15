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

        this.state = null
    }

    componentDidMount() {
        this.getProductsData()
    }

    async getProductsData() {
        const productsQuery = new Query('category{products{name, gallery,  category, prices{currency{label, symbol}, amount}}}')
        try {
            const productsData = await client.post(productsQuery)
            this.setState({ products: await productsData.category.products })
        } catch (error) {
            console.log(`Unable to get data from server: ${error}`)
        }
    }

    populateCards(category) {
        if (this.state !== null) {
            const productCards = this.state.products.map((product) => {
                const indexOfCurrency = product.prices.findIndex((currency) => currency.currency.symbol === this.props.pickedCurrency)
                if (product.category.toUpperCase() === category) {
                    if (product.name === 'Jacket') {
                        return (
                            <div className="product-card" key={product.name}>
                                <img src={product.gallery[5]} alt={product.name} className='product-img'></img>
                                <div className="product-info">
                                    <p className='product-name'>{product.name}</p>
                                    <p className='product-price'>{product.prices[indexOfCurrency].currency.symbol}{product.prices[indexOfCurrency].amount}</p>
                                </div>
                            </div>
                        )
                    } else {
                        return (
                            <div className="product-card" key={product.name}>
                                <img src={product.gallery[0]} alt={product.name} className='product-img'></img>
                                <div className="product-info">
                                    <p className='product-name'>{product.name}</p>
                                    <p className='product-price'>{product.prices[indexOfCurrency].currency.symbol}{product.prices[indexOfCurrency].amount}</p>
                                </div>
                            </div>
                        )
                    }
                } else return []
            })
            return productCards
        }
    }
    render() {
        return (
            <div className="products">
                {this.populateCards(this.props.pickedCategory)}
            </div>
        )
    }

}


export { Category, Products }