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
    <div className="min-h-dvh flex items-center justify-center px-6 bg-[#f6f7fb]">
      <div className="w-full max-w-sm">
        <div className="mb-8 text-center">
          <div className="inline-flex items-center gap-2 text-xs font-semibold tracking-widest text-ink-500 uppercase">
            <span className="h-px w-6 bg-ink-300" />
            АГИП · Прототип
            <span className="h-px w-6 bg-ink-300" />
          </div>
          <h1 className="mt-3 font-display text-2xl font-semibold text-ink-900">
            Отчёты по мероприятиям
          </h1>
          <p className="mt-2 text-sm text-ink-500">
            Доступ к демо-стенду по паролю
          </p>
        </div>

        <form
          onSubmit={submit}
          className="rounded-2xl bg-white p-6 card-shadow border border-ink-100"
        >
          <label className="block text-xs font-medium text-ink-500 mb-2">
            Пароль доступа
          </label>
          <input
            type="password"
            autoFocus
            value={value}
            onChange={(e) => {
              setValue(e.target.value)
              setError(false)
            }}
            className={`w-full rounded-lg border px-3 py-2.5 text-sm outline-none transition focus:border-accent focus:ring-2 focus:ring-accent/15 ${
              error ? 'border-red-400 ring-2 ring-red-100' : 'border-ink-300'
            }`}
            placeholder="••••-••••-••••"
          />
          {error && (
            <p className="mt-2 text-xs text-red-500">Неверный пароль</p>
          )}
          <button
            type="submit"
            className="mt-4 w-full rounded-lg bg-ink-900 py-2.5 text-sm font-medium text-white transition hover:bg-ink-700"
          >
            Войти
          </button>
        </form>

        <p className="mt-6 text-center text-xs text-ink-500">
          © ЛАЙМ · демо-прототип, данные тестовые
        </p>
      </div>
    </div>
  )
}
