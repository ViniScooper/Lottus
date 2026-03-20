// Use global fetch on Node 22+
async function testAPI() {
  const url = 'https://lottus-fu61.onrender.com';
  const credentials = {
    email: 'admin@lottus.com',
    password: 'lottus2024'
  };

  try {
    console.log('--- Testing remote API at:', url, '---');
    
    // 1. Login
    console.log('Logging in...');
    const loginRes = await fetch(`${url}/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(credentials)
    });

    const loginData = await loginRes.json();
    console.log('Login Status:', loginRes.status);
    
    if (loginRes.status !== 200) {
      console.error('Login failed:', loginData);
      return;
    }

    console.log('Logged in as:', loginData.name);
    const token = loginData.token;

    // 2. Fetch Products
    console.log('Fetching products...');
    const productsRes = await fetch(`${url}/products`);
    const products = await productsRes.json();
    console.log('Products Status:', productsRes.status);
    console.log('Found', Array.isArray(products) ? products.length : 0, 'products.');

    // 3. Test a protected route
    console.log('Testing protected route (/upload - check token valid)...');
    const uploadRes = await fetch(`${url}/upload`, {
      method: 'POST',
      headers: { 
        'Authorization': `Bearer ${token}`
        // No body, we just want to see if it rejects with 401/403 or something else
      }
    });
    // It should probably return 400 (no file) or 401 (invalid auth)
    console.log('Protected Route Status:', uploadRes.status);
    const uploadData = await uploadRes.json();
    console.log('Protected Route Response:', uploadData.error || 'Success');

    console.log('--- Test Complete ---');
  } catch (error) {
    console.error('Critical Error:', error.message);
  }
}

testAPI();
