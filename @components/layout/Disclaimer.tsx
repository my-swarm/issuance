import React, { ReactElement } from 'react';

export function Disclaimer(): ReactElement {
  return (
    <>
      <div className="c-disclaimer">
        <div className="c-disclaimer-divider my-3" />
        <p>
          <a href="https://myswarm.app">MySwarm</a> is not a registered broker-dealer. MySwarm does not give investment
          advice, endorsement, analysis or recommendations with respect to any digital securities, STO&apos;s or other
          investment vehicles created through MySwarm technology. All digital securities powered by MySwarm’s technology
          are offered by, and all information related thereto is the responsibility of, the applicable issuer of such
          digital securities. MySwarm does not vet, approve or endorse any security tokens or fundraising events
          created, listed or transacted with on this site or any affiliated sites. Scrutiny and due diligence of any
          offerings listed here are the responsibility entirely of the users and contributors to any offerings created
          on MySwarm.
        </p>
        <p>
          Neither MySwarm, Swarm Network (<a href="https://swarmnetwork.org">swarmnetwork.org</a>) nor any of its
          council members, officers, directors, agents, employees makes any recommendation or endorsement whatsoever
          regarding any digital securities powered by MySwarm or SWARM technology. Nothing on this website should be
          construed as an offer, distribution or solicitation of any digital securities. MySwarm does not provide
          custodial services in connection with any digital securities powered by MySwarm or Swarm Networks technology
        </p>
      </div>
    </>
  );
}
