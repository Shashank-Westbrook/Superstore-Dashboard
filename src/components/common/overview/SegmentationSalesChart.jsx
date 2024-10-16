import React, { useEffect, useState } from 'react';
import { ResponsiveContainer, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, Cell, BarChart } from 'recharts';
import { motion } from 'framer-motion';

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042'];

// Helper function to convert Excel serial date to JavaScript Date
const excelDateToJSDate = (serial) => {
  const utcDays = Math.floor(serial - 25569); // Excel date offset
  const date = new Date(utcDays * 86400 * 1000); // Convert to milliseconds
  return date;
};

const SegmentationSalesChart = () => {
  const [segmentationData, setSegmentationData] = useState([]);
  const [allData, setAllData] = useState([]); // Store raw data
  const [selectedYear, setSelectedYear] = useState('All');
  const [selectedRegion, setSelectedRegion] = useState('All');
  const [years, setYears] = useState([]); // Store unique years for dropdown

  useEffect(() => {
    const fetchSegmentationData = async () => {
      try {
        const response = await fetch('/superstore_dataset.json');
        const result = await response.json();
        const data = result["SuperStore Sales"];

        setAllData(data);
        extractYears(data); // Extract unique years
        filterData(data, 'All', 'All'); // Load all data initially
      } catch (error) {
        console.error('Error fetching segmentation data:', error);
      }
    };

    fetchSegmentationData();
  }, []);

  const extractYears = (data) => {
    const uniqueYears = [
      ...new Set(data.map((item) => excelDateToJSDate(item["Order Date"]).getFullYear())),
    ].sort();
    setYears(uniqueYears);
  };

  const formatValueInK = (value) => `$${(value / 1000).toFixed(1)}K`;

  const filterData = (data, year, region) => {
    const filteredData = data.filter((item) => {
      const itemDate = excelDateToJSDate(item["Order Date"]);
      const itemYear = itemDate.getFullYear();

      const yearMatch = year === 'All' || itemYear === parseInt(year);
      const regionMatch = region === 'All' || item["Region"] === region;

      return yearMatch && regionMatch;
    });

    const aggregatedData = filteredData.reduce((acc, item) => {
      const segment = item["Segment"];
      const sales = item["Sales"];

      if (!acc[segment]) acc[segment] = { name: segment, value: 0 };
      acc[segment].value += sales;

      return acc;
    }, {});

    const sortedData = Object.values(aggregatedData).sort((a, b) => a.name.localeCompare(b.name));
    setSegmentationData(sortedData);
  };

  const handleYearChange = (event) => {
    const year = event.target.value;
    setSelectedYear(year);
    filterData(allData, year, selectedRegion);
  };

  const handleRegionChange = (event) => {
    const region = event.target.value;
    setSelectedRegion(region);
    filterData(allData, selectedYear, region);
  };

  return (
    <motion.div
      className='bg-maroon bg-opacity-50 backdrop-blur-md rounded-xl p-6 lg:col-span-2 border border-gray-700'
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
    >
      <h2 className='text-lg font-medium mb-4 text-gray-300'>Sales Channel Breakdown</h2>

      <div className='flex space-x-4 mb-6'>
        <select
          value={selectedYear}
          onChange={handleYearChange}
          className='px-4 py-2 rounded bg-gray-300 text-gray-800'
        >
          <option value="All">All Years</option>
          {years.map((year) => (
            <option key={year} value={year}>
              {year}
            </option>
          ))}
        </select>

        <select
          value={selectedRegion}
          onChange={handleRegionChange}
          className='px-4 py-2 rounded bg-gray-300 text-gray-800'
        >
          <option value="All">All Regions</option>
          <option value="East">East</option>
          <option value="West">West</option>
          <option value="Central">Central</option>
          <option value="South">South</option>
        </select>
      </div>

      <div className='h-80'>
        <ResponsiveContainer>
          <BarChart data={segmentationData}>
            <CartesianGrid strokeDasharray='3 3' stroke='#4B5563' />
            <XAxis
              dataKey='name'
              stroke='#9CA3AF'
              label={{ value: 'Customer Segment', position: 'insideBottomRight', offset: -5 }}
            />
            <YAxis stroke='#9CA3AF' tickFormatter={formatValueInK} />
            <Tooltip
              contentStyle={{
                backgroundColor: 'rgba(31, 41, 55, 0.8)',
                borderColor: '#4B5563',
              }}
              formatter={(value) => [`${formatValueInK(value)}`, '']}
            />
            <Legend />
            <Bar dataKey='value' fill='#8884d8'>
              {segmentationData.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>
    </motion.div>
  );
};

export default SegmentationSalesChart;

