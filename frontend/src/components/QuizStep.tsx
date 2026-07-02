import { ReactNode } from 'react';

export const QuizStep = ({ title, children }: { title: string; children: ReactNode }) => (
  <section className="rounded-lg border border-slate-200 bg-white p-6 shadow-sm">
    <h1 className="text-2xl font-bold text-ink">{title}</h1>
    <div className="mt-6">{children}</div>
  </section>
);
