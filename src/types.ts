/**
 * AI 제공자 타입
 */
export type AIProvider = 'claude' | 'openai';

/**
 * 요약 길이 타입
 */
export type SummaryLength = 'short' | 'standard' | 'detailed';

/**
 * 플러그인 설정 인터페이스
 */
export interface SummarySettings {
  /** AI 제공자 선택 */
  aiProvider: AIProvider;

  /** API 키 */
  apiKey: string;

  /** 사용할 모델 */
  model: string;

  /** 요약 길이 */
  summaryLength: SummaryLength;

  /** 첫 실행 완료 여부 (프라이버시 모달 표시용) */
  firstRunComplete: boolean;
}

/**
 * 요약 옵션 인터페이스
 */
export interface SummaryOptions {
  /** API 키 */
  apiKey: string;

  /** 모델명 */
  model: string;

  /** 요약 길이 */
  length: SummaryLength;
}

/**
 * AI 요약 제공자 인터페이스
 */
export interface ISummaryProvider {
  /**
   * 노트 내용을 요약합니다
   * @param content 요약할 노트 내용
   * @param options 요약 옵션
   * @returns 요약된 텍스트
   */
  summarize(content: string, options: SummaryOptions): Promise<string>;
}
