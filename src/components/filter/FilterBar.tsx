import useFilter from "@/hooks/useFilter";
import { X } from "lucide-react";
import Sort from "../sorting/sort";
import { Button } from "../ui/button";
import FilterItem from "./FilterItem";
import Search from "./Search";

type FilterBarProps = {
  filter: ReturnType<typeof useFilter>;
};

export default function FilterBar({ filter }: FilterBarProps) {
  return (
    <div className="flex flex-col gap-4">
      <div className="flex flex-row items-start justify-between gap-4">
        <Search filter={filter} />
        <div>
          <Sort label="Order By" items={filter.sort} filter={filter} />
        </div>
      </div>
      <div className="flex flex-row flex-wrap items-center gap-4">
        {filter.options && (
          <div className="flex flex-row items-center gap-4">
            {filter.options.map(item => (
              <FilterItem key={item.id} item={item} filter={filter} />
            ))}
          </div>
        )}
        {Object.keys(filter.items).length > 0 && (
          <div>
            <Button variant="ghost" className="flex flex-row gap-4" onClick={filter.clearFilter}>Clear Filters <X size="14" /></Button>
          </div>
        )}
      </div>
    </div>
  );
}
