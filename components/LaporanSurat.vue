<!-- components/LaporanSurat.vue -->
<template>
    <div class="w-[297mm] h-[210mm] bg-white p-10 mx-auto text-black text-[11pt] leading-tight overflow-auto shadow">
      <h2 class="text-center font-bold uppercase">Laporan Bulanan</h2>
      <h3 class="text-center">Pelaksanaan Tugas dan Fungsi Rukun Tetangga (RT) {{ data.namaRT }}</h3>
      <h3 class="text-center mb-6">Kelurahan Telagasari</h3>
  
      <p class="font-bold mb-2">Bulan : {{ data.bulan }} {{ data.tahun }}</p>
  
      <table class="w-full border border-black text-sm">
        <thead class="bg-gray-100">
          <tr>
            <th class="border border-black px-1 py-1 w-8">NO</th>
            <th class="border border-black px-2 py-1 w-28">TANGGAL</th>
            <th class="border border-black px-2 py-1">URAIAN TUGAS DAN FUNGSI YANG DILAKSANAKAN</th>
            <th class="border border-black px-2 py-1 w-40">KETERANGAN</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="(item, i) in data.kegiatan" :key="i">
            <td class="border border-black text-center">{{ i + 1 }}</td>
            <td class="border border-black text-center">{{ item.tanggal }}</td>
            <td class="border border-black">{{ item.uraian }}</td>
            <td class="border border-black text-center">{{ item.keterangan }}</td>
          </tr>
        </tbody>
      </table>
  
      <div class="flex justify-between mt-10">
        <div>
          <p>Mengetahui,</p>
          <p class="mb-16">LURAH TELAGASARI</p>
          <p class="underline">{{ data.namaLurah }}</p>
        </div>
        <div class="text-right">
          <p>Balikpapan, 31 {{ data.bulan }} {{ data.tahun }}</p>
          <p class="mb-16">Ketua RT. {{ data.namaRT }}</p>
          <p class="underline">{{ data.namaKetuaRT }}</p>
        </div>
      </div>
    </div>
  </template>
  
  <script setup>
  defineProps(['data'])
  </script>
  