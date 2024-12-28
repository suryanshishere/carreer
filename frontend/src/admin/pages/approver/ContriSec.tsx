import React from 'react'
import SECTION from "db/postDb/sections.json"
import { Link } from 'react-router-dom'

const ContriSec = () => {
  return (
    <div className='flex gap-2'>
      {SECTION.map((item:string)=>(
        <Link to={item}>{item}</Link>
      ))}
    </div>
  )
}

export default ContriSec
