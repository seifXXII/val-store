interface CustomersHeaderProps {
  total: number;
}

export function CustomersHeader({ total }: CustomersHeaderProps) {
  return (
    <div className="flex justify-between items-center mb-6">
      <div>
        <h1 className="text-2xl font-bold">Customers</h1>
        <p className="text-muted-foreground">{total} registered users</p>
      </div>
    </div>
  );
}
