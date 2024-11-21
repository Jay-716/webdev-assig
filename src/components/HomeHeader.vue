<script setup lang="ts">
import { computed, onMounted, ref, useTemplateRef, Teleport, Transition, reactive, onUnmounted } from 'vue';
import { ShoppingBag, Search, UserFilled, Bell, ShoppingCart, ShoppingCartFull, Tickets } from '@element-plus/icons-vue';

const userLoggedIn = ref(true)
const user = ref({username: 'jay', avatar_url: 'https://empty'})
const cartEmpty = ref(true)
const searchText = ref('');
const notifications = ref([
    { id: 1, title: "欢迎加入1", content: "testtesttesttesttesttesttesttest", created_at: new Date() },
    { id: 2, title: "欢迎加入2", content: "testtesttesttesttesttesttesttest", created_at: new Date() },
    { id: 3, title: "欢迎加入3", content: "testtesttesttesttesttesttesttest", created_at: new Date() },
])

const avatarErrorHandler = function() {
    console.warn("Failed to load avatar, url:", user.value.avatar_url)
}

const notifPopupState = reactive({
    box: useTemplateRef('notificationBox'),
    popup: useTemplateRef('notificationPopup'),
    visible: false,
    center: 0,
    top: 0,
    left: 0,
    width: 400,
    margin: 10,
    timeout: 200,
    timeoutId: -1,
    handleMouseEnter: () => {
        if (notifPopupState.timeoutId > 0) {
            clearTimeout(notifPopupState.timeoutId)
        }
        notifPopupState.visible = true;
    },
    handleMouseLeave: () => {
        if (notifPopupState.timeoutId > 0) {
            clearTimeout(notifPopupState.timeoutId)
        }
        notifPopupState.timeoutId = setTimeout(() => {
            notifPopupState.visible = false;
        }, notifPopupState.timeout)
    },
})
const notifStyles = computed(() => {
    return {
        visible: notifPopupState.visible,
        top: notifPopupState.top + 'px',
        topMargin: notifPopupState.top + notifPopupState.margin + 'px',
        left: notifPopupState.left + 'px',
        width: notifPopupState.width + 'px',
    }
})
const settPopupState = reactive({
    box: useTemplateRef('settingBox'),
    popup: useTemplateRef('settingPopup'),
    visible: false,
    center: 0,
    top: 0,
    left: 0,
    width: 400,
    margin: 10,
    timeout: 200,
    timeoutId: -1,
    handleMouseEnter: () => {
        if (settPopupState.timeoutId > 0) {
            clearTimeout(settPopupState.timeoutId)
        }
        settPopupState.visible = true;
    },
    handleMouseLeave: () => {
        if (settPopupState.timeoutId > 0) {
            clearTimeout(settPopupState.timeoutId)
        }
        settPopupState.timeoutId = setTimeout(() => {
            settPopupState.visible = false;
        }, settPopupState.timeout)
    },
})
const settStyles = computed(() => {
    return {
        visible: settPopupState.visible,
        top: settPopupState.top + 'px',
        topMargin: settPopupState.top + settPopupState.margin + 'px',
        left: settPopupState.left + 'px',
        width: settPopupState.width + 'px',
    }
})

const updatePopupState = () => {
    if (headerOuter.value) {
        const rect = headerOuter.value.getBoundingClientRect()
        notifPopupState.top = rect.bottom
        settPopupState.top = rect.bottom
    }
    if (notifPopupState.box) {
        const rect = notifPopupState.box.getBoundingClientRect()
        notifPopupState.center = Math.min(rect.left + rect.width / 2, window.innerWidth)
        const calcLeft = notifPopupState.center - notifPopupState.width / 2
        if (calcLeft + notifPopupState.width > window.innerWidth) {
            notifPopupState.left = window.innerWidth - notifPopupState.width - notifPopupState.margin
        } else {
            notifPopupState.left = calcLeft
        }
    }
    if (settPopupState.box) {
        const rect = settPopupState.box.getBoundingClientRect()
        settPopupState.center = Math.min(rect.left + rect.width / 2, window.innerWidth)
        const calcLeft = settPopupState.center - notifPopupState.width / 2
        if (calcLeft + settPopupState.width > window.innerWidth) {
            settPopupState.left = window.innerWidth - notifPopupState.width - notifPopupState.margin
        } else {
            settPopupState.left = calcLeft
        }
    }
}

const headerOuter = useTemplateRef('headerOuter')
onMounted(() => {
    headerOuter.value?.focus()
    notifPopupState.box?.focus()
    notifPopupState.popup?.focus()
    settPopupState.box?.focus()
    settPopupState.popup?.focus()
    updatePopupState()
    window.addEventListener("resize", updatePopupState)
})
onUnmounted(() => {
    window.removeEventListener("resize", updatePopupState)
})
</script>

