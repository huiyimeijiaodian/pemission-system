<template>
  <div class="app-container">
    <cus-wraper>
      <cus-filter-wraper>
        <el-input v-model="listQuery.month" placeholder="请输入绩效月份" style="width:200px" clearable></el-input>
        <el-button type="primary" @click="getList" icon="el-icon-search">查询</el-button>
      </cus-filter-wraper>
      <h5 style="margin-top:0">我的绩效：</h5>
      <div class="table-container">
        <el-table v-loading="listLoading" :data="list" size="mini" fit element-loading-text="Loading" border
                  highlight-current-row align="center">
          <el-table-column label="绩效月份" prop="month" align="center"></el-table-column>
          <el-table-column label="绩效成员" prop="userName" align="center"></el-table-column>
          <el-table-column label="绩效等级" prop="grade" align="center">
            <template slot-scope="scope">
              <el-tag :type="gradeIconMap[scope.row.grade]" hit>
                {{ gradeMap[scope.row.grade]}}
              </el-tag>
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
  import { getPerformanceList } from '@/api/comment/performance'

  export default {
    data() {
      return {
        list: [],
        listLoading: true,
        total: 0,
        listQuery: {
          page: 1,
          limit: 20,
          type:'common',
          username: undefined
        },
        input: '',
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
        }
      }
    },
    created() {
      this.getList()
    },
    methods: {
      getList() {
        this.listLoading = true;
        console.log(this.listQuery);
        getPerformanceList(this.listQuery).then(response => {
          this.listLoading = false;
          this.list = response.data.records
          this.total = response.data.total
        })
      },
    }
  }
</script>
