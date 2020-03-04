import request from '@/utils/request'

export function createBacklog(data) {
  return request({
    url: 'http://localhost:8080/backlogs',
    method: 'post',
    params: data
  })
}

export function fetchBacklogList(query) {
  return request({
    url: 'http://localhost:8080/backlogs',
    method: 'get',
    params: query
  })
}

export function deleteBacklog(backlogId) {
  return request({
    url: 'http://localhost:8080/backlogs/' + backlogId,
    method: 'delete'
  })
}
