<template>
    <div style="position: absolute; height: 4rem; top: 0; left: 0; right: 0; overflow: hidden;">
        <HomeHeader />
    </div>
    <div style="position: absolute; top: 4rem; bottom: 0; left: 0; right: 0; overflow: auto;">
        <div class="content">
            <div class="left-content good-box">
                <StoreGoodCard v-for="good in goods" :key="good.id as PropertyKey" :good="good"
                    @click="handleGoodCardClick(good.id)" />
            </div>
            <div class="seperator"></div>
            <div class="right-content flex-col item-center">
                <div class="store-stat-box flex-row item-center justc sans-font">
                    <div class="flex-col item-center">
                        <div>今日订单数</div>
                        <div>{{ storeProfile?.day_order_count }}</div>
                    </div>
                    <div class="flex-col item-center">
                        <div>今日销售额</div>
                        <div>{{ storeProfile?.day_total_price }}</div>
                    </div>
                    <div class="flex-col item-center">
                        <div>本月订单数</div>
                        <div>{{ storeProfile?.month_order_count }}</div>
                    </div>
                    <div class="flex-col item-center">
                        <div>本月销售额</div>
                        <div>{{ storeProfile?.month_total_price }}</div>
                    </div>
                </div>
                <div class="flex-col item-center sans-font orders-box">
                    <div class="orders-box-title">待处理订单</div>
                    <div v-for="oi in pendingOrderItems" :key="oi.id as PropertyKey" class="order-item-box flex-row">
                        <div class="flex-col order-item-detail">
                            <div>{{ oi.good.name }}</div>
                            <div>{{ oi.style ? oi.style.name : oi.good.description }}</div>
                            <div>{{ oi.price }} x {{ oi.count }}</div>
                        </div>
                        <div class="flex-col order-item-op item-center justc">
                            <el-button type="primary" @click="handleSendClick(oi.id)">发货</el-button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
    <el-dialog v-model="sendDialogVisible" title="确认发货" width="500">
        <div class="flex-col">
            <div class="flex-col item-center" style="padding: 5px 10px;">
                <div>收货姓名：{{ sendAddress?.name }}</div>
                <div>电话号码：{{ sendAddress?.phone_number }}</div>
                <div>详细地址：{{ sendAddress?.detail }}</div>
                <div class="flex-row item-center" style="margin-top: 0.5rem;">
                    <el-button @click="sendDialogVisible = false">取消</el-button>
                    <el-button type="primary" @click="handleConfirmSend">确认发货</el-button>
                </div>
            </div>
        </div>
    </el-dialog>
    <el-dialog v-model="goodDialogVisible" title="商品详情" width="500">
        <div class="flex-col">
            <div class="flex-col item-center" style="padding: 5px 10px;">
                <div>本日销量：{{ goodProfile?.day_count }}</div>
                <div>本月销量：{{ goodProfile?.month_count }}</div>
                <div>近期流水：</div>
                <div v-for="stat in goodProfile?.timeline">
                    <div>{{ stat[0] }} {{ stat[1] }}</div>
                </div>
            </div>
            <div class="flex-row item-center" style="margin-top: 0.5rem;">
                <el-button type="primary" @click="handleGoodDetailClick" style="margin-left: auto;">查看/更新商品详情</el-button>
                <el-button type="danger" @click="handleDeleteGoodClick">删除商品</el-button>
            </div>
        </div>
    </el-dialog>
</template>

<script setup lang="ts">
import HomeHeader from '@/components/HomeHeader.vue';
import StoreGoodCard from '@/components/StoreGoodCard.vue';
import { useUserStore } from '@/store/user';
import { ElMessage } from 'element-plus';
import { cartBuy, deleteGood, getOrderItemAddress, getOrderItemStatus, getStoreGoodOrders, getStoreGoodProfile, getStoreGoods, getStoreProfile, sendOrderItem } from '@/api';
import type { AxiosResponse } from 'axios';
import type { AddressResponse, GoodResponse, OrderItemResponse, Page, StoreGoodProfileResponse, StoreProfileResponse } from '@/api/schemas';
import { onMounted, ref, type Ref } from 'vue';
import router from '@/router';

const userStore = useUserStore()
const goods: Ref<Array<GoodResponse>> = ref([])
const storeProfile: Ref<StoreProfileResponse | undefined> = ref()
const orderItems: Ref<Array<OrderItemResponse>> = ref([])
const pendingOrderItems: Ref<Array<OrderItemResponse>> = ref([])
const sendDialogVisible = ref(false)
const sendAddress: Ref<AddressResponse | undefined> = ref()
const orderItemId = ref(0)

