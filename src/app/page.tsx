import Image from "next/image";
import { sql } from "@/lib/db";
import { AddToCartButton } from "@/components/AddToCartButton";
export const dynamic = 'force-dynamic';

interface Coffee {
  id: number;
  name: string;
  origin: string;
  roast_level: string;
  price: number;
  notes: string | null;
  description: string;
  image_url: string | null;
  stock_quantity: number;
}

async function getCoffees(): Promise<Coffee[]> {
  try {
    const coffees = await sql`
      SELECT id, name, origin, roast_level, price, notes, description, image_url,
             COALESCE(stock_quantity, 0) AS stock_quantity
      FROM coffees
      WHERE COALESCE(is_active, true) = true
      ORDER BY id
    `;
    return coffees as Coffee[];
  } catch (error) {
    console.error("Failed to fetch coffees:", error);
    return [];
  }
}

export default async function Home() {
  const coffees = await getCoffees();

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="py-20 px-6 text-center">
        <h1 className="text-5xl md:text-6xl font-serif font-bold mb-6 text-[#1A120B]">
          Bean & Brew
        </h1>
        <p className="text-xl md:text-2xl text-[#3C2A21] max-w-2xl mx-auto leading-relaxed">
          Discover our curated selection of specialty coffees, roasted with precision and passion.
        </p>
      </section>

      {/* Coffee Catalog */}
      <section className="px-6 pb-20">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-3xl font-serif font-bold text-center mb-12 text-[#1A120B]">
            Our Roasts
          </h2>

          {coffees.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-lg text-[#3C2A21]">No coffees available at the moment.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {coffees.map((coffee) => (
                <div
                  key={coffee.id}
                  className="bg-white rounded-lg shadow-sm hover:shadow-md transition-shadow duration-300 overflow-hidden"
                >
                  <div className="aspect-square relative bg-[#3C2A21]">
                    {coffee.image_url ? (
                      <Image
                        src={coffee.image_url}
                        alt={coffee.name}
                        fill
                        className="object-cover"
                        sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center">
                        <span className="text-[#FAF8F6] text-6xl opacity-30">&#9749;</span>
                      </div>
                    )}
                  </div>

                  <div className="p-6">
                    <div className="flex items-start justify-between mb-3">
                      <h3 className="text-xl font-serif font-bold text-[#1A120B]">
                        {coffee.name}
                      </h3>
                      <span className="bg-[#3C2A21] text-[#FAF8F6] px-3 py-1 rounded-full text-sm font-medium">
                        {coffee.origin}
                      </span>
                    </div>

                    <div className="flex items-center gap-2 mb-3">
                      <span className="text-sm text-[#3C2A21] font-medium">
                        {coffee.roast_level} Roast
                      </span>
                    </div>

                    <p className="text-[#1A120B] mb-4 line-clamp-2">
                      {coffee.description}
                    </p>

                    <div className="flex flex-wrap gap-2 mb-4">
                      {coffee.notes?.split(',').map((note, index) => (
                        <span
                          key={index}
                          className="bg-[#B68D40] text-[#1A120B] px-2 py-1 rounded text-xs font-medium"
                        >
                          {note.trim()}
                        </span>
                      ))}
                    </div>

                    <div className="flex items-center justify-between">
                      <span className="text-2xl font-serif font-bold text-[#1A120B]">
                        ${coffee.price}
                      </span>
                      {coffee.stock_quantity > 0 ? (
                        <AddToCartButton coffee={{
                          id: coffee.id,
                          name: coffee.name,
                          origin: coffee.origin,
                          price: coffee.price,
                          image_url: coffee.image_url,
                        }} />
                      ) : (
                        <span className="text-sm font-medium text-[#3C2A21]/60 border border-[#3C2A21]/20 px-4 py-2 rounded">
                          Out of Stock
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </section>
    </div>
  );
}
