<template>
    <div class="outer">
        <el-container>
            <el-header>
                <HomeHeader />
            </el-header>
            <el-main>
                <div class="main-container">
                    <HomeContent />
                </div>
            </el-main>
        </el-container>
    </div>
</template>

<script setup>
import HomeHeader from '@/components/HomeHeader.vue';
import HomeContent from '@/components/HomeContent.vue';
</script>

<style scoped>
.el-header {
    padding: 0;
}

.el-main {
    --el-main-padding: 0;
}

.main-container {
    padding: 0 100px;
}
</style>