<template>
  <div class="app-container">
    <cus-wraper>
      <cus-filter-wraper>
        <el-input v-model="listQuery.userName" placeholder="请输入姓名" style="width:200px" clearable></el-input>
        <!-- <el-input v-model="listQuery.month" placeholder="请输入打卡" style="width:200px" clearable></el-input> -->
        <el-button type="primary" @click="getList" icon="el-icon-search">查询</el-button>
        <el-button type="primary" @click="downloadList" icon="el-icon-download">下载打卡记录</el-button>
      </cus-filter-wraper>
      <div class="table-container">
        <el-table v-loading="listLoading" :data="list" size="mini" fit element-loading-text="Loading" border
                  highlight-current-row align="center">
          <el-table-column label="打卡人" prop="userName" align="center"></el-table-column>
          <el-table-column label="打卡时间" prop="time" align="center">
            <template slot-scope="scope">
              <span>{{scope.row.time|dateTimeFilter}}</span>
            </template>
          </el-table-column>
          <el-table-column align="center" :label="$t('table.actions')">
            <template slot-scope="scope">
              <!-- <el-button size="mini" type="primary" @click="handleUpdate(scope.row)" icon="el-icon-edit" plain>
                {{ $t('table.edit') }}
              </el-button> -->
              <cus-del-btn @ok="handleDelete(scope.row)"/>
            </template>
          </el-table-column>
        </el-table>
        <!-- 分页 -->
        <cus-pagination v-show="total>0" :total="total" :page.sync="listQuery.page" :limit.sync="listQuery.limit" @pagination="getList"/>
      </div>
    </cus-wraper>
  </div>
</template>

<script>
  import { getClockingList,deleteClocking,downloadClockingList } from '@/api/comment/clocking'
  export default {
    data() {
      return {
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
      }
    },
    created() {
      this.getList();
    },
    methods: {
      getList() {
        this.listLoading = true;
        getClockingList(this.listQuery).then(response => {
          this.list = response.data.records
          this.total = response.data.total
          this.listLoading = false
        })
      },
      handleDelete(row) {
        let id = row.id
        deleteClocking(id).then(response => {
          if (response.code == 200) {
            this.getList()
            this.submitOk(response.message)
          } else {
            this.submitFail(response.message)
          }
        })
      },
      //   下载打卡记录
      downloadList(){
        downloadClockingList(this.listQuery).then(response => {
            console.log('下载成功');
            setTimeout(()=>{
                this.submitOk('下载成功');
            },200)
        })
      },
    }
  }
</script>
