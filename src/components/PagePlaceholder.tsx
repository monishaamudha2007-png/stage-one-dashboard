export function PagePlaceholder({ title }: { title: string }) {
  return (
    <div className="mx-auto max-w-5xl">
      <h1 className="text-2xl font-semibold md:text-3xl">{title}</h1>
      <p className="mt-2 text-sm text-muted-foreground">This page is coming in the next stage.</p>
    </div>
  );
}
