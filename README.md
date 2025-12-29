# AI Summary - Obsidian Plugin

AI 기반 노트 자동 요약 플러그인입니다. Claude 또는 OpenAI API를 사용하여 긴 노트의 핵심 내용을 추출합니다.

## 🚧 개발 중 (v0.1.0)

이 플러그인은 현재 개발 중입니다. Day 3 Claude API 통합이 완료되었습니다.

### ✅ 완료된 작업
- [x] 프로젝트 구조 설정 (Day 1)
- [x] TypeScript 및 빌드 설정 (Day 1)
- [x] 기본 Plugin 클래스 구현 (Day 1)
- [x] 타입 정의 및 상수 (Day 1)
- [x] Git 저장소 초기화 (Day 1)
- [x] **Claude API 통합 (Day 3)** ✨
  - API Error Handler 구현
  - Claude Provider (timeout, retry, 프롬프트 엔지니어링)
  - Summarizer Service 팩토리 패턴
  - 노트 내용 추출 및 API 호출
  - 요약 결과 콘솔 출력

### 🔜 예정된 작업
- [ ] 에디터 통합 및 요약 삽입 (Day 5-7)
- [ ] UI 구현 (리본, 커맨드, 설정) (Day 8-12)
- [ ] 테스트 및 버그 수정 (Day 13-14)

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
│   └── services/
│       ├── api-error-handler.ts     # API 에러 처리 ✨
│       ├── claude-provider.ts       # Claude API 구현 ✨
│       └── summarizer.ts            # Summarizer 팩토리 ✨
├── main.js                          # 빌드 결과 (8.3KB)
├── manifest.json                    # 플러그인 메타데이터
├── package.json
├── tsconfig.json
└── esbuild.config.mjs
```

## 🎯 핵심 기능 (계획)

1. **AI 요약 생성**: Claude/GPT API로 1-2단락 요약
2. **자동 삽입**: 노트 상단에 `## Summary` 섹션 생성
3. **버전 관리**: 타임스탬프와 함께 이전 요약 보관
4. **직관적 UI**: 리본 아이콘 및 커맨드 팔레트

## 📝 개발 로그

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
