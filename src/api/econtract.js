import request from '@/utils/request'
import { base_url } from '@/utils/config'

// 获取用户列表
export function fetchToken(query) {
  return request({
    url: base_url + 'econtract/token',
    method: 'get',
    params: query
  })
}
