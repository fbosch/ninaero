"use client";

import { FileTextIcon, InboxIcon, MessageCircleIcon } from "lucide-react";
import dynamic from "next/dynamic";
import type { ComponentType } from "react";
import type { DisplayName, PreviewProps } from "@/lib/component-overview";
import {
  Alert,
  AlertDescription,
  AlertTitle,
} from "@/registry/ninaero/ui/alert";
import { AspectRatio } from "@/registry/ninaero/ui/aspect-ratio";
import {
  Attachment,
  AttachmentContent,
  AttachmentDescription,
  AttachmentMedia,
  AttachmentTitle,
} from "@/registry/ninaero/ui/attachment";
import {
  Avatar,
  AvatarFallback,
  AvatarGroup,
} from "@/registry/ninaero/ui/avatar";
import { Badge } from "@/registry/ninaero/ui/badge";
import {
  Bubble,
  BubbleContent,
  BubbleGroup,
} from "@/registry/ninaero/ui/bubble";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/registry/ninaero/ui/card";
import { DirectionProvider } from "@/registry/ninaero/ui/direction";
import {
  Empty,
  EmptyDescription,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle,
} from "@/registry/ninaero/ui/empty";
import {
  Item,
  ItemContent,
  ItemDescription,
  ItemMedia,
  ItemTitle,
} from "@/registry/ninaero/ui/item";
import { Kbd, KbdGroup } from "@/registry/ninaero/ui/kbd";
import {
  Marker,
  MarkerContent,
  MarkerIcon,
} from "@/registry/ninaero/ui/marker";
import {
  Message,
  MessageAvatar,
  MessageContent,
  MessageFooter,
  MessageHeader,
} from "@/registry/ninaero/ui/message";
import {
  Progress,
  ProgressLabel,
  ProgressValue,
} from "@/registry/ninaero/ui/progress";
import { ScrollArea } from "@/registry/ninaero/ui/scroll-area";
import { Separator } from "@/registry/ninaero/ui/separator";
import { Skeleton } from "@/registry/ninaero/ui/skeleton";
import { Spinner } from "@/registry/ninaero/ui/spinner";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/registry/ninaero/ui/table";

function PreviewLoading() {
  return <p className="text-sm text-muted-foreground">Loading preview…</p>;
}

const ChartPreview = dynamic(
  () => import("./chart-preview").then((module) => module.ChartPreview),
  { loading: PreviewLoading },
);
const CarouselPreview = dynamic(
  () => import("./carousel-preview").then((module) => module.CarouselPreview),
  { loading: PreviewLoading },
);
const ResizablePreview = dynamic(
  () => import("./layout-previews").then((module) => module.ResizablePreview),
  { loading: PreviewLoading },
);
const SidebarPreview = dynamic(
  () => import("./layout-previews").then((module) => module.SidebarPreview),
  { loading: PreviewLoading },
);
const MessageScrollerPreview = dynamic(
  () =>
    import("./layout-previews").then((module) => module.MessageScrollerPreview),
  { loading: PreviewLoading },
);

const surfaces = [
  { token: "Background", role: "Page" },
  { token: "Card", role: "Surface" },
  { token: "Popover", role: "Overlay" },
];
const scrollRows = [
  "Background",
  "Foreground",
  "Card",
  "Popover",
  "Primary",
  "Secondary",
  "Muted",
  "Accent",
  "Border",
  "Input",
  "Ring",
  "Destructive",
];

