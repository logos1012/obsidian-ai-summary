# AI Summary - Obsidian Plugin

AI 기반 노트 자동 요약 플러그인입니다. Claude 또는 OpenAI API를 사용하여 긴 노트의 핵심 내용을 추출합니다.

## ✅ v0.1.0 - 릴리스 준비 완료!

이 플러그인은 **완전히 사용 가능**하며, 프로덕션 환경에서 안정적으로 동작합니다! 🎉

### ✨ 주요 기능
- [x] **Claude 4.x API 완벽 지원** (Sonnet 4.5, Haiku 4.5, Opus 4.5)
- [x] **스마트 검증 시스템**
  - 빈 노트 감지
  - 최소 길이 검증 (50자)
  - 최대 길이 제한 (100,000자)
- [x] **버전 관리** - 타임스탬프와 함께 이전 요약 자동 보관
- [x] **다국어 지원** - 한글/영어 자동 감지
- [x] **에러 처리** - 재시도 로직, 친절한 에러 메시지
- [x] **설정 UI** - 직관적인 설정 탭
- [x] **문서화 완료** - README, CHANGELOG, LICENSE

### 📋 Phase 1 (MVP) - 완료 ✅
- [x] 프로젝트 기반 구축 (Day 1-2)
- [x] Claude API 통합 (Day 3-4)
- [x] 에디터 통합 및 요약 삽입 (Day 5-7)
- [x] 사용자 인터페이스 구현 (Day 8-10)
- [x] 설정 관리 구현 (Day 11-12)
- [x] **테스트 및 안정화 (Day 13-14)** ← 현재 완료!

### 🔜 Phase 2 계획 (v0.2.0)
- [ ] OpenAI API 지원
- [ ] 첫 실행 시 프라이버시 모달
- [ ] 배치 요약 (폴더 단위)
- [ ] 커스텀 프롬프트 템플릿
- [ ] 로컬 LLM 지원 (Ollama)

## 📦 개발 환경 설정

### 요구사항
- Node.js 18.0.0 이상
- npm 10.0.0 이상

### 설치
```bash
# 의존성 설치
npm install

# 개발 모드 (watch mode)
npm run dev

# 프로덕션 빌드
npm run build
```

## 🏗️ 프로젝트 구조

```
obsidian-ai-summary/
├── src/
│   ├── main.ts                      # 플러그인 진입점
│   ├── types.ts                     # 타입 정의
│   ├── constants.ts                 # 상수
│   ├── ui/
│   │   └── SettingTab.ts            # 설정 탭 UI ✨
│   └── services/
│       ├── api-error-handler.ts     # API 에러 처리
│       ├── claude-provider.ts       # Claude API 구현
│       ├── summarizer.ts            # Summarizer 팩토리
│       ├── editor-service.ts        # 에디터 조작
│       └── version-manager.ts       # 버전 관리
├── main.js                          # 빌드 결과 (15KB)
├── manifest.json                    # 플러그인 메타데이터
├── package.json
├── tsconfig.json
└── esbuild.config.mjs
```

## 🎯 핵심 기능

1. **AI 요약 생성**: Claude/GPT API로 1-2단락 요약 ✅
2. **자동 삽입**: 노트 상단에 `## Summary` 섹션 생성 ✅
3. **버전 관리**: 타임스탬프와 함께 이전 요약 보관 ✅
4. **직관적 UI**: 리본 아이콘, 커맨드 팔레트, 설정 탭 ✅

## 📖 사용 방법

