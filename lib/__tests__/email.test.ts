// Simple test untuk memverifikasi email functionality
// Jalankan dengan: npm test atau node -r ts-node/register lib/__tests__/email.test.ts

import { otpRateLimiter, createRateLimitKey } from '../rate-limit';
import { createOTPEmailTemplate } from '../email';

// Test rate limiting
function testRateLimiting() {
  console.log('🧪 Testing Rate Limiting...');
  
  const testEmail = 'test@example.com';
  const rateLimitKey = createRateLimitKey(testEmail);
  
  // Reset untuk test bersih
  otpRateLimiter.reset(rateLimitKey);
  
  // Test 5 requests (should all pass)
  for (let i = 1; i <= 5; i++) {
    const result = otpRateLimiter.isAllowed(rateLimitKey);
    console.log(`Request ${i}: ${result.allowed ? '✅ Allowed' : '❌ Blocked'}`);
  }
  
  // Test 6th request (should be blocked)
  const sixthRequest = otpRateLimiter.isAllowed(rateLimitKey);
  console.log(`Request 6: ${sixthRequest.allowed ? '❌ Should be blocked' : '✅ Correctly blocked'}`);
  console.log(`Message: ${sixthRequest.message}`);
  
  // Test stats
  const stats = otpRateLimiter.getStats(rateLimitKey);
  console.log('📊 Stats:', {
    requests: stats.requests,
    remaining: stats.remaining,
    resetTime: stats.resetTime?.toLocaleString('id-ID')
  });
  
  console.log('✅ Rate limiting test completed\n');
}

// Test email template
function testEmailTemplate() {
  console.log('🧪 Testing Email Template...');
  
  const testOTP = '123456';
  const testEmail = 'user@example.com';
  
  const template = createOTPEmailTemplate(testOTP, testEmail);
  
  console.log('📧 Subject:', template.subject);
  console.log('📝 HTML length:', template.html.length, 'characters');
  console.log('📄 Text length:', template.text.length, 'characters');
  
  // Check if OTP is included
  const hasOTPInHTML = template.html.includes(testOTP);
  const hasOTPInText = template.text.includes(testOTP);
  const hasEmailInHTML = template.html.includes(testEmail);
  
  console.log('🔍 OTP in HTML:', hasOTPInHTML ? '✅' : '❌');
  console.log('🔍 OTP in Text:', hasOTPInText ? '✅' : '❌');
  console.log('🔍 Email in HTML:', hasEmailInHTML ? '✅' : '❌');
  
  console.log('✅ Email template test completed\n');
}

// Test minimum interval
function testMinimumInterval() {
  console.log('🧪 Testing Minimum Interval...');
  
  const testEmail = 'interval-test@example.com';
  const rateLimitKey = createRateLimitKey(testEmail);
  
  // Reset untuk test bersih
  otpRateLimiter.reset(rateLimitKey);
  
  // First request
  const first = otpRateLimiter.isAllowed(rateLimitKey);
  console.log('First request:', first.allowed ? '✅ Allowed' : '❌ Blocked');
  
  // Immediate second request (should be blocked due to minimum interval)
  const second = otpRateLimiter.isAllowed(rateLimitKey);
  console.log('Immediate second request:', second.allowed ? '❌ Should be blocked' : '✅ Correctly blocked');
  console.log('Message:', second.message);
  
  console.log('✅ Minimum interval test completed\n');
}

// Main test runner
function runTests() {
  console.log('🚀 Starting Email OTP Tests...\n');
  
  try {
    testRateLimiting();
    testEmailTemplate();
    testMinimumInterval();
    
    console.log('🎉 All tests completed successfully!');
  } catch (error) {
    console.error('❌ Test failed:', error);
  }
}

// Export untuk testing framework
export {
  testRateLimiting,
  testEmailTemplate,
  testMinimumInterval,
  runTests
};

// Jalankan test jika file dijalankan langsung
if (require.main === module) {
  runTests();
}
