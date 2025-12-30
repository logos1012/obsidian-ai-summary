# Changelog

All notable changes to the AI Summary plugin will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [0.1.1] - 2025-12-30

### Fixed
- ✨ Add horizontal separator (`---`) between summary and main content for better visual separation
- 📝 Update author information in manifest.json (logos1012)

### Improved
- 📖 Better readability with clear content separation

## [0.1.0] - 2025-12-30

### Added
- ✨ Initial release of AI Summary plugin
- 🤖 Claude API integration for AI-powered note summarization
- 📝 Automatic summary insertion at the top of notes with `## Summary` heading
- 🕐 Version management with timestamp tracking for summary history
- 🎨 Ribbon icon and command palette integration
- ⚙️ Settings tab for API configuration
  - AI Provider selection (Claude/OpenAI)
  - API Key input
  - Model selection (dynamically changes based on provider)
  - Summary length selection (Short/Standard/Detailed)
- 📋 Support for frontmatter detection and exclusion
- 🌐 Bilingual prompt engineering (Korean/English auto-detection)
- ⚡ Error handling with retry logic and timeout (30 seconds)
- 🔒 Privacy-focused design (user provides their own API key)

### Features
- **Smart Content Extraction**: Automatically excludes YAML frontmatter from summaries
- **Validation**:
  - Empty note detection
  - Minimum length check (50 characters)
  - Maximum length check (100,000 characters)
- **Version History**: Previous summaries are preserved in collapsible sections
- **Provider Support**: Claude 4.x models (Sonnet 4.5, Haiku 4.5, Opus 4.5)
- **Multi-language**: Automatic language detection for Korean and English notes

### Technical Details
- Built with TypeScript
- Uses esbuild for bundling
- Obsidian API v1.4.0+
- Bundle size: ~15KB

### Documentation
- Comprehensive README with usage instructions
- Implementation roadmap
- Project specification
- Quick start guide
- MIT License

## [Unreleased]

### Planned for v0.2.0
- OpenAI API support
- Privacy modal on first run
- Batch summarization for folders
- Custom prompt templates
- Local LLM support (Ollama)
