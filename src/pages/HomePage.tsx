interface HomePageProps {
  onStartSentence: () => void;
  onStartVocab: () => void;
}

const features = [
  {
    title: "하루 5문장 · 12단어",
    desc: "문장과 단어를 나눠 부담 없이 매일 학습",
  },
  {
    title: "망각곡선 복습",
    desc: "잊을 때쯤 다시 나오는 SM-2 간격 반복",
  },
  {
    title: "요미가나",
    desc: "한자 위 히라가나로 읽기 확인",
  },
  {
    title: "브라우저 저장",
    desc: "학습 기록은 이 기기에 자동 저장",
  },
];

export function HomePage({ onStartSentence, onStartVocab }: HomePageProps) {
  return (
    <div className="min-h-screen bg-gradient-to-b from-indigo-50 via-white to-emerald-50 dark:from-slate-950 dark:via-slate-900 dark:to-slate-950">
      <main className="mx-auto max-w-3xl px-4 py-10 pt-14">
        <header className="text-center">
          <p className="text-sm font-medium text-indigo-600 dark:text-indigo-400">무료 · 설치 불필요</p>
          <h1 className="mt-2 font-kr text-4xl font-bold tracking-tight text-slate-900 dark:text-slate-100">
            일본어 학습
          </h1>
          <p className="mx-auto mt-3 max-w-lg text-base leading-relaxed text-slate-600 dark:text-slate-400">
            N4·N3 필수 단어와 문장으로 매일 조금씩 — 단어는 암기, 문장은 구조 연습.
          </p>
        </header>

        <section className="mt-10 grid gap-4 sm:grid-cols-2">
          <article className="flex flex-col rounded-2xl border border-indigo-200 bg-white p-5 shadow-sm dark:border-indigo-800 dark:bg-slate-800">
            <h2 className="font-kr text-xl font-bold text-slate-900 dark:text-slate-100">문장 만들기</h2>
            <p className="mt-2 flex-1 text-sm leading-relaxed text-slate-600 dark:text-slate-400">
              흩어진 단어만 배치해 N3–N4 문장을 완성합니다. 마침표는 자동, 하루 5문장.
            </p>
            <button
              type="button"
              onClick={onStartSentence}
              className="mt-5 rounded-xl bg-indigo-600 px-5 py-3 text-sm font-semibold text-white shadow-lg shadow-indigo-200 transition hover:bg-indigo-700 dark:shadow-none"
            >
              문장 만들기 시작
            </button>
          </article>

          <article className="flex flex-col rounded-2xl border border-emerald-200 bg-white p-5 shadow-sm dark:border-emerald-800 dark:bg-slate-800">
            <h2 className="font-kr text-xl font-bold text-slate-900 dark:text-slate-100">단어 외우기</h2>
            <p className="mt-2 flex-1 text-sm leading-relaxed text-slate-600 dark:text-slate-400">
              N4·N3 필수 단어, 하루 12개(신규 5+복습). 일→한 · 한→일, SM-2 망각곡선.
            </p>
            <button
              type="button"
              onClick={onStartVocab}
              className="mt-5 rounded-xl bg-emerald-600 px-5 py-3 text-sm font-semibold text-white shadow-lg shadow-emerald-200 transition hover:bg-emerald-700 dark:shadow-none"
            >
              단어 외우기 시작
            </button>
          </article>
        </section>

        <section className="mt-10 grid gap-4 sm:grid-cols-2">
          {features.map((feature) => (
            <article
              key={feature.title}
              className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm dark:border-slate-700 dark:bg-slate-800"
            >
              <h2 className="font-kr text-lg font-bold text-slate-900 dark:text-slate-100">{feature.title}</h2>
              <p className="mt-1.5 text-sm leading-relaxed text-slate-600 dark:text-slate-400">{feature.desc}</p>
            </article>
          ))}
        </section>

        <section className="mt-10 rounded-2xl border border-violet-200 bg-violet-50 p-6 text-center dark:border-violet-800 dark:bg-violet-950">
          <p className="font-jp text-2xl font-medium text-violet-900 dark:text-violet-200">日本語を毎日少しずつ</p>
          <p className="mt-2 text-sm text-violet-800 dark:text-violet-300">
            브라우저에서 바로 사용 · 학습 기록은 이 기기에 저장됩니다
          </p>
        </section>

        <footer className="mt-10 text-center text-xs text-slate-400">
          N4·N3 필수 단어 · 문장 학습
        </footer>
      </main>
    </div>
  );
}
