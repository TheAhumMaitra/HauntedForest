import { Badge } from "@/components/ui/badge";
import Link from "next/link";

export default function Page() {
  return (
    <>
      <main className="min-h-screen w-full flex flex-col justify-start mt-3 items-center gap-3">
        <h2 className="text-2xl font-bold">All Authors:</h2>
        <div className="w-100 h-full p-5 font-bold text-left bg-card rounded-2xl">
          <Link
            href={"/authors/ahummaitra"}
            className="hover:text-purple-500
                "
          >
            <h1 className="text-2xl">Ahum Maitra</h1>
          </Link>
          <div className="flex justify-start items-start gap-4 mt-4">
            <span>
              <Badge variant="outline" className="scale-120">
                Admin
              </Badge>
            </span>
            <span>
              <Badge variant="secondary" className="scale-120">
                Writer
              </Badge>
            </span>
            <span>
              <Badge variant="destructive" className="scale-120">
                Owner
              </Badge>
            </span>
          </div>
        </div>
      </main>
    </>
  );
}
