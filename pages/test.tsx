import React, { useState } from 'react';
import { Button, Space } from 'antd';
import { DefaultLayout } from '@components';
import { apiUrl, useAppState } from '@app';
import { tokenToKya, Api } from '@lib';

export default function TestPage() {
  const [{ tokens }] = useAppState();
  const [imageSrc, setImageSrc] = useState<string>();
  const [fileContent, setFileContent] = useState<string>();
  const [fileContentRaw, setFileContentRaw] = useState<string>();
  const token = tokens[0];
  const cid = 'QmWZzX6BgD878piQM9mCse8MfAFLmb6q1K1g3QGW9SFGuj';
  const api = new Api(apiUrl);

  const handlePutKya = async (token) => {
    const kya = tokenToKya(token);
    const cid = await api.putKya(kya);
    alert('saved: ' + cid);
  };

  const handleGetKya = async (cid) => {
    const kya = await api.getKya(cid);
    setImageSrc(kya.token.image.content);
    const c = kya.asset.navDocument.content;
    setFileContent(fileContent);
    fetch(c)
      .then((response) => response.arrayBuffer())
      .then((bf) => {
        const td = new TextDecoder('utf-8');
        setFileContentRaw(td.decode(bf));
      });
  };

  console.log({ token });

  return (
    <DefaultLayout title="Test page">
      <Space>
        <Button onClick={() => handlePutKya(token)}>Save KYA</Button>
        <Button onClick={() => handleGetKya(cid)}>Read KYA</Button>
      </Space>

      <hr />

      {imageSrc && (
        <div>
          <img src={imageSrc} />
        </div>
      )}
      {fileContent && <div>{fileContent}</div>}
      {fileContentRaw && <div>{fileContentRaw}</div>}
    </DefaultLayout>
  );
}
