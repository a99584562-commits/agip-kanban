import { useState, type FormEvent } from 'react'

const PASSWORD = 'qzvz-u7ip-qema'
const STORAGE_KEY = 'agip-kanban-auth'

export function isAuthed(): boolean {
  try {
    return localStorage.getItem(STORAGE_KEY) === '1'
  } catch {
    return false
  }
}

export function Gate({ onPass }: { onPass: () => void }) {
  const [value, setValue] = useState('')
  const [error, setError] = useState(false)

  function submit(e: FormEvent) {
    e.preventDefault()
    if (value.trim() === PASSWORD) {
      try {
        localStorage.setItem(STORAGE_KEY, '1')
      } catch {}
      onPass()
    } else {
      setError(true)
    }
  }

  return (
    <div className="min-h-dvh flex items-center justify-center px-6">
      <div className="w-full max-w-sm animate-fade-up">
        <div className="mb-8 text-center">
          <div className="inline-flex items-center gap-3">
            <span className="h-px w-8 bg-ink-300" />
            <span className="eyebrow text-ink-500">АГИП · Прототип</span>
            <span className="h-px w-8 bg-ink-300" />
          </div>
          <h1 className="mt-4 font-display text-[28px] leading-tight font-bold text-ink-900 tracking-[-0.02em]">
            Отчёты по&nbsp;мероприятиям
          </h1>
          <p className="mt-2 text-[13px] text-ink-500">
            Доступ к демо-стенду по паролю
          </p>
        </div>

        <form
          onSubmit={submit}
          className="rounded-3xl bg-white/40 p-[5px] ring-1 ring-ink-200/80 shadow-glow"
        >
          <div className="rounded-[20px] bg-white p-6">
            <label className="eyebrow text-ink-500 block mb-2">Пароль доступа</label>
            <input
              type="password"
              autoFocus
              value={value}
              onChange={(e) => {
                setValue(e.target.value)
                setError(false)
              }}
              className={`w-full rounded-xl border px-3.5 py-2.5 text-sm tracking-wider font-mono outline-none transition-all duration-300 ${
                error
                  ? 'border-rose-400 ring-2 ring-rose-100'
                  : 'border-ink-200 focus:border-ink-900 focus:ring-2 focus:ring-ink-900/10'
              }`}
              placeholder="••••-••••-••••"
            />
            {error && (
              <p className="mt-2 text-[12px] text-rose-500">Неверный пароль</p>
            )}
            <button
              type="submit"
              className="group mt-4 w-full inline-flex items-center justify-between rounded-full bg-ink-900 pl-5 pr-1.5 py-1.5 text-[13px] font-semibold text-white transition-transform duration-300 ease-glide active:scale-[.985] hover:shadow-lift"
            >
              Войти
              <span className="inline-flex h-9 w-9 items-center justify-center rounded-full bg-white/10 transition-transform duration-500 ease-glide group-hover:translate-x-[2px] group-hover:-translate-y-[1px]">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M5 12h14M13 5l7 7-7 7"/></svg>
              </span>
            </button>
          </div>
        </form>

        <p className="mt-6 text-center text-[11px] text-ink-400">
          © ЛАЙМ · демо-прототип, данные тестовые
        </p>
      </div>
    </div>
  )
}
