import React, { Component } from 'react';
import './Pdp.css';

class Pdp extends Component {
    constructor(props) {
        super(props)

        this.state = { isAddedEventListener: false }

        this.getPickedProductData = this.getPickedProductData.bind(this)
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
            console.log(this.props)
            return <img className='main-image' src={this.props.productsData[indexOfProduct].gallery[0]} alt={this.state.name}></img>
        }
        if (this.state.mainImg) {
            return <img className='main-image' src={this.state.mainImg} alt={this.state.name}></img>
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
            console.log('GET')
        }
    }

    render() {
        if (this.state !== null) {
            return (
                <div className='pdp-container'>
                    <div className="small-images">{this.displayGalleryList()}</div>
                    <div className='main-image-container'>{this.displayMainPhoto()}</div>
                    <div className='details'>{this.state.name}</div>
                </div>)
        }

    }
}

export { Pdp }