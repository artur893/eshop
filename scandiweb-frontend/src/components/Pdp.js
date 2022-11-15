import React, { Component } from 'react';
import './Pdp.css';

class Pdp extends Component {
    constructor(props) {
        super(props)

        this.state = null

        this.getPickedProductData = this.getPickedProductData.bind(this)
    }

    componentDidMount() {
        this.getPickedProductData()
    }

    async getPickedProductData() {
        const indexOfProduct = this.props.productsData.findIndex((product) => product.name === this.props.pickedProduct)
        await this.setState(this.props.productsData[indexOfProduct])
        console.log(this.state)
    }

    render() {
        return (
            <div className='pdp-container'>
                <div className="small-images"></div>
                <div className='main-image'></div>
                <div className='details'></div>
            </div>)
    }
}

export { Pdp }