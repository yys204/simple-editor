<template>
  <div class="flex w-full h-full">
    <div class="w-1/3 h-full">
      <div class="w-full h-[32px] flex justify-between">
        <a-space :size="0">
          <template #split>
            <a-divider type="vertical" />
          </template>
          <a-button
            type="link"
            @click="changeEditor('template')"
            class="text-[16px]"
          >
            template
          </a-button>
          <a-button
            type="link"
            @click="changeEditor('script')"
            class="text-[16px]"
          >
            script
          </a-button>
        </a-space>
        <a-space :size="0">
          <template #split>
            <a-divider type="vertical" />
          </template>
          <a-button type="link" @click="handleFormat"
            ><Brackets :size="16"
          /></a-button>
          <a-button type="link"><Undo2 :size="16" /></a-button>
          <a-button type="link" @click="handlePlay"
            ><Play :size="16"
          /></a-button>
        </a-space>
      </div>
      <div
        class="w-full h-[calc(100%-32px)]"
        ref="monacoElTemplate"
        v-show="currentEditor === 'template'"
      ></div>
      <div
        class="w-full h-[calc(100%-32px)]"
        ref="monacoElScript"
        v-show="currentEditor === 'script'"
      ></div>
    </div>
    <div class="w-2/3 h-full">
      <iframe
        ref="editorIframe"
        frameborder="0"
        style="height: 100%; width: 100%"
        allow="geolocation *;"
        :src="iframeUrl"
      >
      </iframe>
    </div>
  </div>
</template>
<script setup>
import { ref, onMounted, onUnmounted, toRaw } from "vue";
import { Undo2, Play, Brackets } from "lucide-vue-next";
import * as monaco from "monaco-editor/esm/vs/editor/editor.api";
// import { Splitpanes, Pane } from 'splitpanes'
// import 'splitpanes/dist/splitpanes.css'

const monacoElTemplate = ref(null);
const monacoElScript = ref(null);
let editorTemplate = null;
let editorScript = null;
const currentEditor = ref("script");

const preUrl = window.location.href.split("#")[0].replace("/index.html", "");
const iframeUrl = preUrl + "/editor.html";
const editorIframe = ref(null);

const props = defineProps({ name: String, category: String });

onMounted(() => {
  init();
});

function init() {
  const fileUrl = `${preUrl}/CodeTemplate/index.vue`;
  fetch(fileUrl)
    .then((r) => {
      return r.text();
    })
    .then((code) => {
      if (editorIframe.value && editorIframe.value.attachEvent) {
        editorIframe.value.attachEvent("onload", () => {
          playCode(code);
        });
      } else {
        editorIframe.value.onload = () => {
          playCode(code);
        };
      }
      let [templatValue, scriptValue] = code.split(`<script setup>`);

      if (scriptValue) {
        scriptValue = scriptValue.replace(/<\/script>/, "");
      }
      console.log(scriptValue);
      if (monacoElTemplate.value && !editorTemplate) {
        editorTemplate = monaco.editor.create(monacoElTemplate.value, {
          value: templatValue,
          language: "html",
          theme: "vs-dark",
          automaticLayout: true,
          autoIndent: true,
          formatOnPaste: true,
          formatOnType: true,
        });
      }
      if (monacoElScript.value && !editorScript) {
        editorScript = monaco.editor.create(monacoElScript.value, {
          value: scriptValue,
          language: "javascript",
          theme: "vs-dark",
          automaticLayout: true,
          autoIndent: true,
          formatOnPaste: true,
          formatOnType: true,
        });
      }
    });
}

function handlePlay() {
  const codeTemplate = toRaw(editorTemplate).getValue();
  const codeScript = `<script setup>
  ${toRaw(editorScript).getValue()}<\/script>`;
  const code = codeTemplate + "\n" + codeScript;
  const data = {
    type: "codeData",
    code,
  };
  editorIframe.value.contentWindow.postMessage(data, "*");
}

function playCode(code) {
  const data = {
    type: "codeData",
    code,
  };
  editorIframe.value.contentWindow.postMessage(data, "*");
}

function handleFormat() {
  if (currentEditor.value === "script") {
    toRaw(editorScript).getAction("editor.action.formatDocument").run();
  }
  if (currentEditor.value === "template") {
    toRaw(editorTemplate).getAction("editor.action.formatDocument").run();
  }
}

function changeEditor(val) {
  currentEditor.value = val;
}
onUnmounted(() => {
  toRaw(editorTemplate).dispose();
  toRaw(editorScript).dispose();
});
</script>
<style scoped></style>
