import React from 'react'
import { View, StyleSheet } from 'react-native'
import BackgroundWaves from 'src/components/BackgroundWaves'
import Link from '@/components/Form/Link'
import FormInput from '@/components/Form/FormInput'
import { KeyboardDismissView } from 'src/components/KeyboardDismissView'
import SocialButton from 'src/components/SocialButtons'
import AuthHeader from 'src/components/AuthHeader'
import { Typography } from 'src/components/Typography'
import FormButton from '@/components/Form/FormButton'
import { useTheme } from '@/context/ThemeContext'
import { useState, useEffect } from 'react'
import LoginFooter from '@/components/LoginFooter'
import { useNavigation } from '@/hooks/useNavigation'
import { useFormToast } from '@/hooks/useFormToast'
import { FormToast } from '@/components/Form/FormToast'

export default function Login() {
    const navigation = useNavigation();
    const { theme } = useTheme()
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [rememberMe, setRememberMe] = useState(false)
    const [loading, setLoading] = useState(false)
    const { success, error, info, warning, toastConfig, visible, hideFormToast } = useFormToast()


    useEffect(() => {
        const params = navigation.getState()?.routes?.[navigation.getState().index]?.params;
        
        if (params?.passwordChanged) {
            success('Senha alterada com sucesso! Você já pode fazer login com sua nova senha.')
            navigation.setParams({ passwordChanged: false })
        }
    }, [navigation])
    const handleLogin = async () => {
        setLoading(true)
        setTimeout(() => {
            setLoading(false)
            console.log('Login realizado com:', { email, password, rememberMe })
        }, 1500)
    }

    const handleForgotPassword = () => {
        navigation.navigate('ForgotPassword');
    }
    const handleRegister = () => {
        navigation.navigate('Register');
    };


    return (
        <KeyboardDismissView>
            <View style={[styles.container, { backgroundColor: theme.background }]}>
                <BackgroundWaves theme={theme.waves} />

                <View style={styles.scrollContent}>
                    <View style={styles.centerContainer}>
                        <View style={styles.header}>
                            <AuthHeader
                                title="Faça parte dessa comunidade"
                                theme={theme}
                                logoType="text"
                                logoText="GoGym"
                            />
                        </View>

                        <View style={styles.form}>
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
                            <FormInput
                                label="Email"
                                placeholder="digite@email.com"
                                theme={theme}
                                variant="transparent"
                                value={email}
                                onChangeText={setEmail}
                            />

                            <FormInput
                                label="Senha"
                                placeholder="Sua senha"
                                secureTextEntry
                                theme={theme}
                                variant="transparent"
                                value={password}
                                onChangeText={setPassword}
                            />

                            <LoginFooter
                                theme={theme}
                                rememberMeChecked={rememberMe}
                                onRememberMeToggle={setRememberMe}
                                onForgotPasswordPress={handleForgotPassword}
                            />
                        </View>

                        <View style={styles.buttonContainer}>
                            <FormButton
                                title="Entrar"
                                onPress={handleLogin}
                                theme={theme}
                                variant="contained"
                                loading={loading}
                                disabled={!email || !password}
                                fullWidth
                                size="large"
                            />
                        </View>

                        <View style={styles.registerLink}>
                            <Typography
                                variant="bodyMedium"
                                style={{ color: theme.text.secondary }}
                            >
                                Não tem uma conta?
                            </Typography>
                            <Link
                                titulo="Cadastrar"
                                theme={theme}
                                onPress={handleRegister}
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
                                />
                                <SocialButton
                                    variant="google"
                                    theme={theme}
                                    source={require('src/assets/google.png')}
                                />
                                <SocialButton
                                    variant="instagram"
                                    theme={theme}
                                    source={require('src/assets/instagram.png')}
                                />
                            </View>
                        </View>
                    </View>
                </View>
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
        paddingVertical: 400,
    },
    centerContainer: {
        justifyContent: 'center',
        alignItems: 'center',
        gap: 25,
    },
    header: {
        alignItems: 'center',
        marginBottom: 60,
    },
    form: {
        width: '100%',
        gap: 16,
        marginBottom: 30,
    },
    buttonContainer: {
        width: '100%',
        marginTop: 20,

    },
    registerLink: {
        flexDirection: 'row',
        justifyContent: 'center',
        gap: 8,

    },
    dividerContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        width: '100%',

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

    },
    socialTitle: {
        marginBottom: 10,
        textAlign: 'center',
    },
    socialButtonsContainer: {
        flexDirection: 'row',
        justifyContent: 'center',
        gap: 20,
        width: '100%',
    },
})