import Image from 'next/image';
import Link from 'next/link';

export default function Logo() {
  return (
    <Link href="/" className="flex flex-col items-center justify-center gap-2">
      <div className="relative w-24 h-24">
        <Image
          src="/pocketfulofzest_logo_2.png"
          alt="Pocketful of Zest logo"
          fill
          className="object-contain"
        />
      </div>
      <div className="font-heading text-3xl font-bold text-zest-green-dark tracking-tight">
        pocketful<span className="text-zest-orange">ofzest</span>
      </div>
    </Link>
  );
}
