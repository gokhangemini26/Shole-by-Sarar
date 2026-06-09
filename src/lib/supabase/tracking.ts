import { createClient } from './client';

export async function createChatSession(userId: string): Promise<string | null> {
  const supabase = createClient();
  const { data, error } = await supabase
    .from('chat_sessions')
    .insert([{ user_id: userId }])
    .select('id')
    .single();
    
  if (error) {
    console.error('Error creating chat session:', error);
    return null;
  }
  return data?.id;
}

export async function logChatMessage(sessionId: string, role: 'user' | 'model' | 'system', content: string) {
  const supabase = createClient();
  const { error } = await supabase
    .from('chat_messages')
    .insert([{ session_id: sessionId, role, content }]);
    
  if (error) {
    console.error('Error logging chat message:', error);
  }
}

export async function logProductView(userId: string, productId: string) {
  const supabase = createClient();
  const { error } = await supabase
    .from('product_views')
    .insert([{ user_id: userId, product_id: productId }]);
    
  if (error) {
    console.error('Error logging product view:', error);
  }
}

export async function logCartEvent(userId: string, productId: string, action: 'add' | 'remove', size?: string) {
  const supabase = createClient();
  const { error } = await supabase
    .from('cart_events')
    .insert([{ user_id: userId, product_id: productId, action, size }]);
    
  if (error) {
    console.error('Error logging cart event:', error);
  }
}

export async function logPurchase(userId: string, productId: string, size: string, price: string, quantity: number = 1) {
  const supabase = createClient();
  const { error } = await supabase
    .from('purchases')
    .insert([{ user_id: userId, product_id: productId, size, price, quantity }]);
    
  if (error) {
    console.error('Error logging purchase:', error);
  }
}

export async function getAIMemoryContext(userId: string): Promise<string> {
  const supabase = createClient();
  
  // Get User Profile
  const { data: profile } = await supabase
    .from('profiles')
    .select('full_name')
    .eq('id', userId)
    .single();
    
  const userName = profile?.full_name?.split(' ')[0] || 'Değerli Misafirimiz';

  // Get Recent Product Views
  const { data: recentViews } = await supabase
    .from('product_views')
    .select('product_id')
    .eq('user_id', userId)
    .order('viewed_at', { ascending: false })
    .limit(5);
    
  // Get Recent Cart Adds
  const { data: recentCart } = await supabase
    .from('cart_events')
    .select('product_id')
    .eq('user_id', userId)
    .eq('action', 'add')
    .order('created_at', { ascending: false })
    .limit(5);

  // Get Past Purchases (what the customer actually bought)
  const { data: pastPurchases } = await supabase
    .from('purchases')
    .select('product_id, size')
    .eq('user_id', userId)
    .order('purchased_at', { ascending: false })
    .limit(10);

  // Format Context
  let contextStr = `\n\n--- AI MEMORY LAYER (SYSTEM DIRECTIVE) ---\n`;
  contextStr += `Kullanıcının Adı: ${userName}\n`;

  const viewedIds = Array.from(new Set(recentViews?.map(v => v.product_id) || []));
  if (viewedIds.length > 0) {
    contextStr += `Son incelediği ürünlerin ID'leri: ${viewedIds.join(', ')}\n`;
  }

  const cartIds = Array.from(new Set(recentCart?.map(c => c.product_id) || []));
  if (cartIds.length > 0) {
    contextStr += `Sepetine eklediği ürünlerin ID'leri: ${cartIds.join(', ')}\n`;
  }

  const purchased = Array.from(
    new Set((pastPurchases || []).map(p => (p.size ? `${p.product_id} (beden ${p.size})` : p.product_id)))
  );
  if (purchased.length > 0) {
    contextStr += `Daha önce SATIN ALDIĞI ürünler: ${purchased.join(', ')}\n`;
  }

  const isReturning = viewedIds.length > 0 || cartIds.length > 0 || purchased.length > 0;
  contextStr += `Müşteri tipi: ${isReturning ? 'GERİ DÖNEN müşteri — geçmişini hatırla' : 'YENİ müşteri'}\n`;
  contextStr += `Görev: Adını sadece gerektiğinde, doğal bir şekilde kullan. Geçmiş etkileşimlerine göre zevkini anla; daha önce satın aldığı parçaları TAMAMLAYAN veya onlara yakışan ürünler öner, aynı ürünü tekrar almayı önerme. "Bana ne önerirsin" derse bu geçmişe göre kişiselleştir.\n`;
  contextStr += `------------------------------------------\n`;

  return contextStr;
}
