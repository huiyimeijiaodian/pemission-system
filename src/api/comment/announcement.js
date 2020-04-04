import request from '@/utils/request';
import qs from 'qs';

export function getAnnouncementList(query) {
  return request({
    url: '/api/comment/announcement?'+qs.stringify(query),
    method: 'get',
    data: query
  });
}

export function saveAnnouncement(query) {
  return request({
    url: '/api/comment/announcement',
    method: 'post',
    data: query
  });
}

export function updateAnnouncement(form) {
  return request({
    url: '/api/comment/announcement',
    method: 'put',
    data: form
  });
}

export function deleteAnnouncement(id) {
  return request({
    url: '/api/comment/announcement/'+id,
    method: 'delete',
    data: {'id': id}
  });
}

export function getAnnouncementById(id) {
  return request({
    url: '/api/comment/announcement/'+id,
    method: 'get',
    data: {'id': id}
  });
}
