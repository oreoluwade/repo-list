import clsx from "clsx";
import React from "react";
import { ReactComponent as CaretLeftIcon } from "../svgs/caret-left-icon.svg";
import { ReactComponent as CaretRightIcon } from "../svgs/caret-right-icon.svg";

interface PaginatorProps {
  numberOfPages: number;
  page: number;
  hasNext: boolean;
  hasPrevious: boolean;
  numberOfItemsPerPage: number;
  setNumberOfItemsPerPage: (arg: number) => void;
  goToNextPage: () => void;
  goToPreviousPage: () => void;
}

const Paginator: React.FC<PaginatorProps> = ({
  numberOfPages,
  page,
  hasNext,
  hasPrevious,
  numberOfItemsPerPage,
  setNumberOfItemsPerPage,
  goToNextPage,
  goToPreviousPage
}) => {
  return (
    <div className="flex items-center">
      <p className="text-[10px] font-medium mr-[6px]">Result(s) per page</p>
      <input
        type="number"
        value={numberOfItemsPerPage}
        onChange={(event: React.ChangeEvent<HTMLInputElement>) => {
          if (event.target.value.length > 0) {
            setNumberOfItemsPerPage(Number(event.target.value));
          }
        }}
        max="10"
        min="5"
        className="w-[48px] h-[24px] flex items-center justify-center border border-solid border-[1px] border-[#C9CED1] rounded text-[10px] text-center mr-6"
      />

      <button
        type="button"
        className={clsx({
          "border-none outline-none flex items-center text-[10px] font-medium":
            true,
          "text-[#C9CED1]": !hasPrevious,
          "text-[#273143]": hasPrevious
        })}
        onClick={() => {
          goToPreviousPage();
        }}
        disabled={!hasPrevious}
      >
        <CaretLeftIcon
          width={15}
          height={12}
          stroke={hasPrevious ? "#273143" : "#C9CED1"}
          strokeWidth={2}
        />
        Prev
      </button>
      <>
        <span className="w-[24px] h-[24px] flex items-center justify-center rounded text-[10px] bg-[#EDF3FF] font-medium ml-[10px] mr-1">
          {page}
        </span>

        <p className="text-[10px] font-medium mr-[10px]">of {numberOfPages}</p>
      </>
      <button
        type="button"
        className={clsx({
          "border-none outline-none flex items-center text-[10px] font-medium":
            true,
          "text-[#C9CED1]": !hasNext,
          "text-[#273143]": hasNext
        })}
        onClick={() => {
          goToNextPage();
        }}
        disabled={!hasNext}
      >
        Next
        <CaretRightIcon
          width={15}
          height={12}
          stroke={hasNext ? "#273143" : "#C9CED1"}
          strokeWidth={2}
        />
      </button>
    </div>
  );
};

export default Paginator;
