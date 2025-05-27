<script setup>
import { useRouter } from 'vue-router'

const router = useRouter()

const goToHome = () => {
    router.push('/')
}
</script>

<template>
    <div class="notfound-page px-6 py-12 w-full max-w-screen-xl mx-auto min-h-screen flex flex-col items-center justify-center">
        <div class="bg-white p-8 rounded-lg shadow-2xl max-w-md w-full text-center">
            <h1 class="text-4xl font-bold text-red-600 mb-4">Halaman Tidak Ditemukan</h1>
            
            <p class="text-gray-700 text-lg mb-6">
                Halaman yang Anda cari tidak dapat ditemukan atau telah dipindahkan.
            </p>

            <button 
                @click="goToHome" 
                class="px-6 py-3 bg-KKNOrange text-white rounded-lg hover:bg-orange-600 transition-all duration-300 font-medium shadow-md"
            >
                Kembali ke Beranda
            </button>
        </div>
    </div>
</template>