import { Route, Routes, useNavigate } from 'react-router-dom'
import { ConfigProvider, Dialog } from 'react-vant'
import { I18nextProvider } from 'react-i18next'
import Index from './pages/Index'
import i18n from './i18n/i18n'
import { useEffect, useState } from 'react'
import { connectWallet } from './utils/helper'

import { useRegisterSW } from 'virtual:pwa-register/react'
const intervalMS = 60 * 60 * 1000

const themeVars = {}

function App() {
  const updateServiceWorker = useRegisterSW({
    onRegistered(r) {
      r &&
        setInterval(() => {
          r.update()
        }, intervalMS)
    },
  })
  const [num, setCount] = useState<number>(0)
  const navigate = useNavigate()
  useEffect(() => {
    console.log(`[版本号]: __APP_VERSION__`)
    window.ethereum?.on('chainChanged', (chainId: string) => {
      console.log(
        '[useStore] chainChanged 触发了 ',
        chainId,
        window.ethereum.chainId
      )
      console.log('[useStore] 开始跳转...')
      location.reload()
    })

    window.ethereum?.on('accountsChanged', (accounts: Array<string>) => {
      console.log('[useStore] accountsChanged触发了, accouts = ', accounts)
      location.reload()
    })
  }, [])
  return (
    <I18nextProvider i18n={i18n}>
      <div className="App">
        <ConfigProvider themeVars={themeVars}>
          <Routes>
            <Route path="/" element={<Index />}></Route>
          </Routes>
        </ConfigProvider>
      </div>
    </I18nextProvider>
  )
}

export default App
