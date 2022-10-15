import React, { Component } from 'react';
import './Products.css';

class Category extends Component {

    render() {
        return (
            <div className='category'>
                    {this.props.pickedCategory}
            </div>)
    }
}

class Product extends Component {

}

class Products extends Component {

}

export { Category }