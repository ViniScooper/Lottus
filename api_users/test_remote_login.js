// Use global fetch on Node 22+
async function testLogin() {
  const url = 'https://lottus-fu61.onrender.com/auth/login';
  const credentials = {
    email: 'admin@lottus.com',
    password: 'lottus2024'
  };

  try {
    console.log('Testing login at:', url);
    const response = await fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(credentials)
    });

    const data = await response.json();
    console.log('Status:', response.status);
    console.log('Response:', JSON.stringify(data, null, 2));
  } catch (error) {
    console.error('Error:', error.message);
  }
}

testLogin();
