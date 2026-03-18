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
import { CalendarIcon, ChevronRight } from 'lucide-react';
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
      toast({ 
        title: 'PAYLOAD_COMMITTED', 
        description: `Successfully synchronized ₹${values.amount} to the matrix.`,
        variant: "default"
      });
      router.push('/');
    }
  }

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(handleFormSubmit)}
        className="space-y-16"
      >
        <FormField
          control={form.control}
          name="amount"
          render={({ field }) => (
            <FormItem className="space-y-4">
              <FormLabel className="t-label-jost opacity-100">QUANTUM_VALUE</FormLabel>
              <FormControl>
                <div className="relative group">
                    <span className="absolute left-0 top-1/2 -translate-y-1/2 font-title text-5xl italic opacity-20 group-focus-within:opacity-100 transition-opacity">₹</span>
                    <Input
                    type="number"
                    placeholder="0.00"
                    {...field}
                    className="h-32 bg-transparent border-0 border-b border-foreground/5 focus:border-art-blush rounded-none text-[clamp(4rem,10vw,8rem)] font-title italic leading-none px-12 focus:ring-0 transition-all placeholder:opacity-5"
                    onChange={e => field.onChange(Math.abs(Number(e.target.value)))}
                    />
                </div>
              </FormControl>
              <FormMessage className="font-ui text-[10px] text-red-500 uppercase font-black" />
            </FormItem>
          )}
        />

        <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
            <FormField
            control={form.control}
            name="merchant"
            render={({ field }) => (
                <FormItem className="space-y-4">
                <FormLabel className="t-label-jost opacity-100">ENTITY_ID</FormLabel>
                <FormControl>
                    <Input 
                      placeholder="E.G. AMAZON_CORE" 
                      {...field} 
                      className="h-20 bg-foreground/5 border-0 rounded-2xl focus:ring-2 focus:ring-art-blush text-foreground font-ui font-bold uppercase tracking-widest text-lg px-8" 
                    />
                </FormControl>
                <FormMessage className="font-ui text-[10px] text-red-500 uppercase font-black" />
                </FormItem>
            )}
            />

            <FormField
            control={form.control}
            name="category"
            render={({ field }) => (
                <FormItem className="space-y-4">
                <FormLabel className="t-label-jost opacity-100">ALLOCATION_NODE</FormLabel>
                <Select onValueChange={field.onChange} defaultValue={field.value} value={field.value}>
                    <FormControl>
                    <SelectTrigger className="h-20 bg-foreground/5 border-0 rounded-2xl focus:ring-2 focus:ring-art-blush text-foreground font-ui font-bold uppercase tracking-widest text-sm px-8">
                        <SelectValue placeholder="Select Node" />
                    </SelectTrigger>
                    </FormControl>
                    <SelectContent className="bg-art-ivory dark:bg-art-charcoal border-foreground/10 rounded-2xl">
                    {categories.map(category => (
                        <SelectItem key={category.id} value={category.id} className="font-ui font-semibold uppercase text-[10px] tracking-widest">
                        {category.name}
                        </SelectItem>
                    ))}
                    </SelectContent>
                </Select>
                <FormMessage className="font-ui text-[10px] text-red-500 uppercase font-black" />
                </FormItem>
            )}
            />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
            <FormField
            control={form.control}
            name="date"
            render={({ field }) => (
                <FormItem className="flex flex-col space-y-4">
                <FormLabel className="t-label-jost opacity-100">TIMESTAMP</FormLabel>
                <Popover>
                    <PopoverTrigger asChild>
                    <FormControl>
                        <Button
                        variant={'outline'}
                        className={cn(
                            'h-20 bg-foreground/5 border-0 rounded-2xl focus:ring-2 focus:ring-art-blush text-foreground font-ui font-bold uppercase tracking-widest text-sm px-8 justify-start',
                            !field.value && 'opacity-30'
                        )}
                        >
                        {field.value ? (
                            format(field.value, 'PPP').toUpperCase()
                        ) : (
                            <span>Pick a date</span>
                        )}
                        <CalendarIcon className="ml-auto h-4 w-4 opacity-30" />
                        </Button>
                    </FormControl>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0 border-foreground/10 rounded-[2rem] overflow-hidden" align="start">
                    <Calendar
                        mode="single"
                        selected={field.value}
                        onSelect={field.onChange}
                        disabled={date =>
                        date > new Date() || date < new Date('1900-01-01')
                        }
                        initialFocus
                    />
                    </PopoverContent>
                </Popover>
                <FormMessage className="font-ui text-[10px] text-red-500 uppercase font-black" />
                </FormItem>
            )}
            />

            <FormField
            control={form.control}
            name="notes"
            render={({ field }) => (
                <FormItem className="space-y-4">
                <FormLabel className="t-label-jost opacity-100">ANNOTATION (OPTIONAL)</FormLabel>
                <FormControl>
                    <Textarea
                    placeholder="Describe transaction context..."
                    {...field}
                    className="min-h-[5rem] bg-foreground/5 border-0 rounded-2xl focus:ring-2 focus:ring-art-blush text-foreground font-ui font-medium text-sm p-6"
                    />
                </FormControl>
                <FormMessage className="font-ui text-[10px] text-red-500 uppercase font-black" />
                </FormItem>
            )}
            />
        </div>

        <Button type="submit" className="w-full h-32 bg-foreground text-background hover:bg-art-blush hover:text-art-charcoal rounded-[2.5rem] transition-all duration-700 flex flex-col items-center justify-center group/btn shadow-[0_40px_80px_-20px_rgba(0,0,0,0.1)]">
            <div className="flex flex-col items-center gap-2">
                <div className="font-title text-4xl italic tracking-wide">Commit_Payload</div>
                <div className="t-label-jost opacity-50 group-hover:opacity-100 transition-opacity">Protocol Finalization</div>
            </div>
            <ChevronRight className="h-6 w-6 mt-2 opacity-0 group-hover:opacity-100 translate-y-4 group-hover:translate-y-0 transition-all duration-700" />
        </Button>
      </form>
    </Form>
  );
}
