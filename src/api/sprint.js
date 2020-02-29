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

export function updateSprint(param) {
  return request({
    url: 'http://localhost:8080/sprints/' + param.id,
    method: 'put',
    params: param
  })
}

export function deleteSprint(userId) {
  return request({
    url: 'http://localhost:8080/sprints/' + userId,
    method: 'delete'
  })
}
