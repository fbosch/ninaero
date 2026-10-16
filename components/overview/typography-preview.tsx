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
    <div className="flex min-w-0 flex-col gap-6 text-sm type-prose">
      <h2 className="text-3xl type-display">A quieter place to work</h2>
      <p className="text-base type-prose text-muted-foreground">
        A readable type scale gives headings, body copy, and supporting information distinct jobs.
      </p>
      <section className="space-y-3">
        <h3 className="text-xl type-heading">Start with a clear hierarchy</h3>
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
        <h4 className="text-base type-title">Keep the rhythm consistent</h4>
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
            <TableHead>Utility</TableHead>
            <TableHead>Purpose</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {[
            ["Display", "type-display", "Introduce a page"],
            ["Heading", "type-heading", "Introduce a section"],
            ["Title", "type-title", "Name a card or dialog"],
            ["Body", "type-body", "Explain a field or interface"],
            ["Prose", "type-prose", "Read continuous text"],
            ["Label", "type-label", "Identify an action or control"],
            ["Caption", "type-caption", "Add compact supporting text"],
          ].map(([role, utility, purpose]) => (
            <TableRow key={utility}>
              <TableCell className="font-medium">{role}</TableCell>
              <TableCell>
                <code className="font-mono text-xs">{utility}</code>
              </TableCell>
              <TableCell>{purpose}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
      <p className="text-xs type-caption text-muted-foreground">
        Pair a font size with a role utility. Roles set weight, line height, and letter spacing;
        sizes remain independent. Typeset is a separate upstream CSS guide, not a dependency of this
        example.
      </p>
    </div>
  );
}
