interface HomePageProps {
  onStart: () => void;
}

const features = [
  {
    title: "하루 5문장",
    desc: "부담 없이 매일 조금씩, N4–N5 수준 문장 학습",
  },
  {
    title: "망각곡선 복습",
    desc: "잊을 때쯤 다시 나오는 SM-2 간격 반복",
  },
  {
    title: "요미가나",
    desc: "정답 후 한자 위 히라가나로 읽기 확인",
  },
  {
    title: "조사·단어 체크",
    desc: "문장만이 아니라 뜻과 조사 용법까지 솔직히 평가",
  },
];

export function HomePage({ onStart }: HomePageProps) {
  return (
    <div className="min-h-screen bg-gradient-to-b from-indigo-50 via-white to-violet-50">
      <main className="mx-auto max-w-3xl px-4 py-10">
        <header className="text-center">
          <p className="text-sm font-medium text-indigo-600">무료 · 설치 불필요</p>
          <h1 className="mt-2 font-kr text-4xl font-bold tracking-tight text-slate-900">
            일본어 문장 만들기
          </h1>
          <p className="mx-auto mt-3 max-w-lg text-base leading-relaxed text-slate-600">
            흩어진 단어를 배치해 문장을 완성하고, 요미가나와 조사까지 확인하며
            매일 조금씩 일본어 실력을 쌓아 보세요.
          </p>
          <button
            type="button"
            onClick={onStart}
            className="mt-8 rounded-xl bg-indigo-600 px-8 py-3.5 text-base font-semibold text-white shadow-lg shadow-indigo-200 transition hover:bg-indigo-700"
          >
            학습 시작하기
          </button>
        </header>

        <section className="mt-14 grid gap-4 sm:grid-cols-2">
          {features.map((feature) => (
            <article
              key={feature.title}
              className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm"
            >
              <h2 className="font-kr text-lg font-bold text-slate-900">{feature.title}</h2>
              <p className="mt-1.5 text-sm leading-relaxed text-slate-600">{feature.desc}</p>
            </article>
          ))}
        </section>

        <section className="mt-10 rounded-2xl border border-violet-200 bg-violet-50 p-6 text-center">
          <p className="font-jp text-2xl font-medium text-violet-900">日本語を毎日少しずつ</p>
          <p className="mt-2 text-sm text-violet-800">
            브라우저에서 바로 사용 · 학습 기록은 이 기기에 저장됩니다
          </p>
        </section>

        <footer className="mt-10 text-center text-xs text-slate-400">
          N4–N5 문장 재배열 학습 앱
        </footer>
      </main>
    </div>
  );
}
