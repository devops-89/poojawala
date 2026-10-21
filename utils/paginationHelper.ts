/**
 * Helper to persist and synchronize table pagination (page, rowsPerPage/limit, and optional filters)
 * across browser refreshes using both sessionStorage and URL search parameters.
 */

export interface TablePaginationState {
  page: number;
  rowsPerPage: number;
  status: string;
}

export interface GetPaginationOptions {
  defaultLimit?: number;
  defaultStatus?: string;
  statusKey?: string;
}

export interface SyncPaginationOptions {
  defaultLimit?: number;
  defaultStatus?: string;
  statusKey?: string;
  extraUrlParams?: Record<string, string | null | undefined>;
}

export function getTablePaginationState(
  storageKey: string,
  options?: GetPaginationOptions
): TablePaginationState {
  const defaultLimit = options?.defaultLimit ?? 10;
  const defaultStatus = options?.defaultStatus ?? 'All';
  const statusKey = options?.statusKey ?? 'status';

  if (typeof window === 'undefined') {
    return {
      page: 0,
      rowsPerPage: defaultLimit,
      status: defaultStatus,
    };
  }

  try {
    const params = new URLSearchParams(window.location.search);
    const paramPage = params.get('page');
    const paramLimit = params.get('limit') || params.get('rowsPerPage');
    const paramStatus = params.get(statusKey);

    let savedState: any = null;
    const saved = sessionStorage.getItem(storageKey);
    if (saved) {
      try {
        savedState = JSON.parse(saved);
      } catch (e) {
        // ignore JSON parse error
      }
    }

    // Determine page (URL is 1-indexed; state is 0-indexed for MUI)
    let page = 0;
    if (paramPage) {
      const parsed = parseInt(paramPage, 10);
      if (!isNaN(parsed) && parsed > 0) {
        page = parsed - 1;
      }
    } else if (savedState && typeof savedState.page === 'number') {
      page = Math.max(0, savedState.page);
    }

    // Determine rowsPerPage / limit
    let rowsPerPage = defaultLimit;
    if (paramLimit) {
      const parsed = parseInt(paramLimit, 10);
      if (!isNaN(parsed) && parsed > 0) {
        rowsPerPage = parsed;
      }
    } else if (savedState && typeof savedState.rowsPerPage === 'number' && savedState.rowsPerPage > 0) {
      rowsPerPage = savedState.rowsPerPage;
    } else if (savedState && typeof savedState.limit === 'number' && savedState.limit > 0) {
      rowsPerPage = savedState.limit;
    }

    // Determine status / filter
    let status = defaultStatus;
    if (paramStatus) {
      status = paramStatus;
    } else if (savedState && typeof savedState.status === 'string') {
      status = savedState.status;
    }

    return { page, rowsPerPage, status };
  } catch (err) {
    return {
      page: 0,
      rowsPerPage: defaultLimit,
      status: defaultStatus,
    };
  }
}

export function syncTablePagination(
  storageKey: string,
  state: {
    page: number;
    rowsPerPage: number;
    status?: string;
    [key: string]: any;
  },
  options?: SyncPaginationOptions
) {
  if (typeof window === 'undefined') return;

  try {
    const defaultLimit = options?.defaultLimit ?? 10;
    const defaultStatus = options?.defaultStatus ?? 'All';
    const statusKey = options?.statusKey ?? 'status';

    // 1. Update sessionStorage
    let existing: any = {};
    const saved = sessionStorage.getItem(storageKey);
    if (saved) {
      try {
        existing = JSON.parse(saved);
      } catch (e) {}
    }

    sessionStorage.setItem(
      storageKey,
      JSON.stringify({
        ...existing,
        ...state,
      })
    );

    // 2. Update URL query params without reloading the page
    const params = new URLSearchParams(window.location.search);

    // Page (1-indexed in URL)
    if (state.page > 0) {
      params.set('page', String(state.page + 1));
    } else {
      params.delete('page');
    }

    // Limit / rowsPerPage
    if (state.rowsPerPage && state.rowsPerPage !== defaultLimit) {
      params.set('limit', String(state.rowsPerPage));
    } else {
      params.delete('limit');
      params.delete('rowsPerPage');
    }

    // Status filter
    if (state.status !== undefined) {
      if (state.status && state.status !== defaultStatus) {
        params.set(statusKey, state.status);
      } else {
        params.delete(statusKey);
      }
    }

    // Any extra params
    if (options?.extraUrlParams) {
      Object.entries(options.extraUrlParams).forEach(([k, v]) => {
        if (v === null || v === undefined || v === '' || v === defaultStatus) {
          params.delete(k);
        } else {
          params.set(k, v);
        }
      });
    }

    const queryString = params.toString();
    const newUrl = queryString
      ? `${window.location.pathname}?${queryString}`
      : window.location.pathname;

    window.history.replaceState(null, '', newUrl);
  } catch (err) {
    console.error('Failed to sync table pagination', err);
  }
}
