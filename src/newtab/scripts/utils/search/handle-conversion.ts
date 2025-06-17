export const handleConversion = (val: string) => {
  const regexes = {
    inches: /^(-?\d+(?:\.\d+)?)\s?in\s*$/,
    centimeters: /^(-?\d+(?:\.\d+)?)\s?cm\s*$/,
    pounds: /^(-?\d+(?:\.\d+)?)\s?lbs?\s*$/,
    kilograms: /^(-?\d+(?:\.\d+)?)\s?kg\s*$/,
    miles: /^(-?\d+(?:\.\d+)?)\s?mi\s*$/,
    kilometers: /^(-?\d+(?:\.\d+)?)\s?km\s*$/,
    fahrenheit: /^(-?\d+(?:\.\d+)?)\s?[fF]\s*$/,
    celsius: /^(-?\d+(?:\.\d+)?)\s?[cC]\s*$/,
    feet: /^(-?\d+(?:\.\d+)?)\s?ft\s*$/,
    meters: /^(-?\d+(?:\.\d+)?)\s?m\s*$/
  };

  const matchConversion = (regex: RegExp, type: string) => {
    const match = val.match(regex);
    if (match) {
      const value = parseFloat(match[1]);
      let converted: string;
      let unit: string;

      switch (type) {
        case "in":
          converted = (value * 2.54).toFixed(2);
          unit = "cm";
          break;
        case "cm":
          converted = (value / 2.54).toFixed(2);
          unit = "in";
          break;
        case "lbs":
          converted = (value * 0.453592).toFixed(2);
          unit = "kg";
          break;
        case "kg":
          converted = (value / 0.453592).toFixed(2);
          unit = "lbs";
          break;
        case "mi":
          converted = (value * 1.60934).toFixed(2);
          unit = "km";
          break;
        case "km":
          converted = (value / 1.60934).toFixed(2);
          unit = "mi";
          break;
        case "f":
        case "F":
          converted = (((value - 32) * 5) / 9).toFixed();
          type = "°F";
          unit = "°C";
          break;
        case "c":
        case "C":
          converted = ((value * 9) / 5 + 32).toFixed();
          type = "°C";
          unit = "°F";
          break;
        case "ft":
          converted = (value * 0.3048).toFixed(2);
          unit = "m";
          break;
        case "m":
          converted = (value / 0.3048).toFixed(2);
          unit = "ft";
          break;
        default:
          return;
      }

      return {
        type: "conversion",
        before: `${value} ${type}`,
        after: `${converted} ${unit}`
      } as const;
    }
  };

  return (
    matchConversion(regexes.inches, "in") ||
    matchConversion(regexes.centimeters, "cm") ||
    matchConversion(regexes.pounds, "lbs") ||
    matchConversion(regexes.kilograms, "kg") ||
    matchConversion(regexes.miles, "mi") ||
    matchConversion(regexes.kilometers, "km") ||
    matchConversion(regexes.fahrenheit, "f") ||
    matchConversion(regexes.celsius, "c") ||
    matchConversion(regexes.feet, "ft") ||
    matchConversion(regexes.meters, "m")
  );
};
