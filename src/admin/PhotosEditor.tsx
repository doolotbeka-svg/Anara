import React, { useRef, useState } from 'react';
import { ArrowLeft, ArrowRight, ImagePlus, Loader2, Trash2, Upload } from 'lucide-react';
import { SiteImages } from '../content/merge';
import { adminApi, errorText, UnauthorizedError } from './api';

const MAX_SIDE = 1600;

/** Shrinks a photo from a phone (often 5–10 MB) to at most 1600px before upload. */
async function resizeImage(file: File): Promise<Blob> {
  const bitmap = await createImageBitmap(file);
  const scale = Math.min(1, MAX_SIDE / Math.max(bitmap.width, bitmap.height));
  const canvas = document.createElement('canvas');
  canvas.width = Math.round(bitmap.width * scale);
  canvas.height = Math.round(bitmap.height * scale);
  canvas.getContext('2d')!.drawImage(bitmap, 0, 0, canvas.width, canvas.height);
  bitmap.close();

  const toBlob = (type: string) =>
    new Promise<Blob | null>((resolve) => canvas.toBlob(resolve, type, 0.85));
  // Older Safari can't encode WebP and silently returns PNG: use JPEG then
  const webp = await toBlob('image/webp');
  if (webp && webp.type === 'image/webp') return webp;
  const jpeg = await toBlob('image/jpeg');
  if (!jpeg) throw new Error('resize_failed');
  return jpeg;
}

interface PhotosEditorProps {
  images: SiteImages;
  password: string;
  onChange: (images: SiteImages) => void;
  onUnauthorized: () => void;
}

const PhotoSlot: React.FC<{
  title: string;
  hint: string;
  url: string | null;
  round?: boolean;
  busy: boolean;
  onPick: (files: FileList) => void;
  onRemove: () => void;
}> = ({ title, hint, url, round, busy, onPick, onRemove }) => {
  const inputRef = useRef<HTMLInputElement>(null);
  return (
    <div className="p-4 rounded-2xl border border-[#E3DCD2] bg-white space-y-3">
      <div>
        <h3 className="font-semibold text-sm text-[#182B1F]">{title}</h3>
        <p className="text-xs text-[#5C6E61]">{hint}</p>
      </div>
      <div className="flex items-center gap-4">
        <div
          className={`shrink-0 overflow-hidden bg-[#F2EDE5] border border-[#E3DCD2] flex items-center justify-center ${
            round ? 'w-24 h-24 rounded-full' : 'w-40 h-28 rounded-xl'
          }`}
        >
          {url ? <img src={url} alt="" className="w-full h-full object-cover" /> : <ImagePlus className="w-6 h-6 text-[#A4B3A8]" />}
        </div>
        <div className="flex flex-col gap-2">
          <button
            type="button"
            disabled={busy}
            onClick={() => inputRef.current?.click()}
            className="inline-flex items-center gap-1.5 px-3 py-2 rounded-lg bg-[#466352] hover:bg-[#385142] text-white text-xs font-semibold disabled:opacity-50"
          >
            {busy ? <Loader2 className="w-4 h-4 animate-spin" /> : <Upload className="w-4 h-4" />}
            {url ? 'Заменить фото' : 'Загрузить фото'}
          </button>
          {url && (
            <button
              type="button"
              disabled={busy}
              onClick={onRemove}
              className="inline-flex items-center gap-1.5 px-3 py-2 rounded-lg text-xs font-semibold text-[#A34236] hover:bg-[#FBEAE7]"
            >
              <Trash2 className="w-4 h-4" />
              Убрать
            </button>
          )}
        </div>
      </div>
      <input
        ref={inputRef}
        type="file"
        accept="image/*"
        className="hidden"
        onChange={(e) => {
          if (e.target.files?.length) onPick(e.target.files);
          e.target.value = '';
        }}
      />
    </div>
  );
};

