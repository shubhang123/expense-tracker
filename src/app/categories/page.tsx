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
import { useToast } from '@/hooks/use-toast';
import { ArrowLeft, Trash2, Plus, Activity, Hash, Circle, ChevronRight } from 'lucide-react';
import Link from 'next/link';
import { categories as initialCategories, transactions as initialTransactions } from '@/lib/data';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog';
import type { Transaction, Category } from '@/lib/types';
import { cn } from '@/lib/utils';

const categoryFormSchema = z.object({
  name: z.string().min(2, 'Category name is too short'),
  budget: z.coerce.number().positive('Budget must be a positive number'),
});

type CategoryFormValues = z.infer<typeof categoryFormSchema>;

export default function CategoriesPageV5() {
  const [categories, setCategories] = useLocalStorage<Category[]>('categories', initialCategories);
  const [transactions, setTransactions] = useLocalStorage<Transaction[]>('transactions', initialTransactions);
  const { toast } = useToast();

  const form = useForm<CategoryFormValues>({
    resolver: zodResolver(categoryFormSchema),
    defaultValues: {
      name: '',
      budget: 0,
    },
  });

  const onSubmit = (data: CategoryFormValues) => {
    const newCategory: Category = {
      id: data.name.toLowerCase().replace(/\s+/g, '-'),
      name: data.name,
      budget: data.budget,
    };

    if (categories.some(c => c.id === newCategory.id)) {
      toast({
        title: 'Conflict',
        description: 'This node already exists in the system matrix.',
        variant: 'destructive',
      });
      return;
    }

    setCategories([...categories, newCategory]);
    toast({
      title: 'Success',
      description: `Node "${data.name.toUpperCase()}" initialized.`,
    });
    form.reset();
  };

  const handleDeleteCategory = (id: string) => {
    const updatedTransactions = transactions.map(t => {
      if (t.category === id) {
        return { ...t, category: 'uncategorized' };
      }
      return t;
    });
    setTransactions(updatedTransactions);

    const updatedCategories = categories.filter(c => c.id !== id);
    setCategories(updatedCategories);

    toast({
      title: 'De-initialized',
      description: 'Node removed from matrix.',
      variant: 'destructive',
    });
  };

  const getCategorySpent = (catId: string) => {
    return transactions
      .filter(t => t.category.toLowerCase() === catId.toLowerCase())
      .reduce((acc, t) => acc + Math.abs(t.amount), 0);
  };

  return (
    <div className="bg-mesh-art min-h-screen px-6 py-24 relative selection:bg-art-blush selection:text-art-charcoal overflow-x-hidden">
      <div className="bg-noise-art" />

      {/* ── v5 Organic Blobs ── */}
      <div className="art-blob bg-art-sage w-[600px] h-[400px] -top-20 -right-20" />
      <div className="art-blob bg-art-blush w-[500px] h-[500px] bottom-0 -left-20 delay-1000" />

      <div className="container mx-auto max-w-7xl relative z-10">
        {/* ── v5 Header ── */}
        <header className="mb-24 border-b border-foreground/5 pb-16 enter-art">
          <div className="flex justify-between items-start mb-12">
            <Button asChild variant="ghost" className="p-0 h-auto hover:bg-transparent group">
              <Link href="/" className="flex items-center gap-2 t-label-jost group-hover:text-art-sage transition-colors">
                <ArrowLeft className="h-4 w-4" />
                <span>RETURN_TO_CORE</span>
              </Link>
            </Button>
            <div className="coord">CFG.GRID // NODE_CONTROL</div>
          </div>

          <div className="space-y-4">
            <span className="t-label-jost">Allocation Nodes // Registry</span>
            <h1 className="t-hero-num text-foreground">
              Node <span className="font-light italic">Control.</span>
            </h1>
          </div>
        </header>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
          {/* ── v5 Node Initializer Form ── */}
          <section className="lg:col-span-4 enter-art" style={{ animationDelay: '100ms' }}>
            <div className="glass-art-active rounded-[2rem] p-12">
              <div className="flex justify-between items-start mb-16">
                <div>
                  <h2 className="font-title text-4xl italic mb-2">Initializer</h2>
                  <span className="t-label-jost">Deploy New Sequence</span>
                </div>
                <div className="circle-icon border-art-sage text-art-sage">
                  <Plus className="h-5 w-5" />
                </div>
              </div>

              <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-12">
                  <FormField
                    control={form.control}
                    name="name"
                    render={({ field }) => (
                      <FormItem className="space-y-4">
                        <FormLabel className="t-label-jost opacity-100">ID_STRING</FormLabel>
                        <FormControl>
                          <Input
                            placeholder="E.G. CORE_INFRA"
                            {...field}
                            className="h-20 bg-foreground/5 border-0 rounded-2xl focus:ring-2 focus:ring-art-sage text-foreground font-ui font-bold uppercase tracking-widest text-lg px-8"
                          />
                        </FormControl>
                        <FormMessage className="font-ui text-[10px] text-red-500 uppercase font-black" />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="budget"
                    render={({ field }) => (
                      <FormItem className="space-y-4">
                        <FormLabel className="t-label-jost opacity-100">UTIL_CEILING</FormLabel>
                        <FormControl>
                          <Input
                            type="number"
                            placeholder="0.00"
                            {...field}
                            className="h-20 bg-foreground/5 border-0 rounded-2xl focus:ring-2 focus:ring-art-sage text-foreground font-ui font-bold text-lg px-8"
                          />
                        </FormControl>
                        <FormMessage className="font-ui text-[10px] text-red-500 uppercase font-black" />
                      </FormItem>
                    )}
                  />
                  <Button type="submit" className="w-full h-24 bg-foreground text-background hover:bg-art-sage hover:text-art-charcoal rounded-[2rem] transition-all duration-700 flex flex-col items-center justify-center group/btn">
                    <div className="flex flex-col items-center gap-2">
                      <div className="font-title text-2xl italic tracking-wide">Deploy_Node</div>
                      <div className="t-label-jost opacity-50 group-hover:opacity-100 transition-opacity">Protocol Initialization</div>
                    </div>
                  </Button>
                </form>
              </Form>
            </div>
          </section>

          {/* ── v5 Node Matrix ── */}
          <section className="lg:col-span-8 enter-art" style={{ animationDelay: '200ms' }}>
            <div className="glass-art-active rounded-[2rem] p-0 overflow-hidden flex flex-col">
              <div className="p-12 border-b border-foreground/5 flex justify-between items-end">
                <div>
                  <h2 className="font-title text-4xl italic mb-2">Registered_Nodes</h2>
                  <span className="t-label-jost">Live Spectrum Analysis</span>
                </div>
                <div className="text-right">
                  <div className="font-title text-6xl italic text-art-sage">{categories.length}</div>
                  <span className="t-label-jost text-foreground opacity-30">Active Units</span>
                </div>
              </div>

              <div className="divide-y border-foreground/5">
                {categories.map((category, index) => {
                  const spent = getCategorySpent(category.id);
                  const progress = category.budget > 0 ? (spent / category.budget) * 100 : 0;
                  const isOver = progress > 100;

                  return (
                    <div key={category.id} className="p-12 hover:bg-foreground/[0.02] transition-all group/node">
                      <div className="flex items-center justify-between mb-12">
                        <div className="flex items-center gap-8">
                          <div className="circle-icon w-20 h-20 border-foreground/5 bg-foreground/2 group-hover/node:bg-art-lavender group-hover/node:text-art-charcoal">
                            <Activity className="h-8 w-8" />
                          </div>
                          <div>
                            <span className="coord text-[9px] mb-2 font-bold opacity-30 block uppercase">NODE_ID: {category.id.substring(0, 8)}</span>
                            <h3 className="font-title text-3xl italic leading-none">{category.name}</h3>
                          </div>
                        </div>

                        <div className="flex items-center gap-6">
                          <div className="text-right hidden sm:block">
                            <span className="t-label-jost text-[8px] opacity-30 block mb-2">INTEGRITY_INDEX</span>
                            <div className="flex items-center gap-2 justify-end">
                              <Circle className={cn("h-2 w-2 border-0 fill-current", isOver ? "text-red-500" : "text-art-sage")} />
                              <span className="font-ui text-[10px] font-bold tracking-widest">{isOver ? 'CRITICAL' : 'OPTIMAL'}</span>
                            </div>
                          </div>
                          <AlertDialog>
                            <AlertDialogTrigger asChild>
                              <Button variant="ghost" size="icon" disabled={category.id === 'uncategorized'} className="h-14 w-14 rounded-full border border-foreground/5 hover:border-red-500 hover:text-red-500 transition-all">
                                <Trash2 className="h-5 w-5" />
                              </Button>
                            </AlertDialogTrigger>
                            <AlertDialogContent className="bg-art-ivory dark:bg-art-charcoal border-4 border-foreground rounded-[3rem] p-16">
                              <div className="space-y-12">
                                <div className="flex items-center gap-6">
                                  <div className="w-4 h-4 rounded-full bg-red-500" />
                                  <AlertDialogTitle className="font-title text-4xl italic">Terminate_Node?</AlertDialogTitle>
                                </div>
                                <AlertDialogDescription className="font-ui text-sm leading-relaxed uppercase tracking-widest opacity-60">
                                  TERMINATING UNIT "{category.name.toUpperCase()}" WILL RESULT IN INSTANTANEOUS DATA SEVERANCE.
                                  THIS ACTION IS PERMANENT IN THE CURRENT ARCHITECTURAL STATE.
                                </AlertDialogDescription>
                                <div className="flex flex-col gap-4">
                                  <AlertDialogAction onClick={() => handleDeleteCategory(category.id)} className="h-24 bg-red-600 text-white rounded-[2rem] font-title text-2xl italic tracking-wider hover:bg-red-700 transition-colors">Confirm_Purge</AlertDialogAction>
                                  <AlertDialogCancel className="h-16 bg-foreground/5 border-2 border-foreground/10 text-foreground rounded-[2rem] font-ui font-black text-xs uppercase tracking-[0.3em] hover:bg-foreground/10 transition-colors">Abort_Sequence</AlertDialogCancel>
                                </div>
                              </div>
                            </AlertDialogContent>
                          </AlertDialog>
                        </div>
                      </div>

                      <div className="space-y-6">
                        <div className="flex justify-between items-end">
                          <div className="space-y-2">
                            <span className="t-label-jost opacity-30 italic">UTIL_BANDWIDTH</span>
                            <div className="font-title text-3xl italic tracking-tighter">
                              ₹{spent.toLocaleString()}<span className="text-foreground/20 ml-2 italic">/ ₹{category.budget.toLocaleString()}</span>
                            </div>
                          </div>
                          <div className={cn("font-title text-4xl italic", isOver ? "text-red-500" : "text-foreground")}>
                            {Math.round(progress)}%
                          </div>
                        </div>

                        <div className="h-6 bg-foreground/5 rounded-full p-[3px] relative overflow-hidden">
                          <div
                            className={cn("h-full rounded-full transition-all duration-1000", isOver ? "bg-red-500" : "bg-art-sage")}
                            style={{ width: `${Math.min(progress, 100)}%` }}
                          />
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </section>
        </div>
      </div>
    </div>
  );
}
