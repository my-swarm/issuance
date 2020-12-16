import React, { ReactElement } from 'react';
import { AppFile } from '@lib';

interface FilePreviewProps {
  image: AppFile;
  fitWidth?: boolean;
}

export function ImagePreview({ image, fitWidth = false }: FilePreviewProps): ReactElement {
  if (!image) {
    return <span>-</span>;
  }

  return (
    <div className={`c-image-preview ${fitWidth && 'fit-width'}`}>
      {image?.content ? <img src={image.content} alt="Asset" /> : '-'}
    </div>
  );
}
