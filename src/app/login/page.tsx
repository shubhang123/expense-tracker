import { login, signup } from './actions'
import { AlertCircle, Sparkles } from 'lucide-react'

export default async function LoginPage(props: { searchParams: Promise<{ error?: string }> }) {
    const searchParams = await props.searchParams

    return (
        <div className="min-h-screen grid items-center justify-center p-6 bg-aurora relative overflow-hidden">
            {/* Background Atmosphere */}
            <div className="absolute top-[-10%] left-[-10%] w-[400px] h-[400px] blob blob-violet opacity-10 pointer-events-none" />
            <div className="absolute bottom-[-10%] right-[-10%] w-[400px] h-[400px] blob blob-emerald opacity-10 pointer-events-none" />
            <div className="bg-noise absolute inset-0 pointer-events-none" />

            <div className="w-full max-w-md space-y-12 relative z-10 enter">
                <header className="space-y-4">
                    <span className="t-label">Gateway Access</span>
                    <h1 className="t-h1 text-6xl md:text-7xl">
                        Emerald<br />
                        <span className="t-light opacity-50">Finance</span><br />
                        <span className="t-accent">Matrix</span>
                    </h1>
                    <p className="t-label !opacity-40 max-w-[280px]">
                        Initialize session to access spending data and allocation grids.
                    </p>
                </header>

                {searchParams?.error && (
                    <div className="card bg-red-500/10 border-red-500/20 p-5 flex items-center gap-4 animate-enter">
                        <AlertCircle className="h-5 w-5 text-red-500 shrink-0" />
                        <p className="t-label !opacity-100 text-red-500 lowercase leading-relaxed">
                            Access Denied: {searchParams.error}
                        </p>
                    </div>
                )}

                <form className="space-y-8">
                    <div className="space-y-3">
                        <label className="t-label" htmlFor="email">
                            Identity Locator
                        </label>
                        <input
                            id="email"
                            name="email"
                            type="email"
                            required
                            className="w-full h-16 bg-white/5 border border-white/10 rounded-2xl px-6 text-white font-medium placeholder:text-white/10 focus:border-primary/50 focus:ring-4 focus:ring-primary/5 transition-all outline-none"
                            placeholder="USER@DOMAIN.COM"
                        />
                    </div>

                    <div className="space-y-3">
                        <label className="t-label" htmlFor="password">
                            Authentication Key
                        </label>
                        <input
                            id="password"
                            name="password"
                            type="password"
                            required
                            className="w-full h-16 bg-white/5 border border-white/10 rounded-2xl px-6 text-white font-medium placeholder:text-white/10 focus:border-primary/50 focus:ring-4 focus:ring-primary/5 transition-all outline-none"
                            placeholder="••••••••"
                        />
                    </div>

                    <div className="pt-4 space-y-4">
                        <button
                            formAction={login}
                            className="w-full h-18 btn--primary group overflow-hidden relative shadow-2xl py-6 rounded-2xl"
                        >
                            <div className="absolute inset-0 bg-white/10 translate-y-full group-hover:translate-y-0 transition-transform duration-300" />
                            <span className="relative z-10 flex items-center justify-center gap-2">
                                <Sparkles className="h-4 w-4 opacity-50" />
                                Initialize Session
                            </span>
                        </button>
                        <button
                            formAction={signup}
                            className="w-full h-18 bg-white/5 border border-white/10 text-white t-label !opacity-100 hover:bg-white/10 transition-all py-6 rounded-2xl"
                        >
                            Create Identity
                        </button>
                    </div>
                </form>

                <footer className="pt-8 text-center">
                    <p className="t-label text-[9px] !opacity-20">
                        System built on Bauhaus Principles & Atmospheric Voids
                    </p>
                </footer>
            </div>
        </div>
    )
}
