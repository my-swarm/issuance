import React, { ReactElement } from 'react';
import { Logo, MainMenu, SidebarMetamask, SidebarDataSync } from '@components';
import { Divider } from 'antd';

interface Props {
  fullUi?: boolean;
}

export function Sidebar({ fullUi = false }: Props): ReactElement {
  return (
    <>
      <Logo />
      <MainMenu />
      <Divider />
      <SidebarMetamask />
      <SidebarDataSync />
    </>
  );
}
