<script setup lang="ts">
import { ref, type Ref } from 'vue';
import type { ExifInfo } from '@/utils/exif-js/exif';
import { Splitpanes, Pane } from 'splitpanes';
import 'splitpanes/dist/splitpanes.css';
import { TaskQueue } from '@/utils/task-queue';
import { readExifFromFile, readThumbnailFromFile } from '@/utils/utils';
import { storage, StorageKey } from '@/utils/storage';
import { formatBytes } from '@/utils/formatter';
import { useLanguageStore } from '@/stores/language';
import { useRouter } from 'vue-router';

interface ImageDetail {
  src: string;
  name: string;
  exif: ExifInfo;
  size: string;
  location: string;
}

const router = useRouter();
const { t, currentLanguage } = useLanguageStore();

const panneSize = ref(storage.getValue(StorageKey.SplitSize, 50));
const reading = ref(false);
const folderName = ref('');
const fileList: Ref<File[]> = ref([]);
const imageDetail: Ref<ImageDetail | null> = ref(null);
const imageDetailLoading = ref(false);
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

async function processFolderHandle(handle: FileSystemDirectoryHandle) {
  const files = [];
  try {
    for await (const entry of handle.entries()) {
      // 判断当前文件是否为jpg文件
      const name = entry[0];
      try {
        const file = await entry[1].getFile(name);
        if (
          file instanceof File &&
          file.type.includes('image') &&
          !file.type.includes('tif')
        ) {
          files.push(file);
        }
      } catch {}
    }
  } catch {}
  fileList.value = files;
  reading.value = false;
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
    if (file.type.includes('jpg') || file.type.includes('jpeg')) {
      const exifData = await readExifFromFile(file);
      if (exifData && exifData.thumbnail.blob) {
        target.src = URL.createObjectURL(exifData.thumbnail.blob);
        return;
      }
    }
    const thumbnail = await readThumbnailFromFile(file, 160, 160);
    if (thumbnail) target.src = thumbnail;
  });
}

async function selectImage(file: File) {
  if (imageDetail.value && imageDetail.value.name === file.name) return;
  if (imageDetailLoading.value) return;
  imageDetailLoading.value = true;
  readExifFromFile(file)
    .then((exifData: any) => {
      if (!exifData) {
        exifData = {} as any;
      }
      const src = URL.createObjectURL(file);
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
      if (
        Array.isArray(exifData.GPSLatitude) &&
        Array.isArray(exifData.GPSLongitude)
      ) {
        const lat =
          exifData.GPSLatitude[0] +
          exifData.GPSLatitude[1] / 60 +
          exifData.GPSLatitude[2] / 3600;
        const lon =
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
      }
    })
    .finally(() => {
      imageDetailLoading.value = false;
    });
}

function cancelSelection() {
  imageDetail.value = null;
}

function paneResized(e: any) {
  panneSize.value = e[0].size;
  storage.setValue(StorageKey.SplitSize, parseInt(e[0].size));
}
</script>

<template>
  <Splitpanes class="devtoys-photos" @resized="paneResized">
    <Pane
      class="devtoys-photos-panel"
      min-size="30"
      :size="imageDetail ? panneSize : 100"
      :max-size="imageDetail ? 70 : 100"
      @click="cancelSelection"
      v-loading="reading">
      <el-button v-if="fileList.length > 0" @click.stop="selectDirectory">{{
        t('Select Directory')
      }}</el-button>
      {{ folderName }}
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
              :src="router.options.history.base + '/logo.png'"
              :data-src="file.name"
              :data-name="file.name"
              loading="lazy"
              fit="contain"
              @load="imageLoaded">
              <template #placeholder>
                <div class="image-slot">
                  Loading<span class="dot">...</span>
                </div>
              </template>
            </el-image>
          </div>
          <span>{{ file.name }}</span>
        </el-card>
      </div>
      <div v-if="fileList.length <= 0" class="devtoys-photos-sel-dir">
        <el-button @click.stop="selectDirectory">{{
          t('Select Directory')
        }}</el-button>
      </div>
    </Pane>
    <Pane
      v-if="imageDetail"
      class="devtoys-photos-panel"
      v-loading="imageDetailLoading">
      <div class="devtoys-photos-detail">
        <img :src="imageDetail.src" @load="imageLoaded" />
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
                imageDetail.exif.PixelXDimension ||
                  imageDetail.exif.FocalPlaneXResolution
              )
            }}
            x
            {{
              Math.ceil(
                imageDetail.exif.PixelYDimension ||
                  imageDetail.exif.FocalPlaneYResolution
              )
            }}
          </span>
        </div>
        <div class="devtoys-photos-desc-item">
          <span>{{ t('Photo Size') }}</span>
          <span>{{ imageDetail.size }}</span>
        </div>
        <div class="devtoys-photos-desc-item">
          <span>{{ t('Filming Time') }}</span>
          <span>{{ imageDetail.exif.DateTime }}</span>
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
          <span>{{ imageDetail.exif.ExposureTime }}</span>
        </div>
        <div v-if="imageDetail.exif.FNumber" class="devtoys-photos-desc-item">
          <span>{{ t('Aperture') }}</span>
          <span>F{{ imageDetail.exif.FNumber }}</span>
        </div>
        <div
          v-if="imageDetail.exif.FocalLength"
          class="devtoys-photos-desc-item">
          <span>{{ t('Focal Length') }}</span>
          <span>{{ imageDetail.exif.FocalLength }}mm</span>
        </div>
        <div
          v-if="imageDetail.exif.ISOSpeedRatings"
          class="devtoys-photos-desc-item">
          <span>{{ t('Sensitivity') }}</span>
          <span>ISO{{ imageDetail.exif.ISOSpeedRatings }}</span>
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

  &-sel-dir {
    position: absolute;
    left: 50%;
    top: 50%;
    transform: translate(-50%, -50%);
  }

  &-panel {
    width: 100%;
    height: 100%;
  }
  &-items {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(150px, 1fr));
    padding-right: 5px;
    grid-column-gap: 5px;
    grid-row-gap: 10px;
    width: 100%;
    height: calc(100% - 40px);
    margin-top: 8px;
    overflow-y: auto;
    &-body {
      width: 140px;
      height: 115px;
      display: flex;
      align-items: center;
      justify-content: center;
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
      &.selected {
        border-color: var(--el-color-primary);
      }
      :deep(.el-card__body) {
        padding: 5px;
        display: flex;
        align-items: center;
        justify-content: center;
        flex-direction: column;
      }
      cursor: pointer;
    }
  }

  &-detail,
  &-desc {
    width: 100%;
    height: 50%;
  }
  &-detail {
    display: flex;
    justify-content: center;
    align-items: center;
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
    padding-left: 20px;
    justify-content: space-between;
    &-item {
      max-width: 100%;
      min-width: 48%;
      height: 30px;
      display: flex;
      span:nth-child(1) {
        font-weight: bolder;
        width: 130px;
        padding-right: 5px;
      }
      span:nth-child(2) {
        flex: 1;
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
