import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/registry/ninaero/ui/accordion";

export function AccordionPreview() {
  return (
    <div className="w-full max-w-72">
      <Accordion defaultValue={["details"]}>
        <AccordionItem value="details">
          <AccordionTrigger>What is included?</AccordionTrigger>
          <AccordionContent>Buttons, menus, and other interface components.</AccordionContent>
        </AccordionItem>
        <AccordionItem value="usage">
          <AccordionTrigger>Where can I use them?</AccordionTrigger>
          <AccordionContent>In your own interface.</AccordionContent>
        </AccordionItem>
      </Accordion>
    </div>
  );
}
