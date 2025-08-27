# Troubleshooting Guide - Timeline Magang Harian

## Masalah: Tombol Edit dan Hapus Tidak Berfungsi

### 🔍 **Langkah Debug:**

#### 1. **Buka Developer Console**
- Tekan `F12` atau `Ctrl+Shift+I`
- Buka tab `Console`
- Lihat apakah ada error messages

#### 2. **Test Event Delegation**
- Klik tombol Edit atau Hapus
- Di console seharusnya muncul:
  ```
  Event delegation triggered: [button element]
  Edit button clicked (atau Delete button clicked)
  Task ID for edit: [number]
  ```

#### 3. **Test Method Calls**
- Setelah klik tombol, seharusnya muncul:
  ```
  editTask called with ID: [number]
  Found task: [task object]
  Setting up edit mode for task: [title]
  ```

#### 4. **Verifikasi HTML Structure**
- Pastikan tombol memiliki class yang benar:
  ```html
  <button class="btn-edit" data-task-id="123">Edit</button>
  <button class="btn-delete" data-task-id="123">Hapus</button>
  ```

### 🛠️ **Solusi Umum:**

#### **Solusi 1: Refresh Browser**
```bash
# Hard refresh (clear cache)
Ctrl + F5 (Windows)
Cmd + Shift + R (Mac)
```

#### **Solusi 2: Clear LocalStorage**
```javascript
// Di console browser
localStorage.clear();
location.reload();
```

#### **Solusi 3: Check Element Inspector**
- Klik kanan tombol Edit/Hapus
- Pilih "Inspect Element"
- Pastikan HTML structure benar

### 🧪 **Test Manual:**

#### **Test 1: Console Commands**
```javascript
// Test instance
console.log(window.timeline);

// Test methods
console.log(typeof window.timeline.editTask);
console.log(typeof window.timeline.deleteTask);

// Test data
console.log(window.timeline.dailyTasks);
```

#### **Test 2: Manual Method Call**
```javascript
// Jika ada task dengan ID 1
window.timeline.editTask(1);
window.timeline.deleteTask(1);
```

### 🚨 **Error Umum:**

#### **Error: "timeline is not defined"**
- Pastikan `index.js` sudah di-load
- Pastikan class `DailyTimeline` sudah di-initialize

#### **Error: "Cannot read property of undefined"**
- Pastikan semua DOM elements ada
- Pastikan event listeners terpasang dengan benar

#### **Error: "Method not found"**
- Pastikan method `editTask` dan `deleteTask` ada di class
- Pastikan tidak ada typo di nama method

### 📋 **Checklist Debug:**

- [ ] Console tidak ada error
- [ ] Event delegation ter-trigger
- [ ] Task ID ter-parse dengan benar
- [ ] Method editTask/deleteTask ter-call
- [ ] Task ditemukan di data
- [ ] Form berubah ke mode edit
- [ ] Data tersimpan setelah update

### 🔧 **File yang Perlu Diperiksa:**

1. **index.js** - Pastikan semua method ada
2. **index.html** - Pastikan semua IDs ada
3. **style.css** - Pastikan styling tidak mengganggu

### 📞 **Jika Masih Bermasalah:**

1. Share screenshot console error
2. Share HTML structure tombol
3. Share console log output
4. Test dengan file `demo.html` yang sudah disediakan

### 🎯 **Expected Behavior:**

#### **Tombol Edit:**
- Klik → Form berubah ke mode edit
- Data task ter-load ke form
- Button text berubah ke "Update Aktivitas"
- Tombol "Batal" muncul

#### **Tombol Hapus:**
- Klik → Konfirmasi dialog muncul
- Klik "OK" → Task terhapus
- Timeline ter-refresh
- Notification "berhasil dihapus" muncul 