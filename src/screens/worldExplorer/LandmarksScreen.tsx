import {FlatList, StyleSheet, View} from 'react-native';
import {useTranslation} from 'react-i18next';
import type {NativeStackScreenProps} from '@react-navigation/native-stack';

import {AppSafeAreaView} from '@components';
import {LANDMARKS} from '@features/worldExplorer/domain/catalog/landmarks';
import {
  ExplorerHeader,
  LandmarkCard,
} from '@features/worldExplorer/presentation/components';
import {useWorldExplorerProgress} from '@features/worldExplorer/presentation/hooks/useWorldExplorerProgress';
import type {WorldExplorerStackParamList} from '@navigation/worldExplorerTypes';

type Props = NativeStackScreenProps<WorldExplorerStackParamList, 'Landmarks'>;

export function LandmarksScreen({navigation}: Props) {
  const {t} = useTranslation();
  const {progress, exploreLandmark} = useWorldExplorerProgress();

  const handleSelectLandmark = (id: string, countryCode: string) => {
    exploreLandmark(id);
    navigation.navigate('CountryDetails', {countryCode});
  };

  return (
    <AppSafeAreaView testID="landmarks-screen" padded={false}>
      <ExplorerHeader
        title={t('worldExplorer.activities.landmarks', {
          defaultValue: 'Landmarks',
        })}
        subtitle="Famous Places Around the World"
        stars={progress.stars}
        onBack={() => navigation.goBack()}
      />

      <View style={styles.container}>
        <FlatList
          data={LANDMARKS}
          keyExtractor={item => item.id}
          contentContainerStyle={styles.listContent}
          showsVerticalScrollIndicator={false}
          renderItem={({item}) => (
            <LandmarkCard
              landmark={item}
              onPress={() => handleSelectLandmark(item.id, item.countryCode)}
              testID={`landmark-card-${item.id}`}
            />
          )}
        />
      </View>
    </AppSafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  listContent: {
    paddingHorizontal: 16,
    paddingVertical: 12,
    paddingBottom: 24,
  },
});
