<template>
    <div style="position: absolute; height: 60px; top: 0; left: 0; right: 0; overflow: hidden;">
        <HomeHeader />
    </div>
    <div style="position: absolute; top: 60px; bottom: 0; left: 0; right: 0; overflow: auto;">
        <div style="display: flex; flex-direction: column; align-items: center;">
            <div class="order-list">
                <div v-for="order in orders" :key="order.id as PropertyKey" class="order-box"
                    @click="selectedOrder = order; orderDialogVisible = true">
                    <el-image :src="order.products[0].image" :alt="order.products[0].name"
                        style="width: 100px; aspect-ratio: 1;">
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
                    <div class="order-info">
                        <span style="font-family: sans-serif; font-size: 20px; margin-bottom: 5px;">{{
                            order.products[0].name }}</span>
                        <div
                            style="display: flex; align-items: last baseline; margin-top: auto; font-family: sans-serif; font-size: 16px; font-weight: 400; color: #333a;">
                            <span style="flex: 1;">订单号：{{ order.order_id }}</span>
                            <span style="flex: 1;">下单时间：{{ order.created_at.toDateString() }}</span>
                        </div>
                    </div>
                    <div class="order-status">
                        <el-text type="success" size="large">{{ order.status }}</el-text>
                        <el-text size="large">{{ order.totalPrice }}</el-text>
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
                <span>收货地址：{{ selectedOrder?.address }}</span>
            </div>
            <el-table :data="selectedOrder?.products">
                <el-table-column property="name" label="商品名" width="250" />
                <el-table-column property="description" label="商品详情" width="400" />
                <el-table-column property="price" label="价格" />
            </el-table>
            <div style="display: flex; align-items: center; margin-top: 15px; padding-left: 5px">
                <span>付款方式：{{ selectedOrder?.paymentService }}</span>
                <div style="margin-left: auto">
                    <span style="margin-right: 20px;">合计：{{ selectedOrder?.totalPrice }}</span>
                </div>
            </div>
        </div>
    </el-dialog>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import type { Ref } from 'vue';
import { Picture as IconPicture } from '@element-plus/icons-vue';
import HomeHeader from '@/components/HomeHeader.vue';

interface IOrder {
    id: Number,
    order_id: String,
    status: String,
    address: String,
    products: Array<Object>,
    totalPrice: Number,
    paymentService: String,
    created_at: Date,
}

const total = ref(100)
const handlePageChange = function(page: Number) {
    console.log("page changed: " + page)
}

// TODO: add a computed property that maps orders to orderDisplays
const orders: Ref<Array<IOrder>> = ref([
    { id: 1, order_id: "ABC12345", status: "运输中", created_at: new Date(), address: "scut1", products: [{name: "123", image: "http://empty"}], totalPrice: 12345, paymentService: "微信支付" },
    { id: 2, order_id: "ABC12346", status: "交易成功", created_at: new Date(), address: "scut2", products: [{name: "123", image: "http://empty"}], totalPrice: 12345, paymentService: "微信支付" },
    { id: 3, order_id: "ABC12347", status: "交易成功", created_at: new Date(), address: "scut3", products: [{name: "123", image: "http://empty"}], totalPrice: 12345, paymentService: "微信支付" },
    { id: 4, order_id: "ABC12348", status: "交易成功", created_at: new Date(), address: "scut4", products: [{name: "123", image: "http://empty"}], totalPrice: 12345, paymentService: "微信支付" },
])

const selectedOrder: Ref<IOrder | undefined> = ref()
const orderDialogVisible = ref(false)
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
  font-size: 30px;
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