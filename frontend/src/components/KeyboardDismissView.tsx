import { Keyboard, Platform, TouchableWithoutFeedback } from "react-native"

type KeyboardDismissViewProps = {
  children: React.ReactNode
}

export function KeyboardDismissView({ children }: KeyboardDismissViewProps) {
  if (Platform.OS === 'web') {
    return <>{children}</>
  }

  return (
    <TouchableWithoutFeedback onPress={Keyboard.dismiss} accessible={false}>
      {children}
    </TouchableWithoutFeedback>
  )
}
