import React from "react";
import { PieChart, Pie, Cell } from "recharts";

const data = [
  { name: "Şəxs 1", value: 55, amount: "₼12", color: "#333333" },
  { name: "Şəxs 2", value: 35, amount: "₼9", color: "#FFCC00" },
  { name: "Şəxs 3", value: 10, amount: "₼6", color: "#99F3BD" },
];

const CustomLegend = () => (
  <div>
    {data.map((entry, index) => (
      <div key={`item-${index}`} className="chart_legend_item">
        <div
          className="chart_legend_color"
          style={{ backgroundColor: entry.color }}
        ></div>
        <span className="chart_legend_name">{entry.name}</span>
        <span className="chart_legend_value">{entry.value}%</span>
        <span>{entry.amount}</span>
      </div>
    ))}
  </div>
);

const SalesComparisonChart = () => {
  return (
    <div className="chart_container">
      <PieChart width={200} height={200}>
        <Pie
          data={data}
          dataKey="value"
          innerRadius={60}
          outerRadius={100}
          paddingAngle={3}
        >
          {data.map((entry, index) => (
            <Cell key={`cell-${index}`} fill={entry.color} />
          ))}
        </Pie>
      </PieChart>
      <div className="chart_legend">
        <h3>Satış gəlirləri üzrə müqayisə</h3>
        <CustomLegend />
      </div>
    </div>
  );
};

export default SalesComparisonChart;
