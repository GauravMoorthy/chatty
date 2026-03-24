import sqlite3
conn = sqlite3.connect('chatty.db')
c = conn.cursor()
c.execute("SELECT id, username FROM users")
print("Users:", c.fetchall())
conn.close()
