@echo off
setlocal enabledelayedexpansion

set OUTPUT=csfiles.txt

if exist %OUTPUT% del %OUTPUT%

for /r %%F in (*.cs) do (
    echo --- %%~nxF --- >> %OUTPUT%
    type "%%F" >> %OUTPUT%
    echo. >> %OUTPUT%
)

echo Done! Result saved to %OUTPUT%