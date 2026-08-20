import React, {useState} from 'react';
import {Pressable, StyleSheet, Text, View} from 'react-native';
import {useTranslation} from 'react-i18next';
import {InteractiveWallet} from './InteractiveWallet';
import {COUNTING_CHALLENGES} from '../../domain/money/moneyData';
import type {
  CoinDenomination,
  CountingChallenge,
  NoteDenomination,
} from '../../domain/money/types';

interface MoneyCountingGameProps {
  onSuccess?: () => void;
}

export function MoneyCountingGame({onSuccess}: MoneyCountingGameProps) {
  const {t} = useTranslation();
  const [challengeIdx, setChallengeIdx] = useState<number>(0);
  const [selectedCoins, setSelectedCoins] = useState<CoinDenomination[]>([]);
  const [selectedNotes, setSelectedNotes] = useState<NoteDenomination[]>([]);

  const challenge: CountingChallenge =
    COUNTING_CHALLENGES[challengeIdx] ?? COUNTING_CHALLENGES[0]!;

  const totalSelected =
    selectedCoins.reduce((sum, c) => sum + c, 0) +
    selectedNotes.reduce((sum, n) => sum + n, 0);

  const isExactMatch = totalSelected === challenge.targetAmount;

  const handleAddCoin = (coin: CoinDenomination) => {
    setSelectedCoins(prev => [...prev, coin]);
  };

  const handleAddNote = (note: NoteDenomination) => {
    setSelectedNotes(prev => [...prev, note]);
  };

  const handleRemoveCoin = (idx: number) => {
    setSelectedCoins(prev => prev.filter((_, i) => i !== idx));
  };

  const handleRemoveNote = (idx: number) => {
    setSelectedNotes(prev => prev.filter((_, i) => i !== idx));
  };

  const handleClear = () => {
    setSelectedCoins([]);
    setSelectedNotes([]);
  };

  const handleNextChallenge = () => {
    if (isExactMatch) {
      onSuccess?.();
    }
    setChallengeIdx(i => (i + 1) % COUNTING_CHALLENGES.length);
    setSelectedCoins([]);
    setSelectedNotes([]);
  };

  return (
    <View style={styles.container}>
      {/* Challenge Banner */}
      <View style={styles.headerCard}>
        <View style={styles.stepBadge}>
          <Text style={styles.stepBadgeText}>
            Challenge {challengeIdx + 1} of {COUNTING_CHALLENGES.length}
          </Text>
        </View>
        <Text style={styles.promptTitle}>
          🎯 Make exactly{' '}
          <Text style={styles.targetAccent}>₹{challenge.targetAmount}</Text>
        </Text>
        <Text style={styles.promptSubtitle}>
          {t(
            challenge.promptKey,
            `Tap the coins or notes below to make ₹${challenge.targetAmount}!`,
          )}
        </Text>
      </View>

      {/* Interactive Wallet Tray */}
      <InteractiveWallet
        currentTotal={totalSelected}
        targetPrice={challenge.targetAmount}
        selectedCoins={selectedCoins}
        selectedNotes={selectedNotes}
        onAddCoin={handleAddCoin}
        onAddNote={handleAddNote}
        onRemoveCoin={handleRemoveCoin}
        onRemoveNote={handleRemoveNote}
        onClear={handleClear}
        availableCoins={challenge.allowedCoins}
        availableNotes={challenge.allowedNotes}
        showNotes={challenge.allowedNotes.length > 0}
      />

      {/* Action / Celebration Row */}
      {isExactMatch && (
        <View style={styles.celebrateCard}>
          <Text style={styles.celebrateTitle}>
            🎉 Perfect match! ₹{totalSelected}
          </Text>
          <Text style={styles.celebrateExp}>
            {t(
              challenge.explanationKey,
              `Great job! Your coins and notes add up to ₹${challenge.targetAmount}!`,
            )}
          </Text>
          <Pressable
            accessibilityRole="button"
            onPress={handleNextChallenge}
            style={styles.nextBtn}>
            <Text style={styles.nextBtnText}>Next Challenge ❯</Text>
          </Pressable>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    gap: 16,
  },
  headerCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    padding: 16,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    gap: 6,
    alignItems: 'center',
  },
  stepBadge: {
    backgroundColor: '#E0F2FE',
    paddingHorizontal: 10,
    paddingVertical: 3,
    borderRadius: 10,
  },
  stepBadgeText: {
    color: '#0369A1',
    fontSize: 12,
    fontWeight: '800',
  },
  promptTitle: {
    fontSize: 18,
    fontWeight: '900',
    color: '#0F172A',
  },
  targetAccent: {
    color: '#10B981',
  },
  promptSubtitle: {
    fontSize: 13,
    fontWeight: '600',
    color: '#64748B',
    textAlign: 'center',
  },
  celebrateCard: {
    backgroundColor: '#ECFDF5',
    borderRadius: 20,
    padding: 16,
    borderWidth: 2,
    borderColor: '#10B981',
    alignItems: 'center',
    gap: 8,
    shadowColor: '#10B981',
    shadowOffset: {width: 0, height: 4},
    shadowOpacity: 0.15,
    shadowRadius: 8,
    elevation: 4,
  },
  celebrateTitle: {
    fontSize: 17,
    fontWeight: '900',
    color: '#065F46',
  },
  celebrateExp: {
    fontSize: 13,
    fontWeight: '600',
    color: '#047857',
    textAlign: 'center',
  },
  nextBtn: {
    backgroundColor: '#10B981',
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderRadius: 16,
    marginTop: 4,
  },
  nextBtnText: {
    color: '#FFFFFF',
    fontSize: 15,
    fontWeight: '800',
  },
});
