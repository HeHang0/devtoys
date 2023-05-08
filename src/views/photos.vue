<script setup lang="ts">
import { nextTick, ref, type Ref } from 'vue';
import { Close, UploadFilled } from '@element-plus/icons-vue';
import type { ExifInfo } from '@/utils/exif-js/exif';
import heic2any from 'heic2any';
import { Splitpanes, Pane } from 'splitpanes';
import { Loader } from '@googlemaps/js-api-loader';
import 'splitpanes/dist/splitpanes.css';
import { TaskQueue } from '@/utils/task-queue';
import {
  readExifFromFile,
  readFileFromEntry,
  readThumbnailFromFile
} from '@/utils/utils';
import { storage, StorageKey } from '@/utils/storage';
import { formatBytes } from '@/utils/formatter';
import { useLanguageStore } from '@/stores/language';
import { useRouter } from 'vue-router';

const loader = new Loader({
  apiKey: '',
  version: 'weekly',
  libraries: ['places']
});
let google: any = null;
loader
  .load()
  .then(g => {
    google = g;
  })
  .catch(e => {
    // do something
  });

interface ImageDetail {
  src: string;
  name: string;
  exif: ExifInfo;
  size: string;
  location: string;
}

const router = useRouter();
const { t, currentLanguage } = useLanguageStore();

const panneSize = ref(storage.getValue(StorageKey.SplitSize, 30));
const reading = ref(false);
const dragging = ref(false);
const folderName = ref('');
const fileList: Ref<File[]> = ref([]);
const imageDetail: Ref<ImageDetail | null> = ref(null);
const imageDetailLoading = ref(false);
const readonly = !Boolean(window.showDirectoryPicker);

function clearFileList() {
  fileList.value.splice(0, fileList.value.length);
  folderName.value = '';
}

function selectDirectory() {
  if (reading.value) return;
  reading.value = true;
  window
    .showDirectoryPicker()
    .then(handle => {
      if (handle.kind !== 'directory') return;
      folderName.value = handle.name;
      fileList.value.splice(0, fileList.value.length);
      processFolderHandle(handle);
      imageDetail.value = null;
    })
    .catch(() => {
      reading.value = false;
    });
}

let timeoutDrag: any = null;
function switchDragging(e: any, value: boolean) {
  e.stopPropagation();
  e.preventDefault();
  if (e.dataTransfer && value) e.dataTransfer.dropEffect = 'copy';
  clearTimeout(timeoutDrag);
  if (value) {
    if (dragging.value != value) dragging.value = value;
  } else {
    timeoutDrag = setTimeout(() => {
      dragging.value = value;
    }, 100);
  }
}

async function processFolderHandle(handle: FileSystemDirectoryHandle) {
  const files = [];
  try {
    for await (const entry of handle.entries()) {
      // 判断当前文件是否为jpg文件
      const name = entry[0];
      try {
        const file = await entry[1].getFile(name);
        if (file instanceof File) {
          files.push(file);
        }
      } catch {}
    }
  } catch {}
  handleFiles(files);
}

function handleFiles(files: File[]) {
  const okFiles: File[] = [];
  files.map(file => {
    const fileName: string = file.name.toLowerCase();
    if (
      file instanceof File &&
      (file.type.includes('image') ||
        fileName.endsWith('heic') ||
        fileName.endsWith('avif')) &&
      !file.type.includes('tif')
    ) {
      okFiles.push(file);
    }
  });
  fileList.value = okFiles;
  reading.value = false;
  dragging.value = false;
}

async function onFileDrop(e: DragEvent) {
  e.stopPropagation();
  e.preventDefault();
  const dataTransfer = e.dataTransfer as DataTransfer;
  const files: File[] = [];
  if (dataTransfer && dataTransfer.items)
    for (let i = 0; i < dataTransfer.items.length; i++) {
      const entry: any = dataTransfer.items[i].webkitGetAsEntry();
      if (!entry) continue;
      if (entry.isFile) {
        const file = dataTransfer.files.item(i);
        file && file instanceof File && files.push(file);
      } else if (entry.isDirectory) {
        folderName.value = entry.name;
        const entryFiles = await readFileFromEntry(entry);
        entryFiles.map(m => files.push(m));
      }
    }
  handleFiles(files);
}

