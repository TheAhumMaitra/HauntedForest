import Image from "next/image";
import Link from "next/link";
export default function CurrentlyWprking() {
  return (
    <div className="w-full h-full p-2 bg-card! flex justify-between items-center flex-col gap-2">
      <h2 className="xl sm:text-2xl mt-7 text-center font-bold">I am currently working on..</h2>
      <div className="w-full h-80 p-2 rounded-2xl">
        <Link href="https://github.com/TheAhumMaitra/Itomori">
         <h2>Itomori</h2>
        </Link>
      </div>
    </div>
  );
}
