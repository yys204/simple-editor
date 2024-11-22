<template>
  <div class="w-full h-full">
    <component :is="previewComp" />
  </div>
</template>

<script setup>
import * as Vue from "vue";
import { onUnmounted, defineAsyncComponent, shallowRef } from "vue";
import { loadModule } from "vue3-sfc-loader";

const previewComp = shallowRef();

window.addEventListener("message", (event) => {
  const data = event.data;
  if (data && data.type === "codeData") {
    playCode(data.code);
  }
});

function playCode(code) {
  const options = {
    moduleCache: {
      vue: Vue,
    },
    getFile: () => code,
    log(type, ...args) {
      console.log(type, ...args);
    },
    addStyle(textContent) {
      const style = Object.assign(document.createElement("style"), {
        textContent,
      });
      const ref = document.head.getElementsByTagName("style")[0] || null;
      document.head.insertBefore(style, ref);
    },
  };
  const myComponent = defineAsyncComponent({
    loader: () => {
      return loadModule("file.vue", options);
    },
  });
  previewComp.value = myComponent;
}
</script>

<style></style>
