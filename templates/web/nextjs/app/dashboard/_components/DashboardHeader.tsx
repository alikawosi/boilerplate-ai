export function DashboardHeader({ title }: { title: string }) {
  return (
    <div className="flex items-center justify-between space-y-2 border-b pb-4 mb-4">
      <h2 className="text-3xl font-bold tracking-tight">{title}</h2>
      <div className="flex items-center space-x-2">
        {/* UserAvatar or DatePicker could go here */}
      </div>
    </div>
  );
}
