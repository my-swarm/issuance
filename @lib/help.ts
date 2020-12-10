import * as help from '@help';
import { ReactNode } from 'react';

type HelpItem = {
  title: string;
  content: ReactNode;
};

export function helpData(name: string): HelpItem {
  return help[name];
}
