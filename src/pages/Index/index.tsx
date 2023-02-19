import { connectWallet, personalSign } from '@/utils/helper'
import React, { useEffect, useState } from 'react'
import { Button, Input, Cell } from 'react-vant'
import './index.less'

const Index = () => {
  const [account, setAccount] = useState('')
  const [chainId, setChainId] = useState('')
  const [sign, setSign] = useState('')
  const [signRes, setSignRes] = useState('')
  useEffect(() => {
    connectWallet().then(([account, chainId]: any) => {
      setAccount(account)
      setChainId(chainId)
    })
  }, [])
  return (
    <div className="index">
      <h4>钱包地址：{account}</h4>
      <h4>链ID：{chainId}</h4>
      <h4>签名结果：{signRes}</h4>
      <Cell>
        <Input
          type="number"
          defaultValue={sign}
          placeholder="请输入签名"
          onChange={(e) => {
            setSign(e)
          }}
        ></Input>
      </Cell>
      <div>
        <Button
          type="primary"
          onClick={async () => {
            if (sign) {
              try {
                const res = await personalSign(Number(sign))
                setSignRes(res)
              } catch (error) {
                setSignRes(JSON.stringify(error))
              }
            }
          }}
        >
          发起签名
        </Button>
      </div>
    </div>
  )
}

export default Index
