import {TopAppBar, type TopAppBarProps} from '../organisms/TopAppBar';

export type ScreenHeaderProps = Pick<
  TopAppBarProps,
  'title' | 'subtitle' | 'onBack' | 'trailing' | 'testID'
>;

/**
 * @deprecated Prefer TopAppBar from the Atomic library.
 */
export function ScreenHeader(props: ScreenHeaderProps) {
  return <TopAppBar {...props} />;
}
