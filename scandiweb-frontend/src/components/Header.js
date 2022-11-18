import React, { Component } from 'react';
import './Header.css';
import GithubLogo from '../images/GitHub-Mark-32px.png'
import dropdownImg from '../images/dropdown.svg'
import arrowUpImg from '../images/arrowup.svg'
import cartImg from '../images/cart2.svg'
import { client, Query } from '@tilework/opus'

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

        this.state = { cart: [] }
    }

    componentDidUpdate(prevProps) {
        if (prevProps.sendToCart !== this.props.sendToCart) {
            const cart = this.state.cart
            cart.push(this.props.sendToCart)
            this.setState(cart)
        }
    }

    displayCartLength() {
        if (this.state.cart.length > 0) {
            return <div className='number-products-cart'>{this.state.cart.length}</div>
        }
    }

    render() {
        return <div className='cart-container'><img src={cartImg} alt='cart button'></img>{this.displayCartLength()}</div>
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
                    <Cart productsData={this.props.productsData} sendToCart={this.props.sendToCart} />
                    <DropdownMenu currencies={this.state} changeCurrency={this.props.changeCurrency} />
                </div>
            </header>
        )
    }
}

export { Header }