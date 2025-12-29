import { requestUrl } from 'obsidian';
import { ISummaryProvider, SummaryOptions } from '../types';
import { CLAUDE_API_URL, API_TIMEOUT } from '../constants';
import { APIErrorHandler } from './api-error-handler';

/**
 * Claude API 응답 인터페이스
 */
interface ClaudeResponse {
  id: string;
  type: string;
  role: string;
  content: Array<{
    type: string;
    text: string;
  }>;
  model: string;
  usage: {
    input_tokens: number;
    output_tokens: number;
  };
}

/**
 * Claude API Provider
 *
 * Anthropic Claude API를 사용하여 노트를 요약합니다.
 */
export class ClaudeSummaryProvider implements ISummaryProvider {
  /**
   * 노트 내용을 요약합니다
   * @param content 요약할 노트 내용
   * @param options 요약 옵션
   * @returns 요약된 텍스트
   */
  async summarize(content: string, options: SummaryOptions): Promise<string> {
    // API 키 검증
    if (!options.apiKey || options.apiKey.trim() === '') {
      throw new Error('API 키가 설정되지 않았습니다');
    }

    // API 키 형식 검증
    if (!options.apiKey.startsWith('sk-ant-')) {
      console.warn('⚠️ API 키 형식이 올바르지 않을 수 있습니다. Anthropic API 키는 "sk-ant-"로 시작해야 합니다.');
    }

    console.log('🔑 API 요청 준비:', {
      model: options.model,
      length: options.length,
      apiKeyPrefix: options.apiKey.substring(0, 10) + '...'
    });

    // 프롬프트 생성
    const prompt = this.buildPrompt(content, options.length);

    // API 호출 (timeout 및 retry 포함)
    const summary = await this.callClaudeAPI(prompt, options);

    return summary;
  }

  /**
   * 프롬프트를 생성합니다
   * @param content 노트 내용
   * @param length 요약 길이
   * @returns 프롬프트 문자열
   */
  private buildPrompt(content: string, length: string): string {
    const lengthInstruction = this.getLengthInstruction(length);

    // 언어 감지 (간단한 휴리스틱)
    const hasKorean = /[가-힣]/.test(content);

    if (hasKorean) {
      return `다음 마크다운 노트를 ${lengthInstruction}로 요약해주세요.

요약 규칙:
1. 핵심 내용과 주요 논점만 포함하세요
2. 원문의 주요 개념과 결론을 명확히 전달하세요
3. 불필요한 세부사항은 생략하세요
4. 마크다운 포맷을 유지하되, 헤딩은 사용하지 마세요
5. 자연스러운 한국어로 작성하세요

노트 내용:
${content}`;
    } else {
      return `Please summarize the following markdown note in ${lengthInstruction}.

Summary rules:
1. Include only key points and main arguments
2. Clearly convey the main concepts and conclusions
3. Omit unnecessary details
4. Maintain markdown format but don't use headings
5. Write in natural English

Note content:
${content}`;
    }
  }

  /**
   * 길이별 프롬프트 지시사항을 반환합니다
   * @param length 요약 길이
   * @returns 길이 지시사항
   */
  private getLengthInstruction(length: string): string {
    switch (length) {
      case 'short':
        return '3-5문장';
      case 'detailed':
        return '2-3단락';
      default: // 'standard'
        return '1-2단락';
    }
  }

