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

    displayGalleryList() {
        const gallery = this.state.gallery.map((photo) => <img className='small-photo' src={photo} alt={`${this.state.name}`}></img>)
        return gallery
    }

    render() {
        if (this.state !== null) {
            return (
                <div className='pdp-container'>
                    <div className="small-images">{this.displayGalleryList()}</div>
                    <div className='main-image'></div>
                    <div className='details'>{this.state.name}</div>
                </div>)
        }

    }
}

export { Pdp }