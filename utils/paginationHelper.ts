export interface TablePaginationState {
  page: number;
  rowsPerPage: number;
  status: string;
}

export interface GetPaginationOptions {
  defaultLimit?: number;
  defaultStatus?: string;
  statusKey?: string;
  searchParams?: { get: (key: string) => string | null } | null;
  allowSessionStorageOnInit?: boolean;
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

  // Read URL search params from passed searchParams (available on SSR & client) or window
  let paramPage: string | null = null;
  let paramLimit: string | null = null;
  let paramStatus: string | null = null;

  if (options?.searchParams) {
    paramPage = options.searchParams.get('page');
    paramLimit = options.searchParams.get('limit') || options.searchParams.get('rowsPerPage');
    paramStatus = options.searchParams.get(statusKey);
  } else if (typeof window !== 'undefined') {
    try {
      const params = new URLSearchParams(window.location.search);
      paramPage = params.get('page');
      paramLimit = params.get('limit') || params.get('rowsPerPage');
      paramStatus = params.get(statusKey);
    } catch (e) {}
  }

  // Determine page (URL is 1-indexed; state is 0-indexed for MUI)
  let page = 0;
  if (paramPage) {
    const parsed = parseInt(paramPage, 10);
    if (!isNaN(parsed) && parsed > 0) {
      page = parsed - 1;
    }
  }

  // Determine rowsPerPage / limit
  let rowsPerPage = defaultLimit;
  if (paramLimit) {
    const parsed = parseInt(paramLimit, 10);
    if (!isNaN(parsed) && parsed > 0) {
      rowsPerPage = parsed;
    }
  }

  // Determine status: URL param takes precedence on both SSR and client
  let status = paramStatus || defaultStatus;

  // On client only: only check sessionStorage if explicitly requested to prevent SSR hydration mismatches
  if (options?.allowSessionStorageOnInit && typeof window !== 'undefined' && !paramPage && !paramLimit && !paramStatus) {
    try {
      const saved = sessionStorage.getItem(storageKey);
      if (saved) {
        const savedState = JSON.parse(saved);
        if (typeof savedState.page === 'number') page = Math.max(0, savedState.page);
        if (typeof savedState.rowsPerPage === 'number' && savedState.rowsPerPage > 0) {
          rowsPerPage = savedState.rowsPerPage;
        }
        if (typeof savedState.status === 'string') status = savedState.status;
      }
    } catch (e) {}
  }

  return { page, rowsPerPage, status };
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
