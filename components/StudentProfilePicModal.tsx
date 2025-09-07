import React, { useState, useEffect, useRef } from 'react';
import Icon from './Icon';
import { Button } from './FormCard';

interface StudentProfilePicModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (imageDataUrl: string) => void;
}

const StudentProfilePicModal: React.FC<StudentProfilePicModalProps> = ({ isOpen, onClose, onSave }) => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [stream, setStream] = useState<MediaStream | null>(null);
  const [capturedImage, setCapturedImage] = useState<string | null>(null);
  const [error, setError] = useState<string>('');

  const startCamera = async () => {
    setError('');
    setCapturedImage(null);
    try {
      const mediaStream = await navigator.mediaDevices.getUserMedia({ video: { width: 480, height: 480 } });
      setStream(mediaStream);
      if (videoRef.current) {
        videoRef.current.srcObject = mediaStream;
      }
    } catch (err) {
      console.error("Error accessing camera:", err);
      setError('Kamera tidak dapat diakses. Pastikan Anda telah memberikan izin pada browser.');
    }
  };

  const stopCamera = () => {
    if (stream) {
      stream.getTracks().forEach(track => track.stop());
      setStream(null);
    }
  };

  useEffect(() => {
    if (isOpen) {
      startCamera();
    } else {
      stopCamera();
    }

    return () => {
      stopCamera();
    };
  }, [isOpen]);

  const handleTakePhoto = () => {
    if (videoRef.current && canvasRef.current) {
      const canvas = canvasRef.current;
      const video = videoRef.current;
      canvas.width = video.videoWidth;
      canvas.height = video.videoHeight;
      const context = canvas.getContext('2d');
      if (context) {
        // Flip the image horizontally for a mirror effect
        context.translate(canvas.width, 0);
        context.scale(-1, 1);
        context.drawImage(video, 0, 0, canvas.width, canvas.height);
        const dataUrl = canvas.toDataURL('image/png');
        setCapturedImage(dataUrl);
        stopCamera();
      }
    }
  };

  const handleRetake = () => {
    startCamera();
  };

  const handleSavePhoto = () => {
    if (capturedImage) {
      onSave(capturedImage);
    }
  };

  if (!isOpen) {
    return null;
  }

  return (
    <div
      className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center z-50 animate-fade-in"
      onClick={onClose}
    >
      <div
        className="bg-card dark:bg-dark-card rounded-xl p-8 w-full max-w-md mx-4 text-slate-800 dark:text-slate-200 shadow-lg border border-border dark:border-dark-border"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold text-slate-900 dark:text-slate-100">Ambil Foto Profil</h2>
          <button onClick={onClose} className="text-slate-500 hover:text-slate-800 dark:hover:text-slate-200 transition-colors text-3xl font-light" aria-label="Tutup modal">&times;</button>
        </div>

        <div className="aspect-square bg-slate-200 dark:bg-slate-700 rounded-lg overflow-hidden flex items-center justify-center mb-6 border border-border dark:border-dark-border">
          {error && <p className="text-center text-red-600 dark:text-red-400 p-4">{error}</p>}
          
          <video
            ref={videoRef}
            autoPlay
            playsInline
            muted
            className={`w-full h-full object-cover transform -scale-x-100 ${capturedImage || error ? 'hidden' : ''}`}
          ></video>

          {capturedImage && (
            <img src={capturedImage} alt="Captured" className="w-full h-full object-cover" />
          )}

          <canvas ref={canvasRef} className="hidden"></canvas>
        </div>

        <div className="space-y-4">
          {!capturedImage ? (
            <Button onClick={handleTakePhoto} disabled={!stream || !!error} className="w-full flex items-center justify-center gap-2">
              <Icon name="camera" className="w-6 h-6" />
              Ambil Foto
            </Button>
          ) : (
            <div className="grid grid-cols-2 gap-4">
              <button
                onClick={handleRetake}
                className="w-full bg-white dark:bg-slate-700 border border-slate-300 dark:border-slate-600 text-slate-700 dark:text-slate-200 font-medium py-3 px-4 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-600 transition-colors"
              >
                Ulangi
              </button>
              <Button onClick={handleSavePhoto}>
                Simpan Foto
              </Button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default StudentProfilePicModal;