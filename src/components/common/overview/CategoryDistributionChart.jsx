import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { PieChart, Pie, Legend, Tooltip, ResponsiveContainer, Cell } from 'recharts';

// Helper function to format sales in 'K'
const formatToK = (num) => `${(num / 1000).toFixed(1)}K`;

// Define the colors for the Pie chart
const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042'];

const CategoryDistributionChart = () => {
  const [categoryData, setCategoryData] = useState([]);
  const [allData, setAllData] = useState([]); // Store raw data
  const [selectedCategory, setSelectedCategory] = useState('All'); // Track selected category

  // Fetch data on component mount
  useEffect(() => {
    const fetchCategoryData = async () => {
      try {
        const response = await fetch('/superstore_dataset.json');
        const result = await response.json();
        const data = result['SuperStore Sales'];
        setAllData(data); // Store raw data
        filterDataByCategory(data, 'All'); // Load all data initially
      } catch (error) {
        console.error('Error fetching category data:', error);
      }
    };

    fetchCategoryData();
  }, []);

  // Filter the data by category and aggregate by Ship Mode
  const filterDataByCategory = (data, category) => {
    const filteredData = category === 'All' ? data : data.filter(item => item.Category === category);

    const aggregatedData = filteredData.reduce((acc, item) => {
      const existingEntry = acc.find(entry => entry.name === item['Ship Mode']);
      if (existingEntry) {
        existingEntry.value += item.Sales;
      } else {
        acc.push({ name: item['Ship Mode'], value: item.Sales });
      }
      return acc;
    }, []);

    setCategoryData(aggregatedData);
  };

  // Handle category change
  const handleCategoryChange = (category) => {
    setSelectedCategory(category);
    filterDataByCategory(allData, category);
  };

  return (
    <motion.div
      className='bg-maroon bg-opacity-50 backdrop-blur-md rounded-xl p-6 border border-gray-700'
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
    >
      <h2 className='text-lg font-medium text-gray-300 mb-4'>Ship Mode Sales Breakdown</h2>

      {/* Category Filter Buttons */}
      <div className='flex space-x-4 mb-6'>
        {['All', 'Technology', 'Furniture', 'Office Supplies'].map((category) => (
          <button
            key={category}
            onClick={() => handleCategoryChange(category)}
            className={`px-4 py-2 rounded ${
              selectedCategory === category ? 'bg-teal-500 text-white' : 'bg-gray-300 text-gray-800'
            }`}
          >
            {category}
          </button>
        ))}
      </div>

      <div className='h-80'>
        <ResponsiveContainer>
          <PieChart>
            <Pie
              data={categoryData}
              cx="50%"
              cy="50%"
              labelLine={false}
              outerRadius={80}
              dataKey="value"
              label={({ name, value }) => `${name}: ${formatToK(value)}`}
            >
              {categoryData.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
              ))}
            </Pie>
            <Legend />
            <Tooltip formatter={(value) => formatToK(value)} />
          </PieChart>
        </ResponsiveContainer>
      </div>
    </motion.div>
  );
};

export default CategoryDistributionChart;


