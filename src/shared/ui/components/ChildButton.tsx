import {
  PrimaryButton,
  SecondaryButton,
  type PrimaryButtonProps,
} from '../atoms';

export type ChildButtonVariant =
  | 'primary'
  | 'secondary'
  | 'sun'
  | 'ghost'
  | 'danger';

export type ChildButtonProps = Omit<PrimaryButtonProps, 'style'> & {
  readonly variant?: ChildButtonVariant;
  readonly style?: PrimaryButtonProps['style'];
};

/**
 * @deprecated Prefer PrimaryButton / SecondaryButton from the Atomic library.
 * Kept for existing screens — maps variants onto the shared button atoms.
 */
export function ChildButton({variant = 'primary', ...props}: ChildButtonProps) {
  if (variant === 'secondary' || variant === 'ghost') {
    return <SecondaryButton {...props} />;
  }
  return <PrimaryButton {...props} />;
}
