export default function SingleLineCodeBlock({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <pre
      className="relative font-mono bg-black shadow-thin-border-300 rounded-lg my-4 text-sm text-gray-200 pl-6 pt-2"
      style={{
        minHeight: "36px",
        lineHeight: "1.5em",
        maxWidth: "400px",
      }}
    >
      <code>{children}</code>
    </pre>
  );
}
