import { useColorScheme } from 'react-native';
import { Colors, ColorTheme, ThemeColors } from '@/constants/colors';
import { create } from 'zustand';

interface ThemeState {
  mode: 'system' | 'light' | 'dark';
  setMode: (mode: 'system' | 'light' | 'dark') => void;
}

export const useThemeStore = create<ThemeState>((set) => ({
  mode: 'system',
  setMode: (mode) => set({ mode }),
}));

export function useAppTheme(): {
  theme: ColorTheme;
  colors: ThemeColors;
  mode: 'system' | 'light' | 'dark';
  setMode: (mode: 'system' | 'light' | 'dark') => void;
} {
  const systemScheme = useColorScheme();
  const { mode, setMode } = useThemeStore();

  const resolvedTheme: ColorTheme =
    mode === 'system' ? (systemScheme === 'dark' ? 'dark' : 'light') : mode;

  return {
    theme: resolvedTheme,
    colors: Colors[resolvedTheme],
    mode,
    setMode,
  };
}

export function useThemeColor(
  props: { light?: string; dark?: string },
  colorName: keyof ThemeColors
): string {
  const { theme, colors } = useAppTheme();
  const colorFromProps = props[theme];

  if (colorFromProps) {
    return colorFromProps;
  }
  return colors[colorName];
}

