import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

// Helper function to convert Excel date format to JS Date
const excelDateToJSDate = (excelDate) => {
  const jsDate = new Date((excelDate - 25569) * 86400 * 1000); // Convert to JS date
  return jsDate;
};

const ProfitTrendChart = () => {
  const [salesData, setSalesData] = useState({});
  const [filteredData, setFilteredData] = useState({});
  const [selectedTimeRange, setSelectedTimeRange] = useState('Monthly');

  // Fetch Data from JSON
  const fetchSalesData = async () => {
    try {
      const response = await fetch('/superstore_dataset.json'); // Fetch JSON from public folder
      const result = await response.json();
      const data = result["SuperStore Sales"];

      // Process data into grouped formats
      const processedData = {
        yearly: groupByYear(data),
        monthly: groupByMonth(data),
        weekly: groupByWeek(data),
        quarterly: groupByQuarter(data),
      };

      setSalesData(processedData);
      setFilteredData(processedData.monthly); // Default view
    } catch (error) {
      console.error('Error fetching data:', error);
    }
  };

  // Group Data by Year
  const groupByYear = (data) => {
    const result = {};
    data.forEach((item) => {
      const year = excelDateToJSDate(item['Order Date']).getFullYear();
      if (!result[year]) result[year] = { year, sales: 0, profit: 0 };
      result[year].sales += item['Sales'];
      result[year].profit += item['Profit'];
    });
    return Object.values(result);
  };

  // Group Data by Month
  const groupByMonth = (data) => {
    const result = Array(12).fill(0).map((_, i) => ({
      month: new Date(0, i).toLocaleString('default', { month: 'short' }),
      sales: 0,
      profit: 0,
    }));
    data.forEach((item) => {
      const date = excelDateToJSDate(item['Order Date']);
      const month = date.getMonth();
      result[month].sales += item['Sales'];
      result[month].profit += item['Profit'];
    });
    return result;
  };

  // Group Data by Week
  const groupByWeek = (data) => {
    const result = [];
    data.forEach((item) => {
      const date = excelDateToJSDate(item['Order Date']);
      const week = `${date.getFullYear()}-W${Math.ceil(date.getDate() / 7)}`;
      const existingWeek = result.find((w) => w.week === week);
      if (existingWeek) {
        existingWeek.sales += item['Sales'];
        existingWeek.profit += item['Profit'];
      } else {
        result.push({ week, sales: item['Sales'], profit: item['Profit'] });
      }
    });
    return result;
  };

  // Group Data by Quarter
  const groupByQuarter = (data) => {
    const result = Array(4).fill(0).map((_, i) => ({
      quarter: `Q${i + 1}`,
      sales: 0,
      profit: 0,
    }));
    data.forEach((item) => {
      const date = excelDateToJSDate(item['Order Date']);
      const quarter = Math.floor(date.getMonth() / 3);
      result[quarter].sales += item['Sales'];
      result[quarter].profit += item['Profit'];
    });
    return result;
  };

  // Handle Time Range Change
  const handleTimeRangeChange = (range) => {
    setSelectedTimeRange(range);
    setFilteredData(salesData[range.toLowerCase()]);
  };

  useEffect(() => {
    fetchSalesData(); // Fetch data on component mount
  }, []);

  return (
    <motion.div
      className="bg-maroon bg-opacity-50 backdrop-blur-md rounded-xl p-6 border border-gray-700 mt-[10px]"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <h2 className="text-lg font-medium text-gray-300">Profit Trend Chart</h2>
      <div className="h-80">
        <ResponsiveContainer>
          <AreaChart data={filteredData}>
            <XAxis
              dataKey={
                selectedTimeRange === 'Yearly'
                  ? 'year'
                  : selectedTimeRange === 'Weekly'
                  ? 'week'
                  : selectedTimeRange === 'Quarterly'
                  ? 'quarter'
                  : 'month'
              }
            />
            <YAxis
              tickFormatter={(value) => `$${value / 1000}K`}
              tick={{ fontSize: 12 }}
            />
            <CartesianGrid strokeDasharray="3 3" />
            <Tooltip formatter={(value) => `$${value.toLocaleString()}`} />
            <Legend />
            <Area
              type="monotone"
              dataKey="sales"
              stroke="#8884d8"
              fill="#8884d8"
            />
            <Area
              type="monotone"
              dataKey="profit"
              stroke="#82ca9d"
              fill="#82ca9d"
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>
      <div className="flex justify-center">
        <button
          className="bg-gray-300 hover:bg-gray-400 text-gray-800 font-bold py-2 px-4 rounded-l"
          onClick={() => handleTimeRangeChange('Yearly')}
        >
          Yearly
        </button>
        <button
          className="bg-gray-300 hover:bg-gray-400 text-gray-800 font-bold py-2 px-4"
          onClick={() => handleTimeRangeChange('Monthly')}
        >
          Monthly
        </button>
        <button
          className="bg-gray-300 hover:bg-gray-400 text-gray-800 font-bold py-2 px-4"
          onClick={() => handleTimeRangeChange('Weekly')}
        >
          Quarterly
        </button>
      </div>
    </motion.div>
  );
};

export default ProfitTrendChart;