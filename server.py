import http.server
import socketserver
import json
import sqlite3
import os
import time

PORT = 8081
typing_status = {}

def init_db():
    conn = sqlite3.connect('chatty.db')
    c = conn.cursor()
    
    c.execute('''CREATE TABLE IF NOT EXISTS users (id INTEGER PRIMARY KEY AUTOINCREMENT, username TEXT UNIQUE, password TEXT, role TEXT DEFAULT 'user')''')
    c.execute('''CREATE TABLE IF NOT EXISTS groups (id INTEGER PRIMARY KEY AUTOINCREMENT, name TEXT, created_by INTEGER)''')
    c.execute('''CREATE TABLE IF NOT EXISTS group_members (group_id INTEGER, user_id INTEGER, FOREIGN KEY(group_id) REFERENCES groups(id), FOREIGN KEY(user_id) REFERENCES users(id))''')
    c.execute('''CREATE TABLE IF NOT EXISTS messages (
                    id INTEGER PRIMARY KEY AUTOINCREMENT,
                    sender_id INTEGER,
                    receiver_id INTEGER,
                    group_id INTEGER,
                    content TEXT,
                    timestamp DATETIME DEFAULT CURRENT_TIMESTAMP
                )''')
    c.execute('''CREATE TABLE IF NOT EXISTS reactions (
                    id INTEGER PRIMARY KEY AUTOINCREMENT,
                    message_id INTEGER,
                    user_id INTEGER,
                    emoji TEXT,
                    UNIQUE(message_id, user_id, emoji)
                )''')
    
    c.execute('''CREATE TABLE IF NOT EXISTS deleted_messages (message_id INTEGER, user_id INTEGER)''')
    c.execute('''CREATE TABLE IF NOT EXISTS notifications (id INTEGER PRIMARY KEY AUTOINCREMENT, content TEXT, timestamp DATETIME DEFAULT CURRENT_TIMESTAMP)''')
    
    # Disappearing Settings
    c.execute('''CREATE TABLE IF NOT EXISTS disappearing_settings (
                    id INTEGER PRIMARY KEY AUTOINCREMENT,
                    user_id_1 INTEGER, user_id_2 INTEGER, group_id INTEGER, 
                    duration INTEGER DEFAULT 0)''')
    
    try: c.execute("ALTER TABLE messages ADD COLUMN is_deleted_everyone INTEGER DEFAULT 0")
    except sqlite3.OperationalError: pass
    
    try: c.execute("ALTER TABLE messages ADD COLUMN is_media INTEGER DEFAULT 0")
    except sqlite3.OperationalError: pass

    try: c.execute("ALTER TABLE messages ADD COLUMN expires_at DATETIME")
    except sqlite3.OperationalError: pass
    
    try: c.execute("INSERT INTO users (username, password, role) VALUES ('admin', 'admin', 'admin')")
    except sqlite3.IntegrityError: pass
        
    conn.commit()
    conn.close()

