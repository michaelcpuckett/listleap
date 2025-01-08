import { marked } from 'marked';

export default function MarkdownPreview({ value }: { value: string }) {
  return (
    <div
      dangerouslySetInnerHTML={{
        __html: marked(value),
      }}
    />
  );
}
