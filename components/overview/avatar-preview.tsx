import { Avatar, AvatarFallback, AvatarGroup } from "@/registry/ninaero/ui/avatar";

export function AvatarPreview() {
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
}
