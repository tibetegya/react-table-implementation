import React, { useState, useEffect, useMemo } from "react";
import "./styles.css";
import {
  useTable,
  // useGlobalFilter,
  // useFilters,
  usePagination
} from "react-table";
import styled from "styled-components";

const Table = styled.table`
  margin: auto;
  margin-top: 3rem;
  &,
  th,
  td {
    border: none;
    border-collapse: collapse;
  }
  th {
    background: teal;
    border-top: 1px solid red;
    padding: 10px;
  }
`;
const Row = styled.tr`
  border-top: 1px solid #333;
  border-bottom: 1px solid #333;
  &:hover {
    background: #f0f0f0;
  }
`;
const Cell = styled.td`
  padding: 1rem;
`;
const FooterRow = styled.tr`
  /* border: 1px solid red; */
`;
const FooterCell = styled.td`
  /* padding: 1rem; */
  & > div {
    display: flex;
    justify-content: space-between;
    border: 1px solid red;
    padding: 1rem;
    div {
      font-size: 12px;
    }
  }
`;

export default function App() {
  // const [filter, setFilter] = useState("");
  const [data, setData] = useState([]);
  const tableData = React.useMemo(() => [...data, ...data], [data]);
  useEffect(() => {
    fetch("https://my-json-server.typicode.com/tibetegya/json-api/searches")
      .then(res => res.json())
      .then(data => setData(data));
  }, []);
  const columns = useMemo(
    () => [
      {
        title: "ID",
        accessor: "id"
      },
      {
        title: "Frequency",
        accessor: "frequency"
      },
      {
        title: "Places",
        accessor: "place",
        disableGlobalFilter: true
      },
      {
        title: "Engines",
        id: "engines",
        disableGlobalFilter: true,
        accessor: (row, rowIndex) => row.engines.join(", ")
      },
      {
        title: "Action",
        id: "foo",
        accessor: props => {
          return (
            <button onClick={() => alert(`you clicked on: ${props.id}`)}>
              click
            </button>
          );
        }
      }
    ],
    []
  );
  const {
    getTableProps,
    getTableBodyProps,
    headerGroups,
    visibleColumns,
    state,
    previousPage,
    nextPage,
    page,
    rows,
    prepareRow
  } = useTable(
    {
      columns,
      data: tableData,
      disableFilters: true,
      initialState: {
        pageSize: 3
      }
    },
    usePagination
  );
  // const GlobalFilter = ({ globalFilter, setGlobalFilter }) => (
  //   <form
  //     onSubmit={e => {
  //       e.preventDefault();
  //       let val = e.target.filter.value;
  //       e.target.filter.value = "";
  //       // setFilter(val);
  //       setGlobalFilter(val);
  //     }}
  //   >
  //     <input type="text" placeholder="filter" name="filter" id="filter" />
  //     <button type="submit">apply</button>
  //   </form>
  // );
  return (
    <div className="App">
      {/* <GlobalFilter
        globalFilter={state.globalFilter}
        setGlobalFilter={setGlobalFilter}
      /> */}
      <div>
        {/* <span>
          showing recods: {rows.length} of {preGlobalFilteredRows.length}
        </span> */}
      </div>
      <Table {...getTableProps()}>
        <thead>
          {headerGroups.map(headerGroup => (
            <tr {...headerGroup.getHeaderGroupProps()}>
              {headerGroup.headers.map(column => (
                <th {...column.getHeaderProps()}>{column.render("title")}</th>
              ))}
            </tr>
          ))}
        </thead>
        <tbody {...getTableBodyProps()}>
          {page.map(row => {
            prepareRow(row);
            return (
              <Row {...row.getRowProps()}>
                {row.cells.map(cell => {
                  return (
                    <Cell {...cell.getCellProps()}>{cell.render("Cell")}</Cell>
                  );
                })}
              </Row>
            );
          })}
          <FooterRow>
            <FooterCell colSpan={visibleColumns.length}>
              <div>
                <div>
                  Showing {state.pageIndex * state.pageSize + 1} -{" "}
                  {state.pageIndex * state.pageSize + state.pageSize} out of{" "}
                  {rows.length} items
                </div>
                <div>
                  <button onClick={previousPage}>{"<"}</button>
                  <button>5</button>
                  <button
                    style={{
                      pointerEvents: "none"
                    }}
                  >
                    ...
                  </button>
                  <button onClick={nextPage}>{">"}</button>
                </div>
              </div>
            </FooterCell>
          </FooterRow>
        </tbody>
      </Table>
    </div>
  );
}
