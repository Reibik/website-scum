@echo off
echo ==========================================
echo   ELON PROJECT | AUTO UPDATER
echo ==========================================

:: 1. Генерируем новую версию (используем дату и время как уникальный ID)
:: Пример: 202310251430 (ГодМесяцДеньЧасМинута)
set "new_ver=%date:~6,4%%date:~3,2%%date:~0,2%%time:~0,2%%time:~3,2%"
:: Убираем пробелы (если час < 10)
set "new_ver=%new_ver: =0%"

echo Updating version to: %new_ver%

:: 2. Записываем новую версию в version.json
echo { "version": "%new_ver%" } > version.json

:: 3. Git команды
git add .
git commit -m "Update site: v%new_ver%"
git push origin main

echo ==========================================
echo   DONE! New version %new_ver% is live.
echo ==========================================
pause