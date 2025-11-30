@echo off
echo Starting Frontend Server...
cd client
if not exist node_modules (
    echo Installing dependencies...
    call npm install
)
echo Starting frontend on http://localhost:3000
call npm run dev