const handleSendClick = async (order_item_id: Number) => {
    try {
        const addr_resp = await getOrderItemAddress(order_item_id) as AxiosResponse<AddressResponse>
        sendAddress.value = addr_resp.data
        orderItemId.value = order_item_id as number
        sendDialogVisible.value = true
    } catch (err) {
        console.error(err)
        ElMessage({
            type: 'error',
            message: '获取发货地址失败'
        })
    }
}
const handleConfirmSend = async () => {
    try {
        await sendOrderItem(orderItemId.value)
        pendingOrderItems.value = pendingOrderItems.value.filter(oi => oi.id !== orderItemId.value)
        sendDialogVisible.value = false
    } catch (err) {
        console.error(err)
        ElMessage({
            type: 'error',
            message: '确认发货失败'
        })
    }
}

const goodId = ref(0)
const goodProfile: Ref<StoreGoodProfileResponse | undefined> = ref()
const goodDialogVisible = ref(false)
const handleGoodCardClick = async (good_id: Number) => {
    try {
        goodId.value = good_id as number
        const resp = await getStoreGoodProfile(good_id) as AxiosResponse<StoreGoodProfileResponse>
        goodProfile.value = resp.data
        goodDialogVisible.value = true
    } catch (err) {
        console.error(err)
        ElMessage({
            type: 'error',
            message: '获取商品报表失败'
        })
    }
}

const handleGoodDetailClick = () => {
    router.push({
        name: 'product-detail',
        params: {
            id: goodId.value
        },
    })
}
const handleDeleteGoodClick = async () => {
    try {
        await deleteGood(goodId.value)
        await loadAddData()
        goodDialogVisible.value = false
        ElMessage({
            type: 'success',
            message: '删除成功'
        })
    } catch (err) {
        console.error(err)
        goodDialogVisible.value = false
        ElMessage({
            type: 'error',
            message: '删除失败'
        })
    }
}

const loadAddData = async () => {
    try {
        const goods_reponse = await getStoreGoods() as AxiosResponse<Page<GoodResponse>>
        goods.value = goods_reponse.data.items
        const store_profile_response = await getStoreProfile() as AxiosResponse<StoreProfileResponse>
        storeProfile.value = store_profile_response.data
        for (const good of goods.value) {
            const oi_reponse = await getStoreGoodOrders(good.id) as AxiosResponse<Page<OrderItemResponse>>
            orderItems.value.push(...oi_reponse.data.items)
        }
        pendingOrderItems.value = await Promise.all(orderItems.value.filter(async oi => {
            const status_response = await getOrderItemStatus(oi.id) as AxiosResponse<Boolean>
            return !status_response.data
        }))
    } catch (err) {
        ElMessage({
            type: 'error',
            message: '数据加载失败，请刷新页面'
        })
        console.error(err)
    }
}

onMounted(async () => {
    await loadAddData()
})
</script>

<style scoped>
* {
    box-sizing: border-box;
}

.content {
    padding: 1rem 10rem;
    width: 100%;
    height: 100%;
    display: flex;
}

.seperator {
    width: 0;
    height: 100%;
    border: 0.05rem solid #ccc;
}

.left-content,
.right-content {
    width: 50%;
    height: 100%;
    padding: 0.5rem;
}

.good-box {
    display: flex;
    flex-wrap: wrap;
    overflow: auto;
    gap: 0.4rem;
}

.store-stat-box {
    gap: 1rem;
    padding: 1rem;
    width: 90%;
    background-color: #fafafa;
    border-radius: 0.5rem;
    transition: ease 100ms;
    overflow: hidden;
}
.store-stat-box:hover {
    background-color: #efefef;
    box-shadow: 0.4rem 0.4rem 0.4rem rgba(0, 0, 0, 0.1);
    transition: ease 100ms;
}
.store-stat-box div:nth-child(1) {
    font-size: 1.2rem;
}
.store-stat-box div:nth-child(2) {
    margin-top: 0.3rem;
    font-size: 1.1rem;
}

.orders-box {
    margin: 1rem 0;
    width: 100%;
    height: 100%;
    padding: 0.7rem;
    background-color: #efefef;
    border-radius: 0.5rem;
    transition: ease 100ms;
    overflow: auto;
}
.orders-box:hover {
    background-color: #eeeeee;
    box-shadow: 0 0 0.4rem 0.4rem rgba(0, 0, 0, 0.1);
    transition: ease 100ms;
}
.orders-box-title {
    align-self: start;
    font-size: 1.3rem;
}

.order-item-box {
    width: 100%;
}
.order-item-detail {
    padding: 0.2rem;
}
.order-item-op {
    margin-left: auto;
}
</style>