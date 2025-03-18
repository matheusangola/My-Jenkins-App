import { render, screen } from '@testing-library/react';
import App from './App';

test('renders learn', () => {
  render(<App />);
  const linkElement = screen.getByText(/My Jenkins App/i);
  expect(linkElement).toBeInTheDocument();
});
