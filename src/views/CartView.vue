<template>
    <div style="position: absolute; height: 60px; top: 0; left: 0; right: 0; overflow: hidden;">
        <HomeHeader />
    </div>
    <div style="position: absolute; top: 60px; bottom: 80px; left: 0; right: 0; overflow: auto;">
        <div style="padding: 5px 150px;">
            <div class="product-grid">
                <div v-for="product, idx in products" :key="product.id as PropertyKey" class="product-box">
                    <el-image :src="product.good.image_id" :alt="product.good.name"
                        style="width: 175px; aspect-ratio: 1;">
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
                    <div class="product-info">
                        <span style="font-family: sans-serif; font-size: 20px; margin-bottom: 5px;">{{ product.good.name
                            }}</span>
                        <span
                            style="font-family: sans-serif; font-size: 16px; font-weight: 400; color: #333a; margin-bottom: 5px;">{{
                            product.good.description }}</span>
                        <span
                            style="font-family: sans-serif; font-size: 14px; font-weight: 400; color: #333a; margin-bottom: 5px;">{{
                            product.style?.name }} x {{ product.count }}</span>
                        <span style="font-family: sans-serif; font-size: 20px; margin-bottom: 5px; margin-top: auto;">{{
                            product.good.price }}</span>
                    </div>
                    <div style="margin: 15px; margin-left: auto; display: flex; flex-direction: column; align-items: center;">
                        <el-checkbox size="large" v-model="selection[idx]" />
                    </div>
                </div>
            </div>
        </div>
    </div>
    <div style="position: absolute; bottom: 0; left: 0; right: 0; height: 80px; overflow: hidden;">
        <div class="footer-box">
            <!-- intermediate state && handle click all -->
            <el-checkbox v-model="selectAll" label="全选" size="large" />
            <div style="margin-left: auto; display: flex; align-items: center;">
                <span style="font-family: sans-serif; font-size: large; margin-right: 20px;">合计：{{ totalPriceDisplay
                    }}</span>
                <el-button type="primary" size="large" round @click="purchaseDialogVisible = true"
                    style="margin: 0 10px;">结算</el-button>
            </div>
        </div>
    </div>
    <el-dialog v-model="purchaseDialogVisible" title="确认订单" width="800">
        <div style="display: flex; flex-direction: column;">
            <div style="display: flex; align-items: center; padding: 5px 10px;">
                <span>收货地址：</span>
                <el-select v-model="address" style="width: 300px;">
                    <el-option v-for="a in addresses" :key="a.id" :label="a.detail" :value="a.id" />
                </el-select>
            </div>
            <el-table :data="selectedProducts">
                <el-table-column property="name" label="商品名" width="250" />
                <el-table-column property="description" label="商品详情" width="400" />
                <el-table-column property="price" label="价格" />
            </el-table>
            <div style="display: flex; align-items: center; margin-top: 15px; padding-left: 5px">
                <span>付款方式：</span>
                <el-select v-model="paymentService" style="width: 200px">
                    <el-option v-for="service in paymentServices" :key="service.id" :label="service.name"
                        :value="service.id" />
                </el-select>
                <div style="margin-left: auto">
                    <span style="margin-right: 20px;">合计：{{ totalPrice }}</span>
                    <el-button type="primary">支付</el-button>
                </div>
            </div>
        </div>
    </el-dialog>
</template>

<script setup lang="ts">
import { computed, onMounted, ref, type Ref } from 'vue';
import { Picture as IconPicture } from '@element-plus/icons-vue';
import HomeHeader from '@/components/HomeHeader.vue';
import { getCartItems, getAddresses, getPaymentServices } from '@/api';
import type { CartItemResponse, AddressResponse, PaymentServiceResponse } from '@/api/schemas';
import type { AxiosResponse } from 'axios';

const totalPrice = ref(12345)
const totalPriceDisplay = computed(() => {
    let s = totalPrice.value.toString()
    return s.slice(0, -2) + '.' + s.slice(-2)
})
const selectAll = ref(false)
const products: Ref<Array<CartItemResponse>> = ref([])
const selection: Ref<Array<Boolean>> = ref([])
const selectedProducts = computed(() => products.value.filter((_, idx) => selection.value[idx]).map(c => c.good))

const purchaseDialogVisible = ref(false)
const address = ref(0)
const addresses: Ref<Array<AddressResponse>> = ref([])
const paymentService = ref(0)
const paymentServices: Ref<Array<PaymentServiceResponse>> = ref([])

onMounted(async () => {
    try {
        const cart_items = await getCartItems() as AxiosResponse<{
            total: Number;
            page: Number;
            size: Number;
            pages: Number;
            items: Array<CartItemResponse>;
        }>
        products.value = cart_items.data.items
        selection.value = Array(products.value.length).fill(false)
    } catch (err) {
        console.error(err)
    }
    try {
        const address_response = await getAddresses() as AxiosResponse<{
            total: Number;
            page: Number;
            size: Number;
            pages: Number;
            items: Array<AddressResponse>;
        }>
        addresses.value = address_response.data.items
        address.value = addresses.value[0].id as number
    } catch (err) {
        console.error(err)
    }
    try {
        const services = await getPaymentServices() as AxiosResponse<Array<PaymentServiceResponse>>
        paymentServices.value = services.data
        paymentService.value = paymentServices.value[0].id as number
    } catch (err) {
        console.error(err)
    }
})
</script>

<style scoped>
.el-header {
    padding: 0;
}

.el-main {
    --el-main-padding: 0;
}

.product-grid {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(400px, 1fr));
    gap: 20px;
    padding: 20px;
}
.product-box {
    display: flex;
    align-items: center;
    border: 2px #eeeeee solid;
    border-radius: 10px;
    overflow: hidden;
}
.product-image-slot {
  display: flex;
  justify-content: center;
  align-items: center;
  width: 100%;
  height: 100%;
  background: var(--el-fill-color-light);
  color: var(--el-text-color-secondary);
  font-size: 16px;
  font-family: sans-serif;
}
.product-info {
    display: flex;
    flex-direction: column;
    height: 100%;
    box-sizing: border-box;
    padding: 15px;
    align-self: flex-start;
}

.footer-box {
    height: 70px;
    margin: 5px;
    padding: 5px;
    display: flex;
    align-items: center;
    background-color: #f4f4f4;
    border-radius: 10px;
    box-sizing: border-box;
}
.footer-box .el-checkbox {
    margin: 0 10px;
}
.footer-box .el-checkbox >>> .el-checkbox__label {
    font-size: larger;
    font-family: sans-serif;
}

</style>