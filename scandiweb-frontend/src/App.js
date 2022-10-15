import { Header } from './components/Header'
import { Category } from './components/Products'
import { Component } from 'react';
import './App.css';
import { client } from '@tilework/opus'

const endpointUrl = 'http://localhost:4000/'
client.setEndpoint(endpointUrl)

class App extends Component {
  constructor(props) {
    super(props)

    this.state = { pickedCategory: null }
    this.changeState = this.changeState.bind(this)
  }

  changeState(newCategory) {
    this.setState({ pickedCategory: newCategory })
  }


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
