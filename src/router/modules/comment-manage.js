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
      path: 'leave',
      component: () => import('@/views/comment-manage/leave'),
      name: '请假管理',
      meta: { title: '请假管理', icon: 'my-role', noCache: true, resources: 'leave' }
    },
    {
      path: 'declare',
      component: () => import('@/views/comment-manage/declare'),
      name: '申报管理',
      meta: { title: '申报管理', icon: 'my-sysmenu', noCache: true, resources: 'declare' }
    },
    // {
    //   path: 'roleSetting/:id(\\d+)',
    //   component: () => import('@/views/comment-manage/roleSetting'),
    //   name: '权限设置',
    //   meta: { title: '权限设置', icon: 'my-role', noCache: true, resources: 'roleSetting' },
    //   hidden: true
    // },
    
  ]
};

export default commentManage
