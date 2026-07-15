import {Text as RNText, type TextProps, type TextStyle} from 'react-native';

import {useTheme} from '../theme';
import type {TypographyRole} from '../theme/typography';

export type AppTextTone =
  | 'ink'
  | 'muted'
  | 'primary'
  | 'sun'
  | 'reward'
  | 'danger'
  | 'inverse';

export type AppTextProps = Omit<TextProps, 'role'> & {
  readonly variant?: TypographyRole;
  readonly tone?: AppTextTone;
};

export function AppText({
  variant = 'body',
  tone = 'ink',
  style,
  children,
  ...rest
}: AppTextProps) {
  const {theme, typography} = useTheme();

  const colorByTone: Record<AppTextTone, string> = {
    ink: theme.colors.ink,
    muted: theme.colors.inkMuted,
    primary: theme.colors.actionPrimary,
    sun: theme.colors.actionSun,
    reward: theme.colors.reward,
    danger: theme.colors.danger,
    inverse: theme.colors.actionPrimaryLabel,
  };

  const variantStyle = typography[variant] as TextStyle;

  return (
    <RNText style={[variantStyle, {color: colorByTone[tone]}, style]} {...rest}>
      {children}
    </RNText>
  );
}
