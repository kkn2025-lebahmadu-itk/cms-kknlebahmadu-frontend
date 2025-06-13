<script setup>
import { ref, reactive, onMounted } from 'vue'
import { useReport } from '~/composables/useReport'
import LaporanSurat from '~/components/LaporanSurat.vue'
import LaporanTriwulan from '~/components/LaporanTriwulan.vue'

const { fetchAllReport, createReport, deleteReport, response, pending, error } = useReport()
const showModal = ref(false)

const manualUpload = reactive({
  file: null,
  is_signed: false,
  kategori: ''
})

onMounted(() => {
  fetchAllReport()
})

// ===== Form Laporan Reguler =====
const formSurat = reactive({
  namaRT: '45',
  namaKetuaRT: '',
  namaLurah: '',
  tanggalSurat: '',
  kegiatan: []
})
const addKegiatanSurat = () => formSurat.kegiatan.push({ tanggal: '', uraian: '', keterangan: '' })
const removeKegiatanSurat = (i) => formSurat.kegiatan.splice(i, 1)

// ===== Form Laporan Triwulan =====
const formTriwulan = reactive({
  namaRT: '45',
  namaKetuaRT: '',
  kegiatan: []
})
const addKegiatanTriwulan = () => formTriwulan.kegiatan.push({ tanggal: '', uraian: '', bidang: '', jumlah: 0 })
const removeKegiatanTriwulan = (i) => formTriwulan.kegiatan.splice(i, 1)
</script>

<template>
  <div class="max-w-5xl mx-auto p-6 space-y-12">
    <!-- ====== Generator Laporan Biasa ====== -->
    <section class="bg-white dark:bg-KKNBlack p-6 rounded shadow border space-y-4">
      <h2 class="text-2xl font-bold">Generator Laporan Bulanan</h2>

      <div class="grid md:grid-cols-3 gap-4">
        <input v-model="formSurat.namaKetuaRT" placeholder="Nama Ketua RT" class="border px-3 py-2 rounded w-full" />
        <input v-model="formSurat.namaLurah" placeholder="Nama Lurah" class="border px-3 py-2 rounded w-full" />
        <input v-model="formSurat.tanggalSurat" type="date" class="border px-3 py-2 rounded w-full" />
      </div>

      <h3 class="text-lg font-semibold">Daftar Kegiatan</h3>
      <div v-for="(item, i) in formSurat.kegiatan" :key="i" class="grid grid-cols-6 gap-2 items-center">
        <input v-model="item.tanggal" type="date" class="border px-3 py-2 rounded w-full" />
        <input v-model="item.uraian" placeholder="Uraian" class="border px-3 py-2 rounded col-span-3" />
        <input v-model="item.keterangan" placeholder="Keterangan" class="border px-3 py-2 rounded col-span-1" />
        <button @click="removeKegiatanSurat(i)" class="text-red-600 text-lg hover:text-red-800">✕</button>
      </div>
      <button @click="addKegiatanSurat" class="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 text-sm">
        + Tambah Kegiatan
      </button>

      <div class="mt-6">
        <h3 class="text-lg font-semibold mb-2">Preview Format Surat</h3>
      
        <div class="flex justify-center ">
  <div style="transform: scale(0.75); transform-origin: top center;">
    <LaporanSurat :data="formSurat" />
  </div>
</div>
      </div>
    </section>

    <!-- ====== Generator Laporan Triwulan ====== -->
    <section class="bg-white dark:bg-KKNBlack p-6 rounded shadow border space-y-4">
      <h2 class="text-2xl font-bold">Generator Laporan Triwulan</h2>

      <div class="grid md:grid-cols-3 gap-4">
        <input v-model="formTriwulan.namaKetuaRT" placeholder="Nama Ketua RT" class="border px-3 py-2 rounded w-full" />
      </div>

      <h3 class="text-lg font-semibold">Daftar Kegiatan Triwulan</h3>
      <div v-for="(item, i) in formTriwulan.kegiatan" :key="i" class="grid grid-cols-6 gap-2 items-center">
        <input v-model="item.tanggal" type="date" class="border px-3 py-2 rounded w-full" />
        <input v-model="item.uraian" placeholder="Uraian" class="border px-3 py-2 rounded col-span-2" />
        <select v-model="item.bidang" class="border px-3 py-2 rounded">
          <option disabled value="">Bidang</option>
          <option>KEMASYARAKATAN</option>
          <option>EKONOMI</option>
          <option>SOSBUD & AGAMA</option>
          <option>LINGKUNGAN</option>
          <option>KESEHATAN</option>
        </select>
        <input v-model.number="item.jumlah" type="number" placeholder="Jumlah (Rp)" class="border px-3 py-2 rounded" />
        <button @click="removeKegiatanTriwulan(i)" class="text-red-600 text-lg hover:text-red-800">✕</button>
      </div>
      <button @click="addKegiatanTriwulan" class="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 text-sm">
        + Tambah Kegiatan
      </button>

      <div class="mt-6">
        <h3 class="text-lg font-semibold mb-2">Preview Format Triwulan</h3>

        <div class="flex justify-center">
  <div style="transform: scale(0.75); transform-origin: top center;">
    <LaporanTriwulan :data="formTriwulan" />
  
  </div>
</div>
      </div>
    </section>
  </div>
</template>
