<template>
  <div>
    <el-card class="control-bar">
      <div class="header">
        <div class="btn-group">
          <el-button :disabled="currentRow === null" type="primary" icon="el-icon-s-operation" size="mini" @click="controlClick">控制设备</el-button> 
          <el-button :disabled="currentRow === null" type="success" icon="el-icon-video-camera" size="mini" @click="infoClick">摄像信息</el-button> 
        </div>
        <div class="search-group">
          <div style="margin-right:5px;">
            <el-input
              size="mini"
              placeholder="请输入内容"
              @keyup.enter="getList"
              prefix-icon="el-icon-search"
              v-model="listQuery.searchInfo">
            </el-input>
          </div>
          <el-button type="primary" icon="el-icon-search" size="mini" @click="getList">查询</el-button>
        </div>
      </div>
    </el-card>

    <!-- 列表信息 -->
    <el-card class="table">
      <el-table
        :data="list"
        v-loading="listLoading"
        stripe
        height="calc(100vh - 250px)"
        highlight-current-row
        @current-change="handleCurrentChange"
        style="width: 100%">
        <el-table-column
          prop="id"
          label="id"
          width="100">
        </el-table-column>
        <el-table-column
          prop="ip"
          label="ip信息"
          width="">
        </el-table-column>
        <el-table-column
          prop="sendPipe"
          label="发送管道">
        </el-table-column>
        <el-table-column
          prop="receivePipe"
          label="接收管道">
        </el-table-column>
        <el-table-column
          prop="trafficFlow"
          label="车流量">
        </el-table-column>
      </el-table>
    </el-card>
    <!-- /列表信息 -->

    <!-- 控制对话框 -->
    <el-dialog
      title="控制神行者"
      :visible.sync="controlDialogVisible"
      width="700px">
      <div class="content">
        <el-row class="item" type="flex" justify="start" align="center">
          <el-col><el-button size="mini" type="primary">  前进  </el-button></el-col>
          <el-col><el-button size="mini" type="primary">  停止  </el-button></el-col>
        </el-row>
        <el-row class="item" type="flex">
          <el-col><el-button size="mini" type="primary">反向旋转</el-button></el-col>
          <el-col><el-button size="mini" type="primary">拍照识别</el-button></el-col>
        </el-row>
        <el-row class="item" type="flex">
          <el-col><el-button size="mini" type="primary">自动运行</el-button></el-col>
          <el-col><el-button size="mini" type="primary">自动停止</el-button></el-col>
        </el-row>
        <el-row type="flex">
          <el-col><el-button size="mini" type="primary">程序退出</el-button></el-col>
        </el-row>
      </div>
      <span slot="footer" class="dialog-footer">
        <el-button size="mini" type="warning" @click="controlDialogVisible = false">关 闭</el-button>
      </span>
    </el-dialog>
    <!-- /控制对话框 -->

    <!-- 信息对话框 -->
    <el-dialog title="摄像信息" v-if="infoDialogTableVisible" width="700px" :visible.sync="infoDialogTableVisible">
      <el-table :data="currentRow.shootInfo" stripe border>
        <el-table-column property="id" label="id" width="100"></el-table-column>
        <el-table-column property="uid" label="摄像序列号" width="200"></el-table-column>
        <el-table-column property="ip" label="ip地址"></el-table-column>
        <el-table-column property="orientation" label="方位"></el-table-column>
      </el-table>
      <span slot="footer" class="dialog-footer">
        <el-button size="mini" type="warning" @click="infoDialogTableVisible = false">关 闭</el-button>
      </span>
    </el-dialog>
    <!-- /信息对话框 -->

    <!-- 分页栏 -->
    <div class="footer">
      <el-pagination
        background
        @size-change="handleSizeChange"
        @current-change="handleCurrentPageChange"
        :current-page="listQuery.currentPage"
        :page-sizes="[100, 200, 300, 400]"
        :page-size="listQuery.pageSize"
        layout="total, sizes, prev, pager, next, jumper"
        :total="listQuery.total">
      </el-pagination>
    </div>
    <!-- 分页栏 -->

  </div>
</template>

<script>
import { request } from '@/network/request'
export default {
    name: 'ControlList',
    data() {
      return {
        list: [],
        listLoading: true,
        currentRow: null,
        listQuery: {
          currentPage: 1,
          pageSize: 100,
          total: 400,
          searchInfo: ''
        },
        infoDialogTableVisible: false,
        controlDialogVisible: false
      }
    },
    created() {
      this.getList()
    },
    methods: {
      /**
       * 获取列表
       */
      getList() {
        request({
          url: 'getControlList',
          data: this.listQuery,
          method: 'post'
        }).then(({data}) => {
          console.log(data);
          this.list = data
          this.listLoading = false
        })
      },
      /**
       * 控制按钮
       */
      controlClick() {
        this.controlDialogVisible = true
      },
      /**
       * 摄像信息按钮
       */
      infoClick() {
        this.infoDialogTableVisible = true
      },  
      /**
       * 选中一行
       */
      handleCurrentChange(row) {
        this.currentRow = row
      },
      /**
       * 改变pagesize
       */
      handleSizeChange() {

      },
      /**
       * 改变页数
       */
      handleCurrentPageChange() {
        this.getList()
      },
    }
}
</script>

<style scoped>
.content {
  text-align: center;
}
.item {
  margin-bottom: 40px;
}
</style>