import React, { useState } from 'react'
import { View, Text, StyleSheet, Pressable } from 'react-native'
import { TextInput } from 'react-native-paper'
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons'

type FormInputProps = {
    label: string
    placeholder?: string
    secureTextEntry?: boolean
}

export default function FormInput({
    label,
    placeholder,
    secureTextEntry = false,
}: FormInputProps) {
    const [hidePassword, setHidePassword] = useState(secureTextEntry)

    return (
        <View style={styles.container}>
            <Text style={styles.label}>{label}</Text>

            <View style={styles.inputWrapper}>
                <TextInput
                    placeholder={placeholder}
                    secureTextEntry={hidePassword}
                    style={styles.input}
                    textColor="#fff"
                    placeholderTextColor="#ffffff88"
                    theme={{
                        colors: {
                            background: 'transparent',
                        },
                    }}
                />

                {secureTextEntry && (
                    <Pressable
                        onPress={() => setHidePassword(!hidePassword)}
                        style={styles.eye}
                    >
                        <MaterialCommunityIcons
                            name={hidePassword ? 'eye-off-outline' : 'eye-outline'}
                            size={22}
                            color="#fff"
                        />
                    </Pressable>
                )}
            </View>
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        width: '100%',
        gap: 6,
    },
    label: {
        color: '#fff',
        fontSize: 14,
    },
    inputWrapper: {
        position: 'relative',
        justifyContent: 'center',
    },
    input: {
        backgroundColor: 'transparent',
        borderColor: '#ffffff55',
        borderRadius: 10,
        borderWidth: 1,
        height: 48,
    },
    eye: {
        position: 'absolute',
        right: 12,
        height: '100%',
        justifyContent: 'center',
    },
})