class ChattyRequestHandler(http.server.SimpleHTTPRequestHandler):
    
    def set_headers(self, status_code=200):
        self.send_response(status_code)
        self.send_header('Content-type', 'application/json')
        self.send_header('Access-Control-Allow-Origin', '*')
        self.end_headers()

    def do_POST(self):
        try:
            length = int(self.headers.get('Content-Length', 0))
            data = json.loads(self.rfile.read(length)) if length > 0 else {}
        except: data = {}

        if self.path == '/api/admin/create_user':
            admin_id, new_username, new_password = data.get('admin_id'), data.get('username'), data.get('password')
            conn = sqlite3.connect('chatty.db')
            c = conn.cursor()
            c.execute('SELECT role FROM users WHERE id = ?', (admin_id,))
            user_role = c.fetchone()
            if not user_role or user_role[0] != 'admin':
                self.set_headers(403); self.wfile.write(b'{"error": "Unauthorized"}')
                conn.close(); return
            try:
                c.execute('INSERT INTO users (username, password, role) VALUES (?, ?, ?)', (new_username, new_password, 'user'))
                conn.commit()
                self.set_headers(200); self.wfile.write(json.dumps({'success': True, 'message': f"Created {new_username}"}).encode())
            except:
                self.set_headers(400); self.wfile.write(b'{"error": "Username exists"}')
            finally: conn.close()

        elif self.path == '/api/login':
            username, password = data.get('username'), data.get('password')
            conn = sqlite3.connect('chatty.db')
            c = conn.cursor()
            c.execute('SELECT id, username, role FROM users WHERE username = ? AND password = ?', (username, password))
            user = c.fetchone()
            conn.close()
            if user:
                self.set_headers(200); self.wfile.write(json.dumps({'success': True, 'user_id': user[0], 'username': user[1], 'role': user[2]}).encode())
            else:
                self.set_headers(401); self.wfile.write(b'{"error": "Invalid"}')

        elif self.path == '/api/messages':
            sender_id, receiver_id, group_id, content = data.get('sender_id'), data.get('receiver_id'), data.get('group_id'), data.get('content')
            is_media = 1 if data.get('is_media') else 0
            conn = sqlite3.connect('chatty.db'); c = conn.cursor()
            c.execute('INSERT INTO messages (sender_id, receiver_id, group_id, content, is_media) VALUES (?, ?, ?, ?, ?)', (sender_id, receiver_id, group_id, content, is_media))
            conn.commit(); conn.close()
            self.set_headers(200); self.wfile.write(b'{"success": true}')

        elif self.path == '/api/messages/delete':
            msg_id, user_id, everyone = data.get('message_id'), data.get('user_id'), data.get('everyone')
            conn = sqlite3.connect('chatty.db'); c = conn.cursor()
            if everyone:
                c.execute('UPDATE messages SET is_deleted_everyone=1, content="[This message was deleted]", is_media=0 WHERE id=? AND sender_id=?', (msg_id, user_id))
            else:
                c.execute('INSERT INTO deleted_messages (message_id, user_id) VALUES (?, ?)', (msg_id, user_id))
            conn.commit(); conn.close()
            self.set_headers(200); self.wfile.write(b'{"success": true}')

        elif self.path == '/api/messages/clear':
            user_id = data.get('user_id')
            other_user_id = data.get('other_user_id')
            group_id = data.get('group_id')
            conn = sqlite3.connect('chatty.db'); c = conn.cursor()
            if other_user_id:
                c.execute('''INSERT INTO deleted_messages (message_id, user_id)
                             SELECT id, ? FROM messages 
                             WHERE (sender_id=? AND receiver_id=?) OR (sender_id=? AND receiver_id=?)''', (user_id, user_id, other_user_id, other_user_id, user_id))
            elif group_id:
                c.execute('''INSERT INTO deleted_messages (message_id, user_id)
                             SELECT id, ? FROM messages WHERE group_id=?''', (user_id, group_id))
            conn.commit(); conn.close()
            self.set_headers(200); self.wfile.write(b'{"success": true}')

        elif self.path == '/api/groups/delete':
            group_id = data.get('group_id')
            user_id = data.get('user_id')
            conn = sqlite3.connect('chatty.db'); c = conn.cursor()
            c.execute('SELECT created_by FROM groups WHERE id=?', (group_id,))
            row = c.fetchone()
            if row and row[0] == user_id:
                c.execute('DELETE FROM groups WHERE id=?', (group_id,))
                c.execute('DELETE FROM group_members WHERE group_id=?', (group_id,))
                c.execute('DELETE FROM messages WHERE group_id=?', (group_id,))
                conn.commit()
                self.set_headers(200); self.wfile.write(b'{"success": true}')
            else:
                self.set_headers(403); self.wfile.write(b'{"error": "Unauthorized or not owner"}')
            conn.close()

        elif self.path == '/api/typing':
            typing_status[(data.get('sender_id'), data.get('receiver_id'), data.get('group_id'))] = time.time()
            self.set_headers(200); self.wfile.write(b'{"success": true}')

        elif self.path == '/api/groups':
            name, creator, members = data.get('name'), data.get('creator_id'), data.get('members', [])
            conn = sqlite3.connect('chatty.db')
            c = conn.cursor()
            c.execute('INSERT INTO groups (name, created_by) VALUES (?, ?)', (name, creator))
            group_id = c.lastrowid
            for m in list(set(members + [creator])):
                c.execute('INSERT INTO group_members (group_id, user_id) VALUES (?, ?)', (group_id, m))
            conn.commit(); conn.close()
            self.set_headers(200); self.wfile.write(b'{"success": true}')

        elif self.path == '/api/reactions':
            msg_id, user_id, emoji = data.get('message_id'), data.get('user_id'), data.get('emoji')
            conn = sqlite3.connect('chatty.db')
            c = conn.cursor()
            try: c.execute('INSERT INTO reactions (message_id, user_id, emoji) VALUES (?, ?, ?)', (msg_id, user_id, emoji)); conn.commit()
            except sqlite3.IntegrityError: pass
            conn.close()
            self.set_headers(200); self.wfile.write(b'{"success": true}')
            
        elif self.path == '/api/reactions/delete':
            msg_id, user_id, emoji = data.get('message_id'), data.get('user_id'), data.get('emoji')
            conn = sqlite3.connect('chatty.db')
            c = conn.cursor()
            c.execute('DELETE FROM reactions WHERE message_id=? AND user_id=? AND emoji=?', (msg_id, user_id, emoji))
            conn.commit(); conn.close()
            self.set_headers(200); self.wfile.write(b'{"success": true}')
            
        elif self.path == '/api/notifications':
            admin_id, content = data.get('admin_id'), data.get('content')
            conn = sqlite3.connect('chatty.db')
            c = conn.cursor()
            c.execute('SELECT role FROM users WHERE id=?', (admin_id,))
            if c.fetchone()[0] == 'admin':
                c.execute('INSERT INTO notifications (content) VALUES (?)', (content,))
                conn.commit(); self.set_headers(200); self.wfile.write(b'{"success": true}')
            else:
                self.set_headers(403); self.wfile.write(b'{"error": "Unauthorized"}')
            conn.close()
        else:
            self.set_headers(404); self.wfile.write(b'{"error": "Not found"}')

    def do_GET(self):
        import urllib.parse
        parsed = urllib.parse.urlparse(self.path)
        query = urllib.parse.parse_qs(parsed.query)
        path = parsed.path

        if path == '/api/chats':
            user_id = query.get('user_id', [None])[0]
            if not user_id: return super().do_GET()
            conn = sqlite3.connect('chatty.db'); c = conn.cursor()
            c.execute("SELECT id, username FROM users WHERE role != 'admin' AND id != ?", (user_id,))
            users = [{'id': r[0], 'name': r[1], 'type': 'user'} for r in c.fetchall()]
            c.execute("SELECT g.id, g.name, g.created_by FROM groups g JOIN group_members gm ON g.id = gm.group_id WHERE gm.user_id = ?", (user_id,))
            groups = [{'id': r[0], 'name': r[1], 'type': 'group', 'created_by': r[2]} for r in c.fetchall()]
            conn.close()
            self.set_headers(200); self.wfile.write(json.dumps({'chats': users + groups}).encode())

        elif path == '/api/admin/metrics':
            admin_id = query.get('admin_id', [None])[0]
            conn = sqlite3.connect('chatty.db'); c = conn.cursor()
            c.execute('SELECT role FROM users WHERE id=?', (admin_id,))
            role = c.fetchone()
            if role and role[0] == 'admin':
                c.execute('SELECT COUNT(*) FROM users')
                u_count = c.fetchone()[0]
                c.execute('SELECT COUNT(*) FROM groups')
                g_count = c.fetchone()[0]
                c.execute('SELECT COUNT(*) FROM messages')
                m_count = c.fetchone()[0]
                conn.close()
                self.set_headers(200); self.wfile.write(json.dumps({'users': u_count, 'groups': g_count, 'messages': m_count, 'recent_messages': []}).encode())
            else:
                conn.close(); self.set_headers(403); self.wfile.write(b'{"error": "Unauthorized"}')

        elif path == '/api/state':
            user_id, other_user_id, group_id = query.get('user_id', [None])[0], query.get('other_user_id', [None])[0], query.get('group_id', [None])[0]
            if not user_id:
                self.set_headers(400); self.wfile.write(b'{"error": "user_id required"}'); return
                
            conn = sqlite3.connect('chatty.db'); c = conn.cursor()
            msgs = []
            if other_user_id and other_user_id != 'null':
                c.execute('''SELECT m.id, m.sender_id, m.content, m.timestamp, u.username, m.is_media
                             FROM messages m JOIN users u ON m.sender_id = u.id
                             LEFT JOIN deleted_messages dm ON m.id = dm.message_id AND dm.user_id = ?
                             WHERE dm.message_id IS NULL AND ((m.sender_id = ? AND m.receiver_id = ?) OR (m.sender_id = ? AND m.receiver_id = ?))
                             ORDER BY m.timestamp ASC''', (user_id, user_id, other_user_id, other_user_id, user_id))
                msgs = c.fetchall()
            elif group_id and group_id != 'null':
                c.execute('''SELECT m.id, m.sender_id, m.content, m.timestamp, u.username, m.is_media
                             FROM messages m JOIN users u ON m.sender_id = u.id
                             LEFT JOIN deleted_messages dm ON m.id = dm.message_id AND dm.user_id = ?
                             WHERE dm.message_id IS NULL AND m.group_id = ? ORDER BY m.timestamp ASC''', (user_id, group_id))
                msgs = c.fetchall()
            
            msg_ids = [str(r[0]) for r in msgs]
            reactions_dict = {}
            if msg_ids:
                c.execute(f"SELECT message_id, emoji, COUNT(*), GROUP_CONCAT(user_id) FROM reactions WHERE message_id IN ({','.join(msg_ids)}) GROUP BY message_id, emoji")
                for r in c.fetchall():
                    if r[0] not in reactions_dict: reactions_dict[r[0]] = []
                    # r[3] contains comma separated user_ids who reacted this emoji
                    reacted_users = str(r[3]).split(',') if r[3] else []
                    reactions_dict[r[0]].append({'emoji': r[1], 'count': r[2], 'has_reacted': str(user_id) in reacted_users})
            
            c.execute('SELECT id, content, timestamp FROM notifications ORDER BY timestamp DESC LIMIT 50')
            notifs = [{'id': r[0], 'content': r[1], 'timestamp': r[2]} for r in c.fetchall()]

            formatted = [{'id': r[0], 'sender_id': r[1], 'content': r[2], 'timestamp': r[3], 'sender_name': r[4], 'is_media': bool(r[5]), 'reactions': reactions_dict.get(r[0], [])} for r in msgs]

            is_typing = []
            curr = time.time()
            for (t_sn, t_rc, t_gr), t_time in list(typing_status.items()):
                if curr - t_time < 3:
                    if (other_user_id and str(t_sn) == str(other_user_id) and str(t_rc) == str(user_id)) or \
                       (group_id and str(t_gr) == str(group_id) and str(t_sn) != str(user_id)):
                        is_typing.append(t_sn)
            
            conn.close()
            self.set_headers(200)
            self.wfile.write(json.dumps({'messages': formatted, 'typing': is_typing, 'notifications': notifs}).encode())
        else:
            super().do_GET()

if __name__ == '__main__':
    init_db()
    os.chdir(os.path.dirname(os.path.abspath(__file__)))
    port = int(os.environ.get("PORT", 8081))
    with socketserver.TCPServer(("0.0.0.0", port), ChattyRequestHandler) as httpd:
        print(f"Serving on 0.0.0.0 port {port}")
        try: httpd.serve_forever()
        except KeyboardInterrupt: httpd.server_close()
