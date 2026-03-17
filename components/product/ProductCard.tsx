import Link from "next/link";

type Product = {
  id: string;
  name: string;
  price: number | string;
  oldPrice?: number | string;
  image?: string;
  slug?: string;
};

export function ProductCard({ product }: { product: Product }) {
  return (
    <Link href={`/product/${product.id}`} className="block">
      <div className="overflow-hidden rounded-[24px] bg-white/95 shadow-[0_12px_30px_rgba(15,23,42,0.06)] ring-1 ring-black/5 transition hover:-translate-y-0.5">
        <div className="flex aspect-square items-center justify-center bg-[linear-gradient(180deg,#F8FBFA_0%,#EEF3F1_100%)]">
          {product.image ? (
            <img
              src={product.image}
              alt={product.name}
              className="h-full w-full object-cover"
            />
          ) : (
            <div className="flex h-16 w-16 items-center justify-center rounded-[20px] bg-white text-[#004F45] shadow-[0_8px_20px_rgba(0,0,0,0.06)] ring-1 ring-black/5">
              <span className="text-sm font-bold">MARVA</span>
            </div>
          )}
        </div>

        <div className="p-3">
          <p className="text-xs text-[#5D7E78]">Dental mahsulot</p>

          <h3 className="mt-1 line-clamp-2 min-h-[52px] text-[16px] font-semibold leading-6 text-[#12332D]">
            {product.name}
          </h3>

          <div className="mt-3 flex items-end justify-between gap-2">
            <div>
              {product.oldPrice ? (
                <p className="text-xs text-[#8AA09A] line-through">
                  ${product.oldPrice}
                </p>
              ) : null}

              <p className="text-[18px] font-bold text-[#004F45]">
                ${product.price}
              </p>
            </div>

            <div className="rounded-full bg-[#004F45] px-3 py-2 text-xs font-semibold text-white shadow-[0_12px_24px_rgba(0,79,69,0.20)] ring-1 ring-white/10">
              Ko'rish
            </div>
          </div>
        </div>
      </div>
    </Link>
  );
}
