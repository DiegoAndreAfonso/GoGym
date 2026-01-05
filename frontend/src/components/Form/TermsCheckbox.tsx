import React, { useState } from 'react'
import {
  View,
  StyleSheet,
  Pressable,
} from 'react-native'
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons'
import { AppTheme } from 'src/@types/colors'
import { Typography } from 'src/components/Typography'
import Link from './Link'
import DialogTerms from '../Dialogs/DialogTerms'
import { TextVariant, FontStyles } from 'src/@types/typography'

type Props = {
  theme: AppTheme
  checked?: boolean
  onToggle?: (checked: boolean) => void
  disabled?: boolean
  typography?: {
    variant?: TextVariant
    fontStyle?: keyof typeof FontStyles
  }
  onPrivacyPress?: () => void
}

export default function TermsCheckbox({
  theme,
  checked = false,
  onToggle,
  disabled = false,
  typography,
  onPrivacyPress,
}: Props) {
  const [dialogVisible, setDialogVisible] = useState(false)

  const toggle = () => {
    if (disabled) return
    onToggle?.(!checked)
  }

  const handleDialogClose = (accepted: boolean) => {
    setDialogVisible(false)
    if (accepted) {
      onToggle?.(true)
    }
  }

  return (
    <>
      <Pressable
        onPress={toggle}
        disabled={disabled}
        style={styles.container}
      >
        <View
          style={[
            styles.checkbox,
            {
              borderColor: disabled
                ? `${theme.text.primary}40`
                : checked
                ? theme.text.link
                : theme.text.primary,
            },
            checked && styles.checkboxChecked,
            disabled && styles.checkboxDisabled,
          ]}
        >
          {checked && (
            <MaterialCommunityIcons
              name="check"
              size={16}
              color={theme.text.link}
            />
          )}
        </View>

        <View style={styles.labelContainer}>
          <Typography
            variant={typography?.variant || 'bodyMedium'}
            color={disabled ? theme.text.disabled : theme.text.primary}
            style={styles.label}
          >
            Eu concordo com os{' '}
          </Typography>

          <Link
            titulo="termos de uso"
            theme={theme}
            onPress={(e) => {
              e?.stopPropagation()
              setDialogVisible(true)
            }}
            typography={{
              variant: typography?.variant || 'bodyMedium',
              color: theme.text.link,
              style: styles.link,
            }}
          />

         
         
        </View>
      </Pressable>

      <DialogTerms
        visible={dialogVisible}
        onClose={handleDialogClose}
        theme={theme}
      />
    </>
  )
}
const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    flexWrap: 'wrap',
  },
  checkbox: {
    width: 20,
    height: 20,
    borderRadius: 4,
    borderWidth: 2,
    justifyContent: 'center',
    alignItems: 'center',
    flexShrink: 0,
  },
  checkboxChecked: {
    backgroundColor: 'transparent',
  },
  checkboxDisabled: {
    opacity: 0.5,
  },
  labelContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    alignItems: 'center',
    flex: 1,
  },
  label: {
    fontSize: 14,
    lineHeight: 20,
  },
  link: {
    textDecorationLine: 'underline',
    marginHorizontal: 2,
  },
})
