export default function AdminLoading() {
  return (
    <div className="px-10 py-8">
      <div className="h-8 w-64 bg-gray-100 rounded animate-pulse mb-2" />
      <div className="h-4 w-48 bg-gray-100 rounded animate-pulse mb-7" />
      <div className="grid grid-cols-4 gap-4 mb-7">
        {[0, 1, 2, 3].map((i) => (
          <div key={i} className="h-[100px] rounded-lg border border-gray-100 bg-white animate-pulse" />
        ))}
      </div>
      <div className="h-9 w-80 bg-gray-100 rounded-md animate-pulse mb-5" />
      <div className="rounded-lg border border-gray-100 bg-white overflow-hidden shadow-card">
        {[0, 1, 2, 3, 4].map((i) => (
          <div key={i} className="h-16 bg-gray-50 border-b border-gray-100 last:border-0 animate-pulse" />
        ))}
      </div>
    </div>
  );
}
