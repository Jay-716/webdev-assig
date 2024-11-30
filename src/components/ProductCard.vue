<template>
    <div class="product-card" ref="productCard" @click="handleCardClick">
        <img :src="`${baseUrl}/file/download?key=${product.image_id}`" :alt="product.name" class="product-image" />
        <div class="product-info">
            <h3 class="product-name">{{ product.name }}</h3>
            <span class="product-description">{{ product.description }}</span>
            <span class="product-price">{{ price }}</span>
            <button class="add-to-cart" v-if="!nobutton" @click.stop="handleButtonClick">Add to Cart</button>
        </div>
    </div>
</template>

<script setup lang="ts">
import router from '@/router';
import { onMounted, useTemplateRef, computed } from 'vue';
import { baseUrl } from '@/config';

const { product, height, width, nobutton } = defineProps({
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
    },
    nobutton: {
      type: Boolean,
      required: false,
    }
})
const price = computed(() => {
  const s = product.price.toString()
  return '¥' + s.slice(0, -2) + '.' + s.slice(-2)
})

const handleCardClick = function(event: Event) {
  router.push({
    name: 'product-detail',
    params: {
      id: product.id
    },
  })
}
const handleButtonClick = function(event: Event) {
  console.log('button clicked')
}

var productCard = useTemplateRef('productCard')

onMounted(() => {
  productCard.value?.focus()
  if (productCard.value) {
    if (height !== undefined && height.length !== 0) {
      productCard.value.style.height = height
    }
    if (width !== undefined && width.length !== 0) {
      productCard.value.style.width = width
    }
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
  cursor: pointer;
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