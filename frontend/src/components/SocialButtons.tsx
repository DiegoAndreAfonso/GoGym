import { Image, Pressable, StyleSheet } from 'react-native'
import { AppTheme } from 'src/@types/colors'

type Props = {
  source: any
  theme: AppTheme
  variant: 'google' | 'facebook' | 'instagram'
  onPress?: () => void
}

export default function SocialButton({
  source,
  theme,
  variant,
  onPress,
}: Props) {
  const colors = theme.social[variant]

  return (
    <Pressable onPress={onPress} style={({ pressed }) => [
      styles.wrapper,
      {
        backgroundColor: colors.background,
        borderColor: colors.border,
        opacity: pressed ? 0.7 : 1,
      },
    ]}>
      <Image source={source} style={styles.icon} />
    </Pressable>
  )
}

const styles = StyleSheet.create({
  wrapper: {
    width: 44,
    height: 44,
    borderRadius: 22,
    borderWidth: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  icon: {
    width: 22,
    height: 22,
  },
})
