import Link from "next/link"
import { ArrowRight, Check } from "lucide-react"

export function AuthShell({
  children,
  mode,
}: {
  children: React.ReactNode
  mode: "login" | "signup"
}) {
  return (
    <main className="grid min-h-screen bg-[#f7f8fc] lg:grid-cols-[0.9fr_1.1fr]">
      <section className="relative hidden overflow-hidden bg-[#1f2340] p-12 text-white lg:flex lg:flex-col lg:justify-between">
        <div className="absolute -top-28 -right-28 size-80 rounded-full border-[40px] border-[#8277f2]/20" />
        <div className="absolute -bottom-40 -left-24 size-96 rounded-full border-[55px] border-[#f0a58e]/10" />
        <Link
          href="/"
          className="relative flex items-center gap-2.5 text-lg font-bold"
        >
          <span className="grid size-8 place-items-center rounded-xl bg-[#8a7dff] text-sm">
            N
          </span>
          Nimbus
        </Link>
        <div className="relative max-w-md">
          <p className="mb-5 text-[11px] font-bold tracking-[0.2em] text-[#aaa3ff] uppercase">
            The calm way to grow
          </p>
          <h1 className="text-5xl leading-[1.08] font-semibold tracking-tight">
            Your whole pipeline, in one clear view.
          </h1>
          <p className="mt-6 text-base leading-7 text-white/50">
            Stay close to every relationship, every opportunity, and every
            number that moves your business forward.
          </p>
          <div className="mt-10 space-y-4">
            {[
              "See what needs your attention",
              "Turn conversations into momentum",
              "Make decisions with confidence",
            ].map((item) => (
              <div
                key={item}
                className="flex items-center gap-3 text-sm text-white/75"
              >
                <span className="grid size-5 place-items-center rounded-full bg-[#8277f2]/25 text-[#bcb6ff]">
                  <Check size={12} />
                </span>
                {item}
              </div>
            ))}
          </div>
        </div>
        <p className="relative text-xs text-white/30">
          © 2026 Nimbus. Built for thoughtful teams.
        </p>
      </section>
      <section className="flex items-center justify-center px-5 py-10 sm:px-10">
        <div className="w-full max-w-md">
          <div className="mb-10 lg:hidden">
            <Link
              href="/"
              className="flex items-center gap-2.5 text-lg font-bold text-[#20212b]"
            >
              <span className="grid size-8 place-items-center rounded-xl bg-[#8a7dff] text-sm text-white">
                N
              </span>
              Nimbus
            </Link>
          </div>
          <div className="mb-8">
            <p className="mb-2 text-[11px] font-bold tracking-[0.18em] text-[#8a7dff] uppercase">
              {mode === "login" ? "Welcome back" : "Get started"}
            </p>
            <h2 className="text-3xl font-semibold tracking-tight text-[#20212b]">
              {mode === "login" ? "Sign in to Nimbus" : "Create your workspace"}
            </h2>
            <p className="mt-2 text-sm text-[#777b8f]">
              {mode === "login"
                ? "Pick up where you left off."
                : "Bring your pipeline into focus."}
            </p>
          </div>
          {children}
          <p className="text-[#777b8f mt-8 text-center text-sm">
            {mode === "login"
              ? "Don't have an account?"
              : "Already have an account?"}{" "}
            <Link
              href={mode === "login" ? "/signup" : "/login"}
              className="font-semibold text-[#7065e8] hover:text-[#5148c8]"
            >
              {mode === "login" ? "Create one" : "Sign in"}
            </Link>{" "}
            <ArrowRight size={14} className="ml-1 inline" />
          </p>
        </div>
      </section>
    </main>
  )
}
