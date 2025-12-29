import { Editor, EditorPosition } from 'obsidian';
import { SUMMARY_HEADING } from '../constants';
import { VersionManager } from './version-manager';

/**
 * Editor Service
 *
 * Obsidian 에디터를 조작하여 요약을 삽입/업데이트합니다.
 */
export class EditorService {
  private versionManager: VersionManager;

  constructor() {
    this.versionManager = new VersionManager();
  }

  /**
   * 노트 내용에서 frontmatter를 제거합니다
   * @param fullContent 전체 노트 내용
   * @returns frontmatter가 제거된 내용
   */
  extractContent(fullContent: string): string {
    // YAML frontmatter 제거 (---로 시작하고 끝나는 부분)
    const withoutFrontmatter = fullContent.replace(/^---\n[\s\S]*?\n---\n/, '');
    return withoutFrontmatter.trim();
  }

  /**
   * Summary 섹션을 찾습니다
   * @param editor 에디터 인스턴스
   * @returns Summary 섹션 정보 (found, startLine, endLine, content)
   */
  findSummarySection(editor: Editor): {
    found: boolean;
    startLine: number;
    endLine: number;
    content: string;
  } {
    const totalLines = editor.lineCount();
    let startLine = -1;
    let endLine = -1;

    // Summary 헤딩 찾기
    for (let i = 0; i < totalLines; i++) {
      const line = editor.getLine(i);
      if (line.trim() === SUMMARY_HEADING) {
        startLine = i;
        break;
      }
    }

    if (startLine === -1) {
      return { found: false, startLine: -1, endLine: -1, content: '' };
    }

    // Summary 섹션의 끝 찾기 (다음 ## 헤딩 또는 파일 끝)
    endLine = totalLines - 1;
    for (let i = startLine + 1; i < totalLines; i++) {
      const line = editor.getLine(i);
      // 다른 ## 레벨 헤딩을 만나면 종료
      if (line.match(/^##\s+/)) {
        endLine = i - 1;
        break;
      }
    }

    // Summary 섹션 내용 추출
    const content = editor.getRange(
      { line: startLine, ch: 0 },
      { line: endLine + 1, ch: 0 }
    );

    return { found: true, startLine, endLine, content };
  }

  /**
   * frontmatter 다음의 삽입 위치를 찾습니다
   * @param editor 에디터 인스턴스
   * @returns 삽입할 위치
   */
  getInsertPosition(editor: Editor): EditorPosition {
    const fullText = editor.getValue();

    // frontmatter 확인
    const frontmatterMatch = fullText.match(/^---\n[\s\S]*?\n---\n/);

    if (frontmatterMatch) {
      const frontmatterEnd = frontmatterMatch[0];
      const lines = frontmatterEnd.split('\n').length - 1;
      return { line: lines, ch: 0 };
    }

    // frontmatter가 없으면 맨 처음
    return { line: 0, ch: 0 };
  }

  /**
   * 요약을 노트에 삽입하거나 업데이트합니다
   * @param editor 에디터 인스턴스
   * @param summary 요약 내용
   */
  insertOrUpdateSummary(editor: Editor, summary: string): void {
    const existing = this.findSummarySection(editor);
    const timestamp = this.versionManager.getCurrentTimestamp();

    if (existing.found) {
      // 기존 요약이 있는 경우 - 업데이트
      this.updateExistingSummary(editor, existing, summary, timestamp);
    } else {
      // 새로운 요약 삽입
      this.insertNewSummary(editor, summary, timestamp);
    }
  }

  /**
   * 새로운 요약을 삽입합니다
   * @param editor 에디터 인스턴스
   * @param summary 요약 내용
   * @param timestamp 타임스탬프
   */
  private insertNewSummary(
    editor: Editor,
    summary: string,
    timestamp: string
  ): void {
    const insertPos = this.getInsertPosition(editor);

    const summaryBlock = `${SUMMARY_HEADING}
${summary}

*Updated: ${timestamp}*

`;

    editor.replaceRange(summaryBlock, insertPos);
  }

  /**
   * 기존 요약을 업데이트하고 이전 버전을 히스토리에 보관합니다
   * @param editor 에디터 인스턴스
   * @param existing 기존 Summary 섹션 정보
   * @param newSummary 새로운 요약
   * @param newTimestamp 새로운 타임스탬프
   */
  private updateExistingSummary(
    editor: Editor,
    existing: { startLine: number; endLine: number; content: string },
    newSummary: string,
    newTimestamp: string
  ): void {
    // 기존 요약 내용 추출
    const oldSummaryContent = this.versionManager.extractSummaryContent(
      existing.content
    );
    const oldTimestamp = this.versionManager.extractTimestamp(existing.content);
    const existingHistory = this.versionManager.extractHistory(existing.content);

    // 이전 요약을 히스토리에 추가
    const newHistoryEntry = this.versionManager.createHistoryEntry(
      oldSummaryContent,
      oldTimestamp || this.versionManager.getCurrentTimestamp()
    );
    const updatedHistory = this.versionManager.updateHistory(
      existingHistory,
      newHistoryEntry
    );

    // 새로운 Summary 섹션 생성
    const newSummaryBlock = `${SUMMARY_HEADING}
${newSummary}

*Updated: ${newTimestamp}*

${updatedHistory}
`;

    // 기존 섹션 교체
    editor.replaceRange(
      newSummaryBlock,
      { line: existing.startLine, ch: 0 },
      { line: existing.endLine + 1, ch: 0 }
    );
  }

  /**
   * Summary 섹션을 삭제합니다 (선택적 기능)
   * @param editor 에디터 인스턴스
   * @returns 삭제 성공 여부
   */
  removeSummary(editor: Editor): boolean {
    const existing = this.findSummarySection(editor);

    if (!existing.found) {
      return false;
    }

    // Summary 섹션 삭제
    editor.replaceRange(
      '',
      { line: existing.startLine, ch: 0 },
      { line: existing.endLine + 1, ch: 0 }
    );

    return true;
  }
}
