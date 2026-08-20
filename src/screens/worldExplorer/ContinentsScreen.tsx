import {FlatList, StyleSheet, View} from 'react-native';
import {useTranslation} from 'react-i18next';
import type {NativeStackScreenProps} from '@react-navigation/native-stack';

import {AppSafeAreaView} from '@components';
import {CONTINENTS} from '@features/worldExplorer/domain/catalog/continents';
import {
  ContinentCard,
  ExplorerHeader,
} from '@features/worldExplorer/presentation/components';
import {useWorldExplorerProgress} from '@features/worldExplorer/presentation/hooks/useWorldExplorerProgress';
import type {WorldExplorerStackParamList} from '@navigation/worldExplorerTypes';

type Props = NativeStackScreenProps<WorldExplorerStackParamList, 'Continents'>;

export function ContinentsScreen({navigation}: Props) {
  const {t} = useTranslation();
  const {progress, exploreContinent} = useWorldExplorerProgress();

  const handleSelectContinent = (
    continentName: string,
    continentId: string,
  ) => {
    exploreContinent(continentId);
    navigation.navigate('CountryList', {continent: continentName});
  };

  return (
    <AppSafeAreaView testID="continents-screen" padded={false}>
      <ExplorerHeader
        title={t('worldExplorer.activities.continents', {
          defaultValue: 'Continents',
        })}
        subtitle="7 Continents of the Earth"
        stars={progress.stars}
        onBack={() => navigation.goBack()}
      />

      <View style={styles.container}>
        <FlatList
          data={CONTINENTS}
          keyExtractor={item => item.id}
          contentContainerStyle={styles.listContent}
          showsVerticalScrollIndicator={false}
          renderItem={({item}) => (
            <ContinentCard
              continent={item}
              onPress={() => handleSelectContinent(item.name, item.id)}
              testID={`continent-card-${item.id}`}
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
