import * as React from 'react'
import styled from 'styled-components'

import {ThemeColors} from '../helpers'
import {
  PROVIDER_WRAPPER_CLASSNAME,
  PROVIDER_CONTAINER_CLASSNAME,
  PROVIDER_ICON_CLASSNAME,
  PROVIDER_NAME_CLASSNAME,
} from '../constants'

const hexToRGB = (h: string, a: number = 1) => {
  let r = '0', g = '0', b = '0'

  // 3 digits
  if (h.length == 4) {
    r = '0x' + h[1] + h[1]
    g = '0x' + h[2] + h[2]
    b = '0x' + h[3] + h[3]

    // 6 digits
  } else if (h.length == 7) {
    r = '0x' + h[1] + h[2]
    g = '0x' + h[3] + h[4]
    b = '0x' + h[5] + h[6]
  }

  return 'rgba(' + +r + ',' + +g + ',' + +b + ',' + a + ')'
}

const SIcon = styled.div<IStyedThemeColorOptions>`
  width: 32px;
  height: 32px;
  filter: brightness(0.8) contrast(1.5);
  display: flex;
  border-radius: 12px;
  overflow: visible;
  box-shadow: none;
  justify-content: center;
  align-items: center;

  & img {
    width: 100%;
    height: 100%;
  }

  @media screen and (max-width: 768px) {
    width: 8.5vw;
    height: 8.5vw;
  }
`

interface IStyedThemeColorOptions {
  color?: string;
  themeColors: ThemeColors;
}

const SName = styled.div<IStyedThemeColorOptions>`
  flex-grow: 1;
  text-align: left;
  font-size: 19px;
  font-weight: 700;
  letter-spacing: -0.01em;
  color: ${({themeColors}) => themeColors.textInContent};
  @media screen and (max-width: 768px) {
    font-size: 5vw;
  }
`

const SProviderContainer = styled.div<IStyedThemeColorOptions>`
  transition: all 0.2s ease-in-out;
  width: 100%;
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
  background-color: ${({color, themeColors}) => (color && hexToRGB(color, 1)) || themeColors.background};
  border-radius: 14px;
  padding: 0 16px 0 24px;
  height: 100%;
`

const SProviderWrapper = styled.div<IStyedThemeColorOptions>`
  width: 100%;
  height: 56px;
  margin: 10px 0;
  display: flex;
  justify-content: center;
  align-items: center;
  flex-direction: column;
  cursor: pointer;
  border-radius: 0;

  &:first-child {
    margin-top: 0;
  }

  &:last-child {
    margin-bottom: 0;
  }

  @media (hover: hover) {
    &:hover ${SProviderContainer} {
      filter: contrast(1.2) brightness(1.05);
      transform: translateY(-1px);
    }
  }
`

interface IProviderProps {
  name: string;
  logo: string;
  description: string;
  color?: string;
  themeColors: ThemeColors;
  onClick: () => void;
}

export function Provider(props: IProviderProps) {
  const {
    name,
    logo,
    color,
    themeColors,
    onClick,
    ...otherProps
  } = props
  return (
    <SProviderWrapper
      color={color}
      themeColors={themeColors}
      className={PROVIDER_WRAPPER_CLASSNAME}
      onClick={onClick}
      {...otherProps}
    >
      <SProviderContainer
        color={color}
        themeColors={themeColors}
        className={PROVIDER_CONTAINER_CLASSNAME}
      >
        <SName themeColors={themeColors} className={PROVIDER_NAME_CLASSNAME}>
          {name}
        </SName>
        <SIcon themeColors={themeColors} className={PROVIDER_ICON_CLASSNAME}>
          <img src={logo} alt={name}/>
        </SIcon>
      </SProviderContainer>
    </SProviderWrapper>
  )
}
