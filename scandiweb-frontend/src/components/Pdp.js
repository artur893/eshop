import React, { Component } from 'react';
import './Pdp.css';

class Pdp extends Component {
    constructor(props) {
        super(props)

        this.state = { mainImg: null }

        this.getMainPhotoUrl = this.getMainPhotoUrl.bind(this)
    }

    componentDidMount() {
        this.getPickedProductData()
    }

    async getPickedProductData() {
        const indexOfProduct = this.props.productsData.findIndex((product) => product.name === this.props.pickedProduct)
        await this.setState(this.props.productsData[indexOfProduct])
    }

    displayGalleryList() {
        if (this.state.gallery) {
            const gallery = this.state.gallery.map((photo) => <img key={photo} className='small-photo' src={photo} alt={`${this.state.name}`} onClick={this.getMainPhotoUrl}></img>)
            return gallery
        }
    }

    getMainPhotoUrl(e) {
        this.setState({ mainImg: e.target.src })
    }

    displayMainPhoto() {
        if (!this.state.mainImg) {
            const indexOfProduct = this.props.productsData.findIndex((product) => product.name === this.props.pickedProduct)
            return <img className='main-image' src={this.props.productsData[indexOfProduct].gallery[0]} alt={this.state.name}></img>
        }
        if (this.state.mainImg) {
            return <img className='main-image' src={this.state.mainImg} alt={this.state.name}></img>
        }
    }

    displayAttibutes() {
        if (this.state.attributes) {
            const attributesToDisplay = this.state.attributes.map((attribute) => {
                return (
                    <div key={attribute.name} className='attribute-pack'>
                        <div key={attribute.name} className='attribute-name'>{attribute.name.toUpperCase()}:</div>
                        <div key={`${attribute.name}-2`} className='attribute-values'>
                            {attribute.items.map((att) => {
                                if (attribute.name === 'Color') {
                                    return (
                                        <div key={att.value} className="color-container">
                                            <div key={att.value} style={{ backgroundColor: att.value }} className='color-pick'></div>
                                        </div>)
                                } else {
                                    return <div key={att.value} className='attribute-value'>{att.value}</div>
                                }
                            })
                            }
                        </div>
                    </div>
                )
            })
            return attributesToDisplay
        }
    }

    displayPrice() {
        if (this.state.prices) {
            const indexOfProduct = this.state.prices.findIndex((price) => price.currency.symbol === this.props.pickedCurrency)
            return (
                <div className='price-container'>
                    <div className='attribute-name'>PRICE:</div>
                    <div className='price-value'>{this.state.prices[indexOfProduct].currency.symbol}{this.state.prices[indexOfProduct].amount}</div>
                </div>
            )
        }
    }

    displayDescription() {
        if (this.state.description) {
            const container = document.querySelector('.description-container')
            container.innerHTML = this.state.description
        }
    }

    render() {
        if (this.state !== null) {
            return (
                <div className='pdp-container'>
                    <div className="small-images">{this.displayGalleryList()}</div>
                    <div className='main-image-container'>{this.displayMainPhoto()}</div>
                    <div className='details'>
                        <h2 className='product-title'>{this.state.name}</h2>
                        <h3 className='product-brand'>{this.state.brand}</h3>
                        {this.displayAttibutes()}
                        {this.displayPrice()}
                        <button className='buy-button'>ADD TO CART</button>
                        <div className='description-container'>{this.displayDescription()}</div>
                    </div>
                </div>)
        }

    }
}

export { Pdp }