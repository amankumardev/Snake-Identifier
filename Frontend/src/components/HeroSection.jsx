import { useRef, useState } from 'react';
import { BrainCircuit, Image, Leaf, UploadCloud, Video } from 'lucide-react';

function HeroSection({ onUpload }) {
  const fileInputRef = useRef(null);
  const [isDragging, setIsDragging] = useState(false);

  const selectFile = (fileList) => {
    const file = fileList?.[0];
    if (file) onUpload(file);
  };

  const handleDrop = (event) => {
    event.preventDefault();
    setIsDragging(false);
    selectFile(event.dataTransfer.files);
  };

  return (
    <section id="home" className="mx-auto grid h-screen max-w-7xl items-center gap-6 px-4 py-5 sm:px-6 lg:grid-cols-[1fr_0.9fr] lg:px-8">
      <div className="max-w-2xl">
        <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-emerald-400/20 bg-emerald-400/10 px-4 py-2 text-sm font-medium text-emerald-200">
          <BrainCircuit size={16} aria-hidden="true" />
          AI-assisted wildlife protection
        </div>

        <h1 className="text-4xl font-black leading-tight text-white sm:text-5xl lg:text-6xl">
          Identify Snake Species Instantly
        </h1>

        <p className="mt-4 max-w-2xl text-base leading-7 text-slate-300">
          Upload a snake image or video and let SerpentAI simulate frame-by-frame analysis for faster species awareness,
          safer field decisions, and better respect for wildlife habitats.
        </p>

        <div id="about" className="mt-5 grid gap-3 sm:grid-cols-2">
          <div className="rounded-lg border border-white/10 bg-white/[0.04] p-3">
            <Leaf className="mb-2 text-emerald-300" size={20} aria-hidden="true" />
            <h2 className="font-semibold text-white">Conservation First</h2>
            <p className="mt-1 text-sm leading-5 text-slate-400">Supports observation without harm or unnecessary contact.</p>
          </div>
          <div id="safety" className="rounded-lg border border-white/10 bg-white/[0.04] p-3">
            <Video className="mb-2 text-emerald-300" size={20} aria-hidden="true" />
            <h2 className="font-semibold text-white">Image + Video Scan</h2>
            <p className="mt-1 text-sm leading-5 text-slate-400">Designed for photos, short phone clips, or trail camera media.</p>
          </div>
        </div>
      </div>

      <div
        className={`relative rounded-2xl border-2 border-dashed p-4 transition sm:p-5 ${
          isDragging
            ? 'border-emerald-300 bg-emerald-400/10 shadow-[0_0_45px_rgba(16,185,129,0.22)]'
            : 'border-emerald-400/25 bg-slate-950/50'
        }`}
        onDragOver={(event) => {
          event.preventDefault();
          setIsDragging(true);
        }}
        onDragLeave={() => setIsDragging(false)}
        onDrop={handleDrop}
      >
        <input
          ref={fileInputRef}
          type="file"
          className="sr-only"
          accept="image/*,video/*"
          onChange={(event) => selectFile(event.target.files)}
        />

        <button
          type="button"
          onClick={() => fileInputRef.current?.click()}
          className="flex min-h-[300px] w-full flex-col items-center justify-center rounded-xl border border-white/10 bg-[linear-gradient(145deg,rgba(15,23,42,0.88),rgba(4,47,31,0.5))] px-6 py-7 text-center transition hover:border-emerald-300/60 hover:bg-emerald-950/45 lg:min-h-[340px]"
        >
          <span className="mb-5 grid h-16 w-16 place-items-center rounded-full border border-emerald-300/30 bg-emerald-400/10 text-emerald-200 shadow-[0_0_32px_rgba(16,185,129,0.2)]">
            <UploadCloud size={32} aria-hidden="true" />
          </span>
          <span className="text-2xl font-bold text-white">Drop your snake image or video here</span>
          <span className="mt-3 max-w-sm text-sm leading-6 text-slate-400">
            JPG, PNG, WEBP, MP4, MOV, WEBM, or other browser-supported formats.
          </span>
          <span className="mt-5 inline-flex items-center gap-3 text-xs font-semibold uppercase tracking-wide text-slate-400">
            <Image size={15} aria-hidden="true" />
            Photos
            <Video size={15} aria-hidden="true" />
            Videos
          </span>
          <span className="mt-5 rounded-lg bg-emerald-400 px-5 py-3 text-sm font-bold text-forest-950 shadow-[0_12px_30px_rgba(16,185,129,0.28)]">
            Choose File
          </span>
        </button>
      </div>
    </section>
  );
}

export default HeroSection;
