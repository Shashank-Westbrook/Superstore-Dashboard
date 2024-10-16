import React from 'react'

const Header = ({title}) => {
  return (
    <header 
      className="bg-transparent backdrop-blur shadow-lg border b border-gray-700">

        <div className='max-w-7xl mx-auto py-4 px-4 sm:px-6 lg:px-8'>

            <h1
            className="text-3xl font-bold text-white">{title}</h1>

        </div>

      </header>
  )
}

export default Header
