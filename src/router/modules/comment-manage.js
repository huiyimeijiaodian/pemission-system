/** When your routing table is too long, you can split it into small modules**/

import Layout from '@/views/layout/Layout'

const commentManage = {
  path: '/commentManage',
  component: Layout,
  alwaysShow: true,
  name: '应用模块',
  redirect: 'noredirect',
  meta: {
    title: '应用模块',
    icon: 'component',
    resources: 'comment'
  },
  children: [
    {
      path: 'announcement',
      component: () => import('@/views/comment-manage/announcement'),
      name: '公告',
      meta: { title: '公告', icon: 'my-user', noCache: true, resources: 'announcement' }
    },
    {
      path: 'announcementList',
      component: () => import('@/views/comment-manage/announcementList'),
      name: '公告预览',
      meta: { title: '公告预览', icon: 'my-user', noCache: true, resources: 'announcementList' }
    },
    {
      path: 'leave',
      component: () => import('@/views/comment-manage/leave'),
      name: '请假管理',
      meta: { title: '请假管理', icon: 'my-role', noCache: true, resources: 'leave' }
    },
    {
      path: 'myLeave',
      component: () => import('@/views/comment-manage/myLeave'),
      name: '我的请假',
      meta: { title: '我的请假', icon: 'my-role', noCache: true, resources: 'myLeave' }
    },
    {
      path: 'declare',
      component: () => import('@/views/comment-manage/declare'),
      name: '申报管理',
      meta: { title: '申报管理', icon: 'my-sysmenu', noCache: true, resources: 'declare' }
    },
    {
      path: 'myDeclare',
      component: () => import('@/views/comment-manage/myDeclare'),
      name: '我的申报',
      meta: { title: '我的申报', icon: 'my-sysmenu', noCache: true, resources: 'myDeclare' }
    },
    {
      path: 'clocking',
      component: () => import('@/views/comment-manage/clocking'),
      name: '打卡管理',
      meta: { title: '打卡管理', icon: 'table', noCache: true, resources: 'clocking' },
    },
    {
      path: 'myClocking',
      component: () => import('@/views/comment-manage/myClocking'),
      name: '我的打卡',
      meta: { title: '我的打卡', icon: 'table', noCache: true, resources: 'myClocking' },
    },
    {
      path: 'performance',
      component: () => import('@/views/comment-manage/performance'),
      name: '绩效管理',
      meta: { title: '绩效管理', icon: 'my-file', noCache: true, resources: 'performance' },
    },
    {
      path: 'myPerformance',
      component: () => import('@/views/comment-manage/myPerformance'),
      name: '我的绩效',
      meta: { title: '我的绩效', icon: 'my-file', noCache: true, resources: 'myPerformance' },
    },
    {
      path: '',
      component: () => import('@/views/comment-manage/group'),
      name: '用户组',
      meta: { title: '用户组', icon: 'my-role', noCache: true, resources: 'group' },
    }
  ]
};

export default commentManage
