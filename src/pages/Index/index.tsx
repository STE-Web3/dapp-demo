import { connectWallet } from '@/utils/helper'
import React, { useEffect } from 'react'

const Index = () => {
  useEffect(() => {
    connectWallet().then(([account, chainId]: any) => {})
  }, [])
  return <h1>Index</h1>
}

export default Index
