# 🧪 Testing Guide - Flipbook Viewer

## Browser sudah terbuka di: http://localhost:5173

## 📋 Complete Testing Checklist

### 🚀 Initial Setup

- [ ] 1. Browser menampilkan header "Flipbook Viewer"
- [ ] 2. Tombol "Load Sample" terlihat
- [ ] 3. Area upload file terlihat di tengah

---

## Phase 2: Basic Flipbook Features

### ✅ Load Sample Data

1. **Klik tombol "Load Sample"** di header
   - Expected: 12 halaman sample dengan warna berbeda muncul
   - Expected: Flipbook viewer tampil dengan toolbar

### ✅ Navigation Controls

2. **Test Previous/Next Buttons**
   - Klik "Next" button (→)
   - Expected: Page berubah ke halaman 2
   - Expected: Page counter shows "2 / 12"
   - Klik "Previous" button (←)
   - Expected: Kembali ke halaman 1
   - Expected: Previous button disabled di page 1
   - Expected: Next button disabled di page 12

### ✅ Keyboard Navigation

3. **Test Arrow Keys**
   - Press → (Right Arrow)
   - Expected: Next page
   - Press ← (Left Arrow)
   - Expected: Previous page
   - Press Space
   - Expected: Next page
   - Press ↓ (Down Arrow)
   - Expected: Next page
   - Press ↑ (Up Arrow)
   - Expected: Previous page

### ✅ Page Flipping

4. **Test Click/Drag Flip**
   - Klik kanan buku untuk flip ke next
   - Atau drag corner halaman
   - Expected: Smooth flip animation
   - Expected: Shadow effect terlihat

### ✅ Thumbnails

5. **Test Thumbnail Navigation**
   - Scroll thumbnail bar di bawah
   - Klik thumbnail halaman 5
   - Expected: Jump ke page 5
   - Expected: Thumbnail auto-scroll ke active page
   - Expected: Active thumbnail memiliki blue ring

### ✅ Responsive Design

6. **Test Window Resize**
   - Resize browser window (lebih kecil)
   - Expected: Flipbook adjust size otomatis
   - Resize browser window (lebih besar)
   - Expected: Flipbook scale up (max size)

---

## Phase 3: Advanced Viewer Features

### ✅ Zoom Controls

7. **Test Zoom In**

   - Klik tombol **[+]** di toolbar
   - Expected: Buku zoom in 25%
   - Expected: Percentage berubah ke "125%"
   - Klik lagi sampai max
   - Expected: Max 200%, tombol + disabled

8. **Test Zoom Out**

   - Klik tombol **[-]** di toolbar
   - Expected: Buku zoom out 25%
   - Expected: Percentage berubah
   - Klik sampai minimum
   - Expected: Min 50%, tombol - disabled

9. **Test Zoom Reset**
   - Zoom in/out dulu
   - Klik **percentage number** (misal "150%")
   - Expected: Reset ke 100%

### ✅ Auto-Flip Feature

10. **Test Auto-Flip Play**

    - Klik tombol **Play** (▶️)
    - Expected: Pages flip otomatis setiap 2 detik
    - Expected: Icon berubah ke Pause (⏸)
    - Expected: Speed dropdown muncul

11. **Test Auto-Flip Speed**

    - Saat playing, pilih **"Slow"** dari dropdown
    - Expected: Flip setiap 3 detik
    - Pilih **"Fast"**
    - Expected: Flip setiap 1 detik
    - Pilih **"Normal"**
    - Expected: Flip setiap 2 detik

12. **Test Auto-Flip Stop**

    - Klik tombol **Pause**
    - Expected: Auto-flip berhenti
    - Expected: Icon berubah ke Play
    - Expected: Speed dropdown hilang

13. **Test Auto-Flip End Behavior**
    - Start auto-flip di page 1
    - Tunggu sampai page terakhir (12)
    - Expected: Auto-flip stop otomatis
    - Expected: Tetap di page 12

### ✅ Fullscreen Mode

14. **Test Enter Fullscreen**

    - Klik tombol **Fullscreen** (⛶) di kanan atas
    - Expected: Browser masuk fullscreen
    - Expected: Thumbnails HILANG
    - Expected: Background berubah dark (gray-900)
    - Expected: Icon berubah (exit fullscreen icon)

