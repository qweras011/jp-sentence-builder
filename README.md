# 日本語 문장 만들기

N3–N4 일본어 문장 만들기 · 단어 외우기 · 망각곡선 복습 (무료)

## 로컬 실행

```powershell
cd C:\Users\USER\Projects\jp-sentence-builder
npm.cmd install
npm.cmd run dev
```

`start-dev.bat` 더블클릭도 가능

## Vercel로 홈페이지 배포

## GitHub에 올리기

### 방법 A: 배치 파일 (권장)

`github-setup.bat` 더블클릭

- git 초기화 → 커밋 → GitHub 저장소 생성 → push까지 자동
- [GitHub CLI](https://cli.github.com) (`gh`)가 설치·로그인되어 있어야 합니다
- 처음이면 터미널에서 `gh auth login` 실행

### 방법 B: 수동

```powershell
cd C:\Users\USER\Projects\jp-sentence-builder
git init
git add .
git commit -m "Add Japanese sentence learning web app with homepage and SRS"
```

GitHub에서 새 저장소 생성 (README 추가하지 않기) 후:

```powershell
git remote add origin https://github.com/사용자명/jp-sentence-builder.git
git branch -M main
git push -u origin main
```

### GitHub CLI로 한 번에

```powershell
gh auth login
gh repo create jp-sentence-builder --public --source=. --remote=origin --push
```

### 2. Vercel 배포

1. [vercel.com](https://vercel.com) 로그인
2. **Add New Project** → GitHub 저장소 선택
3. Framework: **Vite** (자동 감지)
4. Build: `npm run build` · Output: `dist`
5. **Deploy**

배포 후 `https://프로젝트명.vercel.app` 주소가 홈페이지 URL이 됩니다.

## 구조

```
src/
├── pages/
│   ├── HomePage.tsx    # 랜딩 홈
│   └── GamePage.tsx    # 학습 화면
├── components/         # UI 컴포넌트
├── hooks/              # 게임 로직
├── data/data.json      # 50문장
└── utils/              # SRS, 망각곡선, 조사 체크
```

## 기능

- **홈페이지**: 소개 + 학습 시작
- **하루 5문장** + SM-2 망각곡선
- **요미가나** + **조사/단어** 뜻 확인
- 학습 기록: 브라우저 localStorage
