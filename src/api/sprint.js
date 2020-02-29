import request from '@/utils/request'

export function getSprintList(query) {
  return request({
    url: 'http://localhost:8080/sprints',
    method: 'get',
    params: query
  })
}

export function createSprint(data) {
  return request({
    url: 'http://localhost:8080/sprints',
    method: 'post',
    params: data
  })
}
