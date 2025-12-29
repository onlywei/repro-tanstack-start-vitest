import { render, screen } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import { App } from './App';

describe('App', () => {
  it('renders the app component', () => {
    render(<App />);
    expect(screen.getByText('TanStack Start + Vitest Bug Reproduction')).toBeInTheDocument();
  });

  it('renders the button from workspace package', () => {
    render(<App />);
    expect(screen.getByRole('button', { name: /test button/i })).toBeInTheDocument();
  });
});

