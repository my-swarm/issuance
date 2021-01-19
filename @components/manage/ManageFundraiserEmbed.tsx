import React, { ReactElement } from 'react';
import { Form, Input } from 'antd';
import { FundraiserWithContributorsFragment } from '@graphql';

interface ManageFundraiserStateProps {
  fundraiser: FundraiserWithContributorsFragment;
}

export function ManageFundraiserEmbed({ fundraiser }: ManageFundraiserStateProps): ReactElement {
  const url = new URL(window.location.href);
  const src = `${url.protocol}//${url.hostname}/widgets/fundraiser/?address=${fundraiser.address}`;
  const embedCode = `<iframe src="${src}" width="440" height="490"></iframe>`;
  return (
    <div>
      <Form layout="vertical">
        <Form.Item label="Copy & paste the following code">
          <Input.TextArea value={embedCode} />
        </Form.Item>
      </Form>
    </div>
  );
}
