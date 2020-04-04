<template>
  <div class="app-container">
    <cus-wraper>
      <cus-filter-wraper>
        <el-input v-model="listQuery.userName" placeholder="请输入绩效成员" style="width:200px" clearable></el-input>
        <el-input v-model="listQuery.month" placeholder="请输入绩效月份" style="width:200px" clearable></el-input>
        <el-button type="primary" @click="getList" icon="el-icon-search">查询</el-button>
        <el-button v-has="'sys:user:add'" type="primary" @click="handleCreate" icon="el-icon-plus">{{ $t('table.add') }}</el-button>
      </cus-filter-wraper>
      <div class="table-container">
        <el-table v-loading="listLoading" :data="list" size="mini" fit element-loading-text="Loading" border
                  highlight-current-row align="center">
          <el-table-column label="绩效成员" prop="userName" align="center"></el-table-column>
          <el-table-column label="绩效月份" prop="month" align="center"></el-table-column>
          <el-table-column label="绩效等级" prop="grade" align="center">
            <template slot-scope="scope">
              <el-tag :type="gradeIconMap[scope.row.grade]" hit>
                {{ gradeMap[scope.row.grade]}}
              </el-tag>
            </template>
          </el-table-column>
          <el-table-column align="center" :label="$t('table.actions')">
            <template slot-scope="scope">
              <el-button size="mini" type="primary" @click="handleUpdate(scope.row)" icon="el-icon-edit" plain>
                {{ $t('table.edit') }}
              </el-button>
              <cus-del-btn @ok="handleDelete(scope.row)"/>
            </template>
          </el-table-column>
        </el-table>
        <!-- 分页 -->
        <cus-pagination v-show="total>0" :total="total" :page.sync="listQuery.page" :limit.sync="listQuery.limit" @pagination="getList"/>
      </div>
      <!-- 弹窗 -->
      <el-dialog :title="titleMap[dialogStatus]" :visible.sync="dialogVisible" width="42%" @close="handleDialogClose">
        <el-form ref="dataForm" :model="form" :rules="rules" class="demo-ruleForm" label-width="100px">
          <el-form-item label="绩效成员:" prop="name">
            <el-select v-model="form.userId" placeholder="请选择" style="width:100%" :disabled="dialogStatus=='update'">
              <el-option
                v-for="item in userList"
                :key="item.id"
                :label="item.username"
                :value="item.id">
              </el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="绩效月份:" prop="month">
            <el-date-picker style="width:100%" :disabled="dialogStatus=='update'"
              v-model="form.month"
              type="month"
              format="yyyy 年 MM 月"
              value-format="yyyy年MM月"
              placeholder="选择月">
            </el-date-picker>
          </el-form-item>
          <el-form-item label="绩效等级:" prop="grade">
            <el-select v-model="form.grade" placeholder="请选择" style="width:100%">
              <el-option
                v-for="item in statusSptions"
                :key="item.value"
                :label="item.label"
                :value="item.value">
              </el-option>
            </el-select>
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
  import { getPerformanceList, savePerformance,updatePerformance,deletePerformance } from '@/api/comment/performance'
  import { getSysUserPage } from '@/api/system/user'
  export default {
    data() {
      return {
        dialogVisible: false,
        list: [],
        listLoading: true,
        total: 0,
        listQuery: {
          page: 1,
          limit: 20,
          type:'admin',
          username: undefined
        },
        input: '',
        form: {
          id: '', //主键ID
          userName: '', //用户
          userId: '', //用户id
          grade: '', //等级
          month: '' //月份
        },
        dialogStatus: '',
        titleMap: {
          update: '编辑',
          create: '创建',
        },
        statusSptions:[
          {value: '', label: '绩效等级'},
          {value: '1', label: '优秀'},
          {value: '2', label: '良好'},
          {value: '3', label: '一般'},
          {value: '4', label: '不及格'}
        ],
        gradeIconMap:{
          '1':'success',
          '2':'primary',
          '3':'warning',
          '4':'danger',
        },
        gradeMap:{
          '1':'优秀',
          '2':'良好',
          '3':'一般',
          '4':'不及格',
        },
        userList:[],
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
      this.getList();
      this.getUserList();
    },
    methods: {
      getList() {
        this.listLoading = true;
        getPerformanceList(this.listQuery).then(response => {
          this.list = response.data.records
          this.total = response.data.total
          this.listLoading = false
        })
      },
      getUserList() { //用户列表
        getSysUserPage({
          page: 1,
          limit: 100,
        }).then(response => {
          this.userList = response.data.records
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
        deletePerformance(id).then(response => {
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
              updatePerformance(this.form).then(response => {
                callback(response);
              })
            }else{
              // 添加保存
              savePerformance(this.form).then(response => {
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
