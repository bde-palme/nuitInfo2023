import requests
import json

# API URL
url = "http://127.0.0.1:8000/joinTeam/Palm'/Qi5q70HlPNvH"

user = """{
    "name": "Doe",
    "first_name": "John",
    "pmr": true,
    "course": false,
    "teacher": [
        "Jane Smith",
        "Bob Johnson"
    ],
    "timestamp": "2023-10-09T14:30:00Z",
    "email": "john.doe@example.com",
    "nickname": "Johnny",
    "phone": "123-456-7890",
    "study": "Computer Science",
    "comment": "Excited to join the course!"
}"""

# Send POST request
response = requests.post(url, data=user, headers={"Content-Type": "application/json"})
print(response.text)