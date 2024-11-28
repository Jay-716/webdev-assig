import {defineStore} from "pinia";
import {ref} from "vue";


export const useUserStore = defineStore('user', () => {
    const storeLogin = ref(false)

    return { storeLogin }
})
