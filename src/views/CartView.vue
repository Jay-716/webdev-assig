<template>
    <div style="position: absolute; height: 60px; top: 0; left: 0; right: 0; overflow: hidden;">
        <HomeHeader />
    </div>
    <div style="position: absolute; top: 60px; bottom: 80px; left: 0; right: 0; overflow: auto;">
        <div style="padding: 5px 150px;">
            <div class="product-grid">
                <div v-for="product, idx in products" :key="product.id as PropertyKey" class="product-box">
                    <el-image :src="`${baseUrl}/file/download?key=${product.good.image_id}`" :alt="product.good.name"
                        style="width: 175px; aspect-ratio: 1;">
                        <template #placeholder>
                            <div class="product-image-slot sans-font">
                                <span>LOADING...</span>
                            </div>
                        </template>
                        <template #error>
                            <div class="product-image-slot sans-font">
                                <el-icon>
                                    <IconPicture />
                                </el-icon>
                            </div>
                        </template>
                    </el-image>
                    <div class="product-info">
                        <span class="sans-font" style="font-size: 20px; margin-bottom: 5px;">{{ product.good.name
                            }}</span>
                        <span class="sans-font"
                            style="font-size: 16px; font-weight: 400; color: #333a; margin-bottom: 5px;">{{
                            product.good.description }}</span>
                        <span class="sans-font"
                            style="font-size: 14px; font-weight: 400; color: #333a; margin-bottom: 5px;">{{
                            product.style?.name }} x {{ product.count }}</span>
                        <span class="sans-font" style="font-size: 20px; margin-bottom: 5px; margin-top: auto;">{{
                            toPriceDisplay(product.good.price) }}</span>
                    </div>
                    <div style="margin: 15px; margin-left: auto; display: flex; flex-direction: column; align-items: center;">
                        <el-checkbox size="large" v-model="selection[idx]" @change="handleCheckItem(idx)"/>
                    </div>
                </div>
            </div>
        </div>
    </div>
    <div style="position: absolute; bottom: 0; left: 0; right: 0; height: 80px; overflow: hidden;">
        <div class="footer-box sans-font">
            <!-- intermediate state && handle click all -->
            <el-checkbox v-model="checkAll" :indeterminate="isIntermediate" label="全选" size="large" @change="handleCheckAllChange"/>
            <div style="margin-left: auto; display: flex; align-items: center;">
                <span class="sans-font" style="font-size: large; margin-right: 20px;">合计：{{ totalPriceDisplay
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
                <el-table-column property="price_display" label="价格" />
            </el-table>
            <div style="display: flex; align-items: center; margin-top: 15px; padding-left: 5px">
                <span>付款方式：</span>
                <el-select v-model="paymentService" style="width: 200px">
                    <el-option v-for="service in paymentServices" :key="service.id" :label="service.name"
                        :value="service.id" />
                </el-select>
                <div style="margin-left: auto">
                    <span style="margin-right: 20px;">合计：{{ toPriceDisplay(totalPrice) }}</span>
                    <el-button type="primary" @click="handlePay">确认下单</el-button>
                </div>
            </div>
        </div>
    </el-dialog>
</template>

<script setup lang="ts">
import { computed, onMounted, ref, type Ref } from 'vue';
import { Picture as IconPicture } from '@element-plus/icons-vue';
import HomeHeader from '@/components/HomeHeader.vue';
import { getCartItems, getAddresses, getPaymentServices, cartBuy } from '@/api';
import type { CartItemResponse, AddressResponse, PaymentServiceResponse } from '@/api/schemas';
import type { AxiosResponse } from 'axios';
import { ElMessage } from 'element-plus';
import router from '@/router';
import { baseUrl } from '@/config';

const toPriceDisplay = (price: Number) => {
    const s = price.toString()
    return '¥' + s.slice(0, -2) + '.' + s.slice(-2)
}

const checkAll = ref(false)
const isIntermediate = computed(() => selection.value.some(s => s) && !selection.value.every(s => s))
const handleCheckAllChange = (val: boolean) => {
    if (val) {
        selection.value.fill(true)
    } else {
        selection.value.fill(false)
    }
}
const handleCheckItem = (idx: number) => {
    if (selection.value.some(s => s)) {
        checkAll.value = false
    }
    if (selection.value.every(s => s)) {
        checkAll.value = true
    }
}

const totalPrice = computed(() => {
    let sum = 0
    products.value.forEach((p, i) => {
        if (selection.value[i])
            sum += p.good.price as number
    });
    return sum
})
const totalPriceDisplay = computed(() => {
    return toPriceDisplay(totalPrice.value)
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

const handlePay = async () => {
    try {
        const response = await cartBuy({
            cart_item_ids: products.value.filter((_, idx) => selection.value[idx]).map(c => c.id),
            address_id: address.value
        })
        purchaseDialogVisible.value = false
        ElMessage({
            type: 'success',
            message: '购买成功'
        })
        // refresh these shits
        const cart_items = await getCartItems() as AxiosResponse<{
            total: Number;
            page: Number;
            size: Number;
            pages: Number;
            items: Array<CartItemResponse>;
        }>
        products.value = cart_items.data.items
        selection.value = Array(products.value.length).fill(false)
        router.push({
            name: 'order'
        })
    } catch (err) {
        console.error(err)
    }
}

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
        products.value.forEach(p => {
            // @ts-ignore
            p.good.price_display = toPriceDisplay(p.good.price)
        });
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
