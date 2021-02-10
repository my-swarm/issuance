import React from 'react';
import Link from 'next/link';

export function Logo() {
  return (
    <div className="c-logo">
      <Link href="/">
        <a>
          <img src="/images/logo.svg" alt="Logo" />
        </a>
      </Link>
    </div>
  );
}
