import React, { useEffect, useState } from 'react';
import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, Cell, ReferenceLine } from 'recharts';
import { motion } from 'framer-motion';

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#E5E7EB'];

const ProductTable = () => {
  const [segmentationData, setSegmentationData] = useState([]);
  const [allData, setAllData] = useState([]); // Store all fetched data
  const [selectedCategory, setSelectedCategory] = useState('All'); // Track selected category

  // Fetch and store the dataset on component mount
  useEffect(() => {
    const fetchSalesData = async () => {
      try {
        const response = await fetch('/superstore_dataset.json');
        if (!response.ok) throw new Error('Failed to load dataset.');

        const jsonData = await response.json();
        const salesData = jsonData['SuperStore Sales'];
        setAllData(salesData); // Store raw data
        filterDataByCategory(salesData, 'All'); // Load all data initially
      } catch (error) {
        console.error('Error fetching or processing data:', error);
      }
    };

    fetchSalesData();
  }, []);

  // Function to filter data by selected category
  const filterDataByCategory = (data, category) => {
    const filteredData = category === 'All' ? data : data.filter(item => item.Category === category);

    // Group profits by discount range
    const discountBuckets = [
      { name: '0.0 - 0.2', profit: 0 },
      { name: '0.2 - 0.4', profit: 0 },
      { name: '0.4 - 0.6', profit: 0 },
      { name: '0.6 - 0.8', profit: 0 },
      { name: '0.8 - 1.0', profit: 0 },
    ];

    // Sum profits into discount buckets
    filteredData.forEach((item) => {
      const { Discount, Profit } = item;

      if (Discount >= 0 && Discount < 0.2) discountBuckets[0].profit += Profit;
      else if (Discount >= 0.2 && Discount < 0.4) discountBuckets[1].profit += Profit;
      else if (Discount >= 0.4 && Discount < 0.6) discountBuckets[2].profit += Profit;
      else if (Discount >= 0.6 && Discount < 0.8) discountBuckets[3].profit += Profit;
      else if (Discount >= 0.8 && Discount <= 1.0) discountBuckets[4].profit += Profit;
    });

    setSegmentationData(discountBuckets);
  };

  // Handle category button click
  const handleCategoryChange = (category) => {
    setSelectedCategory(category);
    filterDataByCategory(allData, category);
  };

  // Format Y-axis values with $ and K notation
  const formatYAxis = (tick) => {
    return `$${(tick / 1000).toFixed(1)}K`; // Example: 15000 -> $15.0K
  };

  // Format X-axis values as percentages
  const formatXAxis = (tick) => `${(parseFloat(tick.split(' - ')[1]) * 100).toFixed(0)}%`;

  return (
    <motion.div
      className='bg-maroon bg-opacity-50 backdrop-blur-md rounded-xl p-6 lg:col-span-2 border border-gray-700'
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
    >
      <h2 className='text-lg font-medium mb-4 text-gray-300'>Discount Profit Breakdown</h2>

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
          <BarChart data={segmentationData}>
            <CartesianGrid strokeDasharray='3 3' stroke='#4B5563' />
            <XAxis dataKey='name' stroke='#9CA3AF' tickFormatter={formatXAxis} />
            <YAxis stroke='#9CA3AF' tickFormatter={formatYAxis} />
            <Tooltip
              contentStyle={{
                backgroundColor: 'rgba(31, 41, 55, 0.8)',
                borderColor: '#4B5563',
              }}
              itemStyle={{ color: '#E5E7EB' }}
              formatter={(value) => `$${(value / 1000).toFixed(1)}K`}
            />
            <Legend />
            <ReferenceLine y={0} stroke="red" strokeDasharray="3 3" /> {/* Highlight horizontal line at profit = 0 */}

            <Bar dataKey='profit'>
              {segmentationData.map((entry, index) => (
                <Cell
                  key={`cell-${index}`}
                  fill={entry.profit < 0 ? 'red' : COLORS[index % COLORS.length]} // Highlight negative profits in red
                />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>
    </motion.div>
  );
};

export default ProductTable;
