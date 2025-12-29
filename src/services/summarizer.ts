import { ISummaryProvider, AIProvider, SummaryOptions } from '../types';
import { ClaudeSummaryProvider } from './claude-provider';

/**
 * Summarizer Service
 *
 * AI 요약 제공자를 관리하고 생성하는 팩토리 클래스입니다.
 */
export class SummarizerService {
  private provider: ISummaryProvider;

  /**
   * SummarizerService 생성자
   * @param aiProvider AI 제공자 타입
   */
  constructor(aiProvider: AIProvider) {
    this.provider = this.createProvider(aiProvider);
  }

  /**
   * AI 제공자를 생성합니다
   * @param aiProvider AI 제공자 타입
   * @returns ISummaryProvider 인스턴스
   */
  private createProvider(aiProvider: AIProvider): ISummaryProvider {
    switch (aiProvider) {
      case 'claude':
        return new ClaudeSummaryProvider();

      case 'openai':
        // TODO: Phase 2에서 구현
        throw new Error('OpenAI provider는 아직 지원되지 않습니다. Phase 2에서 추가될 예정입니다.');

      default:
        throw new Error(`지원하지 않는 AI 제공자: ${aiProvider}`);
    }
  }

  /**
   * 노트 내용을 요약합니다
   * @param content 요약할 노트 내용
   * @param options 요약 옵션
   * @returns 요약된 텍스트
   */
  async summarize(content: string, options: SummaryOptions): Promise<string> {
    // 입력 검증
    this.validateInput(content);

    // 요약 실행
    return await this.provider.summarize(content, options);
  }

  /**
   * 입력 내용을 검증합니다
   * @param content 검증할 내용
   */
  private validateInput(content: string): void {
    // 빈 내용 체크
    if (!content || content.trim().length === 0) {
      throw new Error('노트 내용이 비어있습니다');
    }

    // 최소 길이 체크 (너무 짧은 노트는 요약 불필요)
    const minLength = 100; // 최소 100자
    if (content.trim().length < minLength) {
      throw new Error(`노트가 너무 짧습니다 (최소 ${minLength}자 필요)`);
    }

    // 최대 길이 체크
    const maxLength = 100000; // 최대 100,000자
    if (content.length > maxLength) {
      throw new Error(`노트가 너무 깁니다 (최대 ${maxLength.toLocaleString()}자)`);
    }
  }

  /**
   * 현재 사용 중인 제공자를 반환합니다
   * @returns 제공자 인스턴스
   */
  getProvider(): ISummaryProvider {
    return this.provider;
  }
}

/**
 * Summarizer Factory
 *
 * SummarizerService 인스턴스를 생성하는 헬퍼 함수입니다.
 */
export class SummarizerFactory {
  /**
   * SummarizerService를 생성합니다
   * @param aiProvider AI 제공자 타입
   * @returns SummarizerService 인스턴스
   */
  static create(aiProvider: AIProvider): SummarizerService {
    return new SummarizerService(aiProvider);
  }
}
