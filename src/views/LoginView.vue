<template>
    <div class="login-root">
        <div class="login-box">
            <el-icon style="font-size: 100px; margin: 100px auto 75px;">
                <ShoppingBag />
            </el-icon>
            <el-input v-model="loginForm.username" class="login-input" placeholder="账号"></el-input>
            <el-input v-model="loginForm.password" class="login-input" placeholder="密码" show-password
                @keyup.enter.native="loginOrRegister"></el-input>
            <el-button type="primary" style="margin: 20px auto 0; width: 300px;" @click="loginOrRegister">
                登陆 / 注册
            </el-button>
            <div style="margin: 5px auto; width: 300px; display: flex; align-items: center;">
                <input type="checkbox" v-model="agree">
                <el-button link>用户协议</el-button>
            </div>
        </div>
    </div>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import router from '@/router';
import { ShoppingBag } from '@element-plus/icons-vue';

const loginForm = ref({
    username: "",
    password: ""
})
const agree = ref(false)

const loginOrRegister = function() {
    router.replace({name: 'home'})
}
</script>

<style scoped>
.login-root {
    display: inline-block;
    height: 100%;
    width: 100%;
    background: url("@/assets/share/bg.png") no-repeat;
}
.login-box {
    display: flex;
    flex-direction: column;
    height: 480px;
    width: 400px;
    margin: 10% auto;
    border: 3px rgb(143, 179, 189) solid;
    border-radius: 10px;
    background-color: aliceblue;
}

.login-box .el-input {
    margin: 5px auto;
    width: 300px;
}
</style>