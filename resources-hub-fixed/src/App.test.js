import { render, screen } from '@testing-library/react';
import App from './App';

test('renders Resources Hub header', () => {
  render(<App />);
  const headerElement = screen.getByText(/Resources Hub/i);
  expect(headerElement).toBeInTheDocument();
});

test('renders upload project button', () => {
  render(<App />);
  const uploadButton = screen.getByText(/Upload Project/i);
  expect(uploadButton).toBeInTheDocument();
});

test('renders search input', () => {
  render(<App />);
  const searchInput = screen.getByPlaceholderText(/Search projects.../i);
  expect(searchInput).toBeInTheDocument();
});
