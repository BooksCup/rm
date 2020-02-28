import request from '@/utils/request'

export function login(data) {
  return request({
    url: '/vue-element-admin/user/login',
    method: 'post',
    data
  })
}

export function getInfo(token) {
  return request({
    url: '/vue-element-admin/user/info',
    method: 'get',
    params: {token}
  })
}

export function logout() {
  return request({
    url: '/vue-element-admin/user/logout',
    method: 'post'
  })
}

export function fetchUserList(query) {
  return request({
    url: 'http://localhost:8080/users',
    method: 'get',
    params: query
  })
}

export function createUser(data) {
  return request({
    url: 'http://localhost:8080/users',
    method: 'post',
    params: data
  })
}

export function deleteUser(userId) {
  return request({
    url: 'http://localhost:8080/users/' + userId,
    method: 'delete'
  })
}

export function updateUser(param) {
  return request({
    url: 'http://localhost:8080/users/' + param.id,
    method: 'put',
    params: param
  })
}
