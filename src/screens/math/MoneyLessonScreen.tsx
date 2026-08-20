import React, {useState} from 'react';
import {
  Modal,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import {useTranslation} from 'react-i18next';
import type {NativeStackScreenProps} from '@react-navigation/native-stack';

import {useAppDispatch, useAppSelector} from '@app/store';
import {AppSafeAreaView} from '@components/AppSafeAreaView';
import {asChildId, ModuleId} from '@core/domain';
import {
  applyGrantResult,
  createMmkvGamificationRepository,
  grantRewards,
} from '@core/gamification';
import {BackButton, space} from '@shared/ui';
import type {MathStackParamList} from '@navigation/mathTypes';

import {
  ChangeCalculatorGame,
  CoinsExplorer,
  MoneyCountingGame,
  MoneyQuizView,
  NotesExplorer,
  ShoppingGameView,
} from '../../features/math/presentation/money';
import {
  readMoneyProgress,
  recordChangePuzzleSolved,
  recordCoinChallengeDone,
  recordMoneyQuizScore,
  recordMoneyTabCompleted,
  recordShoppingPurchase,
} from '../../features/math/domain/money/moneyProgress';
import type {MoneyTabId} from '../../features/math/domain/money/types';

type Props = NativeStackScreenProps<MathStackParamList, 'Lesson'>;

export function MoneyLessonScreen({navigation}: Props) {
  const {t} = useTranslation();
  const dispatch = useAppDispatch();
  const activeChildId = useAppSelector(state => state.profile.activeChildId);
  const gamification = useAppSelector(state => state.gamification);

  const [activeTab, setActiveTab] = useState<MoneyTabId>('coins');
  const [shopSubMode, setShopSubMode] = useState<'shop' | 'change'>('shop');
  const [celebrationMsg, setCelebrationMsg] = useState<string | null>(null);
  const [earnedStars, setEarnedStars] = useState<number>(0);
  const [_moneyProgress, setMoneyProgress] = useState(readMoneyProgress);

  const totalWalletStars = gamification.snapshot?.wallet?.stars ?? 0;

  const handleGrantReward = async (starCount: number, message: string) => {
    setEarnedStars(starCount);
    setCelebrationMsg(message);
    const updated = recordMoneyTabCompleted(activeTab, starCount);
    setMoneyProgress(updated);

    if (activeChildId) {
      const cid = asChildId(activeChildId);
      const repo = createMmkvGamificationRepository();
      const res = await grantRewards(repo, {
        childId: cid,
        ruleId: 'money.completed',
        moduleId: ModuleId.Math,
        topicId: `money.${activeTab}`,
        baseStars: starCount,
      });
      dispatch(applyGrantResult(res));
    }
  };

  const handleCoinSuccess = () => {
    recordCoinChallengeDone();
    handleGrantReward(1, '🪙 Great job discovering Indian Coins!');
  };

  const handleNoteSuccess = () => {
    handleGrantReward(1, '💵 Awesome! You recognized Indian Notes!');
  };

  const handleCountSuccess = () => {
    handleGrantReward(2, '🔢 Brilliant! You added up the money correctly!');
  };

  const handleShoppingSuccess = () => {
    recordShoppingPurchase();
    handleGrantReward(2, '🛒 Smart Shopper! You bought items from the market!');
  };

  const handleChangeSuccess = () => {
    recordChangePuzzleSolved();
    handleGrantReward(1, '💰 Excellent! You calculated the exact change!');
  };

  const handleQuizFinish = (score: number) => {
    recordMoneyQuizScore(score);
    handleGrantReward(
      3,
      `🏆 Money Master! You scored ${score} in the Money Quiz!`,
    );
  };

  return (
    <AppSafeAreaView
      backgroundImage={null}
      backgroundColor="#ECFDF5"
      padded={false}
      edges={['top', 'left', 'right']}>
      {/* Header */}
      <View style={styles.header}>
        <BackButton
          label={t('common.back', 'Back')}
          onPress={() => {
            if (navigation.canGoBack()) {
              navigation.goBack();
            } else {
              navigation.navigate('Hub');
            }
          }}
        />
        <View style={styles.headerTitleWrap}>
          <Text style={styles.headerEmoji}>💰</Text>
          <Text style={styles.headerTitle}>
            {t('math.money.title', 'Money Explorer')}
          </Text>
        </View>
        <View style={styles.starPill}>
          <Text style={styles.starIcon}>★</Text>
          <Text style={styles.starValue}>{totalWalletStars}</Text>
        </View>
      </View>

      {/* Tabs Navigation */}
      <View style={styles.tabsScrollWrap}>
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.tabsContainer}>
          <Pressable
            accessibilityRole="tab"
            onPress={() => setActiveTab('coins')}
            style={[
              styles.tabBtn,
              activeTab === 'coins' && styles.tabBtnActive,
            ]}>
            <Text style={styles.tabBtnEmoji}>🪙</Text>
            <Text
              style={[
                styles.tabBtnText,
                activeTab === 'coins' && styles.tabBtnTextActive,
              ]}>
              {t('math.money.tabs.coins', 'Coins')}
            </Text>
          </Pressable>

          <Pressable
            accessibilityRole="tab"
            onPress={() => setActiveTab('notes')}
            style={[
              styles.tabBtn,
              activeTab === 'notes' && styles.tabBtnActive,
            ]}>
            <Text style={styles.tabBtnEmoji}>💵</Text>
            <Text
              style={[
                styles.tabBtnText,
                activeTab === 'notes' && styles.tabBtnTextActive,
              ]}>
              {t('math.money.tabs.notes', 'Notes')}
            </Text>
          </Pressable>

          <Pressable
            accessibilityRole="tab"
            onPress={() => setActiveTab('counting')}
            style={[
              styles.tabBtn,
              activeTab === 'counting' && styles.tabBtnActive,
            ]}>
            <Text style={styles.tabBtnEmoji}>🔢</Text>
            <Text
              style={[
                styles.tabBtnText,
                activeTab === 'counting' && styles.tabBtnTextActive,
              ]}>
              {t('math.money.tabs.counting', 'Count Money')}
            </Text>
          </Pressable>

          <Pressable
            accessibilityRole="tab"
            onPress={() => setActiveTab('shopping')}
            style={[
              styles.tabBtn,
              activeTab === 'shopping' && styles.tabBtnActive,
            ]}>
            <Text style={styles.tabBtnEmoji}>🛒</Text>
            <Text
              style={[
                styles.tabBtnText,
                activeTab === 'shopping' && styles.tabBtnTextActive,
              ]}>
              {t('math.money.tabs.shopping', 'Shopping')}
            </Text>
          </Pressable>

          <Pressable
            accessibilityRole="tab"
            onPress={() => setActiveTab('quiz')}
            style={[
              styles.tabBtn,
              activeTab === 'quiz' && styles.tabBtnActive,
            ]}>
            <Text style={styles.tabBtnEmoji}>🎯</Text>
            <Text
              style={[
                styles.tabBtnText,
                activeTab === 'quiz' && styles.tabBtnTextActive,
              ]}>
              {t('math.money.tabs.quiz', 'Money Quiz')}
            </Text>
          </Pressable>
        </ScrollView>
      </View>

      {/* Main Tab Content */}
      <ScrollView
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}>
        {activeTab === 'coins' && (
          <CoinsExplorer onSuccess={handleCoinSuccess} />
        )}

        {activeTab === 'notes' && (
          <NotesExplorer onSuccess={handleNoteSuccess} />
        )}

        {activeTab === 'counting' && (
          <MoneyCountingGame onSuccess={handleCountSuccess} />
        )}

        {activeTab === 'shopping' && (
          <View style={styles.shopSection}>
            {/* Sub-toggle between Market & Change */}
            <View style={styles.subToggleRow}>
              <Pressable
                accessibilityRole="button"
                onPress={() => setShopSubMode('shop')}
                style={[
                  styles.subToggleBtn,
                  shopSubMode === 'shop' && styles.subToggleBtnActive,
                ]}>
                <Text
                  style={[
                    styles.subToggleText,
                    shopSubMode === 'shop' && styles.subToggleTextActive,
                  ]}>
                  🛒 Supermarket
                </Text>
              </Pressable>

              <Pressable
                accessibilityRole="button"
                onPress={() => setShopSubMode('change')}
                style={[
                  styles.subToggleBtn,
                  shopSubMode === 'change' && styles.subToggleBtnActive,
                ]}>
                <Text
                  style={[
                    styles.subToggleText,
                    shopSubMode === 'change' && styles.subToggleTextActive,
                  ]}>
                  💰 Change Calculator
                </Text>
              </Pressable>
            </View>

            {shopSubMode === 'shop' ? (
              <ShoppingGameView onPurchaseSuccess={handleShoppingSuccess} />
            ) : (
              <ChangeCalculatorGame onSuccess={handleChangeSuccess} />
            )}
          </View>
        )}

        {activeTab === 'quiz' && (
          <MoneyQuizView onFinishQuiz={handleQuizFinish} />
        )}
      </ScrollView>

      {/* Celebration Modal */}
      <Modal
        visible={celebrationMsg !== null}
        transparent
        animationType="fade"
        onRequestClose={() => setCelebrationMsg(null)}>
        <View style={styles.modalOverlay}>
          <View style={styles.modalCard}>
            <Text style={styles.modalEmoji}>🎉 ⭐ 💰</Text>
            <Text style={styles.modalTitle}>Fantastic!</Text>
            <Text style={styles.modalMsg}>{celebrationMsg}</Text>
            <View style={styles.modalStarBurst}>
              <Text style={styles.modalStarText}>+{earnedStars} Stars!</Text>
            </View>
            <Pressable
              accessibilityRole="button"
              onPress={() => setCelebrationMsg(null)}
              style={styles.modalBtn}>
              <Text style={styles.modalBtnText}>Keep Playing! 🚀</Text>
            </Pressable>
          </View>
        </View>
      </Modal>
    </AppSafeAreaView>
  );
}

