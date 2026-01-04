# How to Start the Application

## Quick Start Options

You have three ways to start both the Backend and Frontend servers:

### Option 1: Double-Click Batch File (Easiest) ⭐

**File**: `start.bat`

Simply double-click `start.bat` in the Project1 folder. This will:

- Open a new terminal for the Backend server (port 5000)
- Open a new terminal for the Frontend server (port 3000)
- Automatically open http://localhost:3000 in your browser

### Option 2: Command Prompt

**File**: `start-servers.bat`

Open Command Prompt (cmd) and run:

```cmd
start-servers.bat
```

Or navigate to the Project1 folder and double-click `start-servers.bat`

### Option 3: PowerShell (Advanced)

**File**: `start-servers.ps1`

Open PowerShell and run:

```powershell
Set-ExecutionPolicy -ExecutionPolicy Bypass -Scope Process
.\start-servers.ps1
```

---

## Manual Start (If Scripts Don't Work)

### Terminal 1 - Start Backend:

```cmd
cd backend
npm start
```

### Terminal 2 - Start Frontend:

```cmd
cd dr-online
npm start
```

---

## Verify Both Servers Are Running

- **Backend**: http://localhost:5000 (should show "Cannot GET /")
- **Frontend**: http://localhost:3000 (should show the Doctor Online app)

---

## Troubleshooting

### If ports are already in use:

```powershell
# Kill processes on port 5000 and 3000
Get-Process node | Stop-Process -Force

# Then run the batch file again
```

### If npm start fails:

```cmd
# Make sure you're in the correct folder
cd backend
npm install  # Install dependencies if needed
npm start
```

---

## What the Scripts Do

1. **Open two new terminal windows** - One for backend, one for frontend
2. **Navigate to correct directories** - backend/ and dr-online/
3. **Run npm start** - In each directory
4. **Wait for servers to start** - Both will be ready to accept requests

The scripts take care of all the setup automatically!

---

**Recommended**: Use `start.bat` for easiest experience! ⭐
