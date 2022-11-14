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

    async displayCategories() {
        this.dataToDisplay = await this.filteredDataCategory.map((x) => {
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
    }

    async componentDidMount() {
        await this.getCategoriesData()
        this.formatCategoryData()
        this.filteredDataCategory = await this.filterDuplicates(this.categoryDataArr)
        await this.displayCategories()
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
        return <img src={GithubLogo} alt='github logo'></img>
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

    pickedCurrency = '$'

    dropMenu() {
        const dropdownMenuElement = document.querySelector('.dropdown-menu')
        dropdownMenuElement.classList.toggle('active')
        this.state.isDropped === false ? this.setState({ isDropped: true }) : this.setState({ isDropped: false })
        this.pickCurrency()
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
                <div onClick={this.dropMenu}>{this.pickedCurrency}</div>
                <img src={this.changeDropArrow()} alt='dropdown button' onClick={this.dropMenu}></img>
            </div>
        )
    }
}

class DropdownMenu extends Component {
    constructor(props) {
        super(props)

        this.createCurrenciesToDisplay = this.createCurrenciesToDisplay.bind(this)
    }

    currenciesToDisplay = []

    createCurrenciesToDisplay() {
        this.currenciesToDisplay = Object.values(this.props.currencies).map((x) => {
        return <li key={x.label} className={'drop-currency-field'}>{x.symbol} {x.label}</li>})
    }

    componentDidUpdate() {
        this.createCurrenciesToDisplay()
    }

    componentDidMount() {
        this.createCurrenciesToDisplay()
    }

    render() {
        return (
            <ul className='dropdown-menu'>
                {this.currenciesToDisplay}
            </ul>
        )
    }
}

class Cart extends Component {

    render() {
        return <img src={cartImg} alt='cart button'></img>
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
            this.setState(await currencyData.currencies)
        } catch (error) {
            console.log(`Unable to get data from server: ${error}`)
        }
    }

    async componentDidMount() {
        await this.getCurrencyData()
    }

    render() {
        this.getCurrencyData()
        return (
            <header>
                <Menu changeCategory={this.props.changeCategory} />
                <Logo />
                <div className='rightside-header'>
                    <Currency currencies={this.state} />
                    <Cart />
                    <DropdownMenu currencies={this.state} />
                </div>
            </header>
        )
    }
}

export { Header }