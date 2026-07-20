import {StyleSheet, Text, View} from 'react-native';

import {AppSafeAreaView} from '@components';

type PlaceholderTabProps = {
  readonly title: string;
  readonly subtitle: string;
  readonly testID: string;
};

function PlaceholderTab({title, subtitle, testID}: PlaceholderTabProps) {
  return (
    <AppSafeAreaView
      testID={testID}
      backgroundImage={null}
      backgroundColor="#F4F7FA">
      <View style={styles.center}>
        <Text style={styles.title}>{title}</Text>
        <Text style={styles.subtitle}>{subtitle}</Text>
      </View>
    </AppSafeAreaView>
  );
}

export function BadgesScreen() {
  return (
    <PlaceholderTab
      testID="badges-screen"
      title="Badges"
      subtitle="Your badges will show up here soon."
    />
  );
}

export function RewardsScreen() {
  return (
    <PlaceholderTab
      testID="rewards-screen"
      title="Rewards"
      subtitle="Prizes and rewards are coming soon."
    />
  );
}

const styles = StyleSheet.create({
  center: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    paddingHorizontal: 24,
  },
  title: {
    fontSize: 24,
    fontWeight: '800',
    color: '#1A2A4A',
  },
  subtitle: {
    fontSize: 15,
    fontWeight: '500',
    color: '#6B7A88',
    textAlign: 'center',
  },
});