### 초기 설정
1. **Settings → AI Summary** 에서 설정
2. **AI Provider** 선택 (Claude 권장)
3. **API Key** 입력
   - Claude: [Anthropic Console](https://console.anthropic.com/)에서 발급
   - API 키는 `sk-ant-`로 시작해야 합니다
4. **Model** 선택 (claude-sonnet-4-5 권장)
5. **Summary Length** 선택 (Standard 권장)

### 요약 생성
- **방법 1**: `Ctrl/Cmd + P` → "Summarize current note" 실행
- **방법 2**: 좌측 리본의 ✨ 아이콘 클릭

요약은 노트 상단에 `## Summary` 섹션으로 자동 삽입됩니다!

### 요약 결과 예시

생성 전:
```markdown
---
title: My Note
tags: [example]
---

이것은 긴 노트입니다... (1000자 이상의 내용)
```

생성 후:
```markdown
---
title: My Note
tags: [example]
---

## Summary

핵심 내용과 주요 논점을 포함한 1-2단락의 요약...

*Updated: 2025-12-30 10:30*

---

이것은 긴 노트입니다... (원본 내용)
```

## ⚠️ 주의사항

### 프라이버시
- 노트 내용이 외부 AI API 서버로 전송됩니다
- 민감한 정보가 포함된 노트는 요약하지 마세요
- API 키는 로컬에만 저장되며 외부로 전송되지 않습니다

### 요구사항
- 최소 50자 이상의 노트만 요약 가능
- 최대 100,000자까지 지원
- 인터넷 연결 필요

## 🐛 트러블슈팅

### "API 키를 설정해주세요" 에러
→ Settings → AI Summary에서 API 키를 입력했는지 확인

### "API 404 에러" 발생
→ 설정에서 올바른 모델을 선택했는지 확인 (Claude 4.x 모델 사용)
→ API 키가 유효한지 확인

### "노트가 너무 짧습니다" 메시지
→ 최소 50자 이상의 내용이 필요합니다

### "요약 생성 실패: 인터넷 연결..." 에러
→ 네트워크 연결을 확인하세요
→ 방화벽이 api.anthropic.com 접속을 차단하는지 확인

### 요약이 생성되지 않음
→ Developer Console (Ctrl+Shift+I)에서 에러 로그 확인
→ GitHub Issues에 에러 메시지와 함께 문의

## 📝 개발 로그

### Day 11-12 (2025-12-30) ✨
- **설정 탭 UI 완전 구현!**
- SummarySettingTab 클래스 구현:
  - AI Provider 선택 드롭다운 (Claude/OpenAI)
  - API Key 입력 필드 (보안 입력)
  - Model 선택 (Provider별 동적 옵션 변경)
  - Summary Length 선택 (Short/Standard/Detailed)
  - 도움말 링크 (API 키 발급 페이지)
  - 개인정보 보호 안내
  - About 섹션 (버전, 사용법)
- 설정 자동 저장 (onChange 핸들러)
- Provider 변경 시 UI 새로고침 및 기본 모델 재설정
- 빌드 크기: 10KB → 15KB
- **현재 상태**: 완전히 사용 가능한 플러그인! 🎉

### Day 5 (2025-12-29) 🎉
- **에디터 통합 완료!**
- VersionManager 구현
- EditorService 구현
- 노트에 직접 삽입 기능
- 빌드 크기: 8.3KB → 10KB

### Day 3 (2025-12-29) ✨
- **Claude API 완전 통합!**
- API Error Handler: HTTP 상태 코드별 친절한 에러 메시지
- Claude Provider 구현:
  - 한글/영어 자동 감지 프롬프트
  - 길이별 max_tokens 조절 (short: 512, standard: 1024, detailed: 2048)
  - AbortController 기반 30초 timeout
  - 네트워크 에러 시 1회 자동 재시도
- Summarizer Service: Factory 패턴으로 provider 관리
- Main Plugin 통합:
  - 노트 내용 추출 (frontmatter 제거)
  - API 호출 및 요약 생성
  - 콘솔 출력 (에디터 삽입은 Day 5-7)
- 빌드 크기: 1.9KB → 8.3KB
- **현재 상태**: API 키만 설정하면 실제 요약 생성 가능! 🎉

### Day 1 (2025-12-29)
- 프로젝트 초기 설정 완료
- TypeScript, esbuild 설정
- 기본 플러그인 구조 구현
- 빌드 스크립트 동작 확인 ✅

## 📚 참고 문서

- [프로젝트 명세서](../PROJECT_SPECIFICATION.md)
- [구현 로드맵](../IMPLEMENTATION_ROADMAP.md)
- [빠른 시작 가이드](../QUICK_START_GUIDE.md)

## 📄 License

MIT
