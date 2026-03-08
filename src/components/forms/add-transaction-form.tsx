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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { useRouter } from 'next/navigation';
import { Popover, PopoverTrigger, PopoverContent } from '../ui/popover';
import { Plus, History, Hash, Terminal } from 'lucide-react';
import { Calendar } from '../ui/calendar';
import { format } from 'date-fns';
import { cn } from '@/lib/utils';
import { toast } from '@/hooks/use-toast';
import { useEffect } from 'react';

const formSchema = z.object({
  amount: z.coerce.number().positive('Amount must be positive'),
  merchant: z.string().min(2, 'Merchant is too short'),
  category: z.string().min(1, 'Please select a category'),
  subcategory: z.string().optional(),
  date: z.date(),
  notes: z.string().optional(),
  receiptUrl: z.string().url('Please enter a valid URL.').optional().or(z.literal('')),
});

type AddTransactionFormProps = {
  categories: { id: string; name: string }[];
  onSubmit: (data: z.infer<typeof formSchema>) => void;
  defaultCategory?: string | null;
  initialData?: z.infer<typeof formSchema> & { date: string };
  isEditMode?: boolean;
};

export function AddTransactionForm({
  categories,
  onSubmit,
  defaultCategory,
  initialData,
  isEditMode = false,
}: AddTransactionFormProps) {
  const router = useRouter();
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      amount: initialData?.amount || 0,
      merchant: initialData?.merchant || '',
      date: initialData ? new Date(initialData.date) : new Date(),
      category: initialData?.category || defaultCategory || '',
      subcategory: initialData?.subcategory || '',
      notes: initialData?.notes || '',
      receiptUrl: initialData?.receiptUrl || '',
    },
  });

  useEffect(() => {
    if (defaultCategory && !isEditMode) {
      form.setValue('category', defaultCategory);
    }
  }, [defaultCategory, form, isEditMode]);

  function handleFormSubmit(values: z.infer<typeof formSchema>) {
    onSubmit(values);
    if (!isEditMode) {
      toast({ title: 'Success', description: 'Transaction recorded at the speed of light.' })
      router.push('/');
    }
  }

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(handleFormSubmit)}
        className="space-y-16"
      >
        {/* ── v4 Amount Input: Massive Editorial ── */}
        <FormField
          control={form.control}
          name="amount"
          render={({ field }) => (
            <FormItem className="space-y-6">
              <div className="flex justify-between items-end border-b-2 border-white/10 pb-4">
                <FormLabel className="t-label text-[10px] font-black italic">PAYLOAD_VALUE</FormLabel>
                <div className="coord">UNIT.CURR // INR</div>
              </div>
              <FormControl>
                <div className="relative group p-12 bg-black border-4 border-white overflow-hidden">
                  <div className="absolute top-0 left-0 w-4 h-4 bauhaus-red" />
                  <div className="absolute inset-0 gallery-grid opacity-10 pointer-events-none" />

                  <div className="flex items-center relative z-10">
                    <span className="text-6xl md:text-8xl font-black text-white/20 group-focus-within:text-[#FFD700] transition-colors mr-8 italic">₹</span>
                    <Input
                      type="number"
                      placeholder="0.00"
                      {...field}
                      className="text-7xl md:text-9xl h-auto py-4 font-black tracking-tighter border-0 rounded-none shadow-none focus-visible:ring-0 transition-all bg-transparent p-0 tabular-nums text-white placeholder:text-white/5 italic"
                      onChange={e => field.onChange(Math.abs(Number(e.target.value)))}
                    />
                  </div>
                </div>
              </FormControl>
              <FormMessage className="font-mono text-[10px] text-red-500 uppercase mt-2" />
            </FormItem>
          )}
        />

        <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
          <FormField
            control={form.control}
            name="merchant"
            render={({ field }) => (
              <FormItem className="space-y-4">
                <FormLabel className="t-label text-[10px] font-black italic">ENTITY_ID</FormLabel>
                <FormControl>
                  <div className="relative group">
                    <Terminal className="absolute left-6 top-1/2 -translate-y-1/2 h-6 w-6 text-white/20 group-focus-within:text-white transition-colors" />
                    <Input placeholder="E.G. MERCHANT_NAME" {...field} className="h-20 pl-16 bg-transparent border-2 border-white rounded-none focus:ring-0 focus:border-white text-white placeholder:text-white/5 font-black uppercase text-xl" />
                  </div>
                </FormControl>
                <FormMessage className="font-mono text-[10px] text-red-500 uppercase" />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="category"
            render={({ field }) => (
              <FormItem className="space-y-4">
                <FormLabel className="t-label text-[10px] font-black italic">ALLOCATION_NODE</FormLabel>
                <Select onValueChange={field.onChange} defaultValue={field.value} value={field.value}>
                  <FormControl>
                    <SelectTrigger className="h-20 bg-transparent border-2 border-white rounded-none focus:ring-0 focus:border-white text-white placeholder:text-white/5 font-black uppercase text-xl">
                      <Hash className="h-6 w-6 mr-3 text-white/20" />
                      <SelectValue placeholder="SELECT_NODE" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent className="bg-black border-4 border-white text-white rounded-none p-0">
                    {categories.map(category => (
                      <SelectItem key={category.id} value={category.id} className="focus:bg-white focus:text-black rounded-none px-8 py-6 font-black uppercase text-lg border-b-2 border-white/10 last:border-b-0">
                        {category.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <FormMessage className="font-mono text-[10px] text-red-500 uppercase" />
              </FormItem>
            )}
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
          <FormField
            control={form.control}
            name="date"
            render={({ field }) => (
              <FormItem className="space-y-4 flex flex-col">
                <FormLabel className="t-label text-[10px] font-black italic">TEMPORAL_STAMP</FormLabel>
                <Popover>
                  <PopoverTrigger asChild>
                    <FormControl>
                      <Button
                        variant={'outline'}
                        className={cn(
                          'w-full pl-8 text-left h-20 bg-transparent border-2 border-white rounded-none hover:bg-white hover:text-black text-white font-black uppercase text-xl transition-all',
                          !field.value && 'text-white/5'
                        )}
                      >
                        <History className="mr-4 h-6 w-6 opacity-40" />
                        {field.value ? (
                          format(field.value, 'yyyy.MM.dd')
                        ) : (
                          <span>PICK_DATE</span>
                        )}
                      </Button>
                    </FormControl>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-8 bg-black border-4 border-white rounded-none" align="start">
                    <div className="coord mb-6 italic text-[#FF4D4D]">TEMPORAL.CALIBRATION</div>
                    <Calendar
                      mode="single"
                      selected={field.value}
                      onSelect={field.onChange}
                      disabled={date =>
                        date > new Date() || date < new Date('1900-01-01')
                      }
                      initialFocus
                      className="text-white bg-black p-0"
                    />
                  </PopoverContent>
                </Popover>
                <FormMessage className="font-mono text-[10px] text-red-500 uppercase" />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="subcategory"
            render={({ field }) => (
              <FormItem className="space-y-4">
                <FormLabel className="t-label text-[10px] font-black italic">SUBTAG_DATA</FormLabel>
                <FormControl>
                  <div className="relative group">
                    <div className="absolute left-6 top-1/2 -translate-y-1/2 w-2 h-6 bg-[#0070FF] opacity-20 group-focus-within:opacity-100 transition-opacity" />
                    <Input placeholder="E.G. META_STRING" {...field} className="h-20 pl-14 bg-transparent border-2 border-white rounded-none focus:ring-0 focus:border-white text-white placeholder:text-white/5 font-black uppercase text-xl" />
                  </div>
                </FormControl>
                <FormMessage className="font-mono text-[10px] text-red-500 uppercase" />
              </FormItem>
            )}
          />
        </div>

        <FormField
          control={form.control}
          name="notes"
          render={({ field }) => (
            <FormItem className="space-y-4">
              <FormLabel className="t-label text-[10px] font-black italic">ANNOTATION_LOG</FormLabel>
              <FormControl>
                <div className="relative">
                  <div className="absolute top-4 right-8 coord italic text-white/20">ANN.CORE</div>
                  <Textarea
                    placeholder="ENTER TRANSACTION NARRATIVE..."
                    {...field}
                    className="bg-transparent border-2 border-white rounded-none focus:ring-0 focus:border-white text-white placeholder:text-white/5 min-h-[160px] p-8 resize-none transition-all font-black uppercase text-sm leading-relaxed"
                  />
                </div>
              </FormControl>
              <FormMessage className="font-mono text-[10px] text-red-500 uppercase" />
            </FormItem>
          )}
        />

        <Button type="submit" className="w-full h-32 bg-white text-black hover:bg-[#FFD700] rounded-none p-0 overflow-hidden group transition-colors relative">
          <div className="absolute top-0 right-0 w-8 h-8 bauhaus-blue" />
          <div className="flex items-center justify-center gap-6">
            <div className="w-12 h-12 border-4 border-black flex items-center justify-center group-hover:rotate-90 transition-transform">
              <Plus className="h-8 w-8" />
            </div>
            <span className="text-3xl font-black uppercase tracking-[0.4em]">
              {isEditMode ? 'UPDATE_EVENT' : 'COMMIT_PAYLOAD'}
            </span>
          </div>
        </Button>
      </form>
    </Form>
  );
}
