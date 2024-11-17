<template>
    <div style="position: absolute; height: 60px; top: 0; left: 0; right: 0; overflow: hidden;">
        <HomeHeader />
    </div>
    <div style="position: absolute; top: 60px; bottom: 80px; left: 0; right: 0; overflow: auto;">
        <div style="padding: 5px 150px;">
            <div class="product-grid">
                <div v-for="product in products" :key="product.id" class="product-box">
                    <el-image :src="product.image" :alt="product.name" style="width: 175px; aspect-ratio: 1;">
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
                        <span style="font-family: sans-serif; font-size: 20px; margin-bottom: 5px;">{{ product.name}}</span>
                        <span
                            style="font-family: sans-serif; font-size: 16px; font-weight: 400; color: #333a; margin-bottom: 5px;">{{product.description }}</span>
                        <span style="font-family: sans-serif; font-size: 20px; margin-bottom: 5px; margin-top: auto;">{{product.price }}</span>
                    </div>
                    <el-checkbox size="large" v-model="product.selected" style="margin: 15px; margin-left: auto;" />
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
                    <el-option v-for="a in addresses" :key="a.id" :label="a.display" :value="a.id"/>
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
                    <el-option v-for="service in paymentServices" :key="service.id" :label="service.name" :value="service.id" />
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
import { computed, ref } from 'vue';
import { Picture as IconPicture } from '@element-plus/icons-vue';
import HomeHeader from '@/components/HomeHeader.vue';

const totalPrice = ref(12345)
const totalPriceDisplay = computed(() => {
    let s = totalPrice.value.toString()
    return s.slice(0, -2) + '.' + s.slice(-2)
})
const selectAll = ref(false)
const products = ref([
    { id: 1, name: 'Product 1', description: 'Description 1', price: '$19.99', image: '/path/to/image1.jpg', selected: false },
    { id: 2, name: 'Product 2', description: 'Description 2', price: '$29.99', image: '/path/to/image2.jpg', selected: false },
    { id: 3, name: 'Product 3', description: 'Description 3', price: '$39.99', image: '/path/to/image3.jpg', selected: false },
    { id: 4, name: 'Product 4', description: 'Description 4', price: '$49.99', image: '/path/to/image4.jpg', selected: false },
    { id: 4, name: 'Product 4', description: 'Description 4', price: '$49.99', image: '/path/to/image4.jpg', selected: false },
    { id: 4, name: 'Product 4', description: 'Description 4', price: '$49.99', image: '/path/to/image4.jpg', selected: false },
    { id: 4, name: 'Product 4', description: 'Description 4', price: '$49.99', image: '/path/to/image4.jpg', selected: false },
])
const selectedProducts = computed(() => products.value.filter(p => p.selected))

const purchaseDialogVisible = ref(false)
const address = ref(1)
const addresses = ref([{ id: 1, display: "scut" }])
const paymentService = ref(1)
const paymentServices = ref([{ id: 1, name: '支付宝' }, { id: 2, name: '微信支付' }, { id: 3, name: '银联' }])
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
  font-size: 30px;
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