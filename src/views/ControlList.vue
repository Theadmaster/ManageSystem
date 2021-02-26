<template>
  <div>
    <el-card class="control-bar">
      <div class="header">
        <div class="btn-group">
            <el-button type="success" icon="el-icon-plus" size="mini" @click="addClick">新建</el-button> 
            <el-button :disabled="listSelection.length !== 1" type="warning" icon="el-icon-edit" size="mini" @click="editClick">编辑</el-button> 
            <el-button :disabled="listSelection.length === 0" type="danger" icon="el-icon-delete" size="mini" @click="deleteClick(listSelection[0])">删除</el-button> 
            <el-button type="primary" icon="el-icon-upload" size="mini" @click="inputClick">导入</el-button> 
            <el-button :disabled="listSelection.length === 0" type="info" icon="el-icon-download" size="mini" @click="exportClick">导出</el-button> 
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
        :ref="tableKey"
        :key="tableKey"
        v-loading="listLoading"
        stripe
        height="calc(100vh - 250px)"
        highlight-current-row
        @selection-change="s => listSelection = s"
        @row-click="row => $refs[tableKey].toggleRowSelection(row, !listSelection.includes(row))"
        style="width: 100%">
        <el-table-column
          type="selection"
          width="55">
        </el-table-column>
        <el-table-column
          prop="id"
          label="id"
          width="100">
        </el-table-column>
        <el-table-column
          prop="name"
          label="供应商名称"
          width="">
        </el-table-column>
        <el-table-column
          prop="linkman"
          label="联系人">
        </el-table-column>
        <el-table-column
          prop="phoneNum"
          label="联系电话">
        </el-table-column>
        <el-table-column
          prop="address"
          label="地址">
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

    <!-- 文件上传对话框 -->
    <el-dialog
      title="文件上传"
      :visible.sync="fileDialogVisible"
      width="400px"
      >
      <el-upload
        class="upload-demo"
        drag
        action="https://jsonplaceholder.typicode.com/posts/"
        multiple>
        <i class="el-icon-upload"></i>
        <div class="el-upload__text">将文件拖到此处，或<em>点击上传</em></div>
        <div class="el-upload__tip" slot="tip">只能上传jpg/png文件，且不超过500kb</div>
      </el-upload>
      <span slot="footer" class="dialog-footer">
        <!-- <el-button @click="fileDialogVisible = false">取 消</el-button> -->
        <el-button size="mini" type="primary" @click="fileDialogVisible = false">确 定</el-button>
      </span>
    </el-dialog>
    <!-- 文件上传对话框 -->

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
        tableKey: 0,
        listSelection: [],
        fileDialogVisible: false,
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
          url: '/employee/supplier?employeeNo=10001',
          method: 'get'
        }).then(({list}) => {
          console.log(list);
          this.list = list[0].list.concat(list[1].list)
          let count = 1
          this.list.map(item => item.id=count++)
          console.log(this.list);
          this.listLoading = false
        }).catch(err => {
          console.log(err)
        })
      },
      /**
       * 控制按钮
       */
      addClick() {
        this.controlDialogVisible = true
      },
      /**
       * 摄像信息按钮
       */
      editClick() {
        this.infoDialogTableVisible = true
      },  
      deleteClick(){
        this.$confirm(`删除后无法撤销，确定删除当前选中的${this.listSelection.length}条数据?`, '提示', { type: 'warning' }).then(() => {
          // request({})
        })
      },
      inputClick() {
        this.fileDialogVisible = true
      },
      exportClick() {

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