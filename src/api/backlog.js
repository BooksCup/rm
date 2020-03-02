import request from '@/utils/request'

export function createBacklog(data) {
  return request({
    url: 'http://localhost:8080/backlogs',
    method: 'post',
    params: data
  })
}
