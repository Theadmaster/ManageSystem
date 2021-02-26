<template>
  <div>
    <el-card class="control-bar">
      <div class="header">
        <div class="btn-group">
            <el-button type="success" icon="el-icon-plus" size="mini" @click="addClick">新建</el-button> 
            <el-button :disabled="listSelection.length !== 1" type="warning" icon="el-icon-edit" size="mini" @click="editClick">编辑</el-button> 
            <el-button :disabled="listSelection.length === 0" type="danger" icon="el-icon-delete" size="mini" @click="deleteClick(listSelection[0])">删除</el-button> 
            <el-button type="primary" icon="el-icon-upload" size="mini" @click="fileClick">导入</el-button> 
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
    <!-- 列表栏 -->
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
           type="expand">
            <template slot-scope="props">
              <el-form label-position="left" inline class="demo-table-expand">
                <el-form-item label="货单编号:">
                  <span>{{ props.row.id }}</span>
                </el-form-item>
                
                <el-form-item label="发货单位:">
                  <span>{{ props.row.name }}</span>
                </el-form-item>
                <el-form-item label="收货单位:">
                  <span>上海好安健客科技有限公司</span>
                  <!-- <span>C320287879</span> -->
                </el-form-item>
                <el-form-item label="地址:">
                  <span>{{ props.row.address }}</span>
                </el-form-item>
                <el-form-item label="发货方联系人:">
                  <span>{{ props.row.linkman }}</span>
                </el-form-item>
                
                <el-form-item label="发货方联系电话:">
                  <span>{{ props.row.phoneNum }}</span>
                </el-form-item>
                <el-form-item label="收货方联系人:">
                  <span>费丽娟</span>
                </el-form-item>
                <el-form-item label="收获方联系电话:">
                  <span>15834853454</span>
                </el-form-item>
                <el-form-item label="发货方经营许可证:">
                  <span>粤B0918</span>
                </el-form-item>
                <el-form-item label="收货方经营许可证:">
                  <span>浙嘉食药监械经营许20180026号</span>
                </el-form-item>
                <el-form-item label="货品数量:">
                  <span>{{ props.row.inspectedNum }}套</span>
                </el-form-item>
                <el-form-item label="日期:">
                  <span>{{ props.row.date }}</span>
                </el-form-item>
              </el-form>
            </template>
          </el-table-column>
        <el-table-column
          prop="id"
          label="货单编号"
          width="100">
        </el-table-column>
        <el-table-column
          prop="name"
          label="发货单位"
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
          prop="date"
          label="日期">
        </el-table-column>
        <el-table-column
          prop="address"
          label="地址">
        </el-table-column>
        <el-table-column
          prop="inspectNum"
          label="未检数目">
        </el-table-column>
        <el-table-column
          prop="inspectedNum"
          label="已检数目">
        </el-table-column>
      </el-table>
    </el-card>
    <!-- /列表栏 -->

    <!-- 查看图片对话框 -->
    <el-dialog
      v-if="photoDialogVisible"
      :title="currentRow.carId"
      :visible.sync="photoDialogVisible"
      width="700px"
      >
      <div class="content">
        <img :src="currentRow.photoUrl" alt="">
      </div>
      <div class="content-text">
        <span>{{currentRow.disTime}}</span>
      </div>
      
    </el-dialog>
    <!-- /查看图片对话框 -->

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
        <!-- <el-button size="mini" @click="fileDialogVisible = false">取 消</el-button> -->
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
import qs from 'qs'
export default {
  name: 'InfoList',
  data() {
    return {
      list: [],
      listLoading: true,
      currentRow: null,
      tableKey: 0,
      listSelection: [],
      listQuery: {
        currentPage: 1,
        pageSize: 100,
        total: 400,
        searchInfo: ''
      },
      photoDialogVisible: false,
      fileDialogVisible: false
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
      // request({
      //   url: '/getInfoList',
      //   method: 'post',
      //   data: this.listQuery
      // }).then(({data}) => {
      //   console.log(data);
      //   this.list = data
      //   this.listLoading = false
      // })
      request({
          url: '/employee/supplier?employeeNo=10001',
          method: 'get'
        }).then(({list}) => {
          console.log(list);
          this.list = list[0].list.concat(list[1].list)
          console.log(this.list);
          this.listLoading = false
        }).catch(err => {
          console.log(err)
        })
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
    /**
     * 查看照片
     */
    addClick() {
      this.photoDialogVisible = true
    },
    editClick() {

    },
    deleteClick() {
     this.$confirm(`删除后无法撤销，确定删除当前选中的${this.listSelection.length}条数据?`, '提示', { type: 'warning' }).then(() => {
          // request({})
        })
    },
    exportClick() {

    },
    /**
     * 上传文件
     */
    fileClick() {
      this.fileDialogVisible = true
    },
    /**
     * 选中一行
     */
    handleCurrentChange(row) {
      this.currentRow = row
    }
  }
}
</script>

<style scoped>
.content {
  text-align: center;
}

.content img {
  width: 600px;
}

.content-text {
  margin: 30px 30px 0 30px;
}
  .demo-table-expand {
    font-size: 0;
  }
  .demo-table-expand label {
    width: 90px;
    color: #99a9bf;
  }
  .demo-table-expand .el-form-item {
    margin-right: 0;
    margin-bottom: 0;
    width: 50%;
    /* background-color: #f5f6fa; */
  }
</style>