# Chatty Application Deployment & Storage Guide

## How Data is Stored
This application uses **SQLite3**, which is deeply integrated directly into Python's standard library. 
Unlike large external databases (like PostgreSQL or MySQL) that require complex installation and separate servers, SQLite writes the entire database into a single, portable local file.

When you run `server.py` for the first time, it automatically creates a file in the directory named **`chatty.db`**.
All system data—including User Credentials, Encrypted Sessions, Messages, Groups, and Reactions—are persistently written to this single `chatty.db` file instantly!

To back up your entire chat history and all user accounts, simply copy/paste the `chatty.db` file.

---

## Deployment Strategy

Because we bypassed modern full-stack dependencies (Node.js/NPM) to get around network restrictions, this application is elegantly standalone. It operates as a full continuous Python thread serving a static Vanilla HTML/JS frontend.

### Option A: Cloud Hosting (Render.com / Railway.app) - *Highly Recommended*

These platforms run Python servers natively and support continuous disks for SQLite:

1. **Create a GitHub Repository:** Push your code (`server.py`, `index.html`, `Procfile`) to GitHub. (Do not push `chatty.db` if you want a clean start).
2. **Deploy as a Web Service:** Create a new "Web Service" linking your repository.
3. **Configurations:**
   - **Build Command:** *(Leave blank)*
   - **Start Command:** `python server.py`
4. **Persistent Disk (Crucial for SQLite):**
   To prevent messages wiping on app restarts, attach a **Persistent Disk/Volume** (e.g. 1GB) and mount it to your project root folder directly on the platform configuration dashboard!

---

### Option B: VPS / Dedicated Server (AWS EC2, DigitalOcean, Company Intranet):

1. **Move Files to the Server:**
   Move `server.py`, `index.html`, and `chatty.db` (if keeping history) to the target machine.

2. **Run in Background:**
   Run the Python server as a background service using `systemd`, `pm2`, `tmux`, or `nohup` so the process survives when you close your SSH terminal session.
   ```bash
   python server.py
   ```
   *The server now binds to `0.0.0.0` and listens on `$PORT` (defaults to 8081) automatically, making it fully ready for global or local Intranet lookups!*

3. **Background Services:**
   Run the Python server as a background service using `systemd` or tools like `pm2`, `tmux`, or `supervisor` so the process doesn't die when you close the SSH terminal.

4. **Security Notice:**
   Since passwords currently are stored as plaintext within `chatty.db` to accommodate the quick zero-dependency prototype, a full production launch should modify `server.py` to include `hashlib.sha256()` hashing before inserting user passwords if high security is required. 

Enjoy your fully modular chat ecosystem!
