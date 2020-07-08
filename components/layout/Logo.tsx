import React from 'react';

interface LogoProps {}

export function Logo({}: LogoProps) {
  return (
    <div className="logo">
      <img src="/logo.svg" alt="Logo" />
    </div>
  );
}
