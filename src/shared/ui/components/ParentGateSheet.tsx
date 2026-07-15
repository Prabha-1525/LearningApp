import {View} from 'react-native';
import {useTranslation} from 'react-i18next';

import {PrimaryButton, SecondaryButton} from '../atoms';
import {AppText} from './AppText';
import {BottomSheet} from '../organisms';
import {useTheme} from '../theme';

export type ParentGateSheetProps = {
  readonly visible: boolean;
  readonly title?: string;
  readonly message?: string;
  readonly onConfirm: () => void;
  readonly onCancel: () => void;
  readonly testID?: string;
};

/**
 * Parent gate built on shared BottomSheet organism.
 */
export function ParentGateSheet({
  visible,
  title,
  message,
  onConfirm,
  onCancel,
  testID,
}: ParentGateSheetProps) {
  const {t} = useTranslation();
  const {space} = useTheme();

  return (
    <BottomSheet
      visible={visible}
      title={title ?? t('parent.gateTitle')}
      onClose={onCancel}
      testID={testID}>
      <AppText variant="body" tone="muted">
        {message ?? t('parent.gateMessage')}
      </AppText>
      <View style={{gap: space.sm}}>
        <PrimaryButton label={t('parent.confirm')} onPress={onConfirm} />
        <SecondaryButton label={t('parent.cancel')} onPress={onCancel} />
      </View>
    </BottomSheet>
  );
}
