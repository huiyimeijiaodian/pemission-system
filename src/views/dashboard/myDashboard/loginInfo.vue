<template>
  <div class="dashboard-editor-container" style="padding: 20px;background: #f2f2f2;">

    <el-row :gutter="24">
      <el-col :span="14">
        <el-card class="box-card">
          <div slot="header" class="clearfix">
            <span style="padding-top:10px;display:inline-block;">登陆用户</span>
            <el-button type="primary" @click="handleUpdate()" icon="el-icon-edit" plain style="float:right;">
              修改个人信息
            </el-button>
          </div>
          <div style="width: 160px;display: inline-block;float: left">
            <pan-thumb :image="avatar" style="float: left">
              Your roles:
              <span v-for="item in roles" :key="item" class="pan-info-roles">{{ item }}</span>
            </pan-thumb>
          </div>
          <div style="display: inline-block;float: left;margin-left: 20px;margin-top: 20px">
            <table>
              <tr class="userinfo-row">
                <td class="userinfo-lable">
                  角色
                </td>
                <td class="userinfo-content">
                  <span v-for="item in roles" :key="item" style="display: inline-block;margin-right: 5px">{{ item
                    }}</span>
                </td>
                <td class="userinfo-lable">
                  性别
                </td>
                <td class="userinfo-content">
                  {{ sex==1?'女':'男' }}
                </td>
              </tr>
              <tr class="userinfo-row">
                <td class="userinfo-lable">
                  账号
                </td>
                <td class="userinfo-content">
                  {{ name }}
                </td>
                <td class="userinfo-lable">
                  手机
                </td>
                <td class="userinfo-content">
                  {{ phone?phone:'无' }}
                </td>
              </tr>
              <tr class="userinfo-row">
                <td class="userinfo-lable">
                  昵称
                </td>
                <td class="userinfo-content">
                  {{ introduction }}
                </td>
                <td class="userinfo-lable">
                  邮箱
                </td>
                <td class="userinfo-content">
                  {{ email?email:'无' }}
                </td>
              </tr>
            </table>
          </div>
        </el-card>
      </el-col>
    </el-row>

    <!-- 修改个人信息 -->
    <el-dialog :title="titleMap[dialogStatus]" :visible.sync="dialogVisible" width="40%" @close="handleDialogClose">
      <el-form ref="dataForm" :model="form" label-width="80px" class="demo-ruleForm">
        <el-form-item label="账号:" prop="username">
          <el-input v-model="form.username"></el-input>
        </el-form-item>
        <el-form-item label="登录密码:" prop="pwd">
          <el-input v-model="form.pwd"></el-input>
        </el-form-item>
        <el-form-item label="昵称:" prop="nickName">
          <el-input v-model="form.nickName"></el-input>
        </el-form-item>
        <el-form-item label="性别:" prop="sex">
          <el-select v-model="form.sex" placeholder='请选择' @change="sexOnChange" style="width: 100%;">
            <el-option 
              v-for="item in sexList" 
              :key="item.value" 
              :label="item.label"
              :value="item.value">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="手机:" prop="phone">
          <el-input v-model="form.phone"></el-input>
        </el-form-item>
        <el-form-item label="邮箱:" prop="email">
          <el-input v-model="form.email"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
          <el-button @click="dialogVisible = false"> {{ $t('table.cancel') }} </el-button>
          <el-button type="primary" @click="submitForm"> {{ $t('table.confirm') }} </el-button>
        </span>
    </el-dialog>

  </div>
</template>

<script>

  import { getServerInfo } from '@/api/dashboard'
  import TransactionTable from '../admin/components/TransactionTable'
  import { mapGetters } from 'vuex'
  import PanThumb from '@/components/PanThumb'
  import { updatePersonalInfo } from '@/api/system/user'

  export default {
    name: 'DashboardEditor',
    components: { PanThumb, TransactionTable },
    data() {
      return {
        emptyGif: 'https://wpimg.wallstcn.com/0e03b7da-db9e-4819-ba10-9016ddfdaed3',
        form: {
          id: undefined, //主键ID
          username: undefined, //账号
          pwd: undefined, //登录密码
          nickName: undefined, //昵称
          phone: undefined, //手机
          email: undefined, //邮箱
          sex: '', //性别
        },
        dialogVisible: false,
        dialogStatus: '',
        titleMap: {
          update: '修改个人信息',
          create: '创建'
        },
        sexList:[
          {value:'0',label:'男'},
          {value:'1',label:'女'}
        ]
      }
    },
    computed: {
      ...mapGetters([
        'id',
        'name',
        'avatar',
        'roles',
        'introduction',
        'phone',
        'email',
        'sex'
      ])
    },
    created() {
    },
    methods: {
      handleUpdate(row) {
        this.form = Object.assign({}, row)
        this.form.id = this.id
        this.form.username = this.name
        this.form.nickName = this.introduction
        this.form.phone = this.phone
        this.form.email = this.email
        this.form.sex = this.sex
        this.dialogStatus = 'update'
        this.dialogVisible = true
      },
      sexOnChange(item){
        this.$forceUpdate();
      },
      submitForm() {
        this.$refs.dataForm.validate(valid => {
          if (valid) {
            updatePersonalInfo(this.form).then(response => {
              if (response.code == 200) {
                this.submitOk(response.message)
                // this.$store.commit('SET_INTRODUCTION',this.form.nickName);
                // this.$store.commit('SET_NAME',this.form.username);
                setTimeout(()=>{
                  this.dialogVisible = false
                  window.location.reload()
                },100)
              } else {
                this.submitFail(response.message)
              }
            }).catch(err => {
              console.log(err)
            })
          }
        })
      },
      // 监听dialog关闭时的处理事件
      handleDialogClose() {
        if (this.$refs['dataForm']) {
          this.$refs['dataForm'].clearValidate() // 清除整个表单的校验
        }
      }
    },
  }
</script>

<style rel="stylesheet/scss" lang="scss" scoped>

  .userinfo-row {
    height: 50px;
  }

  .userinfo-lable {
    display: inline-block;
    font-size: 20px;
    font-weight: bold;
    text-align: right;;
    margin-right: 10px;
    align: right;
    width: 80px;
  }

  .userinfo-content {
    display: inline-block;
    font-size: 20px;
  }

  .emptyGif {
    display: block;
    width: 45%;
    margin: 0 auto;
  }

  .dashboard-editor-container {
    background-color: #e3e3e3;
    min-height: 100vh;
    padding: 50px 60px 0px;
    .pan-info{
      display: flex;
      align-items: center;
      justify-content: center;
    }
    .pan-info-roles {
      display: block;
      padding-top: 10px;
      font-size: 16px;
      font-weight: 700;
      color: #333;
    }

    .info-container {
      position: relative;
      margin-left: 190px;
      height: 150px;
      line-height: 200px;

      .display_name {
        font-size: 48px;
        line-height: 48px;
        color: #212121;
        position: absolute;
        top: 25px;
      }
    }
  }

</style>
