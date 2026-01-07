import { useNavigation as useRNNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '@/navigation/types';

export function useNavigation() {
  return useRNNavigation<NativeStackNavigationProp<RootStackParamList>>();
}