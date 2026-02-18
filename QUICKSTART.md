# 🚀 Quick Start Guide

## Get LicenseGuard Running in 3 Steps

### 1. Install Dependencies

```bash
npm install
```

This will install all required packages (Next.js, React, TypeScript, Tailwind CSS).

### 2. Start Development Server

```bash
npm run dev
```

The app will start at [http://localhost:3000](http://localhost:3000)

### 3. Login

Use one of the demo accounts:

**Admin Access:**
- Email: `admin@acmeinsurance.com`
- Password: any password works (demo mode)

**Team Member:**
- Email: `sarah@acmeinsurance.com`
- Password: any password works (demo mode)

---

## 🎯 What to Try First

1. **Dashboard** - See license overview and statistics
2. **Add License** - Click "Add License" to track a new one
3. **Calendar View** - See all renewal dates visually
4. **Team Management** - Add/edit team members (admin only)
5. **Test Notifications** - Go to Calendar → click "Test Notifications"

---

## 🐛 Troubleshooting

### Build Errors

If you see errors about `@next/swc-darwin-arm64` or wasm bindings:

```bash
# Clean install
rm -rf node_modules package-lock.json .next
npm install
npm run dev
```

### Port Already in Use

If port 3000 is taken:

```bash
# Use different port
PORT=3001 npm run dev
```

### TypeScript Errors

If you see TS errors in your editor:

```bash
# Restart TypeScript server in VSCode
Cmd+Shift+P → "TypeScript: Restart TS Server"
```

---

## 📦 Production Build

To test a production build locally:

```bash
npm run build
npm start
```

---

## 💡 Tips

- **Demo Data**: The app initializes with sample licenses and users on first login
- **localStorage**: All data is stored in your browser (clears if you clear browser data)
- **Hot Reload**: Changes to code auto-refresh the page
- **Mobile**: The app is responsive - try it on your phone!

---

## 🎬 Demo Flow for Presentations

1. Start at login → Use quick login button for admin
2. Show dashboard → Point out status indicators
3. Add a license → Fill form, upload document
4. Go to calendar → Show visual renewal tracking
5. Manage team → Add a team member
6. Show pricing → Explain subscription tiers

**Pro tip**: Open browser console (F12) before testing notifications to see the mock emails!

---

## 📞 Need Help?

Check these files:
- `README.md` - Overview and features
- `DEVELOPMENT.md` - Technical deep dive
- `package.json` - All available scripts

**Still stuck?** Make sure you're using Node.js 18+:

```bash
node --version  # Should be v18.0.0 or higher
```

---

**Happy testing! 🛡️**
