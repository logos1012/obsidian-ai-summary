import { SummarySettings } from './types';

/**
 * 기본 플러그인 설정
 */
export const DEFAULT_SETTINGS: SummarySettings = {
  aiProvider: 'claude',
  apiKey: '',
  model: 'claude-sonnet-4-5',
  summaryLength: 'standard',
  firstRunComplete: false
};

/**
 * Claude API 엔드포인트
 */
export const CLAUDE_API_URL = 'https://api.anthropic.com/v1/messages';

/**
 * OpenAI API 엔드포인트
 */
export const OPENAI_API_URL = 'https://api.openai.com/v1/chat/completions';

/**
 * API 요청 타임아웃 (밀리초)
 */
export const API_TIMEOUT = 30000;

/**
 * 최대 노트 길이 (문자 수)
 */
export const MAX_NOTE_LENGTH = 100000;

/**
 * 요약 섹션 헤딩
 */
export const SUMMARY_HEADING = '## Summary';

/**
 * Claude 모델 목록 (Claude 4.x)
 */
export const CLAUDE_MODELS = [
  'claude-sonnet-4-5',
  'claude-haiku-4-5',
  'claude-opus-4-5-20251101',
  'claude-opus-4-20250514',
  'claude-3-7-sonnet-20250219'
];

/**
 * OpenAI 모델 목록
 */
export const OPENAI_MODELS = [
  'gpt-4-turbo-preview',
  'gpt-4',
  'gpt-3.5-turbo'
];
