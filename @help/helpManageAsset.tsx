import React from 'react';

export const manageAsset = {
  title: "Edit token's KYA",
  content: (
    <div>
      <p>
        KYA (from &ldquo;Know Your Asset&rdquo;) is a collection of data related to your token or the backing asset,
        that didn&apos;t fit on chain:
      </p>
      <ul>
        <li>Token image and additional description</li>
        <li>Image and description of the underlaying asset</li>
        <li>Various documents related to the asset</li>
      </ul>
      <p>
        You had a chance to enter these information when creating your token, but you can change it here at any time.
      </p>
      <p>The data itself is stored on IPFS and referenced onchain (meaning it&apos;s publicly readable).</p>
    </div>
  ),
};
