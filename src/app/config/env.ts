/**
 * Typed environment contract.
 *
 * Decision: react-native-config injects native .env values at build time.
 * We wrap Config in a validated object with safe defaults so Jest and early
 * boot do not crash when native Config is unavailable.
 */

type RawConfig = Record<string, string | undefined>;

function readNativeConfig(): RawConfig {
  try {
    // Lazily require so Jest can mock without native binaries.

    const Config = require('react-native-config').default as RawConfig;
    return Config ?? {};
  } catch {
    return {};
  }
}

function asBool(value: string | undefined, fallback: boolean): boolean {
  if (value == null || value === '') {
    return fallback;
  }
  return value === '1' || value.toLowerCase() === 'true';
}

const raw = readNativeConfig();

export type PreferredAiProvider = 'openai' | 'gemini';

export type AppEnv = {
  readonly appEnv: 'development' | 'staging' | 'production';
  readonly apiBaseUrl: string;
  readonly firebaseEnabled: boolean;
  readonly openAiProxyUrl: string;
  readonly geminiProxyUrl: string;
  readonly geminiApiKey: string;
  readonly geminiModel: string;
  readonly ttsProxyUrl: string;
  readonly preferredAiProvider: PreferredAiProvider;
  readonly authRequired: boolean;
};

function asPreferredAiProvider(value: string | undefined): PreferredAiProvider {
  return value === 'gemini' ? 'gemini' : 'openai';
}

/**
 * Public browser/client env — never put secret API keys here.
 * OpenAI/Gemini/TTS must be called via backend proxy URLs only.
 */
export const env: AppEnv = {
  appEnv: (raw.APP_ENV as AppEnv['appEnv']) ?? 'development',
  apiBaseUrl: raw.API_BASE_URL ?? 'https://api.example.com',
  firebaseEnabled: asBool(raw.FIREBASE_ENABLED, false),
  openAiProxyUrl: raw.OPENAI_PROXY_URL ?? '',
  geminiProxyUrl: raw.GEMINI_PROXY_URL ?? '',
  geminiApiKey: raw.GEMINI_API_KEY ?? '',
  geminiModel: raw.GEMINI_MODEL ?? 'gemini-2.0-flash',
  ttsProxyUrl: raw.TTS_PROXY_URL ?? '',
  preferredAiProvider: asPreferredAiProvider(raw.PREFERRED_AI_PROVIDER),
  authRequired: asBool(raw.AUTH_REQUIRED, false),
};

export const isDevEnv = env.appEnv === 'development' || __DEV__;
