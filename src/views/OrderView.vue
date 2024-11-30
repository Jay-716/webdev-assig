<template>
    <div style="position: absolute; height: 60px; top: 0; left: 0; right: 0; overflow: hidden;">
        <HomeHeader />
    </div>
    <div style="position: absolute; top: 60px; bottom: 0; left: 0; right: 0; overflow: auto;">
        <div style="display: flex; flex-direction: column; align-items: center;">
            <div class="order-list">
                <div v-for="order in orders" :key="order.id as PropertyKey" class="order-box"
                    @click="selectedOrder = order; orderDialogVisible = true">
                    <el-image :src="`${baseUrl}/file/download?key=${order.order_items[0].good.image_id}`" :alt="order.order_items[0].good.name"
                        style="width: 100px; aspect-ratio: 1;">
                        <template #placeholder>
                            <div class="order-image-slot sans-font">
                                <span>LOADING...</span>
                            </div>
                        </template>
                        <template #error>
                            <div class="order-image-slot sans-font">
                                <el-icon>
                                    <IconPicture />
                                </el-icon>
                            </div>
                        </template>
                    </el-image>
                    <div class="order-info">
                        <span class="sans-font" style="font-size: 20px; margin-bottom: 5px;">{{
                            order.order_items[0].good.name }}</span>
                        <div class="sans-font"
                            style="display: flex; align-items: last baseline; margin-top: auto; font-size: 16px; font-weight: 400; color: #333a;">
                            <span style="flex: 1;">订单号：{{ order.id }}</span>
                            <span style="flex: 1;">下单时间：{{ order.created_at.toLocaleDateString() }}</span>
                        </div>
                    </div>
                    <div class="order-status sans-font">
                        <!-- This works. Stupid ts. -->
                        <el-text type="success" size="large">{{ statusMap[order.status] }}</el-text>
                        <el-text size="large">{{ toPriceDisplay(order.total_price) }}</el-text>
                    </div>
                </div>
            </div>
            <div style="padding-bottom: 20px;">
                <el-pagination layout="prev, pager, next" :page-count="pages" page-size="5"
                    @current-change="handlePageChange" />
            </div>
        </div>
    </div>
    <el-dialog v-model="orderDialogVisible" title="确认订单" width="800">
        <div style="display: flex; flex-direction: column;">
            <div style="display: flex; align-items: center; padding: 5px 10px;">
                <span>收货地址：{{ selectedOrder?.address.detail }}</span>
            </div>
            <el-table :data="goodView">
                <el-table-column property="name" label="商品名" width="250" />
                <el-table-column property="style_name" label="商品详情" width="350" />
                <el-table-column property="count" label="数量" />
                <el-table-column property="price_display" label="价格" />
            </el-table>
            <div style="display: flex; align-items: center; margin-top: 15px; padding-left: 5px">
                <!-- TODO -->
                <!-- <span>付款方式：{{ selectedOrder?.paymentService }}</span> -->
                <div v-if="selectedOrder?.status === 0" class="flex-row item-center pay-box">
                    <el-select v-model="paymentService" style="width: 200px">
                        <el-option v-for="service in paymentServices" :key="service.id" :label="service.name"
                            :value="service.id" />
                    </el-select>
                    <el-button type="primary" @click="handlePayClick(selectedOrder.id)">支付</el-button>
                </div>
                <div style="margin-left: auto">
                    <span style="margin-right: 20px;">合计：{{ toPriceDisplay(selectedOrder?.total_price) }}</span>
                </div>
            </div>
        </div>
    </el-dialog>
</template>

<script setup lang="ts">
import { computed, onMounted, ref } from 'vue';
import type { Ref } from 'vue';
import { Picture as IconPicture } from '@element-plus/icons-vue';
import HomeHeader from '@/components/HomeHeader.vue';
import { getDetailOrder, getOrders, getPaymentServices, payOrder } from '@/api';
import type { AxiosResponse } from 'axios';
import type { OrderDetailResponse, OrderResponse, PaymentServiceResponse } from '@/api/schemas';
import { ElMessage } from 'element-plus';
import { baseUrl } from '@/config';

