const fs = require('fs');
const path = require('path');

async function run() {
  try {
    const form = new FormData();
    form.append('title', 'Test Title');
    form.append('description', 'Test Description');
    form.append('price', '10');
    form.append('category', 'Test');
    form.append('level', 'Beginner');

    const tempVideoPath = path.join(__dirname, 'temp.mp4');
    fs.writeFileSync(tempVideoPath, 'dummy video context file text content');
    const blob = new Blob([fs.readFileSync(tempVideoPath)], { type: 'video/mp4' });
    form.append('lessonVideos', blob, 'temp.mp4');

    // mock login logic to get token
    const loginRes = await fetch('http://localhost:5005/api/auth/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email: 'admin@example.com', password: 'password123' })
    }).catch(() => null);

    let token = '';
    if (loginRes && loginRes.ok) {
        const data = await loginRes.json();
        token = data.token;
    } else {
        console.log('Login failed');
    }

    const uploadRes = await fetch('http://localhost:5005/api/courses', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${token}`
      },
      body: form
    });
    const data = await uploadRes.json();

    console.log("Success:", uploadRes.status, data);
  } catch (error) {
    console.error("Error:", error);
  } finally {
    const tempVideoPath = path.join(__dirname, 'temp.mp4');
    if (fs.existsSync(tempVideoPath)) fs.unlinkSync(tempVideoPath);
  }
}

run();
