import { ethers } from 'ethers'

export const formatAmount = (tokenAmount: any, tokenDecimals: any) => {
  let _tokenAmount = '0'
  if (typeof tokenAmount === 'number') {
    _tokenAmount = String(tokenAmount)
  } else if (typeof tokenAmount === 'string') {
    _tokenAmount = String(tokenAmount)
  } else if (typeof tokenAmount === 'object') {
    try {
      _tokenAmount = String(tokenAmount.toString() || 0)
    } catch (error) {}
  }
  return Number(
    Number(
      ethers.utils.formatUnits(String(tokenAmount || 0), tokenDecimals)
    ).toFixed(8)
  )
}
