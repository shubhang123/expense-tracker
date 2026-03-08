'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { Button } from '@/components/ui/button';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { useLocalStorage } from '@/hooks/use-local-storage';
import { useRouter } from 'next/navigation';
import { toast } from '@/hooks/use-toast';
import { ArrowLeft, User, Camera, Shield, Zap } from 'lucide-react';
import Link from 'next/link';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import type { Profile } from '@/lib/types';

const profileFormSchema = z.object({
  avatarUrl: z.string().url('Please enter a valid URL'),
  name: z.string().optional(),
});

type ProfileFormValues = z.infer<typeof profileFormSchema>;

export default function ProfilePage() {
  const router = useRouter();
  const [profile, setProfile] = useLocalStorage<Profile>('user-profile', {
    avatarUrl: 'https://picsum.photos/100/100',
  });

  const form = useForm<ProfileFormValues>({
    resolver: zodResolver(profileFormSchema),
    defaultValues: {
      avatarUrl: profile.avatarUrl || '',
      name: profile.name || '',
    },
  });

  const onSubmit = (data: ProfileFormValues) => {
    setProfile({ ...profile, ...data });
    toast({
      title: 'Identity Confirmed',
      description: 'Matrix profile updated successfully.',
    });
    router.push('/');
  };

  return (
    <div className="space-y-12 pb-32 max-w-2xl mx-auto enter">
      {/* ── Header ── */}
      <header className="space-y-4">
        <Button asChild variant="ghost" className="p-0 h-auto hover:bg-transparent group">
          <Link href="/" className="flex items-center gap-2 t-label opacity-60 group-hover:opacity-100 transition-opacity">
            <ArrowLeft className="h-4 w-4 group-hover:-translate-x-1 transition-transform" />
            Back to Dashboard
          </Link>
        </Button>
        <div className="pt-2">
          <span className="t-label">Authentication</span>
          <h1 className="t-h1">Identity <span className="t-light opacity-50">Profile</span> <span className="t-accent">Matrix</span></h1>
        </div>
      </header>

      {/* ── Identity Card ── */}
      <section className="relative group">
        <div className="card bg-surface-raised border-white/5 p-10 relative overflow-hidden">
          {/* Drifting Background Blob */}
          <div className="absolute bottom-[-20%] right-[-10%] w-[250px] h-[250px] blob blob-violet opacity-20 pointer-events-none group-hover:opacity-30 transition-opacity" />

          <div className="relative z-10 flex flex-col items-center text-center space-y-8">
            <div className="relative">
              <div className="absolute inset-0 bg-primary/20 blur-2xl rounded-full scale-110 pointer-events-none" />
              <Avatar className="h-32 w-32 border-2 border-primary/50 relative">
                <AvatarImage src={profile.avatarUrl} alt="User" />
                <AvatarFallback className="bg-surface-high text-primary text-4xl font-black">
                  {profile.name?.charAt(0) || 'U'}
                </AvatarFallback>
              </Avatar>
              <div className="absolute bottom-0 right-0 p-2 bg-primary text-primary-foreground rounded-full border-2 border-surface-raised">
                <Camera className="h-4 w-4" />
              </div>
            </div>

            <div className="space-y-2">
              <h2 className="text-3xl font-black text-white tracking-tighter uppercase">{profile.name || 'Anonymous User'}</h2>
              <p className="t-label !opacity-40">System Access Level: Admin</p>
            </div>

            <div className="grid grid-cols-2 gap-4 w-full pt-4">
              <div className="bg-white/5 border border-white/5 p-4 rounded-2xl flex items-center gap-3">
                <Shield className="h-4 w-4 text-primary" />
                <span className="t-label !opacity-100 text-[9px]">Verified Identity</span>
              </div>
              <div className="bg-white/5 border border-white/5 p-4 rounded-2xl flex items-center gap-3">
                <Zap className="h-4 w-4 text-primary" />
                <span className="t-label !opacity-100 text-[9px]">Active Session</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── Edit Form ── */}
      <section className="card bg-surface-raised border-white/5 p-10 pb-12">
        <div className="mb-10">
          <span className="t-label">Modification</span>
          <h2 className="text-xl font-black text-white/90 tracking-tight">Update Parameters</h2>
        </div>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem className="space-y-2">
                  <FormLabel className="t-label">Display Entity Name</FormLabel>
                  <FormControl>
                    <Input placeholder="E.G. SATOSHI" {...field} className="h-14 bg-white/5 border-white/10 rounded-xl focus:border-primary/50 text-white placeholder:text-white/10" />
                  </FormControl>
                  <FormMessage className="t-label !opacity-100 text-red-500 mt-1 lowercase" />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="avatarUrl"
              render={({ field }) => (
                <FormItem className="space-y-2">
                  <FormLabel className="t-label">Avatar Resource Locator</FormLabel>
                  <FormControl>
                    <Input placeholder="HTTPS://IMAGE.URL/PROFILE.JPG" {...field} className="h-14 bg-white/5 border-white/10 rounded-xl focus:border-primary/50 text-white placeholder:text-white/10" />
                  </FormControl>
                  <FormMessage className="t-label !opacity-100 text-red-500 mt-1 lowercase" />
                </FormItem>
              )}
            />
            <Button type="submit" className="w-full h-16 btn--primary group overflow-hidden relative shadow-2xl">
              <div className="absolute inset-0 bg-white/10 translate-y-full group-hover:translate-y-0 transition-transform duration-300" />
              Save Configuration
            </Button>
          </form>
        </Form>
      </section>
    </div>
  );
}
