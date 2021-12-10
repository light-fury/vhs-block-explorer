/* eslint-disable no-restricted-globals */
import { useState, useEffect, useRef } from 'react'
import { useWeb3React } from '@web3-react/core'
import { BigNumber } from '@ethersproject/bignumber'
import moment from 'moment'
// Hook
const useBlockchain = () => {
  const [blocknumber, setBlocknumber] = useState(0)
  const [blockInfo, setBlockInfo] = useState([])
  const { account, library, chainId } = useWeb3React()
  const [inUse, setInUse] = useState(false)
  const blocknumberRef = useRef(null)
  const blockInfoRef = useRef(null)
  const chainIdRef = useRef(null)
  const inUseRef = useRef(null)
  const accountRef = useRef(null)
  blocknumberRef.current = blocknumber
  blockInfoRef.current = blockInfo
  inUseRef.current = inUse
  chainIdRef.current = chainId
  accountRef.current = account

  const fetchBlockInfo = async (latestBlock, originChainId, originAccount) => {
    try {
      if (latestBlock <= blocknumberRef.current) {
        return
      }
      if (blockInfoRef.current.indexOf(item => item.number === latestBlock) >= 0) {
        return
      }
      if (chainIdRef.current !== originChainId || accountRef.current !== originAccount) {
        return
      }
      if (latestBlock > (blocknumberRef.current + 1)
        || inUseRef.current === true
        || blockInfoRef.current.length !== 10
      ) {
        setTimeout(() => {
          fetchBlockInfo(latestBlock, originChainId, originAccount)
        }, 1000)
        return
      }
      setInUse(true)
      const lowercasedAccount = account.toLowerCase()
      let tempBlock = await library.getBlockWithTransactions(latestBlock)
      const filteredTransactions = tempBlock.transactions.filter(transaction => !((BigNumber.from(transaction.value.toString())).isZero()))
      tempBlock.transactions = filteredTransactions.map(transaction => {
        if (transaction.from.toLowerCase() === lowercasedAccount || transaction.to.toLowerCase() === lowercasedAccount) {
          return {
            ...transaction,
            mine: true
          }
        } else {
          return {
            ...transaction,
            mine: false
          }
        }
      })
      let tempBlockList = blockInfoRef.current
      tempBlock.duration = Math.abs(tempBlock.timestamp - (tempBlockList.length > 0 ? tempBlockList[0].timestamp : moment().unix()))
      tempBlockList.pop()
      tempBlockList.unshift(tempBlock)
      setBlockInfo(tempBlockList)
      setBlocknumber(latestBlock)
    } catch (error) {
      //
    } finally {
      setInUse(false)
    }
  }

  const initializeBlockInfo = async () => {
    try {
      if (account && account.length > 0) {
        const num = await library.getBlockNumber()
        setBlocknumber(num)
        setBlockInfo([])
        library.removeAllListeners("block")
        library.on("block", (latestBlock) => {
          fetchBlockInfo(latestBlock, chainIdRef.current, accountRef.current)
        })
        const lowercasedAccount = account.toLowerCase()
        let prevTimestamp = moment().unix()
        let blockList = []
        for (let index = 0; index < 10; index++) {
          let tempBlock = await library.getBlockWithTransactions(num - index)
          const filteredTransactions = tempBlock.transactions.filter(transaction => !((BigNumber.from(transaction.value.toString())).isZero()))
          tempBlock.transactions = filteredTransactions.map(transaction => {
            if (transaction.from.toLowerCase() === lowercasedAccount || transaction.to.toLowerCase() === lowercasedAccount) {
              return {
                ...transaction,
                mine: true
              }
            } else {
              return {
                ...transaction,
                mine: false
              }
            }
          })
          tempBlock.duration = prevTimestamp - tempBlock.timestamp
          prevTimestamp = tempBlock.timestamp
          blockList.push(tempBlock)
        }
        setBlockInfo(blockList)
      }
    } catch (error) {
      //
    }
  }

  useEffect(() => {
    initializeBlockInfo()
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [account, library, chainId])

  return {
    blocknumber,
    blockInfo
  }
}

export default useBlockchain
