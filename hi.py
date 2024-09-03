import requests

url = 'https://us-central1-payday-8ab25.cloudfunctions.net/appLinkCaller'
data = {'updateCount': True}
response = requests.post(url, json=data)

print(response.status_code)
print(response.json())
