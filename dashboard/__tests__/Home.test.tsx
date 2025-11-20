
jest.mock('jose');
import { render, screen } from '@testing-library/react';
import Home from '../src/components/modules/home/Home';


test('renders project description text', () => {
  render(<Home />);
  expect(screen.getByText(/This application is open-source and collaborative./i)).toBeInTheDocument();
});
