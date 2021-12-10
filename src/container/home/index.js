import React, { useContext, useState, useEffect } from 'react'
import styled from 'styled-components'
import { useWeb3React } from '@web3-react/core'
import ReactLoading from 'react-loading'
import moment from 'moment'
import ReactPaginate from 'react-paginate'
import { BigNumber } from '@ethersproject/bignumber'
import { LightColors, truncate, WindowSize } from '../../util'
import { BlockchainContext } from '../../contexts'
import { useWindowSize } from '../../hooks/useWindowSize'

const HomeContainer = styled.div(() => ({
  padding: '20px 100px',
  maxWidth: '1300px',
  marginLeft: 'auto',
  marginRight: 'auto',
  display: 'flex',
  flexDirection: 'column',
  [WindowSize.tablet]: {
    padding: '20px 50px 50px',
  },
  [WindowSize.mobile]: {
    padding: '20px 20px 20px',
  }
}))

const RowContainer = styled.div((props) => ({
   display: 'flex',
   flexDirection: 'row',
   alignItems: 'center',
   justifyContent: props.center ? 'center' : 'space-between',
   margin: props.margin ? '10px 0 0' : '0',
   [WindowSize.ipad]: {
     flexDirection: props.center ? 'row' : 'column',
     alignItems: props.center ? 'center' : 'flex-start'
   }
}))

const BlockListContainer = styled.div`
  width: 100%;
  border-radius: 6px;
  background-color: ${LightColors.white};
  box-shadow: 0 2px 20px 0 ${LightColors.boxShadow};
  padding: 28px 27px 40px 27px;
  display: flex;
  flex-direction: column;
  margin-bottom: 40px;
  position: relative;
`

const BlockHeader = styled.div`
  font-size: 14px;
  line-height: 40px;
  font-weight: 600;
`

const BlockRow = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;
  height: 40px;
`

const BlockInnerTag = styled.div`
  flex: ${props => props.long ? '2' : props.small ? '0.85' : '1'};
  display: flex;
  align-items: center;
  font-size: 14px;
  line-height: 21px;
  font-weight: 400;
  text-align: ${props => props.right ? 'right' : 'left'};
  justify-content: ${props => props.right ? 'flex-end' : 'flex-start'};

  &:hover {
    text-decoration: ${props => props.link ? 'underline' : 'none'};
    cursor: ${props => props.link ? 'pointer' : 'default'};
    color: ${props => props.link ? LightColors.blueButton : LightColors.black};
  }

`

const BlockInnerLink = styled.a`
  margin: ${props => props.right ? '0 8px 0 0' : '0 0 0 8px'};
  text-decoration: none;
  color: ${LightColors.blueButton};

  &:hover {
    text-decoration: underline;
    cursor: pointer;
  }
`

const SpinnerContainer = styled.div`
  flex: 1;
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: calc(100vh - 125px);
`

const InputContainer = styled.label`
  font-size: 14px;
  letter-spacing: 0;
  line-height: 21px;
  cursor: pointer;
  user-select: none;
  background-color: ${LightColors.transparent};
  display: flex;
  align-items: center;
`

const InputDiv = styled.input`
    color: ${LightColors.gray1};
    border: none;
    outline: none;
    margin-right: 10px;
`

const BlockRewardDiv = styled.span`
  font-size: .65625rem;
  line-height: 1.7;
  padding: 0.2rem 0.5rem 0.2rem 1.15rem;
  transition: .2s ease-in-out;
  position: relative;
  letter-spacing: .8px;
  border-top-right-radius: 0.25rem;
  border-bottom-right-radius: 0.25rem;
  border-top-left-radius: 0;
  border-bottom-left-radius: 0;
  background-color: rgba(119,131,143,.1);

  &::after {
    position: absolute;
    left: 0;
    top: 0;
    content: "";
    border-top: 0.7rem solid transparent;
    border-bottom: 0.7rem solid transparent;
    border-left: 0.7rem solid ${LightColors.white};
  }
