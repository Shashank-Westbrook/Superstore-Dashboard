import React from 'react'
import Header from '../components/common/Header'
import { motion } from 'framer-motion'
import StatCard from '../components/common/StatCard'
import { Box, ShoppingBag, Users, Zap } from 'lucide-react'
import SalesOverviewChart from '../components/common/overview/SalesOverviewChart'
import CategoryDistributionChart from '../components/common/overview/CategoryDistributionChart'
import SegmentationSalesChart from '../components/common/overview/SegmentationSalesChart'

const OverviewPage = () => {
  return (
    <div className='flex-1 overflow-auto relative z-10'>

        <Header title="SuperStore Sales Dashboard" />

        <main className='max-w-7xl mx-auto py-6 px-4 lg:px-8 xl:px-20'>

            <motion.div
                className='grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4 mb-8'
                initial={{ opacity: 0, y: 150 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                >
                <StatCard
                name="Total Sales" icon={Zap} value={'$ 2.26M'} color='#10B981'/>

                <StatCard
                name="Total Orders" icon={Users} value={'4,923'} color='purple'/>

                <StatCard
                name="Net Average Profit" icon={ShoppingBag} value={'28.47'} color='red'/>

                <StatCard
                name="Order Delivery Time" icon={Box} value={'4.96 days'} color='green'/>

            </motion.div>

            <div className='grid grid-cols-1 lg:grid-cols-2 gap-8'>
              <SalesOverviewChart />
              <CategoryDistributionChart />
              <SegmentationSalesChart />

            </div>

        </main>

      
    </div>
  )
}

export default OverviewPage
