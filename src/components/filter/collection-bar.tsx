import useCollection from "@/hooks/use-collection";
import { X } from "lucide-react";
import { Button } from "../ui/button";
import FilterItem from "./filter-item";
import Search from "./search-input";
import FilterToolbar from "./toolbars";
import { Select } from "@radix-ui/react-select";
import PerPage from "./collection-per-page";

type FilterBarProps = {
  collection: ReturnType<typeof useCollection>;
};

export default function FilterBar({ collection }: FilterBarProps) {
  return (
    <div className="flex flex-col gap-4">
      <div className="flex flex-row items-start justify-between gap-4">
        <Search collection={collection} />
        <div className="flex flex-row items-center gap-4">
					<PerPage collection={collection} />
          <FilterToolbar label="Order By" collection={collection} />
        </div>
      </div>
      <div className="flex flex-row flex-wrap items-center gap-4">
        {collection.options && (
          <div className="flex flex-row items-center gap-4">
            {collection.options.map(option => {
              return (
                option.enabled !== false && (
                  <FilterItem key={option.id} item={option} collection={collection} />
                )
              );
            })}
          </div>
        )}
        {Object.keys(collection.items).length > 0 && (
          <div>
            <Button
              variant="ghost"
              className="flex flex-row gap-4"
              onClick={collection.clearFilter}
            >
              Clear Filters <X size="14" />
            </Button>
          </div>
        )}
      </div>
    </div>
  );
}