function handleFileChange(e: Event) {
  const target = e.target as HTMLInputElement;
  const files: File[] = [];
  if (target.files)
    for (let i = 0; i < target.files.length; i++) {
      const file = target.files.item(i);
      file && file instanceof File && files.push(file);
    }
  handleFiles(files);
}

const exifQueue = new TaskQueue(2);
function imageLoaded(event: Event) {
  const target = event.target as HTMLImageElement;
  if (target.src.startsWith('blob:')) {
    URL.revokeObjectURL(target.src);
    return;
  }
  const file = fileList.value.find(m => m.name === target.dataset.src);
  delete target.dataset.src;
  if (!file) return;

  exifQueue.pushTask(async () => {
    const name = file.name.toLowerCase();
    if (
      file.type.includes('jpg') ||
      file.type.includes('jpeg') ||
      file.type.includes('png') ||
      name.endsWith('heic') ||
      name.endsWith('avif')
    ) {
      const exifData = await readExifFromFile(file);
      if (exifData && exifData.thumbnailUrl) {
        target.src = exifData.thumbnailUrl;
        target.style.transform = `rotate(${exifData.rotation || 0}deg)`;
        return;
      } else if (exifData && exifData.thumbnail && exifData.thumbnail.blob) {
        target.src = URL.createObjectURL(exifData.thumbnail.blob);
        target.style.transform = `rotate(${exifData.rotation || 0}deg)`;
        return;
      }
    }
    if (file.type.includes('image')) {
      const thumbnail = await readThumbnailFromFile(file, 160, 160);
      if (thumbnail) target.src = thumbnail;
    }
  });
}

async function selectImage(file: File) {
  if (imageDetail.value && imageDetail.value.name === file.name) return;
  if (imageDetailLoading.value) return;
  imageDetailLoading.value = true;
  if (imageDetail.value && imageDetail.value.src) {
    URL.revokeObjectURL(imageDetail.value.src);
  }
  readExifFromFile(file)
    .then((exifData: any) => {
      if (!exifData) {
        exifData = {} as any;
      }
      const name = file.name.toLowerCase();
      let src = '';
      if (name.endsWith('heic') || name.endsWith('avif')) {
        heic2any({ blob: file }).then(conversionResult => {
          if (imageDetail.value && imageDetail.value.name === file.name) {
            if (Array.isArray(conversionResult))
              conversionResult = conversionResult[0];
            imageDetail.value.src = URL.createObjectURL(conversionResult);
          }
        });
      } else {
        src = URL.createObjectURL(file);
      }
      imageDetail.value = {
        src,
        size: formatBytes(file.size),
        name: file.name,
        exif: {
          ...exifData,
          Flash:
            exifData.Flash && exifData.Flash.includes('Flash fired')
              ? 'Yes'
              : 'No',
          ExposureBias:
            (exifData.ExposureBias < 0
              ? '-'
              : exifData.ExposureBias > 0
              ? '+'
              : '') + (exifData.ExposureBias || '0'),
          ExposureTime: exifData.ExposureTime
            ? '1/' + Math.ceil(1 / exifData.ExposureTime)
            : ''
        },
        location: ''
      };
      nextTick(scrollImage);
      if (
        Array.isArray(exifData.GPSLatitude) &&
        Array.isArray(exifData.GPSLongitude)
      ) {
        const lat =
          exifData.latitude ||
          exifData.GPSLatitude[0] +
            exifData.GPSLatitude[1] / 60 +
            exifData.GPSLatitude[2] / 3600;
        const lon =
          exifData.longitude ||
          exifData.GPSLongitude[0] +
            exifData.GPSLongitude[1] / 60 +
            exifData.GPSLongitude[2] / 3600;
        fetch(
          `https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lon}&accept-language=${currentLanguage()}`
        )
          .then(r => r.json())
          .then(r => {
            if (r && r.display_name && imageDetail.value) {
              imageDetail.value.location = r.display_name;
            }
          });
        nextTick(mapEleLoaded);
      }
    })
    .finally(() => {
      imageDetailLoading.value = false;
    });
}

