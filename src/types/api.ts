
type MetaType = {
  current_page: number;
  last_page: number;
  per_page: number;
  total: number;
};
export type CollectionResponse<ResponseDataType> = {
  data: ResponseDataType[];
  meta?: MetaType;
};
