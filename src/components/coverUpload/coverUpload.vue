<template>
  <div class="cover-upload">
    <el-upload
      name="file"
      :show-file-list="false"
      accept=".png,.PNG,.jpg,.JPG,.jpeg,.JPEG,.gif,.GIF,.bmp,.BMP"
      :multiple="false"
      :http-request="uploadImage"
    >
      <div class="cover-upload-btn" :style="coverUploadBtnBorder">
        <template v-if="localFile">
          <img :src="localFile" alt="" />
        </template>
        <template v-else>
          <img
            :src="noLocalImgSrc"
            alt=""
            v-if="modelValue && modelValue.imageUrl"
          />
          <span v-else class="iconfont icon-add"></span>
        </template>
      </div>
    </el-upload>
  </div>
</template>
<script setup>
import { ref, reactive, getCurrentInstance, computed } from "vue";
import { useRouter, useRoute } from "vue-router";
const { proxy } = getCurrentInstance();
const router = useRouter();
const route = useRoute();

const props = defineProps({
  imageUrlPrefix: {
    type: String,
    default: "",
  },
  modelValue: {
    type: Object,
    default: () => {},
  },
});

const coverUploadBtnBorder = computed(() => {
  if (props.modelValue && props.modelValue.imageUrl) {
    return "";
  }
  return "border: 1px solid rgb(251, 185, 223);";
});

const noLocalImgSrc = computed(() => {
  return props.imageUrlPrefix
    ? props.imageUrlPrefix + props.modelValue.imageUrl
    : proxy.globalInfo.imageUrl + props.modelValue.imageUrl;
});

const localFile = ref(null);

const emit = defineEmits();
const uploadImage = ({ file }) => {
  let img = new FileReader();
  img.readAsDataURL(file);
  img.onload = ({ target }) => {
    localFile.value = target.result;
  };
  emit("update:modelValue", file);
};
</script>
<style lang="less" scoped>
.cover-upload {
  .cover-upload-btn {
    display: flex;
    align-items: center;
    justify-content: center;
    width: 150px;
    height: 150px;
    background: rgba(251, 185, 223, 0.1);
    .iconfont {
      font-size: 50px;
      color: rgb(251, 185, 223);
    }
    img {
      width: 100%;
    }
  }
}
</style>