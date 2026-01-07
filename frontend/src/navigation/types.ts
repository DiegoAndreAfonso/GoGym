export type RootStackParamList = {
  Login: undefined | { passwordChanged?: boolean; emailVerified?: boolean };
  Register: undefined;
  ForgotPassword: undefined;
};

declare global {
  namespace ReactNavigation {
    interface RootParamList extends RootStackParamList {}
  }
}
