import React, { Component } from 'react';
import './Header.css';
import GithubLogo from '../images/GitHub-Mark-32px.png'
import dropdownImg from '../images/dropdown.svg'
import arrowUpImg from '../images/arrowup.svg'
import cartImg from '../images/cart2.svg'
import { client, Query } from '@tilework/opus'
import { v4 as uuid } from 'uuid';

const endpointUrl = 'http://localhost:4000/'
client.setEndpoint(endpointUrl)

class Menu extends Component {
    constructor(props) {
        super(props)

        this.state = {}
        this.pickCategory = this.pickCategory.bind(this)
    }

    categoryDataRaw
    categoryDataArr
    filteredDataCategory
    dataToDisplay

    async getCategoriesData() {
        const categoryQuery = new Query('category{products{category}}')
        try {
            const categoryData = await client.post(categoryQuery)
            this.categoryDataRaw = categoryData.category.products
        } catch (error) {
            console.log(`Unable to get data from server: ${error}`)
        }
    }

    filterDuplicates(data) {
        return data.filter((value, index) => data.indexOf(value) === index)
    }

    displayCategories() {
        this.dataToDisplay = this.filteredDataCategory.map((x) => {
            return <li key={x} className={'menu-element'} onClick={this.pickCategory}>{x.toUpperCase()}</li>
        })
    }

    formatCategoryData() {
        this.categoryDataArr = Object.values(this.categoryDataRaw).map((x) => x.category)
    }

    pickCategory(e) {
        const menuElements = document.querySelectorAll('.menu-element')
        menuElements.forEach((element) => element.classList.remove('active'))
        e.target.classList.add('active')
        this.props.changeCategory(e.target.textContent)
        this.props.hideProducts(false)
    }

    async componentDidMount() {
        await this.getCategoriesData()
        this.formatCategoryData()
        this.filteredDataCategory = this.filterDuplicates(this.categoryDataArr)
        this.displayCategories()
    }

    render() {
        return (
            <ul className='menu'>
                {this.dataToDisplay}
            </ul>
        )
    }
}

class Logo extends Component {

    render() {
        return <a href="https://github.com/artur893" className='git-logo'><img src={GithubLogo} alt='github logo'></img></a>
    }
}

class Currency extends Component {
    constructor(props) {
        super(props)

        this.state = {
            isDropped: false,
        }

        this.dropMenu = this.dropMenu.bind(this)
    }

    dropMenu() {
        const dropdownMenuElement = document.querySelector('.dropdown-menu')
        dropdownMenuElement.classList.toggle('active')
        this.state.isDropped === false ? this.setState({ isDropped: true }) : this.setState({ isDropped: false })
    }

    changeDropArrow() {
        if (this.state.isDropped === false) {
            return dropdownImg
        } else {
            return arrowUpImg
        }
    }

    render() {
        return (
            <div className='currency-field'>
                <div onClick={this.dropMenu}>{this.props.pickedCurrency}</div>
                <img src={this.changeDropArrow()} alt='dropdown button' onClick={this.dropMenu}></img>
            </div>
        )
    }
}

class DropdownMenu extends Component {
    constructor(props) {
        super(props)

        this.state = { isChangeCurrencyAdded: false }

        this.createCurrenciesToDisplay = this.createCurrenciesToDisplay.bind(this)
        this.changeCurrency = this.changeCurrency.bind(this)
    }

    currenciesToDisplay = []

    createCurrenciesToDisplay() {
        this.currenciesToDisplay = Object.values(this.props.currencies).map((x) => {
            return <li key={x.label} className={'drop-currency-field'}>{x.symbol} {x.label}</li>
        })
    }

    componentDidUpdate(prevProps) {
        if (JSON.stringify(prevProps.currencies) !== JSON.stringify(this.props.currencies)) {
            this.createCurrenciesToDisplay()
        }
    }

    changeCurrency(e) {
        this.props.changeCurrency(e.target.textContent)
    }

    render() {
        return (
            <ul className='dropdown-menu' onClick={this.changeCurrency}>
                {this.currenciesToDisplay}
            </ul>
        )
    }
}

class Cart extends Component {
    constructor(props) {
        super(props)

        this.state = {
            isDropped: false,
            cart: []
        }

        this.showCartDetails = this.showCartDetails.bind(this)
    }

    componentDidUpdate(prevProps) {
        if (prevProps.sendToCart !== this.props.sendToCart) {
            this.addToCart()
        }
    }

    showCartDetails() {
        this.state.isDropped ? this.setState({ isDropped: false }) : this.setState({ isDropped: true })
    }

    addToCart() {
        const product = this.findProduct()
        const cart = this.state.cart
        cart.push(product)
        this.setState({ cart: cart })
    }