function largeImageLoaded(e: Event) {
  const target = e.target as HTMLImageElement;
  const detail = imageDetail.value?.exif;
  if (
    imageDetail.value &&
    detail &&
    !detail.PixelXDimension &&
    !detail.FocalPlaneXResolution &&
    !detail.ExifImageWidth
  ) {
    imageDetail.value.exif.ExifImageWidth = target.naturalWidth;
    imageDetail.value.exif.ExifImageHeight = target.naturalHeight;
  }
}

function cancelSelection() {
  if (imageDetail.value && imageDetail.value.src) {
    URL.revokeObjectURL(imageDetail.value.src);
  }
  imageDetail.value = null;
}

function paneResized(e: any) {
  panneSize.value = e[0].size;
  storage.setValue(StorageKey.SplitSize, parseInt(e[0].size));
}

function scrollImage() {
  if (!imageDetail.value) return;
  const imageID = 'thumbnail-' + imageDetail.value?.name.trim();
  const imageEle = document.getElementById(imageID);
  imageEle && imageEle.scrollIntoView();
}

function mapEleLoaded() {
  if (!imageDetail.value || !google) return;
  let point = new google.maps.LatLng(
    imageDetail.value.exif.latitude,
    imageDetail.value.exif.longitude
  );
  let map = new google.maps.Map(document.querySelector('#google-maps'), {
    navigationControlOptions: {
      style: google.maps.NavigationControlStyle.SMALL
    },
    mapTypeControl: false,
    mapTypeId: google.maps.MapTypeId.ROADMAP,
    center: {
      lat: imageDetail.value.exif.latitude,
      lng: imageDetail.value.exif.longitude
    },
    zoom: 12
  });
  var bounds = new google.maps.LatLngBounds();
  bounds.extend(point);
  map.fitBounds(bounds);
  new google.maps.Marker({ map, position: point });
}
</script>

