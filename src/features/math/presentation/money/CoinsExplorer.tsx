import React, {useState} from 'react';
import {Pressable, StyleSheet, Text, View} from 'react-native';
import {useTranslation} from 'react-i18next';
import {CoinView} from './CoinView';
import {COIN_EQUIVALENCES, INDIAN_COINS} from '../../domain/money/moneyData';
import type {CoinInfo} from '../../domain/money/types';

interface CoinsExplorerProps {
  onSuccess?: () => void;
}

export function CoinsExplorer({onSuccess}: CoinsExplorerProps) {
  const {t} = useTranslation();
  const [selectedCoin, setSelectedCoin] = useState<CoinInfo>(INDIAN_COINS[2]!); // ₹5 default
  const [activeEquivIdx, setActiveEquivIdx] = useState<number>(0);
  const [revealedEquiv, setRevealedEquiv] = useState<boolean>(false);

  // Mini recognition challenge
  const [targetCoinValue, setTargetCoinValue] = useState<number>(5);
  const [answeredCorrect, setAnsweredCorrect] = useState<boolean | null>(null);

  const equiv = COIN_EQUIVALENCES[activeEquivIdx] ?? COIN_EQUIVALENCES[0]!;

  const handlePickRecognition = (val: number) => {
    if (val === targetCoinValue) {
      setAnsweredCorrect(true);
      onSuccess?.();
    } else {
      setAnsweredCorrect(false);
    }
  };

  const handleNextTargetCoin = () => {
    const values = [1, 2, 5, 10, 20];
    const nextIdx = (values.indexOf(targetCoinValue) + 1) % values.length;
    setTargetCoinValue(values[nextIdx] ?? 5);
    setAnsweredCorrect(null);
  };

  const handleNextEquiv = () => {
    setActiveEquivIdx(i => (i + 1) % COIN_EQUIVALENCES.length);
    setRevealedEquiv(false);
  };

  return (
    <View style={styles.container}>
      {/* Coin Showcase & Inspector */}
      <View style={styles.card}>
        <Text style={styles.sectionTitle}>
          🪙 Indian Coins (Tap any coin to inspect)
        </Text>

        <View style={styles.coinBar}>
          {INDIAN_COINS.map(coin => (
            <View key={coin.value} style={styles.coinItem}>
              <CoinView
                value={coin.value}
                size={selectedCoin.value === coin.value ? 68 : 54}
                isSelected={selectedCoin.value === coin.value}
                onPress={() => setSelectedCoin(coin)}
              />
              <Text style={styles.coinBarLabel}>₹{coin.value}</Text>
            </View>
          ))}
        </View>

        {/* Selected Coin Details Banner */}
        <View style={styles.detailsCard}>
          <View style={styles.detailsHeader}>
            <Text style={styles.detailsTitle}>
              {t(selectedCoin.nameKey, `₹${selectedCoin.value} Coin`)}
            </Text>
            <View style={styles.pill}>
              <Text style={styles.pillText}>
                {t(
                  selectedCoin.metalKey,
                  selectedCoin.isBiMetallic ? 'Bi-Metallic' : 'Standard Metal',
                )}
              </Text>
            </View>
          </View>
          <Text style={styles.detailsFact}>
            💡{' '}
            {t(
              selectedCoin.funFactKey,
              `A ₹${selectedCoin.value} coin has Rupee symbol ₹ and bold number ${selectedCoin.value}.`,
            )}
          </Text>
        </View>
      </View>

      {/* Recognition Game: Which coin is ₹X? */}
      <View style={styles.gameCard}>
        <Text style={styles.gameTitle}>
          🎯 Quick Challenge: Which coin is ₹{targetCoinValue}?
        </Text>
        <Text style={styles.gameSubtitle}>Tap the correct coin below:</Text>

        <View style={styles.choicesRow}>
          {INDIAN_COINS.map(coin => (
            <CoinView
              key={`recog-${coin.value}`}
              value={coin.value}
              size={58}
              onPress={() => handlePickRecognition(coin.value)}
            />
          ))}
        </View>

        {answeredCorrect === true && (
          <View style={styles.successBanner}>
            <Text style={styles.successBannerText}>
              🎉 Awesome! You found the ₹{targetCoinValue} coin!
            </Text>
            <Pressable
              accessibilityRole="button"
              onPress={handleNextTargetCoin}
              style={styles.nextEquivBtn}>
              <Text style={styles.nextEquivBtnText}>Next Coin Challenge ❯</Text>
            </Pressable>
          </View>
        )}
        {answeredCorrect === false && (
          <View style={styles.tryAgainBanner}>
            <Text style={styles.tryAgainBannerText}>
              ❌ Try again! Look for the number {targetCoinValue} on the coin.
            </Text>
          </View>
        )}
      </View>

      {/* Coin Equivalence Game: How many ₹1 make ₹5? */}
      <View style={styles.equivCard}>
        <View style={styles.equivHeader}>
          <Text style={styles.equivTitle}>🔢 Coin Equivalence</Text>
          <Pressable
            accessibilityRole="button"
            onPress={handleNextEquiv}
            style={styles.nextEquivBtn}>
            <Text style={styles.nextEquivBtnText}>Next Pattern ❯</Text>
          </Pressable>
        </View>

        <Text style={styles.equivQuestion}>
          How many <Text style={styles.boldAccent}>₹{equiv.unitValue}</Text>{' '}
          coins make <Text style={styles.boldAccent}>₹{equiv.targetValue}</Text>
          ?
        </Text>

        {/* Target Coin */}
        <View style={styles.targetCoinWrap}>
          <CoinView value={equiv.targetValue as any} size={70} showLabel />
          <Text style={styles.equalsSign}>=</Text>
          {revealedEquiv ? (
            <View style={styles.unitsGrid}>
              {Array.from({length: equiv.unitCount}).map((_, i) => (
                <CoinView
                  key={`unit-${i}`}
                  value={equiv.unitValue as any}
                  size={46}
                />
              ))}
            </View>
          ) : (
            <Pressable
              accessibilityRole="button"
              onPress={() => {
                setRevealedEquiv(true);
                onSuccess?.();
              }}
              style={styles.revealBtn}>
              <Text style={styles.revealBtnText}>🔍 Tap to See Match</Text>
            </Pressable>
          )}
        </View>

        {revealedEquiv && (
          <View style={styles.equivExplanation}>
            <Text style={styles.equivExplanationText}>
              🌟 {equiv.speechText}
            </Text>
          </View>
        )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    gap: 16,
  },
  card: {
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    padding: 16,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    gap: 14,
  },
  sectionTitle: {
    fontSize: 15,
    fontWeight: '800',
    color: '#1E293B',
  },
  coinBar: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-around',
    paddingVertical: 6,
  },
  coinItem: {
    alignItems: 'center',
    gap: 6,
  },
  coinBarLabel: {
    fontSize: 12,
    fontWeight: '800',
    color: '#475569',
  },
  detailsCard: {
    backgroundColor: '#F8FAFC',
    borderRadius: 14,
    padding: 12,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    gap: 6,
  },
  detailsHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  detailsTitle: {
    fontSize: 16,
    fontWeight: '800',
    color: '#0F172A',
  },
  pill: {
    backgroundColor: '#E0E7FF',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 8,
  },
  pillText: {
    fontSize: 11,
    fontWeight: '800',
    color: '#4338CA',
  },
  detailsFact: {
    fontSize: 13,
    lineHeight: 18,
    color: '#334155',
    fontWeight: '600',
  },
  gameCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    padding: 16,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    gap: 12,
  },
  gameTitle: {
    fontSize: 15,
    fontWeight: '800',
    color: '#0F172A',
  },
  gameSubtitle: {
    fontSize: 13,
    fontWeight: '600',
    color: '#64748B',
  },
  choicesRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-around',
    paddingVertical: 6,
  },
  successBanner: {
    backgroundColor: '#DCFCE7',
    padding: 10,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#86EFAC',
  },
  successBannerText: {
    color: '#166534',
    fontSize: 13,
    fontWeight: '800',
    textAlign: 'center',
  },
  tryAgainBanner: {
    backgroundColor: '#FEE2E2',
    padding: 10,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#FCA5A5',
  },
  tryAgainBannerText: {
    color: '#991B1B',
    fontSize: 13,
    fontWeight: '800',
    textAlign: 'center',
  },
  equivCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    padding: 16,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    gap: 12,
  },
  equivHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  equivTitle: {
    fontSize: 15,
    fontWeight: '800',
    color: '#1E293B',
  },
  nextEquivBtn: {
    backgroundColor: '#EFF6FF',
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 10,
  },
  nextEquivBtnText: {
    fontSize: 12,
    fontWeight: '800',
    color: '#2563EB',
  },
  equivQuestion: {
    fontSize: 14,
    color: '#334155',
    fontWeight: '600',
  },
  boldAccent: {
    fontWeight: '900',
    color: '#1D4ED8',
  },
  targetCoinWrap: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 14,
    paddingVertical: 8,
  },
  equalsSign: {
    fontSize: 26,
    fontWeight: '900',
    color: '#64748B',
  },
  unitsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    maxWidth: 180,
    gap: 8,
    alignItems: 'center',
  },
  revealBtn: {
    backgroundColor: '#10B981',
    paddingHorizontal: 14,
    paddingVertical: 10,
    borderRadius: 14,
  },
  revealBtnText: {
    color: '#FFFFFF',
    fontSize: 13,
    fontWeight: '800',
  },
  equivExplanation: {
    backgroundColor: '#ECFDF5',
    padding: 10,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#A7F3D0',
  },
  equivExplanationText: {
    color: '#065F46',
    fontSize: 13,
    fontWeight: '800',
    textAlign: 'center',
  },
});
