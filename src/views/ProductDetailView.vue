<template>
    <div style="position: absolute; height: 60px; top: 0; left: 0; right: 0; overflow: hidden;">
        <HomeHeader />
    </div>
    <div id="content" style="position: absolute; top: 60px; bottom: 0; left: 0; right: 0; overflow: auto;">
        <div
            style="box-sizing: border-box; height: 100%; width: 100%; padding: 10px 15%; display: flex; flex-direction: column; align-items: start;">
            <div style="height: 250px; width: 100%; padding: 10px; display: flex; align-items: start;">
                <el-image :src="product.image" :alt="product.name" class="product-image">
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
                    <span style="font-size: 25px;">{{ product.name }}</span>
                    <span style="font-size: 1.2em; color: #111111dd;">{{ product.description }}</span>
                    <div
                        style="max-height: 4.5em; overflow: auto; font-size: 1em; display: flex; flex-wrap: wrap; gap: 8px; margin-top: 5px;">
                        <div v-for="tag in product.tags" :key="tag.id"
                            style="padding: 4px 7px; border-radius: 12px; background-color: #f0f0f0cc; height: fit-content;">
                            <span>{{ tag.name }}</span>
                        </div>
                    </div>
                    <div style="margin-top: auto; margin-bottom: 5px;">
                        <div style="color: #111111dd;">
                            <span>售出：{{ product.soldCount }}</span>
                            <span style="margin-left: 40px;">评价数：{{ product.commentCount }}</span>
                        </div>
                        <div style="margin-top: 5px;">
                            <el-rate v-model="product.commentLevel" disabled />
                        </div>
                        <div style="font-size: 1.6em;">{{ product.price }}</div>
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
                    <el-image :src="product.store.image_url" :alt="product.store.name"
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
                        <div style="font-size: 1.1em;">{{ product.store.name }}</div>
                        <div style="color: #222222;">{{ product.store.description }}</div>
                    </div>
                </div>
                <el-divider style="margin: 5px;" />
                <div v-if="product.styles?.length > 0"
                    style="margin-left: 10px; display: inline-flex; align-items: center; margin-left: 10px;">
                    <span style="font-family: sans-serif; margin-right: 10px;">选择款式</span>
                    <el-image :src="selectedStyle.image_url" :alt="selectedStyle.name"
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
                <div v-for="detail in product.details" :key="detail.id">
                    <div v-if="detail.text !== null && detail.text.length !== 0">
                        {{ detail.text }}
                    </div>
                    <el-image v-else :src="detail.image_url" style="height: auto; width: auto; max-height: 1000px; max-width: 100%;">
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
import { computed, ref } from 'vue';
import { Picture as IconPicture } from '@element-plus/icons-vue';
import HomeHeader from '@/components/HomeHeader.vue';

const { id } = defineProps({
    id: {
        type: Number,
        required: true
    }
})

const product = ref({
    id: 1,
    name: 'Product 1',
    description: 'Description 1',
    price: '$19.99',
    image: 'http://empty',
    tags: [{id: 1, name: "tag1"}, {id: 2, name: "tag2"}, {id: 3, name: "tag3"}, {id: 4, name: "tag4"}],
    soldCount: 99989,
    commentCount: 1680,
    commentLevel: 4,
    store: {
        id: 123,
        name: 'xxx\'s store',
        description: 'Here is xxx\'s store. 这是一个介绍这是一个介绍这是一个介绍这是一个介绍这是一个介绍',
        image_url: 'http://emtpy'
    },
    styles: [
        {id: 111, image_url: 'http://empty', name: '三件套'},
        {id: 112, image_url: 'http://empty', name: '四件套'},
        {id: 113, image_url: 'http://empty', name: '五件套'},
    ],
    details :[
        {id: 1, text: '这是商品详情1', image_url: null},
        {id: 2, text: '这是商品详情2', image_url: null},
        {id: 3, text: '这是商品详情3', image_url: null},
        {id: 4, text: '这是商品详情4', image_url: null},
        {id: 5, text: null, image_url: 'http://empty'},
        {id: 6, text: '这是商品详情6', image_url: null},
        {id: 7, text: '这是商品详情7', image_url: null},
        {id: 8, text: '这是商品详情8', image_url: null},
    ]
})
const selectedStyleIdx = ref(product.value.styles?.length > 0 ? 0 : -1)
const selectedStyle = computed(() => product.value.styles[selectedStyleIdx.value])
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