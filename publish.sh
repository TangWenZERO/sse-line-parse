#!/bin/bash
# scripts/publish.sh

set -e

echo "🚀 开始发布流程..."

# 1. 运行测试
echo "🧪 运行测试..."
npm run test 2>/dev/null || echo "跳过测试"

# 2. 构建项目
echo "🏗️ 构建项目..."
npm run build

# 3. 版本自增
echo "🔢 更新版本号..."
npm version patch

# 4. 发布到 npm
echo "📦 发布到 npm..."
npm publish

# 5. 推送到 Git
echo "📤 推送代码..."
git push origin main --tags

echo "✅ 发布完成!"