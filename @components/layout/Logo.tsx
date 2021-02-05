import React, { ReactElement } from 'react';
import Link from 'next/link';

interface LogoProps {
  linkHome?: boolean;
}

export function Logo({ linkHome = false }: LogoProps): ReactElement {
  let logo = <img src="/images/logo.svg" alt="Logo" />;
  if (linkHome) {
    logo = (
      <Link href="/">
        <a>{logo}</a>
      </Link>
    );
  }
  return <div className="c-logo">{logo}</div>;
}