<template>
  <Splitpanes class="devtoys-photos" @resized="paneResized">
    <Pane
      class="devtoys-photos-panel"
      min-size="30"
      :size="imageDetail ? 30 : 100"
      :max-size="imageDetail ? 30 : 100"
      @click="cancelSelection"
      v-loading="reading">
      <div v-if="fileList.length > 0" class="devtoys-photos-title">
        <span>{{ folderName }}</span>
        <el-button
          plain
          size="small"
          type="primary"
          :icon="Close"
          @click="clearFileList"
          style="margin-right: 10px" />
      </div>
      <div class="devtoys-photos-items">
        <el-card
          v-for="file in fileList"
          :key="file.name"
          :class="
            imageDetail && file.name === imageDetail.name ? 'selected' : ''
          "
          @click.stop="selectImage(file)">
          <div class="devtoys-photos-items-body">
            <el-image
              :id="'thumbnail-' + file.name.trim()"
              :src="router.options.history.base + '/logo.png'"
              :data-src="file.name"
              :data-name="file.name"
              loading="lazy"
              fit="contain"
              @load="imageLoaded">
              <template #placeholder> Loading... </template>
            </el-image>
          </div>
          <span>{{ file.name }}</span>
        </el-card>
      </div>
      <div v-if="fileList.length <= 0" class="devtoys-photos-sel-dir">
        <el-upload v-if="false"></el-upload>
        <div
          class="el-upload el-upload--text is-drag"
          @dragenter="switchDragging($event, true)"
          @dragover="switchDragging($event, false)"
          tabindex="0">
          <div class="el-upload-dragger">
            <el-icon class="el-icon--upload">
              <UploadFilled />
            </el-icon>
            <div class="el-upload__text">
              {{ t('Drop Files or Directory Here') }} {{ t('or') }}<br /><br />
              <em class="upload__text_sel"
                ><span>{{ t('Select Directory') }}</span
                ><span class="upload__text_sel_block"></span
                ><span>{{ t('Select Files') }}</span></em
              >
            </div>
          </div>
          <input
            v-if="readonly"
            type="file"
            webkitdirectory
            directory
            multiple
            @change="handleFileChange" />
          <input
            v-if="readonly"
            type="file"
            multiple
            style="right: 0"
            @change="handleFileChange" />
          <div
            v-else
            class="readonly-helper"
            @click.stop="selectDirectory"></div>
          <div
            v-show="dragging"
            class="readonly-helper"
            @drop="onFileDrop"></div>
        </div>
      </div>
    </Pane>
    <Pane
      v-if="imageDetail"
      class="devtoys-photos-panel"
      v-loading="imageDetailLoading">
      <div class="devtoys-photos-detail">
        <el-image
          :src="imageDetail.src"
          :preview-src-list="[imageDetail.src]"
          fit="contain"
          @load="largeImageLoaded">
          <template #placeholder
            ><div v-loading="true" class="image-loading"></div
          ></template>
          <template #error
            ><div v-loading="true" class="image-loading"></div
          ></template>
        </el-image>
      </div>
      <div class="devtoys-photos-desc">
        <div class="devtoys-photos-desc-item">
          <span>{{ t('Photo Name') }}</span>
          <span>{{ imageDetail.name }}</span>
        </div>
        <div class="devtoys-photos-desc-item">
          <span>{{ t('Photo Dimension') }}</span>
          <span>
            {{
              Math.ceil(
                imageDetail.exif.ExifImageWidth ||
                  imageDetail.exif.PixelXDimension ||
                  imageDetail.exif.FocalPlaneXResolution ||
                  0
              ) || '-'
            }}
            x
            {{
              Math.ceil(
                imageDetail.exif.ExifImageHeight ||
                  imageDetail.exif.PixelYDimension ||
                  imageDetail.exif.FocalPlaneYResolution ||
                  0
              ) || '-'
            }}
          </span>
        </div>
        <div class="devtoys-photos-desc-item">
          <span>{{ t('Photo Size') }}</span>
          <span>{{ imageDetail.size }}</span>
        </div>
        <div class="devtoys-photos-desc-item">
          <span>{{ t('Filming Time') }}</span>
          <span>{{
            imageDetail.exif.DateTime || imageDetail.exif.CreateDate
          }}</span>
        </div>
        <div v-if="imageDetail.exif.Make" class="devtoys-photos-desc-item">
          <span>{{ t('Camera Manufacturer') }}</span>
          <span>{{ imageDetail.exif.Make }}</span>
        </div>
        <div v-if="imageDetail.exif.Model" class="devtoys-photos-desc-item">
          <span>{{ t('Device Model') }}</span>
          <span>{{ imageDetail.exif.Model }}</span>
        </div>
        <div v-if="imageDetail.exif.LensMake" class="devtoys-photos-desc-item">
          <span>{{ t('Lens Manufacturer') }}</span>
          <span>{{ imageDetail.exif.LensMake }}</span>
        </div>
        <div v-if="imageDetail.exif.LensModel" class="devtoys-photos-desc-item">
          <span>{{ t('Lens Model') }}</span>
          <span :title="imageDetail.exif.LensModel">{{
            imageDetail.exif.LensModel
          }}</span>
        </div>
        <div
          v-if="imageDetail.exif.ExposureTime"
          class="devtoys-photos-desc-item">
          <span>{{ t('Shutter Speed') }}</span>
          <span>{{ imageDetail.exif.ExposureTime }}s</span>
        </div>
        <div v-if="imageDetail.exif.FNumber" class="devtoys-photos-desc-item">
          <span>{{ t('Aperture') }}</span>
          <span>F{{ imageDetail.exif.FNumber }}</span>
        </div>
        <div
          v-if="imageDetail.exif.FocalLength"
          class="devtoys-photos-desc-item">
          <span>{{ t('Focal Length') }}</span>
          <span>{{ Math.ceil(imageDetail.exif.FocalLength) }}mm</span>
        </div>
        <div
          v-if="imageDetail.exif.ISO || imageDetail.exif.ISOSpeedRatings"
          class="devtoys-photos-desc-item">
          <span>{{ t('Sensitivity') }}</span>
          <span
            >ISO{{
              imageDetail.exif.ISOSpeedRatings || imageDetail.exif.ISO
            }}</span
          >
        </div>
        <div
          v-if="imageDetail.exif.BrightnessValue"
          class="devtoys-photos-desc-item">
          <span>{{ t('Brightness') }}</span>
          <span>{{ imageDetail.exif.BrightnessValue.toFixed(2) }}</span>
        </div>
        <div
          v-if="imageDetail.exif.ExposureBias"
          class="devtoys-photos-desc-item">
          <span>{{ t('Exposure') }}</span>
          <span>{{ imageDetail.exif.ExposureBias }}</span>
        </div>
        <div v-if="imageDetail.exif.Flash" class="devtoys-photos-desc-item">
          <span>{{ t('Flash') }}</span>
          <span>{{ t(imageDetail.exif.Flash) }}</span>
        </div>
        <div
          v-if="imageDetail.exif.WhiteBalance"
          class="devtoys-photos-desc-item">
          <span>{{ t('White Balance') }}</span>
          <span>{{ t(imageDetail.exif.WhiteBalance) }}</span>
        </div>
        <div
          v-if="imageDetail.exif.ExposureProgram"
          class="devtoys-photos-desc-item">
          <span>{{ t('Exposure Program') }}</span>
          <span>{{ t(imageDetail.exif.ExposureProgram) }}</span>
        </div>
        <div
          v-if="imageDetail.exif.MeteringMode"
          class="devtoys-photos-desc-item">
          <span>{{ t('Metering Mode') }}</span>
          <span>{{ t(imageDetail.exif.MeteringMode) }}</span>
        </div>
        <div v-if="imageDetail.exif.Software" class="devtoys-photos-desc-item">
          <span>{{ t('Software') }}</span>
          <span>{{ t(imageDetail.exif.Software) }}</span>
        </div>
        <div
          v-if="imageDetail.exif.GPSLongitude"
          class="devtoys-photos-desc-item">
          <span>{{ t('Longitude') }}</span>
          <span>
            {{ imageDetail.exif.GPSLongitude[0] }}°
            {{ imageDetail.exif.GPSLongitude[1] }}'
            {{ imageDetail.exif.GPSLongitude[2] }}"
            {{ t('GPSRef' + imageDetail.exif.GPSLongitudeRef) }}
          </span>
        </div>
        <div
          v-if="imageDetail.exif.GPSLatitude"
          class="devtoys-photos-desc-item">
          <span>{{ t('Latitude') }}</span>
          <span>
            {{ imageDetail.exif.GPSLatitude[0] }}°
            {{ imageDetail.exif.GPSLatitude[1] }}'
            {{ imageDetail.exif.GPSLatitude[2] }}"
            {{ t('GPSRef' + imageDetail.exif.GPSLatitudeRef) }}
          </span>
        </div>
        <div v-if="imageDetail.location" class="devtoys-photos-desc-item">
          <span>{{ t('Location') }}</span>
          <span :title="imageDetail.location">
            {{ imageDetail.location }}
          </span>
        </div>
        <div v-if="imageDetail.exif.GPSLatitude" id="google-maps"></div>
      </div>
    </Pane>
  </Splitpanes>