  /**
   * Claude API를 호출합니다 (timeout 및 retry 포함)
   * @param prompt 프롬프트
   * @param options 요약 옵션
   * @returns 요약 텍스트
   */
  private async callClaudeAPI(
    prompt: string,
    options: SummaryOptions
  ): Promise<string> {
    const maxRetries = 1; // 1회 재시도
    let lastError: Error | null = null;

    for (let attempt = 0; attempt <= maxRetries; attempt++) {
      try {
        console.log(`🌐 API 요청 시도 ${attempt + 1}/${maxRetries + 1}`, {
          url: CLAUDE_API_URL,
          model: options.model
        });

        // Obsidian의 requestUrl 사용
        const response = await requestUrl({
          url: CLAUDE_API_URL,
          method: 'POST',
          headers: {
            'anthropic-version': '2023-06-01',
            'x-api-key': options.apiKey,
            'content-type': 'application/json'
          },
          body: JSON.stringify({
            model: options.model,
            max_tokens: this.getMaxTokens(options.length),
            messages: [
              {
                role: 'user',
                content: prompt
              }
            ]
          }),
          throw: false  // 에러를 자동으로 throw하지 않음
        });

        console.log(`📡 API 응답 상태: ${response.status}`);

        // HTTP 에러 처리
        if (response.status >= 400) {
          console.error('❌ API 에러 응답:', {
            status: response.status,
            headers: response.headers,
            body: response.json
          });

          // 에러 메시지 상세 출력
          if (response.json && typeof response.json === 'object') {
            console.error('❌ 에러 상세:', JSON.stringify(response.json, null, 2));
          }

          // 404 에러 특별 처리
          if (response.status === 404) {
            const errorDetail = response.json as any;
            if (errorDetail?.error?.message) {
              throw new Error(`API 404 에러: ${errorDetail.error.message}`);
            } else {
              throw new Error('API 404 에러: 엔드포인트를 찾을 수 없습니다. API 키가 유효한지 확인해주세요.');
            }
          }

          // Response 객체 모킹 (APIErrorHandler 호환성)
          const mockResponse = {
            ok: false,
            status: response.status,
            statusText: '',
            text: async () => JSON.stringify(response.json)
          } as Response;

          const errorMessage = await APIErrorHandler.handleHTTPError(mockResponse);
          throw new Error(errorMessage);
        }

        // 응답 파싱
        const data = response.json as ClaudeResponse;

        // 응답 검증
        if (!data.content || data.content.length === 0) {
          throw new Error('AI 응답이 비어있습니다');
        }

        const summary = data.content[0].text.trim();

        // 토큰 사용량 로그 (디버깅용)
        console.log('Claude API usage:', {
          input_tokens: data.usage.input_tokens,
          output_tokens: data.usage.output_tokens,
          model: data.model
        });

        return summary;

      } catch (error) {
        lastError = error as Error;

        // 네트워크 에러
        if (error instanceof Error &&
            (error.message.includes('network') ||
             error.message.includes('ENOTFOUND') ||
             error.message.includes('ECONNREFUSED'))) {
          lastError = new Error('인터넷 연결을 확인해주세요. API 서버에 접속할 수 없습니다.');
        }

        // 마지막 시도가 아니고 재시도 가능한 에러면 재시도
        if (attempt < maxRetries && this.isRetryable(error)) {
          console.log(`Retrying due to error (${attempt + 1}/${maxRetries})...`);
          await new Promise(resolve => setTimeout(resolve, 1000)); // 1초 대기
          continue;
        }

        // 재시도 불가능하거나 마지막 시도면 에러 발생
        break;
      }
    }

    // 모든 시도 실패
    throw lastError || new Error('알 수 없는 오류가 발생했습니다');
  }

  /**
   * 에러가 재시도 가능한지 확인합니다
   * @param error 에러 객체
   * @returns 재시도 가능 여부
   */
  private isRetryable(error: unknown): boolean {
    if (error instanceof Error) {
      const message = error.message.toLowerCase();
      // 네트워크 에러나 일시적인 서버 에러는 재시도
      return message.includes('network') ||
             message.includes('timeout') ||
             message.includes('503') ||
             message.includes('502');
    }
    return false;
  }

  /**
   * 요약 길이에 따른 최대 토큰 수를 반환합니다
   * @param length 요약 길이
   * @returns 최대 토큰 수
   */
  private getMaxTokens(length: string): number {
    switch (length) {
      case 'short':
        return 512;   // 3-5문장
      case 'detailed':
        return 2048;  // 2-3단락
      default:
        return 1024;  // 1-2단락
    }
  }
}
