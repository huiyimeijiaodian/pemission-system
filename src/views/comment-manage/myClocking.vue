<template>
  <div class="app-container">
    <cus-wraper>
      <cus-filter-wraper>
        <el-button type="primary" @click="toClocking" icon="el-icon-date" :disabled="clockingStatus!=2">
          {{clockingStatus==2?'立即打卡':(clockingStatus==1?'已打卡':'暂不能打卡')}}
        </el-button>
        <p style="color:#888;font-size:12px;">打卡时间段：7:30-8:45、12:00-12:30、13:30-14:00 和 17:30-22:30</p>
      </cus-filter-wraper>
      <div class="table-container">
        <el-table
          v-loading="listLoading"
          :data="list"
          size="mini"
          fit
          element-loading-text="Loading"
          border
          highlight-current-row
          align="center"
        >
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
              </el-button>-->
              <cus-del-btn @ok="handleDelete(scope.row)" />
            </template>
          </el-table-column>
        </el-table>
        <!-- 分页 -->
        <cus-pagination
          v-show="total>0"
          :total="total"
          :page.sync="listQuery.page"
          :limit.sync="listQuery.limit"
          @pagination="getList"
        />
      </div>
    </cus-wraper>
  </div>
</template>

<script>
import {
  getClockingList,
  deleteClocking,
  saveClocking,
  getClockingStatus,
  downloadClockingList
} from "@/api/comment/clocking";
export default {
  data() {
    return {
      clockingStatus:2,//打卡状态
      list: [],
      listLoading: true,
      total: 0,
      listQuery: {
        page: 1,
        limit: 20,
        type: "common",
        username: undefined
      },
      input: ""
    };
  },
  created() {
    this.getList();
    this.getStatus();
  },
  methods: {
    getList() {
      this.listLoading = true;
      getClockingList(this.listQuery).then(response => {
        this.list = response.data.records;
        this.total = response.data.total;
        this.listLoading = false;
      });
    },
    getStatus() {
      getClockingStatus().then(response => {
        this.clockingStatus = response.data.status;
      });
    },
    handleDelete(row) {
      let id = row.id;
      deleteClocking(id).then(response => {
        if (response.code == 200) {
          this.getList();
          this.submitOk(response.message);
        } else {
          this.submitFail(response.message);
        }
      });
    },
    //   去打卡
    toClocking() {
        saveClocking().then(response => {
           this.submitOk("打卡成功！");
           this.getList();
           this.clockingStatus=1;
        });
    },
    //   下载打卡记录
    downloadList() {
      downloadClockingList(this.listQuery).then(response => {
        console.log("下载成功");
        setTimeout(() => {
          this.submitOk("下载成功");
        }, 200);
      });
    }
  }
};
</script>
