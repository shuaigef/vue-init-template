<template>
  <div>
    <a-card :bordered="false" :bodyStyle="{ padding: '16px 0', height: '100%' }" :style="{ height: '100%' }">
      <div class="account-settings-info-main">
        <div class="account-settings-info-left">
          <a-menu
            mode="inline"
            :style="{ border: '0'}"
            v-model:selectedKeys="selectedKeys"
          >
            <a-menu-item key="basicSettings">
              <router-link :to="{ name: 'basicSettings' }">
                基本设置
              </router-link>
            </a-menu-item>
          </a-menu>
        </div>
        <div class="account-settings-info-right">
          <div class="account-settings-info-title">
            {{ route.meta.title }}
          </div>
          <router-view/>
        </div>
      </div>
    </a-card>
  </div>
</template>

<script setup lang="ts">
import { ref, watch } from "vue";
import { useRoute } from "vue-router";

const selectedKeys = ref(["basicSettings"]);

const route = useRoute();
// 监听路由变化来动态更新选中的菜单项
watch(
	() => route.name,
	(newValue) => {
		selectedKeys.value[0] = String(newValue);
	},
);
</script>

<style scoped lang="scss">

  .account-settings-info-main {
    width: 100%;
    display: flex;
    height: 100%;
    overflow: auto;

    .account-settings-info-left {
      border-right: 1px solid #e8e8e8;
      width: 224px;
    }
    .account-settings-info-right {
      flex: 1 1;
      padding: 8px 40px;

      .account-settings-info-title {
        color: rgba(0,0,0,.85);
        font-size: 20px;
        font-weight: 500;
        line-height: 28px;
        margin-bottom: 12px;
      }
      .account-settings-info-view {
        padding-top: 12px;
      }
    }
  }
</style>
