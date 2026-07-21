export const customMessageHelp = `You can use \\ to represent:

- Date components
- \\yyyy -> Full year (e.g., "2020")
- \\yy -> Last two digits of the year (e.g., "20")
- \\M -> Full month name (e.g., "October")
- \\m -> Abbreviated month name (e.g., "Oct")
- \\m$ -> Month of year as number (e.g., "11")
- \\D -> Full day of the week name (e.g., "Monday")
- \\d -> Abbreviated day of the week (e.g., "Mon")

- \\d$ -> Day of month as number (e.g., "08")
- Time components
- \\h% -> Hours (12 hour format, e.g., "01")
- \\hh -> Hours (with padding, e.g., "01")
- \\mm -> Minutes (with padding, e.g., "02")
- \\ss -> Seconds (with padding, e.g., "03")

- Meridian components
- \\md -> Lowercase meridian (e.g., "am" or "pm")
- \\MD -> Uppercase meridian (e.g., "AM" or "PM")
- \\n -> New line` as const;