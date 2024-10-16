import React, { useEffect, useState } from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { motion } from 'framer-motion';

// Helper to map month names to their numeric equivalents
const monthOrder = {
  Jan: 0, Feb: 1, Mar: 2, Apr: 3, May: 4, Jun: 5,
  Jul: 6, Aug: 7, Sep: 8, Oct: 9, Nov: 10, Dec: 11,
};

// Helper to format numbers in 'K'
const formatToK = (num) => `${(num / 1000).toFixed(1)}K`;

// Helper function to convert Excel date to JavaScript date
const excelDateToJSDate = (serial) => {
  const utcDays = Math.floor(serial - 25569); // Excel date offset
  return new Date(utcDays * 86400 * 1000); // Convert to milliseconds
};

const SalesOverviewChart = () => {
  const [salesData, setSalesData] = useState([]);
  const [allData, setAllData] = useState([]); // Store all sales data
  const [years, setYears] = useState([]); // Store unique years
  const [selectedYear, setSelectedYear] = useState('All'); // Track the selected year

  const fetchSalesData = async () => {
    try {
      const response = await fetch('/superstore_dataset.json'); // Fetch JSON from public folder
      const result = await response.json();
      const data = result["SuperStore Sales"];

      setAllData(data); // Store the complete dataset
      extractYears(data); // Extract unique years from data
      filterDataByYear(data, 'All'); // Load all data initially
    } catch (error) {
      console.error('Error fetching sales data:', error);
    }
  };

  const extractYears = (data) => {
    const uniqueYears = [
      ...new Set(data.map((item) => excelDateToJSDate(item["Order Date"]).getFullYear())),
    ].sort((a, b) => a - b); // Sort years in ascending order
    setYears(uniqueYears);
  };

  const filterDataByYear = (data, year) => {
    const filteredData = data.filter((item) => {
      const itemYear = excelDateToJSDate(item["Order Date"]).getFullYear();
      return year === 'All' || itemYear === parseInt(year);
    });

    const monthlySales = Object.keys(monthOrder).map((month) => ({
      name: month,
      sales: 0,
    }));

    filteredData.forEach((item) => {
      const date = excelDateToJSDate(item["Order Date"]);
      const month = date.toLocaleString('default', { month: 'short' });
      const monthIndex = monthOrder[month];

      if (monthIndex !== undefined) {
        monthlySales[monthIndex].sales += item.Sales;
      }
    });

    setSalesData(monthlySales);
  };

  useEffect(() => {
    fetchSalesData(); // Fetch data on component mount
  }, []);

  const handleYearFilter = (year) => {
    setSelectedYear(year);
    filterDataByYear(allData, year);
  };

  return (
    <motion.div
      className="bg-maroon bg-opacity-50 backdrop-blur-md rounded-xl p-6 border border-gray-700"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <h2 className="text-lg font-medium text-gray-300 mb-4">Sales Overview</h2>

      <div className="flex space-x-2 mb-6">
        <button
          onClick={() => handleYearFilter('All')}
          className={`px-4 py-2 rounded ${selectedYear === 'All' ? 'bg-green-600' : 'bg-gray-300'} text-white`}
        >
          All Years
        </button>
        {years.map((year) => (
          <button
            key={year}
            onClick={() => handleYearFilter(year)}
            className={`px-4 py-2 rounded ${
              selectedYear === year ? 'bg-green-600' : 'bg-gray-300'
            } text-white`}
          >
            {year}
          </button>
        ))}
      </div>

      <div className="h-80">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={salesData}>
            <CartesianGrid strokeDasharray="3 3" stroke="#4B5563" />
            <XAxis dataKey="name" stroke="#9CA3AF" />
            <YAxis stroke="#9CA3AF" tickFormatter={formatToK} />
            <Tooltip
              formatter={(value) => formatToK(value)}
              contentStyle={{ backgroundColor: '#4B5563', borderColor: '#9CA3AF' }}
              itemStyle={{ color: '#9CA3AF' }}
            />
            <Line
              type="monotone"
              dataKey="sales"
              stroke="#10B981"
              strokeWidth={3}
              dot={{ fill: '#10B981', strokeWidth: 2, r: 6 }}
              activeDot={{ r: 8, strokeWidth: 2 }}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </motion.div>
  );
};

export default SalesOverviewChart;
