# 🚀 Sentence Builder - Setup & Installation Guide

## Prerequisites
- Node.js 16+ installed
- npm or yarn package manager
- Modern browser (Chrome, Edge, Safari, Firefox)

## 📦 Installation Steps

### 1. Install Dependencies
```bash
# Navigate to project directory
cd "/mnt/c/Users/Destiny/iCloudDrive/Documents/AI Tools/Anthropic Solution/Projects/sentence-builder"

# Install all packages
npm install
```

### 2. Start the Application

#### Option A: Development Mode (for testing)
```bash
npm run dev
```
- Opens at: http://localhost:5173
- Use this for: Testing, making changes, debugging

#### Option B: Production Build (for deployment)
```bash
# Build optimized version
npm run build

# Preview production build locally
npm run preview
```
- Creates files in: `dist/` folder
- Use this for: Final deployment, performance testing

## 🔍 Key Differences

### `npm run dev` - Development Mode 🛠️
**What it does:**
- Starts a local development server
- Watches files for changes
- Instantly updates when you save files (Hot Module Replacement)
- Shows detailed error messages for debugging

**Best for:**
- Testing features locally
- Making code changes
- Debugging issues
- Development workflow

**Characteristics:**
- ✅ Fast startup (~3 seconds)
- ✅ Live reload on changes
- ✅ Source maps for debugging
- ❌ Not optimized (larger files)
- ❌ Not suitable for production

### `npm run build` - Production Mode 📦
**What it does:**
- Creates optimized, minified files
- Bundles all code efficiently
- Enables PWA features (offline mode)
- Tree-shakes unused code

**Best for:**
- Deploying to web server
- Testing real performance
- Sharing with users
- App store deployment

**Characteristics:**
- ✅ Optimized performance
- ✅ Smaller file sizes (70% reduction)
- ✅ PWA features enabled
- ✅ Ready for deployment
- ❌ Takes longer to build (~30 seconds)
- ❌ No live reload

## 📱 Testing on iPad/iPhone

### Method 1: Local Network (Recommended)
```bash
# Start dev server with network access
npm run dev -- --host

# You'll see:
# ➜  Local:   http://localhost:5173/
# ➜  Network: http://192.168.x.x:5173/  ← Use this on devices
```

1. Ensure devices are on same WiFi
2. Open Safari on iPad/iPhone
3. Enter the Network URL
4. Add to Home Screen for app-like experience

### Method 2: Using Tunnel (Remote Access)
```bash
# Install tunneling tool
npm install -g localtunnel

# Start dev server
npm run dev

# In new terminal, create tunnel
lt --port 5173

# Use provided URL on any device
```

## ✅ Quick Test Checklist

After running `npm run dev`:

1. **Basic Functionality**
   - [ ] Component loads properly
   - [ ] Word selection works
   - [ ] Sentence validation functions

2. **PWA Features**
   - [ ] Install prompt appears
   - [ ] Works offline after caching
   - [ ] Home screen icon works

3. **Mobile Testing**
   - [ ] Touch interactions smooth
   - [ ] Haptic feedback works (iOS)
   - [ ] Responsive layout adapts

## 🔧 Common Issues & Solutions

### Port Already in Use
```bash
# Use different port
npm run dev -- --port 3000
```

### Module Not Found
```bash
# Clear and reinstall
rm -rf node_modules package-lock.json
npm install
```

### Can't Access from Mobile
- Check firewall settings
- Ensure same WiFi network
- Use Network URL, not localhost
- Try disabling VPN

## 🚀 Next Steps

1. **For Development:**
   ```bash
   npm run dev
   # Make changes, test features
   ```

2. **For iPad Deployment:**
   ```bash
   npm run build
   npm run preview
   # Access from iPad and "Add to Home Screen"
   ```

3. **For Production:**
   ```bash
   npm run build
   # Deploy dist/ folder to hosting service
   ```

## 📊 Performance Comparison

| Aspect | Development | Production |
|--------|------------|------------|
| **Startup Time** | ~3 seconds | ~30 seconds (build) |
| **File Size** | ~10-15 MB | ~2-3 MB |
| **Load Speed** | Slower | 3x faster |
| **Features** | All enabled | All optimized |
| **Debugging** | Full source maps | Minimal |
| **Caching** | None | Full PWA |

## 💡 Tips

- Always test in production mode before deployment
- Use development mode for rapid iteration
- Test on actual devices, not just browser
- Clear cache when testing PWA features

Ready to start? Run `npm install` then `npm run dev`! 🎉