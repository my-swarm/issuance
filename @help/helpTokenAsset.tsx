import React from 'react';

export const nav = {
  title: 'Net Asset Value (USD)',
  content: (
    <div>
      <p>
        For an <strong>asset backed token</strong>, provide the asset&apos;s NET value in USD. The stake amount is
        computed based on it.
      </p>
      <p>
        If you plan to <strong>run a fundraiser</strong>, it&apos;s irrelevant and you can keep it blank. The stake will
        be computed based on the USD amount raised.
      </p>
    </div>
  ),
};
export const assetNavDocument = {
  title: 'NAV Supporting Document',
  content: (
    <div>
      <p>
        Please provide evidence of your asset&apos;s NAV by uploading a document, a link to a document or a detailed
        text explanation.
      </p>
      <p>
        This is only relevant for tokens backed by an existing asset. If you plan to raise funds first, ignore this.
      </p>
    </div>
  ),
};

export const assetDescription = {
  title: 'Asset Description',
  content: (
    <div>
      <p>Please describe your asset in plain english.</p>
    </div>
  ),
};
