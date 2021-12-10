/* eslint-disable no-control-regex */

export const WindowSize = {
    tablet: '@media(max-width: 850px)',
    ipad: '@media(max-width: 750px)',
    mobile: '@media(max-width: 560px)',
}

export const LightColors = {
    black: '#000000',
    black1: '#212529',
    white: '#FFFFFF',
    white1: '#F1F3F5',
    white2: '#E9ECEF',
    white3: '#F8F9FA',
    white4: '#ADB5BD',
    boxShadow: '#DEE2E6',
    gray1: '#868E96',
    gray2: '#495057',
    gray3: '#CED4DA',
    gray4: '#ADB5BD',
    transparent: '#0000',
    blueButton: '#364FC7',
    blueHeader: '#4C6EF5',
    blueBorder: '#195DFB',
    red: '#F00',
    warning: '#FA5252'
}

export const truncate = (fullStr, strLen, separator, right = false) => {
    if (fullStr.length <= strLen) return fullStr

    separator = separator || '...'

    var sepLen = separator.length,
        charsToShow = strLen - sepLen,
        frontChars = right ? charsToShow : Math.ceil(charsToShow/2),
        backChars = right ? 0 : Math.floor(charsToShow/2)

    return fullStr.substr(0, frontChars) + 
           separator + 
           fullStr.substr(fullStr.length - backChars)
}
