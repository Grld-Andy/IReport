import React from 'react'

interface Props{
    title: string
}

const PageHeader: React.FC<Props> = ({title}) => {
  return (
    <h1 className="text-[40px] font-bold">{title}</h1>
  )
}

export default PageHeader