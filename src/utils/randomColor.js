import {
  PULLMAN_BROWN,
  LINCOLN_GREEN,
  SKOBELOFF,
  BOTTLE_GREEN,
  BRONZE,
  WHEAT,
  PURPLE,
  DARK_GREEN,
  INDIGO,
  CELESTE,
  MINT,
  BLOND,
  COTTON_CANDY,
  GRANNY_SMITH,
  TEA_GREEN,
  NON_PHOTO_BLUE,
} from "../styles/colors";

export const randomColor = (firstName) => {
  if (!firstName) return [null, null];

  const position = alphabetPosition(firstName[0]);
  if (position > 0 && position < 4) {
    return [WHEAT.replace("#", ""), PULLMAN_BROWN.replace("#", "")];
  } else if (position >= 4 && position < 9) {
    return [CELESTE.replace("#", ""), SKOBELOFF.replace("#", "")];
  } else if (position >= 9 && position < 13) {
    return [BLOND.replace("#", ""), BRONZE.replace("#", "")];
  } else if (position >= 13 && position < 16) {
    return [MINT.replace("#", ""), BOTTLE_GREEN.replace("#", "")];
  } else if (position >= 16 && position < 19) {
    return [COTTON_CANDY.replace("#", ""), PURPLE.replace("#", "")];
  } else if (position >= 19 && position < 22) {
    return [GRANNY_SMITH.replace("#", ""), DARK_GREEN.replace("#", "")];
  } else if (position >= 22 && position < 25) {
    return [NON_PHOTO_BLUE.replace("#", ""), INDIGO.replace("#", "")];
  } else {
    return [TEA_GREEN.replace("#", ""), LINCOLN_GREEN.replace("#", "")];
  }
};

const alphabetPosition = (text) => {
  var result = "";
  for (var i = 0; i < text.length; i++) {
    var code = text.toUpperCase().charCodeAt(i);
    if (code > 64 && code < 91) result += code - 64 + " ";
  }

  return result.slice(0, result.length - 1);
};
