import React, { Component } from 'react';
import './Pdp.css';
import { client, Query } from '@tilework/opus'

const endpointUrl = 'http://localhost:4000/'
client.setEndpoint(endpointUrl)

class Pdp extends Component {
    constructor(props) {
        super(props)

        this.state = {
            mainImg: null,
            pickedAttributes: []
        }

        this.getMainPhotoUrl = this.getMainPhotoUrl.bind(this)
        this.addToCart = this.addToCart.bind(this)
        this.addAttributeToState = this.addAttributeToState.bind(this)
        this.removeActiveClass = this.removeActiveClass.bind(this)
    }

    componentDidMount() {
        this.getPickedProductData()
    }

    componentDidUpdate() {
        this.displayDescription()
    }

    async getPickedProductData() {
        const productQuery = new Query(`product(id:"${this.props.pickedProduct}"){id, name, inStock, gallery, description, category, attributes
            {id, name, type, items{displayValue,value,id}}, prices{currency{label,symbol},amount},brand}`)
        try {
            const productsData = await client.post(productQuery)
            this.setState(productsData)
        } catch (error) {
            console.log(`Unable to get data from server: ${error}`)
        }
    }

    displayGalleryList() {
        if (this.state.product?.gallery) {
            const gallery = this.state.product.gallery.map((photo) => {
                return <img key={photo} className='small-photo' src={photo} alt={`${this.state.product.name}`} onClick={this.getMainPhotoUrl}></img>
            })
            return gallery
        }
    }

    getMainPhotoUrl(e) {
        this.setState({ mainImg: e.target.src })
    }

    displayMainPhoto() {
        if (!this.state.mainImg) {
            return <img className='main-image' src={this.state.product.gallery[0]} alt={this.state.product.name}></img>
        }
        if (this.state.mainImg) {
            return <img className='main-image' src={this.state.mainImg} alt={this.state.product.name}></img>
        }
    }

    removeActiveClass(className) {
        const elements = document.querySelectorAll(className)
        elements.forEach((elem) => elem.classList.remove('active'))
    }

    displayColorAttribues(attribute) {
        const colorsToDisplay = attribute.items.map((att) => {
            if (attribute.name === 'Color') {
                return (
                    <div key={att.value} className='color-container'
                        onClick={(e) => {
                            this.removeActiveClass('.color-container')
                            e.target.parentElement.classList.add('active')
                        }}>
                        <div key={att.value} style={{ backgroundColor: att.value }} className='color-pick'
                            attributeid={attribute.id} attributevalue={att.value} onClick={this.addAttributeToState}>
                        </div>
                    </div>)
            } else {
                return null
            }
        })
        return colorsToDisplay
    }

    displayOtherAttributes(attribute) {
        const attributesToDisplay = attribute.items.map((att) => {
            if (attribute.name !== 'Color') {
                return (
                    <div key={att.value} className='attribute-value' attributeid={attribute.id}
                        attributevalue={att.value} onClick={(e) => {
                            this.addAttributeToState(e)
                            this.removeActiveClass(`[attributeid="${attribute.id}"]`)
                            e.target.classList.add('active')
                        }}>{att.value}
                    </div>)
            } else {
                return null
            }
        })
        return attributesToDisplay
    }

    displayAttibutes() {
        if (this.state.product?.attributes) {
            const attributesToDisplay = this.state.product.attributes.map((attribute) => {
                return (
                    <div key={attribute.name} className='attribute-pack'>
                        <div key={attribute.name} className='attribute-name'>{attribute.name.toUpperCase()}:</div>
                        <div key={`${attribute.name}-2`} className='attribute-values'>
                            {this.displayOtherAttributes(attribute)}
                            {this.displayColorAttribues(attribute)}
                        </div>
                    </div>
                )
            })
            return attributesToDisplay
        }
    }

    addAttributeToState(e) {
        const attributeId = e.target.attributes.attributeid.value
        const attributeValue = e.target.attributes.attributevalue.value
        const pickedAttributes = {}
        pickedAttributes[attributeId] = attributeValue
        if (this.state.pickedAttributes) {
            const isRepetedId = this.state.pickedAttributes.some((attribute) => attributeId in attribute)
            if (isRepetedId) {
                const index = this.state.pickedAttributes.findIndex((att) => att[attributeId])
                const state = JSON.parse(JSON.stringify(this.state.pickedAttributes))
                state[index] = pickedAttributes
                this.setState({ pickedAttributes: state })
            } else {
                this.setState({
                    pickedAttributes: [...this.state.pickedAttributes, pickedAttributes]
                })
            }
        } else {
            this.setState({
                pickedAttributes: [pickedAttributes]
            })
        }
    }

    displayPrice() {
        if (this.state.product?.prices) {
            const indexOfProduct = this.state.product.prices.findIndex((price) => price.currency.symbol === this.props.pickedCurrency)
            return (
                <div className='price-container'>
                    <div className='attribute-name'>PRICE:</div>
                    <div className='price-value'>{this.state.product.prices[indexOfProduct].currency.symbol}{this.state.product.prices[indexOfProduct].amount.toFixed(2)}</div>
                </div>
            )
        }
    }

    displayDescription() {
        if (this.state.product?.description) {
            const container = document.querySelector('.description-container')
            container.innerHTML = this.state.product.description
        }
    }

    addToCart() {
        if (this.state.pickedAttributes) {
            if (this.state.product.attributes.length === this.state.pickedAttributes.length) {
                this.props.addToCart(this.state.product.id, this.state.pickedAttributes)
            }
        }
    }

    displayBuyButton() {
        if (this.state.product?.inStock) {
            return (<button className='buy-button' onClick={this.addToCart}>ADD TO CART</button>)
        } else {
            return (<button className='buy-button out-of-stock'>OUT OF STOCK</button>)
        }
    }

    displayOutOfStock() {
        if (!this.state.product?.inStock) {
            return <div className='pdp-out-of-stock'>OUT OF STOCK</div>
        }
    }

    addClassName() {
        if (!this.state.product?.inStock) {
            return 'pdp-container out-of-stock'
        } else {
            return 'pdp-container'
        }
    }

    render() {
        if (this.state.product) {
            return (
                <div className={this.addClassName()}>
                    {this.displayOutOfStock()}
                    <div className="small-images">{this.displayGalleryList()}</div>
                    <div className='main-image-container'>{this.displayMainPhoto()}</div>
                    <div className='details'>
                        <h2 className='product-title'>{this.state.product.name}</h2>
                        <h3 className='product-brand'>{this.state.product.brand}</h3>
                        {this.displayAttibutes()}
                        {this.displayPrice()}
                        {this.displayBuyButton()}
                        <div className='description-container'></div>
                    </div>
                </div>)
        }

    }
}

export { Pdp }