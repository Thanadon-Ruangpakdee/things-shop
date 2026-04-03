import th from "@/dictionaries/th.json";
import en from "@/dictionaries/en.json";

const dictionaries: any = { th, en };

export const getDictionary = (lang: string) => {
  return dictionaries[lang.toLowerCase()] || dictionaries.th;
};