const styles = StyleSheet.create({
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingTop: space.xs,
    paddingBottom: space.sm,
    gap: 10,
  },
  headerTitleWrap: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  headerEmoji: {
    fontSize: 22,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: '900',
    color: '#065F46',
  },
  starPill: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: '#F59E0B',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 999,
  },
  starIcon: {
    color: '#FFFBEB',
    fontSize: 14,
    fontWeight: '800',
  },
  starValue: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '800',
  },
  tabsScrollWrap: {
    paddingVertical: 4,
    backgroundColor: '#FFFFFF',
    borderBottomWidth: 1,
    borderBottomColor: '#E2E8F0',
  },
  tabsContainer: {
    flexDirection: 'row',
    paddingHorizontal: 14,
    gap: 8,
    alignItems: 'center',
  },
  tabBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingHorizontal: 14,
    paddingVertical: 10,
    borderRadius: 16,
    backgroundColor: '#F8FAFC',
    borderWidth: 1.5,
    borderColor: '#E2E8F0',
  },
  tabBtnActive: {
    backgroundColor: '#10B981',
    borderColor: '#059669',
  },
  tabBtnEmoji: {
    fontSize: 16,
  },
  tabBtnText: {
    fontSize: 13,
    fontWeight: '800',
    color: '#475569',
  },
  tabBtnTextActive: {
    color: '#FFFFFF',
  },
  content: {
    padding: 16,
    paddingBottom: space.xxl,
  },
  shopSection: {
    gap: 12,
  },
  subToggleRow: {
    flexDirection: 'row',
    backgroundColor: '#E2E8F0',
    borderRadius: 14,
    padding: 4,
    gap: 6,
  },
  subToggleBtn: {
    flex: 1,
    paddingVertical: 8,
    borderRadius: 10,
    alignItems: 'center',
  },
  subToggleBtnActive: {
    backgroundColor: '#FFFFFF',
    shadowColor: '#000000',
    shadowOffset: {width: 0, height: 1},
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  subToggleText: {
    fontSize: 13,
    fontWeight: '800',
    color: '#64748B',
  },
  subToggleTextActive: {
    color: '#0F172A',
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 24,
  },
  modalCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 24,
    padding: 24,
    alignItems: 'center',
    gap: 12,
    width: '100%',
    maxWidth: 340,
    shadowColor: '#000000',
    shadowOffset: {width: 0, height: 8},
    shadowOpacity: 0.25,
    shadowRadius: 16,
    elevation: 8,
  },
  modalEmoji: {
    fontSize: 44,
  },
  modalTitle: {
    fontSize: 22,
    fontWeight: '900',
    color: '#065F46',
  },
  modalMsg: {
    fontSize: 14,
    fontWeight: '700',
    color: '#334155',
    textAlign: 'center',
  },
  modalStarBurst: {
    backgroundColor: '#FEF3C7',
    paddingHorizontal: 16,
    paddingVertical: 6,
    borderRadius: 12,
  },
  modalStarText: {
    fontSize: 16,
    fontWeight: '900',
    color: '#B45309',
  },
  modalBtn: {
    backgroundColor: '#10B981',
    borderRadius: 16,
    paddingHorizontal: 24,
    paddingVertical: 12,
    marginTop: 6,
  },
  modalBtnText: {
    color: '#FFFFFF',
    fontSize: 15,
    fontWeight: '800',
  },
});
