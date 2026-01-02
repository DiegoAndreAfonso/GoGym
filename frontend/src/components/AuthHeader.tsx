import React from 'react'
import { View, Image, StyleSheet, ImageSourcePropType } from 'react-native'
import { AppTheme, lightTheme } from 'src/@types/colors'
import { Typography } from 'src/components/Typography'

type Props = {
  title: string
  theme: AppTheme
}

export default function AuthHeader({ title, theme }: Props) {

  return (
    <View style={styles.container}>
      <Typography variant="displayLarge" style={{ color: theme.text.primary }}>GoGym</Typography>

      <Typography variant="bodyLarge" style={{ color: theme.text.primary }}>
        {title}
      </Typography>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    marginBottom: 24,
  },
  image: {
    width: 280,
    height: 280,
    marginBottom: -80,
  },
  text: {
    fontSize: 20,
    textAlign: 'center',
  },
})