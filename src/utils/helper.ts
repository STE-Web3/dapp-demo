import { ethers, utils } from 'ethers'
import { abi } from '../abi'
import { erc20 } from '../abi/erc20'
interface SwitchEthereumChainParameter {
  chainId: string
}
export const RED_PACKET_CONTRACT = (id: string | number) => {
  switch (Number(id)) {
    case 1:
      return '0x79Ba0D5cd7f2ea63d1741856c01836345bcBcE3f'
    case 137:
      return '0xE6325DCf470A46389F7e8555332eB91281bD544e'
    case 56:
      return '0xb3E988ec1b8c53cd4915Ec20C95F3103d984ebE7'
    case 66:
      return '0xb3E988ec1b8c53cd4915Ec20C95F3103d984ebE7'

    default:
      return '0x79Ba0D5cd7f2ea63d1741856c01836345bcBcE3f'
  }
}

export const getProvider = () => {
  const ethereum = window.ethereum
  if (ethereum) {
    const provider = new ethers.providers.Web3Provider(ethereum)
    return provider
  }
}

export const connectWallet = async () => {
  try {
    const { ethereum } = window
    if (!ethereum) {
      console.log(`metamask not install`)
      return
    }
    const accounts = await ethereum.request({
      method: 'eth_requestAccounts',
    })
    return [accounts[0], Number(ethereum.networkVersion)]
  } catch (err) {
    console.error(err)
  }
}

export const switchEthereumChain = async ({
  chainId,
}: SwitchEthereumChainParameter) => {
  return await window.ethereum?.request({
    method: 'wallet_switchEthereumChain',
    params: [{ chainId: String(chainId) }],
  })
  // window.location.reload()
}

export const isMetaMaskInstalled = () => {
  const { ethereum } = window
  return Boolean(ethereum && (ethereum.isMetaMask || ethereum.isTrust))
}

export const personalSign = async (msg: any) => {
  // 使用小狐狸提供provider
  const provider = getProvider()
  const signer = provider?.getSigner()
  if (signer) {
    const sign = await signer?.signMessage(msg)
    return sign
  } else {
    return Promise.reject('')
  }
}

export const verifyPersonalSign = (sign: string, msg: string) => {
  try {
    const hashMsg = utils.hashMessage(msg)

    const result = utils.recoverAddress(hashMsg, sign)
    return {
      code: 200,
      result,
    }
  } catch (error: any) {
    console.log('verifyPersonalSign.error: ', error.message)
    return {
      code: 500,
      result: error.message,
    }
  }
}

export const formatAddress = (address: string) => {
  if (!address) {
    return address
  }
  return address.substring(0, 6) + '...' + address.substring(address.length - 5)
}

export const getBlockNumber = async () => {
  const { ethereum } = window
  const blockNumber = await ethereum.request({
    method: 'eth_blockNumber',
    params: [],
  })
  return blockNumber
}

export const getContract = (id: number | string) => {
  const provider = getProvider()
  const signer = provider?.getSigner()
  // 2.实例化合约
  const contract = new ethers.Contract(RED_PACKET_CONTRACT(id), abi, signer)
  return {
    contract,
    network: provider?.network,
  }
}

export const getContractApprove = (tokenContract: string) => {
  const provider = getProvider()
  const signer = provider?.getSigner()

  // 2.实例化合约
  const contract = new ethers.Contract(tokenContract, erc20, signer)
  return contract
}

export function isWechat() {
  const ua = window.navigator.userAgent
  return (
    /MicroMessenger/i.test(ua) || ua.includes('lark') || ua.includes('Lark')
  )
}

const defaultLnag = 'en_US'
export function getDefalutLanguage() {
  try {
    const match = window.navigator.userAgent.match(/lang=([^;]*)/) ?? []
    const lang = match[1] ?? defaultLnag
    return lang
  } catch (error) {
    return defaultLnag
  }
}
