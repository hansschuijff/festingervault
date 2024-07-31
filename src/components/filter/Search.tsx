import { useDebounce } from "@/hooks/use-debounce";
import useFilter from "@/hooks/useFilter";
import { cn } from "@/lib/utils";
import { __ } from "@wordpress/i18n";
import { X } from "lucide-react";
import { useEffect, useState } from "react";
import { Input } from "../ui/input";
type SearchProps = {
  filter: ReturnType<typeof useFilter>;
};
export default function Search({ filter }: SearchProps) {
  const [text, setText] = useState<string>(filter.search?.keyword || "");
  const debouncedSearchTerm = useDebounce(text, 500);
  useEffect(() => {
    filter.setSearch(debouncedSearchTerm);
  }, [debouncedSearchTerm]);
  useEffect(() => {
    setText(filter.search?.keyword || "");
  }, [filter.search]);
  return (
    <div className="relative">
      <Input
        value={text}
        className={cn(
          "h-9 w-[300px] transition-[width] pr-7",
        )}
        placeholder={__("Search Title")}
        onChange={e => setText(e.target.value)}
      />
      {text.length > 0 && (
        <X
          className="absolute right-3 top-1/2 -translate-y-1/2 cursor-pointer opacity-100 transition-opacity hover:opacity-70"
          size={14}
          onClick={e => filter.setSearch("")}
        />
      )}
    </div>
  );
}
