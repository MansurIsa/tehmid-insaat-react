import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getUserObj, getUsersList } from "../../actions/loginAction/loginAction";
import { getDashboardList } from "../../actions/dashboardAction/dashboardAction";
import CustomCustomerSelect from "../../components/admin/salesTableHead/CustomCustomerSelect";

const MonthYearSelect = () => {
  const today = new Date();
  const currentYear = String(today.getFullYear());
  const currentMonth = today.getMonth() + 1; // 1-12

  // Aylar - value olaraq rəqəm (1-12), "All" üçün 0
  const months = [
    { value: 0, label: "Bütün aylar" },
    { value: 1, label: "Yanvar" },
    { value: 2, label: "Fevral" },
    { value: 3, label: "Mart" },
    { value: 4, label: "Aprel" },
    { value: 5, label: "May" },
    { value: 6, label: "İyun" },
    { value: 7, label: "İyul" },
    { value: 8, label: "Avqust" },
    { value: 9, label: "Sentyabr" },
    { value: 10, label: "Oktyabr" },
    { value: 11, label: "Noyabr" },
    { value: 12, label: "Dekabr" },
  ];

  const years = Array.from({ length: 101 }, (_, i) => 2000 + i);

  const dispatch = useDispatch();
  const { usersList, userObj } = useSelector((state) => state.login);

  // ================== STATE ==================
  const [selectedYear, setSelectedYear] = useState(() => {
    const storedYear = localStorage.getItem("selectedYear");
    return storedYear || currentYear;
  });

  const [selectedMonth, setSelectedMonth] = useState(() => {
    const storedMonth = localStorage.getItem("selectedMonth");
    if (storedMonth !== null && storedMonth !== "undefined" && storedMonth !== "") {
      const parsed = parseInt(storedMonth);
      if (!isNaN(parsed)) {
        return parsed;
      }
    }
    return currentMonth;
  });

  const [selectedCustomerId, setSelectedCustomerId] = useState(() => {
    const stored = localStorage.getItem("selectedCustomerId");
    if (stored !== null && stored !== "undefined" && stored !== "") {
      return stored;
    }
    return null;
  });

  // ================== USER LOAD ==================
  useEffect(() => {
    dispatch(getUsersList());
    dispatch(getUserObj());
  }, [dispatch]);

  // ================== SUPERSUSER ÜÇÜN DEFAULT CUSTOMER ==================
  useEffect(() => {
    if (userObj?.is_superuser) {
      const defaultCustomerId = selectedCustomerId || String(userObj.id);
      setSelectedCustomerId(defaultCustomerId);
      localStorage.setItem("selectedCustomerId", defaultCustomerId);
    }
  }, [userObj]);

  // ================== STAFF USERS ==================
  const staffUsers = usersList.filter((u) => u.is_staff);

  const handleSearch = (searchTerm) => {
    if (!searchTerm.trim()) {
      dispatch(getUsersList());
    } else {
      dispatch(getUsersList(1, searchTerm));
    }
  };

  // ================== API CALL ==================
  useEffect(() => {
    if (!userObj) return;

    const customerIdToSend =
      userObj?.is_superuser && selectedCustomerId
        ? selectedCustomerId
        : String(userObj?.id);

    if (customerIdToSend) {
      // Ay rəqəmi 0-dırsa "All" göndər, yoxsa rəqəmi göndər
      const monthParam = selectedMonth === 0 ? "All" : selectedMonth;
      
      console.log("📊 Dashboard request:", {
        customerId: customerIdToSend,
        month: monthParam,
        year: selectedYear,
        selectedMonth: selectedMonth,
      });
      
      dispatch(getDashboardList(customerIdToSend, monthParam, selectedYear));
    }
  }, [selectedMonth, selectedYear, selectedCustomerId, userObj, dispatch]);

  // ================== HANDLERS ==================
  const handleMonthChange = (e) => {
    const value = parseInt(e.target.value);
    console.log("📅 Month changed:", value);
    setSelectedMonth(value);
    localStorage.setItem("selectedMonth", String(value));
  };

  const handleYearChange = (e) => {
    const value = e.target.value;
    console.log("📅 Year changed:", value);
    setSelectedYear(value);
    localStorage.setItem("selectedYear", value);
  };

  const handleCustomerChange = (id) => {
    console.log("👤 Customer changed:", id);
    setSelectedCustomerId(id);
    localStorage.setItem("selectedCustomerId", id);
  };

  

  return (
    <div className="admin_container">
      <div className="month_year_select">
        <div className="form_group">
          <label>İl</label>
          <select value={selectedYear} onChange={handleYearChange}>
            <option value="">İl seçin</option>
            {years.map((year) => (
              <option key={year} value={year}>
                {year}
              </option>
            ))}
          </select>
        </div>

        <div className="form_group">
          <label>Ay</label>
          <select value={selectedMonth} onChange={handleMonthChange}>
            {months.map((month) => (
              <option key={month.value} value={month.value}>
                {month.label}
              </option>
            ))}
          </select>
        </div>

        {userObj?.is_superuser && (
          <div className="form_group">
            <label>Satıcı</label>
            <CustomCustomerSelect
              displayVal={false}
              customers={staffUsers}
              value={selectedCustomerId}
              onChange={handleCustomerChange}
              onSearch={handleSearch}
            />
          </div>
        )}
      </div>
    </div>
  );
};

export default MonthYearSelect;