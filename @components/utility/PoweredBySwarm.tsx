import React, { ReactElement } from 'react';
import { Space } from 'antd';

export function PoweredBySwarm(): ReactElement {
  const url = new URL(window.location.href);
  return (
    <a className="c-powered-by-swarm" href={`//${url.host}`} target="_blank" rel="noreferrer noopener">
      <Space>
        <div>
          <span>Powered by</span>
          <br />
          <strong>Swarm</strong>
        </div>
        <img src="/images/swarm-symbol.svg" alt="Swarm symbol" />
      </Space>
    </a>
  );
}
