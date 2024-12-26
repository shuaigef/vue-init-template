<template>
  <a-layout class="layout-demo">
    <a-layout-sider v-model:collapsed="collapsed" :trigger="null" collapsible theme="light">
      <div class="logo" />
      <Menu />
    </a-layout-sider>
    <a-layout>
      <a-layout-header style="background: #fff; padding: 0 30px 0 0; display: flex; justify-content: space-between; align-items: center;">
        <menu-unfold-outlined
            v-if="collapsed"
            class="trigger"
            @click="() => (collapsed = !collapsed)"
        />
        <menu-fold-outlined v-else class="trigger" @click="() => (collapsed = !collapsed)" />

        <!-- 头像 -->
        <a-dropdown style="margin-right: 20px" :trigger="['click']" placement="bottomRight">
          <div style="display: inline-flex; align-items: center; gap: 8px; height: auto;">
            <span>用户名</span>
            <a-avatar :size="24" src="https://www.antdv.com/assets/logo.1ef800a8.svg" />
          </div>
          <template #overlay>
            <a-menu>
              <a-menu-item key="accountSetting" @click="toAccountSetting">
                个人中心
              </a-menu-item>
              <a-menu-item key="logout" @click="toLogout">
                登出
              </a-menu-item>
            </a-menu>
          </template>
        </a-dropdown>

      </a-layout-header>
      <a-layout-content :style="{ margin: '24px 16px', padding: '24px', background: '#fff', minHeight: '280px' }">
        <router-view/>
      </a-layout-content>
    </a-layout>
  </a-layout>
</template>

<script setup lang="ts">
import { ref } from "vue";
import { MenuUnfoldOutlined, MenuFoldOutlined } from "@ant-design/icons-vue";
import Menu from "./Menu.vue";
import { useRouter } from "vue-router";
import { message } from "ant-design-vue";

const collapsed = ref<boolean>(false);

const router = useRouter();
const toAccountSetting = () => {
	router.push({
		name: "accountSetting",
	});
};
const toLogout = () => {
	message.success("登出成功");
	router.push({
		name: "login",
	});
};
</script>

<style scoped lang="scss">
.layout-demo {
  height: 100vh;
  background: var(--color-fill-2);
  border: 1px solid var(--color-border);
  .trigger {
    font-size: 18px;
    line-height: 64px;
    padding: 0 24px;
    cursor: pointer;
    transition: color 0.3s;
  }
  .trigger:hover {
    color: #1890ff;
  }
  .logo {
    height: 32px;
    background: rgba(100, 100, 100, 0.3);
    margin: 16px;
  }
}
</style>
