import { useState } from 'react';
import { Menu, ShieldCheck } from 'lucide-react';

const navItems = ['Home', 'About', 'Safety'];

function Header() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <header className="sticky top-0 z-40 border-b border-emerald-400/10 bg-forest-950/82 backdrop-blur-xl">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-4 sm:px-6 lg:px-8">
        <a href="#home" className="flex items-center gap-3" aria-label="SerpentAI home">
          <span className="grid h-10 w-10 place-items-center rounded-lg border border-emerald-400/30 bg-emerald-400/10 text-emerald-300 shadow-[0_0_22px_rgba(16,185,129,0.22)]">
            <ShieldCheck size={21} aria-hidden="true" />
          </span>
          <span className="text-xl font-bold tracking-wide text-white">SerpentAI</span>
        </a>

        <nav className="hidden items-center gap-8 text-sm font-medium text-slate-300 md:flex">
          {navItems.map((item) => (
            <a key={item} href={`#${item.toLowerCase()}`} className="transition hover:text-emerald-300">
              {item}
            </a>
          ))}
        </nav>

        <button
          className="grid h-10 w-10 place-items-center rounded-lg border border-white/10 bg-white/5 text-slate-200 md:hidden"
          type="button"
          onClick={() => setIsOpen((current) => !current)}
          aria-label="Open navigation menu"
          title="Open menu"
        >
          <Menu size={20} aria-hidden="true" />
        </button>
      </div>

      {isOpen && (
        <nav className="border-t border-white/10 px-4 py-3 md:hidden">
          <div className="mx-auto flex max-w-7xl flex-col gap-1">
            {navItems.map((item) => (
              <a
                key={item}
                href={`#${item.toLowerCase()}`}
                className="rounded-lg px-3 py-3 text-sm font-semibold text-slate-200 transition hover:bg-white/5 hover:text-emerald-300"
                onClick={() => setIsOpen(false)}
              >
                {item}
              </a>
            ))}
          </div>
        </nav>
      )}
    </header>
  );
}

export default Header;
