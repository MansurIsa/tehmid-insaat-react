import React, { useState } from 'react';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Cell
} from 'recharts';

const colors = [
  '#66C2FF', '#A0E5A0', '#202020', '#99D6FF',
  '#BDD2E1', '#A0E5A0', '#6684FF', '#A0E5A0',
  '#202020', '#99D6FF', '#BDD2E1', '#A0E5A0'
];

// Qruplaşdırma funksiyası
const groupPaymentsByRange = (paymentList, range) => {
  const grouped = {};

  paymentList.forEach(({ datetime, amount }) => {
    const date = new Date(datetime);
    let key;

    switch (range) {
      case 'Günlük':
        // YYYY-MM-DD
        key = date.toISOString().slice(0, 10);
        break;
      case 'Aylıq':
        // YYYY-MM
        key = `${date.getFullYear()}-${(date.getMonth() + 1)
          .toString()
          .padStart(2, '0')}`;
        break;
      case 'İllik':
        // YYYY
        key = `${date.getFullYear()}`;
        break;
      default:
        key = `${date.getFullYear()}-${(date.getMonth() + 1)
          .toString()
          .padStart(2, '0')}`;
    }

    if (!grouped[key]) grouped[key] = 0;
    grouped[key] += amount;
  });

  // Ay adları Azərbaycan dilində
  const monthNames = [
    'Yan', 'Fev', 'Mar', 'Apr', 'May', 'İyn',
    'İyl', 'Avq', 'Sen', 'Okt', 'Noy', 'Dek'
  ];

  return Object.entries(grouped).map(([key, gəlir]) => {
    let name;

    if (range === 'Günlük') {
      // key = YYYY-MM-DD, ad kimi gün (DD)
      name = key.slice(8, 10);
    } else if (range === 'Aylıq') {
      // key = YYYY-MM
      const [, month] = key.split('-');
      name = monthNames[parseInt(month, 10) - 1];
    } else if (range === 'İllik') {
      name = key;
    }

    return { name, gəlir: parseFloat(gəlir.toFixed(2)) };
  });
};

const IncomeTableHeadLeft = ({ paymentList = [] }) => {
  const [range, setRange] = useState('Aylıq');
  const [dropdownOpen, setDropdownOpen] = useState(false);

  const toggleDropdown = () => {
    setDropdownOpen(!dropdownOpen);
  };

  const handleRangeChange = (newRange) => {
    setRange(newRange);
    setDropdownOpen(false);
  };

  const data = groupPaymentsByRange(paymentList, range);

  return (
    <div className="income_chart_container">
      <div className="income_chart_header">
        <h3 className="income_chart_title">Gəlir</h3>
        <div className="income_chart_dropdown_wrapper">
          <div className="income_chart_dropdown" onClick={toggleDropdown}>
            {range}
            <svg
              width="12"
              height="12"
              viewBox="0 0 10 6"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M1 1L5 5L9 1"
                stroke="#202020"
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </div>
          {dropdownOpen && (
            <div className="income_chart_dropdown_menu">
              {['Günlük', 'Aylıq', 'İllik'].map((item) => (
                <div
                  key={item}
                  className="income_chart_dropdown_item"
                  onClick={() => handleRangeChange(item)}
                >
                  {item}
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      <ResponsiveContainer width="100%" height={200}>
        <BarChart data={data}>
          <CartesianGrid vertical={false} strokeDasharray="3 3" />
          <XAxis dataKey="name" stroke="#ccc" tick={{ fontSize: 12 }} />
          <YAxis
            stroke="#ccc"
            tickFormatter={(v) => `${v}M`}
            tick={{ fontSize: 12 }}
          />
          <Tooltip formatter={(v) => `${v}M`} />
          <Bar dataKey="gəlir" radius={[6, 6, 0, 0]}>
            {data.map((_, index) => (
              <Cell key={index} fill={colors[index % colors.length]} />
            ))}
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
};

export default IncomeTableHeadLeft;
