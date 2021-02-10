import React, { ReactElement } from 'react';
import { Descriptions } from 'antd';
import { formatNumber } from '@lib';
import { FilePreview, ImagePreview, Loading } from '@components';
import { useKya } from '@app';

export function TokenInfoAsset(): ReactElement {
  const { kya, nav } = useKya();
  if (!kya) return <Loading />;

  const { asset } = kya;
  console.log({ kya });

  return (
    <Descriptions
      title="Asset info"
      layout="horizontal"
      bordered
      size="small"
      className="c-token-info mb-3"
      column={1}
      labelStyle={{ width: '30%' }}
    >
      <Descriptions.Item label="Asset name">{asset.name}</Descriptions.Item>
      <Descriptions.Item label="Asset Net Value">{formatNumber(nav)}</Descriptions.Item>
      <Descriptions.Item label="NAV Supporting document">
        <FilePreview file={asset.navDocument} />
      </Descriptions.Item>
      <Descriptions.Item label="Asset Description">{asset.description}</Descriptions.Item>
      <Descriptions.Item label="Asset image">
        <ImagePreview image={asset.image} />
      </Descriptions.Item>
      <Descriptions.Item label="Legal documents">
        {asset.legalDocuments.length
          ? asset.legalDocuments.map((document, key) => <FilePreview file={document} key={key} />)
          : '-'}
      </Descriptions.Item>
    </Descriptions>
  );
}
