import { useState, useEffect, useRef } from 'react';
import { signIn } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { useFormStatus } from 'react-dom';
import Image from 'next/image';
import { Button } from '@/components/ui/button';
import { Select, SelectTrigger, SelectContent, SelectItem, SelectValue } from '@/components/ui/select';
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { FaGoogle } from 'react-icons/fa';
import { motion } from 'framer-motion';
import { login } from '@/app/actions/login';
import { register } from '@/app/actions/register';
import { UserRole } from '@prisma/client';
import { Loader2 } from 'lucide-react';

interface AuthCardProps {
  mode?: 'login' | 'register';
}

function SubmitButton({ isLogin, isLoading }: { isLogin: boolean; isLoading: boolean }) {
  const { pending } = useFormStatus();
  return (
    <Button type="submit" className="w-full bg-primary text-primary-foreground hover:bg-primary/90" disabled={pending || isLoading}>
      {isLoading ? (
        <>
          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
          {isLogin ? 'Masuk...' : 'Mendaftar...'}
        </>
      ) : (
        <>{isLogin ? 'Masuk' : 'Daftar'}</>
      )}
    </Button>
  );
}

const AuthCard = ({ mode = 'login' }: AuthCardProps) => {
  const [isLogin, setIsLogin] = useState(mode === 'login');
  const [role, setRole] = useState<UserRole>(UserRole.MURID);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const formRef = useRef<HTMLFormElement>(null);
  const router = useRouter();

  const handleGoogleAuth = () => {
    const callbackUrl = isLogin ? '/' : '/auth/complete-registration';
    signIn('google', { callbackUrl, state: { role } });
  };

  const handleModeSwitch = (mode: 'login' | 'register') => {
    if ((mode === 'login' && isLogin) || (mode === 'register' && !isLogin)) {
      return; // Already in this mode
    }
    
    setIsLogin(mode === 'login');
    setError(null);
    setSuccess(null);
    
    // Reset form fields
    if (formRef.current) {
      formRef.current.reset();
    }
  };

  // Update URL without full page navigation when tab changes
  useEffect(() => {
    const path = isLogin ? '/auth/login' : '/auth/register';
    window.history.pushState({}, '', path);
  }, [isLogin]);

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setError(null);
    setSuccess(null);
    setIsLoading(true);

    const formData = new FormData(event.currentTarget);
    const email = formData.get('email');
    const password = formData.get('password');

    if (typeof email !== 'string' || typeof password !== 'string') {
      setError('Email atau password tidak valid');
      setIsLoading(false);
      return;
    }

    try {
      if (isLogin) {
        const result = await login({ email, password });

        if ('error' in result) {
          setError(result.error || 'Terjadi kesalahan saat login');
        } else if ('success' in result) {
          setSuccess(result.success);
          if (result.shouldRefresh) {
            window.location.href = result.redirectTo || '/';
          } else if (result.redirectTo) {
            router.push(result.redirectTo);
          }
        }
      } else {
        const name = formData.get('name');
        if (typeof name !== 'string') {
          setError('Nama tidak valid');
          setIsLoading(false);
          return;
        }

        const result = await register({ 
          email, 
          password, 
          name, 
          role: role || UserRole.MURID 
        });

        if ('error' in result) {
          setError(typeof result.error === 'string' ? result.error : 'Terjadi kesalahan saat pendaftaran');
        } else {
          setSuccess('Pendaftaran berhasil. Silakan masuk.');
          setTimeout(() => router.push('/auth/login'), 2000);
        }
      }
    } catch (error: unknown) {
      if (error instanceof Error) {
        setError(error.message);
      } else {
        setError('Terjadi kesalahan. Silakan coba lagi.');
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="w-full max-w-md mx-auto"
    >
      <Card className="w-full shadow-lg">
        <CardHeader className="space-y-1">
          <div className="flex justify-center items-center mb-2">
            <Image
              src="/images/logoo.png"
              alt="PejuangKorea Logo"
              width={60}
              height={60}
              className="rounded-full"
            />
          </div>
          <div className="flex justify-center items-center mb-4">
            <div className="grid grid-cols-2 w-full bg-muted/20 rounded-lg p-1">
              <button
                onClick={() => handleModeSwitch('login')}
                className={`py-2 px-4 text-center font-medium rounded-md transition-all duration-300 ${
                  isLogin 
                    ? 'bg-secondary text-primary shadow-sm' 
                    : 'text-primary/60 hover:text-primary'
                }`}
                type="button"
              >
                Masuk
              </button>
              <button
                onClick={() => handleModeSwitch('register')}
                className={`py-2 px-4 text-center font-medium rounded-md transition-all duration-300 ${
                  !isLogin 
                    ? 'bg-secondary text-primary shadow-sm' 
                    : 'text-primary/60 hover:text-primary'
                }`}
                type="button"
              >
                Daftar
              </button>
            </div>
          </div>
          <CardDescription className="text-center pt-2 text-primary/80">
            {isLogin ? 'Masuk ke akun Anda' : 'Silahkan daftarkan akun anda'}
          </CardDescription>
        </CardHeader>
        <form ref={formRef} onSubmit={handleSubmit}>
          <CardContent className="space-y-4">
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ 
                opacity: !isLogin ? 1 : 0,
                height: !isLogin ? 'auto' : 0
              }}
              transition={{ duration: 0.3 }}
              className="overflow-hidden"
            >
              {!isLogin && (
                <>
                  <div className="space-y-2">
                    <Label htmlFor="name" className="text-primary">Nama</Label>
                    <Input
                      id="name"
                      name="name"
                      type="text"
                      placeholder="Masukkan nama Anda"
                      required={!isLogin}
                    />
                  </div>
                  <div className="space-y-2 mt-4">
                    <Label htmlFor="role" className="text-primary">Peran</Label>
                    <Select onValueChange={(value) => setRole(value as UserRole)} defaultValue={UserRole.MURID}>
                      <SelectTrigger id="role" className="w-full">
                        <SelectValue placeholder="Pilih peran" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value={UserRole.GURU}>Guru</SelectItem>
                        <SelectItem value={UserRole.MURID}>Murid</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </>
              )}
            </motion.div>
            <div className="space-y-2">
              <Label htmlFor="email" className="text-primary">Email</Label>
              <Input
                id="email"
                name="email"
                type="email"
                placeholder="Masukkan email Anda"
                required
              />
            </div>
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <Label htmlFor="password" className="text-primary">Kata Sandi</Label>
                {isLogin && (
                  <button
                    type="button"
                    onClick={() => alert('Fungsi reset kata sandi akan ditambahkan di sini')}
                    className="text-xs text-primary hover:underline"
                  >
                    Lupa kata sandi?
                  </button>
                )}
              </div>
              <Input
                id="password"
                name="password"
                type="password"
                placeholder="Masukkan kata sandi Anda"
                required
              />
            </div>
          </CardContent>
          <CardFooter className="flex flex-col space-y-4">
            <SubmitButton isLogin={isLogin} isLoading={isLoading} />
            
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ 
                opacity: error ? 1 : 0,
                height: error ? 'auto' : 0
              }}
              transition={{ duration: 0.3 }}
              className="w-full overflow-hidden"
            >
              {error && (
                <div className="bg-red-50 text-red-500 text-sm p-3 rounded-md border border-red-100 text-center">
                  {error}
                </div>
              )}
            </motion.div>
            
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ 
                opacity: success ? 1 : 0,
                height: success ? 'auto' : 0
              }}
              transition={{ duration: 0.3 }}
              className="w-full overflow-hidden"
            >
              {success && (
                <div className="bg-green-50 text-green-500 text-sm p-3 rounded-md border border-green-100 text-center">
                  {success}
                </div>
              )}
            </motion.div>
            <Button 
              onClick={handleGoogleAuth} 
              type="button" 
              variant="outline" 
              className="w-full flex items-center justify-center" 
              disabled={isLoading}
            >
              <FaGoogle className="mr-2" />
              {isLogin ? 'Masuk' : 'Daftar'} dengan Google
            </Button>
            <div className="text-xs text-center text-primary/70 mt-2">
              Dengan melanjutkan, Anda menyetujui Ketentuan Layanan dan Kebijakan Privasi kami
            </div>
          </CardFooter>
        </form>
      </Card>
    </motion.div>
  );
};

export default AuthCard;
