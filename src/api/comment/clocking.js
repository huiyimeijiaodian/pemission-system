import request from '@/utils/request';
import qs from 'qs';

export function getClockingList(query) {
  return request({
    url: '/api/comment/clockingIn?'+qs.stringify(query),
    method: 'get',
    data: query
  });
}

export function saveClocking(query) {
  return request({
    url: '/api/comment/clockingIn',
    method: 'post',
    data: query
  });
}

export function updateClocking(form) {
  return request({
    url: '/api/comment/clockingIn',
    method: 'put',
    data: form
  });
}

export function deleteClocking(id) {
  return request({
    url: '/api/comment/clockingIn/'+id,
    method: 'delete',
    data: {'id': id}
  });
}

export function getClockingById(id) {
  return request({
    url: '/api/comment/clockingIn/'+id,
    method: 'get',
    data: {'id': id}
  });
}

export function downloadClockingList(query) {
  return new Promise((resolve,reject)=>{
    window.location.href='http://120.79.229.169:9101/api/comment/clockingIn/download?'+qs.stringify(query);
    resolve();
  })
}

export function getClockingStatus() {
  return request({
    url: '/api/comment/clockingIn/status',
    method: 'get',
  });
}