`

const ITEMS_PER_PAGE = 10

const Home = () => {
  const { active, account, library, chainId } = useWeb3React()
  const { blocknumber, blockInfo } = useContext(BlockchainContext)
  const { isMobile, isPad, isTablet } = useWindowSize();
  const [currentBlock, setCurrentBlock] = useState({})
  const [selfOnly, setSelfOnly] = useState(false)
  const [currentItems, setCurrentItems] = useState([])
  const [totalItems, setTotalItems] = useState([])
  const [pageCount, setPageCount] = useState(0)
  const [itemOffset, setItemOffset] = useState(0)

  const handlePageClick = (event) => {
    if (Object.keys(currentBlock).length === 0) {
      return
    }
    const newOffset = event.selected * ITEMS_PER_PAGE % totalItems.length
    setItemOffset(newOffset)
  }

  const handleSelfOnlyChange = () => {
    setSelfOnly(!selfOnly)
  }

  const generateTimeString = (val) => {
    const hh = Math.floor(val / 60 / 60)
    const mm = Math.floor(val / 60)
    const ss = Math.floor(val % 60)
    let str = ss > 0 ? `${ss} sec${ss > 1 ? 's' : ''} ago` : ' ago'
    if (mm > 0) {
      str = `${mm} min${mm > 1 ? 's' : ''} ${str}`
    }
    if (hh > 0) {
      str = `${hh} hr${hh > 1 ? 's' : ''} ${str}`
    }
    return str
  }

  const truncLength = () => !isTablet ? 12 : 14

  useEffect(() => {
    if (totalItems.length === 0) {
      setCurrentItems([])
      setPageCount(0)
      return
    }
    // Fetch items from another resources.
    const endOffset = itemOffset + ITEMS_PER_PAGE
    setCurrentItems(totalItems.slice(itemOffset, endOffset))
    setPageCount(Math.ceil(totalItems.length / ITEMS_PER_PAGE))
  }, [itemOffset, totalItems])

  useEffect(() => {
    if (Object.keys(currentBlock).length === 0) {
      return
    }
    if (selfOnly) {
      setTotalItems(currentBlock.transactions.filter(item => item.mine))
    } else {
      setTotalItems(currentBlock.transactions)
    }
  }, [currentBlock, selfOnly])

  useEffect(() => {
    setCurrentBlock({})
  }, [account, library, chainId])

  return (
    <HomeContainer>
      {active && blockInfo.length !== 10 && (
        <SpinnerContainer>
          <ReactLoading type="spinningBubbles" color={LightColors.blueBorder} height={200} width={200} />
        </SpinnerContainer>
      )}
      {blockInfo.length === 10 && (
        <BlockListContainer>
          <BlockHeader>{`Latest Block: ${blocknumber}`}</BlockHeader>
          {blockInfo.map((blockData) => {
            return (
              <BlockRow key={blockData.number}>
                <BlockInnerTag link onClick={() => setCurrentBlock(blockData)}>
                  {blockData.number}
                </BlockInnerTag>
                {!isMobile && (
                  <BlockInnerTag>
                    {moment(blockData.timestamp * 1000).format('YYYY-MM-DD hh:mm:ss')}
                  </BlockInnerTag>
                )}
                {!isPad && (
                  <BlockInnerTag>
                    Miner
                    <BlockInnerLink href={`https://etherscan.io/address/${blockData.miner}`} target="_blank">
                      {truncate(blockData.miner, 14)}
                    </BlockInnerLink>
                  </BlockInnerTag>
                )}
                <BlockInnerTag right>
                  <BlockInnerLink right href={`https://etherscan.io/txs?block=${blockData.number}`} target="_blank">
                    {`${blockData.transactions.length} txns`}
                  </BlockInnerLink>
                  {`in ${blockData.duration} secs`}
                </BlockInnerTag>
              </BlockRow>
            )
          })}
        </BlockListContainer>
      )}
      {Object.keys(currentBlock).length > 0 && (
        <BlockListContainer>
          <RowContainer>
            <BlockHeader>{`Block: ${currentBlock.number}`}</BlockHeader>
            <InputContainer>
              <InputDiv type="checkbox" value={selfOnly} onChange={handleSelfOnlyChange}/>
              Self Transactions Only
            </InputContainer>
          </RowContainer>
          {currentItems.map((transaction) => (
            <BlockRow key={transaction.hash}>
              <BlockInnerTag>
                <BlockInnerLink right href={`https://etherscan.io/tx/${transaction.hash}`} target="_blank">
                  {truncate(transaction.hash, truncLength(), '...', true)}
                </BlockInnerLink>
              </BlockInnerTag>
              {!isMobile && (
                <BlockInnerTag>
                  {generateTimeString(moment().unix() - currentBlock.timestamp)}
                </BlockInnerTag>
              )}
              {!isPad && (
                <BlockInnerTag>
                  To
                  <BlockInnerLink href={`https://etherscan.io/address/${transaction.to}`} target="_blank">
                    {truncate(transaction.to, truncLength())}
                  </BlockInnerLink>
                </BlockInnerTag>
              )}
              {!isTablet && (
                <BlockInnerTag>
                  From
                  <BlockInnerLink href={`https://etherscan.io/address/${transaction.from}`} target="_blank">
                    {truncate(transaction.from, truncLength())}
                  </BlockInnerLink>
                </BlockInnerTag>
              )}
              <BlockInnerTag right small>
                <BlockRewardDiv>
                {`${BigNumber.from(transaction.value).div(BigNumber.from('10').pow(BigNumber.from('13'))).toNumber() / 100000} Eth`}
                </BlockRewardDiv>
              </BlockInnerTag>
            </BlockRow>
          ))}
          <RowContainer center margin>
            <ReactPaginate
              nextLabel={!isPad ? "next >" : ">"}
              onPageChange={handlePageClick}
              pageRangeDisplayed={3}
              marginPagesDisplayed={2}
              pageCount={pageCount}
              previousLabel={!isPad ? "< previous" : "<"}
              pageClassName="page-item"
              pageLinkClassName="page-link"
              previousClassName="page-item"
              previousLinkClassName="page-link"
              nextClassName="page-item"
              nextLinkClassName="page-link"
              breakLabel="..."
              breakClassName="page-item"
              breakLinkClassName="page-link"
              containerClassName="pagination"
              activeClassName="active"
              renderOnZeroPageCount={null}
            />
          </RowContainer>
        </BlockListContainer>
      )}
    </HomeContainer>
  )
}

export default Home