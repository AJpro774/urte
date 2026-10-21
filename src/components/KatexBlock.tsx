import katex from "katex";
import "katex/dist/katex.min.css";

export function KatexBlock({ latex }: { latex: string }) {
  const html = katex.renderToString(latex, {
    throwOnError: false,
    displayMode: true,
  });
  return (
    <div
      className="katex-block"
      dangerouslySetInnerHTML={{ __html: html }}
    />
  );
}
