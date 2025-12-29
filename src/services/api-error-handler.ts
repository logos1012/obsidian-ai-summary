/**
 * API 에러 핸들러
 *
 * AI API 호출 시 발생하는 다양한 에러를 처리합니다.
 */
export class APIErrorHandler {
  /**
   * HTTP 응답 에러를 처리합니다
   * @param response HTTP 응답 객체
   * @returns 사용자 친화적인 에러 메시지
   */
  static async handleHTTPError(response: Response): Promise<string> {
    const status = response.status;

    // 응답 본문 읽기 (에러 상세 정보)
    let errorDetail = '';
    try {
      const errorData = await response.json() as any;
      errorDetail = errorData.error?.message || errorData.message || '';
    } catch {
      // JSON 파싱 실패 시 무시
    }

    switch (status) {
      case 401:
        return 'API 키가 유효하지 않습니다. 설정을 확인해주세요.';

      case 429:
        return 'API 사용량 한도를 초과했습니다. 잠시 후 다시 시도해주세요.';

      case 400:
        return `잘못된 요청입니다${errorDetail ? ': ' + errorDetail : ''}`;

      case 403:
        return 'API 접근 권한이 없습니다. API 키를 확인해주세요.';

      case 500:
      case 502:
      case 503:
        return 'AI 서버에 일시적인 문제가 발생했습니다. 잠시 후 다시 시도해주세요.';

      case 529:
        return 'AI 서버가 과부하 상태입니다. 잠시 후 다시 시도해주세요.';

      default:
        return `요청 실패 (HTTP ${status})${errorDetail ? ': ' + errorDetail : ''}`;
    }
  }

  /**
   * 네트워크 에러를 처리합니다
   * @param error 에러 객체
   * @returns 사용자 친화적인 에러 메시지
   */
  static handleNetworkError(error: Error): string {
    const message = error.message.toLowerCase();

    if (message.includes('timeout') || message.includes('aborted')) {
      return '요청 시간이 초과되었습니다. 네트워크 연결을 확인하거나 잠시 후 다시 시도해주세요.';
    }

    if (message.includes('network') || message.includes('fetch')) {
      return '네트워크 연결에 실패했습니다. 인터넷 연결을 확인해주세요.';
    }

    return `네트워크 오류: ${error.message}`;
  }

  /**
   * 일반적인 에러를 처리합니다
   * @param error 에러 객체
   * @returns 사용자 친화적인 에러 메시지
   */
  static handleGenericError(error: unknown): string {
    if (error instanceof Error) {
      return error.message;
    }

    return String(error);
  }
}
