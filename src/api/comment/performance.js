import request from '@/utils/request';
import qs from 'qs';

export function getPerformanceList(query) {
  return request({
    url: '/api/comment/performance?'+qs.stringify(query),
    method: 'get'
  });
}

export function savePerformance(query) {
  return request({
    url: '/api/comment/performance',
    method: 'post',
    data: query
  });
}

export function updatePerformance(form) {
  return request({
    url: '/api/comment/performance',
    method: 'put',
    data: form
  });
}

export function deletePerformance(id) {
  return request({
    url: '/api/comment/performance/'+id,
    method: 'delete',
    data: {'id': id}
  });
}

export function getPerformanceById(id) {
  return request({
    url: '/api/comment/performance/'+id,
    method: 'get',
    data: {'id': id}
  });
}
