<template>
  <div class="app-container">
    <cus-wraper>
      <cus-filter-wraper>
        <el-input v-model="listQuery.title" placeholder="请输入公告标题" style="width:200px" clearable></el-input>
        <el-button type="primary" @click="getList" icon="el-icon-search">查询</el-button>
        <el-button v-has="'sys:user:add'" type="primary" @click="handleCreate" icon="el-icon-plus">{{ $t('table.add') }}</el-button>
      </cus-filter-wraper>
      <div class="table-container">
        <el-table v-loading="listLoading" :data="list" size="mini" fit element-loading-text="Loading" border
                  highlight-current-row align="center">
          <el-table-column label="公告标题" prop="title" align="center"></el-table-column>
          <el-table-column label="公告详情" prop="content" align="center"></el-table-column>
          <el-table-column label="发布人" prop="createName" align="center"></el-table-column>
          <el-table-column label="发布时间" prop="publishTime" align="center">
            <template slot-scope="scope">
              <span>{{scope.row.publishTime|dateTimeFilter}}</span>
            </template>
          </el-table-column>
          
          <el-table-column align="center" v-if="this.global_checkBtnPermission(['sys:user:edit','sys:user:delete'])" :label="$t('table.actions')">
            <template slot-scope="scope">
              <el-button v-has="'sys:user:edit'" size="mini" type="primary" @click="handleUpdate(scope.row)" icon="el-icon-edit" plain>
                {{ $t('table.edit') }}
              </el-button>
              <cus-del-btn v-has="'sys:user:delete'" @ok="handleDelete(scope.row)"/>
            </template>
          </el-table-column>
        </el-table>
        <!-- 分页 -->
        <cus-pagination v-show="total>0" :total="total" :page.sync="listQuery.page" :limit.sync="listQuery.limit" @pagination="getList"/>
      </div>
      <!-- 弹窗 -->
      <el-dialog :title="titleMap[dialogStatus]" :visible.sync="dialogVisible" width="40%" @close="handleDialogClose">
        <el-form ref="dataForm" :model="form" :rules="rules" class="demo-ruleForm">
          <el-form-item label="公告标题:" prop="title">
            <el-input v-model="form.title"></el-input>
          </el-form-item>
          <el-form-item label="公告内容:" prop="content">
            <el-input v-model="form.content" type="textarea" :rows="7"></el-input>
          </el-form-item>
        </el-form>

        <span slot="footer" class="dialog-footer">
          <el-button @click="dialogVisible = false"> {{ $t('table.cancel') }} </el-button>
          <el-button type="primary" @click="submitForm"> {{ $t('table.confirm') }} </el-button>
        </span>
      </el-dialog>
    </cus-wraper>
  </div>
</template>

<script>
  import { getAnnouncementList, saveAnnouncement,updateAnnouncement, deleteAnnouncement,getAnnouncementById } from '@/api/comment/announcement'

  export default {
    data() {
      return {
        dialogVisible: false,
        list: [],
        sexList: [{ key: '0', display_name: '男' }, { key: '1', display_name: '女' }],
        flagList: [{ key: '1', display_name: '启用' }, { key: '0', display_name: '停用' }],
        listLoading: true,
        total: 0,
        listQuery: {
          page: 1,
          limit: 10,
          type:'admin',
          username: undefined
        },
        input: '',
        form: {
          id: '', //主键ID
          title: '', //标题
          content: '' //内容
        },
        dialogStatus: '',
        titleMap: {
          update: '编辑',
          create: '创建'
        },
        rules: {
            title: [
                {required: true, message: '请输入请假标题', trigger: 'blur'},
            ],
            content: [
                { required: true, message: '请输入请假内容', trigger: 'blur'}
            ]
        }
      }
    },
    created() {
      this.getList()
    },
    methods: {
      getList() {
        this.listLoading = true;
        getAnnouncementList(this.listQuery).then(response => {
          this.list = response.data.records
          this.total = response.data.total
          this.listLoading = false
        })
      },
      handleCreate() {
        this.resetForm()
        this.dialogStatus = 'create'
        this.dialogVisible = true
      },
      handleUpdate(row) {
        this.form = Object.assign({}, row)
        this.dialogStatus = 'update'
        this.dialogVisible = true
      },
      handleDelete(row) {
        let id = row.id
        deleteAnnouncement(id).then(response => {
          if (response.code == 200) {
            this.getList()
            this.submitOk(response.message)
          } else {
            this.submitFail(response.message)
          }
        })
      },
      submitForm() {
        this.$refs.dataForm.validate(valid => {
          if (valid) {
            let callback = (response)=>{
              if (response.code == 200) {
                this.getList()
                this.submitOk(response.message)
                this.dialogVisible = false
              } else {
                this.submitFail(response.message)
              }
            };
            if(this.form.id){
              // 编辑更新
              updateAnnouncement(this.form).then(response => {
                callback(response);
              })
            }else{
              // 添加保存
              saveAnnouncement(this.form).then(response => {
                callback(response);
              })
            }
          }
        })
      },
      resetForm() {
        this.form = {
          id: undefined, //主键ID
          username: undefined, //账号
          pwd: undefined, //登录密码
          nickName: undefined, //昵称
          sex: undefined, //性别 0:男 1:女
          phone: undefined, //手机号码
          email: undefined, //邮箱
          avatar: undefined, //头像
          flag: undefined, //状态
          // gmtCreate: undefined, //创建时间
          // gmtModified: undefined //更新时间
        }
      },
      // 监听dialog关闭时的处理事件
      handleDialogClose() {
        if (this.$refs['dataForm']) {
          this.$refs['dataForm'].clearValidate() // 清除整个表单的校验
        }
      }
    }
  }
</script>
