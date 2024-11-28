<template>
    <div style="position: absolute; height: 60px; top: 0; left: 0; right: 0; overflow: hidden;">
        <HomeHeader />
    </div>
    <div style="position: absolute; top: 60px; bottom: 0; left: 0; right: 0; overflow: auto;">
        <div style="box-sizing: border-box; height: 100%; display: flex; align-items: center; justify-content: center;">
            <div
                style="padding: 20px 20px 20px 50px; width: 400px; display: flex; flex-direction: column; align-items: center">
                <el-avatar :size="150" :src="user?.avatar_id" @error="avatarErrorHandler" style="margin: 10px;">
                    <img src="https://cube.elemecdn.com/e/fd/0fc7d20532fdaf769a25683617711png.png" />
                </el-avatar>
                <el-form :model="userForm" label-width="auto" style="width: 300px; max-width: 600px; margin: 20px">
                    <el-form-item label="用户名">
                        <el-input v-model="userForm.username" disabled/>
                    </el-form-item>
                    <el-form-item label="手机号码">
                        <el-input v-model="userForm.phone_number" />
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
                        <el-button @click="handleLogout">退出登录</el-button>
                    </el-form-item>
                </el-form>
            </div>
            <el-divider direction="vertical" style="height: 80%;" />
            <div style="align-self: center; padding: 20px; width: 600px; display: flex; flex-direction: column; align-items: baseline;">
                <el-row style="width: 500px; margin-bottom: 50px;">
                    <el-col :span="6">
                        <el-statistic title="注册天数" :value="userProfile?.reg_days"/>
                    </el-col>
                    <el-col :span="6">
                        <el-statistic title="订单数量" :value="userProfile?.order_count"/>
                    </el-col>
                    <el-col :span="6">
                        <el-statistic title="购买产品数量" :value="userProfile?.good_count"/>
                    </el-col>
                    <el-col :span="6">
                        <el-statistic title="评价数量" :value="userProfile?.comment_count"/>
                    </el-col>
                </el-row>
                <el-timeline style="margin: 20px;">
                    <el-timeline-item v-for="event in timelineEvents" :key="event[0]" :timestamp="new Date(event[1] as string).toDateString()">
                        {{ event[0] }}
                    </el-timeline-item>
                </el-timeline>
            </div>
        </div>
    </div>
</template>

<script setup lang="ts">
import { getUser, getUserProfile, updateUser } from '@/api';
import type { UserProfileResponse, UserResponse, UserUpdate } from '@/api/schemas';
import HomeHeader from '@/components/HomeHeader.vue';
import router from '@/router';
import type { AxiosResponse } from 'axios';
import { ElMessage } from 'element-plus';
import { type Ref } from 'vue';

const avatarErrorHandler = function() {
    console.warn("Failed to load avatar, url:", user.value?.avatar_id)
}
import { onMounted, reactive, ref } from 'vue';

const user: Ref<UserResponse | undefined> = ref()

const userForm = reactive({
    username: user.value?.username,
    phone_number: user.value?.phone_number,
    email: user.value?.email,
    bio: user.value?.bio,
    birthday: user.value?.birthday,
    gender: user.value?.gender
})

const handleSubmit = async function() {
    console.log('submit', userForm)
    try {
        const response = await updateUser(userForm as UserUpdate) as AxiosResponse<UserResponse>
        Object.assign(userForm, response.data)
        ElMessage({
            type: 'success',
            message: '更新用户信息成功'
        })
    } catch (err) {
        console.error(err)
    }
}
const handleLogout = function() {
    router.replace({
        name: 'login'
    })
}

const userProfile: Ref<UserProfileResponse | undefined> = ref()
const timelineEvents: Ref<Array<Array<String>>> = ref([])

onMounted(async () => {
    try {
        const me = await getUser() as AxiosResponse<UserResponse>
        user.value = me.data
        Object.assign(userForm, me.data)
        const profile = await getUserProfile() as AxiosResponse<UserProfileResponse>
        userProfile.value = profile.data
        timelineEvents.value = profile.data.timeline
    } catch (err) {
        console.error(err)
    }
})
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