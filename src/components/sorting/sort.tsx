import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import useFilter from "@/hooks/useFilter";
import { cn } from "@/lib/utils";
import { SortAsc, SortDesc } from "lucide-react";
import { Button } from "../ui/button";
export type SortItems = {
  value: string;
  label: string;
};

export type Props = {
  items: SortItems[];
  label: string;
  filter: ReturnType<typeof useFilter>;
};

export default function Sort({ items, label, filter }: Props) {
  return (
    <div className="flex flex-row items-center gap-4">
      <div className="text-xs">Order By</div>
      <Select
        value={filter.sorting.order_by}
        onValueChange={value => filter.setSort(value, filter.sorting.order)}
      >
        <SelectTrigger className="h-9 w-[180px]">
          <SelectValue placeholder={label} />
        </SelectTrigger>
        <SelectContent>
          <SelectGroup>
            {items.map(item => (
              <SelectItem key={item.value} value={item.value}>
                {item.label}
              </SelectItem>
            ))}
          </SelectGroup>
        </SelectContent>
      </Select>
      <Button
        variant="outline"
        size="icon"
        onClick={() =>
          filter.setSort(
            filter.sorting.order_by,
            filter.sorting.order === "asc" ? "desc" : "asc",
          )
        }
        className="h-9"
      >
        <SortAsc
          className={cn(
            "h-[1.2rem] w-[1.2rem] scale-0 transition-all",
            filter.sorting?.order === "asc" && "scale-100",
          )}
        />
        <SortDesc
          className={cn(
            "absolute h-[1.2rem] w-[1.2rem] scale-0 transition-all",
            filter.sorting?.order !== "asc" && "scale-100",
          )}
        />
      </Button>
    </div>
  );
}