export const PhotosEditor: React.FC<PhotosEditorProps> = ({ images, password, onChange, onUnauthorized }) => {
  const [busySlot, setBusySlot] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const galleryInputRef = useRef<HTMLInputElement>(null);

  const upload = async (slot: string, files: File[]): Promise<string[]> => {
    setBusySlot(slot);
    setError(null);
    try {
      const urls: string[] = [];
      for (const file of files) {
        const { url } = await adminApi.uploadImage(password, await resizeImage(file));
        urls.push(url);
      }
      return urls;
    } catch (e) {
      if (e instanceof UnauthorizedError) onUnauthorized();
      setError(e instanceof Error && e.message === 'resize_failed' ? 'Не удалось открыть фото. Попробуйте другой файл (JPG или PNG).' : errorText(e));
      return [];
    } finally {
      setBusySlot(null);
    }
  };

  const setSingle = async (slot: 'masterPhoto' | 'heroPhoto', files: FileList) => {
    const [url] = await upload(slot, [files[0]]);
    if (url) onChange({ ...images, [slot]: url });
  };

  const addToGallery = async (files: FileList) => {
    const urls = await upload('gallery', Array.from(files));
    if (urls.length) onChange({ ...images, gallery: [...images.gallery, ...urls.map((url) => ({ url, caption: '' }))] });
  };

  const updateGallery = (gallery: SiteImages['gallery']) => onChange({ ...images, gallery });
  const moveGallery = (index: number, delta: number) => {
    const next = [...images.gallery];
    [next[index], next[index + delta]] = [next[index + delta], next[index]];
    updateGallery(next);
  };

  return (
    <div className="space-y-4">
      <p className="text-xs text-[#5C6E61]">
        Фото с телефона можно загружать как есть: перед загрузкой они автоматически уменьшаются. На сайте фото появятся после нажатия «Сохранить».
      </p>

      {error && <div className="p-3 rounded-xl bg-[#FDF3F2] border border-[#F2D3CF] text-xs text-[#7A2E26]">{error}</div>}

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <PhotoSlot
          title="Фото мастера"
          hint="Круглый портрет в шапке, на первом экране и в блоке «О мастере». Лучше лицо крупным планом."
          url={images.masterPhoto}
          round
          busy={busySlot === 'masterPhoto'}
          onPick={(files) => setSingle('masterPhoto', files)}
          onRemove={() => onChange({ ...images, masterPhoto: null })}
        />
        <PhotoSlot
          title="Фото кабинета на первом экране"
          hint="Большая карточка справа на первом экране. Лучше горизонтальное фото массажного стола."
          url={images.heroPhoto}
          busy={busySlot === 'heroPhoto'}
          onPick={(files) => setSingle('heroPhoto', files)}
          onRemove={() => onChange({ ...images, heroPhoto: null })}
        />
      </div>

      <div className="p-4 rounded-2xl border border-[#E3DCD2] bg-white space-y-3">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
          <div>
            <h3 className="font-semibold text-sm text-[#182B1F]">Галерея кабинета</h3>
            <p className="text-xs text-[#5C6E61]">Показывается под блоком «О мастере и кабинете». Можно выбрать сразу несколько фото.</p>
          </div>
          <button
            type="button"
            disabled={busySlot === 'gallery'}
            onClick={() => galleryInputRef.current?.click()}
            className="shrink-0 inline-flex items-center gap-1.5 px-3 py-2 rounded-lg bg-[#466352] hover:bg-[#385142] text-white text-xs font-semibold disabled:opacity-50"
          >
            {busySlot === 'gallery' ? <Loader2 className="w-4 h-4 animate-spin" /> : <Upload className="w-4 h-4" />}
            Добавить фото
          </button>
          <input
            ref={galleryInputRef}
            type="file"
            accept="image/*"
            multiple
            className="hidden"
            onChange={(e) => {
              if (e.target.files?.length) addToGallery(e.target.files);
              e.target.value = '';
            }}
          />
        </div>

        {images.gallery.length === 0 ? (
          <p className="text-xs text-[#738377]">Пока нет фото — галерея на сайте скрыта.</p>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
            {images.gallery.map((photo, index) => (
              <div key={photo.url} className="rounded-xl border border-[#E3DCD2] overflow-hidden bg-[#FBFAF7]">
                <img src={photo.url} alt="" className="w-full aspect-[4/3] object-cover" />
                <div className="p-2 space-y-2">
                  <input
                    type="text"
                    value={photo.caption}
                    placeholder="Подпись (необязательно)"
                    onChange={(e) =>
                      updateGallery(images.gallery.map((p, i) => (i === index ? { ...p, caption: e.target.value } : p)))
                    }
                    className="w-full text-xs p-2 rounded-lg border border-[#D5CDC2] bg-white focus:outline-hidden focus:ring-2 focus:ring-[#466352]"
                  />
                  <div className="flex items-center justify-between">
                    <div className="flex gap-1">
                      <button type="button" disabled={index === 0} onClick={() => moveGallery(index, -1)} className="p-1.5 rounded-md text-[#5C6E61] hover:bg-[#ECE6DC] disabled:opacity-30" aria-label="Левее">
                        <ArrowLeft className="w-4 h-4" />
                      </button>
                      <button type="button" disabled={index === images.gallery.length - 1} onClick={() => moveGallery(index, 1)} className="p-1.5 rounded-md text-[#5C6E61] hover:bg-[#ECE6DC] disabled:opacity-30" aria-label="Правее">
                        <ArrowRight className="w-4 h-4" />
                      </button>
                    </div>
                    <button
                      type="button"
                      onClick={() => updateGallery(images.gallery.filter((_, i) => i !== index))}
                      className="inline-flex items-center gap-1 px-2 py-1.5 rounded-md text-xs font-semibold text-[#A34236] hover:bg-[#FBEAE7]"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                      Убрать
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
