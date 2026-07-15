import {StatusBar} from 'react-native';

import {bootstrapApp} from '@app/bootstrap';
import {AppProviders} from '@app/providers';
import {RootNavigator} from '@core/presentation';
import {bootstrapFirebase} from '@infrastructure/firebase';
import {initI18n} from '@shared/i18n';
import {useTheme} from '@shared/ui';

initI18n();
bootstrapApp();
bootstrapFirebase();

function App() {
  return (
    <AppProviders>
      <ThemedStatusBar />
      <RootNavigator />
    </AppProviders>
  );
}

function ThemedStatusBar() {
  const {theme} = useTheme();
  return <StatusBar barStyle={theme.statusBar} />;
}

export default App;
