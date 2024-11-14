<template>
    <div class="product-card" ref="productCard">
        <img :src="product.image" :alt="product.name" class="product-image" />
        <div class="product-info">
            <h3 class="product-name">{{ product.name }}</h3>
            <span class="product-description">{{ product.description }}</span>
            <span class="product-price">{{ product.price }}</span>
            <button class="add-to-cart">Add to Cart</button>
        </div>
    </div>
</template>

<script setup lang="ts">
import { onMounted, useTemplateRef } from 'vue';

const { product, height, width } = defineProps({
    product: {
        type: Object,
        required: true
    },
    height: {
        type: String,
        required: false,
    },
    width: {
        type: String,
        required: false
    }
})

var productCard = useTemplateRef('productCard')

onMounted(() => {
    productCard.value?.focus()
    if (height !== undefined && height.length !== 0) {
        if (productCard.value) {
            productCard.value.style.height = height
        }
    }
    if (width !== undefined && width.length !== 0) {
        if (productCard.value)
            productCard.value.style.width = width
    }
})
</script>

<style scoped>
.product-card {
  background-color: #fff;
  border: 1px solid #ccc;
  border-radius: 8px;
  overflow: hidden; /* To keep image and content within the card */
  box-shadow: 0 2px 5px rgba(0, 0, 0, 0.1);
}
.product-image {
  width: 100%;
  height: auto;
  object-fit: cover; /* Ensures the image covers the card without distortion */
}
.product-info {
  padding: 15px;
}
.product-name {
  font-size: 18px;
  font-weight: bold;
  margin: 0;
}
.product-description {
  font-size: 14px;
  color: #666;
}
.product-price {
  display: block;
  font-size: 16px;
  color: #333;
  margin-top: 10px;
}

.add-to-cart {
  background-color: #007bff;
  color: #fff;
  border: none;
  padding: 10px;
  width: 100%;
  cursor: pointer;
  font-size: 16px;
  border-radius: 4px;
  transition: background-color 0.3s;
}
.add-to-cart:hover {
  background-color: #0056b3;
}
</style>