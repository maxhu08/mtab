import { insertCSS } from "src/newtab/scripts/utils/insert-css";

export const setTopDistance = () => {
  // if (bookmarksType === "none") {
  //   // .top-distance {
  //   //   top: 50%;
  //   //   transform: translateY(-50%);
  //   // }
  //   insertCSS(`.top-distance {top: 50%;transform: translateY(-50%);}`);
  //  return;
  // }

  // .top-distance {
  //   top: 10vh;
  // }
  // @media (min-height: 400px) {
  //   .top-distance {
  //     top: 20vh;
  //   }
  // }
  // @media (min-height: 600px) {
  //   .top-distance {
  //     top: 30vh;
  //   }
  // }

  insertCSS(
    ` .top-distance {top: 10vh;}@media (min-height: 400px) {.top-distance {top: 20vh;}}@media (min-height: 600px) {.top-distance {top: 30vh;}}`
  );
};
