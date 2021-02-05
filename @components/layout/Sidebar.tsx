import React, { ReactElement } from 'react';
import { Logo, MainMenu, MetamaskStatus, StateStorageSync, ThemeSwitcher } from '@components';
import { Divider } from 'antd';
import { SidebarContacts } from './SidebarContacts';

interface Props {
  fullUi?: boolean;
}

export function Sidebar({ fullUi = false }: Props): ReactElement {
  return (
    <>
      {fullUi && <Logo linkHome />}
      <MainMenu />
      <Divider />
      <div className="side-box mt-4">
        <MetamaskStatus />
      </div>
      <div className="side-box mt-3">
        <StateStorageSync />
      </div>
      <div className="side-box mt-3">
        <SidebarContacts />
      </div>
      <div className="side-box mt-3">
        <ThemeSwitcher />
      </div>
    </>
  );
}
