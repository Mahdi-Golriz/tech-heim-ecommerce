export const formatCardNumber = (value: string) => {
  const v = value.replace(/\s+/g, "").replace(/[^0-9]/gi, "");
  const matches = v.match(/\d{4,16}/g);
  const match = (matches && matches[0]) || "";
  const parts = [];

  for (let i = 0, len = match.length; i < len; i += 4) {
    parts.push(match.substring(i, i + 4));
  }

  if (parts.length) {
    return parts.join(" ");
  } else {
    return value;
  }
};

export const formatExpirationDate = (value: string) => {
  const v = value.replace(/\s+/g, "").replace(/[^0-9]/gi, "");

  if (v.length >= 2) {
    const month = v.substring(0, 2);
    const year = v.substring(2, 4);

    // Validate month
    if (parseInt(month) > 12) {
      return v.substring(0, 1);
    }

    return month + (year ? "/" + year : "");
  }
  return v;
};
