import { AiTipsForm } from '@/components/ai-tips-form';
import { Lightbulb } from 'lucide-react';

export default function AiTipsPage() {
  return (
    <main className="flex-1 p-4 sm:p-6 flex justify-center items-start pt-16">
      <div className="w-full max-w-2xl">
        <div className="text-center mb-8">
          <div className="inline-block p-4 bg-primary/20 rounded-full mb-4">
            <Lightbulb className="size-10 text-accent" />
          </div>
          <h1 className="text-3xl font-bold text-white">AI Financial Advisor</h1>
          <p className="text-muted-foreground mt-2">
            Describe your spending patterns to receive personalized financial tips. The more detail you provide, the better the advice.
          </p>
        </div>
        <AiTipsForm />
      </div>
    </main>
  );
}
