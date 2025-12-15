# ⚡ Quick GitHub Setup Guide

## 5-Minute Setup Checklist

### Step 1: Create GitHub Repository (2 minutes)

1. Go to: https://github.com/new
2. Repository name: `college-algebra-platform`
3. Visibility: **✅ Public**
4. ❌ Do NOT initialize with README
5. Click "Create repository"

### Step 2: Connect Local Repository (1 minute)

```bash
cd /home/ubuntu/college_algebra_website

# Add remote (replace YOUR_USERNAME)
git remote add origin https://github.com/YOUR_USERNAME/college-algebra-platform.git

# Verify
git remote -v
```

### Step 3: Push Code (1 minute)

```bash
# Stage all files
git add .

# Commit
git commit -m "Initial commit: College Algebra Platform v1.0"

# Push
git push -u origin master
```

### Step 4: Add GitHub Secrets (1 minute)

1. Go to: `Settings → Secrets and variables → Actions`
2. Click: "New repository secret"
3. Add these 4 secrets:

```
Secret 1:
  Name: DATABASE_URL
  Value: [Your production database URL]

Secret 2:
  Name: NEXTAUTH_SECRET
  Value: [Generate with: openssl rand -base64 32]

Secret 3:
  Name: NEXTAUTH_URL
  Value: https://your-production-domain.com

Secret 4:
  Name: NEXT_PUBLIC_APP_URL
  Value: https://your-production-domain.com
```

### Step 5: Enable Actions (30 seconds)

1. Go to "Actions" tab
2. Click "I understand my workflows, go ahead and enable them"
3. Wait for first workflow to run

---

## ✅ Done!

Your repository is now:
- ✅ Public on GitHub
- ✅ CI/CD enabled (automatic testing on every push)
- ✅ Ready for deployment

---

## 📝 Next Steps

1. Update README.md (replace `YOUR_USERNAME` with your GitHub username)
2. Make a test push to verify CI/CD works
3. Deploy to production

---

## 🔗 Important Links

- **Full Setup Guide**: `GITHUB_SETUP_INSTRUCTIONS.md`
- **README**: `README.md`
- **CI/CD Config**: `.github/workflows/ci-cd.yml`

---

## 🎓 CI/CD Pipeline

**What runs automatically on every push:**

1. ✅ Install dependencies
2. ✅ TypeScript type checking
3. ✅ Code linting
4. ✅ Build production bundle
5. ✅ Security audit
6. ✅ Deploy (on main branch only)

**View status**: Go to "Actions" tab on GitHub

---

## 👥 For Team Members

**To contribute:**

```bash
# Clone repository
git clone https://github.com/YOUR_USERNAME/college-algebra-platform.git

# Create feature branch
git checkout -b feature/your-feature

# Make changes, commit, push
git add .
git commit -m "feat: your feature"
git push origin feature/your-feature

# Create Pull Request on GitHub
```

---

## ❓ Troubleshooting

**Workflow fails?**
- Check "Actions" tab for error messages
- Verify all secrets are configured
- Ensure no TypeScript errors: `cd app && yarn tsc`

**Can't push?**
- Check if branch protection is enabled
- Create Pull Request instead of direct push

**Build fails locally?**
```bash
cd app
yarn install
yarn prisma generate
yarn build
```

---

**For detailed instructions, see `GITHUB_SETUP_INSTRUCTIONS.md`**
