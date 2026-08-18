import React, { createContext, useContext, useState, useEffect } from 'react';
import { login as apiLogin, logout as apiLogout, getProfile, registerFamily as apiRegister } from '../api/auth';
import { toast } from 'sonner';

const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadUser() {
      try {
        const savedToken = localStorage.getItem('ataa_auth_token');
        if (savedToken) {
          const profile = await getProfile();
          setUser(profile);
        }
      } catch (err) {
        console.error('Failed to load user session', err);
        localStorage.removeItem('ataa_auth_token');
        localStorage.removeItem('ataa_user');
      } finally {
        setLoading(false);
      }
    }
    loadUser();
  }, []);

  const login = async (credentials) => {
    try {
      const res = await apiLogin(credentials);
      setUser(res.user);
      toast.success(res.user.role === 'admin' ? 'تم تسجيل الدخول إلى لوحة الإدارة' : 'مرحباً بك في بوابة ممثل الأسرة');
      return res.user;
    } catch (err) {
      toast.error(err.message || 'فشل تسجيل الدخول');
      throw err;
    }
  };

  const registerFamily = async (data) => {
    try {
      const res = await apiRegister(data);
      setUser(res.user);
      toast.success('تم تقديم طلب التسجيل بنجاح وسيتواصل معكم الباحث الميداني');
      return res.user;
    } catch (err) {
      toast.error(err.message || 'تعذر إتمام التسجيل');
      throw err;
    }
  };

  const logout = async () => {
    await apiLogout();
    setUser(null);
    toast.info('تم تسجيل الخروج بنجاح');
  };

  const isAuthenticated = Boolean(user);
  const isAdmin = user?.role === 'admin';
  const isFamilyRep = user?.role === 'family_rep';

  return (
    <AuthContext.Provider value={{ user, loading, isAuthenticated, isAdmin, isFamilyRep, login, registerFamily, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth must be used within an AuthProvider');
  return context;
}
