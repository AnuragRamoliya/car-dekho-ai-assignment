import { useFilterStore } from '../store/filterStore';

export const FilterBar = () => {
  const filters = useFilterStore();

  return (
    <section className="grid gap-3 rounded-lg border border-slate-200 bg-white p-4 md:grid-cols-6">
      <input
        value={filters.search}
        onChange={(event) => filters.setFilter('search', event.target.value)}
        placeholder="Search make or model"
        className="rounded-md border border-slate-300 px-3 py-2 md:col-span-2"
      />
      <select value={filters.bodyType} onChange={(event) => filters.setFilter('bodyType', event.target.value)} className="rounded-md border border-slate-300 px-3 py-2">
        <option value="any">Any body</option>
        <option value="hatchback">Hatchback</option>
        <option value="sedan">Sedan</option>
        <option value="suv">SUV</option>
        <option value="muv">MUV</option>
      </select>
      <select value={filters.fuelType} onChange={(event) => filters.setFilter('fuelType', event.target.value)} className="rounded-md border border-slate-300 px-3 py-2">
        <option value="any">Any fuel</option>
        <option value="petrol">Petrol</option>
        <option value="diesel">Diesel</option>
        <option value="electric">Electric</option>
        <option value="hybrid">Hybrid</option>
        <option value="cng">CNG</option>
      </select>
      <select value={filters.sortBy} onChange={(event) => filters.setFilter('sortBy', event.target.value)} className="rounded-md border border-slate-300 px-3 py-2">
        <option value="priceAsc">Price low to high</option>
        <option value="priceDesc">Price high to low</option>
        <option value="mileage">Best mileage</option>
        <option value="safety">Best safety</option>
        <option value="power">Most power</option>
      </select>
      <button type="button" onClick={filters.reset} className="rounded-md border border-slate-300 px-3 py-2 font-semibold text-slate-700">
        Reset
      </button>
    </section>
  );
};
