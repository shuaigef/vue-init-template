<template>
  <div class="search-form">
    <a-form :model="tableDataQueryParams">
      <a-row :gutter="16" align="middle">
        <a-col :span="6">
          <a-form-item name="code" label="code">
            <a-input v-model:value="tableDataQueryParams.code" placeholder="请输入 code" />
          </a-form-item>
        </a-col>
        <a-col :span="6">
          <a-form-item name="name" label="权限名称">
            <a-input v-model:value="tableDataQueryParams.name" placeholder="请输入权限名称" />
          </a-form-item>
        </a-col>
        <a-col :span="6">
          <a-form-item name="authorityType" label="权限类型">
            <a-select v-model:value="tableDataQueryParams.authorityType" placeholder="请选择权限类型">
              <a-select-option value="">不限</a-select-option>
              <a-select-option value="menu">菜单</a-select-option>
              <a-select-option value="button">按钮</a-select-option>
            </a-select>
          </a-form-item>
        </a-col>
        <a-col :span="5" :offset="1">
          <a-space size="middle">
            <a-button @click="onClear">清空</a-button>
            <a-button type="primary" @click="onSearch">搜索</a-button>
          </a-space>
        </a-col>
      </a-row>
    </a-form>
  </div>
  <div class="table-main">
    <div class="table-header-bar">
      <a-space size="middle">
        <a-button type="primary" @click="addModalVisible = true">新增</a-button>
        <a-button v-if="selectedKeys.length > 0" type="primary" danger @click="onDeleteBatch">删除</a-button>
        <AddAuthorityModal v-model:visible="addModalVisible" @ok="handleAddUserOk"/>
      </a-space>
    </div>
    <a-table :columns="columns" :dataSource="tableData" size="middle" :loading="tableDataLoading"
      rowKey="id" :rowSelection="rowSelection"
      :pagination="pagination"
      :scroll="{
        scrollToFirstRowOnChange: true,
        x: 3000
      }"
    >
      <template #bodyCell="{ column, text, record }">
        <template v-if="column.dataIndex === 'hidden'">
          {{ text === 0 ? "否" : "是" }}
        </template>
        <template v-else-if="column.dataIndex === 'operation'">
          <a-button type="link" @click="onUpdate(record)">修改</a-button>
          <a-divider type="vertical"/>
          <a-button type="link" danger @click="onDelete(record)">删除</a-button>
        </template>
      </template>
    </a-table>
    <UpdateAuthorityModal v-model:visible="updateModalVisible" :updateFormData="updateAuthority" @ok="handleUpdateUserOk"/>
  </div>
</template>

<script setup lang="ts">
import { deleteAuthority, deleteBatchAuthority, queryAuthorityByPage } from "@/api/authority";
import { message } from "ant-design-vue";
import type { TableRowSelection } from "ant-design-vue/es/table/interface";
import { ref, watch } from "vue";
import AddAuthorityModal from "./components/AddAuthorityModal.vue";
import UpdateAuthorityModal from "./components/UpdateAuthorityModal.vue";

