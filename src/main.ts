import { Plugin, Notice } from 'obsidian';
import { SummarySettings } from './types';
import { DEFAULT_SETTINGS } from './constants';

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
    // API 키 확인
    if (!this.settings.apiKey) {
      new Notice('⚠️ API 키를 설정해주세요. Settings > AI Summary에서 설정할 수 있습니다.');
      return;
    }

    try {
      new Notice('요약 생성 중... ⏳');

      // TODO: 실제 요약 로직 구현 (Day 3-4)
      console.log('Summarize button clicked!');
      console.log('Current settings:', this.settings);

      // 임시 성공 메시지
      await new Promise(resolve => setTimeout(resolve, 1000)); // 1초 대기 (테스트용)
      new Notice('요약이 추가되었습니다 ✅ (현재는 테스트 모드)');

    } catch (error) {
      console.error('Summary error:', error);
      const errorMessage = error instanceof Error ? error.message : String(error);
      new Notice(`요약 생성 실패: ${errorMessage} ❌`);
    }
  }
}
