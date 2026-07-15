import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useState,
  type PropsWithChildren,
} from 'react';

import {radius} from './radius';
import {space} from './spacing';
import {
  lightTheme,
  resolveTheme,
  type AppTheme,
  type ThemeMode,
} from './themes';
import {typography} from './typography';
import {motion, motionScale} from './motion';

export type ThemeContextValue = {
  theme: AppTheme;
  mode: ThemeMode;
  setMode: (mode: ThemeMode) => void;
  toggleNightMode: () => void;
  space: typeof space;
  radius: typeof radius;
  typography: typeof typography;
  motion: typeof motion;
  motionScale: typeof motionScale;
};

const ThemeContext = createContext<ThemeContextValue | null>(null);

type ThemeProviderProps = PropsWithChildren<{
  readonly initialMode?: ThemeMode;
}>;

export function ThemeProvider({
  children,
  initialMode = 'light',
}: ThemeProviderProps) {
  const [mode, setMode] = useState<ThemeMode>(initialMode);

  const toggleNightMode = useCallback(() => {
    setMode(current => (current === 'night' ? 'light' : 'night'));
  }, []);

  const value = useMemo<ThemeContextValue>(
    () => ({
      theme: resolveTheme(mode),
      mode,
      setMode,
      toggleNightMode,
      space,
      radius,
      typography,
      motion,
      motionScale,
    }),
    [mode, toggleNightMode],
  );

  return (
    <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>
  );
}

export function useTheme(): ThemeContextValue {
  const context = useContext(ThemeContext);
  if (context == null) {
    // Safe fallback for tests / early render without provider.
    return {
      theme: lightTheme,
      mode: 'light',
      setMode: () => undefined,
      toggleNightMode: () => undefined,
      space,
      radius,
      typography,
      motion,
      motionScale,
    };
  }
  return context;
}
