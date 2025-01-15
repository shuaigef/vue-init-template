<template>
  <div class="search-form">
    <a-form :model="tableDataQueryParams">
      <a-row :gutter="16" align="middle">
        <a-col :span="8">
          <a-form-item name="roleName" label="角色名">
            <a-input v-model:value="tableDataQueryParams.roleName" placeholder="请输入角色名" />
          </a-form-item>
        </a-col>
        <a-col :span="7" :offset="1">
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
        <a-button type="primary" v-show="loginUser?.userInfo.roleId === '1'" :loading="resetAdminLoading" @click="handleResetAdmin">重置超级管理员权限</a-button>
      </a-space>
			<AddRoleModal v-model:visible="addModalVisible" @ok="handleAddRoleOk"/>
    </div>
    <a-table :columns="columns" :dataSource="tableData" size="middle" :loading="tableDataLoading"
             rowKey="id" :rowSelection="rowSelection"
             :pagination="pagination"
    >
      <template #bodyCell="{ column, text, record }">
        <template v-if="column.dataIndex === 'gender'">
          {{ text === 0 ? '未知' :  text === 1 ? '男' : '女' }}
        </template>
        <template v-else-if="column.dataIndex === 'operation'">
          <a-button type="link" @click="onUpdate(record)">修改</a-button>
          <a-divider type="vertical"/>
					<a-button type="link" @click="onUpdateAuthority(record)">权限</a-button>
          <a-divider type="vertical"/>
          <a-button type="link" danger @click="onDelete(record)">删除</a-button>
        </template>
      </template>
    </a-table>
		<UpdateRoleModal v-model:visible="updateModalVisible" :updateFormData="updateRole" @ok="handleUpdateUserOk"/>
  </div>
	<UpdateAuthDrawer v-model:visible="updateAuthVisible" :authRoleId="authRoleId" :authTreeData="authTreeData"/>
</template>

<script setup lang="ts">
import { message } from "ant-design-vue";
import type { TableRowSelection } from "ant-design-vue/es/table/interface";
import { storeToRefs } from "pinia";
import { ref, watch } from "vue";
import {
	getAuthorityTreeByRoleId,
	resetAdminAuthority,
} from "../../api/authority";
import { deleteBatchRole, deleteRole, queryRoleByPage } from "../../api/role";
import { useSystemStore } from "../../store";
import AddRoleModal from "./components/AddRoleModal.vue";
import UpdateAuthDrawer from "./components/UpdateAuthDrawer.vue";
import UpdateRoleModal from "./components/UpdateRoleModal.vue";

const columns = [
	{
		title: "角色名",
		dataIndex: "roleName",
		align: "center",
	},
	{
		title: "角色描述",
		dataIndex: "roleDesc",
		align: "center",
	},
	{
		title: "创建时间",
		dataIndex: "createTime",
		align: "center",
	},
	{
		title: "操作",
		dataIndex: "operation",
		align: "center",
	},
];
/** 表格数据加载 */
const tableDataLoading = ref(false);
/** 表格数据 */
const tableData = ref<API.Role[]>([]);
/** 选择的行 */
const selectedKeys = ref<string[]>([]);
/** 表格行选择配置 */
const rowSelection = ref<TableRowSelection<API.Role>>({
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
/** 用户列表查询参数 */
const tableDataQueryParams = ref<API.RoleQueryParams>({
	roleName: "",
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
	tableDataQueryParams.value.roleName = "";
	pagination.value.current = defaultPagination.current;
	pagination.value.pageSize = defaultPagination.pageSize;
	getTableData();
};

/** 新增用户完成事件 */
const addModalVisible = ref(false);
const handleAddRoleOk = () => {
	onClear();
};
/** 批量删除 */
const onDeleteBatch = async () => {
	const res = await deleteBatchRole(selectedKeys.value);
	if (res.code === 0) {
		onClear();
	} else {
		message.error(res.message);
	}
};
/** 删除 */
const onDelete = async (record: API.User) => {
	const res = await deleteRole(record.id);
	if (res.code === 0) {
		onClear();
	} else {
		message.error(res.message);
	}
};
/** 修改按钮事件 */
const updateRole = ref<API.RoleUpdateParams>({
	id: "",
	roleName: "",
	roleDesc: "",
});
const onUpdate = (record: API.Role) => {
	updateRole.value = {
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
		const res = await queryRoleByPage(tableDataQueryParams.value);
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

// region 重置超级管理员权限
const systemStore = useSystemStore();
const { loginUser } = storeToRefs(systemStore);
const resetAdminLoading = ref(false);
/** 重置超级管理员权限 */
const handleResetAdmin = async () => {
	resetAdminLoading.value = true;
	try {
		const res = await resetAdminAuthority();
		if (res.code === 0) {
			message.success(res.message);
		} else {
			message.error(res.message);
		}
	} finally {
		resetAdminLoading.value = false;
	}
};
// endregion

// region 修改角色权限
const updateAuthVisible = ref(false);
const authTreeData = ref<API.Authority[]>([]);
const authRoleId = ref<string>("");
const onUpdateAuthority = async (record: API.Role) => {
	authRoleId.value = record.id;
	tableDataLoading.value = true;
	try {
		const res = await getAuthorityTreeByRoleId(record.id);
		if (res.code === 0) {
			authTreeData.value = res.data;
			updateAuthVisible.value = true;
		} else {
			message.error(res.message);
		}
	} finally {
		tableDataLoading.value = false;
	}
};
// endregion
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