const columns = [
  {
    title: "权限名称",
    dataIndex: "name",
    align: "center",
    fixed: "left",
    width: 150,
  },
  {
    title: "code",
    dataIndex: "code",
    align: "center",
    width: 250,
  },
  {
    title: "排序",
    dataIndex: "orderNo",
    align: "center",
    width: 100,
  },
  {
    title: "父节点 Id",
    dataIndex: "parentId",
    align: "center",
    width: 100,
  },
  {
    title: "权限类型",
    dataIndex: "authorityType",
    align: "center",
    width: 100,
  },
  {
    title: "一级菜单跳转路径",
    dataIndex: "redirect",
    align: "center",
    width: 250,
  },
  {
    title: "跳转路径",
    dataIndex: "path",
    align: "center",
    width: 250,
  },
  {
    title: "是否隐藏",
    dataIndex: "hidden",
    align: "center",
    width: 100,
  },
  {
    title: "图标名",
    dataIndex: "menuIcon",
    align: "center",
    width: 150,
  },
  {
    title: "组件路径",
    dataIndex: "component",
    align: "center",
    width: 250,
  },
  {
    title: "组件名称",
    dataIndex: "componentName",
    align: "center",
    width: 200,
  },
  {
    title: "创建时间",
    dataIndex: "createTime",
    align: "center",
    width: 200,
  },
  {
    title: "操作",
    dataIndex: "operation",
    align: "center",
    width: 200,
    fixed: "right",
  },
];
/** 表格数据加载 */
const tableDataLoading = ref(false);
/** 表格数据 */
const tableData = ref<API.Authority[]>([]);
/** 选择的行 */
const selectedKeys = ref<string[]>([]);
/** 表格行选择配置 */
const rowSelection = ref<TableRowSelection<API.Authority>>({
  type: "checkbox",
  selectedRowKeys: selectedKeys.value,
  onChange: (selectedRowKeys) => {
    selectedKeys.value = selectedRowKeys as string[];
  },
});
watch(
  () => selectedKeys.value,
  (newSelectedKeys) => {
    rowSelection.value.selectedRowKeys = newSelectedKeys;
  },
);
/** 默认分页配置 */
const defaultPagination = {
  current: 1,
  pageSize: 10,
};
/** 分页信息 */
const pagination = ref({
  showTotal: (total: number) => `共 ${total} 条记录`,
  total: tableData.value.length,
  current: defaultPagination.current,
  pageSize: defaultPagination.pageSize,
  onChange: (page: number, pageSize: number) => {
    pagination.value.current = page;
    pagination.value.pageSize = pageSize;
    getTableData();
  },
});
/** 表格列表查询参数 */
const tableDataQueryParams = ref<API.AuthorityQueryParams>({
  code: "",
  name: "",
  authorityType: "",
  current: pagination.value.current,
  pageSize: pagination.value.pageSize,
});
/** 搜索 */
const onSearch = () => {
  pagination.value.current = defaultPagination.current;
  pagination.value.pageSize = defaultPagination.pageSize;
  getTableData();
};
/** 清空搜索条件 */
const onClear = () => {
  tableDataQueryParams.value.code = "";
  tableDataQueryParams.value.name = "";
  tableDataQueryParams.value.authorityType = "";
  pagination.value.current = defaultPagination.current;
  pagination.value.pageSize = defaultPagination.pageSize;
  getTableData();
};

/** 新增用户完成事件 */
const addModalVisible = ref(false);
const handleAddUserOk = () => {
  onClear();
};
/** 批量删除 */
const onDeleteBatch = async () => {
  const res = await deleteBatchAuthority(selectedKeys.value);
  if (res.code === 0) {
    onClear();
  } else {
    message.error(res.message);
  }
};
/** 删除 */
const onDelete = async (record: API.User) => {
  const res = await deleteAuthority(record.id);
  if (res.code === 0) {
    onClear();
  } else {
    message.error(res.message);
  }
};
const updateAuthority = ref<API.AuthorityUpdateParams>({
  id: "",
  code: "",
  name: "",
  orderNo: 1,
  parentId: "0",
  authorityType: "",
  redirect: "",
  path: "",
  hidden: 0,
  menuIcon: "",
  component: "",
  componentName: "",
});
/** 修改按钮事件 */
const onUpdate = (record: API.Authority) => {
  updateAuthority.value = {
    ...record,
  };
  updateModalVisible.value = true;
};
const updateModalVisible = ref(false);
const handleUpdateUserOk = () => {
  onClear();
};

/** 获取表格数据 */
watch(
  () => pagination.value,
  (newPagination) => {
    tableDataQueryParams.value.current = newPagination.current;
    tableDataQueryParams.value.pageSize = newPagination.pageSize;
  },
  { immediate: true },
);
/** 获取表格数据 */
const getTableData = async () => {
  selectedKeys.value = [];
  tableDataLoading.value = true;
  try {
    const res = await queryAuthorityByPage(tableDataQueryParams.value);
    if (res.code === 0) {
      tableData.value = res.data.records;
      pagination.value.total = res.data.total;
    } else {
      message.error(res.message);
    }
  } finally {
    tableDataLoading.value = false;
  }
};
getTableData();
</script>

<style scoped lang="scss">
.search-form {
  background-color: #fff;
  padding: 20px;
  .ant-form-item {
    margin: 0;
  }
}
.table-main {
  background-color: #fff;
  margin-top: 20px;
  padding: 20px;
  .table-header-bar {
    margin-bottom: 20px;
  }
}
</style>
