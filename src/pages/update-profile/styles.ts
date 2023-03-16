import { Box, Button, Heading, keyframes, styled, Text } from '@doctor-ui/react'

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

export const ProfileBox = styled(Box, {
  marginTop: '$6',
  display: 'flex',
  flexDirection: 'column',
  gap: '$4',
  alignItems: 'center',

  [`> label`]: {
    display: 'flex',
    flexDirection: 'column',
    gap: '$2',
    width: '100%',
  },

  [`> ${Button}`]: {
    width: '100%',
  },
})

export const CalendarUserHeader = styled('div', {
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  marginBottom: '$2',
  width: '90%',
  padding: '$3',
  border: '1px solid $gray600',
  borderRadius: '$sm',
  textAlign: 'center',

  [`> ${Heading}`]: {
    lineHeight: '$base',
    marginTop: '$2',
  },

  [`> ${Text}`]: {
    color: '$gray200',
  },
})

export const SpecialtiesInLineContainer = styled('div', {
  display: 'flex',
  gap: '$1',
})

export const AvatarImgContainer = styled('div', {
  display: 'flex',
  flexDirection: 'column',
  gap: '$2',
  alignItems: 'center',
})

export const SpecilatiesContainer = styled('div', {
  width: '100%',
  alignItems: 'center',
  justifyContent: 'space-between',
  display: 'flex',

  label: {
    display: 'flex',
    flexDirection: 'column',
    gap: '$2',
    width: '47%',
  },

  '@media(max-width: 600px)': {
    flexDirection: 'column',
    gap: '$4',

    label: {
      gap: '$2',
      width: '100%',
    },
  },
})

export const SpecialtyBox = styled('div', {
  width: '5%',
})

export const FormError = styled(Text, {
  color: '#f75a68',
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

export const LogOutButtonContainer = styled('div', {
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  padding: '0 $6',

  [`> ${Button}`]: {
    width: '100%',
    background: '#E33B3B',

    '&:hover': {
      background: '#E94949',
    },
  },
})

export const SubscriptionBox = styled('div', {
  display: 'flex',
  flexDirection: 'column',

  border: '1px solid $gray600',
  padding: '$4 $6',
  gap: '$3',

  borderRadius: '$md',

  marginBottom: '$4',
})

export const ButtonCancelSubscription = styled(Button, {
  background: 'none',
  border: '1px solid #E33B3B',

  '&:hover': {
    background: '#E94949',
    color: '#FFF',
  },
})

export const ButtonSubscribe = styled(Button, {
  background: 'none',
  border: '1px solid #4BB543',

  '&:hover': {
    background: '#4BB543',
    color: '#FFF',
  },
})

export const ChangeSubscriptionStatusContainer = styled('div', {
  display: 'flex',
  width: '100%',
  alignItems: 'center',
  justifyContent: 'space-between',

  [`> ${ButtonCancelSubscription}`]: {
    color: '#E33B3B',
    height: '$10',
  },

  [`> ${ButtonSubscribe}`]: {
    color: '#4BB543',
    height: '$10',
  },
})
