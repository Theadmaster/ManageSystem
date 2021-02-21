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

      <!-- 表格 -->
      <el-card class="table">
        <el-table
          :data="list"
          v-loading="listLoading"
          :ref="tableKey"
          :key="tableKey"
          stripe
          height="calc(100vh - 250px)"
          tooltip-effect="dark"
          highlight-current-row
          @selection-change="s => listSelection = s"
          @row-click="row => $refs[tableKey].toggleRowSelection(row, !listSelection.includes(row))"
          style="width: 100%">
          <el-table-column
            type="selection"
            width="100">
          </el-table-column>
          <el-table-column
            prop="workId"
            label="工号"
            width="">
          </el-table-column>
          <el-table-column
            prop="name"
            label="名称"
            width="">
          </el-table-column>
          <el-table-column
            prop="department"
            label="部门">
          </el-table-column>
          <el-table-column
            prop="phone"
            label="手机号">
          </el-table-column>
        </el-table>
      </el-card>
      <!-- /表格 -->

      <!-- 新建对话框 -->
      <el-dialog
        
        title="新建员工"
        :visible.sync="addDialogVisible"
        width="550px"
      >
        <el-form
          ref="create"
          :model="createForm"
          :rules="rules"
          label-position="left"
          label-width="80px"
          style="padding: 0 20px"
          @keyup.enter.native="submitForm('create')"
        >
          <el-form-item label="工号" prop="workId">
            <el-input v-model="createForm.workId" maxlength="20" clearable placeholder="请输入工号" />
          </el-form-item>
          <el-form-item label="名称" prop="name">
            <el-input v-model="createForm.name" maxlength="20" clearable placeholder="请输入名称" />
          </el-form-item>
          <el-form-item label="部门" prop="department">
            <el-input v-model="createForm.department" maxlength="200" clearable placeholder="请输入员工部门" />
          </el-form-item>
          <el-form-item label="手机号" prop="phone">
            <el-input v-model="createForm.phone" maxlength="20" clearable placeholder="请输入员工手机号" />
          </el-form-item>
          </el-form-item>
          <el-form-item>
            <el-button size="mini" type="primary" @click="submitForm('create')">创建</el-button>
            <el-button size="mini" @click="resetForm('create')">重置</el-button>
          </el-form-item>
        </el-form>
      </el-dialog>
      <!-- /新建对话框 -->

      <!-- 编辑对话框 -->
      <el-dialog
        
        title="编辑信息"
        :visible.sync="editDialogVisible"
        width="550px"
      >
        <el-form
          ref="edit"
          :model="editForm"
          :rules="rules"
          label-position="left"
          label-width="80px"
          style="padding: 0 20px"
          @keyup.enter.native="submitForm('edit')"
        >
          <el-form-item label="工号" prop="workId">
            <el-input v-model="editForm.workId" maxlength="20" clearable placeholder="请输入工号" />
          </el-form-item>
          <el-form-item label="名称" prop="name">
            <el-input v-model="editForm.name" maxlength="20" clearable placeholder="请输入名称" />
          </el-form-item>
          <el-form-item label="部门" prop="department">
            <el-input v-model="editForm.department" maxlength="200" clearable placeholder="请输入员工部门" />
          </el-form-item>
          <el-form-item label="手机号" prop="phone">
            <el-input v-model="editForm.phone" maxlength="20" clearable placeholder="请输入员工手机号" />
          </el-form-item>
          </el-form-item>
          <el-form-item>
            <el-button size="mini" type="primary" @click="submitForm('edit')">保存</el-button>
            <el-button size="mini" @click="resetForm('edit')">重置</el-button>
          </el-form-item>
        </el-form>
      </el-dialog>
      <!-- /编辑对话框 -->

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
    name: 'StaffManage',
    data() {
      return {
        list: [],
        listLoading: true,
        listSelection: [],
        tableKey: 0,
        listQuery: {
          currentPage: 1,
          pageSize: 100,
          total: 400,
          searchInfo: ''
        },
        fileDialogVisible: false,
        addDialogVisible: false,
        createForm: {
          workId: '',
          name: '',
          department: '',
          phone: ''
        },
        editDialogVisible: false,
        editForm: {
          workId: '',
          name: '',
          department: '',
          phone: ''
        },
        rules: {
          name: [
            { required: true, message: '员工名称不能为空', trigger: 'blur' }
          ],
          workId: [
            { required: true, message: '员工工号不能为空', trigger: 'blur' }
          ],
          department: [
            { required: true, message: '员工部门不能为空', trigger: 'blur' }
          ],
          phone: [
            { required: true, message: '员工手机号不能为空', trigger: 'blur' }
          ]
        },
      }
    },
    created() {
      this.getList()
    },
    methods: {
      /**
       * 获取列表信息
       */
      getList() {
        request({
          url: '/getStaffList',
          data: this.listQuery,
          method: 'post'
        }).then(({data}) => {
          console.log(data);
          this.list = data
          this.listLoading = false
        })
      },
      /**
       * 添加人员
       */
      addClick() {
        this.addDialogVisible = true
      },
      /**
       * 编辑
       */
      editClick() {
        this.editDialogVisible = true
      },
      /**
       * 删除
       */
      deleteClick() {
        this.$confirm(`删除后无法撤销，确定删除当前选中的${this.listSelection.length}条数据?`, '提示', { type: 'warning' }).then(() => {
          // request({})
        })
      },
      /**
       * 导入
       */
      inputClick() {
        this.fileDialogVisible = true
      },
      /**
       * 导出
       */
      exportClick() {

      },
      /**
       * 改变页面大小      
       */
      handleSizeChange() {

      },
      /**
       * 改变页数
       */
      handleCurrentPageChange() {

      },
      /**
       * 选择员工
       */
      handleSelectionChange() {

      },
      /**
       * 提交表单
       */
      submitForm() {
        this.$refs[formName].validate((valid) => {
          if (valid) {
            switch (formName) {
              case 'create': this.handleCreate(); break
              case 'edit': this.handleEdit(); break
            }
          }
        })
      },
      /**
       * 重置表单
       */
      resetForm(formName) {
        this.$refs[formName].resetFields()
      },
      /**
       * 新建员工
       */
      handleCreate() {

      },
      /**
       * 编辑员工
       */
      handleEdit() {

      }
    }
}
</script>

<style scoped>

</style>