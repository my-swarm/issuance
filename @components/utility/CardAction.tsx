import React, { ReactElement } from 'react';
import Link from 'next/link';
import { WrapWhen } from './WrapWhen';

interface CardActionProps {
  href?: string;
  onClick?: () => void;
  icon: ReactElement;
  title: string;
}

export function CardAction({ href, icon, title, onClick }: CardActionProps) {
  const handleClick = () => {
    if (onClick) {
      onClick();
    }
  };

  return (
    <WrapWhen when={href !== undefined} wrapper={(children) => <Link href={href}>{children}</Link>}>
      <a onClick={handleClick}>
        <div>{icon}</div>
        <div>{title}</div>
      </a>
    </WrapWhen>
  );
}
