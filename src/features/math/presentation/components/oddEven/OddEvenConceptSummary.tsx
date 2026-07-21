import {StyleSheet, Text, View, type ImageSourcePropType} from 'react-native';

import {ObjectImageBox} from '../objects/ObjectImageBox';

type Props = {
  readonly image: ImageSourcePropType;
};

/** Side-by-side visual recap shown before the understanding checkpoint. */
export function OddEvenConceptSummary({image}: Props) {
  return (
    <View style={styles.container} testID="odd-even-concept-summary">
      <Text style={styles.heading}>Meet the pairs!</Text>
      <Text style={styles.subheading}>
        Pair every object with one friendly partner.
      </Text>

      <View style={styles.cards}>
        <View style={[styles.card, styles.evenCard]}>
          <Text style={styles.cardIcon}>🤝</Text>
          <Text style={[styles.title, styles.evenTitle]}>EVEN</Text>
          <View style={styles.example}>
            <MiniPair image={image} />
            <MiniPair image={image} />
          </View>
          <Text style={styles.number}>4</Text>
          <Text style={styles.copy}>Everyone has a partner!</Text>
        </View>

        <View style={[styles.card, styles.oddCard]}>
          <Text style={styles.cardIcon}>☝️</Text>
          <Text style={[styles.title, styles.oddTitle]}>ODD</Text>
          <View style={styles.example}>
            <MiniPair image={image} />
            <View style={styles.lonely}>
              <ObjectImageBox image={image} size={38} />
            </View>
          </View>
          <Text style={styles.number}>3</Text>
          <Text style={styles.copy}>One object has no partner.</Text>
        </View>
      </View>

      <View style={styles.memoryTip}>
        <Text style={styles.tipIcon}>💡</Text>
        <Text style={styles.tipText}>
          No object left = EVEN · One object left = ODD
        </Text>
      </View>
    </View>
  );
}

function MiniPair({image}: {image: ImageSourcePropType}) {
  return (
    <View style={styles.pair}>
      <ObjectImageBox image={image} size={38} />
      <Text style={styles.heart}>♥</Text>
      <ObjectImageBox image={image} size={38} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    width: '100%',
    backgroundColor: '#FFFFFF',
    borderRadius: 24,
    padding: 16,
    alignItems: 'center',
    gap: 8,
    shadowColor: '#1A3A5C',
    shadowOffset: {width: 0, height: 3},
    shadowOpacity: 0.08,
    shadowRadius: 8,
    elevation: 3,
  },
  heading: {
    color: '#1D4ED8',
    fontSize: 23,
    fontWeight: '900',
  },
  subheading: {
    color: '#64748B',
    fontSize: 12,
    fontWeight: '700',
    textAlign: 'center',
  },
  cards: {
    width: '100%',
    flexDirection: 'row',
    gap: 10,
    marginTop: 4,
  },
  card: {
    flex: 1,
    minHeight: 210,
    borderRadius: 20,
    borderWidth: 2,
    padding: 10,
    alignItems: 'center',
    gap: 5,
  },
  evenCard: {
    backgroundColor: '#ECFDF3',
    borderColor: '#54C878',
  },
  oddCard: {
    backgroundColor: '#FFF4ED',
    borderColor: '#FF9F6E',
  },
  cardIcon: {fontSize: 21},
  title: {
    fontSize: 18,
    fontWeight: '900',
  },
  evenTitle: {color: '#168235'},
  oddTitle: {color: '#D35A2B'},
  example: {
    minHeight: 94,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 5,
  },
  pair: {
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: 999,
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#86D7A0',
    paddingHorizontal: 3,
  },
  heart: {
    color: '#38A169',
    fontSize: 9,
  },
  lonely: {
    borderWidth: 2,
    borderStyle: 'dashed',
    borderColor: '#F59E8B',
    borderRadius: 999,
    padding: 2,
  },
  number: {
    color: '#2563B8',
    fontSize: 24,
    fontWeight: '900',
  },
  copy: {
    color: '#475569',
    fontSize: 10,
    fontWeight: '800',
    textAlign: 'center',
  },
  memoryTip: {
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: 14,
    backgroundColor: '#E0F2FE',
    paddingHorizontal: 10,
    paddingVertical: 8,
    gap: 6,
  },
  tipIcon: {fontSize: 15},
  tipText: {
    flex: 1,
    color: '#075985',
    fontSize: 11,
    fontWeight: '800',
    textAlign: 'center',
  },
});
