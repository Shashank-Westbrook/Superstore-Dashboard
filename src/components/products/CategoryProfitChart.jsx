import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { PieChart, Pie, Legend, Tooltip, ResponsiveContainer, Cell } from 'recharts';

// Define colors for each category
const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042'];

const CategoryProfitChart = () => {
  const [categoryData, setCategoryData] = useState([]);
  const [allData, setAllData] = useState([]); // Store the entire dataset
  const [regions, setRegions] = useState([]); // Store unique regions
  const [selectedRegion, setSelectedRegion] = useState('All'); // Track the selected region

  const fetchCategoryData = async () => {
    try {
      const response = await fetch('/superstore_dataset.json'); // Fetch JSON from public folder
      const result = await response.json();
      const data = result["SuperStore Sales"];

      setAllData(data); // Store complete dataset
      extractRegions(data); // Extract unique regions
      filterDataByRegion(data, 'All'); // Load all data initially
    } catch (error) {
      console.error('Error fetching category profit data:', error);
    }
  };

  const extractRegions = (data) => {
    const uniqueRegions = [...new Set(data.map((item) => item.Region))].sort(); // Sort regions alphabetically
    setRegions(uniqueRegions);
  };

  const filterDataByRegion = (data, region) => {
    const filteredData = region === 'All' ? data : data.filter((item) => item.Region === region);

    // Process data to calculate total profit by category
    const profitByCategory = filteredData.reduce((acc, item) => {
      const { Category, Profit } = item;

      if (!acc[Category]) {
        acc[Category] = { totalProfit: 0, count: 0 };
      }
      acc[Category].totalProfit += Profit;
      acc[Category].count += 1;

      return acc;
    }, {});

    // Convert to array format and calculate profit margin
    const processedData = Object.entries(profitByCategory).map(
      ([name, { totalProfit, count }]) => ({
        name,
        value: totalProfit / count, // Average profit per category
      })
    );

    setCategoryData(processedData); // Update state with filtered data
  };

  useEffect(() => {
    fetchCategoryData(); // Fetch data on component mount
  }, []);

  const handleRegionFilter = (region) => {
    setSelectedRegion(region);
    filterDataByRegion(allData, region);
  };

  return (
    <motion.div
      className='bg-maroon bg-opacity-50 backdrop-blur-md rounded-xl p-6 border border-gray-700 mt-[10px]'
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <h2 className='text-lg font-medium text-gray-300'>Profit Margin by Category Breakdown</h2>
      <div className='h-80'>
        <ResponsiveContainer>
          <PieChart>
            <Pie
              data={categoryData}
              cx={'50%'}
              cy={'50%'}
              labelLine={false}
              outerRadius={80}
              dataKey='value'
              label={(data) => `${data.name} $${data.value.toFixed(2)}`}
            >
              {categoryData.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
              ))}
            </Pie>
            <Legend />
            <Tooltip formatter={(value) => `$${value.toFixed(2)}`} />
          </PieChart>
        </ResponsiveContainer>
      </div>

      {/* Region Filter Buttons */}
      <div className='flex space-x-2 mt-4 justify-center'>
        <button
          onClick={() => handleRegionFilter('All')}
          className={`px-4 py-2 rounded ${
            selectedRegion === 'All' ? 'bg-green-600' : 'bg-gray-300'
          } text-white`}
        >
          All Regions
        </button>
        {regions.map((region) => (
          <button
            key={region}
            onClick={() => handleRegionFilter(region)}
            className={`px-4 py-2 rounded ${
              selectedRegion === region ? 'bg-green-600' : 'bg-gray-300'
            } text-white`}
          >
            {region}
          </button>
        ))}
      </div>
    </motion.div>
  );
};

export default CategoryProfitChart;
