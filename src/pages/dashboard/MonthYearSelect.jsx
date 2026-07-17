import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getUserObj, getUsersList } from "../../actions/loginAction/loginAction";
import { getDashboardList } from "../../actions/dashboardAction/dashboardAction";
import CustomCustomerSelect from "../../components/admin/salesTableHead/CustomCustomerSelect";

const MonthYearSelect = () => {
  const today = new Date();
  const currentYear = String(today.getFullYear());

  const months = [
    { value: "All", label: "Bütün aylar" },
    { value: "Yanvar", label: "Yanvar" },
    { value: "Fevral", label: "Fevral" },
    { value: "Mart", label: "Mart" },
    { value: "Aprel", label: "Aprel" },
    { value: "May", label: "May" },
    { value: "Iyun", label: "İyun" },
    { value: "Iyul", label: "İyul" },
    { value: "Avqust", label: "Avqust" },
    { value: "Sentyabr", label: "Sentyabr" },
    { value: "Oktyabr", label: "Oktyabr" },
    { value: "Noyabr", label: "Noyabr" },
    { value: "Dekabr", label: "Dekabr" },
  ];

  const years = Array.from({ length: 101 }, (_, i) => 2000 + i);

  const dispatch = useDispatch();
  const { usersList, userObj } = useSelector((state) => state.login);

  // Local state, localStorage-dan oxunur
  const [selectedYear, setSelectedYear] = useState(() => {
    const storedYear = localStorage.getItem("selectedYear");
    return storedYear || currentYear; // yeni il gəlibsə hazırkı il
  });

  const [selectedMonth, setSelectedMonth] = useState(() => {
    return localStorage.getItem("selectedMonth") || months[today.getMonth()].value;
  });

  const [selectedCustomerId, setSelectedCustomerId] = useState(() => {
    return localStorage.getItem("selectedCustomerId") || null;
  });

  // İlk load üçün user list və user obj
  useEffect(() => {
    dispatch(getUsersList());
    dispatch(getUserObj());
  }, [dispatch]);

  // Superuser üçün default customer seçimi
  useEffect(() => {
    if (userObj?.is_superuser) {
      const defaultCustomerId = selectedCustomerId || userObj.id;
      setSelectedCustomerId(defaultCustomerId);
      localStorage.setItem("selectedCustomerId", defaultCustomerId);
    }
  }, [userObj]);

  // Yalnız is_staff == true olan user-lər filterlənir
  const staffUsers = usersList.filter((u) => u.is_staff);

  // Search üçün API call
  const handleSearch = (searchTerm) => {
    if (!searchTerm.trim()) {
      dispatch(getUsersList());
    } else {
      dispatch(getUsersList(1, searchTerm));
    }
  };

  // Ay, İl və Customer dəyişəndə API çağırışı
  useEffect(() => {
    if (!userObj) return;

    const customerIdToSend =
      userObj?.is_superuser && selectedCustomerId
        ? selectedCustomerId
        : userObj?.id;

    if (customerIdToSend) {
      dispatch(getDashboardList(customerIdToSend, selectedMonth, selectedYear));
    }
  }, [selectedMonth, selectedYear, selectedCustomerId, userObj, dispatch]);

  // Ay dəyişəndə state + localStorage
  const handleMonthChange = (month) => {
    setSelectedMonth(month);
    localStorage.setItem("selectedMonth", month);
  };

  // İl dəyişəndə state + localStorage
  const handleYearChange = (year) => {
    setSelectedYear(year);
    localStorage.setItem("selectedYear", year);
  };

  // Customer dəyişəndə state + localStorage
  const handleCustomerChange = (id) => {
    setSelectedCustomerId(id);
    localStorage.setItem("selectedCustomerId", id);
  };

  return (
    <div className="admin_container">
      <div className="month_year_select">
        <div className="form_group">
          <select value={selectedYear} onChange={(e) => handleYearChange(e.target.value)}>
            <option value="">İl seçin</option>
            {years.map((year) => (
              <option key={year} value={year}>
                {year}
              </option>
            ))}
          </select>
        </div>

        <div className="form_group">
          <select value={selectedMonth} onChange={(e) => handleMonthChange(e.target.value)}>
            <option value="">Ay seçin</option>
            {months.map((month) => (
              <option key={month.value} value={month.value}>
                {month.label}
              </option>
            ))}
          </select>
        </div>

        {userObj?.is_superuser && (
          <CustomCustomerSelect
            displayVal={false}
            customers={staffUsers}
            value={selectedCustomerId}
            onChange={handleCustomerChange}
            onSearch={handleSearch}
          />
        )}
      </div>
    </div>
  );
};

export default MonthYearSelect;
