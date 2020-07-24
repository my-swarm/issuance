import { AppFile } from '../types';
import { UploadFile } from 'antd/lib/upload/interface';

export async function convertFileToUpload(file: AppFile): Promise<UploadFile> {
  const { id, name, size, thumbUrl, type, content } = file;
  return {
    uid: id,
    name,
    size,
    thumbUrl,
    type,
    originFileObj: await convertdataUriToBlob(content),
  };
}

export async function convertUploadToFile(uploadFile: UploadFile): Promise<AppFile> {
  const { uid, name, size, thumbUrl, type, originFileObj } = uploadFile;

  return {
    id: uid,
    name,
    size,
    thumbUrl,
    type,
    content: await convertFileObjectToDataUri(originFileObj as Blob),
  };
}

export async function convertdataUriToBlob(dataUri: string): Promise<Blob> {
  const response = await fetch(dataUri);
  return await response.blob();
}

export async function convertFileObjectToDataUri(fileObj: Blob) {
  const reader = new FileReader();
  return new Promise<string>((resolve) => {
    reader.onload = (e) => {
      if (e.target && e.target.result) {
        resolve(e.target.result);
      }
    };
    reader.readAsDataURL(fileObj);
  });
}
