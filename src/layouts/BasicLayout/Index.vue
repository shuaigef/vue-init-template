<template>
  <a-layout class="layout-main">
    <a-layout-header class="layout-header">
      <div class="header-logo">
        <img src="/public/logo-hand-circle.png" width="32px"/>
        <span style="font-size: 20px; margin-left: 8px;">前端开发模版</span>
      </div>
      <div class="header-main">
        <menu-unfold-outlined
            v-if="collapsed"
            class="trigger"
            @click="() => (collapsed = !collapsed)"
        />
        <menu-fold-outlined v-else class="trigger" @click="() => (collapsed = !collapsed)" />
        <!-- 头像 -->
        <a-dropdown :trigger="['click']" placement="bottomRight">
          <div style="display: inline-flex; align-items: center; gap: 8px; height: auto;">
            <span style="font-size: 14px;">{{ loginUser?.userInfo.nickname }}</span>
            <a-avatar :size="32" :src="loginUser?.userInfo.userAvatar" />
          </div>
          <template #overlay>
            <a-menu>
              <a-menu-item key="accountSetting">
                <router-link :to="{ name: 'accountSetting' }">
                  个人设置
                </router-link>
              </a-menu-item>
              <a-menu-item key="logout" @click="toLogout">
                登出
              </a-menu-item>
            </a-menu>
          </template>
        </a-dropdown>
      </div>
    </a-layout-header>
    <a-layout class="layout-bottom">
      <a-layout-sider class="layout-sider" v-model:collapsed="collapsed" :trigger="null" collapsible theme="light">
        <Menu />
      </a-layout-sider>
      <a-layout-content class="layout-content">
        <router-view/>
      </a-layout-content>
    </a-layout>
  </a-layout>
</template>

<script setup lang="ts">
import { MenuFoldOutlined, MenuUnfoldOutlined } from "@ant-design/icons-vue";
import { message } from "ant-design-vue";
import { storeToRefs } from "pinia";
import { ref } from "vue";
import { useRouter } from "vue-router";
import { logout } from "../../api/system";
import { LocalStorageEnum } from "../../constants";
import { useSystemStore } from "../../store";
import Menu from "./Menu.vue";

const collapsed = ref<boolean>(false);

const systemStore = useSystemStore();
const { loginUser } = storeToRefs(systemStore);

const router = useRouter();

const toLogout = async () => {
  try {
    await logout();
    message.success("登出成功");
  } finally {
    localStorage.removeItem(LocalStorageEnum.JWT);
    localStorage.removeItem(LocalStorageEnum.LOGIN_USER);
    loginUser.value = null;
    router.push({
      name: "login",
    });
  }
};
</script>

<style scoped lang="scss">
.layout-main {
  height: 100vh;
  width: 100vw;
  .layout-header {
    padding: 0;
    background: #fff; 
    display: flex;
    border-bottom: 1px solid rgba(5, 5, 5, 0.06);
    .header-logo {
      min-width: 200px;
      display: flex;
      justify-content: center;
      align-items: center;
      .header-logo-content {
        width: 100%;
        height: 32px;
        background: rgba(100, 100, 100, 0.3);
      }
    }
    .header-main {
      width: 100%;
      display: flex; 
      justify-content: space-between; 
      align-items: center;
      padding: 0 20px 0 24px;
      .trigger {
        font-size: 18px;
        line-height: 64px;
        cursor: pointer;
        transition: color 0.3s;
      }
      .trigger:hover {
        color: #1890ff;
      }
    }
  }
  .layout-bottom {
    .layout-sider {
      height: 100%;
      border-right: 1px solid rgba(5, 5, 5, 0.06);
      background: #fff; 
    }
    .layout-content {
      padding: 24px 16px;
      overflow: auto;
    }
  }
}
</style>
