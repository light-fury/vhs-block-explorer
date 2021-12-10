import React from 'react'
import { useWeb3React } from "@web3-react/core"
import styled from 'styled-components'
import {
    useNavigate
} from 'react-router-dom'

import CompassLogo from '../../asset/logo.png'
import WalletImg from '../../asset/wallet_icon.png'
import { LightColors, truncate } from '../../util'
import { injected } from '../wallet/Connectors'

const HeaderTotalContainer = styled.div`
    background-color: ${LightColors.white};
    border: 1px solid ${LightColors.gray1};
    border-width: 0 0 1px 0;
`

const HeaderContainer = styled.div`
    padding: 0 20px;
    display: flex;
    flex-direction: row;
    align-items: center;
    max-width: 1340px;
    margin-left: auto;
    margin-right: auto;
    height: 84px;
`

const HeaderLogo = styled.img`
    width: 50px;
    height: 50px;
    object-fit: contain;
    cursor: pointer;
    user-select: none;
`

const MiddleSeparator = styled.div`
    display: flex;
    flex: 1;
`

const HeaderRightBtn = styled.div(() => ({
    boxSizing: 'border-box',
    border: `1px solid ${LightColors.blueButton}`,
    backgroundColor: LightColors.blueButton,
    borderRadius: '3px',
    height: '40px',
    padding: '8px 26px',
    color: LightColors.white,
    marginRight: '0',
    fontFamily: 'Poppins',
    fontSize: '18px',
    letterSpacing: '0',
    lineHeight: '24px',
    cursor: 'pointer',
    userSelect: 'none',
}))

const WalletAddrContainer = styled.div`
    height: 40px;
    border-radius: 3px;
    background-color: ${LightColors.white2};
    display: flex;
    align-items: center;
    padding: 0 8px;
    margin-left: 8px;
    color: ${LightColors.black1};
    font-size: 18px;
    letter-spacing: 0;
    line-height: 24px;
`

const WalletIcon = styled.img`
    width: 20px;
    height: 20px;
    margin-right: 8px;
    border-radius: 20px;
`

const Header = () => {
    const { account, activate } = useWeb3React()
    let navigate = useNavigate()

    return (
        <HeaderTotalContainer>
            <HeaderContainer>
                <HeaderLogo onClick={() => navigate('/')} src={CompassLogo} />
                <MiddleSeparator />
                {(account || '').length > 0 ? (
                    <WalletAddrContainer>
                        <WalletIcon src={WalletImg} />
                        {truncate(account, 14)}
                    </WalletAddrContainer>
                ) : (
                    <HeaderRightBtn onClick={async () => await activate(injected)}>Connect Wallet</HeaderRightBtn>
                )}
            </HeaderContainer>
        </HeaderTotalContainer>
    )
}

export default Header