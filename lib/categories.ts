export const categories = [
 {id:"love",symbol:"♡",ar:"حب",en:"Love"},{id:"heartbreak",symbol:"⌁",ar:"فراق",en:"Heartbreak"},
 {id:"unsent",symbol:"✉",ar:"رسالة لم تُرسل",en:"Unsent letters"},{id:"vent",symbol:"…",ar:"فضفضة",en:"Vent"},
 {id:"confession",symbol:"◌",ar:"اعتراف",en:"Confession"},{id:"fear",symbol:"?",ar:"خوف",en:"Fear"},
 {id:"sadness",symbol:"∿",ar:"حزن",en:"Sadness"},{id:"anger",symbol:"!",ar:"غضب",en:"Frustration"},
 {id:"joy",symbol:"✧",ar:"فرح",en:"Joy"},{id:"regret",symbol:"↶",ar:"ندم",en:"Regret"},
 {id:"hope",symbol:"↗",ar:"أمل",en:"Hope"},{id:"stories",symbol:"⌑",ar:"قصص",en:"Stories"},
 {id:"question",symbol:"؟",ar:"سؤال بلا اسم",en:"Anonymous question"},{id:"other",symbol:"＋",ar:"أخرى",en:"Other"}
] as const;
export type CategoryId=(typeof categories)[number]["id"];
export function categoryLabel(id:string,locale:"ar"|"en"){
 const item=categories.find(category=>category.id===id);
 return item?item[locale]:(locale==="ar"?"أخرى":"Other");
}
