import React, { useState, useRef, useEffect } from 'react'
import { View, StyleSheet, TextInput, ScrollView } from 'react-native'
import BackgroundWaves from 'src/components/BackgroundWaves'
import Link from '@/components/Form/Link'
import FormInput from '@/components/Form/FormInput'
import { KeyboardDismissView } from 'src/components/KeyboardDismissView'
import AuthHeader from 'src/components/AuthHeader'
import { Typography } from 'src/components/Typography'
import FormButton from '@/components/Form/FormButton'
import { useTheme } from '@/context/ThemeContext'
import { useNavigation } from '@/hooks/useNavigation'
import { useFormToast } from '@/hooks/useFormToast'
import { FormToast } from '@/components/Form/FormToast'

export default function ForgotPassword() {
    const navigation = useNavigation()
    const { theme } = useTheme()
    const { success, error, info, warning, toastConfig, visible, hideFormToast } = useFormToast()
    const [email, setEmail] = useState('')
    const [loading, setLoading] = useState(false)
    const [code, setCode] = useState(['', '', '', '', '', ''])
    const [newPassword, setNewPassword] = useState('')
    const [confirmPassword, setConfirmPassword] = useState('')
    const [step, setStep] = useState(1)
    const [countdown, setCountdown] = useState(0)
    const [timer, setTimer] = useState<NodeJS.Timeout | null>(null)
    const inputRefs = useRef<Array<TextInput | null>>([])
    const [shakeCodeInputs, setShakeCodeInputs] = useState(false)


    const [passwordValidation, setPasswordValidation] = useState({
        length: false,
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

    const handleSendCode = async () => {
        if (!email.includes('@')) {
            error('Por favor, insira um email válido')
            return
        }

        setLoading(true)

        try {
            setTimeout(() => {
                setLoading(false)
                setStep(2)
                startCountdown()
                success('Código enviado com sucesso! Verifique seu email.')
            }, 1500)
        } catch (err) {
            setLoading(false)
            error('Erro ao enviar código. Tente novamente.')
        }
    }
    const handleBackToLogin = () => {
    info('Redirecionando para login...')
    navigation.navigate('Login')
}

    const handleResendCode = () => {
        if (countdown > 0) {
            info(`Aguarde ${countdown} segundos para reenviar`)
            return
        }

        startCountdown()
        success('Código reenviado com sucesso!')
    }

    const handleVerifyCode = () => {
        const fullCode = code.join('')

        if (fullCode.length !== 6) {
            error('Por favor, preencha todos os dígitos do código')
            return
        }

        setLoading(true)

        setTimeout(() => {
            setLoading(false)
            if (fullCode === '123456') {
                setStep(3)
            } else {
                error('Código inválido. Tente novamente.')
                setShakeCodeInputs(true)
                setTimeout(() => setShakeCodeInputs(false), 1000)
            }
        }, 1000)
    }

    const handleChangePassword = () => {
    if (newPassword.length < 6) {
        error('A senha deve ter pelo menos 6 caracteres')
        return
    }

    if (newPassword !== confirmPassword) {
        error('As senhas não coincidem')
        return
    }

    setLoading(true)

    setTimeout(() => {
        setLoading(false)
        success('Senha alterada com sucesso!')

        setTimeout(() => {
            navigation.navigate('Login', { passwordChanged: true })
        }, 1500)
    }, 1500)
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

    const handleBack = () => {
        if (step === 2) {
            setStep(1)
            setCode(['', '', '', '', '', ''])
            info('Voltando para o passo anterior')
        } else if (step === 3) {
            setStep(2)
            setNewPassword('')
            setConfirmPassword('')
            info('Voltando para verificação de código')
        }
    }

    const getStepIcon = () => {
        switch (step) {
            case 1:
                return { icon: "email", text: "Redefinir Senha" }
            case 2:
                return { icon: "lock", text: "Codigo de Verificacao" }
            case 3:
                return { icon: "key", text: "Nova Senha" }
            default:
                return { icon: "email", text: "Redefinir Senha" }
        }
    }

    const getStepTitle = () => {
        switch (step) {
            case 1:
                return "Recuperar sua senha"
            case 2:
                return "Verifique seu email"
            case 3:
                return "Crie uma nova senha"
            default:
                return "Recuperar sua senha"
        }
    }

    const getInstructionText = () => {
        switch (step) {
            case 1:
                return "Digite seu email cadastrado para receber um código de recuperação."
            case 2:
                return `Enviamos um código de 6 dígitos para:\n${email}`
            case 3:
                return "Crie uma nova senha segura para sua conta."
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
                    <View style={styles.mainContent}>
                        <View style={styles.header}>
                            <AuthHeader
                                title={getStepTitle()}
                                theme={theme}
                                logoType="icon-text"
                                logoIcon={getStepIcon().icon}
                                logoText={getStepIcon().text}
                                iconSize={120}
                                iconColor={theme.text.primary}
                            />
                        </View>

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
                                        onChangeText={setEmail}
                                        autoCapitalize="none"
                                        keyboardType="email-address"
                                    />
                                </View>

                                <View style={styles.buttonContainer}>
                                    <FormButton
                                        title="Enviar Código"
                                        onPress={handleSendCode}
                                        theme={theme}
                                        variant="contained"
                                        loading={loading}
                                        disabled={!email.includes('@')}
                                        fullWidth
                                        size="large"
                                    />
                                </View>
                            </>
                        )}

                        {step === 2 && (
                            <>
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
                                                style={{ color: theme.text.primary }}
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
                                        style={[styles.codeHint, { color: theme.text.primary }]}
                                    >
                                        Dica: Você pode colar o código completo
                                    </Typography>
                                </View>

                                <View style={styles.buttonContainer}>
                                    <FormButton
                                        title="Verificar Código"
                                        onPress={handleVerifyCode}
                                        theme={theme}
                                        variant="contained"
                                        loading={loading}
                                        disabled={code.join('').length !== 6}
                                        fullWidth
                                        size="large"
                                    />
                                </View>
                            </>
                        )}

                        {step === 3 && (
                            <>
                                <View style={styles.form}>
                                    <FormInput
                                        label="Nova Senha"
                                        placeholder="Mínimo 6 caracteres"
                                        theme={theme}
                                        variant="transparent"
                                        value={newPassword}
                                        onChangeText={(text) => {
                                            setNewPassword(text)
                                            setPasswordValidation(prev => ({
                                                ...prev,
                                                length: text.length >= 6
                                            }))
                                        }}
                                        secureTextEntry
                                    />
                                    <View style={styles.validationContainer}>
                                        <Typography
                                            variant="bodySmall"
                                            style={[
                                                styles.validationText,
                                                {
                                                    color: newPassword.length >= 6 ? theme.success : theme.text.secondary
                                                }
                                            ]}
                                        >
                                            ✓ Mínimo 6 caracteres
                                        </Typography>
                                    </View>

                                    <FormInput
                                        label="Confirmar Nova Senha"
                                        placeholder="Digite a senha novamente"
                                        theme={theme}
                                        variant="transparent"
                                        value={confirmPassword}
                                        onChangeText={(text) => {
                                            setConfirmPassword(text)
                                            setPasswordValidation(prev => ({
                                                ...prev,
                                                match: newPassword === text
                                            }))
                                        }}
                                        leftIcon={confirmPassword ?
                                            (passwordValidation.match ? 'check-circle' : 'close-circle') :
                                            undefined
                                        }
                                        secureTextEntry
                                    />
                                    <View style={styles.validationContainer}>
                                        {confirmPassword && (
                                            <Typography
                                                variant="bodySmall"
                                                style={[
                                                    styles.validationText,
                                                    {
                                                        color: newPassword === confirmPassword ? theme.success : theme.error
                                                    }
                                                ]}
                                            >
                                                {newPassword === confirmPassword ? '✓ Senhas coincidem' : '✗ Senhas não coincidem'}
                                            </Typography>
                                        )}
                                    </View>
                                </View>

                                <View style={styles.buttonContainer}>
                                    <FormButton
                                        title="Alterar Senha"
                                        onPress={handleChangePassword}
                                        theme={theme}
                                        variant="contained"
                                        loading={loading}
                                        disabled={!newPassword || !confirmPassword || !passwordValidation.match}
                                        fullWidth
                                        size="large"
                                    />
                                </View>
                            </>
                        )}

                        {(step === 2 || step === 3) && (
                            <View style={styles.backButtonContainer}>
                                <FormButton
                                    title="Voltar"
                                    onPress={handleBack}
                                    theme={theme}
                                    variant="outlined"
                                    fullWidth
                                    size="medium"
                                />
                            </View>
                        )}
                    </View>
                    {step === 1 && (
                        <View style={styles.loginLinkContainer}>
                            <Typography
                                variant="bodyMedium"
                                style={{ color: theme.text.secondary }}
                            >
                                Lembrou sua senha?
                            </Typography>
                            <Link
                                titulo="Voltar ao Login"
                                theme={theme}
                                onPress={handleBackToLogin}
                            />
                        </View>
                    )}
                    <View style={styles.fixedBottomSection}>
                        <View style={styles.dividerContainer}>
                            <View style={[styles.dividerLine, { backgroundColor: theme.input.border }]} />
                            <Typography
                                variant="bodySmall"
                                style={[styles.dividerText, { color: theme.text.secondary }]}
                            >
                                Precisa de ajuda?
                            </Typography>
                            <View style={[styles.dividerLine, { backgroundColor: theme.input.border }]} />
                        </View>

                        <View style={styles.supportContainer}>
                            <Typography
                                variant="bodySmall"
                                style={[styles.supportText, { color: theme.text.secondary }]}
                            >
                                Entre em contato com o suporte:
                            </Typography>
                            <Link
                                titulo="suporte@gogym.com"
                                theme={theme}
                                onPress={() => {
                                    info('Email de suporte copiado para a área de transferência')
                                }}
                            />
                        </View>

                        <View style={styles.progressContainer}>
                            <View style={styles.progressBar}>
                                {[1, 2, 3].map((stepNumber) => (
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
                                Passo {step} de 3
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
    loginLinkContainer: {
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        gap: 8,
        marginTop: 10,
        marginBottom: 10,
    },
    scrollContent: {
        flexGrow: 1,
        justifyContent: 'space-between',
        paddingHorizontal: 24,
        paddingVertical: 40,
    },
    mainContent: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        gap: 25,
    },
    fixedBottomSection: {
        width: '100%',
        marginTop: 'auto',
        paddingTop: 20,
        backgroundColor: 'transparent',
    },
    header: {
        alignItems: 'center',
        marginBottom: 30,
    },
    instructionContainer: {
        width: '100%',
        alignItems: 'center',
        marginBottom: 20,
    },
    instructionText: {
        textAlign: 'center',
        lineHeight: 22,
        paddingHorizontal: 10,
    },
    form: {
        width: '100%',
        gap: 20,
        marginBottom: 20,
    },
    validationContainer: {
        width: '100%',
        marginTop: 2,
    },
    validationText: {
        fontSize: 12,
    },
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
    buttonContainer: {
        width: '100%',
        marginTop: 10,
        marginBottom: 20,
    },
    backButtonContainer: {
        width: '100%',
        marginTop: 10,
        marginBottom: 20,
    },
    dividerContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        width: '100%',
        marginVertical: 15,
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
    supportContainer: {
        alignItems: 'center',
        gap: 5,
        marginBottom: 15,
    },
    supportText: {
        textAlign: 'center',
    },
    progressContainer: {
        alignItems: 'center',
        gap: 10,
        marginBottom: 10,
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