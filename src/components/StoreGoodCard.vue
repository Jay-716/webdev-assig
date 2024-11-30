<template>
    <div class="card-root">
        <div class="good-box flex-row">
            <img :src="`${baseUrl}/file/download?key=${good?.image_id}`" :alt="good?.name as string" class="good-image" />
            <div class="flex-col detail-box sans-font">
                <div class="good-name">{{ good?.name }}</div>
                <div class="good-desc">{{ good?.description }}</div>
                <div class="good-price">{{ good?.price }}</div>
            </div>
        </div>
    </div>
</template>

<script lang="ts">
class Good {
    id: Number
    store_id: Number
    name: String
    description: String
    price: Number
    image_id?: String | undefined | null
    constructor(id: Number, store_id: Number, name: String, description: String, price: Number, image_id?: String | undefined | null) {
        this.id = id
        this.store_id = store_id
        this.name = name
        this.description = description
        this.price = price
        this.image_id = image_id
    }
}
</script>

<script setup lang="ts">
import { defineProps } from 'vue';
import { baseUrl } from '@/config';

const { width, height, good } = defineProps({
    width: {
        type: String,
        default: '100%'
    },
    height: {
        type: String,
        default: '10rem',
    },
    good: Good,
})

</script>

<style scoped>
.card-root {
    max-width: 50rem;
    max-height: 50rem;
    width: v-bind(width);
    height: v-bind(height);
}

.good-box {
    width: 100%;
    height: 100%;
    background-color: #fafafa;
    border-radius: 0.5rem;
    transition: ease 100ms;
    overflow: hidden;
}
.good-box:hover {
    background-color: #efefef;
    box-shadow: 0.4rem 0.4rem 0.4rem rgba(0, 0, 0, 0.1);
    transition: ease 100ms;
}

.good-image {
    height: 100%;
    aspect-ratio: 1;
}

.detail-box {
    align-items: start;
    padding: 0.5rem;
}

.good-name {
    font-size: 1.2rem;
    color: #111;
}
.good-desc {
    font-size: 0.9rem;
    color: #888;
}
.good-price {
    margin-top: auto;
    font-size: 1.1rem;
    color: #444;
}
</style>
