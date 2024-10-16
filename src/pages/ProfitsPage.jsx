import React from 'react'
import { motion } from 'framer-motion'
import Header from '../components/common/Header'
import StatCard from '../components/common/StatCard'
import { TrendingUp, TrendingUpDownIcon } from 'lucide-react'
import ProductTable from '../components/products/ProductTable'
import ProfitTrendChart from '../components/products/ProfitTrendChart'
import CategoryProfitChart from '../components/products/CategoryProfitChart'

const ProfitsPage = () => {
  return (
    <div className='flex-1 overflow-auto relative z-10'>

        <Header title="Profits" />

        <main className='max-w-7xl mx-auto py-6 px-4 lg:px-8 '>

          <motion.div
            className='grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4 mb-8'
            initial={{ opacity: 0, y: 150 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}>
              <StatCard name="Total Profits" icon={TrendingUp} value={'$ 278.98 K'} color='yellow'/>
              <StatCard name="Average Discount" icon={TrendingUpDownIcon} value={'16%'} color='purple'/>
              <StatCard name="Profit Margin" icon={TrendingUpDownIcon} value={'12.34%'} color='red'/>


          </motion.div>

          <ProductTable />

          <div className='grid grid-col-1 lg:grid-cols-2 gap-8 mb-8'>

            <ProfitTrendChart />
            <CategoryProfitChart />


          </div>


          


        </main>
      
    </div>
  )
}

export default ProfitsPage
