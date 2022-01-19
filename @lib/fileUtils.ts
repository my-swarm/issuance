import { UploadFile } from 'antd/es/upload/interface';
import { InvalidStateError } from './errors';

export interface AppFile {
  id: string;
  name: string;
  size: number;
  thumbUrl?: string;
  type: string;
  content: string;
  url?: string;
}

export type AppImage = AppFile;

export async function convertFileToUpload(file: AppFile): Promise<UploadFile> {
  const { id, name, size, thumbUrl, type, content } = file;
  return {
    uid: id,
    name,
    size,
    thumbUrl,
    type,
    originFileObj: (await convertdataUriToBlob(content)) as any,
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
        const { result } = e.target;
        if (typeof result !== 'string') {
          throw new InvalidStateError('event.target.result has to be string');
        }
        resolve(result);
      }
    };
    reader.readAsDataURL(fileObj);
  });
}
