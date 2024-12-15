import { useColorScheme } from 'react-native';

const Colors = {
  light: {
    background: "white",
    text: "black",
  },
  dark: {
    background: "black",
    text: "white",
  },
}
export function useThemeColors ()  {
  const colorScheme = useColorScheme()
  const colors = Colors[colorScheme]

  return colors
}

