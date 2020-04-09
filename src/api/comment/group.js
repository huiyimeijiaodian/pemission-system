import request from '@/utils/request';

export function getGroupList(query) {
  return request({
    url: '/api/comment/group',
    method: 'get',
    data: query
  });
}

export function saveGroup(query) {
  return request({
    url: '/api/comment/group',
    method: 'post',
    data: query
  });
}

export function updateGroup(query) {
  return request({
    url: '/api/comment/group',
    method: 'put',
    data: query
  });
}

export function deleteGroup(id) {
  return request({
    url: '/api/comment/group'+id,
    method: 'delete',
    data: {'id': id}
  });
}

export function getGroupById(id) {
  return request({
    url: '/api/comment/group/'+id,
    method: 'get',
    data: {'id': id}
  });
}