const toPriceDisplay = (price: Number) => {
    const s = price.toString()
    return '¥' + s.slice(0, -2) + '.' + s.slice(-2)
}

const page = ref(1)
const pages = ref(1)
const handlePageChange = function(p: Number) {
    console.log("page changed: " + p)
    page.value = p as number
    loadOrders()
}

const orders: Ref<Array<OrderDetailResponse>> = ref([])
const paymentService = ref(0)
const paymentServices: Ref<Array<PaymentServiceResponse>> = ref([])

const selectedOrder: Ref<OrderDetailResponse | undefined> = ref()
const goodView = computed(() => {
    return selectedOrder.value?.order_items.map(g => ({
        name: g.good.name,
        style_name: g.style?.name || g.good.description,
        count: g.count,
        price: g.price,
        price_display: toPriceDisplay(g.price)
    }))
})
const orderDialogVisible = ref(false)

const handlePayClick = async (order_id: Number) => {
    try {
        await payOrder({
            order_id: order_id,
            service_id: paymentService.value
        })
        selectedOrder.value!.status = 1
        orderDialogVisible.value = false
        ElMessage({
            type: 'success',
            message: '支付成功'
        })
    } catch (err) {
        ElMessage({
            type: 'error',
            message: '支付失败'
        })
        console.error(err)
    }
}

const statusMap = {
    0: '未支付',
    1: '已支付',
    2: '已发货',
    3: '交易成功'
}

const loadOrders = async () => {
    try {
        const orders_response = await getOrders(5, page.value) as AxiosResponse<{
            total: Number;
            page: Number;
            size: Number;
            pages: Number;
            items: Array<OrderResponse>;
        }>
        orders.value = await Promise.all(
            orders_response.data.items.map(
                async o => {
                    const data = (await getDetailOrder(o.id) as AxiosResponse<OrderDetailResponse>).data
                    data.created_at = new Date(data.created_at)
                    data.updated_at = new Date(data.updated_at)
                    return data
                }
            )
        )
        pages.value = orders_response.data.pages as number
        const services = await getPaymentServices() as AxiosResponse<Array<PaymentServiceResponse>>
        paymentServices.value = services.data
        paymentService.value = paymentServices.value[0].id as number
    } catch (err) {
        console.error(err)
    }
}

onMounted(async () => {
    loadOrders()
})
</script>

<style scoped>
.order-list {
    box-sizing: border-box;
    width: 100%;
    display: list-item;
    list-style-type: none;
    padding: 5px 250px;
}

.order-box {
    margin: 10px 0;
    padding: 5px;
    height: 100px;
    display: flex;
    align-items: center;
    outline: 2px #eeeeee solid;
    border-radius: 10px;
    overflow: hidden;
    cursor: pointer;
    transition: ease 200ms;
}
.order-box:hover {
    outline: 3px #cccccc solid;
    box-shadow: 5px 5px 3px #dddddd;
    transition: ease 200ms;
}
.order-image-slot {
  display: flex;
  justify-content: center;
  align-items: center;
  width: 100%;
  height: 100%;
  background: var(--el-fill-color-light);
  color: var(--el-text-color-secondary);
  font-size: 14px;
}
.order-info {
    display: flex;
    flex-direction: column;
    height: 100%;
    box-sizing: border-box;
    padding: 10px;
    align-self: flex-start;
    flex: 9;
}
.order-status {
    box-sizing: border-box;
    height: 100%;
    padding: 10px;
    margin-left: auto;
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    align-items: last baseline;
    flex: 1;
}

.product-image-slot {
  display: flex;
  justify-content: center;
  align-items: center;
  width: 100%;
  height: 100%;
  background: var(--el-fill-color-light);
  color: var(--el-text-color-secondary);
  font-size: 30px;
}

.pay-box .el-button {
    margin-left: 0.3rem;
}
</style>
