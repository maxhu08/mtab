import {
  FONTAWESOME_BRANDS_LIST,
  FONTAWESOME_REGULAR_LIST,
  FONTAWESOME_SOLID_LIST
} from "~/src/options/scripts/utils/icons/fontawesome";
import { NERDFONTS_LIST } from "~/src/options/scripts/utils/icons/nerdfonts";
import { REMIXICONS_LIST } from "~/src/options/scripts/utils/icons/remixicons";
import { SIMPLEICONS_LIST } from "~/src/options/scripts/utils/icons/simpleicons";

type IconPickerItem = {
  name: string;
  value: string;
  search: string;
};

type IconPickerSection = {
  title: string;
  items: IconPickerItem[];
};

export const ICON_PICKER_SECTIONS: IconPickerSection[] = [
  {
    title: "Remix Icon",
    items: REMIXICONS_LIST.map((name) => createIconPickerItem("remixicon", name, `ri-${name}`))
  },
  {
    title: "Font Awesome",
    items: [
      ...FONTAWESOME_BRANDS_LIST.map((name) =>
        createIconPickerItem("fontawesome brands", name, `fa-brands fa-${name}`)
      ),
      ...FONTAWESOME_REGULAR_LIST.map((name) =>
        createIconPickerItem("fontawesome regular", name, `fa-regular fa-${name}`)
      ),
      ...FONTAWESOME_SOLID_LIST.map((name) =>
        createIconPickerItem("fontawesome solid", name, `fa-solid fa-${name}`)
      )
    ]
  },
  {
    title: "Nerd Fonts",
    items: NERDFONTS_LIST.map((name) => createIconPickerItem("nerdfonts", name, `nf-${name}`))
  },
  {
    title: "Simple Icons",
    items: SIMPLEICONS_LIST.map((name) => createIconPickerItem("simpleicons", name, `si-${name}`))
  }
];

function createIconPickerItem(family: string, name: string, value: string): IconPickerItem {
  return {
    name,
    value,
    search: `${family} ${name} ${value}`.toLowerCase()
  };
}