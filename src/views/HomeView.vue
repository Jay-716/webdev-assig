<template>
    <div class="outer">
        <el-container>
            <el-header>
                <HomeHeader />
            </el-header>
            <el-main>
                <h1>Main Content</h1>
            </el-main>
        </el-container>
    </div>
</template>

<script setup>
import HomeHeader from '@/components/HomeHeader.vue';
</script>

<style scoped>
.el-header {
    padding: 0;
}
</style>