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
                    <div v-if="!storeLogin" style="margin-top: auto;">
                        <el-button size="large" style="width: 100%;" @click="handleAddToCart">加入购物车</el-button>
                        <el-button size="large" type="primary" @click="handleDirectBuy"
                            style="margin-top: 5px; width: 100%; margin-left: 0;">立即购买</el-button>
                    </div>
                    <div v-else style="margin-top: auto;">
                        <el-button size="large" type="primary" @click="updateDialogVisible = true"
                            style="margin-top: 5px; width: 100%; margin-left: 0;">更新商品</el-button>
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
                <div v-if="product?.styles !== null && product?.styles.length !== 0"
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
                        <el-option v-for="style, idx in product?.styles" :key="style.id" :label="style.name"
                            :value="idx" />
                    </el-select>
                </div>
            </div>
            <el-divider style="margin: 5px;" />
            <div id="detail-box" style="margin: 10px 0 10px 10px;">
                <div style="font-family: sans-serif; font-size: 1.5em;">商品详情</div>
                <div v-for="detail in product?.details" :key="detail.id as PropertyKey">
                    <div v-if="detail.text !== null && detail.text.length !== 0">
                        {{ detail.text }}
                    </div>
                    <el-image v-else :src="detail.image_id"
                        style="height: auto; width: auto; max-height: 1000px; max-width: 100%;">
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
    <el-dialog v-model="updateDialogVisible" title="更新商品信息" width="700">
        <div class="flex-col">
            <div class="flex-col item-center" style="padding: 5px 10px;">
                <el-form v-model="product" label-width="auto" style="width: 100%">
                    <el-form-item label="商品名">
                        <el-input v-model="product!.name" />
                    </el-form-item>
                    <el-form-item label="商品简介">
                        <el-input v-model="product!.description" type="textarea" />
                    </el-form-item>
                    <el-form-item label="商品价格">
                        <el-input v-model="product!.price" />
                    </el-form-item>
                    <div class="flex-row">
                        <div class="detail-edit-label">商品详情</div>
                        <div class="flex-col detail-edit-box">
                            <div v-for="detail, idx in product?.details" class="flex-row detail-edit-item">
                                <el-input v-if="detail.text !== null" v-model="product!.details[idx].text">
                                    {{ detail.text }}
                                </el-input>
                                <img v-else :src="`${baseUrl}/file/download/${detail.image_id}`" />
                                <div style="margin-left: auto;" class="flex-row item-center detail-edit-buttons">
                                    <el-button size="small" link @click="handleInsertBelow(detail.id)">插入</el-button>
                                    <el-button size="small" link @click="handleDeleteItem(detail.id)">删除</el-button>
                                </div>
                            </div>
                        </div>
                    </div>
                </el-form>
                <div class="flex-row item-center">
                    <el-button @click="updateDialogVisible = false">取消</el-button>
                    <el-button type="primary" @click="handleUpdateGood">确认</el-button>
                </div>
            </div>
        </div>
    </el-dialog>
</template>

<script setup lang="ts">
import { computed, onMounted, ref, type Ref } from 'vue';
import { Picture as IconPicture } from '@element-plus/icons-vue';
import HomeHeader from '@/components/HomeHeader.vue';
import { addToCart, directBuy, getAddresses, getGoodDetail, updateGood } from '@/api';
import type { AxiosResponse } from 'axios';
import type { AddressResponse, DetailResponse, GoodDetailResponse } from '@/api/schemas';
import { ElMessage } from 'element-plus';
import router from '@/router';
import { baseUrl } from '@/config';

const { id } = defineProps({
    id: {
        type: Number,
        required: true
    }
})
const storeLogin = ref(localStorage.getItem('store') === '1')

const product: Ref<GoodDetailResponse | null> = ref(null)
const selectedStyleIdx = ref(product.value?.styles?.length || 0)
const selectedStyle = computed(() => product.value?.styles[selectedStyleIdx.value])
const count = ref("")
const commentLevel = ref(4)
const tags = computed(() => {
    return product.value?.tag_links.map(tl => tl.tag)
})
const priceDisplay = computed(() => {
    const s = product.value?.price.toString()
    return s?.slice(0, -1) + '.' + s?.slice(-1)
})

const handleAddToCart = async () => {
    try {
        const response = await addToCart({
            good_id: product.value?.id as number,
            style_id: selectedStyle.value?.id || null,
            count: 1
        })
        ElMessage({
            type: 'success',
            message: '加入购物车成功'
        })
    } catch (err) {
        console.error(err)
    }
}
const handleDirectBuy = async () => {
    try {
        const response = await directBuy({
            good_id: product.value?.id as number,
            style_id: selectedStyle.value?.id || null,
            count: 1,
            address_id: (await getAddresses() as AxiosResponse<{
                total: Number;
                page: Number;
                size: Number;
                pages: Number;
                items: Array<AddressResponse>;
            }>).data.items[0].id
        })
        ElMessage({
            type: 'success',
            message: '购买成功'
        })
        router.push({
            name: 'order'
        })
    } catch (err) {
        console.error(err)
    }
}

let tempDetailId = -1
const updateDialogVisible = ref(false)
const handleUpdateGood = async () => {
    try {
        const styles = product.value?.styles
        product.value!.styles = null!
        await updateGood(product.value!.id, product.value)
        product.value!.styles = styles!
        updateDialogVisible.value = false
        ElMessage({
            type: 'success',
            message: '更新成功'
        })
    } catch (err) {
        console.error(err)
        ElMessage({
            type: 'error',
            message: '更新失败'
        })
    }
}
const handleDeleteItem = (detail_id: Number) => {
    if (product.value?.details) {
        product.value.details = product.value?.details.filter(d => d.id !== detail_id)
    }
}
const handleInsertBelow = (detail_id: Number) => {
    if (!product.value?.details)
        return
    const idx = product.value.details.findIndex(d => d.id == detail_id)
    product.value.details.splice(idx, 0, {
        id: tempDetailId--,
        text: '',
        image_id: null,
        good_id: -1
    })
}

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
  font-size: 14px;
  font-family: sans-serif;
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

.detail-edit-label {
    width: 5rem;
}
.detail-edit-box {
    width: 100%;
    gap: 0.3rem;
}
.detail-edit-item {
    width: 100%;
    max-height: 200rem;
}
.detail-edit-buttons .el-button {
    margin-left: 0.3rem;
}
</style>