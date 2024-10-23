import Link from 'next/link';

export default function HomePage() {
  return (
    <main className="flex flex-1 gap-2 flex-col justify-center text-center">
      <h1 className="mb-4 text-2xl font-bold">Get a grip on your data<br/> with bamboost</h1>
      <p className="text-muted-foreground">
        Click here{' '}
        <Link
          href="/docs"
          className="text-[hsl(var(--primary-2))] font-semibold underline"
        >
          /docs
        </Link>{' '}
        and see the documentation.
      </p>
      <p className="text-muted-foreground">
        Or here{' '}
        <Link
          href="/apidocs"
          className="text-[hsl(var(--primary))] font-semibold underline"
        >
          /apidocs
        </Link>{' '}
        for the API reference.
      </p>
    </main>
  );
}
