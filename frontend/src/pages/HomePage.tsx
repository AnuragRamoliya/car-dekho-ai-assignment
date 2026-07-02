import { Link } from 'react-router-dom';

export const HomePage = () => (
  <div className="grid items-center gap-8 py-8 md:grid-cols-[1fr_0.9fr]">
    <section className="space-y-6">
      <p className="font-semibold uppercase tracking-wide text-coral">Car Dekho decision assistant</p>
      <h1 className="max-w-3xl text-4xl font-bold leading-tight text-ink md:text-6xl">Find 3 cars you can feel good about.</h1>
      <p className="max-w-2xl text-lg text-slate-600">
        Shortlist turns budget, usage, body style, fuel preference, and must-have priorities into ranked recommendations you can compare side by side.
      </p>
      <div className="flex flex-wrap gap-3">
        <Link to="/quiz" className="rounded-md bg-reef px-5 py-3 font-semibold text-white">
          Find my car
        </Link>
        <Link to="/browse" className="rounded-md border border-slate-300 bg-white px-5 py-3 font-semibold text-slate-700">
          Browse catalog
        </Link>
      </div>
    </section>
    <section className="overflow-hidden rounded-lg border border-slate-200 bg-white shadow-sm">
      <img
        src="https://images.unsplash.com/photo-1492144534655-ae79c964c9d7?auto=format&fit=crop&w=1200&q=80"
        alt="Car parked on a scenic road"
        className="h-80 w-full object-cover"
      />
      <div className="grid grid-cols-3 gap-2 p-4 text-center text-sm">
        <div>
          <strong className="block text-2xl text-reef">32</strong>
          cars seeded
        </div>
        <div>
          <strong className="block text-2xl text-reef">5</strong>
          quiz steps
        </div>
        <div>
          <strong className="block text-2xl text-reef">100</strong>
          point score
        </div>
      </div>
    </section>
  </div>
);
