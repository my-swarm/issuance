import React, { ReactElement, useEffect, useState } from 'react';
import { Upload } from 'antd';
import { UploadChangeParam, UploadFile } from 'antd/es/upload/interface';

import { AppFile, convertFileToUpload, convertUploadToFile } from '@lib';
import { FORM } from '@app';
import { UploadDraggerContent } from '@components';

interface DocumentsUploadProps {
  value?: AppFile[];
  onChange?: (value: AppFile[]) => void;
}

export function MultipleFilesUpload({ value, onChange }: DocumentsUploadProps): ReactElement {
  const [fileList, setFileList] = useState<UploadFile[]>([]);

  const hint = `You can upload multiple documents. All common types are accepted. Maximum file size: ${FORM.maxDocumentSize}`;

  useEffect(() => {
    if (value) {
      Promise.all(value.map((file) => convertFileToUpload(file))).then((files) => {
        setFileList(files);
      });
    }
  }, [value]);

  const handleChange = async (info: UploadChangeParam) => {
    setFileList(info.fileList);
    if (onChange) {
      Promise.all(info.fileList.map(convertUploadToFile)).then((files) => {
        onChange(files);
      });
    }
  };

  return (
    <Upload.Dragger
      accept={FORM.acceptDocument}
      listType="text"
      fileList={fileList}
      beforeUpload={() => false}
      multiple={true}
      onChange={handleChange}
    >
      <UploadDraggerContent hint={hint} />
    </Upload.Dragger>
  );
}
