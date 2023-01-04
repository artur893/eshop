import React, { Component } from 'react';
import './Pdp.css';

class Pdp extends Component {
    constructor(props) {
        super(props)

        this.state = { mainImg: null }

        this.getMainPhotoUrl = this.getMainPhotoUrl.bind(this)
        this.addToCart = this.addToCart.bind(this)
        this.addAttributeToState = this.addAttributeToState.bind(this)
        this.removeActiveClass = this.removeActiveClass.bind(this)
    }

    componentDidMount() {
        this.getPickedProductData()
    }

    getPickedProductData() {
        const indexOfProduct = this.props.productsData.findIndex((product) => product.name === this.props.pickedProduct)
        this.setState(this.props.productsData[indexOfProduct])
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
        if (this.state.attributes) {
            const attributesToDisplay = this.state.attributes.map((attribute) => {
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
        if (this.state.prices) {
            const indexOfProduct = this.state.prices.findIndex((price) => price.currency.symbol === this.props.pickedCurrency)
            return (
                <div className='price-container'>
                    <div className='attribute-name'>PRICE:</div>
                    <div className='price-value'>{this.state.prices[indexOfProduct].currency.symbol}{this.state.prices[indexOfProduct].amount.toFixed(2)}</div>
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

    addToCart() {
        if (this.state.pickedAttributes) {
            if (this.state.attributes.length === this.state.pickedAttributes.length) {
                this.props.addToCart(this.state.id, this.state.pickedAttributes)
            }
        }
    }

    displayBuyButton() {
        if (this.state.inStock) {
            return (<button className='buy-button' onClick={this.addToCart}>ADD TO CART</button>)
        } else {
            return (<button className='buy-button out-of-stock'>OUT OF STOCK</button>)
        }
    }

    displayOutOfStock() {
        if (!this.state.inStock) {
            return <div className='pdp-out-of-stock'>OUT OF STOCK</div>
        }
    }

    addClassName() {
        if (!this.state.inStock) {
            return 'pdp-container out-of-stock'
        } else {
            return 'pdp-container'
        }
    }

    render() {
        if (this.state !== null) {
            return (
                <div className={this.addClassName()}>
                    {this.displayOutOfStock()}
                    <div className="small-images">{this.displayGalleryList()}</div>
                    <div className='main-image-container'>{this.displayMainPhoto()}</div>
                    <div className='details'>
                        <h2 className='product-title'>{this.state.name}</h2>
                        <h3 className='product-brand'>{this.state.brand}</h3>
                        {this.displayAttibutes()}
                        {this.displayPrice()}
                        {this.displayBuyButton()}
                        <div className='description-container'>{this.displayDescription()}</div>
                    </div>
                </div>)
        }

    }
}

export { Pdp }