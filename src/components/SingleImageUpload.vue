<template>
  <a-upload
    v-model:file-list="fileList"
    name="avatar"
    list-type="picture-card"
    :beforeUpload="beforeUpload"
    :customRequest="customRequest"
    :maxCount="maxCount"
    :progress="progress"
    @preview="handlePreview"
  >
    <div v-if="fileList.length < maxCount">
      <plus-outlined />
      <div style="margin-top: 8px">上传</div>
    </div>
  </a-upload>
  <a-modal :open="previewVisible" :footer="null" @cancel="handleCancel">
    <img alt="example" style="width: 100%" :src="previewImage" />
  </a-modal>
</template>

<script setup lang="ts">
import { PlusOutlined } from "@ant-design/icons-vue";
import { type ProgressProps, type UploadFile, message } from "ant-design-vue";
import type { UploadRequestOption } from "ant-design-vue/es/vc-upload/interface";
import { ref, watch } from "vue";
import { uploadFile } from "../api/file";
import { FileUploadBizEnum } from "../constants";

const props = defineProps<{
  biz: string;
  fileUrl: string | undefined;
}>();

const emit = defineEmits(["update:fileUrl"]);

const maxCount = ref(1);

const fileList = ref<UploadFile[]>([]);
watch(
  () => props.fileUrl,
  (newFileUrl) => {
    if (newFileUrl) {
      fileList.value = [
        {
          uid: Date.now().toString(),
          name: "Uploaded File",
          url: newFileUrl,
          status: "success",
        },
      ];
    }
  },
  {
    immediate: true,
  },
);
/** 自定义进度条 */
const progress = ref<ProgressProps>({
  strokeWidth: 3,
  showInfo: false,
});

/** 上传前钩子 */
const beforeUpload = (file: UploadFile): boolean => {
  if (FileUploadBizEnum.USER_AVATAR === props.biz) {
    // 文件大小不能超过 1MB
    if (!file.size || file.size > 1024 * 1024) {
      message.error("文件大小不能超过 1MB");
      return false;
    }
    // 文件类型错误
    const fileSuffix = file.name.substring(file.name.lastIndexOf(".") + 1);
    const imageTypeList = ["jpeg", "jpg", "svg", "png", "webg"];
    if (!imageTypeList.includes(fileSuffix)) {
      message.error("文件类型错误");
      return false;
    }
  } else {
    // biz错误
    message.error("系统错误");
    console.log(`文件上传错误，biz 不存在：${props.biz}`);
    return false;
  }
  return true;
};
/** 自定义上传 */
const customRequest = async (option: UploadRequestOption) => {
  const { onProgress = () => {}, onError = () => {}, onSuccess = () => {}, file } = option;

  const res = await uploadFile(props.biz, file as File, (progressEvent) => {
    const percent = (progressEvent.loaded / (progressEvent.total as number)) * 99;
    console.log(`percent: ${percent}, progressEvent: `, progressEvent);
    onProgress({ percent });
  });
  if (res.code === 0) {
    onProgress({ percent: 100 });
    emit("update:fileUrl", res.data);
    message.success(res.message);
    onSuccess(res.data);
  } else {
    message.error(res.message);
    onError(new Error(res.message));
  }
};

const previewVisible = ref(false);
const previewImage = ref("");

/** 预览 */
const handlePreview = (file: UploadFile) => {
  previewVisible.value = true;
  previewImage.value = file.url as string;
};
const handleCancel = () => {
  previewVisible.value = false;
};
</script>

<style scoped lang="scss">

</style>
