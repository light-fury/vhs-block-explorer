import React from 'react'
import {
  Routes,
  Route
} from 'react-router-dom'
import styled from 'styled-components'

import './App.css'
import Home from './container/home'
import Header from './component/header'
import { BlockchainContext } from './contexts'
import useBlockchain from './hooks/useBlockchain'

const AppContainer = styled.div`
  background-color: #FFF;
  min-height: 100vh;
`

function App() {
  const { blocknumber, blockInfo } = useBlockchain()

  return (
    <BlockchainContext.Provider value={{ blocknumber, blockInfo }}>
      <AppContainer>
        <Header />
        <Routes>
          <Route path='/' element={<Home />}>
          </Route>
        </Routes>
      </AppContainer>
    </BlockchainContext.Provider>
  )
}

export default App
