/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useEffect, useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { apiClient, BackendHealth, SEED_CREDENTIALS } from '../services/apiClient';
import { UserRole } from '../types';

export const LoginView: React.FC = () => {
  const { login, register } = useAuth();
  const [tab, setTab] = useState<'login' | 'register'>('login');
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [health, setHealth] = useState<BackendHealth | null>(null);

  // Login form state
  const [identifier, setIdentifier] = useState('sofia.cliente@ejemplo.com');
  const [password, setPassword] = useState('Cliente123!');
  const [loginRoleFilter, setLoginRoleFilter] = useState<string>('');

  // Register form state
  const [regName, setRegName] = useState('');
  const [regEmail, setRegEmail] = useState('');
  const [regPhone, setRegPhone] = useState('');
  const [regPassword, setRegPassword] = useState('');
  const [regRole, setRegRole] = useState<UserRole>('customer');

  useEffect(() => {
    apiClient.checkHealth().then((res) => setHealth(res));
  }, []);

  const handleLoginSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!identifier.trim() || !password) {
      setErrorMsg('Por favor completa el usuario/email y la contraseña.');
      return;
    }
    setErrorMsg(null);
    setLoading(true);

    try {
      const res = await login(identifier.trim(), password, loginRoleFilter || undefined);
      if (!res.success) {
        setErrorMsg(res.error || 'Credenciales incorrectas');
      }
    } catch {
      setErrorMsg('Error de conexión con el servicio de autenticación.');
    } finally {
      setLoading(false);
    }
  };

  const handleRegisterSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!regName.trim() || !regEmail.trim() || !regPassword) {
      setErrorMsg('Nombre, email y contraseña son obligatorios.');
      return;
    }
    setErrorMsg(null);
    setLoading(true);

    try {
      const res = await register({
        displayName: regName.trim(),
        email: regEmail.trim(),
        phone: regPhone.trim(),
        password: regPassword,
        role: regRole,
        cityId: 'city_perico',
      });
      if (!res.success) {
        setErrorMsg(res.error || 'Error al crear la cuenta.');
      }
    } catch {
      setErrorMsg('Error al conectar con el servidor.');
    } finally {
      setLoading(false);
    }
  };

  const handleQuickDemoLogin = async (cred: typeof SEED_CREDENTIALS[0]) => {
    setErrorMsg(null);
    setLoading(true);
    setIdentifier(cred.email);
    setPassword(cred.password);
    try {
      await login(cred.email, cred.password, cred.role);
    } catch {
      setErrorMsg('Error al iniciar sesión demo.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[var(--bg)] flex flex-col justify-center items-center p-4">
      <div className="w-full max-w-[430px] bg-[var(--surface)] border border-[var(--border)] rounded-3xl shadow-2xl overflow-hidden flex flex-col">
        {/* Top Header Branding */}
        <div className="bg-gradient-to-br from-[var(--brand)] to-[var(--brand-dark)] text-white p-6 text-center relative">
          <div className="w-14 h-14 mx-auto mb-3 rounded-2xl bg-white/10 backdrop-blur-md flex items-center justify-center shadow-inner border border-white/20">
            <span className="material-symbols-outlined text-[32px] text-white">restaurant</span>
          </div>
          <h1 className="text-2xl font-black tracking-tight">FoodieLocal</h1>
          <p className="text-xs text-white/80 mt-1 font-medium">
            Plataforma Integral de Pedidos y Logística Local
          </p>

          {/* Cloudflare Tunnel / Backend Health Pill */}
          <div className="mt-4 inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-black/25 backdrop-blur-sm text-[11px] font-mono border border-white/10">
            <span
              className={`w-2 h-2 rounded-full ${
                health?.isOnline ? 'bg-emerald-400 animate-pulse' : 'bg-amber-400'
              }`}
            />
            <span className="text-white/90">
              {health?.isOnline ? 'Backend Docker Live' : 'Modo API Local / Demo'}
            </span>
          </div>
        </div>

        {/* Content Body */}
        <div className="p-5 flex-1 flex flex-col gap-5">
          {/* Quick Demo Access Section */}
          <div className="bg-[var(--surface-alt)] border border-[var(--border)] rounded-2xl p-3.5">
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-black uppercase tracking-wider text-[var(--brand)] flex items-center gap-1">
                <span className="material-symbols-outlined text-[16px]">key</span>
                Cuentas de Prueba (Demo 1-Click)
              </span>
              <span className="text-[10px] text-[var(--text-secondary)] font-medium">Acceso directo</span>
            </div>
            <p className="text-[11px] text-[var(--text-secondary)] mb-2.5">
              Haz clic en cualquier rol para autenticarte instantáneamente como ese usuario:
            </p>

            <div className="grid grid-cols-2 gap-2">
              {SEED_CREDENTIALS.map((cred) => (
                <button
                  key={cred.email}
                  type="button"
                  onClick={() => handleQuickDemoLogin(cred)}
                  disabled={loading}
                  className="flex flex-col text-left p-2 rounded-xl bg-[var(--surface)] hover:bg-[var(--brand-soft)] border border-[var(--border)] hover:border-[var(--brand)]/40 transition-all cursor-pointer active:scale-98 disabled:opacity-50 group"
                >
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-[var(--text)] group-hover:text-[var(--brand)]">
                      {cred.role === 'admin'
                        ? '👑 Admin'
                        : cred.role === 'merchant'
                        ? '🍕 Comercio'
                        : cred.role === 'courier'
                        ? '🛵 Cadete'
                        : '👤 Cliente'}
                    </span>
                    <span className="text-[10px] px-1.5 py-0.5 rounded-full bg-[var(--surface-alt)] text-[var(--text-secondary)] font-mono">
                      {cred.role}
                    </span>
                  </div>
                  <span className="text-[11px] font-semibold text-[var(--text)] truncate mt-0.5">
                    {cred.displayName}
                  </span>
                  <span className="text-[9px] text-[var(--text-secondary)] truncate">
                    {cred.email}
                  </span>
                </button>
              ))}
            </div>
          </div>

          {/* Auth Tab Switcher */}
          <div className="flex bg-[var(--surface-alt)] p-1 rounded-2xl border border-[var(--border)]">
            <button
              type="button"
              onClick={() => {
                setTab('login');
                setErrorMsg(null);
              }}
              className={`flex-1 py-2 text-xs font-bold rounded-xl transition-all ${
                tab === 'login'
                  ? 'bg-[var(--surface)] text-[var(--brand)] shadow-sm'
                  : 'text-[var(--text-secondary)] hover:text-[var(--text)]'
              }`}
            >
              Iniciar Sesión
            </button>
            <button
              type="button"
              onClick={() => {
                setTab('register');
                setErrorMsg(null);
              }}
              className={`flex-1 py-2 text-xs font-bold rounded-xl transition-all ${
                tab === 'register'
                  ? 'bg-[var(--surface)] text-[var(--brand)] shadow-sm'
                  : 'text-[var(--text-secondary)] hover:text-[var(--text)]'
              }`}
            >
              Registrarse (Nuevo)
            </button>
          </div>

          {/* Error Message Display */}
          {errorMsg && (
            <div className="p-3 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-600 dark:text-rose-400 text-xs font-semibold flex items-center gap-2">
              <span className="material-symbols-outlined text-[18px]">error</span>
              <span>{errorMsg}</span>
            </div>
          )}

          {/* Login Form */}
          {tab === 'login' ? (
            <form onSubmit={handleLoginSubmit} className="flex flex-col gap-3.5">
              <div>
                <label className="block text-xs font-bold text-[var(--text)] mb-1">
                  Usuario / Correo / Teléfono
                </label>
                <div className="relative">
                  <span className="material-symbols-outlined absolute left-3 top-2.5 text-[var(--text-secondary)] text-[18px]">
                    person
                  </span>
                  <input
                    type="text"
                    value={identifier}
                    onChange={(e) => setIdentifier(e.target.value)}
                    placeholder="ej: admin@deliverylocal.com o +549388..."
                    className="w-full pl-9 pr-3 py-2 bg-[var(--surface-alt)] border border-[var(--border)] rounded-xl text-xs text-[var(--text)] focus:ring-2 focus:ring-[var(--brand)] focus:outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-[var(--text)] mb-1">
                  Contraseña
                </label>
                <div className="relative">
                  <span className="material-symbols-outlined absolute left-3 top-2.5 text-[var(--text-secondary)] text-[18px]">
                    lock
                  </span>
                  <input
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••••"
                    className="w-full pl-9 pr-3 py-2 bg-[var(--surface-alt)] border border-[var(--border)] rounded-xl text-xs text-[var(--text)] focus:ring-2 focus:ring-[var(--brand)] focus:outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-[var(--text)] mb-1">
                  Filtrar Rol (Opcional)
                </label>
                <select
                  value={loginRoleFilter}
                  onChange={(e) => setLoginRoleFilter(e.target.value)}
                  className="w-full px-3 py-2 bg-[var(--surface-alt)] border border-[var(--border)] rounded-xl text-xs text-[var(--text)] focus:ring-2 focus:ring-[var(--brand)] focus:outline-none"
                >
                  <option value="">Autodetectar por cuenta</option>
                  <option value="customer">Cliente (Sofía Gómez)</option>
                  <option value="merchant">Comercio (Don Pepe)</option>
                  <option value="courier">Cadete (Juan / Pedro / Martín)</option>
                  <option value="admin">Administrador General</option>
                </select>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full py-3 mt-1 rounded-2xl bg-[var(--brand)] hover:bg-[var(--brand-dark)] active:scale-98 text-white font-extrabold text-sm shadow-md transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
              >
                {loading ? (
                  <span className="animate-spin material-symbols-outlined text-[20px]">
                    progress_activity
                  </span>
                ) : (
                  <>
                    <span>Ingresar a la Plataforma</span>
                    <span className="material-symbols-outlined text-[18px]">login</span>
                  </>
                )}
              </button>
            </form>
          ) : (
            /* Register Form */
            <form onSubmit={handleRegisterSubmit} className="flex flex-col gap-3">
              <div>
                <label className="block text-xs font-bold text-[var(--text)] mb-1">
                  Nombre Completo
                </label>
                <input
                  type="text"
                  value={regName}
                  onChange={(e) => setRegName(e.target.value)}
                  placeholder="ej: Lucas Morales"
                  className="w-full px-3 py-2 bg-[var(--surface-alt)] border border-[var(--border)] rounded-xl text-xs text-[var(--text)] focus:ring-2 focus:ring-[var(--brand)] focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-[var(--text)] mb-1">
                  Correo Electrónico
                </label>
                <input
                  type="email"
                  value={regEmail}
                  onChange={(e) => setRegEmail(e.target.value)}
                  placeholder="ej: lucas.cliente@ejemplo.com"
                  className="w-full px-3 py-2 bg-[var(--surface-alt)] border border-[var(--border)] rounded-xl text-xs text-[var(--text)] focus:ring-2 focus:ring-[var(--brand)] focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-[var(--text)] mb-1">
                  Teléfono Móvil
                </label>
                <input
                  type="tel"
                  value={regPhone}
                  onChange={(e) => setRegPhone(e.target.value)}
                  placeholder="+54 9 388 555-4433"
                  className="w-full px-3 py-2 bg-[var(--surface-alt)] border border-[var(--border)] rounded-xl text-xs text-[var(--text)] focus:ring-2 focus:ring-[var(--brand)] focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-[var(--text)] mb-1">
                  Contraseña
                </label>
                <input
                  type="password"
                  value={regPassword}
                  onChange={(e) => setRegPassword(e.target.value)}
                  placeholder="Password123!"
                  className="w-full px-3 py-2 bg-[var(--surface-alt)] border border-[var(--border)] rounded-xl text-xs text-[var(--text)] focus:ring-2 focus:ring-[var(--brand)] focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-[var(--text)] mb-1">
                  Rol Solicitado
                </label>
                <select
                  value={regRole}
                  onChange={(e) => setRegRole(e.target.value as UserRole)}
                  className="w-full px-3 py-2 bg-[var(--surface-alt)] border border-[var(--border)] rounded-xl text-xs text-[var(--text)] focus:ring-2 focus:ring-[var(--brand)] focus:outline-none"
                >
                  <option value="customer">Cliente (Predeterminado)</option>
                  <option value="courier">Cadete Repartidor</option>
                  <option value="merchant">Comercio Adherido</option>
                </select>
                <p className="text-[10px] text-[var(--text-secondary)] mt-1">
                  Nota: El rol por defecto es Cliente. Si te registras como Cadete, tu perfil ingresará en la cola de asignación.
                </p>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full py-3 mt-1 rounded-2xl bg-[var(--brand)] hover:bg-[var(--brand-dark)] active:scale-98 text-white font-extrabold text-sm shadow-md transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
              >
                {loading ? (
                  <span className="animate-spin material-symbols-outlined text-[20px]">
                    progress_activity
                  </span>
                ) : (
                  <>
                    <span>Crear Cuenta e Iniciar Sesión</span>
                    <span className="material-symbols-outlined text-[18px]">person_add</span>
                  </>
                )}
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};
