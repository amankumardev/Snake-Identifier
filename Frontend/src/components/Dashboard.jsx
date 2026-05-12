import { AlertTriangle, CheckCircle2, RefreshCw, ShieldAlert, Sparkles } from 'lucide-react';

function Dashboard({ file, previewUrl, result, error, onReset }) {
  const BadgeIcon = result.venomous ? ShieldAlert : CheckCircle2;
  const isVideo = file?.type?.startsWith('video/');

  return (
    <section className="mx-auto flex h-screen max-w-7xl flex-col px-4 py-3 sm:px-6 lg:px-8">
      <div className="mb-3 flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <div className="mb-1.5 inline-flex items-center gap-2 rounded-full border border-emerald-300/20 bg-emerald-400/10 px-3 py-1.5 text-sm font-semibold text-emerald-200">
            <Sparkles size={16} aria-hidden="true" />
            Scan complete
          </div>
          <h1 className="text-2xl font-black text-white sm:text-3xl">Classification Dashboard</h1>
          <p className="mt-1 max-w-2xl truncate text-sm text-slate-400">{file?.name || 'Uploaded file'} analyzed successfully.</p>
        </div>

        <button
          type="button"
          onClick={onReset}
          className="inline-flex items-center justify-center gap-2 rounded-lg border border-emerald-300/40 bg-emerald-400/10 px-4 py-2.5 text-sm font-bold text-emerald-100 transition hover:bg-emerald-400 hover:text-forest-950"
        >
          <RefreshCw size={17} aria-hidden="true" />
          Analyze Another File
        </button>
      </div>

      <div className="grid min-h-0 flex-1 gap-3 lg:grid-cols-[1.35fr_0.65fr]">
        <div className="min-h-0 overflow-hidden rounded-2xl border border-white/10 bg-slate-950/72 shadow-2xl shadow-black/30">
          <div className="border-b border-white/10 px-4 py-2.5">
            <h2 className="font-bold text-white">{isVideo ? 'Video Player' : 'Image Preview'}</h2>
          </div>
          <div className="h-[calc(100%-45px)] bg-black">
            {previewUrl && isVideo ? (
              <video className="h-full w-full object-contain" src={previewUrl} controls playsInline />
            ) : previewUrl ? (
              <img className="h-full w-full object-contain" src={previewUrl} alt="Uploaded specimen" />
            ) : (
              <div className="grid h-full place-items-center text-slate-500">No media loaded</div>
            )}
          </div>
        </div>

        <aside className="min-h-0 overflow-hidden rounded-2xl border border-white/10 bg-white/[0.04] p-3 shadow-2xl shadow-black/25">
          <div
            className={`mb-3 inline-flex w-full items-center justify-center gap-2 rounded-lg px-4 py-2.5 text-sm font-black uppercase tracking-wide ${
              result.venomous
                ? 'border border-red-400/40 bg-red-500/16 text-red-100'
                : 'border border-emerald-300/40 bg-emerald-400/16 text-emerald-100'
            }`}
          >
            <BadgeIcon size={20} aria-hidden="true" />
            {result.venomous ? 'Venomous' : 'Non-Venomous'}
          </div>

          <div className="space-y-2">
            <ResultRow label="Species Name" value={result.speciesName} />
            <ResultRow label="Scientific Name" value={result.scientificName} italic />
            <ResultRow label="Confidence Score" value={`${result.confidence}%`} highlight />
            <ResultRow label="Result Source" value={result.source === 'model' ? 'Trained Model' : result.source === 'error' ? 'Backend Error' : 'Demo Backend'} />
          </div>

          <div className="mt-3 rounded-lg border border-amber-300/25 bg-amber-400/10 p-3 text-xs leading-5 text-amber-100">
            <div className="mb-1 flex items-center gap-2 font-bold">
              <AlertTriangle size={17} aria-hidden="true" />
              Safety Notice
            </div>
            {error || result.safetyNote || 'Keep distance from all snakes. This result should not replace expert identification or emergency guidance.'}
          </div>
        </aside>
      </div>
    </section>
  );
}

function ResultRow({ label, value, italic = false, highlight = false }) {
  return (
    <div className="rounded-lg border border-white/10 bg-slate-950/42 p-2.5">
      <p className="text-xs font-bold uppercase tracking-wide text-slate-500">{label}</p>
      <p className={`mt-1 text-lg font-bold ${italic ? 'italic' : ''} ${highlight ? 'text-emerald-300' : 'text-white'}`}>{value}</p>
    </div>
  );
}

export default Dashboard;
