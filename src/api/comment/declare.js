import request from '@/utils/request';

export function getDeclareList(query) {
  return request({
    url: '/api/comment/declare',
    method: 'get',
    data: query
  });
}

export function saveDeclare(query) {
  return request({
    url: '/api/comment/declare',
    method: 'post',
    data: query
  });
}

export function updateDeclare(form) {
  return request({
    url: '/api/comment/declare',
    method: 'put',
    data: form
  });
}

export function deleteDeclare(id) {
  return request({
    url: '/api/comment/declare/'+id,
    method: 'delete',
    data: {'id': id}
  });
}

export function getDeclareById(id) {
  return request({
    url: '/api/comment/declare/'+id,
    method: 'get',
    data: {'id': id}
  });
}
