import React from 'react';

interface LogoProps {}

export function Logo({}: LogoProps) {
  return (
    <div className="c-logo">
      <img src="/images/logo.svg" alt="Logo" />
    </div>
  );
}
