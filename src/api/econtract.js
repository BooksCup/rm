import request from '@/utils/request'
import { base_url } from '@/utils/config'

// 获取token及配置信息
export function fetchToken(query) {
  return request({
    url: base_url + 'econtract/token',
    method: 'get',
    params: query
  })
}

// 新增token
export function addToken(data) {
  return request({
    url: base_url + 'econtract/token',
    method: 'post',
    params: data
  })
}
