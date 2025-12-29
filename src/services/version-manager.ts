/**
 * Version Manager
 *
 * 요약 버전 관리 및 타임스탬프를 담당합니다.
 */
export class VersionManager {
  /**
   * 현재 타임스탬프를 반환합니다 (YYYY-MM-DD HH:mm 형식)
   * @returns 타임스탬프 문자열
   */
  getCurrentTimestamp(): string {
    const now = new Date();
    const year = now.getFullYear();
    const month = String(now.getMonth() + 1).padStart(2, '0');
    const day = String(now.getDate()).padStart(2, '0');
    const hours = String(now.getHours()).padStart(2, '0');
    const minutes = String(now.getMinutes()).padStart(2, '0');

    return `${year}-${month}-${day} ${hours}:${minutes}`;
  }

  /**
   * 이전 요약을 히스토리 섹션으로 변환합니다
   * @param oldSummary 이전 요약 내용
   * @param timestamp 이전 요약의 타임스탬프
   * @returns 히스토리 마크다운
   */
  createHistoryEntry(oldSummary: string, timestamp: string): string {
    return `### ${timestamp}
${oldSummary}
`;
  }

  /**
   * 히스토리 섹션을 생성하거나 업데이트합니다
   * @param existingHistory 기존 히스토리 (없으면 '')
   * @param newEntry 새로운 히스토리 엔트리
   * @returns 업데이트된 히스토리
   */
  updateHistory(existingHistory: string, newEntry: string): string {
    if (!existingHistory || existingHistory.trim() === '') {
      // 처음 히스토리 생성
      return `
<details>
<summary>이전 요약 히스토리</summary>

${newEntry}
</details>
`;
    }

    // 기존 히스토리에 새 엔트리 추가
    // </details> 태그 앞에 삽입
    const detailsEndIndex = existingHistory.lastIndexOf('</details>');
    if (detailsEndIndex === -1) {
      // </details> 태그가 없으면 그냥 추가
      return existingHistory + '\n' + newEntry + '\n</details>\n';
    }

    return (
      existingHistory.slice(0, detailsEndIndex) +
      newEntry +
      '\n' +
      existingHistory.slice(detailsEndIndex)
    );
  }

  /**
   * 요약 히스토리 섹션을 추출합니다
   * @param summarySection 전체 Summary 섹션
   * @returns 히스토리 부분 (없으면 '')
   */
  extractHistory(summarySection: string): string {
    const detailsMatch = summarySection.match(/<details>[\s\S]*?<\/details>/);
    return detailsMatch ? detailsMatch[0] : '';
  }

  /**
   * Summary 섹션에서 실제 요약 내용만 추출합니다 (히스토리 제외)
   * @param summarySection 전체 Summary 섹션
   * @returns 순수 요약 내용
   */
  extractSummaryContent(summarySection: string): string {
    // 헤딩 제거
    let content = summarySection.replace(/^## Summary\n/, '');

    // 타임스탬프 제거 (*Updated: ...*)
    content = content.replace(/\*Updated: .*?\*\n?/g, '');

    // 히스토리 섹션 제거
    content = content.replace(/<details>[\s\S]*?<\/details>/g, '');

    // 앞뒤 공백 제거
    return content.trim();
  }

  /**
   * 요약 섹션에서 타임스탬프를 추출합니다
   * @param summarySection 전체 Summary 섹션
   * @returns 타임스탬프 (없으면 '')
   */
  extractTimestamp(summarySection: string): string {
    const timestampMatch = summarySection.match(/\*Updated: (.*?)\*/);
    return timestampMatch ? timestampMatch[1] : '';
  }
}
