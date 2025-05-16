<template>
    <footer class="bg-gray-800 text-white py-8">
        <div class="container mx-auto px-4">
            <div class="grid grid-cols-1 md:grid-cols-3 gap-8">
                <div>
                    <h3 class="text-xl font-bold mb-4">KKN Lebah madu</h3>
                    <p class="text-gray-300">Providing quality services and information for our community.</p>
                </div>
                <div>
                    <h3 class="text-xl font-bold mb-4">Quick Links</h3>
                    <ul class="space-y-2">
                        <li><router-link to="/" class="text-gray-300 hover:text-white transition">Home</router-link></li>
                        <li><router-link to="/about" class="text-gray-300 hover:text-white transition">About Us</router-link></li>
                        <li><router-link to="/services" class="text-gray-300 hover:text-white transition">Services</router-link></li>
                        <li><router-link to="/contact" class="text-gray-300 hover:text-white transition">Contact</router-link></li>
                    </ul>
                </div>
                <div>
                    <h3 class="text-xl font-bold mb-4">Contact Us</h3>
                    <div class="space-y-2 text-gray-300">
                        <p class="flex items-center"><span class="mr-2">📍</span> 123 Street Name, City, Country</p>
                        <p class="flex items-center"><span class="mr-2">📞</span> +62 123 456 7890</p>
                        <p class="flex items-center"><span class="mr-2">✉️</span> info@kknlebahmadu.com</p>
                    </div>
                </div>
            </div>
            <div class="border-t border-gray-700 mt-8 pt-6 text-center text-gray-400">
                <p>&copy; {{ new Date().getFullYear() }} KK NLE Bahmadu. All Rights Reserved.</p>
            </div>
        </div>
    </footer>
</template>
