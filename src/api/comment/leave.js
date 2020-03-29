import request from '@/utils/request';

export function getLeaveList(query) {
  return request({
    url: '/api/comment/leave',
    method: 'get',
    data: query
  });
}

export function saveLeave(query) {
  return request({
    url: '/api/comment/leave',
    method: 'post',
    data: query
  });
}

export function updateLeave(form) {
  return request({
    url: '/api/comment/leave',
    method: 'put',
    data: form
  });
}

export function deleteLeave(id) {
  return request({
    url: '/api/comment/leave/'+id,
    method: 'delete',
    data: {'id': id}
  });
}

export function getLeaveById(id) {
  return request({
    url: '/api/comment/leave/'+id,
    method: 'get',
    data: {'id': id}
  });
}
