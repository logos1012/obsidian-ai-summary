import { Plugin, Notice, MarkdownView } from 'obsidian';
import { SummarySettings, SummaryOptions } from './types';
import { DEFAULT_SETTINGS } from './constants';
import { SummarizerFactory } from './services/summarizer';
import { EditorService } from './services/editor-service';
import { SummarySettingTab } from './ui/SettingTab';

/**
 * AI Summary Plugin
 *
 * Obsidian 노트를 AI를 사용하여 자동으로 요약하는 플러그인입니다.
 */
export default class SummaryPlugin extends Plugin {
  settings!: SummarySettings;
  private editorService!: EditorService;

  /**
   * 플러그인 로드 시 호출됩니다
   */
  async onload() {
    console.log('Loading AI Summary Plugin...');

    // EditorService 초기화
    this.editorService = new EditorService();

    // 설정 로드
    await this.loadSettings();

    // 설정 탭 추가
    this.addSettingTab(new SummarySettingTab(this.app, this));

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
      // 3. 노트 내용 추출 (EditorService 사용)
      const content = this.editorService.extractContent(editor.getValue());

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

      // 8. 요약을 노트에 삽입/업데이트
      this.editorService.insertOrUpdateSummary(editor, summary);

      // 9. 성공 알림
      new Notice('요약이 노트에 추가되었습니다 ✅');
      console.log('Summary inserted successfully');

    } catch (error) {
      console.error('Summary error:', error);
      const errorMessage = error instanceof Error ? error.message : String(error);
      new Notice(`요약 생성 실패: ${errorMessage} ❌`);
    }
  }

}
