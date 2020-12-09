import React, { ReactElement } from 'react';
import { DownloadOutlined } from '@ant-design/icons';
import { AppFile } from '@lib';

interface FilePreviewProps {
  image: AppFile;
}

export function ImagePreview({ image }: FilePreviewProps): ReactElement {
  if (!image) {
    return <span>-</span>;
  }

  return <div className="image-preview">{image?.content ? <img src={image.content} alt="Asset" /> : '-'}</div>;
}
