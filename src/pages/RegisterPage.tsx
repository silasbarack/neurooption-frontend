import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { languages } from '../data/languages';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000';

const translations: Record<string, any> = {
  en: {
    home: '‹ To home page',
    title: 'Registration',
    signinText: 'Already registered?',
    signin: 'Sign in',
    fullName: 'Full name *',
    email: 'Email *',
    phone: 'Phone',
    password: 'Password *',
    promo: 'Enter promo code if you have one',
    agreement: 'I have read and accepted the public offer agreement',
    signup: 'SIGN UP',
    failed: 'Registration failed.',
    fullNameRequired: 'Full name is required.',
    emailRequired: 'Email is required.',
    passwordRequired: 'Password must be at least 6 characters.',
    agreementRequired: 'You must accept the agreement.',
  },
  fr: {
    home: '‹ Retour à la page d’accueil',
    title: 'Inscription',
    signinText: 'Déjà inscrit ?',
    signin: 'Connexion',
    fullName: 'Nom complet *',
    email: 'E-mail *',
    phone: 'Téléphone',
    password: 'Mot de passe *',
    promo: 'Entrez le code promo si vous en avez un',
    agreement: 'J’ai lu et accepté l’accord d’offre publique',
    signup: 'S’INSCRIRE',
    failed: 'Échec de l’inscription.',
  },
  sw: {
    home: '‹ Nyumbani',
    title: 'Usajili',
    signinText: 'Tayari umesajiliwa?',
    signin: 'Ingia',
    fullName: 'Jina kamili *',
    email: 'Barua pepe *',
    phone: 'Simu',
    password: 'Nenosiri *',
    promo: 'Weka msimbo wa ofa kama unao',
    agreement: 'Nimesoma na kukubali makubaliano',
    signup: 'JISAJILI',
    failed: 'Usajili umeshindikana.',
  },
  ar: {
    home: '‹ إلى الصفحة الرئيسية',
    title: 'التسجيل',
    signinText: 'مسجل بالفعل؟',
    signin: 'تسجيل الدخول',
    fullName: 'الاسم الكامل *',
    email: 'البريد الإلكتروني *',
    phone: 'الهاتف',
    password: 'كلمة المرور *',
    promo: 'أدخل رمز العرض إن وجد',
    agreement: 'لقد قرأت ووافقت على اتفاقية العرض العام',
    signup: 'تسجيل',
    failed: 'فشل التسجيل.',
  },
};

export default function RegisterPage() {
  const navigate = useNavigate();

  const [language, setLanguage] = useState('en');
  const t = translations[language] || translations.en;

  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  const [promoCode, setPromoCode] = useState('');
  const [accepted, setAccepted] = useState(false);

  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setMessage('');

    if (!fullName.trim()) return setMessage(t.fullNameRequired || 'Full name is required.');
    if (!email.trim()) return setMessage(t.emailRequired || 'Email is required.');
    if (password.length < 6) return setMessage(t.passwordRequired || 'Password must be at least 6 characters.');
    if (!accepted) return setMessage(t.agreementRequired || 'You must accept the agreement.');

    setLoading(true);

    try {
      const res = await fetch(`${API_URL}/auth/register`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          fullName: fullName.trim(),
          email: email.trim().toLowerCase(),
          phone: phone.trim() || undefined,
          password,
          promoCode: promoCode.trim() || undefined,
        }),
      });

      const data = await res.json().catch(() => ({}));

      if (!res.ok) {
        throw new Error(data.message || t.failed);
      }

      localStorage.setItem('accessToken', data.accessToken);
      localStorage.setItem('user', JSON.stringify(data.user));

      navigate('/trading');
    } catch (err: any) {
      setMessage(err.message || t.failed);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div style={styles.page}>
      <div style={styles.topBar}>
        <Link to="/" style={styles.backLink}>{t.home}</Link>

        <select
          value={language}
          onChange={(e) => setLanguage(e.target.value)}
          style={styles.languageSelect}
        >
          {languages.map((lang) => (
            <option key={lang.code} value={lang.code}>
              {lang.name}
            </option>
          ))}
        </select>
      </div>

      <form onSubmit={handleSubmit} style={styles.card}>
        <div style={styles.logoRow}>
          <div style={styles.logo}>N</div>
          <span style={styles.brand}>
            <b>Neuro</b>Option
          </span>
        </div>

        <h1 style={styles.title}>{t.title}</h1>

        <p style={styles.subtitle}>
          {t.signinText}{' '}
          <Link to="/login" style={styles.link}>
            {t.signin}
          </Link>
        </p>

        {message && <div style={styles.error}>{message}</div>}

        <input
          style={styles.input}
          placeholder={t.fullName}
          value={fullName}
          onChange={(e) => setFullName(e.target.value)}
        />

        <input
          style={styles.input}
          placeholder={t.email}
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />

        <input
          style={styles.input}
          placeholder={t.phone}
          value={phone}
          onChange={(e) => setPhone(e.target.value)}
        />

        <input
          style={styles.input}
          placeholder={t.password}
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />

        <input
          style={styles.input}
          placeholder={t.promo}
          value={promoCode}
          onChange={(e) => setPromoCode(e.target.value)}
        />

        <label style={styles.checkboxRow}>
          <input
            type="checkbox"
            checked={accepted}
            onChange={(e) => setAccepted(e.target.checked)}
          />
          <span>{t.agreement}</span>
        </label>

        <button type="submit" disabled={loading} style={styles.button}>
          {loading ? '...' : t.signup}
        </button>
      </form>
    </div>
  );
}

