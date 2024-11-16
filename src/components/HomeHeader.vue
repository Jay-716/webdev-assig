<script setup lang="ts">
import { ref } from 'vue';
import { ShoppingBag, Search, UserFilled, Bell, ShoppingCart, ShoppingCartFull, Tickets } from '@element-plus/icons-vue';

const userLoggedIn = ref(true)
const user = ref({username: 'jay', avatar_url: 'https://empty'})
const cartEmpty = ref(true)
const searchText = ref('');

const avatarErrorHandler = function() {
    console.warn("Failed to load avatar, url:", user.value.avatar_url)
}
</script>

<template>
    <div class="header-outer">
        <div class="logo-title">
            <el-icon class="logo"><ShoppingBag/></el-icon>
            <h1 class="title">Jay的小商城</h1>
        </div>
        <el-input placeholder="搜索" class="search-bar" :prefix-icon="Search" v-model="searchText" />
        <nav class="nav-links">
            <RouterLink to="/cart">
                <el-icon>
                    <ShoppingCart v-if="cartEmpty"/>
                    <ShoppingCartFull v-else/>
                </el-icon>
                <h2>购物车</h2>
            </RouterLink>
            <RouterLink to="/tickets">
                <el-icon><Tickets/></el-icon>
                <h2>订单</h2>
            </RouterLink>
            <RouterLink to="/notification">
                <el-icon><Bell/></el-icon>
                <h2>通知</h2>
            </RouterLink>
            <RouterLink to="/settings">
                <el-icon><Setting/></el-icon>
                <h2>设置</h2>
            </RouterLink>
            <RouterLink to="/user" :title="userLoggedIn ? user.username : '请登录'">
                <el-avatar v-if="userLoggedIn" :size="40" :src="user.avatar_url" @error="avatarErrorHandler">
                    <img src="https://cube.elemecdn.com/e/fd/0fc7d20532fdaf769a25683617711png.png" />
                </el-avatar>
                <el-avatar v-else :size="40" :icon="UserFilled"/>
            </RouterLink>
        </nav>
    </div>
</template>

<style scoped>
.header-outer {
    display: flex;
    align-items: center;
    justify-content: space-between;
    height: 100%;
    background-color: #d0ddeb;
}

.logo-title {
    display: flex;
    align-items: center;
    margin-right: 15px;
}
.logo {
    width: auto;
    height: auto;
    font-size: 40px;
    margin-left: 15px;
    margin-right: 15px;
}
.title {
    font-size: 24px;
    font-family: sans-serif;
    user-select: none;
}

.search-bar {
    flex-grow: 1;
    max-width: 400px;
    padding: 5px 10px;
    margin: 0 15px;
}
.search-bar >>> .el-input__wrapper {
    background-color: #e4ebf1;
}

.nav-links {
    padding-right: 15px;
    display: flex;
    gap: 15px;
}
.nav-links a {
    text-decoration: none;
    color: #333;
    font-family: sans-serif;
    align-items: center;
    display: flex;
}
/* Navigator icon */
.nav-links a i {
    font-size: 20px;
    margin-right: 5px;
}
/* Navigator text */
.nav-links a h2 {
    font-size: medium;
}
</style>
