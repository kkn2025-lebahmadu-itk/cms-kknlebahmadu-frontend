#!/bin/bash

TOKEN="eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ0b2tlbl90eXBlIjoiYWNjZXNzIiwiZXhwIjoxNzQ2MTQ4NDk5LCJpYXQiOjE3NDYxNDgxOTksImp0aSI6ImE2MjZkNGUxOTM2ZTQxZGViMDlhMjA3YmViNjI4OGNmIiwidXNlcl9pZCI6Nn0.lBpmhJsUNsT_ijgiWodMAY_DL0fvb4rSZRbkJPOwVIY"

URL="http://localhost:8000/api/news"

curl -X POST "$URL" \
  -H "Authorization: Bearer $TOKEN" \
  -H "Accept: application/json" \
  -H "Content-Type: application/json" \
  --data '{"title":"Finlandia Negeri 1000 Danau","content":"Finlandia memiliki ribuan danau yang indah."}'
echo

curl -X POST "$URL" \
  -H "Authorization: Bearer $TOKEN" \
  -H "Accept: application/json" \
  -H "Content-Type: application/json" \
  --data '{"title":"Aurora di Langit Utara","content":"Fenomena aurora bisa dilihat jelas di Finlandia bagian utara."}'
echo

curl -X POST "$URL" \
  -H "Authorization: Bearer $TOKEN" \
  -H "Accept: application/json" \
  -H "Content-Type: application/json" \
  --data '{"title":"Pendidikan Terbaik Dunia","content":"Sistem pendidikan Finlandia dikenal sebagai yang terbaik di dunia."}'
echo

curl -X POST "$URL" \
  -H "Authorization: Bearer $TOKEN" \
  -H "Accept: application/json" \
  -H "Content-Type: application/json" \
  --data '{"title":"Seni Arsitektur Modern","content":"Helsinki adalah pusat arsitektur modern di Eropa."}'
echo

curl -X POST "$URL" \
  -H "Authorization: Bearer $TOKEN" \
  -H "Accept: application/json" \
  -H "Content-Type: application/json" \
  --data '{"title":"Festival Musim Panas Finlandia","content":"Festival musim panas dipenuhi musik, tarian, dan tradisi lokal."}'
echo

curl -X POST "$URL" \
  -H "Authorization: Bearer $TOKEN" \
  -H "Accept: application/json" \
  -H "Content-Type: application/json" \
  --data '{"title":"Sauna Tradisional Finlandia","content":"Sauna adalah bagian penting dari budaya Finlandia."}'
echo

curl -X POST "$URL" \
  -H "Authorization: Bearer $TOKEN" \
  -H "Accept: application/json" \
  -H "Content-Type: application/json" \
  --data '{"title":"Ski dan Snowboard di Lapland","content":"Lapland menawarkan arena ski terbaik untuk turis."}'
echo

curl -X POST "$URL" \
  -H "Authorization: Bearer $TOKEN" \
  -H "Accept: application/json" \
  -H "Content-Type: application/json" \
  --data '{"title":"Hari Tengah Malam Tanpa Malam","content":"Di musim panas, matahari tidak pernah terbenam di sebagian Finlandia."}'
echo

curl -X POST "$URL" \
  -H "Authorization: Bearer $TOKEN" \
  -H "Accept: application/json" \
  -H "Content-Type: application/json" \
  --data '{"title":"Makanan Khas: Karjalanpiirakka","content":"Karjalanpiirakka adalah makanan tradisional berbentuk pie."}'
echo

curl -X POST "$URL" \
  -H "Authorization: Bearer $TOKEN" \
  -H "Accept: application/json" \
  -H "Content-Type: application/json" \
  --data '{"title":"Santa Claus dari Rovaniemi","content":"Kota Rovaniemi dikenal sebagai rumah Santa Claus resmi."}'
echo
