import React, { ReactElement } from 'react';
import { Collapse } from 'antd';

export function TokenManageFundraiser(): ReactElement {
  return (
    <div>
      <Collapse defaultActiveKey={[]}>
        <Collapse.Panel header="Status control" key="1">
          cancel fundraiser
        </Collapse.Panel>
      </Collapse>
    </div>
  );
}
