import React, { ReactElement, useEffect, useRef, useState } from 'react';
import { Input } from 'antd';

interface EditableCellProps {
  value: string;
  onChange: (value: string) => void;
}

export function EditableCell({ value, onChange }: EditableCellProps): ReactElement {
  const [editing, setEditing] = useState(false);
  const inputRef = useRef<Input>(null);

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
      <div>
        <Input name="val" defaultValue={value} ref={inputRef} onPressEnter={handleSave} onBlur={handleSave} />
      </div>
    );
  } else {
    return (
      <div className="editable-cell-value-wrap" style={{ paddingRight: 24 }} onClick={() => setEditing(!editing)}>
        {value || '-'}
      </div>
    );
  }
}
