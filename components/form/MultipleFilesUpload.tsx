import React, { useState, useEffect } from 'react';
import { Upload } from 'antd';
import { UploadDraggerContent } from '@components';
import { FORM } from '@const';
import { UploadFile, UploadChangeParam } from 'antd/lib/upload/interface';
import { AppFile } from '@types';
import { convertFileToUpload, convertUploadToFile } from '@lib';

interface DocumentsUploadProps {
  value?: AppFile[];
  onChange?: (value: AppFile[]) => void;
}

export function MultipleFilesUpload({ value, onChange }: DocumentsUploadProps): React.ReactElement {
  const [fileList, setFileList] = useState<UploadFile[]>();

  const hint = `You can upload multiple documents. All common types are accepted. Maximum file size: ${FORM.maxDocumentSize}`;

  useEffect(() => {
    if (value) {
      console.log('use effect', value);
      Promise.all(value.map((file) => convertFileToUpload(file))).then((files) => {
        console.log('converted', files);
        setFileList(files);
      });
    }
  }, [value]);

  const handleChange = async (info: UploadChangeParam) => {
    setFileList(info.fileList);
    if (onChange) {
      console.log('onchange', info.fileList);
      Promise.all(info.fileList.map(convertUploadToFile)).then((files) => {
        console.log('changed', files);
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
