import { icons } from "src/newtab/scripts/icons";

console.log("test");

const iconGridContainer = document.getElementById("icon-types-container") as HTMLDivElement;

for (let key in icons) {
  console.log(key, icons[key]);

  iconGridContainer.innerHTML += `
  <div class="grid grid-cols-[auto_max-content] place-items-center">
    <span class="text-white text-base mr-auto">${key}</span>
    <div class="w-24 h-24 text-white">
      ${icons[key]}
    </div>
  </div>
  <div class="bg-neutral-500 h-[1px] rounded-md my-auto"></div>
  `;
}
