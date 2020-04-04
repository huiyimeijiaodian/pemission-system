<template>
  <div class="app-container">
    <cus-wraper>
      <cus-filter-wraper>
        <el-input v-model="listQuery.title" placeholder="请输入公告标题" style="width:200px" clearable></el-input>
        <el-button type="primary" @click="getList" icon="el-icon-search">查询</el-button>
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
          
          <!-- <el-table-column align="center" v-if="this.global_checkBtnPermission(['sys:user:edit','sys:user:delete'])" :label="$t('table.actions')">
            <template slot-scope="scope">
              <el-button v-has="'sys:user:edit'" size="mini" type="primary" @click="handleUpdate(scope.row)" plain>
                {{ $t('table.detail') }}
              </el-button>
            </template>
          </el-table-column> -->
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
      </el-dialog>
    </cus-wraper>
  </div>
</template>

<script>
  import { getAnnouncementList,getAnnouncementById } from '@/api/comment/announcement'

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
          type:'common',
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
      handleUpdate(row) {
        this.form = Object.assign({}, row)
        this.dialogStatus = 'update'
        this.dialogVisible = true
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
