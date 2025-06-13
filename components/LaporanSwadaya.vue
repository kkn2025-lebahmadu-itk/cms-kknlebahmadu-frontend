<template>
    <div class="max-w-5xl mx-auto p-8 bg-white text-black text-sm">
      <h1 class="text-center text-xl font-bold mb-4 leading-relaxed">
        LAPORAN KEGIATAN SWADAYA MASYARAKAT RT. {{ data.namaRT }}<br />
        KELURAHAN TELAGA SARI<br />
        TRI WULAN II TAHUN 2024
      </h1>
  
      <table class="w-full border mb-8">
        <thead class="bg-gray-100">
          <tr>
            <th class="border p-2">No</th>
            <th class="border p-2">Tanggal</th>
            <th class="border p-2">Uraian Kegiatan</th>
            <th class="border p-2">KEMASYARAKATAN</th>
            <th class="border p-2">EKONOMI</th>
            <th class="border p-2">SOSBUD & AGAMA</th>
            <th class="border p-2">LINGKUNGAN</th>
            <th class="border p-2">KESEHATAN</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="(item, index) in data.kegiatan" :key="index">
            <td class="border p-2 text-center">{{ index + 1 }}</td>
            <td class="border p-2">{{ item.tanggal }}</td>
            <td class="border p-2">{{ item.uraian }}</td>
            <td class="border p-2 text-right">{{ formatRupiah(item.kemasyarakatan) }}</td>
            <td class="border p-2 text-right">{{ formatRupiah(item.ekonomi) }}</td>
            <td class="border p-2 text-right">{{ formatRupiah(item.sosbudAgama) }}</td>
            <td class="border p-2 text-right">{{ formatRupiah(item.lingkungan) }}</td>
            <td class="border p-2 text-right">{{ formatRupiah(item.kesehatan) }}</td>
          </tr>
        </tbody>
      </table>
  
      <div class="text-right mt-8">
        <p>Balikpapan, 31 Maret 2024</p>
        <p class="mt-12">Ketua RT. {{ data.namaRT }}</p>
        <p class="font-bold mt-2">{{ data.namaKetuaRT }}</p>
      </div>
    </div>
  </template>
  
  <script setup>
  const props = defineProps({
    data: {
      type: Object,
      required: true
    }
  })
  
  const formatRupiah = (angka) => {
    if (!angka || isNaN(angka)) return '-'
    return angka.toLocaleString('id-ID', { style: 'currency', currency: 'IDR' })
  }
  </script>
  
  <style scoped>
  table {
    border-collapse: collapse;
  }
  </style>
  