import {useState} from 'react';
import {ScrollView, StyleSheet, View} from 'react-native';
import {useTranslation} from 'react-i18next';
import {AppSafeAreaView} from '@components';
import type {NativeStackScreenProps} from '@react-navigation/native-stack';

import {
  AppText,
  AvatarPicker,
  ProfileCard,
  ProgressStars,
  TopAppBar,
  space,
} from '@shared/ui';

import type {MainStackParamList} from '@navigation/types';

type Props = NativeStackScreenProps<MainStackParamList, 'Profile'>;

const DEMO_NAME = 'Ava';
const DEMO_AGE = 6;

export function ProfileScreen({navigation}: Props) {
  const {t} = useTranslation();
  const [avatarKey, setAvatarKey] = useState('sunny');

  return (
    <AppSafeAreaView testID="profile-screen">
      <TopAppBar
        title={t('profile.title')}
        onBack={() => navigation.goBack()}
      />
      <ScrollView
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}>
        <ProfileCard
          name={DEMO_NAME}
          ageLabel={t('profile.age', {age: DEMO_AGE})}
          avatarKey={avatarKey}
          stars={3}
        />

        <View style={styles.section}>
          <AppText variant="headline" tone="ink">
            {t('profile.starsTotal')}
          </AppText>
          <ProgressStars stars={3} maxStars={5} />
        </View>

        <View style={styles.section}>
          <AppText variant="headline" tone="ink">
            {t('profile.pickAvatar')}
          </AppText>
          <AvatarPicker
            name={DEMO_NAME}
            selectedKey={avatarKey}
            onSelect={setAvatarKey}
          />
        </View>
      </ScrollView>
    </AppSafeAreaView>
  );
}

const styles = StyleSheet.create({
  content: {
    gap: space.lg,
    paddingBottom: space.xxxl,
  },
  section: {
    gap: space.sm,
  },
});
