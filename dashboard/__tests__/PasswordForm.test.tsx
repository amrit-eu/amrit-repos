import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import PasswordForm from '@/components/modules/settings/PasswordForm';

// ---- Mocks ----

// Mock the gateway client
const gatewayFetchViaProxy = jest.fn();
jest.mock('@/lib/gateway/gatewayFetchViaProxy.client', () => ({
  gatewayFetchViaProxy: (...args: any[]) => gatewayFetchViaProxy(...args),
}));

// Mock strongEnough so we can toggle its behavior per test
const strongEnough = jest.fn(() => true);
jest.mock('@/lib/auth/passwordRules', () => ({
  strongEnough: (...args: any[]) => strongEnough(...args),
}));

// Mock normalizeErrorMessage for predictable error text
const normalizeErrorMessage = jest.fn((e: any) => (e?.message ? e.message : 'Oops'));
jest.mock('@/lib/utils/normalizeErrorMessage', () => ({
  normalizeErrorMessage: (...args: any[]) => normalizeErrorMessage(...args),
}));

// Simplify PasswordField to a basic input so tests are stable
jest.mock('@/components/shared/inputs/PasswordField', () => ({
  __esModule: true,
  default: ({ label, value, onChange, disabled }: any) => (
    <label>
      <span>{label}</span>
      <input aria-label={label} value={value} onChange={onChange} disabled={disabled} />
    </label>
  ),
}));

// SnackbarAlert renders children text already — no need to mock,
// we’ll assert on the snackbar messages directly.

function setup() {
  render(<PasswordForm />);
  const current = screen.getByLabelText(/^Current password$/i);
  const next = screen.getByLabelText(/^New password$/i);            // ← anchor it
  const confirm = screen.getByLabelText(/^Confirm new password$/i); // ← anchor it
  const submit = screen.getByRole('button', { name: /change password/i });
  const clear = screen.getByRole('button', { name: /clear/i });
  return { current, next, confirm, submit, clear };
}


describe('PasswordForm', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  test('submit is disabled until valid', async () => {
    const { current, next, confirm, submit } = setup();

    expect(submit).toBeDisabled();

    await userEvent.type(current, 'oldpass');
    await userEvent.type(next, 'short'); // < 12 chars
    await userEvent.type(confirm, 'short');
    expect(submit).toBeDisabled();

    // meet length + match; strongEnough mocked to true by default
    await userEvent.clear(next);
    await userEvent.type(next, 'VeryStrong#123'); // 14 chars
    await userEvent.clear(confirm);
    await userEvent.type(confirm, 'VeryStrong#123');
    expect(submit).toBeEnabled();
  });

  test('length < 12 keeps submit disabled and does not call API', async () => {
    const { current, next, confirm, submit } = setup();

    await userEvent.type(current, 'oldpass');
    await userEvent.type(next, 'TooShort1!');   // < 12
    await userEvent.type(confirm, 'TooShort1!');

    expect(submit).toBeDisabled();
    expect(gatewayFetchViaProxy).not.toHaveBeenCalled();
    });

  test('weak password shows error snackbar and does not call API', async () => {
    strongEnough.mockReturnValueOnce(false);

    const { current, next, confirm, submit } = setup();

    await userEvent.type(current, 'oldpass');
    await userEvent.type(next, 'Longbutweakpassword'); // >=12 but no symbol/digit caps etc.
    await userEvent.type(confirm, 'Longbutweakpassword');

    await userEvent.click(submit);

    expect(gatewayFetchViaProxy).not.toHaveBeenCalled();
    await screen.findByText(/include upper, lower, digit and symbol/i);
  });

  test('mismatched confirmation keeps submit disabled and does not call API', async () => {
    const { current, next, confirm, submit } = setup();

    await userEvent.type(current, 'oldpass');
    await userEvent.type(next, 'StrongPass#1234');
    await userEvent.type(confirm, 'StrongPass#123X'); // mismatch

    expect(submit).toBeDisabled();
    expect(gatewayFetchViaProxy).not.toHaveBeenCalled();
    });

  test('success path: posts to API, clears fields, shows success', async () => {
    gatewayFetchViaProxy.mockResolvedValueOnce({}); // 204 or ok
    const { current, next, confirm, submit } = setup();

    await userEvent.type(current, 'oldpass');
    await userEvent.type(next, 'StrongPass#1234');
    await userEvent.type(confirm, 'StrongPass#1234');

    await userEvent.click(submit);

    await waitFor(() => {
      expect(gatewayFetchViaProxy).toHaveBeenCalledWith(
        'POST',
        '/oceanops/auth/change-password',
        { old: 'oldpass', newPass: 'StrongPass#1234', confirm: 'StrongPass#1234' }
      );
    });

    // fields are cleared
    await waitFor(() => {
      expect((current as HTMLInputElement).value).toBe('');
      expect((next as HTMLInputElement).value).toBe('');
      expect((confirm as HTMLInputElement).value).toBe('');
    });

    // success snackbar
    await screen.findByText(/password changed/i);
  });

  test('API error: shows normalized error and re-enables submit', async () => {
    gatewayFetchViaProxy.mockRejectedValueOnce(new Error('Boom'));
    const { current, next, confirm, submit } = setup();

    await userEvent.type(current, 'oldpass');
    await userEvent.type(next, 'StrongPass#1234');
    await userEvent.type(confirm, 'StrongPass#1234');

    await userEvent.click(submit);

    await waitFor(() => {
      expect(gatewayFetchViaProxy).toHaveBeenCalled();
    });

    // normalized error is shown
    await screen.findByText(/boom/i);

    // submit should be enabled again after busy=false
    await waitFor(() => {
      expect(submit).toBeEnabled();
    });
  });
});
