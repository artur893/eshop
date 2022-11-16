import React, { Component } from 'react';
import './Pdp.css';

class Pdp extends Component {
    constructor(props) {
        super(props)

        this.state = { isAddedEventListener: false }

    }

    componentDidMount() {
        this.getPickedProductData()
    }

    componentDidUpdate() {
        this.getMainPhotoUrl()
    }

    async getPickedProductData() {
        const indexOfProduct = this.props.productsData.findIndex((product) => product.name === this.props.pickedProduct)
        await this.setState(this.props.productsData[indexOfProduct])
    }

    displayGalleryList() {
        if (this.state.gallery) {
            const gallery = this.state.gallery.map((photo) => <img key={photo} className='small-photo' src={photo} alt={`${this.state.name}`}></img>)
            return gallery
        }

    }

    displayMainPhoto() {
        if (!this.state.mainImg) {
            const indexOfProduct = this.props.productsData.findIndex((product) => product.name === this.props.pickedProduct)
            return <img className='main-image' src={this.props.productsData[indexOfProduct].gallery[0]} alt={this.state.name}></img>
        }
        if (this.state.mainImg) {
            console.log(this.state)
            return <img className='main-image' src={this.state.mainImg} alt={this.state.name}></img>
        }
    }

    displayAttibutes() {
        if (this.state.attributes) {
            const attributesToDisplay = this.state.attributes.map((attribute) => {
                return (
                    <div key={attribute.name} className='attribute-pack'>
                        <div key={attribute.name} className='attribute-name'>{attribute.name.toUpperCase()}:</div>
                        <div key={`${attribute.name}-2`} className='attribute-values'>
                            {attribute.items.map((att) => {
                                if (attribute.name === 'Color') {
                                    return <div key={att.value} className="color-container"><div key={att.value} style={{ backgroundColor: att.value }} className='color-pick'></div></div>
                                } else {
                                    return <div key={att.value} className='attribute-value'>{att.value}</div>
                                }
                            })
                            }
                        </div>
                    </div>
                )
            })
            return attributesToDisplay
        }
    }

    getMainPhotoUrl() {
        if (!this.state.isAddedEventListener) {
            const photosContainer = document.querySelector('.small-images')
            const photos = photosContainer.querySelectorAll('.small-photo')
            photos.forEach((photo) => {
                photo.addEventListener('click', (e) => {
                    this.setState({ mainImg: e.target.src })
                })
            })
            this.setState({ isAddedEventListener: true })
        }
    }

    render() {
        if (this.state !== null) {
            return (
                <div className='pdp-container'>
                    <div className="small-images">{this.displayGalleryList()}</div>
                    <div className='main-image-container'>{this.displayMainPhoto()}</div>
                    <div className='details'>
                        <h2 className='product-title'>{this.state.name}</h2>
                        <h3 className='product-brand'>{this.state.brand}</h3>
                        {this.displayAttibutes()}
                    </div>
                </div>)
        }

    }
}

export { Pdp }