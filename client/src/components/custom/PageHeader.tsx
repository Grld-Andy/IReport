import React from 'react'

interface Props{
    title: string
    subtitle: string
}

const PageHeader: React.FC<Props> = ({title, subtitle}) => {
  return (
    <div>
      <h1 className="text-[40px] font-bold">{title}</h1>
      <p className='text-gray-800'>{subtitle}</p>
    </div>
  )
}

export default PageHeader