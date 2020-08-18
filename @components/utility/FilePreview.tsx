import React, { ReactElement } from 'react';
import { DownloadOutlined } from '@ant-design/icons';
import { AppFile } from '@types';

interface FilePreviewProps {
  file: AppFile;
}

export function FilePreview({ file }: FilePreviewProps): ReactElement {
  if (!file) {
    return <span>-</span>;
  }

  return (
    <div className="c-file-preview">
      {file.name} <DownloadOutlined />
    </div>
  );
}
