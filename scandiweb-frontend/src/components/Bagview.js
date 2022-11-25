import { Component } from 'react';
import './Bagview.css';

class Bagview extends Component {
    render() {
        return (
            <>
                <div className='bagview-title'>CART</div>
                <ProductCard cart={this.props.cart}/>
            </>)
    }
}

class ProductCard extends Component {

    
    displayCards() {
        if (this.props.cart) {
            const productCards = this.props.cart.map((product) => {
                return <div>{product.name}</div>
            })
            return productCards
        }
    }

    render() {
        return <>{this.displayCards()}</>
    }
}

class Summary extends Component {

}

export { Bagview }