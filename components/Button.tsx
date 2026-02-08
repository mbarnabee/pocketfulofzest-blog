import Link from 'next/link';

interface ButtonProps {
  href: string;
  children: React.ReactNode;
}

export default function Button({ href, children }: ButtonProps) {
  return (
    <Link
      href={href}
      className="inline-flex items-center px-8 py-4 bg-zest-orange text-white font-semibold text-lg rounded-lg shadow-md hover:bg-zest-orange-hover hover:shadow-lg transition-all duration-200 hover:-translate-y-0.5"
    >
      {children}
    </Link>
  );
}