    findProduct() {
        const productToCart = JSON.parse(JSON.stringify(this.props.productsData.find(product => product.id === this.props.sendToCart.id)))
        productToCart['pickedAttributes'] = this.props.sendToCart.attributesToCart
        return productToCart
    }

    displayCartLength() {
        if (this.state.cart.length > 0) {
            return <div className='number-products-cart'>{this.state.cart.length}</div>
        }
    }

    render() {
        return (
            <div className='cart-container'><CartDetails isDropped={this.state.isDropped}
                cartDetails={this.state.cart} pickedCurrency={this.props.pickedCurrency} />
                <img src={cartImg} alt='cart button' onClick={this.showCartDetails}></img>{this.displayCartLength()}
            </div>)
    }
}

class CartDetails extends Component {

    displayName(product) {
        return <div key={uuid()} className='cart-details-name'>{product.name}</div>
    }

    displayBrand(product) {
        return <div key={uuid()} className='cart-details-brand'>{product.brand}</div>
    }

    displayPrice(product) {
        const indexOfPrice = product.prices.findIndex((price) => price.currency.symbol === this.props.pickedCurrency)
        return <div key={uuid()} className='cart-details-price'>{product.prices[indexOfPrice].currency.symbol}{product.prices[indexOfPrice].amount}</div>
    }

    displayAttributes(product) {
        const attributesToDisplay = product.attributes.map((attribute) => {
            return (
                <div key={attribute.name} className='cart-details-attribute-pack'>
                    <div key={attribute.name} className='cart-details-attribute-name'>{attribute.name}:</div>
                    <div key={`${attribute.name}-2`} className='cart-details-attribute-values'>
                        {attribute.items.map((att) => {
                            if (attribute.name === 'Color') {
                                return (
                                    <div key={att.value} className='cart-details-color-container'>
                                        <div key={att.value} style={{ backgroundColor: att.value }} className='cart-details-color-pick'
                                            attributeid={attribute.id} attributevalue={att.value}>
                                        </div>
                                    </div>)
                            } else {
                                return (
                                    <div key={att.value} className='cart-details-attribute-value' attributeid={attribute.id}
                                        attributevalue={att.value}>{att.value}
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
        return(
            <div className='cart-details-photo'><img src={product.gallery[0]} alt={product.name}></img></div>
        )
    }


    displayProductCards() {
        if (this.props.cartDetails) {
            const cardsToDisplay = this.props.cartDetails.map((product) => {
                return (
                    <div key={uuid()} className='cart-details-card'>
                        <div className='cart-details-left'>
                            {this.displayName(product)}
                            {this.displayBrand(product)}
                            {this.displayPrice(product)}
                            {this.displayAttributes(product)}
                        </div>
                        <div className='cart-details-quantity'>
                            <div className='cart-details-count'>+</div>
                            <div className='cart-details-number'>#</div>
                            <div className='cart-details-count'>-</div>
                        </div>
                        {this.displayPhoto(product)}
                    </div>
                )
            })
            return cardsToDisplay
        }
    }

    displayCartDetails() {
        if (this.props.isDropped) {
            return (
                <div key={uuid()} className='cart-details'>
                    <div key={uuid()} className='cart-details-title'>My Bag</div>
                    <div className='cart-details-attributes'>{this.displayProductCards()}</div>
                </div>)
        }
    }

    render() {
        return (this.displayCartDetails())
    }
}

class Header extends Component {
    constructor(props) {
        super(props)
        this.state = {
            0: {
                symbol: 'USD',
                label: '$'
            }
        }
    }

    async getCurrencyData() {
        const currencyQuery = new Query('currencies{label, symbol}')
        try {
            const currencyData = await client.post(currencyQuery)
            this.setState(currencyData.currencies)
        } catch (error) {
            console.log(`Unable to get data from server: ${error}`)
        }
    }

    componentDidMount() {
        this.getCurrencyData()
    }

    componentDidUpdate(prevProps, prevState) {
        if (JSON.stringify(prevState) !== JSON.stringify(this.state)) {
            this.getCurrencyData()
        }
    }

    render() {
        return (
            <header>
                <Menu changeCategory={this.props.changeCategory} hideProducts={this.props.hideProducts} />
                <Logo />
                <div className='rightside-header'>
                    <Currency pickedCurrency={this.props.pickedCurrency} />
                    <Cart productsData={this.props.productsData} sendToCart={this.props.sendToCart} pickedCurrency={this.props.pickedCurrency} />
                    <DropdownMenu currencies={this.state} changeCurrency={this.props.changeCurrency} />
                </div>
            </header>
        )
    }
}

export { Header }