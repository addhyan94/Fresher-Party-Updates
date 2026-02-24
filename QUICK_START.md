# 🎉 FRESHERS & FAREWELL PARTY 2026 - Quick Start

## 🚀 Your Event Is Ready!

### ✅ What's Been Set Up:

1. **Google Drive Photo Gallery** ✓
   - Folder ID: `16F0vXhupp_Fa_d9xVFv6vGeGFcMdMmbH`
   - Already configured and ready to display photos!

2. **Admin Password** ✓
   - Password: `opencrd1`
   - Access admin panel at: `YOUR_URL/admin`

3. **Event Date** ✓
   - February 25, 2026 at 10:00 PM
   - Real-time countdown is active!

---

## 🎯 How to Use (3 Simple Steps)

### Step 1: Add Guests (Admin Panel)
1. Go to `/admin`
2. Login with password: `opencrd1`
3. Add guest emails one by one
4. Click "Add Guest" for each

### Step 2: Share Link with Guests
Send your event URL to guests who were added to the list

### Step 3: Approve Guests in Real-Time
1. When guests enter their email, they see "Waiting for Approval"
2. In admin panel, click "Approve Entry"
3. Their screen automatically transforms! 🎉
4. Music starts playing automatically!

---

## 🎨 Design Features

- **Vibrant Gradients**: Purple → Pink → Cyan
- **30+ Animated Confetti Particles**
- **Glowing Effects & Smooth Transitions**
- **Mobile Responsive**
- **Auto-playing Music on Approval**

---

## 📸 Photo Gallery

Your Google Drive folder is already connected!
- Photos appear automatically when uploaded
- No manual refresh needed
- Works for all guests simultaneously

**Current Folder**: `16F0vXhupp_Fa_d9xVFv6vGeGFcMdMmbH`

To change folder:
1. Get new folder ID from Google Drive URL
2. Update in `/src/app/components/InvitationPage.tsx`
3. Search for `16F0vXhupp_Fa_d9xVFv6vGeGFcMdMmbH` and replace

---

## 🔐 Security

**Admin Password**: `opencrd1`

To change password:
1. Edit `/supabase/functions/server/index.tsx` (3 locations)
2. Edit `/src/app/components/AdminPanel.tsx` (3 locations)
3. Find `opencrd1` and replace with new password

---

## 🎵 Music

Currently using: Free sample music

To change music:
1. Find your music URL (must be .mp3)
2. Edit `/src/app/components/InvitationPage.tsx`
3. Update the `<source src="..." />` tag

**Recommended**: Use royalty-free music from Bensound or Incompetech

---

## ⏰ Event Countdown

**Set to**: February 25, 2026 at 10:00 PM

To change date:
1. Edit `/src/app/components/InvitationPage.tsx`
2. Find: `const EVENT_DATE = new Date('2026-02-25T22:00:00');`
3. Change to your date/time

---

## 🧪 Test It Now!

1. Go to `/admin` → Login → Add `test@example.com`
2. Go to main page → Enter `test@example.com`
3. See "Waiting for Approval" screen
4. Go back to admin → Click "Approve Entry"
5. **BOOM!** Watch the magic happen! 🎊

---

## 📱 Works On All Devices

✅ Desktop  
✅ Tablet  
✅ Mobile  
✅ iOS  
✅ Android  

---

## 🆘 Need Help?

**Common Issues:**

**Q: Photos not showing?**  
A: Make sure Google Drive folder is set to "Anyone with the link can view"

**Q: Music not playing?**  
A: Browsers block auto-play. Guest can click "Play Music" button

**Q: Guest not getting approved?**  
A: Wait 3-5 seconds after clicking "Approve Entry" for auto-update

---

## 🎊 You're All Set!

Everything is configured and ready to go:
- ✓ Vibrant fresher party design
- ✓ Google Drive connected
- ✓ Admin password set
- ✓ Real-time approval system
- ✓ Countdown timer active
- ✓ Background music ready

**Now go make this the BEST FRESHERS PARTY EVER!** 🚀🎉

---

**Admin URL**: `YOUR_URL/admin`  
**Password**: `opencrd1`  
**Event Date**: February 25, 2026 • 10:00 PM

🎓 Let's make college memories that last forever! 💫