const styles: Record<string, React.CSSProperties> = {
  page: {
    minHeight: '100vh',
    background: '#eef3f8',
    padding: '32px 20px',
    fontFamily: 'Inter, Arial, sans-serif',
  },
  topBar: {
    maxWidth: 720,
    margin: '0 auto 24px',
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    gap: 16,
  },
  backLink: {
    color: '#607080',
    textDecoration: 'none',
    fontSize: 16,
  },
  languageSelect: {
    border: 'none',
    background: 'transparent',
    fontSize: 16,
    color: '#4b5563',
    outline: 'none',
  },
  card: {
    width: '100%',
    maxWidth: 560,
    margin: '0 auto',
    background: 'rgba(255,255,255,0.88)',
    borderRadius: 8,
    padding: '42px 48px',
    boxShadow: '0 18px 50px rgba(15, 23, 42, 0.08)',
  },
  logoRow: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    gap: 12,
    marginBottom: 28,
  },
  logo: {
    width: 48,
    height: 34,
    borderRadius: 12,
    background: 'linear-gradient(135deg, #27b7f7, #1265e8)',
    color: '#fff',
    display: 'grid',
    placeItems: 'center',
    fontWeight: 800,
    fontSize: 24,
  },
  brand: {
    fontSize: 28,
    color: '#4b5563',
  },
  title: {
    textAlign: 'center',
    fontSize: 42,
    margin: '0 0 14px',
    color: '#111827',
  },
  subtitle: {
    textAlign: 'center',
    color: '#7b8794',
    fontSize: 18,
    marginBottom: 28,
  },
  link: {
    color: '#52636f',
    textDecoration: 'underline',
  },
  error: {
    border: '1px solid #e5b9b9',
    color: '#8b2f2f',
    padding: '14px',
    borderRadius: 6,
    textAlign: 'center',
    marginBottom: 24,
    fontSize: 18,
  },
  input: {
    width: '100%',
    border: 'none',
    borderBottom: '1px solid #c9d2dc',
    background: 'transparent',
    padding: '16px 4px',
    fontSize: 18,
    marginBottom: 18,
    outline: 'none',
    color: '#111827',
  },
  checkboxRow: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 10,
    color: '#374151',
    fontSize: 17,
    margin: '18px 0 28px',
  },
  button: {
    width: '70%',
    display: 'block',
    margin: '0 auto',
    border: 'none',
    borderRadius: 7,
    padding: '17px',
    background: 'linear-gradient(90deg, #24b8f2, #1265e8)',
    color: '#fff',
    fontWeight: 800,
    fontSize: 18,
    cursor: 'pointer',
  },
};