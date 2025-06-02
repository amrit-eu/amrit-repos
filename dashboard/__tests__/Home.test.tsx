
jest.mock('jose');
import { render, screen } from '@testing-library/react';
import Home from '../src/components/modules/home/Home';


test('renders project description text', () => {
  render(<Home />);
  expect(screen.getByText(/collaborative AMRIT project/i)).toBeInTheDocument();
});
