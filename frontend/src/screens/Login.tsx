import React from 'react'
import { View, StyleSheet } from 'react-native'
import { Button } from 'react-native-paper'
import BackgroundWaves from 'src/components/BackgroundWaves'
import Link from 'src/components/Link'
import FormInput from 'src/components/FormInput'
import { KeyboardDismissView } from 'src/components/KeyboardDismissView'




export default function Login() {
    return (
        <KeyboardDismissView>
            <View style={styles.container}>
                <BackgroundWaves />

                <View style={styles.content}>
                    <FormInput
                        label="Email"
                        placeholder="Insira seu email"
                    />

                    <FormInput
                        label="Senha"
                        placeholder="Insira sua senha"
                        secureTextEntry
                    />
                    <Link titulo="Esqueceu a senha?" />

                    <Button
                        mode="contained"
                        onPress={() => { }}
                        style={styles.button}
                        contentStyle={{ height: 48 }}
                    >
                        Login
                    </Button>
                </View>
            </View>
       </KeyboardDismissView>

    )
}
const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    content: {
        flex: 1,
        justifyContent: 'center',
        paddingHorizontal: 24,
        gap: 16,
    },

    button: {
        marginTop: 8,
        borderRadius: 10,
    },
})
