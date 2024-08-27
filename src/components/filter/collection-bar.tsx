import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import useCollection from "@/hooks/use-collection";
import { __ } from "@/lib/i18n";
import { FilterIcon, X } from "lucide-react";
import { Button } from "../ui/button";
import PerPage from "./collection-per-page";
import FilterItem from "./filter-item";
import Search from "./search-input";
import FilterToolbar from "./toolbars";
type FilterBarProps = {
  collection: ReturnType<typeof useCollection>;
};

export default function FilterBar({ collection }: FilterBarProps) {
  return (
    <div className="flex flex-col gap-4">
      <div className="flex flex-row items-start justify-between gap-4">
        <div className="flex flex-row items-center gap-4">
          <Search collection={collection} />
          <div></div>
        </div>
        <div className="flex flex-row items-center gap-4">
          <PerPage collection={collection} />
          <FilterToolbar label="Order By" collection={collection} />
        </div>
      </div>
      <div className="flex flex-row items-center gap-4">
        {collection.options && (
          <div className="flex flex-row flex-wrap gap-4">
            {collection.options
              .filter(
                option => option.onBarView === true && option.enabled !== false,
              )
              .map(option => {
                return (
                  <FilterItem
                    key={option.id}
                    item={option}
                    collection={collection}
                  />
                );
              })}
            <Sheet>
              <SheetTrigger asChild>
                <Button variant="outline" className="flex flex-row gap-2">
                  {__("Filters")} <FilterIcon size={16} />
                </Button>
              </SheetTrigger>
              <SheetContent>
                <SheetHeader>
                  <SheetTitle>
                    {__("Apply Filters")}
                  </SheetTitle>
                  <SheetDescription>
                    {__(
                      "Select Filters to fine tune your search criteria",
                    )}
                  </SheetDescription>
                </SheetHeader>
                <div className="py-4">
                  {collection.options && (
                    <div className="flex flex-row flex-wrap gap-4">
                      {collection.options
                        .filter(option => option.enabled !== false)
                        .map(option => {
                          return (
                            <FilterItem
                              key={option.id}
                              item={option}
                              collection={collection}
                            />
                          );
                        })}
                    </div>
                  )}
                </div>
              </SheetContent>
            </Sheet>
            {Object.keys(collection.items).length > 0 && (
              <div>
                <Button
                  variant="ghost"
                  className="flex flex-row gap-2"
                  onClick={collection.clearFilter}
                >
                  <span>{__("Clear Filters")}</span> <X size="14" />
                </Button>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
