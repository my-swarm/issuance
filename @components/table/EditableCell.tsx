import React, { useState, useEffect, useRef, ReactElement } from 'react';
import { Input, Form } from 'antd';

interface EditableCellProps {
  value: string;
  onChange: (value: string) => void;
}

export function EditableCell({ value, onChange }: EditableCellProps): ReactElement {
  const [editing, setEditing] = useState(false);
  const inputRef = useRef();

  useEffect(() => {
    if (editing) {
      inputRef.current.focus();
    }
  }, [editing]);

  const handleSave = (e) => {
    onChange(e.target.value);
    setEditing(false);
  };

  if (editing) {
    return (
      <Form.Item style={{ margin: 0 }} name="val">
        <Input ref={inputRef} onPressEnter={handleSave} onBlur={handleSave} />
      </Form.Item>
    );
  } else {
    return (
      <div className="editable-cell-value-wrap" style={{ paddingRight: 24 }} onClick={() => setEditing(!editing)}>
        {value || '-'}
      </div>
    );
  }
}
