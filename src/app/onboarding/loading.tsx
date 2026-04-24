export default function OnboardingLoading() {
  return (
    <div className="w-full max-w-[760px] px-12 py-10">
      <div className="h-4 w-24 bg-gray-100 rounded-pill animate-pulse mb-3" />
      <div className="h-7 w-64 bg-gray-100 rounded animate-pulse mb-2" />
      <div className="h-4 w-96 bg-gray-100 rounded animate-pulse mb-8" />
      <div className="rounded-lg border border-gray-100 bg-white p-6 shadow-card">
        <div className="flex flex-col gap-3">
          {[0, 1, 2, 3].map((i) => (
            <div key={i} className="h-14 bg-gray-50 rounded-md animate-pulse" />
          ))}
        </div>
      </div>
    </div>
  );
}
