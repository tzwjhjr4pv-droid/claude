export const colors = {
  bg: "#F6F3EC",
  ink: "#1F2A33",
  muted: "#6B7780",
  // neutral / unkonditioniert / konditioniert
  neutral: "#8A949C",
  neutralBg: "#E6E8EA",
  ucs: "#D9822B",
  ucsBg: "#FBE8D3",
  cs: "#1E7F86",
  csBg: "#D4EEEF",
  dog: "#C9945E",
  dogDark: "#8E6239",
  saliva: "#5FB3E6",
};

export const font =
  "Inter, 'Helvetica Neue', Helvetica, Arial, sans-serif";

export type Kind = "neutral" | "ucs" | "cs";

export const kindColor = (k: Kind) =>
  k === "neutral"
    ? { fg: colors.neutral, bg: colors.neutralBg }
    : k === "ucs"
      ? { fg: colors.ucs, bg: colors.ucsBg }
      : { fg: colors.cs, bg: colors.csBg };
