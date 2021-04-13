import { useState } from 'react';

export function useDetailAction<ActionType, RecordType>() {
  const [action, setAction] = useState<ActionType>();
  const [record, setRecord] = useState<RecordType>();

  const handleAction = (newAction: ActionType, record: RecordType) => {
    setRecord(record);
    setAction(newAction);
  };

  const handleClearAction = () => {
    setAction(undefined);
  };

  return { action, record, handleAction, handleClearAction };
}