export const displayPreviews = {
  alert: function AlertPreview() {
    return (
      <Alert>
        <MessageCircleIcon />
        <AlertTitle>Theme preview</AlertTitle>
        <AlertDescription>
          Compare the neutral surfaces and text contrast.
        </AlertDescription>
      </Alert>
    );
  },
  "aspect-ratio": function AspectRatioPreview() {
    return (
      <AspectRatio ratio={16 / 9} className="w-full rounded-lg border bg-muted">
        <div className="flex size-full items-center justify-center text-2xl font-medium">
          16 : 9
        </div>
      </AspectRatio>
    );
  },
  attachment: function AttachmentPreview() {
    return (
      <Attachment>
        <AttachmentMedia>
          <FileTextIcon />
        </AttachmentMedia>
        <AttachmentContent>
          <AttachmentTitle>example-tokens.json</AttachmentTitle>
          <AttachmentDescription>
            JSON · sample attachment
          </AttachmentDescription>
        </AttachmentContent>
      </Attachment>
    );
  },
  avatar: function AvatarPreview() {
    return (
      <AvatarGroup>
        <Avatar>
          <AvatarFallback>NA</AvatarFallback>
        </Avatar>
        <Avatar>
          <AvatarFallback>UI</AvatarFallback>
        </Avatar>
        <Avatar>
          <AvatarFallback>FE</AvatarFallback>
        </Avatar>
      </AvatarGroup>
    );
  },
  badge: function BadgePreview() {
    return (
      <div className="flex flex-wrap justify-center gap-2">
        <Badge>Default</Badge>
        <Badge variant="secondary">Secondary</Badge>
        <Badge variant="outline">Outline</Badge>
      </div>
    );
  },
  bubble: function BubblePreview() {
    return (
      <BubbleGroup className="w-full">
        <Bubble variant="secondary">
          <BubbleContent>How does this surface look?</BubbleContent>
        </Bubble>
        <Bubble align="end">
          <BubbleContent>Try the dark theme too.</BubbleContent>
        </Bubble>
      </BubbleGroup>
    );
  },
  card: function CardPreview() {
    return (
      <Card className="w-full">
        <CardHeader>
          <CardTitle>One shared theme</CardTitle>
          <CardDescription>The same tokens, on every surface.</CardDescription>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-muted-foreground">
            A compact card specimen.
          </p>
        </CardContent>
      </Card>
    );
  },
  carousel: CarouselPreview,
  chart: ChartPreview,
  direction: function DirectionPreview() {
    return (
      <div className="w-full space-y-4">
        <DirectionProvider direction="ltr">
          <div dir="ltr" className="flex gap-2">
            <Badge variant="outline">Start</Badge>
            <span className="text-sm">Left to right</span>
          </div>
        </DirectionProvider>
        <Separator />
        <DirectionProvider direction="rtl">
          <div dir="rtl" className="flex gap-2">
            <Badge variant="outline">Start</Badge>
            <span className="text-sm">Right to left</span>
          </div>
        </DirectionProvider>
      </div>
    );
  },
  empty: function EmptyPreview() {
    return (
      <Empty className="border">
        <EmptyHeader>
          <EmptyMedia variant="icon">
            <InboxIcon />
          </EmptyMedia>
          <EmptyTitle>No items</EmptyTitle>
          <EmptyDescription>An empty-state specimen.</EmptyDescription>
        </EmptyHeader>
      </Empty>
    );
  },
  item: function ItemPreview() {
    return (
      <Item variant="outline">
        <ItemMedia variant="icon">
          <FileTextIcon />
        </ItemMedia>
        <ItemContent>
          <ItemTitle>Theme tokens</ItemTitle>
          <ItemDescription>
            A shared palette for every component.
          </ItemDescription>
        </ItemContent>
      </Item>
    );
  },
  kbd: function KeyboardPreview() {
    return (
      <KbdGroup>
        <Kbd>⌘</Kbd>
        <Kbd>K</Kbd>
      </KbdGroup>
    );
  },
  marker: function MarkerPreview() {
    return (
      <Marker variant="separator">
        <MarkerIcon>
          <MessageCircleIcon />
        </MarkerIcon>
        <MarkerContent>Example conversation</MarkerContent>
      </Marker>
    );
  },
  message: function MessagePreview() {
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
  },
  "message-scroller": MessageScrollerPreview,
  progress: function ProgressPreview() {
    return (
      <Progress value={62} className="w-full">
        <ProgressLabel>Example progress</ProgressLabel>
        <ProgressValue />
      </Progress>
    );
  },
  resizable: ResizablePreview,
  "scroll-area": function ScrollAreaPreview() {
    return (
      <ScrollArea className="h-36 w-full rounded-lg border">
        <div className="p-3">
          {scrollRows.map((token) => (
            <p key={token} className="border-b py-2 text-sm last:border-0">
              {token}
            </p>
          ))}
        </div>
      </ScrollArea>
    );
  },
  separator: function SeparatorPreview() {
    return (
      <div className="w-full space-y-4 text-sm">
        <p>Content above</p>
        <Separator />
        <p className="text-muted-foreground">Content below</p>
      </div>
    );
  },
  sidebar: SidebarPreview,
  skeleton: function SkeletonPreview() {
    return (
      <div className="w-full space-y-3">
        <div className="flex items-center gap-3">
          <Skeleton className="size-10 rounded-full" />
          <div className="flex-1 space-y-2">
            <Skeleton className="h-3 w-3/4" />
            <Skeleton className="h-3 w-1/2" />
          </div>
        </div>
        <Skeleton className="h-12 w-full" />
        <p className="text-xs text-muted-foreground">Loading-state specimen</p>
      </div>
    );
  },
  spinner: function SpinnerPreview() {
    return (
      <div className="flex items-center gap-3">
        <Spinner className="size-6" aria-label="Activity indicator specimen" />
        <span className="text-sm text-muted-foreground">Activity specimen</span>
      </div>
    );
  },
  table: function TablePreview() {
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
              <TableCell className="text-muted-foreground">
                {surface.role}
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    );
  },
} satisfies Record<DisplayName, ComponentType<PreviewProps>>;
