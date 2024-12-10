<template>
  <div class="banner-container">
    <el-carousel trigger="click" :interval="5000">
      <el-carousel-item v-for="banner in banners" :key="banner.id">
        <el-image :src="`${baseUrl}/file/download?key=${banner.image_id}`" :alt="banner.image_id" class="banner-image">
          <template #placeholder>
            <div class="banner-image-slot">
              <span>LOADING...</span>
            </div>
          </template>
          <template #error>
            <div class="banner-image-slot">
              <el-icon>
                <IconPicture />
              </el-icon>
            </div>
          </template>
        </el-image>
      </el-carousel-item>
    </el-carousel>
  </div>
  <div class="tag-region">
    <div class="tag-header">
      <el-icon style="font-size: larger;">
        <Histogram />
      </el-icon>
      <span class="sans-font" style="margin-right: 6px;">热门标签</span>
    </div>
    <div class="tag-container">
      <div class="tag-wrapper" v-for="tag in tags" :key="tag.id as PropertyKey">
        <span>{{ tag.name }}</span>
      </div>
    </div>
  </div>
  <div class="product-container">
    <div class="product-card" v-for="product in showSearchResults ? searchResults : products" :key="product.id as PropertyKey">
      <ProductCard :product="product" nobutton/>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, type Ref } from 'vue';
import { Histogram, Picture as IconPicture } from '@element-plus/icons-vue';
import ProductCard from './ProductCard.vue';
import { getBanner, getGood, getRandomGoods, getRandomTags } from '@/api';
import type { BannerResponse, GoodResponse, Page, TagResponse } from '@/api/schemas';
import type { AxiosResponse } from 'axios';
import { baseUrl } from '@/config';
import { ElMessage } from 'element-plus';

const products: Ref<Array<GoodResponse>> = ref([])
const searchResults: Ref<GoodResponse[]> = ref([])
const showSearchResults = ref(false)
const banners: Ref<Array<BannerResponse>> = ref([])
const tags: Ref<Array<TagResponse>> = ref([])

const handleSearch = (q: String) => {
  doSearch(q).then(res => {
    searchResults.value = res || []
    showSearchResults.value = true
  })
}
const doSearch = async (q: String) => {
  try {
    const resp = await getGood(q) as AxiosResponse<Page<GoodResponse>>
    return resp.data.items
  } catch (err) {
    console.error(err)
    ElMessage({
      type: 'error',
      message: '搜索失败，请稍后重试'
    })
  }
}
const handleSearchReset = () => {
    showSearchResults.value = false
}

defineExpose({handleSearch, handleSearchReset})

onMounted(async () => {
  try {
    banners.value = (await getBanner() as AxiosResponse<Array<BannerResponse>>).data
  } catch (err) {
    console.error(err)
  }
  try {
    tags.value = (await getRandomTags() as AxiosResponse<Array<TagResponse>>).data
  } catch (err) {
    console.error(err)
  }
  try {
    products.value = (await getRandomGoods() as AxiosResponse<Array<GoodResponse>>).data
  } catch (err) {
    console.error(err)
  }
})
</script>

<style scoped>
.banner-container {
    padding: 10px 0;
    height: 150px;
    max-height: 300px;
}
.banner-container .el-carousel {
    height: 100%;
    max-height: 100%;
}

.el-carousel >>> .el-carousel__container {
  height: 100%;
  max-height: 100%;
}
.el-carousel__item:nth-child(2n) {
  background-color: #99a9bf;
}
.el-carousel__item:nth-child(2n + 1) {
  background-color: #d3dce6;
}

.banner-image {
  width: 100%;
  height: 100%;
}
.banner-image-slot {
  display: flex;
  justify-content: center;
  align-items: center;
  width: 100%;
  height: 100%;
  background: var(--el-fill-color-light);
  color: var(--el-text-color-secondary);
  font-size: 30px;
}
.banner-image-slot .el-icon {
  font-size: 30px;
}

.tag-region {
  display: flex;
  flex-direction: column;
  padding: 10px;
  border-radius: 5px;
  background-color: #eeeeee;
  max-height: 150px;
}
.tag-header {
  display: flex;
  padding: 0 5px 5px;
  align-items: center;
}
.tag-container {
  display: flex;
  flex-wrap: wrap;
  gap: 5px;
  max-height: 100px;
  overflow: scroll;
}
.tag-wrapper {
  margin: 1px 4px;
  padding: 6px 8px;
  background-color: #fff;
  border-radius: 14px;
  user-select: none;
  font-size: smaller;
  transition: ease 200ms;
}
.tag-wrapper:hover {
  background-color: #dddddd;
  transition: ease 200ms;
}

.product-container {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
    gap: 20px;
    padding: 20px;
}

.product-card {
  background-color: #fff;
  border-radius: 8px;
  overflow: hidden; /* To keep image and content within the card */
}
.product-image {
  width: 100%;
  height: auto;
  object-fit: cover; /* Ensures the image covers the card without distortion */
}
.product-info {
  padding: 15px;
}
.product-name {
  font-size: 18px;
  font-weight: bold;
  margin: 0;
}
.product-description {
  font-size: 14px;
  color: #666;
}
.product-price {
  display: block;
  font-size: 16px;
  color: #333;
  margin-top: 10px;
}

.add-to-cart {
  background-color: #007bff;
  color: #fff;
  border: none;
  padding: 10px;
  width: 100%;
  cursor: pointer;
  font-size: 16px;
  border-radius: 4px;
  transition: background-color 0.3s;
}
.add-to-cart:hover {
  background-color: #0056b3;
}
</style>
