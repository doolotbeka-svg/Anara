import React, { useRef, useState } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { GalleryPhoto } from '../content/merge';
import { t } from '../content/store';

interface PhotoSliderProps {
  photos: GalleryPhoto[];
  alt: string;
  className?: string;
}

/** Swipeable photo slides (native scroll-snap), with arrows and dots. */
export const PhotoSlider: React.FC<PhotoSliderProps> = ({ photos, alt, className = '' }) => {
  const trackRef = useRef<HTMLDivElement>(null);
  const [index, setIndex] = useState(0);

  const goTo = (i: number) => {
    const track = trackRef.current;
    if (!track) return;
    track.scrollTo({ left: i * track.clientWidth, behavior: 'smooth' });
  };

  const onScroll = () => {
    const track = trackRef.current;
    if (track) setIndex(Math.round(track.scrollLeft / Math.max(1, track.clientWidth)));
  };

  const many = photos.length > 1;
  const arrow =
    'absolute top-1/2 -translate-y-1/2 w-8 h-8 rounded-full bg-white/85 hover:bg-white text-[#182B1F] shadow-sm flex items-center justify-center transition-opacity disabled:opacity-0';

  return (
    <div className={`relative overflow-hidden bg-[#F2EDE5] ${className}`} aria-roledescription="carousel" aria-label={alt}>
      <div
        ref={trackRef}
        onScroll={onScroll}
        className="flex overflow-x-auto snap-x snap-mandatory [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
      >
        {photos.map((photo, i) => (
          <figure key={photo.url} className="relative w-full shrink-0 snap-center" aria-roledescription="slide" aria-label={`${i + 1} / ${photos.length}`}>
            <img
              src={photo.url}
              alt={photo.caption || alt}
              loading="lazy"
              draggable={false}
              className="w-full aspect-[4/3] object-cover select-none"
            />
            {photo.caption && (
              <figcaption className="absolute inset-x-0 bottom-0 px-3 pt-6 pb-2 text-[11px] text-white bg-gradient-to-t from-black/60 to-transparent">
                {photo.caption}
              </figcaption>
            )}
          </figure>
        ))}
      </div>

      {many && (
        <>
          <button type="button" onClick={() => goTo(index - 1)} disabled={index === 0} className={`${arrow} left-2`} aria-label={t('slider.1', 'Предыдущее фото')}>
            <ChevronLeft className="w-4 h-4" />
          </button>
          <button
            type="button"
            onClick={() => goTo(index + 1)}
            disabled={index >= photos.length - 1}
            className={`${arrow} right-2`}
            aria-label={t('slider.2', 'Следующее фото')}
          >
            <ChevronRight className="w-4 h-4" />
          </button>
          <div className="absolute top-2 inset-x-0 flex justify-center gap-1.5">
            {photos.map((photo, i) => (
              <button
                key={photo.url}
                type="button"
                onClick={() => goTo(i)}
                aria-label={`${t('slider.3', 'Фото')} ${i + 1}`}
                aria-current={i === index}
                className={`h-1.5 rounded-full transition-all ${i === index ? 'w-4 bg-white' : 'w-1.5 bg-white/60'}`}
              />
            ))}
          </div>
        </>
      )}
    </div>
  );
};
