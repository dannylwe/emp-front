import React from 'react'
import EmployeeTable from './EmployeeTable'

function Home() {
  return (
    <div className="grid place-items-center">
      <h1 className="text-3xl font-bold mb-4">Employee Data</h1>
      <EmployeeTable />
    </div>
  )
}

export default Home