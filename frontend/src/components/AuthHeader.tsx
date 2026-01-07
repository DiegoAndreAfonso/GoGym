import React from 'react'
import { 
  View, 
  Image, 
  StyleSheet, 
  ImageSourcePropType,
  StyleProp,
  ViewStyle 
} from 'react-native'
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons'
import { AppTheme } from 'src/@types/colors'
import { Typography } from 'src/components/Typography'

type AuthHeaderProps = {
  title: string
  theme: AppTheme
  // Opções de logo
  logoType?: 'text' | 'icon' | 'image' | 'text-icon' | 'icon-text' | 'icon-over-text'
  logoText?: string
  logoIcon?: string
  logoImage?: ImageSourcePropType
  iconSize?: number
  iconColor?: string
  textSize?: 'large' | 'medium' | 'small' | 'custom' // Nova prop para controlar tamanho do texto
  customTextSize?: number // Tamanho customizado se textSize for 'custom'
  iconPosition?: 'left' | 'right' | 'top' | 'bottom' | 'over'
  gap?: number
  showDivider?: boolean
  dividerPosition?: 'top' | 'bottom' | 'both'
  style?: StyleProp<ViewStyle>
  logoStyle?: StyleProp<ViewStyle>
  overlayOffset?: number
  iconBackground?: boolean
}

export default function AuthHeader({ 
  title, 
  theme,
  logoType = 'text',
  logoText = 'GoGym',
  logoIcon = 'dumbbell',
  logoImage,
  iconSize = 80,
  iconColor,
  textSize = 'large', 
  customTextSize = 32,
  iconPosition = 'top',
  gap = 2,
  showDivider = false,
  dividerPosition = 'bottom',
  style,
  logoStyle,
  overlayOffset = -10,
  iconBackground = false
}: AuthHeaderProps) {

  const getIconColor = () => iconColor || theme.text.primary

  const getTextSize = () => {
    if (textSize === 'custom') {
      return customTextSize
    }
    
    if (logoType === 'text') {
      return textSize === 'large' ? 90 : 
             textSize === 'medium' ? 30 : 
             24
    }
    
    const hasIcon = ['text-icon', 'icon-text', 'icon-over-text'].includes(logoType)
    if (hasIcon) {
      return textSize === 'large' ? 28 : 
             textSize === 'medium' ? 24 : 
             20
    }
    
    return 32
  }

  const getTextVariant = () => {
    const size = getTextSize()
    if (size >= 36) return 'displayLarge'
    if (size >= 32) return 'headlineLarge'
    if (size >= 28) return 'headlineMedium'
    if (size >= 24) return 'titleLarge'
    return 'titleMedium'
  }

  const renderLogoContent = () => {
    const currentTextSize = getTextSize()
    const textStyle = { fontSize: currentTextSize, color: theme.text.primary }
    
    switch (logoType) {
      case 'icon':
        return (
          <MaterialCommunityIcons
            name={logoIcon}
            size={iconSize}
            color={getIconColor()}
          />
        )
      
      case 'image':
        return logoImage ? (
          <Image 
            source={logoImage} 
            style={[styles.image, { width: iconSize, height: iconSize }]}
            resizeMode="contain"
          />
        ) : null
      
      case 'text-icon':
      case 'icon-text':
        const isIconFirst = logoType === 'icon-text'
        
        return (
          <View style={[
            styles.row,
            iconPosition === 'right' && styles.rowReverse,
            iconPosition === 'top' && styles.column,
            iconPosition === 'bottom' && styles.columnReverse,
            { gap }
          ]}>
            {isIconFirst ? (
              <>
                <MaterialCommunityIcons
                  name={logoIcon}
                  size={iconSize}
                  color={getIconColor()}
                />
                <Typography 
                  variant={getTextVariant()} 
                  style={textStyle}
                >
                  {logoText}
                </Typography>
              </>
            ) : (
              <>
                <Typography 
                  variant={getTextVariant()} 
                  style={textStyle}
                >
                  {logoText}
                </Typography>
                <MaterialCommunityIcons
                  name={logoIcon}
                  size={iconSize}
                  color={getIconColor()}
                />
              </>
            )}
          </View>
        )
      
      case 'icon-over-text':
        return (
          <View style={styles.overlayContainer}>
            <View style={[
              styles.iconOverlayWrapper,
              { marginBottom: overlayOffset }
            ]}>
              {iconBackground && (
                <View style={[
                  styles.iconBackground,
                  { backgroundColor: theme.background + '80' }
                ]} />
              )}
              <MaterialCommunityIcons
                name={logoIcon}
                size={iconSize}
                color={getIconColor()}
                style={styles.iconOverlay}
              />
            </View>
            <Typography 
              variant={getTextVariant()} 
              style={[
                styles.textUnderIcon,
                textStyle
              ]}
            >
              {logoText}
            </Typography>
          </View>
        )
      
      case 'text':
      default:
        return (
          <Typography 
            variant={getTextVariant()} 
            style={textStyle}
          >
            {logoText}
          </Typography>
        )
    }
  }

  const renderLogo = () => {
    const content = renderLogoContent()
    
    if (!content) return null
    
    return (
      <View style={[styles.logoContainer, logoStyle]}>
        {content}
      </View>
    )
  }

  const renderDivider = (position: 'top' | 'bottom') => {
    if (!showDivider || (dividerPosition !== position && dividerPosition !== 'both')) {
      return null
    }
    
    return (
      <View style={[
        styles.divider, 
        position === 'top' ? styles.dividerTop : styles.dividerBottom,
        { backgroundColor: theme.input.border }
      ]} />
    )
  }

  return (
    <View style={[styles.container, style]}>
      {renderDivider('top')}
      
      {renderLogo()}
      
      <Typography 
        variant="bodyLarge" 
        style={[styles.title, { color: theme.text.primary }]}
      >
        {title}
      </Typography>
      
      {renderDivider('bottom')}
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    marginBottom: 6,
    gap: 6,
  },
  logoContainer: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  rowReverse: {
    flexDirection: 'row-reverse',
  },
  column: {
    flexDirection: 'column',
    alignItems: 'center',
  },
  columnReverse: {
    flexDirection: 'column-reverse',
    alignItems: 'center',
  },
  overlayContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative',
  },
  iconOverlayWrapper: {
    position: 'relative',
    zIndex: 2,
  },
  iconOverlay: {
  },
  textUnderIcon: {
    position: 'relative',
    zIndex: 1,
    textAlign: 'center',
  },
  iconBackground: {
    position: 'absolute',
    width: 100,
    height: 100,
    borderRadius: 50,
    zIndex: -1,
  },
  image: {
    marginBottom: 8,
  },
  title: {
    textAlign: 'center',
    paddingHorizontal: 20,
    marginTop: 4,
  },
  divider: {
    width: '80%',
    height: 1,
    opacity: 0.5,
  },
  dividerTop: {
    marginBottom: 2,
  },
  dividerBottom: {
    marginTop: 2,
  },
})

