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
                <el-checkbox v-model="isStoreLogin" class="sans-font" style="margin-left: auto;">商户登陆</el-checkbox>
            </div>
            <div class="flex-row item-center reg-store-box">
                <el-button link style="margin-left: auto;" @click="handleClickStoreLogin">注册店铺</el-button>
            </div>
        </div>
    </div>
    <el-dialog v-model="storeDialogVisible" title="添加收货地址" width="500">
        <div class="flex-col">
        <div class="flex-col item-center" style="padding: 5px 10px;">
            <el-form v-model="storeForm" label-width="auto" style="width: 100%">
            <el-form-item label="店铺名称">
                <el-input v-model="storeForm.name" />
            </el-form-item>
            <el-form-item label="店铺介绍">
                <el-input v-model="storeForm.description" />
            </el-form-item>
            <el-form-item label="店铺头像">
                <el-text>敬请期待</el-text>
            </el-form-item>
            </el-form>
            <div class="flex-row item-center">
                <el-button @click="storeDialogVisible = false">取消</el-button>
                <el-button type="primary" @click="handleRegStore">添加</el-button>
            </div>
        </div>
        </div>
    </el-dialog>
</template>

<script setup lang="ts">
import { ref, type Ref } from 'vue';
import router from '@/router';
import { ShoppingBag } from '@element-plus/icons-vue';
import { ElMessage } from 'element-plus';
import { addStore, getStore, login, register } from '@/api';
import type { AxiosResponse } from 'axios';
import type { LoginResponse, RegisterResponse, RegStoreRequest, StoreResponse } from '@/api/schemas';
import { useUserStore } from '@/store/user';

const loginForm = ref({
    username: "",
    password: ""
})
const agree = ref(true)

const userLogin = async () => {
    let loginSuccess = true
    try {
        var loginResponse = await login(loginForm.value) as AxiosResponse<LoginResponse>
    } catch (err: any) {
        console.error(err)
        loginSuccess = false
        if (err.status !== 401) {
            ElMessage({
                type: 'error',
                message: '网络错误，请稍后重试'
            })
            return
        }
    }
    if (!loginSuccess) {
        try {
            var _ = await register({
                username: loginForm.value.username,
                password: loginForm.value.password,
                phone_number: null,
                email: null
            }) as AxiosResponse<RegisterResponse>
        } catch (err: any) {
            console.error(err)
            ElMessage({
                type: 'error',
                message: '网络错误，请稍后重试'
            })
            return
        }
        try {
            var loginResponse = await login(loginForm.value) as AxiosResponse<LoginResponse>
        } catch (err: any) {
            console.error(err)
            loginSuccess = false
            if (err.status !== 401) {
                ElMessage({
                    type: 'error',
                    message: '网络错误，请稍后重试'
                })
                return
            }
        }
    }
    localStorage.setItem('token', loginResponse!.data.access_token as string)
}

const storeLogin = async () => {
    userStore.storeLogin = true
    const store = await getStore() as AxiosResponse<{
            total: Number;
            page: Number;
            size: Number;
            pages: Number;
            items: Array<StoreResponse>;
    }>
    if (store.data.total === 0) {
        ElMessage({
            type: 'warning',
            message: '请先创建店铺'
        })
        return
    }
}

const loginOrRegister = async function () {
    if (!agree.value) {
        ElMessage({
            type: 'info',
            message: '请先同意用户协议'
        })
        return
    }
    if (loginForm.value.username.length === 0 || loginForm.value.password.length === 0) {
        ElMessage({
            type: 'info',
            message: '账号密码不能为空'
        })
        return
    }
    await userLogin()
    if (isStoreLogin.value) {
        await storeLogin()
        await router.replace({ name: 'store' })
    } else {
        await router.replace({ name: 'home' })
    }
}

const isStoreLogin = ref(false)
const userStore = useUserStore()
const storeDialogVisible = ref(false)
const storeForm: Ref<RegStoreRequest> = ref({
    name: "",
    description: "",
    image_id: null
})
const handleClickStoreLogin = async () => {
    if (loginForm.value.username.length === 0 || loginForm.value.password.length === 0) {
        ElMessage({
            type: 'info',
            message: '请先输入账号密码'
        })
    } else {
        storeDialogVisible.value = true
    }
}
const handleRegStore = async () => {
    try {
        isStoreLogin.value = true
        userStore.storeLogin = true
        if (storeForm.value === undefined || storeForm.value.name.length === 0 || storeForm.value.description.length === 0) {
            return
        }
        await addStore(storeForm.value)
        ElMessage({
            type: 'success',
            message: '注册成功，请登录'
        })
        storeDialogVisible.value = false
    } catch (err) {
        ElMessage({
            type: 'error',
            message: '注册失败'
        })
        console.error(err)
    }
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

.reg-store-box {
    margin: 0 auto;
    width: 300px;
}
</style>