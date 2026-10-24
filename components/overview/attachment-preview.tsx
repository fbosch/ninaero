import { FileTextIcon } from "@/lib/icons";
import {
  Attachment,
  AttachmentContent,
  AttachmentDescription,
  AttachmentMedia,
  AttachmentTitle,
} from "@/registry/ninaero/ui/attachment";

export function AttachmentPreview() {
  return (
    <Attachment>
      <AttachmentMedia>
        <FileTextIcon />
      </AttachmentMedia>
      <AttachmentContent>
        <AttachmentTitle>example-tokens.json</AttachmentTitle>
        <AttachmentDescription>JSON · sample attachment</AttachmentDescription>
      </AttachmentContent>
    </Attachment>
  );
}
