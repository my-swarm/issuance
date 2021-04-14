import React, { ReactElement, useEffect, useState } from 'react';
import { Upload } from 'antd';
import { UploadChangeParam, UploadFile } from 'antd/es/upload/interface';

import { AppFile, convertFileToUpload, convertUploadToFile } from '@lib';
import { FORM } from '@app';
import { UploadDraggerContent } from '@components';

interface ImageUploadProps {
  image?: boolean;
  value?: AppFile;
  onChange?: (value: AppFile) => void;
}

export function SingleFileUpload({ image = false, value, onChange }: ImageUploadProps): ReactElement {
  const [fileList, setFileList] = useState<UploadFile[]>([]);

  const hint = image
    ? `Accepted image types: PNG, JPEG. Maximum allowed file size: ${FORM.maxImageSize}`
    : `Common document types are accepted. Maximum allowed file size: ${FORM.maxDocumentSize}`;

  useEffect(() => {
    if (value) {
      convertFileToUpload(value).then((uploadFile: UploadFile) => setFileList([uploadFile]));
    }
  }, [value]);

  const handleChange = async (info: UploadChangeParam) => {
    const [lastFile] = info.fileList.slice(-1);
    if (lastFile) {
      setFileList([lastFile]);
      onChange(await convertUploadToFile(lastFile));
    } else {
      setFileList([]);
      onChange(undefined);
    }
  };

  return (
    <Upload.Dragger
      accept={FORM.acceptImage}
      listType={image ? 'picture' : 'text'}
      fileList={fileList}
      onChange={handleChange}
    >
      <UploadDraggerContent hint={hint} />
    </Upload.Dragger>
  );
}
