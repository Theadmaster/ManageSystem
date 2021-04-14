<template>
  <div>
    <el-container class="home-container">
      <el-header>
        <div class="logo">
          <!-- <span>神行者</span> -->
          <img src="~/assets/img/cec-logo2.png" alt="">
          <i :class="collapseIcon" @click="collapseClick"></i>
        </div>
        <div class="breadcrumb"> 
            <el-breadcrumb separator="/">
              <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
              <el-breadcrumb-item>{{title}}</el-breadcrumb-item>
            </el-breadcrumb>
        </div>
        <div class="user">
          <el-dropdown
          @command="handleCommand"
          trigger="click">
            <img src="~/assets/avatar.gif" alt="">
            <i class="el-icon-caret-bottom"></i>
            <el-dropdown-menu slot="dropdown" divided>
              <el-dropdown-item command="user" icon="el-icon-user-solid" >用户1</el-dropdown-item>
              <el-dropdown-item divided command="logout" icon="el-icon-s-promotion" >退出登录</el-dropdown-item>
            </el-dropdown-menu>
          </el-dropdown>
        </div>
      </el-header>
      <el-container>
        <el-aside :width="asideWidth">
              <el-menu
              :default-active="this.$router.history.current.path"
              class="el-menu-vertical-demo"
              background-color="#334154"
              
              text-color="#95afc0"
              :collapse="isCollapse"
              router
              >
              <el-menu-item index="/infolist" style="width: 210px;">
                <i class="el-icon-s-order"></i>
                <span slot="title">货单管理</span>
              </el-menu-item>
              <el-menu-item index="/controllist" style="width: 210px;">
                <i class="el-icon-s-shop"></i>
                <span slot="title">供应管理</span>
              </el-menu-item>
              <el-menu-item index="/staffmanage" style="width: 210px;">
                <i class="el-icon-s-custom"></i>
                <span slot="title">人员管理</span>
              </el-menu-item>
              <el-menu-item index="/carsmanage" style="width: 210px;">
                <i class="el-icon-s-grid"></i>
                <span slot="title">耗材管理</span>
              </el-menu-item>
              <el-menu-item index="/calendar" style="width: 210px;">
                <i class="el-icon-s-platform"></i>
                <span slot="title">排班管理</span>
              </el-menu-item>
            </el-menu>
        </el-aside>
        <el-main>
          <!-- <el-card class="control-bar">
            <div class="header">
              <div class="btn-group">
                <el-button type="primary" size="mini">查看照片</el-button> 
              </div>
              <div class="search-group">
                <div style="margin-right:5px;">
                  <el-input
                    size="mini"
                    placeholder="请输入内容"
                    prefix-icon="el-icon-search"
                    v-model="searchInfo">
                  </el-input>
                </div>
                <el-button type="primary" size="mini">查询</el-button>
              </div>
            </div>
          </el-card> -->
          
          <router-view />
          
        </el-main>
      </el-container>
    </el-container>
  </div>
</template>

<script>
export default {
  name: 'layout',
  data() {
    return {
      isCollapse: false,
      asideWidth: '210',
      collapseIcon: 'el-icon-s-fold',
      title: '货单管理',
    }
  },
  computed: {

  },
  watch: {
    $route: 'breadChange'
  },
  methods: {
    /**
     * 折叠导航
     */
    collapseClick() {
      this.isCollapse = !this.isCollapse
      if(this.isCollapse) {
        // this.asideWidth = '80'
        this.collapseIcon = 'el-icon-s-unfold'
      }else {
        this.asideWidth = '210'
        this.collapseIcon = 'el-icon-s-fold'
      }
    },
    /**
     * 改变面包屑
     */
    breadChange() {
      switch(this.$router.history.current.path) {
        case '/infolist':
          this.title = '货单管理'
          break
        case '/controllist': 
          this.title = '供应管理'
          break
        case '/staffmanage':
          this.title = '人员管理'
          break
        case '/carsmanage':
          this.title = '耗材管理'
          break
        case '/calendar':
          this.title = '排班管理'
          break
      }
    },
    /**
     * 退出登录
     */
    handleCommand(command) {
      if(command === 'user') {
        console.log(command);
      } else {
        this.$router.push('/login')
      } 
      
    }
  }
}
</script>

<style>
  .el-header {
    background-color: #fff;
    color: #333333;
    height: 52px!important;
    line-height: 52px;
    padding: 0;
    display: flex;
    align-items: center;
  }
  
  .el-aside {
    background-color: #334154;
    color: #333;
    line-height: 200px;
  }

  
  .el-main {
    background-color: #fff;
  }

  .home-container {
    height: 100vh;
  }
  
  .el-menu-vertical-demo {
    font-weight: 500;
    border-right: 0;
  }

  .logo {
    padding-left: 20px;
    width: 210px;
    background-color: #f5f6fa;
  }

  .logo img {
    width: 160px;
  }

  .logo span {
    font-size: 24px;
    font-weight: 700;
    color: #fff;
  }

  .logo i {
    position: relative;
    left: 50px;
    top: 2.5px;
    font-size: 22px;
    cursor:pointer;
  }

  .breadcrumb {
    position: relative;
    left: 50px;
  }

  .el-breadcrumb {
    font-size: 14px;
  }
 
  .user {
    position: absolute;
    right: 13px;
    cursor:pointer;
  }

  .user img {
    border-radius: 10px;
    width: 42px;
  }

  .user i {
    position: relative;
    top: 17px;
    left: 5px;
  }

  .control-bar {
    margin-bottom: 20px;
  }

  .el-card__body {
    padding: 5px;
  }

  .header {
    display: flex;
    justify-content:space-between;
  }

  .search-group {
    display: flex;
  }

  .btn-group {
    border-radius: 3px;
    overflow: hidden;
  }

  .btn-group .el-button+.el-button{
    margin: 0;
  }

  .btn-group .el-button {
    border-radius: 0;
  }
  
  .footer {
    position: absolute;
    right: 40px;
    bottom: 40px;
  }

  .el-form--label-left /deep/.el-form-item__label {
    font-size: 12px;
  }

  .el-input--suffix /deep/ .el-input__inner {
    height: 30px;
    font-size: 12px;
  }
</style>