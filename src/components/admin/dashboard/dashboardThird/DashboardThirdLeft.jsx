import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import ReactPaginate from "react-paginate";
import { getMostDebtDashboardList } from "../../../../actions/dashboardAction/dashboardAction";
import AdminBigComponentHeader from "../../adminBigComponentHeader/AdminBigComponentHeader";

const DashboardThirdLeft = () => {
  const dispatch = useDispatch();
  const { mostDebtObj, count1 } = useSelector((state) => state.dashboard);

  const [currentPage, setCurrentPage] = useState(1);

  const pageSize = 10; // backend-də neçə dənə gəlirsə onu yaz

  useEffect(() => {
    dispatch(getMostDebtDashboardList({ page: currentPage }));
  }, [dispatch, currentPage]);

  const handlePageClick = (event) => {
    setCurrentPage(event.selected + 1); // react-paginate 0-dan başlayır
  };

  const pageCount = Math.ceil(count1 / pageSize);

  console.log(mostDebtObj);


  const filteredData = mostDebtObj?.filter(
  (item) => Math.abs(item?.debt) > 0.0001
);
  

  return (
    <div className="admin_container dashboard_end_container  table_wrapper">
      <AdminBigComponentHeader adminHeader={"Ən çox borclu müştərilər"}/>

      {/* Table */}
      <table className="custom_table">
        <thead>
          <tr>
            <th>Ad</th>
            <th>Borc</th>
            <th>Telefon</th>
          </tr>
        </thead>
        <tbody>
          {filteredData?.length > 0 ? (
            filteredData.map((item, index) => (
              <tr key={index}>
                <td>{item.name}</td>
                <td>{Math.round(item?.debt * 100) / 100} ₼ </td>
                <td>{item.phone_number || "-"}</td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan="3" style={{ textAlign: "center", padding: "20px" }}>
                Məlumat yoxdur
              </td>
            </tr>
          )}
        </tbody>
      </table>

      {/* Pagination */}
      {pageCount > 1 && (
        <ReactPaginate
          previousLabel={
            <svg
              width="8"
              height="14"
              viewBox="0 0 8 14"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M7 1L1 7L7 13"
                stroke="#9F9FA0"
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          }
          nextLabel={
            <svg
              width="8"
              height="14"
              viewBox="0 0 8 14"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M1 1L7 7L1 13"
                stroke="#202020"
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          }
          pageCount={pageCount}
          onPageChange={handlePageClick}
          forcePage={currentPage - 1}
          containerClassName={"dashboard_end_pagination"}
          pageClassName={"dashboard_end_page"}
          pageLinkClassName={"dashboard_end_page_link"}
          previousClassName={"dashboard_end_arrow"}
          nextClassName={"dashboard_end_arrow"}
          activeClassName={"dashboard_end_active"}
        />
      )}
    </div>
  );
};

export default DashboardThirdLeft;
