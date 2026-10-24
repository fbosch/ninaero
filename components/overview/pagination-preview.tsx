import { useState } from "react";

import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/registry/ninaero/ui/pagination";

export function PaginationPreview() {
  const [page, setPage] = useState(1);
  return (
    <div className="space-y-2 text-center">
      <Pagination>
        <PaginationContent>
          <PaginationItem>
            <PaginationPrevious
              href="/docs"
              aria-disabled={page === 1}
              onClick={(event) => {
                event.preventDefault();
                setPage((current) => Math.max(1, current - 1));
              }}
            />
          </PaginationItem>
          {[1, 2, 3].map((number) => (
            <PaginationItem key={number}>
              <PaginationLink
                href="/docs"
                isActive={page === number}
                aria-label={`Page ${number}`}
                onClick={(event) => {
                  event.preventDefault();
                  setPage(number);
                }}
              >
                {number}
              </PaginationLink>
            </PaginationItem>
          ))}
          <PaginationItem>
            <PaginationNext
              href="/docs"
              aria-disabled={page === 3}
              onClick={(event) => {
                event.preventDefault();
                setPage((current) => Math.min(3, current + 1));
              }}
            />
          </PaginationItem>
        </PaginationContent>
      </Pagination>
      <p aria-live="polite" className="text-xs text-muted-foreground">
        Showing sample page {page} of 3
      </p>
    </div>
  );
}
