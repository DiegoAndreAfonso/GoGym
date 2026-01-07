import React from 'react'
import { 
  Modal, 
  View, 
  StyleSheet, 
  ScrollView, 
  Pressable 
} from 'react-native'
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons'
import { AppTheme } from 'src/@types/colors'
import { Typography } from 'src/components/Typography'
import FormButton from '@/components/Form/FormButton'

type Props = {
  visible: boolean
  onClose: (accepted: boolean) => void
  theme: AppTheme
  title?: string
  content?: string
}

export default function DialogTerms({
  visible,
  onClose,
  theme,
  title = 'Termos de Uso',
  content = 'Conteúdo dos termos...',
}: Props) {
  return (
    <Modal
      visible={visible}
      transparent
      animationType="fade"
      onRequestClose={() => onClose(false)}
    >
      <View style={styles.overlay}>
        <View style={[styles.dialog, { backgroundColor: theme.background }]}>
          <View style={styles.header}>
            <Typography
              variant="headlineMedium"
              style={{ color: theme.text.primary }}
            >
              {title}
            </Typography>
            
            <Pressable
              onPress={() => onClose(false)}
              style={styles.closeButton}
            >
              <MaterialCommunityIcons
                name="close"
                size={24}
                color={theme.text.primary}
              />
            </Pressable>
          </View>

          <ScrollView style={styles.content}>
            <Typography
              variant="bodyMedium"
              style={{ color: theme.text.secondary, lineHeight: 22 }}
            >
              {content}
            </Typography>
          </ScrollView>

          <View style={styles.footer}>
            <FormButton
              title="Recusar"
              onPress={() => onClose(false)}
              theme={theme}
              variant="outlined"
              fullWidth={false}
              style={{ flex: 1 }}
            />
            
            <View style={{ width: 12 }} />
            
            <FormButton
              title="Aceitar"
              onPress={() => onClose(true)}
              theme={theme}
              variant="contained"
              fullWidth={false}
              style={{ flex: 1 }}
            />
          </View>
        </View>
      </View>
    </Modal>
  )
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  dialog: {
    width: '100%',
    maxWidth: 500,
    maxHeight: '80%',
    borderRadius: 16,
    padding: 20,
    elevation: 5,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
    paddingBottom: 12,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(0,0,0,0.1)',
  },
  closeButton: {
    padding: 4,
  },
  content: {
    maxHeight: 400,
    marginBottom: 20,
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
})