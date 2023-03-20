<script setup lang="ts">
import { onMounted, ref, type Ref } from "vue";
import { Share, UploadFilled, List } from "@element-plus/icons-vue";
import qrcodeParser from "qrcode-parser";
import MonacoEditor from "@/components/MonacoEditor.vue";
import SettingCard from "@/components/SettingCard.vue";
import ClipoardPaste from "@/components/ClipoardPaste.vue";
import { QRCodeReaderType, usePageStore } from "../stores/page";
import { useLanguageStore } from "../stores/language";
const page = usePageStore();
const imageUrl = ref("");
const videoRef: Ref<HTMLVideoElement | null> = ref(null);
const { t } = useLanguageStore();
function readFile(file: File | null) {
  if (!file || !file.type.includes("image")) return false;
  var reader = new FileReader();
  reader.readAsDataURL(file);
  reader.onload = function (event) {
    if (event.target) {
      imageUrl.value = event.target.result as string;
      qrcodeParser(file)
        .then((res: string) => {
          page.rqrcode.text = res;
        })
        .catch(() => ElMessage.warning("解析失败"));
      // Quagga.decodeSingle({
      //     decoder: {
      //         readers: ["code_128_reader", "ean_reader", "ean_5_reader", "ean_2_reader", "ean_8_reader", "code_39_reader", "code_39_vin_reader", "codabar_reader", "upc_reader", "upc_e_reader", "i2of5_reader", "2of5_reader", "code_93_reader", "code_32_reader"] // List of active readers
      //     },
      //     locate: false, // try to locate the barcode in the image
      //     src: imageUrl.value // or 'data:image/jpg;base64,' + data
      // }, function(result){
      //   console.log("二维码", result)
      //     if(result && result.codeResult && result.codeResult.code) {
      //       page.rqrcode.text = result.codeResult.code
      //     } else {
      //       ElMessage.warning("解析失败")
      //     }
      // });
    }
  };
  return false;
}
function onPaste(pasteType: any, result: File | string, fileType?: string) {
  const resultFile = result as File;
  if (
    pasteType == "file" &&
    fileType &&
    fileType.includes("image") &&
    resultFile.size < 1024 * 1024 * 10
  ) {
    readFile(resultFile);
  }
}
function qrcodeReaderTypeChange(change?: any) {
  if (typeof change !== "undefined") page.qrcodeReaderTypeChange();
  if (page.rqrcode.readerType === QRCodeReaderType.Camera) {
    displayVideo();
  } else {
    stopVideo();
  }
}
onMounted(() => {
  qrcodeReaderTypeChange()
})
let mediaStream: MediaStream | null = null;
let timeOut = null
function startCap() {
  setTimeout(() => {
    if(!videoRef.value || !videoRef.value.srcObject) return
    var canvas = document.createElement("canvas");
     canvas.width = videoRef.value.clientWidth;
     canvas.height = videoRef.value.clientHeight;
     const canvas2D = canvas.getContext("2d")
     if(canvas2D) canvas2D.drawImage(videoRef.value, 0, 0, canvas.width, canvas.height);//截
     var dataURL = canvas.toDataURL("image/png");
     canvas.remove()
     qrcodeParser(dataURL)
        .then((res: string) => {
          page.rqrcode.text = res;
          imageUrl.value = dataURL;
        }).catch(() => {}).finally(() => {
          startCap()
        })
  }, 1000);
}
function displayVideo() {
  if (!videoRef.value) return;
  navigator.mediaDevices
    .getUserMedia({
      audio: false,
      video: {
        width: videoRef.value.parentElement!.clientWidth,
        height: videoRef.value.parentElement!.clientHeight
      }
    })
    .then((stream) => {
      mediaStream = stream;
      if (videoRef.value) {
        videoRef.value.srcObject = stream;
        startCap();
        videoRef.value.play();
      }
    })
    .catch((error) => {
      ElMessage.warning(
        t('调用摄像头失败') + error ? ", " + error.message : ""
      );
    });
}
function stopVideo() {
  console.log("调用通知", mediaStream)
  mediaStream &&
    mediaStream.getVideoTracks().forEach(function (track) {
      track.stop();
    });
  if (videoRef.value) videoRef.value.srcObject = null;
}
</script>

<template>
  <div class="dev-toys-rqrcode">
    <Title>
      <template #title>
        {{ t("QR Code") }}
      </template>
      <el-radio-group
        v-model="page.rqrcode.readerType"
        size="small"
        @change="qrcodeReaderTypeChange"
      >
        <el-radio-button :label="QRCodeReaderType.File">{{
          t("File")
        }}</el-radio-button>
        <el-radio-button :label="QRCodeReaderType.Camera">{{
          t("Camera")
        }}</el-radio-button>
        <el-radio-button :label="QRCodeReaderType.Clipboard">{{
          t("Clipboard")
        }}</el-radio-button>
      </el-radio-group>
    </Title>
    <div class="dev-toys-rqrcode-reader">
      <div class="dev-toys-rqrcode-reader-type">
        <video
          v-show="page.rqrcode.readerType === QRCodeReaderType.Camera"
          ref="videoRef"
        ></video>
        <template
          v-if="page.rqrcode.readerType === QRCodeReaderType.Camera"
        ></template>
        <ClipoardPaste
          v-else-if="page.rqrcode.readerType === QRCodeReaderType.Clipboard"
          @change="onPaste"
        >
          <el-icon class="dev-toys-icon--paste"><List /></el-icon>
          <div class="dev-toys-paste__text">
            {{ t("Paste Files Here") }}
          </div>
        </ClipoardPaste>
        <el-upload
          v-else
          drag
          :show-file-list="false"
          :before-upload="readFile"
          class="aaaa"
        >
          <el-icon class="el-icon--upload"><UploadFilled /></el-icon>
          <div class="el-upload__text">
            {{ t("Drop Files Here") }} {{ t("or") }}
            <em>{{ t("Click to Open") }}</em>
          </div>
        </el-upload>
      </div>
      <div class="dev-toys-rqrcode-reader-image">
        <img v-if="imageUrl" :src="imageUrl" />
      </div>
    </div>
    <div class="dev-toys-rqrcode-editor">
      <MonacoEditor :value="page.rqrcode.text" language="text" :readonly="true">
        <template #title> {{ t("Text") }} </template>
      </MonacoEditor>
    </div>
  </div>
</template>

<style lang="less" scoped>
.dev-toys-rqrcode {
  display: flex;
  // justify-content: space-between;
  flex-direction: column;
  position: absolute;
  left: 0;
  top: 0;
  right: 0;
  bottom: 0;

  &-editor {
    flex: 1;
    width: 100%;
  }

  &-reader {
    display: flex;
    width: 100%;
    height: 187.4px;
    margin-bottom: 20px;
    &-type {
      flex: 1;
      & > div,
      & > div > .el-upload {
        height: 100%;
      }
      video {
        width: 100%;
        height: 100%;
        border: 1px dashed var(--el-border-color);
        border-radius: 6px;
      }
    }
    &-image {
      width: 200px;
      height: 100%;
      margin-left: 20px;
      border: 1px dashed var(--el-border-color);
      border-radius: 6px;
      padding: 5px;
      img {
        width: 100%;
        height: 100%;
        border-radius: 4px;
      }
    }
  }

  &-form {
    margin-top: 20px;
  }
  .dev-toys-title {
    margin: 20px 0 0 0;
  }
}
</style>