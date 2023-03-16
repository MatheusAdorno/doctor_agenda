import { styled, Heading, Text } from '@doctor-ui/react'

export const Container = styled('div', {
  display: 'flex',
  flexDirection: 'column',

  height: '100vh',
})

export const Header = styled('div', {
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'space-between',

  padding: '$8 $20 0 $20',

  '@media(max-width: 600px)': {
    flexDirection: 'column',

    padding: '$8 0 0 0',
    marginBottom: '$10',
    justifyContent: 'center',
    gap: '$4',
  },

  [`> ${Heading}`]: {
    fontSize: '$4xl',
    fontWeight: 'bold',

    span: {
      fontFamily: 'Roboto',
      marginLeft: '$0.25',
      color: '#024E97',
    },
  },
})

export const HeaderButtons = styled('div', {
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'space-between',

  gap: '$3',
})

export const ContainerContent = styled('div', {
  display: 'flex',
  alignItems: 'center',
  gap: '$20',

  maxWidth: 'calc(100vw - (100vw - 1160px) / 2)',
  height: '100vh',
  marginLeft: 'auto',

  '@media(max-width: 600px)': {
    width: '100vw',
    height: '100vh',
    alignItems: 'start',
    justifyContent: 'center',
  },
})

export const Hero = styled('div', {
  maxWidth: 480,
  padding: '0 $10',

  [`> ${Heading}`]: {
    '@media(max-width: 600px)': {
      fontSize: '$6xl',
      textAlign: 'center',
      marginBottom: '$10',
    },
  },

  [`> ${Text}`]: {
    marginTop: '$2',
    color: '$gray200',
    '@media(max-width: 600px)': {
      textAlign: 'center',
      marginBottom: '$10',
    },
  },
})

export const Preview = styled('div', {
  paddingRight: '$8',
  overflow: 'hidden',

  '@media(max-width: 600px)': {
    display: 'none',
  },
})
