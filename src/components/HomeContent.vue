<template>
  <div class="banner-container">
    <el-carousel trigger="click" :interval="5000">
      <el-carousel-item v-for="banner in banners" :key="banner.id">
        <el-image :src="banner.image_id" :alt="banner.image_id" class="banner-image">
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
      <span style="font-family: sans-serif; margin-right: 6px;">热门标签</span>
    </div>
    <div class="tag-container">
      <div class="tag-wrapper" v-for="tag in tags" :key="tag.id as PropertyKey">
        <span>{{ tag.name }}</span>
      </div>
    </div>
  </div>
  <div class="product-container">
    <div class="product-card" v-for="product in products" :key="product.id as PropertyKey">
      <ProductCard :product="product" />
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, type Ref } from 'vue';
import { Histogram, Picture as IconPicture } from '@element-plus/icons-vue';
import ProductCard from './ProductCard.vue';
import { getBanner, getRandomGoods, getRandomTags } from '@/api';
import type { BannerResponse, RandomGoodResponse, RandomTagResponse } from '@/api/schemas';
import type { AxiosResponse } from 'axios';

const products: Ref<Array<RandomGoodResponse>> = ref([])
const banners: Ref<Array<BannerResponse>> = ref([])
const tags: Ref<Array<RandomTagResponse>> = ref([])

onMounted(async () => {
  try {
    banners.value = (await getBanner() as AxiosResponse<Array<BannerResponse>>).data
  } catch (err) {
    console.error(err)
  }
  try {
    tags.value = (await getRandomTags() as AxiosResponse<Array<RandomTagResponse>>).data
  } catch (err) {
    console.error(err)
  }
  try {
    products.value = (await getRandomGoods() as AxiosResponse<Array<RandomGoodResponse>>).data
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
  border: 1px solid #ccc;
  border-radius: 8px;
  overflow: hidden; /* To keep image and content within the card */
  box-shadow: 0 2px 5px rgba(0, 0, 0, 0.1);
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