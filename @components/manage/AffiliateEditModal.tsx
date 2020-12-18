import React, { ReactElement } from 'react';
import { Form, Input, InputNumber, Modal } from 'antd';

import { AffiliateFragment } from '@graphql';

interface TransferModalProps {
  affiliate: AffiliateFragment;
  onClose: () => void;
  onSubmit: (values: AffiliateFragment) => void;
}

export function AffiliateEditModal({ affiliate, onClose, onSubmit }: TransferModalProps): ReactElement {
  const [form] = Form.useForm();

  const handleOk = () => {
    form.submit();
  };

  return (
    <Modal
      visible={true}
      title={affiliate ? 'Update affiliate' : 'Create affiliate'}
      maskClosable={false}
      onCancel={onClose}
      onOk={handleOk}
    >
      <Form
        form={form}
        onFinish={onSubmit}
        layout="horizontal"
        labelCol={{ span: 6 }}
        wrapperCol={{ span: 14 }}
        initialValues={affiliate}
      >
        <Form.Item name="address" label="Address">
          <Input readOnly={affiliate != null} />
        </Form.Item>
        <Form.Item name="referral" label="Referral code">
          <Input readOnly={affiliate != null} />
        </Form.Item>
        <Form.Item name="percentage" label="Percentage">
          <InputNumber precision={4} min={0.0001} max={10} step={0.1} />
        </Form.Item>
      </Form>
    </Modal>
  );
}
