import React, { useState } from 'react'
import { View, StyleSheet, ScrollView } from 'react-native'
import BackgroundWaves from 'src/components/BackgroundWaves'
import Link from '@/components/Form/Link'
import FormInput from '@/components/Form/FormInput'
import { KeyboardDismissView } from 'src/components/KeyboardDismissView'
import SocialButton from 'src/components/SocialButtons'
import AuthHeader from 'src/components/AuthHeader'
import { Typography } from 'src/components/Typography'
import FormButton from '@/components/Form/FormButton'
import { useTheme } from '@/context/ThemeContext'
import { useNavigation } from '@/hooks/useNavigation'
import TermsCheckbox from '@/components/Form/TermsCheckbox'
import { FormToast } from '@/components/Form/FormToast'
import { useFormToast } from '@/hooks/useFormToast'

export default function Register() {
    const navigation = useNavigation();
    const { theme } = useTheme()
    const { success, error, info, warning, toastConfig, visible, hideFormToast } = useFormToast()

    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [confirmPassword, setConfirmPassword] = useState('')
    const [termsChecked, setTermsChecked] = useState(false)
    const [loading, setLoading] = useState(false)

    const [passwordValidation, setPasswordValidation] = useState({
        length: false,
        hasUpperCase: false,
        hasLowerCase: false,
        hasNumbers: false,
        match: false
    })

    const validatePassword = (pwd: string) => {
        return {
            length: pwd.length >= 6,
            hasUpperCase: /[A-Z]/.test(pwd),
            hasLowerCase: /[a-z]/.test(pwd),
            hasNumbers: /\d/.test(pwd),
            match: pwd === confirmPassword
        }
    }

    const validateEmail = (email: string) => {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
        return emailRegex.test(email)
    }

    const handleRegister = async () => {
        const validation = validatePassword(password)
        if (!validation.hasUpperCase || !validation.hasLowerCase || !validation.hasNumbers) {
            warning('Use letras maiúsculas, minúsculas e números para uma senha mais segura')
            return
        }

        if (!termsChecked) {
            error('Você precisa aceitar os termos e condições')
            return
        }

        setLoading(true)

        try {
            setTimeout(() => {
                setLoading(false)
                success('Conta criada com sucesso!')

                setTimeout(() => {
                    navigation.navigate('Login')
                }, 1500)
            }, 1500)
        } catch (err) {
            setLoading(false)
            error('Erro ao criar conta. Tente novamente.')
        }
    }

    const handleEmailChange = (text: string) => {
        setEmail(text)
        if (toastConfig?.type === 'error' && toastConfig.message.includes('email')) {
            hideFormToast()
        }
    }

    const handlePasswordChange = (text: string) => {
        setPassword(text)
        const validation = validatePassword(text)
        setPasswordValidation(validation)

        if (toastConfig?.type === 'error' && toastConfig.message.includes('senha')) {
            hideFormToast()
        }
    }

    const handleConfirmPasswordChange = (text: string) => {
        setConfirmPassword(text)
        setPasswordValidation(prev => ({
            ...prev,
            match: password === text
        }))

        if (toastConfig?.type === 'error' && toastConfig.message.includes('Senhas não coincidem')) {
            hideFormToast()
        }
    }

    const handleTermsToggle = () => {
        setTermsChecked(!termsChecked)
        if (!termsChecked) {
            info('Termos e condições aceitos')
        }
    }

    const handleSocialLogin = (platform: string) => {
        info(`Conectando com ${platform}...`)
    }

    const handleEnter = () => {
        navigation.navigate('Login')
    }

    const isFormValid = () => {
        return (
            email &&
            validateEmail(email) &&
            password &&
            password.length >= 6 &&
            confirmPassword &&
            password === confirmPassword &&
            termsChecked
        )
    }
    return (
        <KeyboardDismissView>
            <View style={[styles.container, { backgroundColor: theme.background }]}>
                <BackgroundWaves theme={theme.waves} />

                <ScrollView
                    contentContainerStyle={styles.scrollContent}
                    showsVerticalScrollIndicator={false}
                    keyboardShouldPersistTaps="handled"
                >
                    <View style={styles.centerContainer}>
                        <View style={styles.header}>
                            <AuthHeader
                                title="Para se juntar a um novo mundo"
                                theme={theme}
                                logoType="icon-text"
                                logoIcon="account"
                                logoText="Cadastre-se"
                                iconSize={150}
                                iconColor={theme.text.primary}
                            />
                        </View>

                        {toastConfig && (
                            <FormToast
                                message={toastConfig.message}
                                type={toastConfig.type}
                                visible={visible}
                                duration={toastConfig.duration}
                                position="above-form"
                                onHide={hideFormToast}
                            />
                        )}

                        <View style={styles.form}>
                            <FormInput
                                label="Email"
                                placeholder="digite@email.com"
                                theme={theme}
                                variant="transparent"
                                value={email}
                                onChangeText={handleEmailChange}
                                autoCapitalize="none"
                                keyboardType="email-address"
                                autoFocus
                            />

                            <FormInput
                                label="Senha"
                                placeholder="Sua senha"
                                secureTextEntry
                                theme={theme}
                                variant="transparent"
                                value={password}
                                onChangeText={handlePasswordChange}
                            />
                            <View style={styles.validationContainer}>
                                <Typography
                                    variant="bodySmall"
                                    style={[
                                        styles.validationText,
                                        {
                                            color: password.length >= 6 ? theme.success : theme.text.secondary
                                        }
                                    ]}
                                >
                                    ✓ Mínimo 6 caracteres
                                </Typography>
                            </View>

                            <FormInput
                                label="Confirmar Senha"
                                placeholder="Confirme sua senha"
                                secureTextEntry
                                theme={theme}
                                variant="transparent"
                                value={confirmPassword}
                                onChangeText={handleConfirmPasswordChange}
                                leftIcon={confirmPassword ?
                                    (passwordValidation.match ? 'check-circle' : 'close-circle') :
                                    undefined
                                }
                            />
                            {confirmPassword && (
                                <Typography
                                    variant="bodySmall"
                                    style={[
                                        styles.validationText,
                                        {
                                            color: password === confirmPassword ? theme.success : theme.error
                                        }
                                    ]}
                                >
                                    {password === confirmPassword ? '✓ Senhas coincidem' : '✗ Senhas não coincidem'}
                                </Typography>
                            )}
                            <TermsCheckbox
                                theme={theme}
                                checked={termsChecked}
                                onToggle={handleTermsToggle}
                            />
                        </View>

                        <View style={styles.buttonContainer}>
                            <FormButton
                                title="Cadastrar"
                                onPress={handleRegister}
                                theme={theme}
                                variant="contained"
                                loading={loading}
                                disabled={!isFormValid()}
                                fullWidth
                                size="large"
                            />
                        </View>

                        <View style={styles.registerLink}>
                            <Typography
                                variant="bodyMedium"
                                style={{ color: theme.text.secondary }}
                            >
                                Já tem conta?
                            </Typography>
                            <Link
                                titulo="Entrar"
                                theme={theme}
                                onPress={handleEnter}
                            />
                        </View>

                        <View style={styles.dividerContainer}>
                            <View style={[styles.dividerLine, { backgroundColor: theme.input.border }]} />
                            <Typography
                                variant="bodySmall"
                                style={[styles.dividerText, { color: theme.text.secondary }]}
                            >
                                ou
                            </Typography>
                            <View style={[styles.dividerLine, { backgroundColor: theme.input.border }]} />
                        </View>

                        <View style={styles.socialSection}>
                            <Typography
                                variant="bodyMedium"
                                style={[styles.socialTitle, { color: theme.text.secondary }]}
                            >
                                Conecte-se de outras formas
                            </Typography>

                            <View style={styles.socialButtonsContainer}>
                                <SocialButton
                                    variant="facebook"
                                    theme={theme}
                                    source={require('src/assets/facebook.png')}
                                    onPress={() => handleSocialLogin('Facebook')}
                                />
                                <SocialButton
                                    variant="google"
                                    theme={theme}
                                    source={require('src/assets/google.png')}
                                    onPress={() => handleSocialLogin('Google')}
                                />
                                <SocialButton
                                    variant="instagram"
                                    theme={theme}
                                    source={require('src/assets/instagram.png')}
                                    onPress={() => handleSocialLogin('Instagram')}
                                />
                            </View>

                            <Typography
                                variant="bodySmall"
                                style={[styles.socialHint, { color: theme.text.secondary }]}
                            >
                                Cadastro rápido e seguro
                            </Typography>
                        </View>
                    </View>
                </ScrollView>
            </View>
        </KeyboardDismissView>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    scrollContent: {
        flexGrow: 1,
        justifyContent: 'center',
        paddingHorizontal: 24,
        paddingVertical: 40,
    },
    centerContainer: {
        justifyContent: 'center',
        alignItems: 'center',
        gap: 25,
    },

    header: {
        alignItems: 'center',
        marginBottom: 40,
    },
    form: {
        width: '100%',
        gap: 16,
        marginBottom: 20,
    },
    validationContainer: {
        width: '100%',
        marginTop: 2,
    },
    validationText: {
        fontSize: 12,
    },

    buttonContainer: {
        width: '100%',
        marginTop: 10,
    },
    registerLink: {
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        gap: 8,
        marginTop: 10,
    },
    dividerContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        width: '100%',
        marginTop: 20,
    },
    dividerLine: {
        flex: 1,
        height: 1,
        opacity: 0.5,
    },
    dividerText: {
        marginHorizontal: 15,
        fontSize: 14,
    },
    socialSection: {
        alignItems: 'center',
        width: '100%',
        gap: 15,
    },
    socialTitle: {
        marginBottom: 5,
        textAlign: 'center',
    },
    socialButtonsContainer: {
        flexDirection: 'row',
        justifyContent: 'center',
        gap: 20,
        width: '100%',
    },
    socialHint: {
        textAlign: 'center',
        fontSize: 12,
        fontStyle: 'italic',
    },
})