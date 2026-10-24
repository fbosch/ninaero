import {
  ResizableHandle,
  ResizablePanel,
  ResizablePanelGroup,
} from "@/registry/ninaero/ui/resizable";

export function ResizablePreview() {
  return (
    <ResizablePanelGroup orientation="horizontal" className="h-36 w-full rounded-lg border">
      <ResizablePanel defaultSize="40%" minSize="20%">
        <div className="flex h-full items-center justify-center text-sm">Panel one</div>
      </ResizablePanel>
      <ResizableHandle withHandle aria-label="Resize example panels" />
      <ResizablePanel defaultSize="60%" minSize="20%">
        <div className="flex h-full items-center justify-center text-sm">Panel two</div>
      </ResizablePanel>
    </ResizablePanelGroup>
  );
}
