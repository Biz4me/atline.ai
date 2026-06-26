'use client'

import { useState, useEffect, useRef } from 'react'
import { useRouter } from 'next/navigation'
import Image from 'next/image'
import { signIn } from 'next-auth/react'
import { Eye, EyeOff, Sparkles, ArrowRight, Loader2, Check, X, RefreshCw } from 'lucide-react'

type Mode = 'login' | 'register'
type UStatus = 'idle' | 'checking' | 'ok' | 'taken' | 'invalid'

const UNAME_FORMAT = /^[a-z0-9._]{3,20}$/

export default function AuthPage() {
  const router = useRouter()
  const [mode, setMode] = useState<Mode>('login')
  const [showPwd, setShowPwd] = useState(false)
  const [showConfirm, setShowConfirm] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const [firstName, setFirstName] = useState('')
  const [lastName, setLastName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [confirm, setConfirm] = useState('')
  const [username, setUsername] = useState('')
  const [uStatus, setUStatus] = useState<UStatus>('idle')
  const usernameTouched = useRef(false)

  const isLogin = mode === 'login'

  // Suggestion auto dès que prénom + nom sont saisis (si l'identifiant n'a pas été touché)
  useEffect(() => {
    if (isLogin || usernameTouched.current || !firstName.trim() || !lastName.trim()) return
    let cancelled = false
    fetch(`/api/auth/username?first=${encodeURIComponent(firstName)}&last=${encodeURIComponent(lastName)}`)
      .then((r) => r.json())
      .then((d) => {
        if (!cancelled && d.username && !usernameTouched.current) {
          setUsername(d.username)
          setUStatus('ok')
        }
      })
      .catch(() => {})
    return () => { cancelled = true }
  }, [firstName, lastName, isLogin])

  // Vérification de disponibilité (débouncée) quand l'identifiant change
  useEffect(() => {
    if (isLogin || !username) { setUStatus('idle'); return }
    if (!UNAME_FORMAT.test(username)) { setUStatus('invalid'); return }
    setUStatus('checking')
    const t = setTimeout(() => {
      fetch(`/api/auth/username?check=${encodeURIComponent(username)}`)
        .then((r) => r.json())
        .then((d) => setUStatus(d.available ? 'ok' : 'taken'))
        .catch(() => setUStatus('idle'))
    }, 400)
    return () => clearTimeout(t)
  }, [username, isLogin])

  const generateUsername = async () => {
    usernameTouched.current = true
    setUStatus('checking')
    try {
      const r = await fetch(`/api/auth/username?first=${encodeURIComponent(firstName)}&last=${encodeURIComponent(lastName)}&r=${Math.random()}`)
      const d = await r.json()
      if (d.username) { setUsername(d.username); setUStatus('ok') }
    } catch {
      setUStatus('idle')
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setLoading(true)

    if (isLogin) {
      const res = await signIn('credentials', { email, password, redirect: false })
      if (res?.error) {
        setError('Email ou mot de passe incorrect')
        setLoading(false)
        return
      }
      router.push('/home')
    } else {
      if (password !== confirm) {
        setError('Les mots de passe ne correspondent pas')
        setLoading(false)
        return
      }
      if (!username || uStatus === 'taken' || uStatus === 'invalid') {
        setError('Choisis un identifiant disponible')
        setLoading(false)
        return
      }
      const res = await fetch('/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ firstName, lastName, email, password, username }),
      })
      const data = await res.json()
      if (!res.ok) {
        setError(data.error ?? 'Erreur lors de la création du compte')
        setLoading(false)
        return
      }
      const login = await signIn('credentials', { email, password, redirect: false })
      if (login?.error) {
        setError('Compte créé mais connexion échouée, réessaie.')
        setLoading(false)
        return
      }
      router.push('/onboarding')
    }
  }

  const handleDemo = async () => {
    setLoading(true)
    const res = await signIn('credentials', {
      email: 'demo@atline.ai',
      password: 'demo1234',
      redirect: false,
    })
    if (res?.error) {
      router.push('/home')
    } else {
      router.push('/home')
    }
  }

  return (
    <div
      className="flex min-h-dvh flex-col items-center justify-center px-5 py-10"
      style={{ paddingTop: 'max(2.5rem, env(safe-area-inset-top))' }}
    >
      {/* Logo */}
      <div className="mb-8 flex flex-col items-center gap-3">
        <Image
          src="/brand/atline-icon.png"
          alt="Atline"
          width={56}
          height={56}
          className="rounded-[16px] shadow-md"
        />
        <span className="font-display text-2xl font-extrabold tracking-tight text-foreground">
          atline
        </span>
      </div>

      {/* Card */}
      <div className="w-full max-w-[360px] rounded-3xl border border-border bg-surface p-6 shadow-card">
        <h1 className="mb-6 font-display text-2xl font-bold text-foreground">
          {isLogin ? 'Content de te revoir' : 'Rejoins Atline'}
        </h1>

        <form onSubmit={handleSubmit} className="flex flex-col gap-3.5">
          {!isLogin && (
            <div className="grid grid-cols-2 gap-3">
              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-bold uppercase tracking-widest text-muted-foreground">Prénom</label>
                <input
                  type="text"
                  placeholder="Léa"
                  autoComplete="given-name"
                  value={firstName}
                  onChange={e => setFirstName(e.target.value)}
                  required
                  className="rounded-xl border border-border bg-background px-4 py-3 text-sm text-foreground outline-none placeholder:text-muted-foreground focus:ring-2 focus:ring-primary/30"
                />
              </div>
              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-bold uppercase tracking-widest text-muted-foreground">Nom</label>
                <input
                  type="text"
                  placeholder="Moreau"
                  autoComplete="family-name"
                  value={lastName}
                  onChange={e => setLastName(e.target.value)}
                  required
                  className="rounded-xl border border-border bg-background px-4 py-3 text-sm text-foreground outline-none placeholder:text-muted-foreground focus:ring-2 focus:ring-primary/30"
                />
              </div>
            </div>
          )}

          {!isLogin && (
            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-bold uppercase tracking-widest text-muted-foreground">Identifiant</label>
              <div className="relative">
                <input
                  type="text"
                  placeholder="ton.pseudo"
                  autoComplete="username"
                  value={username}
                  onChange={e => { usernameTouched.current = true; setUsername(e.target.value.toLowerCase().replace(/\s/g, '')) }}
                  required
                  className="w-full rounded-xl border border-border bg-background px-4 py-3 pr-24 text-sm text-foreground outline-none placeholder:text-muted-foreground focus:ring-2 focus:ring-primary/30"
                />
                <div className="absolute right-2 top-1/2 -translate-y-1/2 flex items-center gap-1.5">
                  {uStatus === 'checking' && <Loader2 className="size-4 animate-spin text-muted-foreground" />}
                  {uStatus === 'ok' && <Check className="size-4 text-[#22c55e]" />}
                  {(uStatus === 'taken' || uStatus === 'invalid') && <X className="size-4 text-destructive" />}
                  <button
                    type="button"
                    onClick={generateUsername}
                    title="Générer un identifiant"
                    className="flex items-center gap-1 rounded-lg px-2 py-1.5 text-xs font-bold text-primary hover:bg-primary/10 transition-colors"
                  >
                    <RefreshCw className="size-3.5" />
                    Générer
                  </button>
                </div>
              </div>
              {uStatus === 'ok' && <p className="text-xs font-medium text-[#22c55e]">Disponible</p>}
              {uStatus === 'taken' && <p className="text-xs font-medium text-destructive">Déjà pris</p>}
              {uStatus === 'invalid' && <p className="text-xs font-medium text-destructive">3 à 20 caractères : lettres, chiffres, . _</p>}
            </div>
          )}

          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-bold uppercase tracking-widest text-muted-foreground">Email</label>
            <input
              type="email"
              placeholder="toi@exemple.com"
              autoComplete="email"
              value={email}
              onChange={e => setEmail(e.target.value)}
              required
              className="rounded-xl border border-border bg-background px-4 py-3 text-sm text-foreground outline-none placeholder:text-muted-foreground focus:ring-2 focus:ring-primary/30"
            />
          </div>

          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-bold uppercase tracking-widest text-muted-foreground">Mot de passe</label>
            <div className="relative">
              <input
                type={showPwd ? 'text' : 'password'}
                placeholder="Mot de passe"
                autoComplete={isLogin ? 'current-password' : 'new-password'}
                value={password}
                onChange={e => setPassword(e.target.value)}
                required
                className="w-full rounded-xl border border-border bg-background px-4 py-3 pr-11 text-sm text-foreground outline-none placeholder:text-muted-foreground focus:ring-2 focus:ring-primary/30"
              />
              <button type="button" onClick={() => setShowPwd(v => !v)} className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground z-10 outline-none focus:outline-none">
                {showPwd ? <EyeOff className="size-4" /> : <Eye className="size-4" />}
              </button>
            </div>
          </div>

          {!isLogin && (
            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-bold uppercase tracking-widest text-muted-foreground">Confirmer</label>
              <div className="relative">
                <input
                  type={showConfirm ? 'text' : 'password'}
                  placeholder="Confirmer"
                  autoComplete="new-password"
                  value={confirm}
                  onChange={e => setConfirm(e.target.value)}
                  required
                  className="w-full rounded-xl border border-border bg-background px-4 py-3 pr-11 text-sm text-foreground outline-none placeholder:text-muted-foreground focus:ring-2 focus:ring-primary/30"
                />
                <button type="button" onClick={() => setShowConfirm(v => !v)} className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground z-10 outline-none focus:outline-none">
                  {showConfirm ? <EyeOff className="size-4" /> : <Eye className="size-4" />}
                </button>
              </div>
            </div>
          )}

          {error && (
            <p className="rounded-xl bg-destructive/10 px-3 py-2 text-sm font-medium text-destructive">{error}</p>
          )}

          <button
            type="submit"
            disabled={loading}
            className="mt-1 flex w-full items-center justify-center gap-2 rounded-2xl bg-primary py-3.5 text-lg font-bold text-primary-foreground shadow-md transition-transform active:scale-[0.98] disabled:opacity-60"
          >
            {loading ? <Loader2 className="size-5 animate-spin" /> : (
              <>{isLogin ? 'Se connecter' : 'Créer mon compte'}<ArrowRight className="size-4" /></>
            )}
          </button>

          {isLogin && (
            <button type="button" className="text-center text-sm font-medium text-muted-foreground transition-colors active:text-foreground">
              Mot de passe oublié ?
            </button>
          )}
        </form>

        <div className="my-5 flex items-center gap-3">
          <div className="h-px flex-1 bg-border" />
          <span className="text-xs font-semibold text-muted-foreground">ou</span>
          <div className="h-px flex-1 bg-border" />
        </div>

        {isLogin ? (
          <button
            type="button"
            onClick={handleDemo}
            disabled={loading}
            className="flex w-full items-center justify-center gap-2 rounded-2xl border border-border bg-background py-3.5 text-lg font-semibold text-foreground transition-colors active:bg-muted disabled:opacity-60"
          >
            <Sparkles className="size-4 text-primary" />
            Compte démo
          </button>
        ) : (
          <button
            type="button"
            onClick={() => { setMode('login') }}
            className="flex w-full items-center justify-center gap-2 rounded-2xl border border-border bg-background py-3.5 text-lg font-semibold text-foreground transition-colors active:bg-muted"
          >
            J&apos;ai déjà un compte
          </button>
        )}
      </div>

      <p className="mt-6 text-sm text-muted-foreground">
        {isLogin ? 'Pas encore de compte ?' : 'Déjà membre ?'}{' '}
        <button
          type="button"
          onClick={() => { setMode(isLogin ? 'register' : 'login'); setError('') }}
          className="font-bold text-primary"
        >
          {isLogin ? "S'inscrire" : 'Se connecter'}
        </button>
      </p>
    </div>
  )
}
