import { render, screen } from '@testing-library/react';
import App from './App';

test('renders learn', () => {
  render(<App />);
  const linkElement = screen.getByText(/Matheus Alves/i);
  expect(linkElement).toBeInTheDocument();
});
