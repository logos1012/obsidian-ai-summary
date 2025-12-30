# Obsidian 커뮤니티 플러그인 등록 가이드

## 📋 사전 요구사항 체크리스트

### 필수 요구사항 ✅
- [x] GitHub 공개 저장소
- [x] v0.1.0 릴리스 생성
- [x] main.js 파일 (17KB)
- [x] manifest.json 파일
- [x] styles.css 파일 (선택사항)
- [x] README.md (사용법 설명)
- [x] LICENSE 파일 (MIT)

### 품질 요구사항 ✅
- [x] 빌드 에러 없음
- [x] 기본 기능 테스트 완료
- [x] 문서화 완료
- [x] 명확한 설명 (manifest.json description)

---

## 🚀 등록 절차

### 1단계: 저장소 준비 완료 확인

현재 상태:
```
Repository: https://github.com/logos1012/obsidian-ai-summary
Latest Release: v0.1.0
Status: ✅ 준비 완료
```

### 2단계: obsidian-releases 저장소 포크

1. https://github.com/obsidianmd/obsidian-releases 방문
2. 우측 상단 **Fork** 버튼 클릭
3. 본인 계정으로 포크

### 3단계: community-plugins.json 수정

포크한 저장소에서 `community-plugins.json` 파일을 편집:

```json
{
  "id": "ai-summary",
  "name": "AI Summary",
  "author": "logos1012",
  "description": "AI 기반 노트 자동 요약 플러그인. Claude 또는 OpenAI API를 사용하여 긴 노트의 핵심 내용을 추출합니다.",
  "repo": "logos1012/obsidian-ai-summary"
}
```

**추가 위치**: 알파벳 순서로 정렬된 목록에 추가

### 4단계: Pull Request 생성

**PR 제목 형식**:
```
Add plugin: AI Summary
```

**PR 설명 템플릿**:
```markdown
## Plugin Information

- **Plugin Name**: AI Summary
- **Author**: logos1012
- **Repository**: https://github.com/logos1012/obsidian-ai-summary
- **Latest Version**: v0.1.0
- **Description**: AI-powered note summarization plugin using Claude API

## Checklist

- [x] Plugin has been tested and works as expected
- [x] README includes installation and usage instructions
- [x] Plugin follows Obsidian's community guidelines
- [x] No security vulnerabilities or malicious code
- [x] Proper error handling implemented
- [x] API keys are stored securely (user-provided)
- [x] Privacy notice included in documentation

## Additional Notes

This plugin helps users summarize long notes using AI (Claude 4.x or OpenAI).
It features:
- Automatic summary insertion at the top of notes
- Version management with timestamp tracking
- Bilingual support (Korean/English)
- Input validation and error handling
- User-controlled API keys (privacy-focused)

The plugin has been thoroughly tested and is production-ready.
```

### 5단계: 리뷰 대기

- Obsidian 팀이 PR을 리뷰합니다
- 보통 1-2주 소요
- 필요시 수정 요청이 올 수 있습니다

### 6단계: 승인 및 병합

- PR이 승인되면 커뮤니티 플러그인 목록에 추가됩니다
- 사용자들이 Obsidian 내에서 직접 설치 가능해집니다!

---

## 📝 자동화 스크립트 (선택사항)

GitHub CLI를 사용한 자동 포크 및 PR 생성:

```bash
# 1. obsidian-releases 포크
gh repo fork obsidianmd/obsidian-releases --clone

# 2. 브랜치 생성
cd obsidian-releases
git checkout -b add-ai-summary

# 3. community-plugins.json 수정 (수동)
# vim community-plugins.json

# 4. 커밋 및 푸시
git add community-plugins.json
git commit -m "Add plugin: AI Summary"
git push origin add-ai-summary

# 5. PR 생성
gh pr create --title "Add plugin: AI Summary" \
  --body "$(cat ../ai-summary-pr-description.md)" \
  --base main \
  --head logos1012:add-ai-summary \
  --repo obsidianmd/obsidian-releases
```

---

## ⚠️ 주의사항

### 승인 기준
- 플러그인이 실제로 작동해야 함
- 보안 위험이 없어야 함
- 사용자 데이터를 안전하게 처리해야 함
- 문서가 명확해야 함

### 거부될 수 있는 사유
- 플러그인이 작동하지 않음
- 보안 취약점 발견
- 문서 부족
- 중복 기능 (이미 유사한 플러그인 존재)
- Obsidian 가이드라인 위반

### 우리 플러그인의 강점
- ✅ 명확한 용도 (AI 요약)
- ✅ 완전한 문서화
- ✅ 보안 고려 (사용자 제공 API 키)
- ✅ 에러 처리 완벽
- ✅ 프라이버시 중심 설계

---

## 📊 예상 타임라인

| 단계 | 예상 시간 |
|------|----------|
| 포크 및 PR 생성 | 10분 |
| 초기 리뷰 | 1-3일 |
| 피드백 반영 | 1-2일 |
| 최종 승인 | 1-2주 |
| **총 예상 기간** | **2-3주** |

---

## 🎯 완료 후

등록이 완료되면:
1. Obsidian Settings → Community plugins → Browse
2. "AI Summary" 검색
3. Install 버튼 클릭
4. 사용자들이 쉽게 설치 가능! 🎉

---

## 📞 도움이 필요한 경우

- **Obsidian Discord**: https://discord.gg/obsidianmd
- **Forum**: https://forum.obsidian.md/
- **GitHub Issues**: https://github.com/obsidianmd/obsidian-releases/issues

---

**작성일**: 2025-12-30
**플러그인 버전**: v0.1.0
**상태**: 등록 준비 완료 ✅
