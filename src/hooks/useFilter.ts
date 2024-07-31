import { SortItems } from "@/components/sorting/sort";
import { Params, useNavigate, useParams } from "@/router";
import { useCallback, useEffect, useMemo, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { z } from "zod";

// Define types
export type FilterState = Record<string, string[] | string>;
export type SortState = {
  order_by?: string;
  order?: "asc" | "desc";
};

type Option = {
  label: string;
  value: string;
  icon?: React.ComponentType<{ className?: string }>;
};

export type FilterOption = {
  id: string;
  label: string;
  values?: string[];
  options: Option[];
  isMulti?: boolean;
};

type FilterProps = {
  options: FilterOption[];
  path: keyof Params;
  sort: SortItems[];
};

// Create schemas dynamically
const createFilterSchema = (options: FilterOption[]) => {
  const schemaShape: Record<string, z.ZodTypeAny> = {};
  options.forEach(option => {
    schemaShape[option.id] =
      option.isMulti === true
        ? z.array(z.string()).optional()
        : z.string().optional();
  });
  return z.object(schemaShape);
};

const createSortSchema = (sort_items: SortItems[]) => {
  if (sort_items.length === 0)
    throw new Error("sort_items must have at least one item.");
  const sortValues = sort_items.map(item => item.value) as [
    string,
    ...string[],
  ];
  return z.object({
    order_by: z.enum(sortValues).default(sortValues[0]),
    order: z.enum(["asc", "desc"]).default("asc"),
  });
};

// Utility functions
const serializeQuery = (items: FilterState): Record<string, string> => {
  return Object.fromEntries(
    Object.entries(items)
      .filter(([_, values]) => Array.isArray(values) && values.length > 0)
      .map(([key, values]) => [key, (values as string[]).sort().join(",")]),
  );
};
// Custom hook
export default function useFilter({ options, path, sort }: FilterProps) {
  const [searchParams, setSearchParams] = useSearchParams();
  const filterSchema = useMemo(() => createFilterSchema(options), [options]);
  const sortSchema = useMemo(() => createSortSchema(sort), [sort]);
  const searchSchema = z.object({ keyword: z.string().optional() });
  const params = useParams(path);
  const navigate = useNavigate();

  const unserializeQuery = useCallback(
    (searchParams: URLSearchParams): FilterState => {
      const result = {};
      const keys = options.map(i => i.id);
      Array.from(searchParams.entries()).forEach(([key, value]) => {
        const option = options.find(i => i.id === key);
        if (option) {
          result[key] = option.isMulti
            ? value.split(",").filter(v => v.length > 0)
            : value;
        }
      });
      return result as FilterState;
    },
    [options],
  );
  // Extract and validate initial state from search params
  const initialState = useMemo(() => {
    const unserialized = unserializeQuery(searchParams);
    const filterResult = filterSchema.safeParse(unserialized);
    const sortResult = sortSchema.safeParse(Object.fromEntries(searchParams));
    const searchResult = searchSchema.safeParse(
      Object.fromEntries(searchParams),
    );
    return {
      items: filterResult.success ? filterResult.data : {},
      sorting: sortResult.success ? sortResult.data : {},
      search: searchResult.success ? searchResult.data : {},
    };
  }, [searchParams, filterSchema, sortSchema, searchSchema]);
  // Update URL with new filter and sorting parameters

  function setFilter(key: string, values: string[]) {
    const newItems = { ...initialState.items, [key]: values.sort() };
    navigate(path, { params: { type: params.type } });
    setSearchParams({
      ...initialState.search,
      ...serializeQuery(newItems),
      ...initialState.sorting,
    });
  }

  function setSort(key: string, order: "asc" | "desc") {
    const newSorting = { order_by: key ?? null, order: order ?? "asc" };
    setSearchParams({
      ...initialState.search,
      ...initialState.items,
      ...newSorting,
    });
  }
  function setSearch(keyword: string) {
    setSearchParams({
      ...(keyword.length > 0 ? { keyword } : {}),
      ...initialState.items,
      ...initialState.sorting,
    });
  }
  function clearFilter() {
    setSearchParams({
      ...initialState.search,
      ...initialState.sorting,
    });
  }

  return {
    setFilter,
    setSort,
    options,
    searchParams,
    sort,
    setSearch,
    search: initialState.search,
    items: initialState.items,
    sorting: initialState.sorting,
    clearFilter,
  };
}
