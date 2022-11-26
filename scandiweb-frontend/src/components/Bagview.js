import { Component } from 'react';
import './Bagview.css';
import { v4 as uuid } from 'uuid';

class Bagview extends Component {
    render() {
        return (
            <>
                <div className='bagview-title'>CART</div>
                <ProductCard cart={this.props.cart} pickedCurrency={this.props.pickedCurrency} />
            </>)
    }
}

class ProductCard extends Component {

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
                                    <div key={att.value} className='bagview-color-container'
                                        attributeid={attribute.id} attributevalue={att.value} index={index} onClick={(e) => {
                                            this.saveScrollValue()
                                            this.props.changeAttribute(e)
                                        }}>
                                        <div key={att.value} style={{ backgroundColor: att.value }} className='bagview-color-pick'>
                                        </div>
                                    </div>)
                            } else {
                                return (
                                    <div key={att.value} className='bagview-attribute-value'
                                        attributeid={attribute.id} index={index} onClick={(e) => {
                                            this.saveScrollValue()
                                            this.props.changeAttribute(e)
                                        }}
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

    displayPhoto(product) {
        console.log(product)
        return (
            <div className='bagview-photo'><img src={product.gallery[0]} alt={product.name}></img></div>
        )
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
                                <div className='bagview-count' index={index}>+</div>
                                <div className='bagview-number'>{product.quantity}</div>
                                <div className='bagview-count' index={index}>-</div>
                            </div>
                            {this.displayPhoto(product)}
                        </div>
                    </div>
                )
            })
            return productCards
        }
    }

    // displayProductCards() {
    //     if (this.props.cartDetails) {
    //         let index = -1
    //         const cardsToDisplay = this.props.cartDetails.map((product) => {
    //             index = index + 1
    //             return (
    //                 <div key={uuid()} className='cart-details-card'>
    //                     <div className='cart-details-left'>
    //                         {this.displayName(product)}
    //                         {this.displayBrand(product)}
    //                         {this.displayPrice(product)}
    //                         {this.displayAttributes(product, index)}
    //                     </div>
    //                     <div className='cart-details-quantity'>
    //                         <div className='cart-details-count' index={index} onClick={(e) => {
    //                             this.saveScrollValue()
    //                             this.props.plusProductQuantity(e)
    //                         }}>+</div>
    //                         <div className='cart-details-number'>{product.quantity}</div>
    //                         <div className='cart-details-count' index={index} onClick={(e) => {
    //                             this.saveScrollValue()
    //                             this.props.minusProductQuantity(e)
    //                         }}>-</div>
    //                     </div>
    //                     {this.displayPhoto(product)}
    //                 </div>
    //             )
    //         })
    //         return cardsToDisplay
    //     }
    // }

    render() {
        return <div className='bagview-cards'>{this.displayCards()}</div>
    }
}

class Summary extends Component {

}

export { Bagview }