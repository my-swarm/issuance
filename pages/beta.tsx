import React from 'react';
import { DefaultLayout } from '@components';
import { Alert, Typography } from 'antd';

const { Title } = Typography;

interface AboutProps {
  title?: string;
}

export default function PageBeta({ title }: AboutProps) {
  return (
    <DefaultLayout title="Beta">
      <p>
        This app is in Beta status. It has not been extensively tested. If you see something weird (even numbers that
        don't add up) it doesn't necessarily mean something is broken per se. The app has three layers:
      </p>
      <ul>
        <li>
          <strong>
            <a href="https://github.com/my-swarm/contracts" target="_blank" rel="noopener noreferrer">
              Ethereum chain and Smart Contracts
            </a>
          </strong>{' '}
          actually hold all persistent information (with some justified exceptions*). All data manipulation is
          on-chain..
        </li>
        <li>
          <strong>
            <a href="https://github.com/my-swarm/subgraph" target="_blank" rel="noopener noreferrer">
              Subgraph
            </a>
          </strong>{' '}
          is for on-chain data modelling, indexing and querying. Subgraph is a function of the ethereum blockchain
          state. It can have bugs, but those don&apos;t affect the actual on-chain data and can be fixed.
        </li>
        <li>
          <strong>
            <a href="https://github.com/my-swarm/issuance" target="_blank" rel="noopener noreferrer">
              Frontend
            </a>
          </strong>{' '}
          for presenting data and interaction to the user. Data is taken mainly from the subgraph and in some special
          cases directly from chain.
        </li>
      </ul>
      <p>Data interaction is one-way. If you trigger any kind of data update from the UI, it goes like this:</p>
      <ol>
        <li>Transaction is sent to a smart contract,</li>
        <li>blockchain state gets updated through a newly mined block,</li>
        <li>subgraph picks the new block and updates the derived data accordingly,</li>
        <li>the UI is updated with the new data.</li>
      </ol>
      <p>
        When data doesn&apos;t seem to be up to date even after the transaction is confirmed, a simple page refresh
        usually helps. Please keep in mind that mainnet can be slow, transaction confirmation times depend on gas price
        supplied and can stay unconfirmed altogether.
      </p>
      <p>
        *{' '}
        <small>
          The exceptions are KYA ("Know Your Asset" - token and asset metadata; stored on ipfs and linked from smart
          contract) and your{' '}
          <strong>
            newly created tokens <em>prior their deployment</em> (stored locally in your browser)
          </strong>
          .
        </small>
      </p>
      <Title level={3}>Smart Contracts</Title>
      <p>
        <strong>
          The <a href="https://github.com/my-swarm/contracts">Smart Contracts</a> got the highest amount of care. They
          have been extensively tested, including over 130 unit tests.
        </strong>
      </p>
      <p>
        Contracts have been <a href="https://github.com/my-swarm/contracts/tree/master/audits">audited</a> with another
        audit coming soon.
      </p>
      <Alert
        type="warning"
        showIcon
        message="Use at your own risk"
        description="No amount of care can 100% rule out security exploits in the future."
      />
    </DefaultLayout>
  );
}
