<template>
  <div>
    <el-card class="control-bar">
      <div class="header">
        <div class="btn-group">
          <el-button :disabled="currentRow===null" type="primary" icon="el-icon-picture-outline" size="mini" @click="photoClick">查看照片</el-button> 
          <el-button type="success" icon="el-icon-upload2" size="mini" @click="fileClick">文件上传</el-button> 
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
        v-loading="listLoading"
        stripe
        height="calc(100vh - 250px)"
        highlight-current-row
        @current-change="handleCurrentChange"
        style="width: 100%">
        <el-table-column
          prop="carId"
          label="车牌号"
          width="">
        </el-table-column>
        <el-table-column
          prop="carSeat"
          label="车位号"
          width="">
        </el-table-column>
        <el-table-column
          prop="disTime"
          label="识别时间">
        </el-table-column>
        <el-table-column
          prop="info"
          label="违停信息">
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
export default {
  name: 'InfoList',
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
      request({
        url: '/getInfoList',
        method: 'post',
        data: this.listQuery
      }).then(({data}) => {
        console.log(data);
        this.list = data
        this.listLoading = false
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
    photoClick() {
      this.photoDialogVisible = true
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
</style>