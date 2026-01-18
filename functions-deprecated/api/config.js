export async function onRequest(context) {
  const { env } = context;

  const config = {
    // EmailJS Configuration
    emailjsPublicKey: env.EMAILJS_PUBLIC_KEY || null,
    serviceId: env.EMAILJS_SERVICE_ID || null,
    templateAdmin: env.EMAILJS_TEMPLATE_ADMIN || null,
    templateCustomer: env.EMAILJS_TEMPLATE_CUSTOMER || null,
    
    // Contact Information
    whatsappNumber: env.WHATSAPP_NUMBER || '923268502690',
    supportEmail: env.SUPPORT_EMAIL || 'alfmart.store@gmail.com',
    supportPhone: env.SUPPORT_PHONE || '03268502690',
    
    // Bank Details
    bank: {
      name: env.BANK_NAME || 'Meezan Bank',
      accountTitle: env.BANK_ACCOUNT_TITLE || 'MUHAMMAD AHMAD',
      accountNumber: env.BANK_ACCOUNT_NUMBER || '02780113523044',
      iban: env.BANK_IBAN || 'PK98MEZN0002780113523044',
      branch: env.BANK_BRANCH || 'Avian Chowk Br Lahore'
    },
    
    // Supabase Configuration
    supabaseUrl: env.SUPABASE_URL || null,
    supabaseAnonKey: env.SUPABASE_ANON_KEY || null
  };

  return new Response(JSON.stringify(config), {
    headers: { 'Content-Type': 'application/json' }
  });
}