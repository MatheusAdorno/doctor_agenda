import { Box, keyframes, styled, Text } from '@doctor-ui/react'

export const Container = styled(Box, {
  margin: '$6 auto 0',
  padding: 0,
  display: 'grid',
  maxWidth: '100%',
  position: 'relative',

  variants: {
    isTimePickerOpen: {
      true: {
        gridTemplateColumns: '1fr 280px',

        '@media (max-width: 900px)': {
          gridTemplateColumns: '1fr',
        },
      },
      false: {
        width: 540,
        gridTemplateColumns: '1fr',
      },
    },
  },
})

const animationContainer = keyframes({
  '0%': {
    opacity: 0,
    transform: 'translateX(-30px)',
  },

  '100%': {
    opacity: 1,
    transform: 'translateX(0)',
  },
})

export const TimePicker = styled('div', {
  borderLeft: '1px solid $gray600',
  padding: '$6 $6 0',
  overflowY: 'auto',

  position: 'absolute',
  top: 0,
  bottom: 0,
  right: 0,
  width: 280,

  animation: `${animationContainer} 300ms`,

  '@media (max-width: 900px)': {
    background: '$gray800',
  },
})

export const TimePickerHeader = styled('div', {
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'space-between',
})

export const TimePickerText = styled(Text, {
  fontWeight: '$medium',

  span: {
    color: '$gray200',
  },
})

export const XButton = styled('button', {
  border: 0,
  backgroundColor: '$gray800',
  cursor: 'pointer',
  color: '$gray100',
  borderRadius: '$sm',
  fontSize: '$sm',
  alignItems: 'center',
  paddingTop: '$1',

  '&:focus': {
    boxShadow: '0 0 0 2px $colors$gray100',
  },
})

export const TimePickerList = styled('div', {
  marginTop: '$3',
  display: 'grid',
  gridTemplateColumns: '1fr',
  gap: '$2',

  '@media (max-width: 900px)': {
    gridTemplateColumns: '2fr',
  },
})

export const TimePickerItem = styled('button', {
  border: 0,
  backgroundColor: '$gray600',
  padding: '$2 0',
  cursor: 'pointer',
  color: '$gray100',
  borderRadius: '$sm',
  fontSize: '$sm',
  lineHeight: '$base',

  '&:last-child': {
    marginBottom: '$6',
  },

  '&:disabled': {
    background: 'none',
    cursor: 'default',
    opacity: 0.4,
  },

  '&:not(:disabled):hover': {
    background: '$gray500',
  },

  '&:focus': {
    boxShadow: '0 0 0 2px $colors$gray100',
  },
})

export const ConfirmedScheduleContainer = styled('div', {
  position: 'absolute',
  width: '100%',
  padding: '$1',
  top: 0,
  left: 0,
  textAlign: 'center',

  background: '#00A300',

  [`> ${Text}`]: {
    fontWeight: 'bold',
  },
})
