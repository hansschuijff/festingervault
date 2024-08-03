import useCollection from "@/hooks/use-collection";
import { useDebounce } from "@/hooks/use-debounce";
import { cn } from "@/lib/utils";
import { __ } from "@wordpress/i18n";
import { X } from "lucide-react";
import { useEffect, useState } from "react";
import { Input } from "../ui/input";
type SearchProps = {
  collection: ReturnType<typeof useCollection>;
};
export default function Search({ collection }: SearchProps) {
  const [text, setText] = useState<string>(collection.search?.keyword || "");
  const [inputChanged, setInputChanged] = useState<boolean>(false);
  const debouncedSearchTerm = useDebounce(text, 500);
  useEffect(() => {
    if (inputChanged) {
			/**
			 * Reset page number when search keyword is changed via search input field
			 */
    	collection.setSearch(debouncedSearchTerm);
    }
  }, [debouncedSearchTerm]);
  useEffect(() => {
    setText(collection.search?.keyword || "");
  }, [collection.search]);
  return (
    <div className="relative">
      <Input
        value={text}
        className={cn("h-9 w-[300px] pr-7 transition-[width]")}
        placeholder={__("Search Title")}
        onChange={e => {
          setText(e.target.value);
          setInputChanged(true);
        }}
      />
      {text.length > 0 && (
        <X
          className="absolute right-3 top-1/2 -translate-y-1/2 cursor-pointer opacity-100 transition-opacity hover:opacity-70"
          size={14}
          onClick={e => collection.setSearch("")}
        />
      )}
    </div>
  );
}
