import React, { ReactNode } from 'react';

export interface PageProps {
  children: ReactNode;
  title: string;
  subtitle?: string;
  description?: string;
}
