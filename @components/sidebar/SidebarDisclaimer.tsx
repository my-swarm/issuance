import React, { ReactElement } from 'react';
import { Alert } from 'antd';
import Link from 'next/link';

export function SidebarDisclaimer(): ReactElement {
  return (
    <Link href="/beta">
      <a className="c-sidebar-disclaimer">
        <Alert message="Beta" description="See more info on app status" showIcon type="warning" />
      </a>
    </Link>
  );
}
