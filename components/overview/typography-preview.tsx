import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/registry/ninaero/ui/table";

export default function TypographyPreview() {
  return (
    <div className="flex min-w-0 flex-col gap-6 text-sm leading-relaxed">
      <h2 className="text-3xl font-semibold tracking-tight">A quieter place to work</h2>
      <p className="text-base text-muted-foreground">
        A readable type scale gives headings, body copy, and supporting information distinct jobs.
      </p>
      <section className="space-y-3">
        <h3 className="text-xl font-semibold tracking-tight">Start with a clear hierarchy</h3>
        <p>
          Keep paragraphs focused on one idea. Use{" "}
          <strong className="font-semibold">strong emphasis</strong> for important words,{" "}
          <em>italics</em> for a change of voice, and{" "}
          <a href="https://ui.shadcn.com/docs/typeset" className="underline underline-offset-4">
            descriptive links
          </a>{" "}
          for destinations.
        </p>
        <blockquote className="border-l-2 pl-4 italic text-muted-foreground">
          “Typography should help the reader find the next sentence.”
        </blockquote>
      </section>
      <section className="space-y-3">
        <h4 className="text-base font-semibold">Keep the rhythm consistent</h4>
        <ul className="list-disc space-y-1 pl-5">
          <li>Use semantic headings in order.</li>
          <li>Keep line lengths comfortable.</li>
          <li>Preserve text exactly: æ, ø, å.</li>
        </ul>
        <p>
          Use{" "}
          <code className="rounded-sm border bg-muted px-1 py-0.5 font-mono text-xs">
            font-mono
          </code>{" "}
          for inline code, not for long paragraphs.
        </p>
      </section>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Text</TableHead>
            <TableHead>Purpose</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          <TableRow>
            <TableCell className="font-medium">Heading</TableCell>
            <TableCell>Introduce a section</TableCell>
          </TableRow>
          <TableRow>
            <TableCell className="font-medium">Body</TableCell>
            <TableCell>Explain an idea</TableCell>
          </TableRow>
          <TableRow>
            <TableCell className="font-medium">Supporting text</TableCell>
            <TableCell>Add context</TableCell>
          </TableRow>
        </TableBody>
      </Table>
      <p className="text-xs text-muted-foreground">
        This specimen uses explicit Ninaero typography utilities. Typeset is a separate upstream CSS
        guide, not a dependency of this example.
      </p>
    </div>
  );
}
