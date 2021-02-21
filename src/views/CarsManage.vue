<template>
  <div>
      <el-card class="control-bar">
        <div class="header">
          <div class="btn-group">
            <el-button type="success" icon="el-icon-plus" size="mini" @click="addClick">新建</el-button> 
            <el-button :disabled="listSelection.length !== 1" type="warning" icon="el-icon-edit" size="mini" @click="editClick">编辑</el-button> 
            <el-button :disabled="listSelection.length === 0" type="danger" icon="el-icon-delete" size="mini" @click="deleteClick(listSelection[0])">删除</el-button> 
            <el-button type="primary" icon="el-icon-upload" size="mini" @click="inputClick">导入</el-button> 
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
           type="expand">
            <template slot-scope="props">
              <el-form label-position="left" inline class="demo-table-expand">
                <el-form-item label="注册单位:">
                  <span>{{ props.row.registrant }}</span>
                </el-form-item>
                <el-form-item label="承包人:">
                  <span>{{ props.row.name }}</span>
                </el-form-item>
                <el-form-item label="车牌号:">
                  <span>{{ props.row.carId }}</span>
                </el-form-item>
                <el-form-item label="车型:">
                  <span>{{ props.row.type }}</span>
                </el-form-item>
                <el-form-item label="发动机型号:">
                  <span>{{ props.row.engineType }}</span>
                </el-form-item>
                <el-form-item label="车架号:">
                  <span>{{ props.row.vin }}</span>
                </el-form-item>
                <el-form-item label="变速箱:">
                  <span>{{ props.row.gearbox }}</span>
                </el-form-item>
                <el-form-item label="燃料类型:">
                  <span>{{ props.row.fuelType }}</span>
                </el-form-item>
                <el-form-item label="备注:">
                  <span>{{ props.row.remark }}</span>
                </el-form-item>
              </el-form>
            </template>
          </el-table-column>

          <el-table-column
            prop="carId"
            label="车牌号"
            width="">
          </el-table-column>
          <el-table-column
            prop="name"
            label="承包人"
            width="">
          </el-table-column>
          <el-table-column
            prop="registrant"
            label="注册单位">
          </el-table-column>
          <el-table-column
            prop="vin"
            label="车架号">
          </el-table-column>
        </el-table>
      </el-card>
      <!-- /表格 -->

      <!-- 新建对话框 -->
      <el-dialog
        
        title="新建员工"
        :visible.sync="addDialogVisible"
        width="800px"
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
          <el-row type="flex" justify="start">
            <el-col :span="10">
              <el-form-item label="车牌号" prop="carId">
                <el-input v-model="createForm.carId" maxlength="20" clearable placeholder="请输入车牌号" />
              </el-form-item>
            </el-col>
            <el-col :push="3" :span="10">
              <el-form-item label="承包人" prop="name">
                <el-input v-model="createForm.name" maxlength="20" clearable placeholder="请输入承包人名称" />
              </el-form-item>
            </el-col>
          </el-row>
          <el-row type="flex" justify="start">
            <el-col :span="10">
              <el-form-item label="注册单位" prop="registrant">
                <el-input v-model="createForm.registrant" maxlength="200" clearable placeholder="请输入注册单位" />
              </el-form-item>
            </el-col>
            <el-col :push="3" :span="10">
              <el-form-item label="车架号" prop="vin">
                <el-input v-model="createForm.vin" maxlength="20" clearable placeholder="请输入车架号" />
              </el-form-item>
            </el-col>
          </el-row>
          <el-row type="flex" justify="start">
            <el-col :span="10">
              <el-form-item label="发动机" prop="engineType">
                <el-input v-model="createForm.engineType" maxlength="20" clearable placeholder="请输入发动机型号" />
              </el-form-item>
            </el-col>
            <el-col :push="3" :span="10">
              <el-form-item label="变速箱" prop="gearbox">
                <el-input v-model="createForm.gearbox" maxlength="20" clearable placeholder="请输入变速箱型号" />
              </el-form-item>
            </el-col>
          </el-row>
          <el-row type="flex" justify="start">
            <el-col :span="10">
              <el-form-item label="车型" prop="type">
                <el-input v-model="createForm.type" maxlength="20" clearable placeholder="请输入车型" />
              </el-form-item>
            </el-col>
            <el-col :push="3" :span="10">
              <el-form-item label="燃料类型" prop="fuelType">
                <!-- <el-input v-model="createForm.fuelType" maxlength="20" clearable placeholder="请选择燃料类型" /> -->
                <el-select v-model="createForm.fuelType" placeholder="请选择">
                  <el-option
                    v-for="item in options"
                    :key="item.value"
                    :label="item.label"
                    :value="item.value">
                  </el-option>
                </el-select>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row type="flex" justify="start">
            <el-col :span="10">
              <el-form-item label="备注" prop="remark">
                <el-input v-model="createForm.remark" maxlength="20" clearable placeholder="请输入备注" />
              </el-form-item>
            </el-col>
            <el-col :push="3" :span="10">
              
            </el-col>
          </el-row>
          <el-form-item>
            <el-button size="mini" type="primary" @click="submitForm('create')">创建</el-button>
            <el-button  size="mini" @click="resetForm('create')">重置</el-button>
          </el-form-item>
        </el-form>
      </el-dialog>
      <!-- /新建对话框 -->

      <!-- 编辑对话框 -->
      <el-dialog
        
        title="新建员工"
        :visible.sync="editDialogVisible"
        width="800px"
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
          <el-row type="flex" justify="start">
            <el-col :span="10">
              <el-form-item label="车牌号" prop="carId">
                <el-input v-model="editForm.carId" maxlength="20" clearable placeholder="请输入车牌号" />
              </el-form-item>
            </el-col>
            <el-col :push="3" :span="10">
              <el-form-item label="承包人" prop="name">
                <el-input v-model="editForm.name" maxlength="20" clearable placeholder="请输入承包人名称" />
              </el-form-item>
            </el-col>
          </el-row>
          <el-row type="flex" justify="start">
            <el-col :span="10">
              <el-form-item label="注册单位" prop="registrant">
                <el-input v-model="editForm.registrant" maxlength="200" clearable placeholder="请输入注册单位" />
              </el-form-item>
            </el-col>
            <el-col :push="3" :span="10">
              <el-form-item label="车架号" prop="vin">
                <el-input v-model="editForm.vin" maxlength="20" clearable placeholder="请输入车架号" />
              </el-form-item>
            </el-col>
          </el-row>
          <el-row type="flex" justify="start">
            <el-col :span="10">
              <el-form-item label="发动机" prop="engineType">
                <el-input v-model="editForm.engineType" maxlength="20" clearable placeholder="请输入发动机型号" />
              </el-form-item>
            </el-col>
            <el-col :push="3" :span="10">
              <el-form-item label="变速箱" prop="gearbox">
                <el-input v-model="editForm.gearbox" maxlength="20" clearable placeholder="请输入变速箱型号" />
              </el-form-item>
            </el-col>
          </el-row>
          <el-row type="flex" justify="start">
            <el-col :span="10">
              <el-form-item label="车型" prop="type">
                <el-input v-model="editForm.type" maxlength="20" clearable placeholder="请输入车型" />
              </el-form-item>
            </el-col>
            <el-col :push="3" :span="10">
              <el-form-item label="燃料类型" prop="fuelType">
                <!-- <el-input v-model="editForm.fuelType" maxlength="20" clearable placeholder="请选择燃料类型" /> -->
                <el-select v-model="editForm.fuelType" placeholder="请选择">
                  <el-option
                    v-for="item in options"
                    :key="item.value"
                    :label="item.label"
                    :value="item.value">
                  </el-option>
                </el-select>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row type="flex" justify="start">
            <el-col :span="10">
              <el-form-item label="备注" prop="remark">
                <el-input v-model="editForm.remark" maxlength="20" clearable placeholder="请输入备注" />
              </el-form-item>
            </el-col>
            <el-col :push="3" :span="10">
              
            </el-col>
          </el-row>
          <el-form-item>
            <el-button size="mini" type="primary" @click="submitForm('edit')">保存</el-button>
            <el-button  size="mini" @click="resetForm('edit')">重置</el-button>
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
    name: 'CarsManage',
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
        addDialogVisible: false,
        createForm: {
          carId: '',
          name: '',
          registrant: '',
          vin: '',
          engineType: '',
          gearbox: '',
          type: '',
          fuelType: '',
          remark: ''
        },
        editDialogVisible: false,
        editForm: {
          carId: '',
          name: '',
          registrant: '',
          vin: '',
          engineType: '',
          gearbox: '',
          type: '',
          fuelType: '',
          remark: ''
        },
        fileDialogVisible: false,
        options: [
          {
            value: 'gasoline',
            label: '汽油'
          },
          {
            value: 'diesel',
            label: '柴油'
          },
          {
            value: 'electricity',
            label: '电'
          },
          {
            value: 'hybrid',
            label: '油电混合'
          },
          {
            value: 'gas',
            label: '天然气'
          },
        ],
        
        rules: {
          carId: [
            { required: true, message: '车牌号不能为空', trigger: 'blur' }
          ],
          type: [
            { required: true, message: '车型不能为空', trigger: 'blur' }
          ],
          engineType: [
            { required: true, message: '发动机型号不能为空', trigger: 'blur' }
          ],
          vin: [
            { required: true, message: '车架号不能为空', trigger: 'blur' }
          ],
          fuelType: [
            { required: true, message: '燃料类型不能为空', trigger: 'blur' }
          ],
          gearbox: [
            { required: true, message: '变速箱型号不能为空', trigger: 'blur' }
          ]
        },
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
          url: '/getCarList',
          data: this.listQuery,
          method: 'post'
        }).then(({data}) => {
          console.log(data);
          this.list = data
          this.listLoading = false
        })
      },
      /**
       * 新建
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
       * 改变页面大小      
       */
      handleSizeChange(val) {

      },
      /**
       * 改变页数
       */
      handleCurrentPageChange(val) {

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

    }
}
</script>

<style scoped>
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
  .el-form--label-left /deep/.el-form-item__label {
    font-size: 12px;
  }

  .el-input--suffix /deep/ .el-input__inner {
    height: 30px;
    font-size: 12px;
  }

</style>