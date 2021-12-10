import 'bootstrap/dist/css/bootstrap.min.css'
import React from 'react'
import ReactDOM from 'react-dom'
import {
  BrowserRouter as Router,
} from 'react-router-dom'
import { Web3ReactProvider } from '@web3-react/core'
import { ethers } from 'ethers'
import './index.css'
import App from './App'
import reportWebVitals from './reportWebVitals'

require('dotenv').config()

function getLibrary(provider) {
  return new ethers.providers.Web3Provider(provider)
}

ReactDOM.render(
  <Router>
    <Web3ReactProvider getLibrary={getLibrary}>
      <App />
    </Web3ReactProvider>
  </Router>,
  document.getElementById('root')
)

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals()
