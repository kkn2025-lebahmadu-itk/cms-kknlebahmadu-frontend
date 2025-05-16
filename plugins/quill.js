import { defineNuxtPlugin } from "#app";
import Quill from "quill";
import 'quill/dist/quill.snow.css'


export default defineNuxtPlugin((nuxtApp) => {
    nuxtApp.provide("quill", Quill);
    // nuxtApp.vueApp.use(Quill);

})

