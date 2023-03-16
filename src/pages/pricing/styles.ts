import { Box, Heading, styled, Text } from '@doctor-ui/react'

export const HeaderDescription = styled(Text, {
  [`> span`]: {
    fontWeight: 'bold',
  },
})

export const PricingContainer = styled('div', {
  display: 'flex',
  alignItems: 'flex-start',
  justifyContent: 'center',
  gap: '$10',
  marginTop: '$6',
})

export const PriceBox = styled(Box, {
  display: 'flex',
  width: '65%',
  flexDirection: 'column',
  alignItems: 'center',
  gap: '$8',
})

// export const PriceBoxHeader = styled('div', {
//   display: 'flex',
//   flexDirection: 'column',
//   alignItems: 'center',
//   justifyContent: 'center',

//   [`> ${Heading}`]: {
//     marginBottom: '$2',
//   },

//   [`> ${Text}`]: {
//     textAlign: 'center',
//   },
// })

export const PriceValueContainer = styled('div', {
  display: 'flex',
  alignItems: 'flex-start',

  [`> ${Text}`]: {
    fontWeight: 'bold',
  },
})

export const RS = styled(Text, {})

export const Real = styled(Heading, {
  marginTop: '-10px',
})

export const CentsAndPeriodPaymentContainer = styled('div', {
  display: 'flex',
  flexDirection: 'column',
  gap: '$2',

  [`> ${Text}`]: {
    fontWeight: 'bold',
  },
})

export const Cents = styled(Text, {})

export const PriceBoxDescription = styled('div', {
  display: 'flex',
  flexDirection: 'column',
  marginTop: '-20px',
})

export const Period = styled(Text, {
  alignSelf: 'flex-end',
})
