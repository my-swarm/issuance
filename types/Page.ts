import React from 'react';

export interface PageProps {
  children: React.ReactNode;
  title: string;
  subtitle?: string;
  description?: string;
}
