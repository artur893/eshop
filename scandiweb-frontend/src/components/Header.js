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
    categoryValues
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
        this.dataToDisplay = this.categoryValues.map((x) => {
            return <li key={x} className={'menu-element'} onClick={this.pickCategory}>{x.toUpperCase()}</li>
        })
    }

    formatCategoryData() {
        this.categoryValues = this.filterDuplicates(Object.values(this.categoryDataRaw).map((x) => x.category))
    }

    pickCategory(e) {
        const menuElements = document.querySelectorAll('.menu-element')
        menuElements.forEach((element) => element.classList.remove('active'))
        e.target.classList.add('active')
        this.props.changeCategory(e.target.textContent)
        this.props.hideProducts(false)
        this.props.changeBagViewActive(false)
    }

    async componentDidMount() {
        await this.getCategoriesData()
        this.formatCategoryData()
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
        this.plusProductQuantity = this.plusProductQuantity.bind(this)
        this.minusProductQuantity = this.minusProductQuantity.bind(this)
        this.changeAttribute = this.changeAttribute.bind(this)
        this.closeCartDetails = this.closeCartDetails.bind(this)
    }

    componentDidUpdate(prevProps, prevState) {
        if (prevProps.sendToCart !== this.props.sendToCart) {
            this.addToCart()
        }
        if (JSON.stringify(this.state.cart) !== JSON.stringify(prevState.cart)) {
            this.props.sendCartData(this.state.cart)
        }
    }

    showCartDetails() {
        this.state.isDropped ? this.setState({ isDropped: false }) : this.setState({ isDropped: true })
    }

    closeCartDetails() {
        this.setState({ isDropped: false })
    }

    addToCart() {
        const product = this.findProduct()
        product['pickedAttributes'] = this.props.sendToCart.attributesToCart
        product['quantity'] = 1
        product['index'] = uuid()
        const cart = JSON.parse(JSON.stringify(this.state.cart))
        if (this.state.cart.length === 0) {
            cart.push(product)
            this.setState({ cart: cart })
        } else {
            let isDuplicate = false
            for (let i = 0; i < cart.length; i++) {
                if (cart[i].id === product.id && JSON.stringify(cart[i].pickedAttributes) === JSON.stringify(product.pickedAttributes)) {
                    cart[i].quantity = cart[i].quantity + 1
                    this.setState({ cart: cart })
                    isDuplicate = true
                }
            } if (!isDuplicate) {
                cart.push(product)
                this.setState({ cart: cart })
            }
        }
    }

    findProduct() {
        const productToCart = JSON.parse(JSON.stringify(this.props.productsData.find(product => product.id === this.props.sendToCart.id)))
        return productToCart
    }

    displayTotalQuantity() {
        if (this.state.cart.length > 0) {
            let totalQuantity = 0
            this.state.cart.forEach(product => totalQuantity = totalQuantity + product.quantity)
            return <div className='number-products-cart'>{totalQuantity}</div>
        }
    }

    plusProductQuantity(e) {
        const index = e.target.getAttribute('index')
        const cart = JSON.parse(JSON.stringify(this.state.cart))
        cart[index].quantity += 1
        this.setState({ cart })
    }

    minusProductQuantity(e) {
        const index = e.target.getAttribute('index')
        const cart = JSON.parse(JSON.stringify(this.state.cart))
        cart[index].quantity -= 1
        if (cart[index].quantity === 0) {
            cart.splice(index, 1)
        }
        this.setState({ cart })
    }

    changeAttribute(e) {
        const index = e.target.getAttribute('index')
        const attributeId = e.target.getAttribute('attributeid')
        const value = e.target.getAttribute('attributevalue')
        const cart = JSON.parse(JSON.stringify(this.state.cart))
        const pickedAttributes = {}
        pickedAttributes[attributeId] = value
        if (this.state.cart[index].pickedAttributes) {
            const isRepetedId = this.state.cart[index].pickedAttributes.some((attribute) => attributeId in attribute)
            if (isRepetedId) {
                const indexAtt = this.state.cart[index].pickedAttributes.findIndex((att) => att[attributeId])
                cart[index].pickedAttributes[indexAtt] = pickedAttributes
                this.setState({ cart })
            } else {
                cart[index].pickedAttributes = [...cart[index].pickedAttributes, pickedAttributes]
                this.setState({ cart })
            }
        } else {
            cart[index].pickedAttributes = [pickedAttributes]
            this.setState({ cart })
        }
    }

    displayOverlay() {
        const body = document.querySelector('body')
        if (this.state.isDropped) {
            body.classList.add('noscroll')
            return (<div className='overlay'></div>)
        } else {
            body.classList.remove('noscroll')
        }
    }

    render() {
        return (
            <div className='cart-container'>
                <CartDetails isDropped={this.state.isDropped} minusProductQuantity={this.minusProductQuantity} changeBagViewActive={this.props.changeBagViewActive}
                    cartDetails={this.state.cart} pickedCurrency={this.props.pickedCurrency} hideProducts={this.props.hideProducts} closeCartDetails={this.closeCartDetails}
                    plusProductQuantity={this.plusProductQuantity} changeAttribute={this.changeAttribute} sendCartData={this.props.sendCartData} />
                <img src={cartImg} alt='cart button' onClick={this.showCartDetails}></img>{this.displayTotalQuantity()}
                {this.displayOverlay()}
            </div>)
    }
}

class CartDetails extends Component {
    constructor(props) {
        super(props)

        this.state = { scrollValue: 0 }
    }

