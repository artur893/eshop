import { Header } from './components/Header'
import { Component } from 'react';
import './App.css';
import { client, Query } from '@tilework/opus'

const endpointUrl = 'http://localhost:4000/'
client.setEndpoint(endpointUrl)

class App extends Component {

  render() {
    return (
      <div className='container'>
        <Header />
      </div>
    )
  }

}

export default App
