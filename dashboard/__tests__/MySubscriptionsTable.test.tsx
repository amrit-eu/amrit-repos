import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

// SUT
import MySubscriptionsTable from '@/components/modules/subscriptions/MySubscriptionsTable';
import type { AlertSubscription } from '@/types/alert-subscription';
// ---- Mocks ----
const makeSub = (overrides: Partial<AlertSubscription> = {}): AlertSubscription => ({
  id: 1,
  contactId: 1000360,

  sendEmail: true, // or null, but must NOT be undefined

  topicId: 1,
  topicName: 'Topic A',

  minSeverityId: null,

  countryId: null,
  countryName: null,

  basinId: null,
  basinName: null,

  wigosId: null,
  event: null,
  resource: null,

  minTime: null,
  maxTime: null,

  ...overrides,
});


// Mock gateway client: we’ll assert calls + return updatedRow fragments
const gatewayFetchViaProxy = jest.fn();
jest.mock('@/lib/gateway/gatewayFetchViaProxy.client', () => ({
  gatewayFetchViaProxy: (...args: any[]) => gatewayFetchViaProxy(...args),
}));

// Mock dayjs to avoid utc plugin dependency. We make formatting deterministic.
jest.mock('dayjs', () => {
  return (input?: string) => ({
    utc: () => ({
      format: (_fmt: string) => `UTC(${input ?? ''})`,
    }),
  });
});

// Capture latest props passed to EditableTable by rendering JSON to the DOM
let latestEditableProps: any = null;
jest.mock(
  '@/components/shared/tables/editableTable/EditableTable',
  () => ({
    __esModule: true,
    default: (props: any) => {
      latestEditableProps = props;
      // Expose controls to drive callbacks from tests
      return (
        <div>
          <div data-testid="editable-data">
            {JSON.stringify(props.data)}
          </div>
          <button
            onClick={() =>
              props.onToggleSwitch?.('1', 'sendEmail', false)
            }
          >
            toggle-sendEmail
          </button>
          <button
            onClick={() =>
              props.onUpdateField?.('1', 'topicId', 99)
            }
          >
            update-topic
          </button>
          <button
            onClick={() => props.onOpenAddFilter?.('1')}
          >
            open-add-filter
          </button>
          <button
            onClick={() => props.onDeleteRow?.('1')}
          >
            delete-row
          </button>
        </div>
      );
    },
  }),
);

// Mock AddFilterModal: when open, render buttons to confirm with payloads
let addFilterConfirm: ((type: string, value: any) => void) | null = null;
jest.mock('@/components/modules/subscriptions/AddFilterModal', () => ({
  __esModule: true,
  default: (p: any) => {
    addFilterConfirm = p.onConfirm;
    return p.open ? (
      <div>
        <button
          onClick={() =>
            p.onConfirm('countryName', { id: 123, name: 'France' })
          }
        >
          confirm-country
        </button>
        <button
          onClick={() =>
            p.onConfirm('timeRange', { minTime: '2025-01-01', maxTime: '2025-01-02' })
          }
        >
          confirm-timeRange
        </button>
      </div>
    ) : null;
  },
}));

// ---- Helpers ----
function renderSut(
  overrides?: Partial<AlertSubscription>,
  handlers?: { onDelete?: (id: string) => void }
) {
  const row = makeSub(overrides ?? {});
  const onDelete = handlers?.onDelete ?? jest.fn();

  return render(
    <MySubscriptionsTable
      data={[row]}
      loading={false}
      onDelete={onDelete}
    />
  );
}

// ---- Tests ----
describe('MySubscriptionsTable', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  test('toggles boolean -> PATCH and updates UI', async () => {
    // server returns partial updated row
    gatewayFetchViaProxy.mockResolvedValueOnce({ sendEmail: false });

    renderSut();

    // sanity: initial state in mocked table
    const dataEl = await screen.findByTestId('editable-data');
    expect(JSON.parse(dataEl.textContent || '[]')[0].sendEmail).toBe(true);

    // drive toggle via mocked EditableTable control
    await userEvent.click(screen.getByText('toggle-sendEmail'));

    await waitFor(() => {
      expect(gatewayFetchViaProxy).toHaveBeenCalledWith(
        'PATCH',
        '/oceanops/alerts/subscriptions/1',
        { sendEmail: false }
      );
    });

    // updated state should flow back into EditableTable props
    await waitFor(() => {
      const updated = JSON.parse(
        screen.getByTestId('editable-data').textContent || '[]'
      )[0];
      expect(updated.sendEmail).toBe(false);
    });
  });

  test('update field -> PATCH and updates UI', async () => {
    gatewayFetchViaProxy.mockResolvedValueOnce({ topicId: 99 });

    renderSut();

    await userEvent.click(screen.getByText('update-topic'));

    await waitFor(() => {
      expect(gatewayFetchViaProxy).toHaveBeenCalledWith(
        'PATCH',
        '/oceanops/alerts/subscriptions/1',
        { topicId: 99 }
      );
    });

    await waitFor(() => {
      const updated = JSON.parse(
        screen.getByTestId('editable-data').textContent || '[]'
      )[0];
      expect(updated.topicId).toBe(99);
    });
  });

  test('add filter (countryName) -> PATCH { countryId } and updates row', async () => {
    gatewayFetchViaProxy.mockResolvedValueOnce({ countryId: 123 });

    renderSut();

    // open modal through the mocked table control
    await userEvent.click(screen.getByText('open-add-filter'));

    // confirm country in mocked modal
    await userEvent.click(screen.getByText('confirm-country'));

    await waitFor(() => {
      expect(gatewayFetchViaProxy).toHaveBeenCalledWith(
        'PATCH',
        '/oceanops/alerts/subscriptions/1',
        { countryId: 123 }
      );
    });
  });

  test('add filter (timeRange) -> PATCH with formatted min/max time', async () => {
    gatewayFetchViaProxy.mockResolvedValueOnce({ minTime: 'x', maxTime: 'y' });

    renderSut();
    await userEvent.click(screen.getByText('open-add-filter'));
    await userEvent.click(screen.getByText('confirm-timeRange'));

    await waitFor(() => {
      expect(gatewayFetchViaProxy).toHaveBeenCalledWith(
        'PATCH',
        '/oceanops/alerts/subscriptions/1',
        {
          // From our mocked dayjs: UTC(<input>)
          minTime: 'UTC(2025-01-01)',
          maxTime: 'UTC(2025-01-02)',
        }
      );
    });
  });

  test('delete is delegated to onDelete prop', async () => {
    const onDelete = jest.fn();
    renderSut({}, { onDelete });

    await userEvent.click(screen.getByText('delete-row'));

    expect(onDelete).toHaveBeenCalledWith('1');
  });
});
