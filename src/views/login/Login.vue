<template>
  <div class="home-container">
    <div class="box">
      <!-- logo -->
      <div class="logo">
        <img src="~assets/logo-img.png" alt />
      </div>
      <!-- 表单 -->
      <el-form label-width="0px" :rules="rules" :model="user" ref="formRef">
        <!-- 账号密码输入 -->
        <el-form-item label prop="username">
          <el-input prefix-icon="el-icon-user" v-model="user.username"></el-input>
        </el-form-item>
        <el-form-item label prop="password">
          <el-input type="password" prefix-icon="el-icon-lock" v-model="user.password" @keyup.enter.native="login"></el-input>
          <!-- <span class="show-pwd" @click="showPwd">
            <svg-icon :icon-class="passwordType === 'password' ? 'eye' : 'eye-open'" />
          </span> -->
        </el-form-item>
        <!-- 按钮 -->
        <el-form-item class="btns">
          <el-button :loading="loading" type="primary" @click="login" >登录</el-button>
          <el-button type="info" @click="btnClick">重置</el-button>
        </el-form-item>
      </el-form>
    </div>
  </div>
</template>

<script>
export default {
  name: "Login",
  data() {
    return {
      user: {
        username: "",
        password: ""
      },
      passwordType: 'password',
      loading: false,
      rules: {
        username: [
          { required: true, message: "请输入用户名", trigger: "blur" },
          {
            min: 3,
            max: 10,
            message: "长度在 3 到 10 个字符以内",
            trigger: "blur"
          }
        ],
        password: [
            { required: true, message: "请输入密码", trigger: "blur" },
            {
            min: 6,
            max: 15,
            message: "长度在 3 到 10 个字符以内",
            trigger: "blur"
          }
        ]
      },
    };
  },
  methods: {
    showPwd() {
      if (this.passwordType === 'password') {
        this.passwordType = ''
      } else {
        this.passwordType = 'password'
      }
      this.$nextTick(() => {
        this.$refs.password.focus()
      })
    },
    btnClick() {
      this.$refs.formRef.resetFields();
      console.log(this);
    },
    login() {

        this.$message({
          message: '登录成功',
          type: 'success'
        });
        this.$router.push('/home')
    }
    // handleLogin() {
    //   this.$refs.formRef.validate(valid => {
    //     if (valid) {
    //       this.loading = true
    //       this.$store.dispatch('user/login', this.user).then(() => {
    //         this.$router.push('/home')
    //         this.loading = false
    //       }).catch(() => {
    //         this.loading = false
    //       })
    //     } else {
    //       console.log('error submit!!')
    //       return false
    //     }
    //   })
    // }
  }
}
</script>

<style scoped>
.home-container {
  background-color: #2d3a4b;
}

.box {
  height: 300px;
  width: 500px;
  background-color: #fff;
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  border-radius: 20px;
  display: flex;
  /* background-color: #2d3a4b; */
}

.logo {
  position: absolute;
  border: 1px solid #ccc;
  height: 130px;
  width: 130px;
  border-radius: 50%;
  padding: 10px;
  box-shadow: 0 0 10px #ccc;
  top: -50%;
  left: 50%;
  transform: translate(-50%, 50%);
  background-color: #fff;
  overflow: hidden;
}

.logo img {
  width: 100%;
  height: 100%;
  border-radius: 50%;
  vertical-align: middle;
  /* background-color: #ccc; */
}

.el-form {
  width: 100%;
  margin: 100px 20px 0;
}

.btns {
  display: flex;
  justify-content: flex-end;
}

.show-pwd {
    position: absolute;
    right: 10px;
    top: 7px;
    font-size: 16px;
    color:#889aa4;
    cursor: pointer;
    
}


</style>