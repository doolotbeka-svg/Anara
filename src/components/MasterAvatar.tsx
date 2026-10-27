import React from 'react';
import { getImages } from '../content/store';
import { MASTER_INFO } from '../data/massageData';

interface MasterAvatarProps {
  /** Classes for the circle: size, background and initials font */
  className: string;
  initials: string;
}

/** Master photo from the admin panel, or the initials circle when no photo is uploaded. */
export const MasterAvatar: React.FC<MasterAvatarProps> = ({ className, initials }) => {
  const photo = getImages().masterPhoto;
  if (photo) {
    return (
      <img
        src={photo}
        alt={MASTER_INFO.name}
        className={`${className} object-cover`}
      />
    );
  }
  return <div className={`${className} flex items-center justify-center`}>{initials}</div>;
};
