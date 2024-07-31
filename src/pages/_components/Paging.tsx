import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";
import generatePaginationArray from "@/utils/generatePaginationArray";
import { useMemo } from "react";
type PagingProps = {
  totalPages: number;
  currentPage: number;
  urlGenerator: Function;
  className?: string;
};
export default function Paging({
  totalPages = 1,
  currentPage = 1,
  urlGenerator,
  className = "",
}: PagingProps) {
  if (totalPages < 2) {
    return null;
  }
  const paginationArray = useMemo(() => {
    return generatePaginationArray(currentPage, totalPages);
  }, [currentPage, totalPages]);
  return (
    <>
      <Pagination className={className}>
        <PaginationContent>
          {currentPage >= 1 && (
            <PaginationItem>
              <PaginationPrevious
                to={urlGenerator(currentPage - 1)}
              ></PaginationPrevious>
            </PaginationItem>
          )}
          {paginationArray.map((item, index) => (
            <PaginationItem key={index}>
              {item.separator === false ? (
                <PaginationLink
                  to={urlGenerator(item.page)}
                  isActive={item.active}
                >
                  {item.page}
                </PaginationLink>
              ) : (
                <PaginationEllipsis />
              )}
            </PaginationItem>
          ))}
          {currentPage < totalPages && (
            <PaginationItem>
              <PaginationNext
                to={urlGenerator(currentPage + 1)}
              ></PaginationNext>
            </PaginationItem>
          )}
        </PaginationContent>
      </Pagination>
    </>
  );
}
