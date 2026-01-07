import React, { useState } from 'react'
import { View, StyleSheet, Pressable, StyleProp, ViewStyle } from 'react-native'
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons'
import { AppTheme } from 'src/@types/colors'
import { Typography } from 'src/components/Typography'
import { TextVariant, FontStyles } from 'src/@types/typography'

type RememberMeProps = {
  theme: AppTheme
  checked?: boolean
  onToggle?: (checked: boolean) => void
  label?: string
  labelTypography?: {
    variant?: TextVariant
    fontStyle?: keyof typeof FontStyles
    color?: string
    style?: StyleProp<ViewStyle>
  }
  disabled?: boolean
  testID?: string
}

export default function RememberMe({
  theme,
  checked = false,
  onToggle,
  label = 'Lembre de mim',
  labelTypography,
  disabled = false,
  testID,
}: RememberMeProps) {
  const [isChecked, setIsChecked] = useState(checked)

  const handleToggle = () => {
    if (disabled) return
    
    const newValue = !isChecked
    setIsChecked(newValue)
    onToggle?.(newValue)
  }

  const getCheckboxColor = () => {
    if (disabled) return `${theme.text.primary}40`
    return isChecked ? theme.text.link : theme.text.primary
  }

  const getLabelColor = () => {
    if (disabled) return theme.text.disabled
    return labelTypography?.color ?? theme.text.primary
  }

  return (
    <Pressable
      onPress={handleToggle}
      disabled={disabled}
      style={styles.container}
      testID={testID}
    >
      <View style={[
        styles.checkbox,
        { borderColor: getCheckboxColor() },
        isChecked && styles.checkboxChecked,
        disabled && styles.checkboxDisabled
      ]}>
        {isChecked && (
          <MaterialCommunityIcons
            name="check"
            size={16}
            color={theme.text.link}
          />
        )}
      </View>
      
      <Typography
        variant={labelTypography?.variant || 'bodyMedium'}
        fontStyle={labelTypography?.fontStyle}
        color={getLabelColor()}
        style={[styles.label, labelTypography?.style]}
      >
        {label}
      </Typography>
    </Pressable>
  )
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  checkbox: {
    width: 20,
    height: 20,
    borderRadius: 4,
    borderWidth: 2,
    justifyContent: 'center',
    alignItems: 'center',
  },
  checkboxChecked: {
    backgroundColor: 'transparent',
  },
  checkboxDisabled: {
    opacity: 0.5,
  },
  label: {
    fontSize: 14,
  },
})

export function RememberMeControlled({
  checked,
  onToggle,
  ...props
}: RememberMeProps & {
  checked: boolean
  onToggle: (checked: boolean) => void
}) {
  return <RememberMe checked={checked} onToggle={onToggle} {...props} />
}