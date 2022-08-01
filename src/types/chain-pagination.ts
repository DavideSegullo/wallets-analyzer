export interface ChainPagination {
  next_key: string | null;
  total: string;
}

export type ChainData<T extends string, K> = {
  [key in T]: K;
};

export interface ChainPaginationParams {
  'pagination.limit'?: string;
  'pagination.key'?: string;
}

export type ChainPaginationResponse<T extends string, K> = ChainData<T, K> & {
  pagination: ChainPagination;
};
