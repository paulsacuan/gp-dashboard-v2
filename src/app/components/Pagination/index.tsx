import React from 'react';
const LEFT_PAGE = 'LEFT';
const RIGHT_PAGE = 'RIGHT';

const range = (from: number, to: number, step = 1) => {
  let i = from;
  const range = [];
  while (i <= to) {
    range.push(i);
    i += step;
  }
  return range;
};

export default function Pagination({ data, onPageChanged, limit }) {
  let pageNeighbours = 1;
  pageNeighbours =
    typeof pageNeighbours === 'number'
      ? Math.max(0, Math.min(pageNeighbours, 2))
      : 0;
  const pageLimit = limit || 30;
  const currentPage = data.current_page;
  const totalRecords = typeof data.total === 'number' ? data.total : 0;
  const totalPages = Math.ceil(totalRecords / pageLimit);

  const handleClick = page => evt => {
    evt.preventDefault();
    gotoPage(page);
  };

  const handleMoveLeft = evt => {
    evt.preventDefault();
    gotoPage(currentPage - pageNeighbours * 2 - 1);
  };

  const handleMoveRight = evt => {
    evt.preventDefault();
    gotoPage(currentPage + pageNeighbours * 2 + 1);
  };

  const gotoPage = page => {
    const currentPage = Math.max(0, Math.min(page, totalPages));
    onPageChanged(currentPage);
  };

  const fetchPageNumbers = () => {
    const totalNumbers = pageNeighbours * 2 + 3;
    const totalBlocks = totalNumbers + 2;

    if (totalPages > totalBlocks) {
      const startPage = Math.max(2, currentPage - pageNeighbours);
      const endPage = Math.min(totalPages - 1, currentPage + pageNeighbours);
      let pages = range(startPage, endPage);
      const hasLeftSpill = startPage > 2;
      const hasRightSpill = totalPages - endPage > 1;
      const spillOffset = totalNumbers - (pages.length + 1);
      switch (true) {
        // handle: (1) < {5 6} [7] {8 9} (10)
        case hasLeftSpill && !hasRightSpill: {
          const extraPages = range(startPage - spillOffset, startPage - 1);
          pages = [LEFT_PAGE, ...extraPages, ...pages];
          break;
        }
        // handle: (1) {2 3} [4] {5 6} > (10)
        case !hasLeftSpill && hasRightSpill: {
          const extraPages = range(endPage + 1, endPage + spillOffset);
          pages = [...pages, ...extraPages, RIGHT_PAGE];
          break;
        }
        // handle: (1) < {4 5} [6] {7 8} > (10)
        case hasLeftSpill && hasRightSpill:
        default: {
          pages = [LEFT_PAGE, ...pages, RIGHT_PAGE];
          break;
        }
      }
      return [1, ...pages, totalPages];
    }
    return range(1, totalPages);
  };

  const renderBorderRound = (page: number) => {
    let rounded = '';
    switch (page) {
      case 1:
        rounded = 'rounded-l-lg';
        break;
      case totalPages:
        rounded = 'rounded-r-lg';
        break;
      default:
        rounded = 'rounded-none';
        break;
    }
    return rounded;
  };
  return (
    <div className="flex flex-row divide-x text-xs justify-center my-4 md:text-md md:justify-end">
      {fetchPageNumbers().map((page, index) => {
        if (page === LEFT_PAGE)
          return (
            <button
              key={index}
              className="py-2 px-4 bg-primary-100 shadow-lg border border-slate-100 hover:bg-segunda-100"
              onClick={handleMoveLeft}
            >
              <span aria-hidden="true">&laquo;</span>
              <span className="sr-only">Previous</span>
            </button>
          );
        if (page === RIGHT_PAGE)
          return (
            <button
              key={index}
              className="py-2 px-4 bg-primary-100 shadow-lg border border-slate-100 hover:bg-segunda-100"
              onClick={handleMoveRight}
            >
              <span aria-hidden="true">&raquo;</span>
              <span className="sr-only">Next</span>
            </button>
          );
        return (
          <button
            key={index}
            className={`${
              currentPage === page
                ? `py-2 px-4 bg-primera-100 text-segunda-100 font-bold shadow-lg border border-slate-100 ${renderBorderRound(
                    page,
                  )}`
                : `py-2 px-4 bg-white shadow-lg border border-slate-100 hover:bg-segunda-100 ${renderBorderRound(
                    page,
                  )}`
            }`}
            onClick={handleClick(page)}
          >
            {page}
          </button>
        );
      })}
    </div>
  );
}
