import { Component } from 'react';
import './Bagview.css';
import { v4 as uuid } from 'uuid';

class Bagview extends Component {
    render() {
        return (
            <>
                <div className='bagview-title'>CART</div>
                <ProductCard cart={this.props.cart} pickedCurrency={this.props.pickedCurrency} cartComponent={this.props.cartComponent} />
                <Summary cart={this.props.cart} pickedCurrency={this.props.pickedCurrency} />
            </>)
    }
}

class ProductCard extends Component {
    constructor(props) {
        super(props)

        this.state = { products: null }
    }

    componentDidMount() {
        this.getPhotosData()
        this.loadImages()
    }

    componentDidUpdate(prevProps) {
        if (prevProps.cart.length !== this.props.cart.length) {
            this.updatePhotosData(prevProps)
        }
        this.markPickedAttributes()
    }

    markPickedAttributes() {
        if (this.props.cart) {
            for (let i = 0; i < this.props.cart.length; i++) {
                if (this.props.cart[i].pickedAttributes) {
                    this.props.cart[i].pickedAttributes.forEach((att) => {
                        const key = Object.keys(att)
                        const value = Object.values(att)
                        const productCard = document.querySelectorAll('.bagview-product-card')
                        const attributeContainer = productCard[i].querySelectorAll(`[attributeid="${key}"]`)
                        attributeContainer.forEach((container) => {
                            if (container.getAttribute('attributevalue') === value[0]) {
                                container.classList.add('actived')
                            }
                        })
                    })
                }
            }
        }
    }

    displayName(product) {
        return <div key={uuid()} className='bagview-name'>{product.name}</div>
    }

    displayBrand(product) {
        return <div key={uuid()} className='bagview-brand'>{product.brand}</div>
    }

    displayPrice(product) {
        const indexOfPrice = product.prices.findIndex((price) => price.currency.symbol === this.props.pickedCurrency)
        return <div key={uuid()} className='bagview-price'>{product.prices[indexOfPrice].currency.symbol}{product.prices[indexOfPrice].amount}</div>
    }

    displayAttributes(product, index) {
        const attributesToDisplay = product.attributes.map((attribute) => {
            return (
                <div key={attribute.name} className='bagview-attribute-pack'>
                    <div key={attribute.name} className='bagview-attribute-name'>{attribute.name}:</div>
                    <div key={`${attribute.name}-2`} className='cart-details-attribute-values'>
                        {attribute.items.map((att) => {
                            if (attribute.name === 'Color') {
                                return (
                                    <div key={att.value} className='bagview-color-container' onClick={(e) => this.props.cartComponent.current.changeAttribute(e)}
                                        attributeid={attribute.id} attributevalue={att.value} index={index}>
                                        <div key={att.value} style={{ backgroundColor: att.value }} className='bagview-color-pick'>
                                        </div>
                                    </div>)
                            } else {
                                return (
                                    <div key={att.value} className='bagview-attribute-value' onClick={(e) => this.props.cartComponent.current.changeAttribute(e)}
                                        attributeid={attribute.id} index={index}
                                        attributevalue={att.value}>{att.value.substring(0, 4)}
                                    </div>)
                            }
                        })
                        }
                    </div>
                </div>
            )
        })
        return attributesToDisplay
    }

    nextPhoto(index) {
        let pickedIndex = this.state.products[index].pickedPhoto
        if (this.state.products[index].photosLimit > this.state.products[index].pickedPhoto) {
            pickedIndex = pickedIndex + 1
            let state = JSON.parse(JSON.stringify(this.state.products))
            state[index]['pickedPhoto'] = pickedIndex
            this.setState({ products: state })
        }
    }

    previousPhoto(index) {
        let pickedIndex = this.state.products[index].pickedPhoto
        if (this.state.products[index].pickedPhoto > 0) {
            pickedIndex = pickedIndex - 1
            let state = JSON.parse(JSON.stringify(this.state.products))
            state[index]['pickedPhoto'] = pickedIndex
            this.setState({ products: state })
        }
    }

    displayArrows(product, index) {
        if (product.gallery.length > 1) {
            return (
                <>
                    <div className='bagview-arrow' id='left-arrow' index={index} onClick={() => this.previousPhoto(index)}>{'<'}</div>
                    <div className='bagview-arrow' id='right-arrow' index={index} onClick={() => this.nextPhoto(index)}>{'>'}</div>
                </>
            )
        }
    }

