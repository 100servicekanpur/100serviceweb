// Simple script to validate Clerk environment variables
const publishableKey = process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY;
const secretKey = process.env.CLERK_SECRET_KEY;

console.log('🔍 Validating Clerk Configuration...\n');

console.log('Publishable Key:', publishableKey ? '✅ Found' : '❌ Missing');
console.log('Secret Key:', secretKey ? '✅ Found' : '❌ Missing');

if (publishableKey) {
  console.log('Key starts with:', publishableKey.substring(0, 10) + '...');
  console.log('Key length:', publishableKey.length);
  console.log('Valid format:', publishableKey.startsWith('pk_') ? '✅' : '❌');
}

console.log('\n📋 Next Steps:');
console.log('1. Verify keys at: https://dashboard.clerk.com/last-active?path=api-keys');
console.log('2. Make sure to copy the FULL key');
console.log('3. For deployment, set environment variables in your hosting platform');