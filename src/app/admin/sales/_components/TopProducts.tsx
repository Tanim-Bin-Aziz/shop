import { TopProduct } from "@/hooks/useSalesData";
import Image from "next/image";

interface Props {
  data: TopProduct[];
}

export function TopProducts({ data }: Props) {
  const max = data[0]?.total_revenue ?? 1;

  return (
    <div className="rounded-xl border bg-card p-6 space-y-4 shadow-sm">
      <div>
        <h2 className="font-semibold text-base">Top Products</h2>
        <p className="text-xs text-muted-foreground">By revenue</p>
      </div>

      <div className="space-y-4">
        {data.length === 0 && (
          <p className="text-sm text-muted-foreground text-center py-8">
            No data yet.
          </p>
        )}
        {data.map((product, i) => (
          <div key={product.product_id} className="flex items-center gap-3">
            {/* Rank */}
            <span className="text-sm font-bold text-muted-foreground w-4">
              {i + 1}
            </span>

            {/* Image */}
            <div className="relative h-9 w-9 rounded-md overflow-hidden border bg-muted flex-shrink-0">
              {product.image_url ? (
                <Image
                  src={product.image_url}
                  alt={product.name}
                  fill
                  className="object-cover"
                />
              ) : (
                <div className="h-full w-full flex items-center justify-center text-[10px] text-muted-foreground">
                  N/A
                </div>
              )}
            </div>

            {/* Info + Bar */}
            <div className="flex-1 min-w-0 space-y-1">
              <div className="flex items-center justify-between">
                <p className="text-sm font-medium truncate">{product.name}</p>
                <p className="text-sm font-semibold text-right ml-2">
                  ৳{product.total_revenue.toFixed(0)}
                </p>
              </div>
              <div className="h-1.5 w-full bg-muted rounded-full overflow-hidden">
                <div
                  className="h-full bg-primary rounded-full transition-all"
                  style={{
                    width: `${(product.total_revenue / max) * 100}%`,
                  }}
                />
              </div>
              <p className="text-xs text-muted-foreground">
                {product.total_sold} units sold
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
