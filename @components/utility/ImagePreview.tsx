import React, { ReactElement } from 'react';
import { AppFile } from '@lib';
import { ZoomInOutlined } from '@lib/icons';

interface FilePreviewProps {
  image: AppFile;
  fitWidth?: boolean;
}

export function ImagePreview({ image, fitWidth = false }: FilePreviewProps): ReactElement {
  if (!fitWidth && !image) {
    return <span>-</span>;
  }

  return (
    <>
      <div className={`c-image-preview ${fitWidth && 'fit-width'}`}>
        {image?.content ? <img src={image.content} alt="Asset" /> : <span>no image uploaded</span>}
        {image?.url && (
          <div className="expand">
            <a href={image.url} target="_blank" rel="noopener noreferrer">
              <ZoomInOutlined alt="Open full image" />
            </a>
          </div>
        )}
      </div>
    </>
  );
}
