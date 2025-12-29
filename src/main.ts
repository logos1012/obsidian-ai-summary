import { Plugin, Notice, MarkdownView } from 'obsidian';
import { SummarySettings, SummaryOptions } from './types';
import { DEFAULT_SETTINGS } from './constants';
import { SummarizerFactory } from './services/summarizer';

/**
 * AI Summary Plugin
 *
 * Obsidian 노트를 AI를 사용하여 자동으로 요약하는 플러그인입니다.
 */
export default class SummaryPlugin extends Plugin {
  settings!: SummarySettings;

  /**
   * 플러그인 로드 시 호출됩니다
   */
  async onload() {
    console.log('Loading AI Summary Plugin...');

    // 설정 로드
    await this.loadSettings();

    // 리본 아이콘 추가
    this.addRibbonIcon('sparkles', 'Summarize note', async () => {
      await this.summarizeCurrentNote();
    });

    // 커맨드 추가
    this.addCommand({
      id: 'summarize-note',
      name: 'Summarize current note',
      callback: async () => {
        await this.summarizeCurrentNote();
      }
    });

    console.log('AI Summary Plugin loaded successfully!');
  }

  /**
   * 플러그인 언로드 시 호출됩니다
   */
  async onunload() {
    console.log('Unloading AI Summary Plugin...');
  }

  /**
   * 설정을 로드합니다
   */
  async loadSettings() {
    this.settings = Object.assign({}, DEFAULT_SETTINGS, await this.loadData());
  }

  /**
   * 설정을 저장합니다
   */
  async saveSettings() {
    await this.saveData(this.settings);
  }

  /**
   * 현재 노트를 요약합니다
   */
  async summarizeCurrentNote() {
    // 1. API 키 확인
    if (!this.settings.apiKey) {
      new Notice('⚠️ API 키를 설정해주세요. Settings > AI Summary에서 설정할 수 있습니다.');
      return;
    }

    // 2. 활성 에디터 가져오기
    const activeView = this.app.workspace.getActiveViewOfType(MarkdownView);
    if (!activeView) {
      new Notice('⚠️ 마크다운 노트를 열어주세요.');
      return;
    }

    const editor = activeView.editor;
    if (!editor) {
      new Notice('⚠️ 에디터를 찾을 수 없습니다.');
      return;
    }

    try {
      // 3. 노트 내용 추출
      const content = this.extractContent(editor.getValue());

      // 4. 요약 생성 시작 알림
      new Notice('요약 생성 중... ⏳');

      // 5. Summarizer 생성
      const summarizer = SummarizerFactory.create(this.settings.aiProvider);

      // 6. 요약 옵션 설정
      const options: SummaryOptions = {
        apiKey: this.settings.apiKey,
        model: this.settings.model,
        length: this.settings.summaryLength
      };

      // 7. 요약 실행
      const summary = await summarizer.summarize(content, options);

      // 8. 성공 알림 및 결과 출력
      new Notice('요약이 생성되었습니다 ✅');
      console.log('=== Summary Result ===');
      console.log(summary);
      console.log('=====================');

      // TODO: Day 5-7에서 요약을 노트에 삽입하는 기능 구현
      new Notice('💡 요약이 콘솔에 출력되었습니다. 개발자 도구를 확인하세요.');

    } catch (error) {
      console.error('Summary error:', error);
      const errorMessage = error instanceof Error ? error.message : String(error);
      new Notice(`요약 생성 실패: ${errorMessage} ❌`);
    }
  }

  /**
   * 노트 내용에서 frontmatter를 제거합니다
   * @param fullContent 전체 노트 내용
   * @returns frontmatter가 제거된 내용
   */
  private extractContent(fullContent: string): string {
    // YAML frontmatter 제거 (---로 시작하고 끝나는 부분)
    const withoutFrontmatter = fullContent.replace(/^---\n[\s\S]*?\n---\n/, '');
    return withoutFrontmatter.trim();
  }
}
