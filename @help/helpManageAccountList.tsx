import React from 'react';

export const batchAdd = {
  title: 'Batch add accounts',
  content: (
    <div>
      <p>
        Add one account (Ethereum address) per line. Additional information can be entered in a CSV format with three
        columns: <code>address,name,note</code>.
      </p>
      <h4>Example:</h4>
      <div className="code-sample">
        0x1234567812345678123456781234567812345678, John Smith, my best friend
        <br />
        0x1234567812345678123456781234567812345678, Jane, my wife
      </div>
    </div>
  ),
};
