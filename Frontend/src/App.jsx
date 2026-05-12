import { useCallback, useEffect, useState } from 'react';
import HeroSection from './components/HeroSection';
import ScanningAnimation from './components/ScanningAnimation';
import Dashboard from './components/Dashboard';
import serpentBackground from './assets/serpent-background.png';

const API_URL = import.meta.env.VITE_API_URL || 'http://127.0.0.1:8000';

function App() {
  const [status, setStatus] = useState('idle');
  const [uploadedFile, setUploadedFile] = useState(null);
  const [videoUrl, setVideoUrl] = useState('');
  const [result, setResult] = useState(null);
  const [scanFinished, setScanFinished] = useState(false);
  const [error, setError] = useState('');

  const handleUpload = useCallback((file) => {
    if (!file) return;
    if (!file.type.startsWith('video/') && !file.type.startsWith('image/')) {
      alert('Please upload an image or video file for analysis.');
      return;
    }

    setUploadedFile(file);
    setResult(null);
    setError('');
    setScanFinished(false);
    setStatus('scanning');
  }, []);

  const handleScanComplete = useCallback(() => {
    setScanFinished(true);
  }, []);

  const handleReset = useCallback(() => {
    setStatus('idle');
    setUploadedFile(null);
    setResult(null);
    setScanFinished(false);
    setError('');
  }, []);

  useEffect(() => {
    if (!uploadedFile) {
      setVideoUrl('');
      return undefined;
    }

    const objectUrl = URL.createObjectURL(uploadedFile);
    setVideoUrl(objectUrl);

    return () => URL.revokeObjectURL(objectUrl);
  }, [uploadedFile]);

  useEffect(() => {
    if (!uploadedFile || status !== 'scanning') return undefined;

    const controller = new AbortController();
    const formData = new FormData();
    formData.append('file', uploadedFile);

    async function classifyFile() {
      try {
        const predictionEndpoint = uploadedFile.type.startsWith('video/')
          ? '/predict-video'
          : '/predict-image';

        const response = await fetch(`${API_URL}${predictionEndpoint}`, {
          method: 'POST',
          body: formData,
          signal: controller.signal,
        });

        const payload = await response.json();
        if (!response.ok) {
          throw new Error(payload.detail || payload.error || 'Classification failed');
        }

        setResult(payload);
      } catch (classificationError) {
        if (controller.signal.aborted) return;
        setError(classificationError.message || 'Backend is not reachable');
        setResult({
          speciesName: 'Analysis Unavailable',
          scientificName: 'Backend error',
          confidence: 0,
          venomous: false,
          safetyNote: 'Backend could not complete the scan. Keep distance from all snakes and try again.',
          source: 'error',
        });
      }
    }

    classifyFile();

    return () => controller.abort();
  }, [uploadedFile, status]);

  useEffect(() => {
    if (status === 'scanning' && scanFinished && result) {
      setStatus('complete');
    }
  }, [result, scanFinished, status]);

  return (
    <div
      className="h-screen overflow-hidden bg-forest-950 bg-center bg-no-repeat text-slate-100"
      style={{
        backgroundImage: `url(${serpentBackground})`,
        backgroundSize: '100vw 100vh',
      }}
    >
      <main className="relative h-screen overflow-hidden">
        <div className="pointer-events-none fixed inset-0 z-0 bg-[linear-gradient(90deg,rgba(3,19,13,0.92)_0%,rgba(3,19,13,0.72)_42%,rgba(2,6,23,0.46)_100%)]" />
        <div className="pointer-events-none fixed inset-0 z-0 bg-black/20" />
        <div className="relative z-10 h-full overflow-hidden">

          {status === 'idle' && (
            <HeroSection onUpload={handleUpload} />
          )}

          {status === 'scanning' && (
            <ScanningAnimation
              file={uploadedFile}
              videoUrl={videoUrl}
              onComplete={handleScanComplete}
            />
          )}

          {status === 'complete' && (
          <Dashboard
            file={uploadedFile}
            previewUrl={videoUrl}
            result={result}
            error={error}
            onReset={handleReset}
          />
          )}
        </div>
      </main>
    </div>
  );
}

export default App;
