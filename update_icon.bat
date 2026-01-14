@echo off
chcp 65001 >nul
echo ==========================================
echo       CouCou App 图标更新工具
echo ==========================================
echo.
echo 请确保您已经将新的图标文件命名为 icon.png
echo 并覆盖了以下位置的文件：
echo %~dp0assets\icon.png
echo.
echo (建议图标尺寸: 1024x1024 像素)
echo.
pause

echo.
echo [1/2] 正在生成安卓图标资源...
call npx @capacitor/assets generate --android
if %ERRORLEVEL% neq 0 (
    echo [错误] 图标生成失败，请检查是否安装了 Node.js 环境。
    pause
    exit /b
)

echo.
echo [2/2] 正在同步到安卓项目...
call npx cap sync
if %ERRORLEVEL% neq 0 (
    echo [错误] 同步失败。
    pause
    exit /b
)

echo.
echo ==========================================
echo ✅ 更新完成！
echo 请打开 Android Studio 重新构建并安装 APP。
echo ==========================================
pause