    displayPhoto(product, index) {
        if (this.state.products) {
            return (
                <div className='bagview-photo'>
                    {this.displayArrows(product, index)}
                    {this.loadImages(product, index)}
                </div>
            )
        } else {
            <div className='bagview-photo'>
                {this.displayArrows(product, index)}
                <img src={product.gallery[0]} alt={product.name}></img>
            </div>
        }

    }

    loadImages(product, index) {
        const gallery = []
        if (this.state.products && this.props.cart) {
            this.props.cart[index].gallery.forEach((photo) => {
                const img = new Image(300)
                img.src = photo
                gallery.push(img)
            })
            return <img src={gallery[this.state.products[index].pickedPhoto].src} alt={product.name}></img>
        }
    }

    getPhotosData() {
        if (this.props.cart) {
            const products = []
            this.props.cart.forEach((product) => {
                products.push({
                    id: product.id,
                    pickedPhoto: 0,
                    photosLimit: product.gallery.length - 1
                })
            })
            this.setState({ products: products })
        }
    }

    updatePhotosData(prevProps) {
        const missingProduct = prevProps.cart.filter(product => !JSON.stringify(this.props.cart).includes(JSON.stringify(product)));
        const indexOfMissing = prevProps.cart.findIndex(product => JSON.stringify(product) === JSON.stringify(missingProduct[0]))
        const state = JSON.parse(JSON.stringify(this.state.products))
        state.splice(indexOfMissing, 1)
        this.setState({ products: state })
    }

    displayCards() {
        if (this.props.cart) {
            let index = -1
            const productCards = this.props.cart.map((product) => {
                index = index + 1
                return (
                    <div className='bagview-product-card' key={uuid()}>
                        <div className='bagview-left' key={uuid()}>
                            {this.displayName(product)}
                            {this.displayBrand(product)}
                            {this.displayPrice(product)}
                            {this.displayAttributes(product, index)}
                        </div>
                        <div className='bagview-right' key={uuid()}>
                            <div className='bagview-quantity'>
                                <div className='bagview-count' index={index} onClick={(e) => this.props.cartComponent.current.plusProductQuantity(e)}>+</div>
                                <div className='bagview-number'>{product.quantity}</div>
                                <div className='bagview-count' index={index} onClick={(e) => this.props.cartComponent.current.minusProductQuantity(e)} id='bagview-minus-btn'>-</div>
                            </div>
                            {this.displayPhoto(product, index)}
                        </div>
                    </div>
                )
            })
            return productCards
        }
    }

    render() {
        return <div className='bagview-cards'>{this.displayCards()}</div>
    }
}

class Summary extends Component {
    displayTotalPrice() {
        let totalPrice = 0
        this.props.cart.forEach((product) => {
            const indexOfPrice = product.prices.findIndex((price) => price.currency.symbol === this.props.pickedCurrency)
            totalPrice = totalPrice + (product.prices[indexOfPrice].amount * product.quantity)
        })
        return totalPrice.toFixed(2)
    }

    displayTotalQuantity() {
        let totalQuantity = 0
        this.props.cart.forEach((product) => {
            totalQuantity = totalQuantity + product.quantity
        })
        return totalQuantity
    }

    displayTaxValue() {
        const totalPrice = this.displayTotalPrice()
        const tax = totalPrice * 0.21
        return tax.toFixed(2)
    }

    render() {
        if (this.props.cart.length > 0) {
            return (
                <>
                    <div className='summary-pack'>
                        <div className='summary-tax-text'>Tax 21%:</div>
                        <div className='summary-tax-value'>{this.props.pickedCurrency}{this.displayTaxValue()}</div>
                    </div>
                    <div className='summary-pack'>
                        <div className='summary-quantity-text'>Quantity:</div>
                        <div className='summary-quantity-value'>{this.displayTotalQuantity()}</div>
                    </div>
                    <div className='summary-pack'>
                        <div className='summary-price-text'>Total:</div>
                        <div className='summary-price-value'>{this.props.pickedCurrency}{this.displayTotalPrice()}</div>
                    </div>
                    <button className='summary-order-btn' onClick={() => alert('Thank you for testing :)')}>ORDER</button>
                </>
            )
        }
    }
}

export { Bagview }