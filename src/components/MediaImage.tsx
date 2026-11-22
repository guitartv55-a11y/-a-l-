import React, { useState } from 'react';
import { Factory } from 'lucide-react';
import { MEDIA_ASSETS } from '../data/mediaAssets';
import type { ImageKey } from '../data/presentationData';

interface MediaImageProps {
  imageKey: ImageKey;
  className?: string;
  imgClassName?: string;
  priority?: boolean;
  caption?: string;
  showCaption?: boolean;
}

export const MediaImage: React.FC<MediaImageProps> = ({
  imageKey,
  className = '',
  imgClassName = '',
  priority = false,
  caption,
  showCaption = false,
}) => {
  const [hasError, setHasError] = useState(false);
  const asset = MEDIA_ASSETS[imageKey];
  const displayCaption = caption ?? asset.caption;

  return (
    <div className={`relative overflow-hidden bg-slate-200/70 ${className}`}>
      {!hasError ? (
        <img
          src={asset.src}
          alt={asset.alt}
          referrerPolicy="no-referrer"
          loading={priority ? 'eager' : 'lazy'}
          decoding="async"
          onError={() => setHasError(true)}
          className={`h-full w-full object-cover ${imgClassName}`}
        />
      ) : (
        <div className="flex h-full w-full flex-col items-center justify-center gap-2 bg-gradient-to-br from-slate-100 to-slate-200 p-4 text-center text-slate-600">
          <Factory className="h-7 w-7 text-[#0D7A7E]" aria-hidden="true" />
          <span className="text-xs font-medium">{displayCaption}</span>
        </div>
      )}

      {showCaption && (
        <div className="pointer-events-none absolute inset-x-0 bottom-0 bg-gradient-to-t from-[#0B1D36]/90 via-[#0B1D36]/45 to-transparent px-1.5 pb-1 pt-4 sm:px-3 sm:pb-2 sm:pt-6">
          <p className="line-clamp-2 text-[9.5px] font-medium leading-tight tracking-normal text-white/95 sm:text-xs sm:tracking-wide">
            {displayCaption}
          </p>
        </div>
      )}
    </div>
  );
};
