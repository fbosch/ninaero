import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/registry/ninaero/ui/table";

const surfaces = [
  { token: "Background", role: "Page" },
  { token: "Card", role: "Surface" },
  { token: "Popover", role: "Overlay" },
];

export function TablePreview() {
  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Token</TableHead>
          <TableHead>Role</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {surfaces.map((surface) => (
          <TableRow key={surface.token}>
            <TableCell>{surface.token}</TableCell>
            <TableCell className="text-muted-foreground">{surface.role}</TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
}
