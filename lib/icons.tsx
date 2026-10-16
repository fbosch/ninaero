import plusIconData from "@iconify-icons/solar/add-linear";
import chevronDownIconData from "@iconify-icons/solar/alt-arrow-down-linear";
import chevronLeftIconData from "@iconify-icons/solar/alt-arrow-left-linear";
import chevronRightIconData from "@iconify-icons/solar/alt-arrow-right-linear";
import chevronUpIconData from "@iconify-icons/solar/alt-arrow-up-linear";
import arrowDownIconData from "@iconify-icons/solar/arrow-down-linear";
import arrowRightIconData from "@iconify-icons/solar/arrow-right-linear";
import arrowUpRightIconData from "@iconify-icons/solar/arrow-right-up-linear";
import messageCircleIconData from "@iconify-icons/solar/chat-round-linear";
import circleCheckIconData from "@iconify-icons/solar/check-circle-linear";
import checkIconData from "@iconify-icons/solar/check-linear";
import octagonXIconData from "@iconify-icons/solar/close-circle-linear";
import xIconData from "@iconify-icons/solar/close-linear";
import copyIconData from "@iconify-icons/solar/copy-linear";
import triangleAlertIconData from "@iconify-icons/solar/danger-triangle-linear";
import filePlus2IconData from "@iconify-icons/solar/file-add-linear";
import fileTextIconData from "@iconify-icons/solar/file-text-linear";
import folderIconData from "@iconify-icons/solar/folder-linear";
import homeIconData from "@iconify-icons/solar/home-linear";
import inboxIconData from "@iconify-icons/solar/inbox-linear";
import infoIconData from "@iconify-icons/solar/info-circle-linear";
import monitorIconData from "@iconify-icons/solar/laptop-linear";
import searchIconData from "@iconify-icons/solar/magnifier-linear";
import moreHorizontalIconData from "@iconify-icons/solar/menu-dots-linear";
import minusIconData from "@iconify-icons/solar/minus-linear";
import moonIconData from "@iconify-icons/solar/moon-linear";
import panelLeftIconData from "@iconify-icons/solar/panel-left-linear";
import loader2IconData from "@iconify-icons/solar/refresh-linear";
import sunIconData from "@iconify-icons/solar/sun-linear";
import slidersHorizontalIconData from "@iconify-icons/solar/tuning-2-linear";
import { Icon as IconifyIcon, type IconifyIcon as IconData } from "@iconify/react/offline";
import type { ComponentProps } from "react";

type IconProps = Omit<ComponentProps<"svg">, "children" | "onLoad" | "rotate">;

function createIcon(icon: IconData) {
  // Solar sets stroke widths on child paths; remove them so the wrapper prop can override.
  const inheritedStrokeIcon = {
    ...icon,
    body: icon.body.replace(/\sstroke-width="[^"]*"/g, ""),
  };
  return function SolarIcon({ width = 24, height = 24, strokeWidth = 1.5, ...props }: IconProps) {
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
