import urllib.request, json
try:
    url = 'http://127.0.0.1:8081/api/state?user_id=2&other_user_id=3'
    with urllib.request.urlopen(url) as f:
        print(f.read().decode())
except Exception as e:
    print("Error:", e)
