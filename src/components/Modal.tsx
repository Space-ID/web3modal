import * as React from "react";
import * as PropTypes from "prop-types";
import styled from "styled-components";

import { Provider } from "./Provider";
import {
  MODAL_LIGHTBOX_CLASSNAME,
  MODAL_CONTAINER_CLASSNAME,
  MODAL_HITBOX_CLASSNAME,
  MODAL_CARD_CLASSNAME
} from "../constants";
import { SimpleFunction, IProviderUserOptions, ThemeColors } from "../helpers";

declare global {
  // tslint:disable-next-line
  interface Window {
    ethereum: any;
    BinanceChain: any;
    web3: any;
    celo: any;
    updateWeb3Modal: any;
  }
}

interface ILightboxStyleProps {
  show: boolean;
  offset: number;
  opacity?: number;
}

const SLightbox = styled.div<ILightboxStyleProps>`
  transition: opacity 0.1s ease-in-out;
  text-align: center;
  position: fixed;
  width: 100%;
  height: 100%;
  margin-left: -50vw;
  top: ${({ offset }) => (offset ? `-${offset}px` : 0)};
  left: 50%;
  z-index: 2;
  will-change: opacity;
  background-color: ${({ opacity }) => {
    let alpha = 0.4;
    if (typeof opacity === "number") {
      alpha = opacity;
    }
    return `rgba(0, 0, 0, ${alpha})`;
  }};
  opacity: ${({ show }) => (show ? 1 : 0)};
  visibility: ${({ show }) => (show ? "visible" : "hidden")};
  pointer-events: ${({ show }) => (show ? "auto" : "none")};
  display: flex;
  justify-content: center;
  align-items: center;

  @supports (backdrop-filter: blur(30px)) {
    background: rgba(0, 0, 0, 0.1);
    backdrop-filter: blur(30px);
  }

  & * {
    box-sizing: border-box !important;
  }
`;

interface IModalContainerStyleProps {
  show: boolean;
}

const SModalContainer = styled.div<IModalContainerStyleProps>`
  position: relative;
  width: 100%;
  height: 100%;
  padding: 15px;
  display: flex;
  align-items: center;
  justify-content: center;
  opacity: ${({ show }) => (show ? 1 : 0)};
  visibility: ${({ show }) => (show ? "visible" : "hidden")};
  pointer-events: ${({ show }) => (show ? "auto" : "none")};
`;

const SHitbox = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
`;

interface IModalCardStyleProps {
  show: boolean;
  themeColors: ThemeColors;
  maxWidth?: number;
}

interface IModalTextStyleProps {
  themeColors: ThemeColors;
}

const SModalCard = styled.div<IModalCardStyleProps>`
  position: relative;
  width: 100%;
  background-color: ${({themeColors}) => themeColors.background};
  box-shadow: 0 3px 18px rgba(0, 0, 0, 0.04);
  border-radius: 28px;
  margin: 10px;
  padding: 15px;
  opacity: ${({show}) => (show ? 1 : 0)};
  visibility: ${({show}) => (show ? "visible" : "hidden")};
  pointer-events: ${({show}) => (show ? "auto" : "none")};

  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  max-width: 400px;
  min-width: fit-content;
  max-height: 100%;
  overflow: auto;

  @media screen and (max-width: 768px) {
    max-width: 325px;
  }
`;

const SModalText = styled.div<IModalTextStyleProps>`
  color: ${({themeColors}) => themeColors.main};
  width: 100%;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: flex-start;
  padding: 14px 0px 10px 16px;
`;

const SModalTextHeader = styled.h2`
  font-size: 26px;
  letter-spacing: -0.01em;
  font-weight: 700;
  margin: 0;
`;

const SModalTextSubHeader = styled.h3`
  font-size: 16px;
  letter-spacing: -0.01em;
  font-weight: 500;
  opacity: 0.6;
  margin: 0;
  line-height: 26px;
`;

const SProviderScrollWrapper = styled.div`
  overflow-y: auto;
  max-height: 240px;
  width: calc(100% - 20px);
  margin-top: 10px;
  margin-bottom: 10px;
  border-radius: 14px;

  -ms-overflow-style: none;
  scrollbar-width: none;

  &::-webkit-scrollbar {
    display: none;
  }
`;

const SProviderScrollGradient = styled.div<IProviderScrollGradientProps>`
  position: absolute;
  height: ${({scrollHeight}) => scrollHeight}px;
  width: 100%;
  bottom: 25px;

  &::before, &::after {
    position: absolute;
    content: "";
    top: 0;
    right: 0;
    bottom: 0;
    left: 0;
    pointer-events: none;
    transition: opacity 0.2s ease-in-out;
    margin: 0 24px;
    border-radius: 14px;
  }

  &::before {
    background: linear-gradient(to top, black, transparent 35px);
    opacity: ${({showBottom}) => (showBottom ? 0.7 : 0)};
  }

  &::after {
    background: linear-gradient(to bottom, black, transparent 35px);
    opacity: ${({showTop}) => (showTop ? 0.7 : 0)};
  }

  pointer-events: none;
