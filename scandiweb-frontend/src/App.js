import { Header } from './components/Header'
import { Category } from './components/Products'
import { Component } from 'react';
import './App.css';
import { client, Query } from '@tilework/opus'

const endpointUrl = 'http://localhost:4000/'
client.setEndpoint(endpointUrl)

class App extends Component {
  constructor(props) {
    super(props)

    this.state = { pickedCategory: null }
    this.changeState = this.changeState.bind(this)
  }

  productsDataRaw

  async getCategoriesData() {
    const productsQuery = new Query('category{products{id, name, inStock, gallery, description, category, attributes' +
      '{id,name,type,items{displayValue,value,id}}, prices{currency{label,symbol},amount}, brand}}')
    try {
      const productsData = await client.post(productsQuery)
      this.productsDataRaw = productsData
      console.log(this.productsDataRaw)
    } catch (error) {
      console.log(`Unable to get data from server: ${error}`)
    }
  }

  changeState(newCategory) {
    this.setState({ pickedCategory: newCategory })
  }

  componentDidMount() {
    this.getCategoriesData()
  }



  // query{
  //   category{products{
  //     id, 
  //     name, 
  //     inStock, 
  //     gallery, 
  //     description, 
  //     category, 
  //     attributes{id,name,type,items{displayValue,value,id}}, 
  //     prices{currency{label,symbol},amount}, 
  //     brand}}
  // }


  render() {
    return (
      <div className='container'>
        <Header pickedCategory={this.state.pickedCategory} changeCategory={this.changeState} />
        <Category pickedCategory={this.state.pickedCategory} />
      </div>
    )
  }

}

export default App
