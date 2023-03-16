import { Box, Button, Heading, styled, Text } from '@doctor-ui/react'

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
  alignItems: 'center',
  justifyContent: 'center',
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
