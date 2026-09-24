import Link from "next/link";

export default function NotFound() {
  return (
    <section className="container-x py-28 md:py-40">
      <p className="eyebrow">Page not found</p>
      <h1 className="display-2 mt-5 max-w-2xl">This page isn&rsquo;t available.</h1>
      <div className="mt-10 flex flex-col gap-3 sm:flex-row">
        <Link href="/" className="btn btn-primary">
          Return home
        </Link>
        <Link href="/book/" className="btn btn-secondary">
          Book Consultation
        </Link>
      </div>
    </section>
  );
}