export function AuthHeaderTextOnly({ 
  title, 
  theme,
  logoText = 'GoGym',
  textSize = 'large',
  ...props 
}: Omit<AuthHeaderProps, 'logoType' | 'logoIcon'>) {
  return (
    <AuthHeader
      title={title}
      theme={theme}
      logoType="text"
      logoText={logoText}
      textSize={textSize}
      {...props}
    />
  )
}

export function AuthHeaderWithIcon({ 
  title, 
  theme,
  logoText = 'GoGym',
  logoIcon = 'dumbbell',
  iconSize = 80,
  textSize = 'medium',
  ...props 
}: Omit<AuthHeaderProps, 'logoType'>) {
  return (
    <AuthHeader
      title={title}
      theme={theme}
      logoType="icon-text"
      logoText={logoText}
      logoIcon={logoIcon}
      iconSize={iconSize}
      textSize={textSize}
      {...props}
    />
  )
}

export function AuthHeaderIconOverText({ 
  title, 
  theme,
  logoText = 'GoGym',
  logoIcon = 'dumbbell',
  iconSize = 80,
  textSize = 'medium', 
  overlayOffset = -15,
  ...props 
}: Omit<AuthHeaderProps, 'logoType'>) {
  return (
    <AuthHeader
      title={title}
      theme={theme}
      logoType="icon-over-text"
      logoText={logoText}
      logoIcon={logoIcon}
      iconSize={iconSize}
      textSize={textSize}
      overlayOffset={overlayOffset}
      {...props}
    />
  )
}