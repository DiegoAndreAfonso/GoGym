import React, { useState, useRef, useEffect } from 'react'
import { View, StyleSheet, ScrollView, TextInput } from 'react-native'
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

    const [step, setStep] = useState(1) 
    const [loading, setLoading] = useState(false)

    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [confirmPassword, setConfirmPassword] = useState('')
    const [termsChecked, setTermsChecked] = useState(false)

    const [code, setCode] = useState(['', '', '', '', '', ''])
    const [countdown, setCountdown] = useState(0)
    const [timer, setTimer] = useState<NodeJS.Timeout | null>(null)
    const [shakeCodeInputs, setShakeCodeInputs] = useState(false)
    const inputRefs = useRef<Array<TextInput | null>>([])

    const [passwordValidation, setPasswordValidation] = useState({
        length: false,
        hasUpperCase: false,
        hasLowerCase: false,
        hasNumbers: false,
        match: false
    })

    useEffect(() => {
        return () => {
            if (timer) {
                clearInterval(timer)
            }
        }
    }, [timer])

    useEffect(() => {
        if (step === 2) {
            setTimeout(() => {
                inputRefs.current[0]?.focus()
            }, 100)
        }
    }, [step])

    const startCountdown = () => {
        setCountdown(60)

        if (timer) {
            clearInterval(timer)
        }

        const newTimer = setInterval(() => {
            setCountdown(prev => {
                if (prev <= 1) {
                    clearInterval(newTimer)
                    return 0
                }
                return prev - 1
            })
        }, 1000)

        setTimer(newTimer)
    }

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

    const handleSendData = async () => {
        if (!validateEmail(email)) {
            error('Por favor, insira um email válido')
            return
        }

        const validation = validatePassword(password)
        if (!validation.hasUpperCase || !validation.hasLowerCase || !validation.hasNumbers) {
            warning('Use letras maiúsculas, minúsculas e números para uma senha mais segura')
            return
        }

        if (password !== confirmPassword) {
            error('As senhas não coincidem')
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
                setStep(2) 
                startCountdown() 
                success('Código de verificação enviado! Verifique seu email.')
            }, 1500)
        } catch (err) {
            setLoading(false)
            error('Erro ao enviar dados. Tente novamente.')
        }
    }

    const handleVerifyCode = async () => {
        const fullCode = code.join('')

        if (fullCode.length !== 6) {
            error('Por favor, preencha todos os dígitos do código')
            return
        }

        setLoading(true)

        try {
            setTimeout(() => {
                setLoading(false)
                
                if (fullCode === '123456') {
                    success('Email verificado com sucesso!')
                    
                    setTimeout(() => {
                        navigation.navigate('Login', { 
                            emailVerified: true,
                            
                        })
                    }, 1500)
                } else {
                    error('Código inválido. Tente novamente.')
                    setShakeCodeInputs(true)
                    setTimeout(() => setShakeCodeInputs(false), 1000)
                }
            }, 1000)
        } catch (err) {
            setLoading(false)
            error('Erro ao verificar código. Tente novamente.')
        }
    }

    const handleResendCode = () => {
        if (countdown > 0) {
            info(`Aguarde ${countdown} segundos para reenviar`)
            return
        }

        setLoading(true)
        setTimeout(() => {
            setLoading(false)
            startCountdown()
            success('Código reenviado com sucesso!')
        }, 1000)
    }

    const handleBack = () => {
        if (step === 2) {
            setStep(1)
            setCode(['', '', '', '', '', ''])
            info('Voltando para editar dados')
        }
    }

    const handleCodeChange = (text: string, index: number) => {
        const numericText = text.replace(/[^0-9]/g, '')

        if (text === '') {
            const newCode = [...code]
            newCode[index] = ''
            setCode(newCode)

            if (index > 0) {
                inputRefs.current[index - 1]?.focus()
            }
            return
        }

        if (numericText.length === 6) {
            const newCode = numericText.split('')
            setCode(newCode)

            inputRefs.current[5]?.focus()
            return
        }

        const newCode = [...code]
        newCode[index] = numericText.slice(0, 1)

        if (numericText.length > 1) {
            for (let i = 0; i < numericText.length && (index + i) < 6; i++) {
                newCode[index + i] = numericText[i]
            }

            const nextIndex = Math.min(index + numericText.length, 5)
            inputRefs.current[nextIndex]?.focus()
        } else if (numericText && index < 5) {
            inputRefs.current[index + 1]?.focus()
        }

        setCode(newCode)
    }

    const handleKeyPress = (event: any, index: number) => {
        if (event.nativeEvent.key === 'Backspace' && code[index] === '' && index > 0) {
            inputRefs.current[index - 1]?.focus()
        }
    }

    const handleFocus = (index: number) => {
        const input = inputRefs.current[index]
        if (input) {
            input.setNativeProps({
                selection: {
                    start: 0,
                    end: code[index].length
                }
            })
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

    const getStepIcon = () => {
        switch (step) {
            case 1:
                return { icon: "account", text: "Cadastre-se" }
            case 2:
                return { icon: "email-check", text: "Verificar Email" }
            default:
                return { icon: "account", text: "Cadastre-se" }
        }
    }

    const getStepTitle = () => {
        switch (step) {
            case 1:
                return "Para se juntar a um novo mundo"
            case 2:
                return "Verifique seu email"
            default:
                return "Para se juntar a um novo mundo"
        }
    }

    const getInstructionText = () => {
        switch (step) {
            case 1:
                return "Preencha seus dados para criar uma conta"
            case 2:
                return `Enviamos um código de 6 dígitos para:\n${email}`
            default:
                return ""
        }
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
                                title={getStepTitle()}
                                theme={theme}
                                logoType="icon-text"
                                logoIcon={getStepIcon().icon}
                                logoText={getStepIcon().text}
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

                        <View style={styles.instructionContainer}>
                            <Typography
                                variant="bodyMedium"
                                style={[styles.instructionText, { color: theme.text.primary }]}
                            >
                                {getInstructionText()}
                            </Typography>
                        </View>

                        {step === 1 && (
                            <>
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
                                        title="Continuar"
                                        onPress={handleSendData}
                                        theme={theme}
                                        variant="contained"
                                        loading={loading}
                                        disabled={!isFormValid()}
                                        fullWidth
                                        size="large"
                                    />
                                </View>
                            </>
                        )}

                        {step === 2 && (
                            <>
                                <View style={styles.codeContainer}>
                                    <Typography
                                        variant="bodySmall"
                                        style={[styles.codeLabel, { color: theme.text.primary }]}
                                    >
                                        Digite o código de 6 dígitos:
                                    </Typography>

                                    <View style={styles.codeInputsContainer}>
                                        {code.map((digit, index) => (
                                            <View
                                                key={index}
                                                style={[
                                                    styles.codeInputWrapper,
                                                    {
                                                        borderColor: digit ? theme.success : theme.input.border,
                                                        borderWidth: digit ? 2 : 1,
                                                        backgroundColor: theme.background,
                                                        transform: shakeCodeInputs ?
                                                            [{ translateX: index % 2 === 0 ? 5 : -5 }] :
                                                            [{ translateX: 0 }]
                                                    }
                                                ]}
                                            >
                                                <TextInput
                                                    ref={ref => {
                                                        inputRefs.current[index] = ref
                                                    }}
                                                    style={[
                                                        styles.codeInput,
                                                        {
                                                            color: theme.text.primary,
                                                        }
                                                    ]}
                                                    value={digit}
                                                    onChangeText={(text) => handleCodeChange(text, index)}
                                                    onKeyPress={(event) => handleKeyPress(event, index)}
                                                    onFocus={() => handleFocus(index)}
                                                    keyboardType="number-pad"
                                                    maxLength={6}
                                                    caretHidden={true}
                                                    selectionColor="transparent"
                                                    contextMenuHidden={true}
                                                />
                                            </View>
                                        ))}
                                    </View>

                                    <View style={styles.countdownContainer}>
                                        {countdown > 0 ? (
                                            <Typography
                                                variant="bodySmall"
                                                style={{ color: theme.text.secondary }}
                                            >
                                                Reenviar código em {countdown}s
                                            </Typography>
                                        ) : (
                                            <Link
                                                titulo="Reenviar código"
                                                theme={theme}
                                                onPress={handleResendCode}
                                            />
                                        )}
                                    </View>

                                    <Typography
                                        variant="bodySmall"
                                        style={[styles.codeHint, { color: theme.text.secondary }]}
                                    >
                                        Dica: Você pode colar o código completo
                                    </Typography>
                                </View>

                                <View style={styles.buttonContainer}>
                                    <FormButton
                                        title="Verificar e Criar Conta"
                                        onPress={handleVerifyCode}
                                        theme={theme}
                                        variant="contained"
                                        loading={loading}
                                        disabled={code.join('').length !== 6}
                                        fullWidth
                                        size="large"
                                    />
                                </View>

                                <View style={styles.backButtonContainer}>
                                    <FormButton
                                        title="Voltar para Editar Dados"
                                        onPress={handleBack}
                                        theme={theme}
                                        variant="outlined"
                                        fullWidth
                                        size="medium"
                                    />
                                </View>
                            </>
                        )}

                        {step === 1 && (
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
                        )}

                        {step === 1 && (
                            <>
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
                            </>
                        )}

                        <View style={styles.progressContainer}>
                            <View style={styles.progressBar}>
                                {[1, 2].map((stepNumber) => (
                                    <View
                                        key={stepNumber}
                                        style={[
                                            styles.progressDot,
                                            {
                                                backgroundColor: step >= stepNumber ? theme.success : theme.input.border,
                                                width: step >= stepNumber ? 12 : 8,
                                                height: step >= stepNumber ? 12 : 8,
                                            }
                                        ]}
                                    />
                                ))}
                            </View>
                            <Typography
                                variant="bodySmall"
                                style={[styles.progressText, { color: theme.text.secondary }]}
                            >
                                Passo {step} de 2
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
        marginBottom: 20,
    },
    instructionContainer: {
        width: '100%',
        alignItems: 'center',
        marginBottom: 10,
    },
    instructionText: {
        textAlign: 'center',
        lineHeight: 22,
        paddingHorizontal: 10,
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
    backButtonContainer: {
        width: '100%',
        marginTop: 5,
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
    // Estilos para verificação de código
    codeContainer: {
        width: '100%',
        alignItems: 'center',
        gap: 20,
    },
    codeLabel: {
        textAlign: 'center',
        marginBottom: 10,
    },
    codeHint: {
        textAlign: 'center',
        fontSize: 12,
        marginTop: 5,
        fontStyle: 'italic',
    },
    codeInputsContainer: {
        flexDirection: 'row',
        justifyContent: 'center',
        gap: 10,
        width: '100%',
    },
    codeInputWrapper: {
        width: 50,
        height: 60,
        borderRadius: 12,
        justifyContent: 'center',
        alignItems: 'center',
    },
    codeInput: {
        width: '100%',
        height: '100%',
        textAlign: 'center',
        padding: 0,
        fontSize: 24,
        fontWeight: 'bold',
    },
    countdownContainer: {
        marginTop: 10,
    },
    progressContainer: {
        alignItems: 'center',
        gap: 10,
        marginTop: 20,
    },
    progressBar: {
        flexDirection: 'row',
        gap: 15,
        alignItems: 'center',
    },
    progressDot: {
        borderRadius: 6,
    },
    progressText: {
        fontSize: 12,
    },
})