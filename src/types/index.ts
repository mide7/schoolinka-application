export type queryInput = {
  page?: string | number;
  sort?: 'id' | 'title' | 'username';
  order?: 'asc' | 'desc';
  size?: string | number;
  search?: string;
  published?: 'all' | 'true' | 'false';
};
