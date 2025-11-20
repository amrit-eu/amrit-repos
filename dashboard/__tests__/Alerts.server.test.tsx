import { render, screen } from '@testing-library/react';
import React from 'react';

// SUT
import Alerts from '@/components/modules/alerts/Alerts';

// --- Mocks ---
jest.mock('@/app/_lib/session', () => ({
  verifySession: jest.fn().mockResolvedValue({ user: { id: 'u1', name: 'T' } }),
}));

// Mock the server fetch util to return data based on path
const getFromGatewayMock = jest.fn((path: string) => {
  switch (path) {
    case '/alerta/alerts/count':
      return Promise.resolve({
        severityCounts: { critical: 2, major: 5 },
        statusCounts: { open: 7, closed: 1 },
      });
    case '/data/countries':
      return Promise.resolve({ data: [{ code2: 'US', name: 'United States' }, { code2: 'FR', name: 'France' }] });
    case '/data/topics':
      return Promise.resolve([{ id: 1, label: 'alert_category_A' }]);
    case '/alerta/alerts/events':
      return Promise.resolve({ events: [{ event: 'NodeDown' }, { event: 'CPUHigh' }], status: 'ok', total: 2 });
    case '/alerta/alerts/resources':
      return Promise.resolve({ resources: [{ resource: 'db-01' }, { resource: 'api-42' }], status: 'ok', total: 2 });
    default:
      return Promise.resolve(null);
  }
});
jest.mock('@/lib/gateway/getFromGateway.server', () => ({
  getFromGateway: (path: string) => getFromGatewayMock(path),
}));

// We don’t want to test the country mapping here—just the integration—so stub it.
jest.mock('@/lib/utils/handleCountryAPIJsonResponse', () => ({
  handleCountryAPIJsonResponse: jest.fn((apiJson: any) =>
    (apiJson?.data ?? []).map((c: any) => ({ code2: c.code2, name: c.name }))
  ),
}));

// Capture props passed to AlertsClientWrapper by rendering a small proxy component
const wrapperSpy = jest.fn();
jest.mock('@/components/modules/alerts/AlertsClientWrapper', () => ({
  __esModule: true,
  default: (props: any) => {
    wrapperSpy(props);
    return <div data-testid="wrapper" data-props={JSON.stringify(props)} />;
  },
}));

describe('Alerts server component', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('builds filtersValues from successful fetches and passes session', async () => {
    const element = await Alerts();          // server component returns a React element (async)
    render(element);                         // render the returned element

    const node = screen.getByTestId('wrapper');
    const props = JSON.parse(node.getAttribute('data-props') || '{}');

    expect(props.session).toEqual({ user: { id: 'u1', name: 'T' } });

    // filtersValues assembled correctly
    expect(props.filtersValues).toEqual({
      severity: ['critical', 'major'],
      status: ['open', 'closed'],
      event: ['NodeDown', 'CPUHigh'],
      resource: ['db-01', 'api-42'],
      // countries should be sorted by name (France before United States)
      Country: [{ code2: 'FR', name: 'France' }, { code2: 'US', name: 'United States' }],
      alert_category: [{ id: 1, label: 'alert_category_A' }],
    });

    // wrapper got called once with those props
    expect(wrapperSpy).toHaveBeenCalledTimes(1);
  });

  it('uses safe fallbacks when some fetches reject', async () => {
    // Make counts fail; others succeed
    getFromGatewayMock.mockImplementationOnce((path: string) => {
      if (path === '/alerta/alerts/count') return Promise.reject(new Error('boom'));
      return Promise.resolve({}); // this return is ignored; we’ll rewire proper ones below
    });
    // Rewire subsequent calls (keeping it simple for the demo)
    getFromGatewayMock.mockImplementation((path: string) => {
      switch (path) {
        case '/data/countries':
          return Promise.resolve({ data: [{ code2: 'FR', name: 'France' }] });
        case '/data/topics':
          return Promise.resolve([{ id: 9, label: 'cat' }]);
        case '/alerta/alerts/events':
          return Promise.resolve({ events: [], status: 'ok', total: 0 });
        case '/alerta/alerts/resources':
          return Promise.resolve({ resources: [{ resource: 'only-one' }], status: 'ok', total: 1 });
        default:
          return Promise.resolve(null);
      }
    });

    const element = await Alerts();
    render(element);

    const props = JSON.parse(screen.getByTestId('wrapper').getAttribute('data-props') || '{}');

    // With counts failing, severity/status fall back to empty arrays
    expect(props.filtersValues.severity).toEqual([]);
    expect(props.filtersValues.status).toEqual([]);

    // Events empty -> []
    expect(props.filtersValues.event).toEqual([]);

    // Resources present
    expect(props.filtersValues.resource).toEqual(['only-one']);

    // Countries sorted (single)
    expect(props.filtersValues.Country).toEqual([{ code2: 'FR', name: 'France' }]);

    // Topics present
    expect(props.filtersValues.alert_category).toEqual([{ id: 9, label: 'cat' }]);
  });
});
