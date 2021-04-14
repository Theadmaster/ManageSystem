<template>
  <div>
      <el-card class="control-bar">
      <div class="header">
        <div class="btn-group">
            <el-button type="success" icon="el-icon-plus" size="mini" >新建</el-button> 
            <el-button :disabled="listSelection.length !== 1" type="warning" icon="el-icon-edit" size="mini" >编辑</el-button> 
            <el-button :disabled="listSelection.length === 0" type="danger" icon="el-icon-delete" size="mini" >删除</el-button> 
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
          <el-button type="primary" icon="el-icon-search" size="mini" >查询</el-button>
        </div>
      </div>
    </el-card>
      <el-card>
          <el-calendar v-model="value">
          <template
       slot="dateCell"
       slot-scope="{ data}">
        <!--自定义内容-->
          <div>
              <p :class="data.isSelected ? 'is-selected' : ''">
                {{ data.day.split('-').slice(1).join('-') }} {{ data.isSelected ? '✔️' : ''}}
                </p>
             <!-- <div class="calendar-day">{{ data.day.split('-').slice(2).join('-') }}</div> -->
                <div v-for="(item,index) in calendarData" :key="index">
                   <div v-if="(item.months).indexOf(data.day.split('-').slice(1)[0])!=-1">
                     <div v-if="(item.days).indexOf(data.day.split('-').slice(2).join('-'))!=-1">
                          <el-tooltip class="item" effect="dark" :content="item.things" placement="right">
                               <div class="is-selected">{{item.things}}</div>
                          </el-tooltip>
                       </div>
                    <div v-else></div>
                   </div>
               <div v-else></div>
             </div>
          </div>
              
      </template>

      </el-calendar>
      </el-card>
  </div>
</template>

<script>
export default {
    name: 'Calendar',
    data() {
        return {
            value: new Date(),
            calendarData: [
                { months: ['03', '04'],days: ['14'],things: '王齐庆值班' },
                { months: ['04'], days: ['02'],things: '李正道值班' },
                { months: ['04'], days: ['02'],things: '孙文值班' },
                // { months: ['04'], days: ['02'],things: '看月亮' }   
            ],
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
        }
    },
    methods: {
        fileClick() {

        },
        exportClick() {

        }
    }
}
</script>

<style>
.calendar-day{
        /* text-align: center; */
        /* color: #202535;
        line-height: 30px;
        font-size: 12px; */
    }
    .is-selected{
        color: #1989FA;
        /* color: #F8A535; */
        font-size: 10px;
        margin-top: 5px;
    }
    #calendar .el-button-group>.el-button:not(:first-child):not(:last-child):after{
        content: '当月';
    }

</style>