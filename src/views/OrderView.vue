<template>
    <div style="position: absolute; height: 60px; top: 0; left: 0; right: 0; overflow: hidden;">
        <HomeHeader />
    </div>
    <div style="position: absolute; top: 60px; bottom: 0; left: 0; right: 0; overflow: auto;">
        <div style="display: flex; flex-direction: column; align-items: center;">
            <div class="order-list">
                <div v-for="order in orders" :key="order.id as PropertyKey" class="order-box"
                    @click="selectedOrder = order; orderDialogVisible = true">
                    <el-image :src="order.order_items[0].good.image_id" :alt="order.order_items[0].good.name"
                        style="width: 100px; aspect-ratio: 1;">
                        <template #placeholder>
                            <div class="order-image-slot">
                                <span>LOADING...</span>
                            </div>
                        </template>
                        <template #error>
                            <div class="order-image-slot">
                                <el-icon>
                                    <IconPicture />
                                </el-icon>
                            </div>
                        </template>
                    </el-image>
                    <div class="order-info">
                        <span style="font-family: sans-serif; font-size: 20px; margin-bottom: 5px;">{{
                            order.order_items[0].good.name }}</span>
                        <div
                            style="display: flex; align-items: last baseline; margin-top: auto; font-family: sans-serif; font-size: 16px; font-weight: 400; color: #333a;">
                            <span style="flex: 1;">订单号：{{ order.id }}</span>
                            <span style="flex: 1;">下单时间：{{ order.created_at.toLocaleDateString() }}</span>
                        </div>
                    </div>
                    <div class="order-status">
                        <el-text type="success" size="large">{{ order.status }}</el-text>
                        <el-text size="large">{{ order.total_price }}</el-text>
                    </div>
                </div>
            </div>
            <div style="padding-bottom: 20px;">
                <el-pagination layout="prev, pager, next" :total="total" @current-change="handlePageChange" />
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
                <el-table-column property="price" label="价格" />
            </el-table>
            <div style="display: flex; align-items: center; margin-top: 15px; padding-left: 5px">
                <!-- TODO -->
                <!-- <span>付款方式：{{ selectedOrder?.paymentService }}</span> -->
                <span>付款方式：xxx</span>
                <div style="margin-left: auto">
                    <span style="margin-right: 20px;">合计：{{ selectedOrder?.total_price }}</span>
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
import { getDetailOrder, getOrders } from '@/api';
import type { AxiosResponse } from 'axios';
import type { OrderDetailResponse, OrderResponse } from '@/api/schemas';

const total = ref(100)
const handlePageChange = function(page: Number) {
    console.log("page changed: " + page)
}

const orders: Ref<Array<OrderDetailResponse>> = ref([])

const selectedOrder: Ref<OrderDetailResponse | undefined> = ref()
const goodView = computed(() => {
    return selectedOrder.value?.order_items.map(g => ({
        name: g.good.name,
        style_name: g.style?.name || g.good.description,
        count: g.count,
        price: g.price
    }))
})
const orderDialogVisible = ref(false)

onMounted(async () => {
    try {
        const orders_response = await getOrders() as AxiosResponse<{
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
    } catch (err) {
        console.error(err)
    }
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
  font-family: sans-serif;
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
    font-family: sans-serif;
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
</style>