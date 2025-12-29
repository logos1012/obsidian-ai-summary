import { App, PluginSettingTab, Setting } from 'obsidian';
import SummaryPlugin from '../main';
import { AIProvider, SummaryLength } from '../types';
import { CLAUDE_MODELS, OPENAI_MODELS } from '../constants';

/**
 * AI Summary 플러그인 설정 탭
 */
export class SummarySettingTab extends PluginSettingTab {
  plugin: SummaryPlugin;

  constructor(app: App, plugin: SummaryPlugin) {
    super(app, plugin);
    this.plugin = plugin;
  }

  display(): void {
    const { containerEl } = this;
    containerEl.empty();

    // 헤더
    containerEl.createEl('h2', { text: 'AI Summary Settings' });

    // AI Provider 선택
    new Setting(containerEl)
      .setName('AI Provider')
      .setDesc('사용할 AI 서비스를 선택하세요')
      .addDropdown(dropdown => dropdown
        .addOption('claude', 'Claude (Anthropic)')
        .addOption('openai', 'OpenAI')
        .setValue(this.plugin.settings.aiProvider)
        .onChange(async (value) => {
          this.plugin.settings.aiProvider = value as AIProvider;

          // Provider 변경 시 기본 모델로 재설정
          if (value === 'claude') {
            this.plugin.settings.model = CLAUDE_MODELS[0];
          } else {
            this.plugin.settings.model = OPENAI_MODELS[0];
          }

          await this.plugin.saveSettings();
          this.display(); // UI 새로고침
        })
      );

    // API Key 입력
    new Setting(containerEl)
      .setName('API Key')
      .setDesc(`${this.plugin.settings.aiProvider === 'claude' ? 'Anthropic' : 'OpenAI'} API 키를 입력하세요`)
      .addText(text => text
        .setPlaceholder('sk-...')
        .setValue(this.plugin.settings.apiKey)
        .onChange(async (value) => {
          this.plugin.settings.apiKey = value.trim();
          await this.plugin.saveSettings();
        })
      );

    // API Key 도움말 링크
    const apiKeyHelp = containerEl.createDiv({ cls: 'setting-item-description' });
    if (this.plugin.settings.aiProvider === 'claude') {
      apiKeyHelp.innerHTML = '💡 API 키는 <a href="https://console.anthropic.com/settings/keys" target="_blank">Anthropic Console</a>에서 발급받을 수 있습니다.';
    } else {
      apiKeyHelp.innerHTML = '💡 API 키는 <a href="https://platform.openai.com/api-keys" target="_blank">OpenAI Platform</a>에서 발급받을 수 있습니다.';
    }

    // Model 선택
    const modelOptions = this.plugin.settings.aiProvider === 'claude'
      ? CLAUDE_MODELS
      : OPENAI_MODELS;

    new Setting(containerEl)
      .setName('Model')
      .setDesc('사용할 AI 모델을 선택하세요')
      .addDropdown(dropdown => {
        modelOptions.forEach(model => {
          dropdown.addOption(model, model);
        });

        dropdown
          .setValue(this.plugin.settings.model)
          .onChange(async (value) => {
            this.plugin.settings.model = value;
            await this.plugin.saveSettings();
          });
      });

    // Model 설명
    const modelDesc = containerEl.createDiv({ cls: 'setting-item-description' });
    if (this.plugin.settings.aiProvider === 'claude') {
      modelDesc.textContent = '💡 Sonnet: 균형잡힌 성능, Haiku: 빠른 속도, Opus: 최고 품질';
    } else {
      modelDesc.textContent = '💡 GPT-4: 최고 품질, GPT-3.5: 빠른 속도와 저렴한 비용';
    }

    // Summary Length 선택
    new Setting(containerEl)
      .setName('Summary Length')
      .setDesc('요약의 길이를 선택하세요')
      .addDropdown(dropdown => dropdown
        .addOption('short', 'Short (간단한 요약)')
        .addOption('standard', 'Standard (표준 요약)')
        .addOption('detailed', 'Detailed (상세한 요약)')
        .setValue(this.plugin.settings.summaryLength)
        .onChange(async (value) => {
          this.plugin.settings.summaryLength = value as SummaryLength;
          await this.plugin.saveSettings();
        })
      );

    // 구분선
    containerEl.createEl('hr');

    // 고급 설정 헤더
    containerEl.createEl('h3', { text: 'Advanced Settings' });

    // 프롬프트 템플릿 (향후 확장용)
    new Setting(containerEl)
      .setName('Custom Prompt Template')
      .setDesc('요약 생성에 사용할 커스텀 프롬프트를 입력하세요 (선택사항)')
      .addTextArea(text => text
        .setPlaceholder('예: "다음 내용을 핵심만 간단히 요약해주세요..."')
        .setValue('')
        .onChange(async (value) => {
          // TODO: 향후 커스텀 프롬프트 기능 구현 시 사용
        })
      )
      .setDisabled(true); // 현재는 비활성화

    // API Timeout 설정
    containerEl.createEl('div', {
      cls: 'setting-item-description',
      text: '⚠️ API Timeout 및 기타 고급 설정은 향후 업데이트에서 지원될 예정입니다.'
    });

    // 구분선
    containerEl.createEl('hr');

    // 정보 섹션
    containerEl.createEl('h3', { text: 'About' });

    const aboutText = containerEl.createDiv({ cls: 'setting-item-description' });
    aboutText.innerHTML = `
      <p><strong>AI Summary Plugin v0.1.0</strong></p>
      <p>Obsidian 노트를 AI를 사용하여 자동으로 요약합니다.</p>
      <p>사용 방법: Ctrl/Cmd+P → "Summarize current note"</p>
      <p>또는 좌측 리본의 ✨ 아이콘을 클릭하세요.</p>
    `;

    // Privacy Notice
    const privacyNotice = containerEl.createDiv({ cls: 'setting-item-description' });
    privacyNotice.innerHTML = `
      <p style="margin-top: 1em; padding: 0.5em; background-color: var(--background-secondary); border-radius: 4px;">
        🔒 <strong>개인정보 보호:</strong> 귀하의 노트 내용은 선택한 AI 서비스(${this.plugin.settings.aiProvider === 'claude' ? 'Anthropic' : 'OpenAI'})로 전송됩니다.
        API 키는 로컬에만 저장되며, 민감한 정보가 포함된 노트는 요약하지 않는 것을 권장합니다.
      </p>
    `;
  }
}
