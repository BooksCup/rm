import request from '@/utils/request'

export function fetchOptions(query) {
  return request({
    url: 'http://localhost:8080/options',
    method: 'get',
    params: query
  })
}
