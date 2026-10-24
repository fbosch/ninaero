import {
  MessageScroller,
  MessageScrollerButton,
  MessageScrollerContent,
  MessageScrollerItem,
  MessageScrollerProvider,
  MessageScrollerViewport,
} from "@/registry/ninaero/ui/message-scroller";

const messages = [
  "Choose a surface.",
  "Compare the borders.",
  "Try the dark theme.",
  "Check the text contrast.",
  "Inspect the focus ring.",
  "The preview is ready.",
];

export function MessageScrollerPreview() {
  return (
    <MessageScrollerProvider>
      <MessageScroller className="h-40 w-full rounded-lg border">
        <MessageScrollerViewport className="p-3">
          <MessageScrollerContent className="gap-3">
            {messages.map((message) => (
              <MessageScrollerItem key={message}>
                <p className="rounded-lg bg-muted px-3 py-2 text-sm">{message}</p>
              </MessageScrollerItem>
            ))}
          </MessageScrollerContent>
        </MessageScrollerViewport>
        <MessageScrollerButton />
      </MessageScroller>
    </MessageScrollerProvider>
  );
}
