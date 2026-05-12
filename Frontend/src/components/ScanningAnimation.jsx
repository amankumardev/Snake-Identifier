import { useEffect, useState } from 'react';
import { Activity, Cpu, ScanLine, Waves } from 'lucide-react';

function ScanningAnimation({ file, videoUrl, onComplete }) {
  const [progress, setProgress] = useState(0);
  const isVideo = file?.type?.startsWith('video/');

  useEffect(() => {
    const intervalId = window.setInterval(() => {
      setProgress((current) => {
        if (current >= 100) {
          window.clearInterval(intervalId);
          window.setTimeout(onComplete, 450);
          return 100;
        }

        return Math.min(current + 4, 100);
      });
    }, 110);

    return () => window.clearInterval(intervalId);
  }, [onComplete]);

  return (
    <section className="mx-auto grid h-screen max-w-6xl grid-rows-[auto_minmax(0,1fr)_auto] px-4 py-3 sm:px-6 lg:px-8">
      <div className="mb-2 flex flex-col items-center text-center">
        <div className="mb-2 inline-flex items-center gap-3 rounded-full border border-emerald-300/20 bg-emerald-400/10 px-3 py-1.5 text-emerald-200">
          <Activity className="animate-pulse" size={18} aria-hidden="true" />
          <span className="text-sm font-semibold">Scanning specimen frames</span>
        </div>
        <h1 className="text-2xl font-black text-white sm:text-3xl">AI Analysis In Progress</h1>
        <p className="mt-1 max-w-2xl truncate text-sm leading-6 text-slate-400">
          Detecting body pattern, head shape, movement cues, and color bands from {file?.name || 'uploaded media'}.
        </p>
      </div>

      <div className="grid min-h-0 gap-3 lg:grid-cols-[1fr_240px]">
        <div className="relative min-h-0 overflow-hidden rounded-2xl border border-emerald-300/20 bg-slate-950 shadow-2xl shadow-emerald-950/30">
          <div className="h-full min-h-0 bg-black">
          {videoUrl && isVideo ? (
            <video className="h-full w-full object-cover opacity-70" src={videoUrl} autoPlay muted loop playsInline />
          ) : videoUrl ? (
            <img className="h-full w-full object-cover opacity-70" src={videoUrl} alt="Uploaded specimen preview" />
          ) : (
            <div className="h-full w-full bg-slate-950" />
          )}
          </div>

          <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(rgba(16,185,129,0.08)_1px,transparent_1px),linear-gradient(90deg,rgba(16,185,129,0.08)_1px,transparent_1px)] bg-[size:34px_34px]" />
          <div className="pointer-events-none absolute inset-0 border-y-2 border-emerald-300/70 bg-emerald-300/5 shadow-[0_0_35px_rgba(16,185,129,0.45)] scan-band" />
          <div className="pointer-events-none absolute left-[16%] top-[18%] h-[52%] w-[58%] rounded-lg border border-emerald-300/70 shadow-[0_0_28px_rgba(16,185,129,0.35)] detection-box">
            <span className="absolute -top-7 left-0 rounded bg-emerald-400 px-2 py-1 font-mono text-[11px] font-bold text-forest-950">SPECIMEN LOCK 0.{Math.min(progress + 12, 99)}</span>
          </div>
          <span className="corner-marker left-4 top-4 border-l-2 border-t-2" />
          <span className="corner-marker right-4 top-4 border-r-2 border-t-2" />
          <span className="corner-marker bottom-4 left-4 border-b-2 border-l-2" />
          <span className="corner-marker bottom-4 right-4 border-b-2 border-r-2" />

          <div className="absolute left-4 top-4 flex items-center gap-2 rounded-lg border border-white/10 bg-black/45 px-3 py-2 text-xs font-semibold text-emerald-100 backdrop-blur">
            <ScanLine size={15} aria-hidden="true" />
            Neural frame sweep
          </div>
          <div className="absolute bottom-3 left-3 right-3 grid grid-cols-4 gap-2">
            {['HEAD', 'SCALES', 'BANDS', 'MOTION'].map((label, index) => (
              <div key={label} className="rounded border border-emerald-300/20 bg-black/45 px-2 py-2 backdrop-blur">
                <div className="font-mono text-[10px] text-slate-400">{label}</div>
                <div className="mt-1 h-1 overflow-hidden rounded-full bg-white/10">
                  <div className="h-full bg-emerald-300" style={{ width: `${Math.min(progress + index * 12, 100)}%` }} />
                </div>
              </div>
            ))}
          </div>
        </div>

        <aside className="hidden min-h-0 overflow-hidden rounded-2xl border border-white/10 bg-slate-950/70 p-3 backdrop-blur lg:block">
          <h2 className="mb-3 flex items-center gap-2 text-sm font-bold uppercase tracking-wide text-emerald-200">
            <Waves size={16} aria-hidden="true" />
            Live Signals
          </h2>
          <div className="space-y-2">
            <Metric label="Pattern match" value={`${Math.min(progress + 7, 100)}%`} />
            <Metric label="Scale texture" value={`${Math.min(progress + 18, 100)}%`} />
            <Metric label="Head geometry" value={`${Math.min(progress + 3, 100)}%`} />
            <Metric label="Risk estimate" value={progress > 68 ? 'High review' : 'Processing'} />
          </div>
          <div className="mt-3 grid grid-cols-2 gap-2">
            {[1, 2, 3, 4].map((frame) => (
              <div key={frame} className="aspect-video rounded border border-emerald-300/20 bg-emerald-400/10 p-1">
                <div className="h-full rounded bg-[linear-gradient(135deg,rgba(16,185,129,0.2),rgba(15,23,42,0.95))]" />
              </div>
            ))}
          </div>
        </aside>
      </div>

      <div className="mt-3 w-full max-w-xl justify-self-center">
        <div className="mb-2 flex items-center justify-between text-sm">
          <span className="inline-flex items-center gap-2 font-semibold text-slate-200">
            <Cpu size={16} aria-hidden="true" />
            Feature extraction
          </span>
          <span className="font-mono text-emerald-300">{progress}%</span>
        </div>
        <div className="h-2.5 overflow-hidden rounded-full bg-white/10">
          <div
            className="h-full rounded-full bg-emerald-400 shadow-[0_0_18px_rgba(16,185,129,0.65)] transition-all duration-150"
            style={{ width: `${progress}%` }}
          />
        </div>
      </div>
    </section>
  );
}

function Metric({ label, value }) {
  return (
    <div className="rounded-lg border border-white/10 bg-white/[0.04] p-2.5">
      <div className="text-[11px] font-bold uppercase tracking-wide text-slate-500">{label}</div>
      <div className="mt-1 font-mono text-sm font-bold text-white">{value}</div>
    </div>
  );
}

export default ScanningAnimation;
