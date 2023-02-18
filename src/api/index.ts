import httpClient from '@/httpClient'

/**
 * 获取首页数据
 * 联调成功 ✅
 */

export function getTokens(params: any) {
  return httpClient.request({
    url: '',
    method: 'post',
    data: params,
  })
}
