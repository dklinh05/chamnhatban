import type { ReactNode } from 'react';

export const designTokens = {
  color: {
    background: 'var(--color-background)',
    surface: 'var(--color-surface)',
    text: 'var(--color-text)',
    muted: 'var(--color-muted)',
    border: 'var(--color-border)',
    accent: 'var(--color-accent)',
  },
  radius: {
    sm: '4px',
    md: '8px',
  },
  space: {
    1: '4px',
    2: '8px',
    3: '12px',
    4: '16px',
    6: '24px',
    8: '32px',
  },
} as const;

export type HeadingLevel = 1 | 2 | 3 | 4 | 5 | 6;

export type HeadingProps = {
  children: ReactNode;
  level?: HeadingLevel;
};

export function Heading({ children, level = 1 }: HeadingProps) {
  const Tag = `h${level}` as const;

  return <Tag>{children}</Tag>;
}
