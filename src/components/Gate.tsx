import { useState, type FormEvent } from 'react'
import { ArrowRightIcon } from './icons'
import { ThemeToggle } from './Topbar'

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
    <div className="min-h-dvh relative flex items-center justify-center px-6">
      <div className="absolute top-5 right-5">
        <ThemeToggle compact />
      </div>

      <div className="w-full max-w-sm animate-fade-up">
        <div className="mb-8 text-center">
          <div
            className="inline-flex h-12 w-12 items-center justify-center rounded-2xl text-[15px] font-extrabold tracking-wider"
            style={{ background: 'var(--accent)', color: 'var(--on-accent)' }}
          >
            АГ
          </div>
          <div className="eyebrow mt-4">АГИП · Прототип</div>
          <h1 className="mt-2 text-[28px] leading-tight font-extrabold text-[var(--text)] tracking-[-0.02em]">
            Отчёты по&nbsp;мероприятиям
          </h1>
          <p className="mt-2 text-[13px] text-[var(--text-2)]">
            Доступ к демо-стенду по паролю
          </p>
        </div>

        <form
          onSubmit={submit}
          className="rounded-2xl bg-[var(--surface)] border border-[var(--border)] p-6"
          style={{ boxShadow: 'var(--gate-shadow)' }}
        >
          <label className="eyebrow block mb-2">Пароль доступа</label>
          <input
            type="password"
            autoFocus
            value={value}
            onChange={(e) => {
              setValue(e.target.value)
              setError(false)
            }}
            className="w-full rounded-xl border px-3.5 py-2.5 text-sm tracking-wider font-mono outline-none transition-all duration-300 bg-[var(--surface-2)] text-[var(--text)]"
            style={{
              borderColor: error ? '#D45C5E' : 'var(--border-hi)',
            }}
            placeholder="••••-••••-••••"
          />
          {error && (
            <p className="mt-2 text-[12px]" style={{ color: '#D45C5E' }}>
              Неверный пароль
            </p>
          )}
          <button
            type="submit"
            className="group mt-4 w-full inline-flex items-center justify-between rounded-full pl-5 pr-1.5 py-1.5 text-[13px] font-semibold transition-transform duration-300 ease-glide active:scale-[.985]"
            style={{ background: 'var(--primary)', color: 'var(--on-primary)' }}
          >
            Войти
            <span
              className="inline-flex h-9 w-9 items-center justify-center rounded-full transition-transform duration-500 ease-glide group-hover:translate-x-[2px] group-hover:-translate-y-[1px]"
              style={{ background: 'rgba(255,255,255,0.18)' }}
            >
              <ArrowRightIcon />
            </span>
          </button>
        </form>

        <p className="mt-6 text-center text-[11px] text-[var(--text-3)]">
          © ЛАЙМ · демо-прототип, данные тестовые
        </p>
      </div>
    </div>
  )
}
