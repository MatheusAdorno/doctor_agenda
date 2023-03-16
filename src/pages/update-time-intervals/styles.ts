import { Box, Text, styled, keyframes, Button } from '@doctor-ui/react'

const animationTopDownUpdateProfileContainer = keyframes({
  '0%': {
    opacity: 0,
    transform: 'translateY(-30px)',
  },

  '100%': {
    opacity: 1,
    transform: 'translateY(0)',
  },
})

const animationDownTopUpdateProfileContainer = keyframes({
  '0%': {
    opacity: 1,
    transform: 'translateY(0)',
  },

  '100%': {
    opacity: 0,
    transform: 'translateY(-30px)',
  },
})

export const IntervalBox = styled(Box, {
  marginTop: '$6',
  display: 'flex',
  flexDirection: 'column',
})

export const IntervalsContainer = styled('div', {
  border: '1px solid $gray600',
  borderRadius: '$md',
  marginBottom: '$4',
})

export const IntervalItem = styled('div', {
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'space-between',
  padding: '$3 $4',

  '& + &': {
    borderTop: '1px solid $gray600',
  },
})

export const IntervalDay = styled('div', {
  display: 'flex',
  alignItems: 'center',
  gap: '$3',
})

export const IntervalInputs = styled('div', {
  display: 'flex',
  alignItems: 'center',
  gap: '$2',

  'input::-webkit-calendar-picker-indicator': {
    filter: 'invert(100%) brightness(40%)',
  },
})

export const FormError = styled(Text, {
  color: '#f75a68',
  marginBottom: '$4',
})

export const AppointmentTimeBox = styled('div', {
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',

  border: '1px solid $gray600',
  borderRadius: '$md',
  marginBottom: '$4',
  padding: '$3 $4',

  [`> ${Text}`]: {
    marginRight: '$8',
  },
})

export const SuccededHeaderContainer = styled('div', {
  position: 'absolute',
  width: '100%',
  padding: '$1',
  top: 0,
  left: 0,
  textAlign: 'center',

  background: '#00A300',

  animation: `${animationTopDownUpdateProfileContainer} 500ms, ${animationDownTopUpdateProfileContainer} 500ms 5600ms`,

  [`> ${Text}`]: {
    fontWeight: 'bold',
  },
})

export const AccountIsNotActiveContainer = styled('div', {
  position: 'absolute',
  width: '100%',
  padding: '$1',
  top: 0,
  left: 0,
  textAlign: 'center',

  background: '#E33B3B',

  animation: `${animationTopDownUpdateProfileContainer} 500ms`,

  [`> ${Text}`]: {
    fontWeight: 'bold',

    [`> button`]: {
      background: 'none',
      color: 'inherit',
      border: 'none',
      padding: 0,
      font: 'inherit',
      cursor: 'pointer',
      outline: 'inherit',
      textDecoration: 'underline',
    },
  },
})

export const ElementSeparator = styled('hr', {
  border: 'none',
  borderTop: '1.5px solid $gray600',
  background: 'none',
  borderRadius: '5px',
  width: '100%',
  marginTop: '$4',
  marginBottom: '$4',
})

export const MyCalendarButtonContainer = styled('div', {
  display: 'flex',
  marginTop: '$4',
  marginBottom: '$6',
  alignItems: 'center',
  justifyContent: 'space-between',
  padding: '0 $6',

  [`> ${Button}`]: {
    width: '47%',
  },
})