15. **Test Exit Fullscreen**
    - Press **ESC** key
    - Expected: Keluar dari fullscreen
    - Expected: Thumbnails muncul kembali
    - Expected: Background normal
    - Atau klik tombol exit fullscreen
    - Expected: Same behavior

### ✅ Spread Toggle

16. **Test Spread View Toggle**
    - Klik tombol **Spread** (icon 1 page / 2 pages)
    - Expected: Icon toggle antara single/double
    - Expected: State berubah di store
    - Note: Visual double-page belum implemented (placeholder)

### ✅ Combined Features

17. **Test Zoom + Fullscreen**

    - Zoom in ke 150%
    - Enter fullscreen
    - Expected: Zoom tetap 150%
    - Expected: Scrollable jika zoom besar

18. **Test Auto-flip + Navigation**

    - Start auto-flip
    - Klik thumbnail atau prev/next
    - Expected: Auto-flip tetap jalan
    - Expected: Navigate dari clicked page

19. **Test Keyboard + All Features**
    - Enable auto-flip
    - Zoom in
    - Press arrow keys
    - Expected: All works together

---

## 🎨 Visual Checks

### UI/UX Elements

- [ ] All buttons have hover effects (bg-gray-50)
- [ ] Disabled buttons opacity 50%
- [ ] Icons clear and visible
- [ ] No layout shifts
- [ ] Smooth transitions
- [ ] No console errors

### Toolbar Layout

```
Left side:  [─] [100%] [+]  [📄]
            Zoom controls   Spread

Right side: [▶️] [Speed▼] [⛶]
            Auto-flip    Fullscreen
```

### Colors & Spacing

- [ ] White toolbar background
- [ ] Gray borders (border-gray-300)
- [ ] Proper spacing (gap-2)
- [ ] Blue active states
- [ ] Consistent button sizes

---

## 🐛 Error Checking

### Console

1. Open Browser DevTools (F12)
2. Check Console tab
   - [ ] No red errors
   - [ ] No warnings (acceptable: dev warnings)

### Network

1. Check Network tab
   - [ ] No failed requests
   - [ ] SVG images load properly

### Performance

1. Check Performance
   - [ ] Flip animation smooth (60fps)
   - [ ] No janky scrolling
   - [ ] Zoom transition smooth

---

## 📱 Responsive Testing

### Desktop Sizes

- [ ] 1920x1080 (Full HD)
- [ ] 1366x768 (Laptop)
- [ ] 1024x768 (Tablet landscape)

### Tablet

- [ ] 768x1024 (iPad portrait)
- [ ] Touch events work
- [ ] Thumbnails scrollable

### Mobile (if accessible)

- [ ] 375x667 (iPhone SE)
- [ ] Controls still accessible
- [ ] Zoom works on mobile

---

## ✨ Success Criteria

### Must Pass ✅

- [x] Load sample works
- [x] Navigation (buttons + keyboard)
- [x] Page flipping animation
- [x] Thumbnails navigation
- [x] Zoom in/out/reset
- [x] Auto-flip with speed control
- [x] Fullscreen toggle
- [x] No console errors
- [x] Responsive design

### Nice to Have ⭐

- [ ] Smooth 60fps animations
- [ ] Fast page transitions
- [ ] Touch gestures (mobile)
- [ ] Pinch to zoom (mobile)

---

## 🎯 Final Verification

After testing all features above:

1. **Overall Experience**

   - [ ] Feels professional
   - [ ] Intuitive to use
   - [ ] No bugs encountered
   - [ ] Performance is good

2. **Production Ready?**
   - [ ] All core features work
   - [ ] No blocking issues
   - [ ] User-friendly
   - [ ] Meets requirements

---

## 📊 Test Results Summary

Fill this after testing:

```
✅ Passed: ___ / 19 tests
⚠️  Warnings: ___
❌ Failed: ___

Total Features Tested:
- Phase 2: 6 features
- Phase 3: 4 features
- Combined: 3 scenarios
```

---

## 🚨 Report Issues

If you find any issues, note:

1. What feature?
2. What did you do?
3. What happened?
4. What should happen?
5. Browser console errors?

---

**Happy Testing! 🎉**

Start with "Load Sample" button and go through each feature systematically!
