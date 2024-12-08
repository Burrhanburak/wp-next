export const adminApi = {
    // Ana admin endpoint'i
    getAdminStatus: async () => {
      const res = await fetch('/api/admin');
      if (!res.ok) throw new Error('Failed to fetch admin status');
      return res.json();
    },
  
    // Auth işlemleri
    login: async (email: string, password: string) => {
      const res = await fetch('/api/admin/auth', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password })
      });
      if (!res.ok) throw new Error('Login failed');
      return res.json();
    },
  
    // SMS doğrulama
    verifySms: async (phone: string, code: string) => {
      const res = await fetch('/api/admin/auth/verify-sms', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ phone, code })
      });
      if (!res.ok) throw new Error('SMS verification failed');
      return res.json();
    },
  
    // Kod gönderme
    sendCode: async (phone: string) => {
      const res = await fetch('/api/admin/send-code', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ phone })
      });
      if (!res.ok) throw new Error('Failed to send code');
      return res.json();
    },
  
    // Ayarlar
    getSettings: async () => {
      const res = await fetch('/api/admin/settings');
      if (!res.ok) throw new Error('Failed to fetch settings');
      return res.json();
    },
  
    updateSettings: async (settings: any) => {
      const res = await fetch('/api/admin/settings', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(settings)
      });
      if (!res.ok) throw new Error('Failed to update settings');
      return res.json();
    },
  
    // Kullanıcı işlemleri
    getUsers: async () => {
      const res = await fetch('/api/admin/users');
      if (!res.ok) throw new Error('Failed to fetch users');
      return res.json();
    },
  
    createUser: async (userData: any) => {
      const res = await fetch('/api/admin/users', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(userData)
      });
      if (!res.ok) throw new Error('Failed to create user');
      return res.json();
    }
  };