`

interface IProviderScrollGradientProps {
  scrollHeight?: number;
  showTop: boolean;
  showBottom: boolean;
}

interface IModalProps {
  themeColors: ThemeColors;
  userOptions: IProviderUserOptions[];
  onClose: SimpleFunction;
  resetState: SimpleFunction;
  lightboxOpacity: number;
  text: {
    heading: string;
    subheading: string;
  };
}

interface IModalState {
  show: boolean;
  lightboxOffset: number;
  showTopGradient: boolean;
  showBottomGradient: boolean;
}

const INITIAL_STATE: IModalState = {
  show: false,
  lightboxOffset: 0,
  showTopGradient: false,
  showBottomGradient: false,
};

export class Modal extends React.Component<IModalProps, IModalState> {
  constructor(props: IModalProps) {
    super(props);
    window.updateWeb3Modal = async (state: IModalState) => {
      this.setState(state);
    };
    this.onScroll = () => {
      if (this.scrollRef) {
        const bottomPosition = this.scrollRef?.scrollHeight - this.scrollRef?.clientHeight;
        const scrollPosition = this.scrollRef?.scrollTop;
        if (bottomPosition - 10 >= scrollPosition) {
          this.setState({
            showBottomGradient: true,
          });
        } else {
          this.setState({
            showBottomGradient: false,
          });
        }
        if (scrollPosition >= 10) {
          this.setState({
            showTopGradient: true,
          });
        } else {
          this.setState({
            showTopGradient: false,
          });
        }
      }
    }
  }

  public static propTypes = {
    userOptions: PropTypes.object.isRequired,
    onClose: PropTypes.func.isRequired,
    resetState: PropTypes.func.isRequired,
    lightboxOpacity: PropTypes.number.isRequired
  };

  public onScroll: EventListener
  public scrollRef?: HTMLDivElement | null;
  public lightboxRef?: HTMLDivElement | null;
  public mainModalCard?: HTMLDivElement | null;

  public state: IModalState = {
    ...INITIAL_STATE
  };

  public componentDidUpdate(prevProps: IModalProps, prevState: IModalState) {
    if (prevState.show && !this.state.show) {
      this.props.resetState();
    }
    if (this.lightboxRef) {
      const lightboxRect = this.lightboxRef.getBoundingClientRect();
      const lightboxOffset = lightboxRect.top > 0 ? lightboxRect.top : 0;

      if (
        lightboxOffset !== INITIAL_STATE.lightboxOffset &&
        lightboxOffset !== this.state.lightboxOffset
      ) {
        this.setState({lightboxOffset});
      }
    }
  }

  public componentDidMount() {
    if (this.scrollRef) {
      if (this.scrollRef.scrollHeight > this.scrollRef.clientHeight) {
        this.setState({
          showBottomGradient: true,
        });
      }
      this.scrollRef.addEventListener('scroll', this.onScroll);
    }
  }

  public componentWillUnmount() {
    if (this.scrollRef) {
      this.scrollRef.removeEventListener('scroll', this.onScroll);
    }
  }

  public render = () => {
    const {show, lightboxOffset, showBottomGradient, showTopGradient} = this.state;

    const {onClose, lightboxOpacity, userOptions, themeColors, text} = this.props;

    return (
      <SLightbox
        className={MODAL_LIGHTBOX_CLASSNAME}
        offset={lightboxOffset}
        opacity={lightboxOpacity}
        ref={c => (this.lightboxRef = c)}
        show={show}
      >
        <SModalContainer className={MODAL_CONTAINER_CLASSNAME} show={show}>
          <SHitbox className={MODAL_HITBOX_CLASSNAME} onClick={onClose}/>
          <SModalCard
            className={MODAL_CARD_CLASSNAME}
            show={show}
            themeColors={themeColors}
            maxWidth={userOptions.length < 3 ? 500 : 800}
            ref={c => (this.mainModalCard = c)}
          >
            <SModalText themeColors={themeColors}>
              <SModalTextHeader>{text.heading}</SModalTextHeader>
              <SModalTextSubHeader>{text.subheading}</SModalTextSubHeader>
            </SModalText>
            <SProviderScrollWrapper ref={c => (this.scrollRef = c)}>
              {userOptions.map(provider =>
                !!provider ? (
                  <Provider
                    name={provider.name}
                    logo={provider.logo}
                    description={provider.description}
                    color={provider.color}
                    themeColors={themeColors}
                    onClick={provider.onClick}
                  />
                ) : null
              )}
            </SProviderScrollWrapper>
            <SProviderScrollGradient scrollHeight={this.scrollRef?.clientHeight}
                                     showTop={showTopGradient} showBottom={showBottomGradient}/>
          </SModalCard>
        </SModalContainer>
      </SLightbox>
    );
  };
}
