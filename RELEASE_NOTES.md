# AI Summary v0.1.0 - Initial Release 🎉

We're excited to announce the first stable release of AI Summary, an Obsidian plugin that leverages Claude AI to automatically summarize your notes!

## ✨ Key Features

### 🤖 AI-Powered Summarization
- **Claude 4.x Support**: Full integration with the latest Claude models (Sonnet 4.5, Haiku 4.5, Opus 4.5)
- **Smart Prompts**: Bilingual prompt engineering with automatic language detection (Korean/English)
- **Flexible Length**: Choose between Short (3-5 sentences), Standard (1-2 paragraphs), or Detailed (2-3 paragraphs)

### 📝 Intelligent Content Handling
- **Frontmatter Detection**: Automatically excludes YAML frontmatter from summaries
- **Input Validation**:
  - Empty note detection
  - Minimum length requirement (50 characters)
  - Maximum length limit (100,000 characters)
- **Version Management**: Previous summaries are preserved with timestamps in collapsible sections

### 🎨 User-Friendly Interface
- **Ribbon Icon**: Quick access with a sparkles (✨) icon in the left sidebar
- **Command Palette**: Execute via `Ctrl/Cmd + P` → "Summarize current note"
- **Settings Tab**: Intuitive configuration interface
  - AI Provider selection
  - API Key management
  - Model selection (dynamically updates based on provider)
  - Summary length preferences

### 🔒 Privacy & Security
- **Local API Keys**: Your API key is stored locally and never transmitted except to the chosen AI provider
- **User Control**: You provide your own API key and maintain full control
- **Transparent Processing**: Clear notifications about what's happening during summarization

## 📦 Installation

### Manual Installation
1. Download `main.js` and `manifest.json` from this release
2. Create a folder: `{YourVault}/.obsidian/plugins/ai-summary/`
3. Copy the downloaded files into this folder
4. Restart Obsidian
5. Enable the plugin in Settings → Community plugins

## 🚀 Quick Start

1. **Get an API Key**
   - Claude: Visit [Anthropic Console](https://console.anthropic.com/)
   - Sign up and generate an API key (starts with `sk-ant-`)

2. **Configure the Plugin**
   - Go to Settings → AI Summary
   - Select "Claude" as AI Provider
   - Paste your API key
   - Choose your preferred model (claude-sonnet-4-5 recommended)
   - Select summary length (Standard recommended)

3. **Summarize Your First Note**
   - Open any markdown note with at least 50 characters
   - Click the ✨ icon in the left ribbon, or
   - Press `Ctrl/Cmd + P` and type "Summarize"
   - Wait for the AI to generate your summary
   - The summary appears at the top of your note under `## Summary`

## 📊 Technical Details

- **Built with**: TypeScript, esbuild
- **Bundle Size**: ~15KB (optimized)
- **Obsidian API**: v1.4.0+
- **Supported Platforms**: Desktop (Windows, macOS, Linux)

## 🐛 Known Limitations

- OpenAI support is planned for v0.2.0 but not yet implemented
- No batch summarization (coming in future releases)
- No custom prompt templates (planned for Phase 3)
- Requires internet connection

## 📚 Documentation

- [README](https://github.com/YOUR_USERNAME/obsidian-ai-summary/blob/main/README.md) - Comprehensive usage guide
- [CHANGELOG](https://github.com/YOUR_USERNAME/obsidian-ai-summary/blob/main/CHANGELOG.md) - Version history
- [Troubleshooting](https://github.com/YOUR_USERNAME/obsidian-ai-summary/blob/main/README.md#-troubleshooting) - Common issues and solutions

## 🙏 Acknowledgments

This plugin was developed following Obsidian's best practices and built with the help of Claude AI. Special thanks to the Obsidian community for inspiration and support.

## 📄 License

MIT License - See [LICENSE](https://github.com/YOUR_USERNAME/obsidian-ai-summary/blob/main/LICENSE) file for details

## 🔮 What's Next?

Check out our [roadmap](https://github.com/YOUR_USERNAME/obsidian-ai-summary/blob/main/IMPLEMENTATION_ROADMAP.md) for planned features:
- v0.2.0: OpenAI support, privacy modal, batch summarization
- v1.0.0+: Local LLM support (Ollama), custom templates, i18n

---

**Enjoy AI-powered note summarization! If you encounter any issues, please [open an issue](https://github.com/YOUR_USERNAME/obsidian-ai-summary/issues).**

🤖 *This release was prepared with assistance from Claude Code*
