import { Avatar, AvatarFallback } from "@/registry/ninaero/ui/avatar";
import { Bubble, BubbleContent } from "@/registry/ninaero/ui/bubble";
import {
  Message,
  MessageAvatar,
  MessageContent,
  MessageFooter,
  MessageHeader,
} from "@/registry/ninaero/ui/message";

export function MessagePreview() {
  return (
    <Message>
      <MessageAvatar>
        <Avatar>
          <AvatarFallback>NA</AvatarFallback>
        </Avatar>
      </MessageAvatar>
      <MessageContent>
        <MessageHeader>Example author</MessageHeader>
        <Bubble variant="secondary">
          <BubbleContent>Here is the neutral baseline.</BubbleContent>
        </Bubble>
        <MessageFooter>
          <time dateTime="10:42">10:42</time>
        </MessageFooter>
      </MessageContent>
    </Message>
  );
}