<template>
    <div class="header-outer" ref="headerOuter">
        <div class="logo-title">
            <el-icon class="logo">
                <ShoppingBag />
            </el-icon>
            <h1 class="title">Jay的小商城</h1>
        </div>
        <el-input placeholder="搜索" class="search-bar" :prefix-icon="Search" v-model="searchText" />
        <nav class="nav-links">
            <RouterLink to="/cart">
                <el-icon>
                    <ShoppingCart v-if="cartEmpty" />
                    <ShoppingCartFull v-else />
                </el-icon>
                <h2>购物车</h2>
            </RouterLink>
            <RouterLink to="/order">
                <el-icon>
                    <Tickets />
                </el-icon>
                <h2>订单</h2>
            </RouterLink>
            <div ref="notificationBox" @mouseenter="notifPopupState.handleMouseEnter"
                @mouseleave="notifPopupState.handleMouseLeave">
                <el-icon>
                    <Bell />
                </el-icon>
                <h2>通知</h2>
            </div>
            <div ref="settingBox" @mouseenter="settPopupState.handleMouseEnter"
                @mouseleave="settPopupState.handleMouseLeave">
                <el-icon>
                    <Setting />
                </el-icon>
                <h2>设置</h2>
            </div>
            <RouterLink to="/user" :title="userLoggedIn ? user.username : '请登录'">
                <el-avatar v-if="userLoggedIn" :size="40" :src="user.avatar_url" @error="avatarErrorHandler">
                    <img src="https://cube.elemecdn.com/e/fd/0fc7d20532fdaf769a25683617711png.png" />
                </el-avatar>
                <el-avatar v-else :size="40" :icon="UserFilled" />
            </RouterLink>
        </nav>
    </div>
    <Teleport to="body">
        <Transition name="notif-popup">
            <div ref="notificationPopup" v-show="notifPopupState.visible" class="popup-box notification-popup-box"
                @mouseenter="notifPopupState.handleMouseEnter" @mouseleave="notifPopupState.handleMouseLeave">
                <div class="popup notification-popup">
                    <div v-if="notifications.length !== 0" class="notif-list">
                        <div v-for="notif in notifications" :key="notif.id" class="notif-item">
                            <div class="notif-text">
                                <span style="font-size: medium;">{{ notif.title }}</span>
                                <span style="font-size: 14px; color: #333333aa;">{{ notif.content }}</span>
                                <span style="font-size: 14px; color: #333333aa;">{{ notif.created_at.toDateString()
                                    }}</span>
                            </div>
                            <el-divider style="margin: 3px;" />
                        </div>
                    </div>
                    <div v-else style="display: flex; width: 100%; height: 100%; text-align: center;">
                        <span style="margin: auto; color: #333333aa;">暂无新通知</span>
                    </div>
                </div>
            </div>
        </Transition>
    </Teleport>
    <Teleport to="body">
        <Transition name="sett-popup">
            <div ref="settingPopup" v-show="settPopupState.visible" class="popup-box setting-popup-box"
                @mouseenter="settPopupState.handleMouseEnter" @mouseleave="settPopupState.handleMouseLeave">
                <div class="popup setting-popup">
                    <!-- TODO: Try implementing this using element plus Drawer -->
                    <span style="color: #bbbbbb;">暂无可用设置项</span>
                </div>
            </div>
        </Transition>
    </Teleport>
</template>

<style>
.popup-box {
    position: fixed;
    z-index: 999;
}
.notification-popup-box {
    top: v-bind('notifStyles.topMargin');
    left: v-bind('notifStyles.left');
    width: v-bind('notifStyles.width');
}
.setting-popup-box {
    top: v-bind('settStyles.topMargin');
    left: v-bind('settStyles.left');
    width: v-bind('settStyles.width');
}

.popup {
    width: 100%;
    height: 400px;
    display: flex;
    flex-direction: column;
    background: white;
    border: #eee solid 3px;
    border-radius: 10px;
    padding: 10px 0;
    font-family: sans-serif;
}

.popup .notif-list {
    width: 100%;
    height: 100%;
    display: flex;
    flex-direction: column;
    align-items: baseline;
}
.notif-list .notif-item {
    width: 100%;
    display: flex;
    flex-direction: column;
    align-items: center;
    font-family: sans-serif;
}
.notif-item .notif-text {
    box-sizing: border-box;
    width: 100%;
    padding: 8px 10px;
    display: flex;
    flex-direction: column;
    align-items: baseline;
}
.notif-list .notif-text:hover {
    background-color: #eeeeee;
}

.setting-popup {
    justify-content: center;
}

.notif-popup-enter-from,
.notif-popup-leave-to {
    opacity: 0;
    top: v-bind('notifStyles.top');
}
.notif-popup-enter-to,
.notif-popup-leave-from {
    opacity: 1;
    top: v-bind('notifStyles.topMargin');
}
.notif-popup-enter-active,
.notif-popup-leave-active {
    transition: all 200ms ease;
}
.sett-popup-enter-from,
.sett-popup-leave-to {
    opacity: 0;
    top: v-bind('settStyles.top');
}
.sett-popup-enter-to,
.sett-popup-leave-from {
    opacity: 1;
    top: v-bind('settStyles.topMargin');
}
.sett-popup-enter-active,
.sett-popup-leave-active {
    transition: all 200ms ease;
}
</style>

<style scoped>
.header-outer {
    display: flex;
    align-items: center;
    justify-content: space-between;
    height: 100%;
    background-color: #d0ddeb;
}

.logo-title {
    display: flex;
    align-items: center;
    margin-right: 15px;
}
.logo {
    width: auto;
    height: auto;
    font-size: 40px;
    margin-left: 15px;
    margin-right: 15px;
}
.title {
    font-size: 24px;
    font-family: sans-serif;
    user-select: none;
}

.search-bar {
    flex-grow: 1;
    max-width: 400px;
    padding: 5px 10px;
    margin: 0 15px;
}
.search-bar >>> .el-input__wrapper {
    background-color: #e4ebf1;
}

.nav-links {
    padding-right: 15px;
    display: flex;
    gap: 15px;
}
.nav-links a, div {
    text-decoration: none;
    color: #333;
    font-family: sans-serif;
    align-items: center;
    display: flex;
    user-select: none;
}
/* Navigator icon */
.nav-links a, div i {
    font-size: 20px;
    margin-right: 5px;
}
/* Navigator text */
.nav-links a, div h2 {
    font-size: medium;
}
</style>