</template>

<style lang="less" scoped>
.devtoys-photos {
  width: 100%;
  height: 100%;
  position: relative;
  :deep(.splitpanes__splitter) {
    width: 2px;
    background-color: var(--el-bg-color-page);
  }

  &-title {
    width: 100%;
    display: flex;
    justify-content: space-between;
  }

  .image-loading {
    position: absolute;
    width: 100%;
    height: 100%;
  }

  &-sel-dir {
    position: absolute;
    left: 0;
    top: 0;
    width: 100%;
    height: 100%;
    & > div {
      height: 100%;
    }

    :deep(.el-upload) {
      height: 100%;
      input {
        position: absolute;
        top: 0;
        width: 50%;
        height: 100%;
        cursor: pointer;
        opacity: 0;
        @media (max-width: 850px) {
          width: 100%;
        }
      }
      .readonly-helper {
        position: absolute;
        top: 0;
        width: 100%;
        height: 100%;
      }
      .el-upload-dragger {
        height: 100%;
        display: flex;
        align-items: center;
        flex-direction: column;
        justify-content: center;
        background-color: transparent;
      }
      .el-upload__text {
        width: 100%;
        .upload__text_sel {
          display: flex;
          width: 100%;
          justify-content: center;

          span {
            display: inline-block;
            width: 150px;
          }
          .upload__text_sel_block {
            width: 50px;
          }
        }
      }
    }
  }

  &-panel {
    height: 100%;
    overflow-y: auto;
  }
  &-items {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(150px, 1fr));
    padding-right: 5px;
    grid-column-gap: 5px;
    grid-row-gap: 10px;
    width: 100%;
    margin-top: 8px;
    overflow-y: auto;
    @media (max-width: 850px) {
      grid-template-columns: repeat(auto-fill, minmax(100%, 1fr));
    }
    &-body {
      width: 140px;
      height: 115px;
      display: flex;
      align-items: center;
      justify-content: center;
      @media (max-width: 850px) {
        width: 100%;
      }
      .el-image {
        height: 100%;
        width: 100%;
        display: flex;
        align-items: center;
        justify-content: center;
        :deep(img) {
          max-height: 100%;
          max-width: 100%;
        }
      }
    }
    .el-card {
      width: 150px;
      border: 1px solid var(--el-border-color);
      height: 150px;
      background-color: var(--el-bg-color);
      box-shadow: none;
      @media (max-width: 850px) {
        width: 100%;
      }
      &.selected {
        border-color: var(--el-color-primary);
      }
      :deep(.el-card__body) {
        padding: 5px;
        display: flex;
        align-items: center;
        justify-content: center;
        flex-direction: column;

        & > span {
          @media (max-width: 850px) {
            display: inline-block;
            width: 100%;
            text-overflow: ellipsis;
            white-space: nowrap;
            overflow: hidden;
            text-align: center;
          }
        }
      }
      cursor: pointer;
    }
  }

  &-detail,
  &-desc {
    width: 100%;
  }
  &-detail {
    height: 50%;
  }
  &-detail {
    display: flex;
    justify-content: center;
    align-items: center;
    height: 50vh;
    .el-image {
      width: 100%;
      height: 100%;
      display: flex;
      align-items: center;
      justify-content: center;
    }
    img {
      max-width: 100%;
      max-height: 100%;
      padding-bottom: 5px;
      padding-left: 5px;
    }
  }
  &-desc {
    display: flex;
    flex-wrap: wrap;
    align-content: flex-start;
    overflow-y: auto;
    padding-right: 20px;
    margin-top: 10px;
    justify-content: space-between;
    #google-maps {
      width: 100%;
      height: 500px;
      margin-left: 20px;
    }
    &-item {
      max-width: 100%;
      min-width: 48%;
      height: 30px;
      display: flex;
      @media (max-width: 850px) {
        width: 100%;
        flex-direction: column;
        height: unset;
      }
      span:nth-child(1) {
        font-weight: bolder;
        width: 130px;
        padding-right: 5px;
        margin-left: 20px;
        @media (max-width: 850px) {
          width: 100%;
          margin-left: 10px;
        }
      }
      span:nth-child(2) {
        flex: 1;
        @media (max-width: 850px) {
          margin-left: 10px;
          margin-bottom: 5px;
        }
      }
      span {
        display: inline-block;
        white-space: nowrap;
        overflow: hidden;
        text-overflow: ellipsis;
      }
    }
    :deep(.el-descriptions__body) {
      background-color: transparent;
      .el-descriptions__label {
        width: 80px;
        display: inline-block;
        text-align: justify;
      }
    }
  }
}
</style>
