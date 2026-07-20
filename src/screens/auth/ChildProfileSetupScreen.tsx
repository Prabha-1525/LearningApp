import {useMemo, useState} from 'react';
import {
  ActivityIndicator,
  Alert,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import {useTranslation} from 'react-i18next';

import {useAppDispatch} from '@app/store';
import type {ChildAvatarId} from '@assets';
import {
  AppSafeAreaView,
  AvatarGrid,
  ChildNameInput,
  ContinueButton,
} from '@components';
import {completeChildProfileSetup} from '@infrastructure/auth';
import {
  capitalizeChildName,
  isValidChildName,
} from '@infrastructure/storage/LocalLearnerProfileStore';
import {space} from '@shared/ui';

type ChildProfileSetupScreenProps = {
  readonly onComplete: () => void;
};

export function ChildProfileSetupScreen({
  onComplete,
}: ChildProfileSetupScreenProps) {
  const {t} = useTranslation();
  const dispatch = useAppDispatch();
  const [name, setName] = useState('');
  const [avatar, setAvatar] = useState<ChildAvatarId | null>(null);
  const [saving, setSaving] = useState(false);
  const [touched, setTouched] = useState(false);

  const nameError = useMemo(() => {
    if (!touched) {
      return null;
    }
    if (!name.trim()) {
      return t('profileSetup.errors.nameRequired');
    }
    if (!isValidChildName(name)) {
      return t('profileSetup.errors.nameInvalid');
    }
    return null;
  }, [name, t, touched]);

  const canContinue = isValidChildName(name) && avatar != null && !saving;

  const onChangeName = (value: string) => {
    setTouched(true);
    const cleaned = value.replace(/[^A-Za-z0-9 ]/g, '').slice(0, 20);
    setName(cleaned);
  };

  const onContinue = async () => {
    setTouched(true);
    if (!canContinue || avatar == null) {
      return;
    }
    setSaving(true);
    const result = await completeChildProfileSetup(dispatch, {
      childName: capitalizeChildName(name),
      avatar,
    });
    setSaving(false);
    if (!result.ok) {
      Alert.alert(
        t('welcome.errors.title'),
        result.error.message || t('welcome.errors.generic'),
      );
      return;
    }
    onComplete();
  };

  return (
    <AppSafeAreaView
      testID="child-profile-setup"
      backgroundImage={null}
      backgroundColor="#E8F7EF"
      padded>
      <ScrollView
        contentContainerStyle={styles.scroll}
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}>
        <Text style={styles.title}>{t('profileSetup.title')}</Text>
        <Text style={styles.subtitle}>{t('profileSetup.subtitle')}</Text>

        <Text style={styles.step}>{t('profileSetup.stepName')}</Text>
        <ChildNameInput
          value={name}
          onChangeText={onChangeName}
          placeholder={t('profileSetup.namePlaceholder')}
          errorText={nameError}
        />

        <Text style={styles.step}>{t('profileSetup.stepAvatar')}</Text>
        <AvatarGrid selectedId={avatar} onSelect={id => setAvatar(id)} />

        <View style={styles.footer}>
          {saving ? (
            <ActivityIndicator color="#4DB7E8" />
          ) : (
            <ContinueButton
              label={t('profileSetup.continue')}
              disabled={!canContinue}
              onPress={() => {
                void onContinue();
              }}
            />
          )}
        </View>
      </ScrollView>
    </AppSafeAreaView>
  );
}

const styles = StyleSheet.create({
  scroll: {
    flexGrow: 1,
    paddingBottom: space.xxxl,
    gap: space.md,
  },
  title: {
    fontSize: 26,
    fontWeight: '800',
    color: '#1A2A32',
    textAlign: 'center',
    marginTop: space.sm,
  },
  subtitle: {
    fontSize: 15,
    fontWeight: '500',
    color: '#5B6B74',
    textAlign: 'center',
    marginBottom: space.sm,
  },
  step: {
    fontSize: 14,
    fontWeight: '800',
    letterSpacing: 0.4,
    color: '#2C3E50',
    textTransform: 'uppercase',
  },
  footer: {
    marginTop: space.lg,
  },
});