    componentDidUpdate() {
        this.markPickedAttributes()
        this.returnToScrollValue()
    }

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

    displayAttributes(product, index) {
        const attributesToDisplay = product.attributes.map((attribute) => {
            return (
                <div key={attribute.name} className='cart-details-attribute-pack'>
                    <div key={attribute.name} className='cart-details-attribute-name'>{attribute.name}:</div>
                    <div key={`${attribute.name}-2`} className='cart-details-attribute-values'>
                        {attribute.items.map((att) => {
                            if (attribute.name === 'Color') {
                                return (
                                    <div key={att.value} className='cart-details-color-container'
                                        attributeid={attribute.id} attributevalue={att.value} index={index} onClick={(e) => {
                                            this.saveScrollValue()
                                            this.props.changeAttribute(e)
                                        }}>
                                        <div key={att.value} style={{ backgroundColor: att.value }} className='cart-details-color-pick'>
                                        </div>
                                    </div>)
                            } else {
                                return (
                                    <div key={att.value} className='cart-details-attribute-value'
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
        return (
            <div className='cart-details-photo'><img src={product.gallery[0]} alt={product.name}></img></div>
        )
    }

    markPickedAttributes() {
        const cartDetailsElement = document.querySelector('.cart-details')
        if (cartDetailsElement) {
            for (let i = 0; i < this.props.cartDetails.length; i++) {
                if (this.props.cartDetails[i].pickedAttributes) {
                    this.props.cartDetails[i].pickedAttributes.forEach((att) => {
                        const key = Object.keys(att)
                        const value = Object.values(att)
                        const productCard = cartDetailsElement.querySelectorAll('.cart-details-card')
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


    displayProductCards() {
        if (this.props.cartDetails) {
            let index = -1
            const cardsToDisplay = this.props.cartDetails.map((product) => {
                index = index + 1
                return (
                    <div key={uuid()} className='cart-details-card'>
                        <div className='cart-details-left'>
                            {this.displayName(product)}
                            {this.displayBrand(product)}
                            {this.displayPrice(product)}
                            {this.displayAttributes(product, index)}
                        </div>
                        <div className='cart-details-quantity'>
                            <div className='cart-details-count' index={index} onClick={(e) => {
                                this.saveScrollValue()
                                this.props.plusProductQuantity(e)
                            }}>+</div>
                            <div className='cart-details-number'>{product.quantity}</div>
                            <div className='cart-details-count' index={index} onClick={(e) => {
                                this.saveScrollValue()
                                this.props.minusProductQuantity(e)
                            }}>-</div>
                        </div>
                        {this.displayPhoto(product)}
                    </div>
                )
            })
            return cardsToDisplay
        }
    }

    saveScrollValue() {
        const cartDetails = document.querySelector('.cart-details')
        const scrollValue = cartDetails.scrollTop
        this.setState({ scrollValue: scrollValue })
    }

    returnToScrollValue() {
        if (this.props.isDropped) {
            const cartDetails = document.querySelector('.cart-details')
            cartDetails.scrollTo(0, this.state.scrollValue)
        }
    }

    totalQuantity() {
        let quantity = 0
        if (this.props.cartDetails.length > 0) {
            this.props.cartDetails.forEach(product => quantity = quantity + product.quantity)
        } return quantity
    }

    displayCartDetails() {
        if (this.props.isDropped) {
            return (
                <div key={uuid()} className='cart-details'>
                    <div key={uuid()} className='cart-details-title'>My Bag<span className='cart-details-span'>, {this.totalQuantity()} items</span></div>
                    <div className='cart-details-attributes'>{this.displayProductCards()}</div>
                    {this.displaySummary()}
                </div>)
        }
    }

    displaySummary() {
        if (this.props.cartDetails.length > 0) {
            const indexOfPrice = this.props.cartDetails[0].prices.findIndex((price) => price.currency.symbol === this.props.pickedCurrency)
            let totalPrice = 0
            this.props.cartDetails.forEach((product) => {
                totalPrice = totalPrice + (product.prices[indexOfPrice].amount * product.quantity)
            })
            return (
                <div className='cart-details-summary'>
                    <div className='cart-details-price'>
                        <span className='cart-details-total'>Total</span>
                        <span className='cart-details-totalprice'>{this.props.pickedCurrency}{totalPrice.toFixed(2)}</span>
                    </div>
                    <div className='cart-details-buttons'>
                        <button className='cart-details-viewbag' onClick={() => {
                            this.props.hideProducts(false)
                            this.props.changeBagViewActive(true)
                            this.props.closeCartDetails()
                        }}>VIEW BAG</button>
                        <button className='cart-details-checkout' onClick={() => alert('Thank you for testing :)')}>CHECK OUT</button>
                    </div>
                </div>
            )
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
        this.cartComponent = React.createRef();
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
                <Menu changeCategory={this.props.changeCategory} hideProducts={this.props.hideProducts} changeBagViewActive={this.props.setBagviewActive} />
                <Logo />
                <div className='rightside-header'>
                    <Currency pickedCurrency={this.props.pickedCurrency} />
                    <Cart productsData={this.props.productsData} sendToCart={this.props.sendToCart} hideProducts={this.props.hideProducts} ref={this.cartComponent}
                        pickedCurrency={this.props.pickedCurrency} changeBagViewActive={this.props.setBagviewActive} sendCartData={this.props.sendCartData} />
                    <DropdownMenu currencies={this.state} changeCurrency={this.props.changeCurrency} />
                </div>
            </header>
        )
    }
}

export { Header }