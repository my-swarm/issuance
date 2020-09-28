import React, { ReactElement } from 'react';
import { Token, transferRules } from '@types';
import { Descriptions } from 'antd';
import { formatNumber } from '@lib';
import { tokenFeatures } from '@const';
import { FilePreview } from '@components';

export function TokenInfoAsset({ token }: { token: Token }): ReactElement {
  console.log({ token });

  const features = Object.entries(tokenFeatures)
    .filter(([key, value]) => token[key])
    .map(([key, value]) => value);

  return (
    <Descriptions title="Asset info" layout="horizontal" bordered size="small" className="c-token-info mb-3" column={2}>
      <Descriptions.Item label="Asset name">{token.assetName}</Descriptions.Item>
      <Descriptions.Item label="Asset Net Value">{formatNumber(token.assetNetValue)}</Descriptions.Item>
      <Descriptions.Item label="NAV Supporting document">
        <FilePreview file={token.navSupportingDocument} />
      </Descriptions.Item>
      <Descriptions.Item label="Asset Description">{token.assetDescription}</Descriptions.Item>
      <Descriptions.Item label="Asset image">
        <div className="image-preview">
          {token.assetImage?.content ? <img src={token.assetImage.content} alt="Asset" /> : '-'}
        </div>
      </Descriptions.Item>
      <Descriptions.Item label="Legal documents">
        {token.assetLegalDocuments.length
          ? token.assetLegalDocuments.map((document, key) => <FilePreview file={document} key={key} />)
          : '-'}
      </Descriptions.Item>
    </Descriptions>
  );
}
