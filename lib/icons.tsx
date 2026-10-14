import arrowDownIconData from "@iconify-icons/mage/arrow-down";
import arrowRightIconData from "@iconify-icons/mage/arrow-right";
import arrowUpRightIconData from "@iconify-icons/mage/arrow-up-right";
import checkIconData from "@iconify-icons/mage/check";
import circleCheckIconData from "@iconify-icons/mage/check-circle";
import chevronDownIconData from "@iconify-icons/mage/chevron-down";
import chevronLeftIconData from "@iconify-icons/mage/chevron-left";
import chevronRightIconData from "@iconify-icons/mage/chevron-right";
import chevronUpIconData from "@iconify-icons/mage/chevron-up";
import copyIconData from "@iconify-icons/mage/copy";
import moreHorizontalIconData from "@iconify-icons/mage/dots-horizontal";
import triangleAlertIconData from "@iconify-icons/mage/exclamation-triangle";
import filePlus2IconData from "@iconify-icons/mage/file-plus";
import fileTextIconData from "@iconify-icons/mage/file-records";
import slidersHorizontalIconData from "@iconify-icons/mage/filter";
import folderIconData from "@iconify-icons/mage/folder";
import homeIconData from "@iconify-icons/mage/home";
import inboxIconData from "@iconify-icons/mage/inbox";
import infoIconData from "@iconify-icons/mage/information-circle";
import monitorIconData from "@iconify-icons/mage/laptop";
import panelLeftIconData from "@iconify-icons/mage/layout-left";
import messageCircleIconData from "@iconify-icons/mage/message-round";
import minusIconData from "@iconify-icons/mage/minus";
import moonIconData from "@iconify-icons/mage/moon";
import xIconData from "@iconify-icons/mage/multiply";
import octagonXIconData from "@iconify-icons/mage/multiply-circle";
import plusIconData from "@iconify-icons/mage/plus";
import loader2IconData from "@iconify-icons/mage/reload";
import searchIconData from "@iconify-icons/mage/search";
import sunIconData from "@iconify-icons/mage/sun";
import { Icon as IconifyIcon, type IconifyIcon as IconData } from "@iconify/react/offline";
import type { ComponentProps } from "react";

type IconProps = Omit<ComponentProps<"svg">, "children" | "onLoad" | "rotate">;

function createIcon(icon: IconData) {
  // Mage defines strokes on child nodes; inherit the root weight so callers can adjust it.
  const inheritedStrokeIcon = {
    ...icon,
    body: icon.body.replace(/\sstroke-width="[^"]*"/g, ""),
  };
  return function MageIcon({ width = 24, height = 24, strokeWidth = 2.25, ...props }: IconProps) {
    const labelled = Boolean(props["aria-label"] || props["aria-labelledby"]);

    return (
      <IconifyIcon
        width={width}
        height={height}
        strokeWidth={strokeWidth}
        {...props}
        mode="svg"
        aria-hidden={props["aria-hidden"] ?? !labelled}
        icon={inheritedStrokeIcon}
      />
    );
  };
}

export const ArrowDownIcon = /* @__PURE__ */ createIcon(arrowDownIconData);
export const ArrowRightIcon = /* @__PURE__ */ createIcon(arrowRightIconData);
export const ArrowUpRightIcon = /* @__PURE__ */ createIcon(arrowUpRightIconData);
export const CheckIcon = /* @__PURE__ */ createIcon(checkIconData);
export const ChevronDownIcon = /* @__PURE__ */ createIcon(chevronDownIconData);
export const ChevronLeftIcon = /* @__PURE__ */ createIcon(chevronLeftIconData);
export const ChevronRightIcon = /* @__PURE__ */ createIcon(chevronRightIconData);
export const ChevronUpIcon = /* @__PURE__ */ createIcon(chevronUpIconData);
export const CircleCheckIcon = /* @__PURE__ */ createIcon(circleCheckIconData);
export const CopyIcon = /* @__PURE__ */ createIcon(copyIconData);
export const FilePlus2Icon = /* @__PURE__ */ createIcon(filePlus2IconData);
export const FileTextIcon = /* @__PURE__ */ createIcon(fileTextIconData);
export const FolderIcon = /* @__PURE__ */ createIcon(folderIconData);
export const HomeIcon = /* @__PURE__ */ createIcon(homeIconData);
export const InboxIcon = /* @__PURE__ */ createIcon(inboxIconData);
export const InfoIcon = /* @__PURE__ */ createIcon(infoIconData);
export const Loader2Icon = /* @__PURE__ */ createIcon(loader2IconData);
export const MessageCircleIcon = /* @__PURE__ */ createIcon(messageCircleIconData);
export const MinusIcon = /* @__PURE__ */ createIcon(minusIconData);
export const MonitorIcon = /* @__PURE__ */ createIcon(monitorIconData);
export const MoonIcon = /* @__PURE__ */ createIcon(moonIconData);
export const MoreHorizontalIcon = /* @__PURE__ */ createIcon(moreHorizontalIconData);
export const OctagonXIcon = /* @__PURE__ */ createIcon(octagonXIconData);
export const PanelLeftIcon = /* @__PURE__ */ createIcon(panelLeftIconData);
export const PlusIcon = /* @__PURE__ */ createIcon(plusIconData);
export const SearchIcon = /* @__PURE__ */ createIcon(searchIconData);
export const SlidersHorizontalIcon = /* @__PURE__ */ createIcon(slidersHorizontalIconData);
export const SunIcon = /* @__PURE__ */ createIcon(sunIconData);
export const TriangleAlertIcon = /* @__PURE__ */ createIcon(triangleAlertIconData);
export const XIcon = /* @__PURE__ */ createIcon(xIconData);
