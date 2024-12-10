<template>
    <div class="outer">
        <el-container>
            <el-header>
                <HomeHeader :onSearch="handleSearch" :onSearchReset="handleSearchReset" />
            </el-header>
            <el-main>
                <div class="main-container">
                    <HomeContent ref="home-content" />
                </div>
            </el-main>
        </el-container>
    </div>
</template>

<script setup lang="ts">
import HomeHeader from '@/components/HomeHeader.vue';
import HomeContent from '@/components/HomeContent.vue';
import { useTemplateRef } from 'vue';

const homeContent = useTemplateRef('home-content')

const handleSearch = (q: String) => {
    homeContent.value?.handleSearch(q)
}
const handleSearchReset = () => {
    homeContent.value?.handleSearchReset()
}
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