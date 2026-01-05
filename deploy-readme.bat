@echo off
REM Deploy README to gh-pages instead of React build
REM This shows the project README on GitHub Pages

setlocal enabledelayedexpansion

echo.
echo ========================================
echo   Doctor Online - Deploy README to GH Pages
echo ========================================
echo.

REM Check if git is installed
git --version >nul 2>&1
if errorlevel 1 (
    echo ERROR: Git is not installed or not in PATH
    pause
    exit /b 1
)

REM Get current directory
set PROJECT_ROOT=%~dp0

cd /d "%PROJECT_ROOT%"

echo [1/3] Staging changes to main branch...
git add -A
git commit -m "Update: Deploy README to GitHub Pages" 2>nul
git push origin main

echo.
echo [2/3] Preparing gh-pages branch with README...

REM Create a temporary gh-pages index.html that displays README
echo Creating index.html to display README...

REM Copy README to a temporary location
if not exist "%PROJECT_ROOT%\.gh-pages-temp" mkdir "%PROJECT_ROOT%\.gh-pages-temp"

REM Create an index.html that will render the README
(
    echo ^<!DOCTYPE html^>
    echo ^<html lang="en"^>
    echo ^<head^>
    echo     ^<meta charset="UTF-8"^>
    echo     ^<meta name="viewport" content="width=device-width, initial-scale=1.0"^>
    echo     ^<title^>Doctor Online - Project Repository^</title^>
    echo     ^<link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/github-markdown-css/5.2.0/github-markdown.min.css"^>
    echo     ^<link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/highlight.js/11.8.0/styles/github.min.css"^>
    echo     ^<script src="https://cdnjs.cloudflare.com/ajax/libs/marked/9.0.0/marked.min.js"^>^</script^>
    echo     ^<script src="https://cdnjs.cloudflare.com/ajax/libs/highlight.js/11.8.0/highlight.min.js"^>^</script^>
    echo     ^<style^>
    echo         body {
    echo             font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Helvetica, Arial, sans-serif;
    echo             padding: 20px;
    echo             background: #f6f8fa;
    echo         }
    echo         .container {
    echo             max-width: 900px;
    echo             margin: 0 auto;
    echo             background: white;
    echo             padding: 40px;
    echo             border-radius: 8px;
    echo             box-shadow: 0 1px 3px rgba(0,0,0,0.1^);
    echo         }
    echo         .markdown-body {
    echo             font-size: 16px;
    echo             line-height: 1.6;
    echo         }
    echo         .header {
    echo             text-align: center;
    echo             border-bottom: 2px solid #0366d6;
    echo             padding-bottom: 20px;
    echo             margin-bottom: 30px;
    echo         }
    echo         .back-link {
    echo             margin-top: 30px;
    echo             text-align: center;
    echo             border-top: 1px solid #eaecef;
    echo             padding-top: 20px;
    echo         }
    echo     ^</style^>
    echo ^</head^>
    echo ^<body^>
    echo     ^<div class="container"^>
    echo         ^<div id="content" class="markdown-body"^>^</div^>
    echo     ^</div^>
    echo     ^<script^>
    echo         fetch('https://raw.githubusercontent.com/Majd-ping/Doctor-Online/main/README.md')
    echo             .then(r =^> r.text())
    echo             .then(text =^> {
    echo                 const html = marked.parse(text);
    echo                 document.getElementById('content').innerHTML = html;
    echo                 document.querySelectorAll('pre code').forEach((el) =^> {
    echo                     hljs.highlightElement(el);
    echo                 });
    echo             })
    echo             .catch(e =^> {
    echo                 document.getElementById('content').innerHTML = '^<h1^>Error^</h1^>^<p^>Failed to load README.md^</p^>';
    echo             });
    echo     ^</script^>
    echo ^</body^>
    echo ^</html^>
) > "%PROJECT_ROOT%\.gh-pages-temp\index.html"

REM Switch to gh-pages branch
git checkout gh-pages

REM Copy the index.html to root
copy "%PROJECT_ROOT%\.gh-pages-temp\index.html" "%PROJECT_ROOT%\index.html"

echo.
echo [3/3] Pushing to gh-pages...

REM Stage and push
git add index.html
git commit -m "Update: Display README on GitHub Pages" 2>nul
git push -f origin gh-pages

REM Switch back to main
git checkout main

REM Clean up temp files
rmdir /s /q "%PROJECT_ROOT%\.gh-pages-temp" 2>nul

echo.
echo ========================================
echo   Deployment Complete!
echo ========================================
echo.
echo Your README is now displayed at:
echo https://majd-ping.github.io/Doctor-Online/
echo.
echo ========================================
echo.
pause
