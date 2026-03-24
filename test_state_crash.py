import sqlite3, time, json

user_id = 2
other_user_id = 3
group_id = None

conn = sqlite3.connect('chatty.db')
c = conn.cursor()

msgs = []
try:
    if other_user_id:
        c.execute('''SELECT m.id, m.sender_id, m.content, m.timestamp, u.username, m.is_media
                     FROM messages m JOIN users u ON m.sender_id = u.id
                     LEFT JOIN deleted_messages dm ON m.id = dm.message_id AND dm.user_id = ?
                     WHERE dm.message_id IS NULL AND (m.expires_at IS NULL OR m.expires_at > datetime('now')) AND ((m.sender_id = ? AND m.receiver_id = ?) OR (m.sender_id = ? AND m.receiver_id = ?))
                     ORDER BY m.timestamp ASC''', (user_id, user_id, other_user_id, other_user_id, user_id))
        msgs = c.fetchall()
    
    msg_ids = [str(r[0]) for r in msgs]
    reactions_dict = {}
    if msg_ids:
        c.execute(f"SELECT message_id, emoji, COUNT(*), GROUP_CONCAT(user_id) FROM reactions WHERE message_id IN ({','.join(msg_ids)}) GROUP BY message_id, emoji")
        for r in c.fetchall():
            if r[0] not in reactions_dict: reactions_dict[r[0]] = []
            reacted_users = str(r[3]).split(',') if r[3] else []
            reactions_dict[r[0]].append({'emoji': r[1], 'count': r[2], 'has_reacted': str(user_id) in reacted_users})
    
    c.execute('SELECT id, content, timestamp FROM notifications ORDER BY timestamp DESC LIMIT 50')
    notifs = [{'id': r[0], 'content': r[1], 'timestamp': r[2]} for r in c.fetchall()]
    conn.close()

    print("Fetched messages count:", len(msgs))
    formatted = [{'id': r[0], 'sender_id': r[1], 'content': r[2], 'timestamp': r[3], 'sender_name': r[4], 'is_media': bool(r[5]), 'reactions': reactions_dict.get(r[0], [])} for r in msgs]
    print("Formatted count:", len(formatted))
except Exception as e:
    import traceback
    print("Crash Traceback:")
    traceback.print_exc()
