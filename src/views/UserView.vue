<template>
    <div style="position: absolute; height: 60px; top: 0; left: 0; right: 0; overflow: hidden;">
        <HomeHeader />
    </div>
    <div style="position: absolute; top: 60px; bottom: 0; left: 0; right: 0; overflow: auto;">
        <div style="box-sizing: border-box; height: 100%; display: flex; align-items: center; justify-content: center;">
            <div
                style="padding: 20px 20px 20px 50px; width: 400px; display: flex; flex-direction: column; align-items: center">
                <el-avatar :size="150" :src="user.avatar_url" @error="avatarErrorHandler" style="margin: 10px;">
                    <img src="https://cube.elemecdn.com/e/fd/0fc7d20532fdaf769a25683617711png.png" />
                </el-avatar>
                <el-form :model="userForm" label-width="auto" style="width: 300px; max-width: 600px; margin: 20px">
                    <el-form-item label="用户名">
                        <el-input v-model="userForm.username" />
                    </el-form-item>
                    <el-form-item label="手机号码">
                        <el-input v-model="userForm.phonenumber" />
                    </el-form-item>
                    <el-form-item label="邮箱">
                        <el-input v-model="userForm.email" />
                    </el-form-item>
                    <el-form-item label="生日">
                        <el-date-picker v-model="userForm.birthday" type="date" />
                    </el-form-item>
                    <el-form-item label="个性签名">
                        <el-input v-model="userForm.bio" type="textarea" />
                    </el-form-item>
                    <el-form-item>
                        <el-button type="primary" @click="handleSubmit">提交</el-button>
                        <el-button>取消</el-button>
                    </el-form-item>
                </el-form>
            </div>
            <el-divider direction="vertical" style="height: 80%;" />
            <div style="align-self: center; padding: 20px; width: 600px; display: flex; flex-direction: column; align-items: baseline;">
                <el-row style="width: 500px; margin-bottom: 50px;">
                    <el-col :span="6">
                        <el-statistic title="注册天数" :value="1000"/>
                    </el-col>
                    <el-col :span="6">
                        <el-statistic title="订单数量" :value="123"/>
                    </el-col>
                    <el-col :span="6">
                        <el-statistic title="购买产品数量" :value="167"/>
                    </el-col>
                    <el-col :span="6">
                        <el-statistic title="评价数量" :value="32"/>
                    </el-col>
                </el-row>
                <el-timeline style="margin: 20px;">
                    <el-timeline-item v-for="event in timelineEvents" :key="event.id" :timestamp="event.time.toDateString()">
                        {{ event.name }}
                    </el-timeline-item>
                </el-timeline>
            </div>
        </div>
    </div>
</template>

<script setup lang="ts">
import HomeHeader from '@/components/HomeHeader.vue';

const avatarErrorHandler = function() {
    console.warn("Failed to load avatar, url:", user.value.avatar_url)
}
import { reactive, ref } from 'vue';

const user = ref({
    id: 1,
    username: 'test name',
    phonenumber: '12345',
    email: '12345@mail.com',
    bio: 'hahaha',
    birthday: new Date(),
    avatar_url: 'http://empty',
    created_at: new Date().toDateString(),
    updated_at: new Date().toDateString(),
})

const userForm = reactive({
    username: user.value.username,
    phonenumber: user.value.phonenumber,
    email: user.value.email,
    bio: user.value.bio,
    birthday: user.value.birthday,
})

const handleSubmit = function() {
    console.log('submit', userForm)
}

const timelineEvents = ref([
    {id: 1, name: "账号创建", time: new Date()},
    {id: 2, name: "第一次购物", time: new Date()},
    {id: 3, name: "第一次收货", time: new Date()},
    {id: 4, name: "第一次评价", time: new Date()},
])
</script>

<style scoped>
.avatar-image-slot {
  display: flex;
  justify-content: center;
  align-items: center;
  width: 100%;
  height: 100%;
  background: var(--el-fill-color-light);
  color: var(--el-text-color-secondary);
  font-size: 30px;
}

.el-col {
    text-align: center;
}

.el-col >>> .el-statistic__head {
    font-family: sans-serif;
    font-size: medium;
}
</style>