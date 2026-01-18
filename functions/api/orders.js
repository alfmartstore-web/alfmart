import { createClient } from '@supabase/supabase-js';

const generateOrderNumber = () => {
  const d = new Date();
  const date = d.toISOString().slice(0,10).replace(/-/g,''); // YYYYMMDD
  const rand = Math.floor(1000 + Math.random() * 9000);
  return `AM-${date}-${rand}`;
};

export async function onRequest(context) {
  const { request, env } = context;
  const supabase = createClient(env.SUPABASE_URL, env.SUPABASE_ANON_KEY);

  if (request.method === 'POST') {
    try {
      const { customerDetails, cart, paymentMethod } = await request.json();

      // Input validation from server.js
      if (!customerDetails || !customerDetails.name || !customerDetails.email || !customerDetails.phone || !customerDetails.address || !customerDetails.city) {
        return new Response(JSON.stringify({ success: false, message: 'Missing customer details' }), { status: 400, headers: { 'Content-Type': 'application/json' } });
      }
      if (!Array.isArray(cart) || cart.length === 0) {
        return new Response(JSON.stringify({ success: false, message: 'Cart is empty' }), { status: 400, headers: { 'Content-Type': 'application/json' } });
      }

      const orderNumber = generateOrderNumber();
      // Correct total calculation from server.js
      const total = cart.reduce((sum, item) => sum + (item.price || 0) * (item.quantity || 1), 0);

      const order = {
        id: orderNumber,
        order_number: orderNumber,
        customer: customerDetails,
        items: cart,
        payment_method: paymentMethod || 'cod',
        total_cents: total,
        status: 'pending',
        created_at: new Date().toISOString()
      };

      const { error } = await supabase.from('orders').insert(order);
      if (error) {
        console.error('Supabase insert error:', error);
        throw error;
      }

      return new Response(JSON.stringify({ success: true, orderId: orderNumber, message: 'Order placed successfully!' }), {
        headers: { 'Content-Type': 'application/json' }
      });
    } catch (error) {
      console.error('Error processing order:', error);
      return new Response(JSON.stringify({ success: false, message: 'Error processing order: ' + error.message }), {
        status: 500,
        headers: { 'Content-Type': 'application/json' }
      });
    }
  } else if (request.method === 'GET') {
    try {
      const { data: orders, error } = await supabase.from('orders').select('*');
      if (error) throw error;

      return new Response(JSON.stringify(orders), {
        headers: { 'Content-Type': 'application/json' }
      });
    } catch (error) {
      console.error('Error fetching orders:', error);
      return new Response(JSON.stringify({ error: 'Failed to fetch orders' }), {
        status: 500,
        headers: { 'Content-Type': 'application/json' }
      });
    }
  } else {
    return new Response('Method not allowed', { status: 405 });
  }
}