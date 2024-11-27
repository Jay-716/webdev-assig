<template>
    <div style="position: absolute; height: 60px; top: 0; left: 0; right: 0; overflow: hidden;">
        <HomeHeader />
    </div>
    <div id="content" style="position: absolute; top: 60px; bottom: 0; left: 0; right: 0; overflow: auto;">
        <div
            style="box-sizing: border-box; height: 100%; width: 100%; padding: 10px 15%; display: flex; flex-direction: column; align-items: start;">
            <div style="height: 250px; width: 100%; padding: 10px; display: flex; align-items: start;">
                <el-image :src="product?.image_id" :alt="product?.name" class="product-image">
                    <template #placeholder>
                        <div class="product-image-slot">
                            <span>LOADING...</span>
                        </div>
                    </template>
                    <template #error>
                        <div class="product-image-slot">
                            <el-icon>
                                <IconPicture />
                            </el-icon>
                        </div>
                    </template>
                </el-image>
                <div
                    style="flex: 6; margin-left: 30px; height: 100%; display: flex; flex-direction: column; align-items: start; gap: 5px; font-family: sans-serif;">
                    <span style="font-size: 25px;">{{ product?.name }}</span>
                    <span style="font-size: 1.2em; color: #111111dd;">{{ product?.description }}</span>
                    <div
                        style="max-height: 4.5em; overflow: auto; font-size: 1em; display: flex; flex-wrap: wrap; gap: 8px; margin-top: 5px;">
                        <div v-for="tag in tags" :key="tag.id as PropertyKey"
                            style="padding: 4px 7px; border-radius: 12px; background-color: #f0f0f0cc; height: fit-content;">
                            <span>{{ tag.name }}</span>
                        </div>
                    </div>
                    <div style="margin-top: auto; margin-bottom: 5px;">
                        <div style="color: #111111dd;">
                            <!-- TODO -->
                            <!-- <span>售出：{{ product?.soldCount }}</span>
                            <span style="margin-left: 40px;">评价数：{{ product?.commentCount }}</span> -->
                            <span>售出：999</span>
                            <span style="margin-left: 40px;">评价数：0</span>
                        </div>
                        <div style="margin-top: 5px;">
                            <!-- <el-rate v-model="product.commentLevel" disabled /> -->
                            <el-rate v-model="commentLevel" disabled />
                        </div>
                        <div style="font-size: 1.6em;">{{ priceDisplay }}</div>
                    </div>
                </div>
                <div
                    style="box-sizing: border-box; flex: 1; height: 100%; display: flex; flex-direction: column; align-items: end; padding: 10px;">
                    <div style="margin-top: auto;">
                        <el-button size="large" style="width: 100%;">加入购物车</el-button>
                        <el-button size="large" type="primary"
                            style="margin-top: 5px; width: 100%; margin-left: 0;">立即购买</el-button>
                    </div>
                </div>
            </div>
            <div
                style="width: 100%; padding: 8px; margin: 5px 10px; display: flex; flex-direction: column; border-radius: 15px; background-color: #eeeeeecc;">
                <div style="display: flex;">
                    <el-image :src="product?.store.image_id" :alt="product?.store.name"
                        style="width: 80px; height: 80px; border-radius: 10px;">
                        <template #placeholder>
                            <div class="store-image-slot">
                                <span>LOADING...</span>
                            </div>
                        </template>
                        <template #error>
                            <div class="store-image-slot">
                                <el-icon>
                                    <IconPicture />
                                </el-icon>
                            </div>
                        </template>
                    </el-image>
                    <div style="font-family: sans-serif; margin-left: 10px; align-self: center;">
                        <div>店铺</div>
                        <div style="font-size: 1.1em;">{{ product?.store.name }}</div>
                        <div style="color: #222222;">{{ product?.store.description }}</div>
                    </div>
                </div>
                <el-divider style="margin: 5px;" />
                <div v-if="product?.styles"
                    style="margin-left: 10px; display: inline-flex; align-items: center; margin-left: 10px;">
                    <span style="font-family: sans-serif; margin-right: 10px;">选择款式</span>
                    <el-image :src="selectedStyle?.image_id" :alt="selectedStyle?.name"
                        style="width: 50px; height: 50px; border-radius: 8px;">
                        <template #placeholder>
                            <div class="style-image-slot">
                                <span>LOADING...</span>
                            </div>
                        </template>
                        <template #error>
                            <div class="style-image-slot">
                                <el-icon>
                                    <IconPicture />
                                </el-icon>
                            </div>
                        </template>
                    </el-image>
                    <el-select v-model="selectedStyleIdx" size="large" style="width: 250px;">
                        <el-option v-for="style, idx in product.styles" :key="style.id" :label="style.name"
                            :value="idx" />
                    </el-select>
                </div>
            </div>
            <el-divider style="margin: 5px;"/>
            <div id="detail-box" style="margin: 10px 0 10px 10px;">
                <div style="font-family: sans-serif; font-size: 1.5em;">商品详情</div>
                <div v-for="detail in product?.details" :key="detail.id as PropertyKey">
                    <div v-if="detail.text !== null && detail.text.length !== 0">
                        {{ detail.text }}
                    </div>
                    <el-image v-else :src="detail.image_id" style="height: auto; width: auto; max-height: 1000px; max-width: 100%;">
                        <template #placeholder>
                            <div class="el-image-slot">
                                <span>LOADING...</span>
                            </div>
                        </template>
                        <template #error>
                            <div class="el-image-slot">
                                <el-icon>
                                    <IconPicture />
                                </el-icon>
                            </div>
                        </template>
                    </el-image>
                </div>
            </div>
        </div>
    </div>
</template>

<script setup lang="ts">
import { computed, onMounted, ref, type Ref } from 'vue';
import { Picture as IconPicture } from '@element-plus/icons-vue';
import HomeHeader from '@/components/HomeHeader.vue';
import { getGoodDetail } from '@/api';
import type { AxiosResponse } from 'axios';
import type { GoodDetailResponse } from '@/api/schemas';

const { id } = defineProps({
    id: {
        type: Number,
        required: true
    }
})

const product: Ref<GoodDetailResponse | null> = ref(null)
const selectedStyleIdx = ref(product.value?.styles?.length || 0)
const selectedStyle = computed(() => product.value?.styles[selectedStyleIdx.value])
const commentLevel = ref(4)
const tags = computed(() => {
    return product.value?.tag_links.map(tl => tl.tag)
})
const priceDisplay = computed(() => {
    const s = product.value?.price.toString()
    return s?.slice(0, -1) + '.' + s?.slice(-1)
})

onMounted(async () => {
    try {
        product.value = (await getGoodDetail(id) as AxiosResponse<GoodDetailResponse>).data
    } catch (err) {
        console.error(err)
    }
})
</script>

<style scoped>
.product-image {
  width: 250px;
  height: 250px;
}
.product-image-slot,
.store-image-slot,
.style-image-slot,
.el-image-slot {
  display: flex;
  justify-content: center;
  align-items: center;
  width: 100%;
  height: 100%;
  background: var(--el-fill-color-light);
  color: var(--el-text-color-secondary);
  font-size: 20px;
}
.product-image-slot .el-icon {
  font-size: 30px;
}

.el-rate >>> .el-icon {
    font-size: 25px;
}

#detail-box div, span, a {
    margin: 5px;
}
</style>