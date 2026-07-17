import {splashLionLoading} from '@assets';
import {AppSafeAreaView} from '@components';

/**
 * Brand splash — full-bleed lion loading art while persist rehydrates / app boots.
 * Artwork already includes “Loading fun…” copy.
 */
export function SplashScreen() {
  return (
    <AppSafeAreaView
      testID="splash-screen"
      backgroundImage={splashLionLoading}
      padded={false}
      edges={['top', 'bottom']}
      statusBarStyle="dark-content"
    />
  );
}

/** @deprecated Use SplashScreen */
export const BootScreen = SplashScreen;
