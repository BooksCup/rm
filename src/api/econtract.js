import request from '@/utils/request'
import { base_url } from '@/utils/config'

// 获取token及配置信息
export function fetchToken(query) {
  return request({
    url: base_url + 'econtractToken',
    method: 'get',
    params: query
  })
}

// 新增token
export function addToken(data) {
  return request({
    url: base_url + 'econtractToken',
    method: 'post',
    params: data
  })
}

// 获取个人账号
export function fetchAccount(query) {
  return request({
    url: base_url + 'econtractAccount',
    method: 'get',
    params: query
  })
}

// 新增个人账号
export function createAccount(data) {
  return request({
    url: base_url + 'econtractAccount',
    method: 'post',
    params: data
  })
}

// 删除个人账号
export function deleteAccount(accountId) {
  return request({
    url: base_url + 'econtractAccount/' + accountId,
    method: 'delete'
  })
}

// 编辑用户
export function updateAccount(param) {
  return request({
    url: base_url + 'econtractAccount/' + param.id,
    method: 'put',
    params: param
  })
}

