import React, { ReactElement } from 'react';
import { Token } from '@types';
import { Collapse } from 'antd';
import { ManageTransfer } from '../manage';

interface TokenManageFundraiserProps {
  token: Token;
}

export function TokenManageFundraiser({ token }: TokenManageFundraiserProps): ReactElement {
  return (
    <div>
      <Collapse defaultActiveKey={[]}>
        <Collapse.Panel header="Status control" key="1">
          <ManageTransfer token={token} />
        </Collapse.Panel>
      </Collapse>
    </div>
  );
}
