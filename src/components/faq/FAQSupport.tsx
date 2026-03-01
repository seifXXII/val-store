export function FAQSupport() {
  return (
    <div className="mt-12 p-6 bg-muted rounded-lg max-w-3xl">
      <h2 className="text-xl font-semibold mb-2">Still have questions?</h2>
      <p className="text-muted-foreground">
        Can&apos;t find what you&apos;re looking for? Contact our support team
        at{" "}
        <a
          href="mailto:support@valstore.com"
          className="text-primary hover:underline"
        >
          support@valstore.com
        </a>
      </p>
    </div>
  );
}
