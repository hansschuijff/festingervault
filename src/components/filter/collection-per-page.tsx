import useCollection from "@/hooks/use-collection";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "../ui/select";

export type Props = {
  collection: ReturnType<typeof useCollection>;
};

export default function PerPage({ collection }: Props) {
  return (
    <Select
      value={collection.pagination.per_page}
      onValueChange={collection.setPerPage}
    >
      <SelectTrigger className="h-9 w-16">
        <SelectValue placeholder={30} />
      </SelectTrigger>
      <SelectContent>
        <SelectGroup>
          <SelectLabel className="p-2 text-sm text-muted-foreground">
            Per Page
          </SelectLabel>
          {[30, 60, 90].map(val => (
            <SelectItem key={val} value={String(val)}>
              {val}
            </SelectItem>
          ))}
        </SelectGroup>
      </SelectContent>
    </Select>
  );
}
