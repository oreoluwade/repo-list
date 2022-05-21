import { useState, useMemo } from "react";
import { useQuery } from "@apollo/client";
import { useTable, Column, usePagination } from "react-table";
import SearchBar from "./components/search-bar";
import { REPOSITORY_QUERY } from "./queries/repository-query";
import PageLoader from "./components/page-loader";
import Paginator from "./components/paginator";

// React table requires a specific type so as to render a header with corresponding accessors
type TableDataType = {
  id: string;
  name: string;
  forkCount: number;
  stargazerCount: number;
};

const App: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState("re");
  const [totalNumberOfItemsToFetch, setTotalNumberOfItemsToFetch] =
    useState(20);

  const {
    loading,
    error,
    data: result
  }: {
    loading: boolean;
    error?: { message: string };
    data?: {
      search: {
        nodes: {
          __typename: string;
          id: string;
          name: string;
          forkCount: number;
          stargazerCount: number;
        }[];
        repositoryCount: number;
        pageInfo: {
          endCursor: string;
          hasNextPage: boolean;
          hasPreviousPage: boolean;
          startCursor: string;
          __typename: string;
        };
      };
    };
  } = useQuery(REPOSITORY_QUERY, {
    variables: {
      searchQuery,
      totalNumberOfItemsToFetch
    }
  });

  const columns = useMemo<Column<TableDataType>[]>(
    () => [
      {
        Header: "REPOSITORY NAME",
        accessor: "name",
        Cell: ({ cell: { value } }) => {
          return (
            <span className="text-sm font-bold text-[#3C43EB]">{value}</span>
          );
        }
      },
      {
        Header: "NUMBER OF FORKS",
        accessor: "forkCount",
        Cell: ({ cell: { value } }) => {
          return <span className="text-sm font-medium">🍴 {value}</span>;
        }
      },
      {
        Header: "NUMBER OF STARS",
        accessor: "stargazerCount",
        Cell: ({ cell: { value } }) => {
          return <span className="text-sm font-medium">🌟 {value}</span>;
        }
      }
    ],
    []
  );

  const data = useMemo<TableDataType[]>(() => {
    const list: TableDataType[] =
      result?.search.nodes.map(item => ({
        id: item.id,
        name: item.name,
        forkCount: item.forkCount,
        stargazerCount: item.stargazerCount
      })) || [];

    return list;
  }, [result?.search.nodes]);

  const {
    getTableProps,
    getTableBodyProps,
    headerGroups,
    prepareRow,
    page,
    canPreviousPage,
    canNextPage,
    pageCount,
    nextPage,
    previousPage,
    setPageSize,
    state: { pageIndex, pageSize }
  } = useTable(
    { columns, data, initialState: { pageIndex: 0 } },
    usePagination
  );

  return (
    <div className="w-screen h-screen flex justify-center items-center p-10">
      <div className="flex flex-col h-full w-full">
        <div className="flex w-3/4 mx-auto items-center justify-between">
          <SearchBar
            value={searchQuery}
            onChange={e => {
              setSearchQuery(e.target.value);
            }}
            placeholder="Start typing to search for repositories"
          />

          <div className="flex flex-col">
            <label htmlFor="fetchCountInput" className="text-xs font-bold">
              Result count
            </label>
            {/* To help increase or decrease number of results */}
            <input
              type="number"
              id="fetchCountInput"
              onChange={event => {
                if (event.target.value && +event.target.value > 0) {
                  setTotalNumberOfItemsToFetch(+event.target.value);
                }
              }}
              min={1}
              max={100} // Max is to prevent overly long loading times. Noticed that beyond a certain resultsCount, the app drags
              value={totalNumberOfItemsToFetch}
              className="w-[70px] h-[40px] border-[2px] border-solid border-black rounded mt-2 px-3"
            />
          </div>
        </div>

        {/* return an error message early */}
        {error && (
          <div className="font-medium text-2xl mx-auto mt-[80px] text-[#FF0000]">
            An error occured: {error.message}
          </div>
        )}

        {loading && (
          <div className="mx-auto mt-[200px] flex flex-col items-center">
            <PageLoader />
            <p className="text-lg text-[#5D62EE] font-bold mt-8">Loading...</p>
          </div>
        )}

        {!loading && !error && data && data.length === 0 && (
          <div className="font-medium text-2xl mx-auto mt-[80px]">
            Type in the search box to see a list of repositories
          </div>
        )}

        {!loading && !error && data && data.length > 0 && (
          <div className="w-3/4 mx-auto mt-10">
            <table
              {...getTableProps()}
              className="w-full border border-solid border-[2px] border-[#e4e4e4]"
            >
              <thead className="h-[48px] border-b-[2px] border-solid border-b-[#e4e4e4] w-full">
                {headerGroups.map(headerGroup => (
                  <tr
                    {...headerGroup.getHeaderGroupProps()}
                    className="w-full"
                    key={headerGroup.id}
                  >
                    {headerGroup.headers.map((column, index) => (
                      <th
                        {...column.getHeaderProps()}
                        key={index}
                        className="px-4"
                      >
                        <p className="flex items-center h-full w-full font-bold text-[#273143] text-sm flex-col md:flex-row">
                          {column.render("Header")}
                        </p>
                      </th>
                    ))}
                  </tr>
                ))}
              </thead>
              <tbody {...getTableBodyProps()} className="w-full relative">
                {page.map((row, idx: number) => {
                  prepareRow(row);
                  return (
                    <tr
                      {...row.getRowProps()}
                      key={`${row.id}_${idx}`}
                      className="h-[48px] border-b-[1px] border-solid border-b-[#e4e4e4]"
                    >
                      {row.cells.map((cell, cellIndex: number) => {
                        return (
                          <td
                            {...cell.getCellProps()}
                            className="w-auto px-4"
                            key={cellIndex}
                          >
                            <div className="flex items-center h-full w-full font-normal text-[#273143] text-xs">
                              {cell.render("Cell")}
                            </div>
                          </td>
                        );
                      })}
                    </tr>
                  );
                })}
              </tbody>
            </table>
            {/* Helps to navigate between pages for the results */}
            <div className="w-full flex justify-end pt-[36px] pr-4">
              <Paginator
                numberOfPages={pageCount}
                page={pageIndex + 1}
                hasNext={result?.search.pageInfo.hasNextPage || canNextPage}
                hasPrevious={
                  result?.search.pageInfo.hasNextPage || canPreviousPage
                }
                numberOfItemsPerPage={pageSize}
                setNumberOfItemsPerPage={setPageSize}
                goToNextPage={nextPage}
                goToPreviousPage={previousPage}
              />
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default App;
