// Common Hong Kong place names and nicknames people say when calling a taxi (districts, MTR stations,
// malls, landmarks, hospitals, universities, border crossings). Coordinates from OpenStreetMap (Nominatim),
// looked up 13 Nov 2026; approximate, for the demo only. Entries matching an existing demo place only add aliases.
(function () {
  const extra = [
 {
  "id": "hk000",
  "en": "Central",
  "zh": "中環",
  "addrEn": "Hong Kong Island",
  "addrZh": "港島",
  "district": "港島 Hong Kong Island",
  "area": "island",
  "lat": 22.28183,
  "lng": 114.15828,
  "aliases": [
   "central",
   "central station",
   "中環站"
  ],
  "common": true
 },
 {
  "id": "hk001",
  "en": "Sheung Wan",
  "zh": "上環",
  "addrEn": "Hong Kong Island",
  "addrZh": "港島",
  "district": "港島 Hong Kong Island",
  "area": "island",
  "lat": 22.2859,
  "lng": 114.15371,
  "aliases": [
   "sheung wan",
   "上環站"
  ],
  "common": true
 },
 {
  "id": "hk002",
  "en": "Sai Ying Pun",
  "zh": "西營盤",
  "addrEn": "Hong Kong Island",
  "addrZh": "港島",
  "district": "港島 Hong Kong Island",
  "area": "island",
  "lat": 22.28612,
  "lng": 114.14209,
  "aliases": [
   "sai ying pun",
   "syp",
   "西營盤站",
   "西環"
  ],
  "common": true
 },
 {
  "id": "hk003",
  "en": "HKU Station",
  "zh": "香港大學站",
  "addrEn": "Hong Kong Island",
  "addrZh": "港島",
  "district": "港島 Hong Kong Island",
  "area": "island",
  "lat": 22.28445,
  "lng": 114.13419,
  "aliases": [
   "hku station",
   "港大站"
  ],
  "common": true
 },
 {
  "id": "hk004",
  "en": "Kennedy Town",
  "zh": "堅尼地城",
  "addrEn": "Hong Kong Island",
  "addrZh": "港島",
  "district": "港島 Hong Kong Island",
  "area": "island",
  "lat": 22.28134,
  "lng": 114.1277,
  "aliases": [
   "kennedy town",
   "kt",
   "堅城",
   "西環尾"
  ],
  "common": true
 },
 {
  "id": "hk005",
  "en": "Admiralty",
  "zh": "金鐘",
  "addrEn": "Hong Kong Island",
  "addrZh": "港島",
  "district": "港島 Hong Kong Island",
  "area": "island",
  "lat": 22.27871,
  "lng": 114.16425,
  "aliases": [
   "admiralty",
   "金鐘站"
  ],
  "common": true
 },
 {
  "id": "hk006",
  "en": "Wan Chai",
  "zh": "灣仔",
  "addrEn": "Hong Kong Island",
  "addrZh": "港島",
  "district": "港島 Hong Kong Island",
  "area": "island",
  "lat": 22.27395,
  "lng": 114.18175,
  "aliases": [
   "wan chai",
   "wanchai",
   "灣仔站"
  ],
  "common": true
 },
 {
  "id": "hk007",
  "en": "Exhibition Centre",
  "zh": "會展",
  "addrEn": "Hong Kong Island",
  "addrZh": "港島",
  "district": "港島 Hong Kong Island",
  "area": "island",
  "lat": 22.28164,
  "lng": 114.17571,
  "aliases": [
   "exhibition centre",
   "hkcec",
   "會展站",
   "會議展覽中心"
  ],
  "common": true
 },
 {
  "id": "hk008",
  "en": "Causeway Bay",
  "zh": "銅鑼灣",
  "addrEn": "Hong Kong Island",
  "addrZh": "港島",
  "district": "港島 Hong Kong Island",
  "area": "island",
  "lat": 22.2809,
  "lng": 114.18707,
  "aliases": [
   "causeway bay",
   "cwb",
   "銅鑼灣站"
  ],
  "common": true
 },
 {
  "id": "hk009",
  "en": "Tin Hau",
  "zh": "天后",
  "addrEn": "Hong Kong Island",
  "addrZh": "港島",
  "district": "港島 Hong Kong Island",
  "area": "island",
  "lat": 22.28286,
  "lng": 114.19185,
  "aliases": [
   "tin hau",
   "天后站"
  ],
  "common": true
 },
 {
  "id": "hk010",
  "en": "Fortress Hill",
  "zh": "炮台山",
  "addrEn": "Hong Kong Island",
  "addrZh": "港島",
  "district": "港島 Hong Kong Island",
  "area": "island",
  "lat": 22.28875,
  "lng": 114.19412,
  "aliases": [
   "fortress hill",
   "炮台山站"
  ],
  "common": true
 },
 {
  "id": "hk011",
  "en": "North Point",
  "zh": "北角",
  "addrEn": "Hong Kong Island",
  "addrZh": "港島",
  "district": "港島 Hong Kong Island",
  "area": "island",
  "lat": 22.29066,
  "lng": 114.19897,
  "aliases": [
   "north point",
   "北角站"
  ],
  "common": true
 },
 {
  "id": "hk012",
  "en": "Quarry Bay",
  "zh": "鰂魚涌",
  "addrEn": "Hong Kong Island",
  "addrZh": "港島",
  "district": "港島 Hong Kong Island",
  "area": "island",
  "lat": 22.2858,
  "lng": 114.21292,
  "aliases": [
   "quarry bay",
   "鰂魚涌站"
  ],
  "common": true
 },
 {
  "id": "hk013",
  "en": "Tai Koo",
  "zh": "太古",
  "addrEn": "Hong Kong Island",
  "addrZh": "港島",
  "district": "港島 Hong Kong Island",
  "area": "island",
  "lat": 22.28515,
  "lng": 114.2165,
  "aliases": [
   "tai koo",
   "太古城",
   "太古站"
  ],
  "common": true
 },
 {
  "id": "hk014",
  "en": "Sai Wan Ho",
  "zh": "西灣河",
  "addrEn": "Hong Kong Island",
  "addrZh": "港島",
  "district": "港島 Hong Kong Island",
  "area": "island",
  "lat": 22.28274,
  "lng": 114.2214,
  "aliases": [
   "sai wan ho",
   "西灣河站"
  ],
  "common": true
 },
 {
  "id": "hk015",
  "en": "Shau Kei Wan",
  "zh": "筲箕灣",
  "addrEn": "Hong Kong Island",
  "addrZh": "港島",
  "district": "港島 Hong Kong Island",
  "area": "island",
  "lat": 22.28332,
  "lng": 114.22088,
  "aliases": [
   "shau kei wan",
   "skw",
   "筲箕灣站"
  ],
  "common": true
 },
 {
  "id": "hk016",
  "en": "Heng Fa Chuen",
  "zh": "杏花邨",
  "addrEn": "Hong Kong Island",
  "addrZh": "港島",
  "district": "港島 Hong Kong Island",
  "area": "island",
  "lat": 22.27786,
  "lng": 114.24026,
  "aliases": [
   "heng fa chuen",
   "杏花邨站"
  ],
  "common": true
 },
 {
  "id": "hk017",
  "en": "Chai Wan",
  "zh": "柴灣",
  "addrEn": "Hong Kong Island",
  "addrZh": "港島",
  "district": "港島 Hong Kong Island",
  "area": "island",
  "lat": 22.26478,
  "lng": 114.23724,
  "aliases": [
   "chai wan",
   "柴灣站"
  ],
  "common": true
 },
 {
  "id": "hk018",
  "en": "Siu Sai Wan",
  "zh": "小西灣",
  "addrEn": "Hong Kong Island",
  "addrZh": "港島",
  "district": "港島 Hong Kong Island",
  "area": "island",
  "lat": 22.26373,
  "lng": 114.25021,
  "aliases": [
   "siu sai wan"
  ],
  "common": true
 },
 {
  "id": "hk019",
  "en": "Happy Valley",
  "zh": "跑馬地",
  "addrEn": "Hong Kong Island",
  "addrZh": "港島",
  "district": "港島 Hong Kong Island",
  "area": "island",
  "lat": 22.2726,
  "lng": 114.18064,
  "aliases": [
   "happy valley",
   "跑馬地馬場",
   "馬場"
  ],
  "common": true
 },
 {
  "id": "hk020",
  "en": "Mid-Levels",
  "zh": "半山",
  "addrEn": "Hong Kong Island",
  "addrZh": "港島",
  "district": "港島 Hong Kong Island",
  "area": "island",
  "lat": 22.27693,
  "lng": 114.15594,
  "aliases": [
   "mid levels",
   "mid-levels",
   "半山區"
  ],
  "common": true
 },
 {
  "id": "hk021",
  "en": "The Peak",
  "zh": "山頂",
  "addrEn": "Hong Kong Island",
  "addrZh": "港島",
  "district": "港島 Hong Kong Island",
  "area": "island",
  "lat": 22.27112,
  "lng": 114.15014,
  "aliases": [
   "peak",
   "peak tower",
   "the peak",
   "凌霄閣",
   "太平山頂",
   "山頂纜車"
  ],
  "common": true
 },
 {
  "id": "hk022",
  "en": "Pok Fu Lam",
  "zh": "薄扶林",
  "addrEn": "Hong Kong Island",
  "addrZh": "港島",
  "district": "港島 Hong Kong Island",
  "area": "island",
  "lat": 22.26068,
  "lng": 114.13751,
  "aliases": [
   "pok fu lam",
   "pokfulam"
  ],
  "common": true
 },
 {
  "id": "hk023",
  "en": "Aberdeen",
  "zh": "香港仔",
  "addrEn": "Hong Kong Island",
  "addrZh": "港島",
  "district": "港島 Hong Kong Island",
  "area": "island",
  "lat": 22.24891,
  "lng": 114.15642,
  "aliases": [
   "aberdeen",
   "香港仔中心"
  ],
  "common": true
 },
 {
  "id": "hk024",
  "en": "Ap Lei Chau",
  "zh": "鴨脷洲",
  "addrEn": "Hong Kong Island",
  "addrZh": "港島",
  "district": "港島 Hong Kong Island",
  "area": "island",
  "lat": 22.23994,
  "lng": 114.15452,
  "aliases": [
   "ap lei chau",
   "south horizons",
   "利東站",
   "海怡半島"
  ],
  "common": true
 },
 {
  "id": "hk025",
  "en": "Wong Chuk Hang",
  "zh": "黃竹坑",
  "addrEn": "Hong Kong Island",
  "addrZh": "港島",
  "district": "港島 Hong Kong Island",
  "area": "island",
  "lat": 22.24824,
  "lng": 114.16839,
  "aliases": [
   "wong chuk hang",
   "黃竹坑站"
  ],
  "common": true
 },
 {
  "id": "hk026",
  "en": "Repulse Bay",
  "zh": "淺水灣",
  "addrEn": "Hong Kong Island",
  "addrZh": "港島",
  "district": "港島 Hong Kong Island",
  "area": "island",
  "lat": 22.23811,
  "lng": 114.19632,
  "aliases": [
   "repulse bay"
  ],
  "common": true
 },
 {
  "id": "hk027",
  "en": "Stanley",
  "zh": "赤柱",
  "addrEn": "Hong Kong Island",
  "addrZh": "港島",
  "district": "港島 Hong Kong Island",
  "area": "island",
  "lat": 22.21439,
  "lng": 114.21591,
  "aliases": [
   "stanley",
   "stanley plaza",
   "赤柱廣場"
  ],
  "common": true
 },
 {
  "id": "hk028",
  "en": "Lan Kwai Fong",
  "zh": "蘭桂坊",
  "addrEn": "Hong Kong Island",
  "addrZh": "港島",
  "district": "港島 Hong Kong Island",
  "area": "island",
  "lat": 22.28084,
  "lng": 114.15538,
  "aliases": [
   "lan kwai fong",
   "lkf"
  ],
  "common": true
 },
 {
  "id": "hk029",
  "en": "SoHo",
  "zh": "蘇豪",
  "addrEn": "Hong Kong Island",
  "addrZh": "港島",
  "district": "港島 Hong Kong Island",
  "area": "island",
  "lat": 22.2823,
  "lng": 114.15291,
  "aliases": [
   "hollywood road",
   "soho",
   "荷李活道"
  ],
  "common": true
 },
 {
  "id": "hk030",
  "en": "Central Piers",
  "zh": "中環碼頭",
  "addrEn": "Hong Kong Island",
  "addrZh": "港島",
  "district": "港島 Hong Kong Island",
  "area": "island",
  "lat": 22.28626,
  "lng": 114.15957,
  "aliases": [
   "central ferry pier",
   "central pier",
   "central piers",
   "中環天星碼頭",
   "天星碼頭中環"
  ],
  "common": true
 },
 {
  "id": "hk031",
  "en": "Macau Ferry Terminal",
  "zh": "港澳碼頭",
  "addrEn": "Hong Kong Island",
  "addrZh": "港島",
  "district": "港島 Hong Kong Island",
  "area": "island",
  "lat": 22.2877,
  "lng": 114.15009,
  "aliases": [
   "macau ferry",
   "macau ferry terminal",
   "shun tak",
   "上環碼頭",
   "信德中心"
  ],
  "common": true
 },
 {
  "id": "hk032",
  "en": "Victoria Park",
  "zh": "維多利亞公園",
  "addrEn": "Hong Kong Island",
  "addrZh": "港島",
  "district": "港島 Hong Kong Island",
  "area": "island",
  "lat": 22.2824,
  "lng": 114.18878,
  "aliases": [
   "victoria park",
   "維園"
  ],
  "common": true
 },
 {
  "id": "hk033",
  "en": "Central Government Offices",
  "zh": "政府總部",
  "addrEn": "Hong Kong Island",
  "addrZh": "港島",
  "district": "港島 Hong Kong Island",
  "area": "island",
  "lat": 22.28047,
  "lng": 114.1656,
  "aliases": [
   "central government offices",
   "government hq",
   "legco",
   "政總",
   "添馬",
   "立法會"
  ],
  "common": true
 },
 {
  "id": "hk034",
  "en": "SOGO Causeway Bay",
  "zh": "崇光",
  "addrEn": "Hong Kong Island",
  "addrZh": "港島",
  "district": "港島 Hong Kong Island",
  "area": "island",
  "lat": 22.28039,
  "lng": 114.18428,
  "aliases": [
   "sogo",
   "sogo causeway bay",
   "崇光百貨",
   "銅鑼灣崇光"
  ],
  "common": true
 },
 {
  "id": "hk035",
  "en": "Hysan Place",
  "zh": "希慎廣場",
  "addrEn": "Hong Kong Island",
  "addrZh": "港島",
  "district": "港島 Hong Kong Island",
  "area": "island",
  "lat": 22.27981,
  "lng": 114.18377,
  "aliases": [
   "hysan place",
   "希慎"
  ],
  "common": true
 },
 {
  "id": "hk036",
  "en": "Lee Gardens",
  "zh": "利園",
  "addrEn": "Hong Kong Island",
  "addrZh": "港島",
  "district": "港島 Hong Kong Island",
  "area": "island",
  "lat": 22.27847,
  "lng": 114.1847,
  "aliases": [
   "lee gardens",
   "利園一期"
  ],
  "common": true
 },
 {
  "id": "hk037",
  "en": "Landmark",
  "zh": "置地廣場",
  "addrEn": "Hong Kong Island",
  "addrZh": "港島",
  "district": "港島 Hong Kong Island",
  "area": "island",
  "lat": 22.28111,
  "lng": 114.15789,
  "aliases": [
   "landmark",
   "the landmark",
   "置地"
  ],
  "common": true
 },
 {
  "id": "hk038",
  "en": "Cityplaza",
  "zh": "太古城中心",
  "addrEn": "Hong Kong Island",
  "addrZh": "港島",
  "district": "港島 Hong Kong Island",
  "area": "island",
  "lat": 22.2863,
  "lng": 114.21735,
  "aliases": [
   "cityplaza",
   "太古城中心"
  ],
  "common": true
 },
 {
  "id": "hk039",
  "en": "Pamela Youde Nethersole Eastern Hospital",
  "zh": "東區醫院",
  "addrEn": "Hong Kong Island",
  "addrZh": "港島",
  "district": "港島 Hong Kong Island",
  "area": "island",
  "lat": 22.26852,
  "lng": 114.23366,
  "aliases": [
   "eastern hospital",
   "pamela youde nethersole eastern hospital",
   "pyneh",
   "尤德夫人醫院",
   "東區尤德"
  ],
  "common": true
 },
 {
  "id": "hk040",
  "en": "Ruttonjee Hospital",
  "zh": "律敦治醫院",
  "addrEn": "Hong Kong Island",
  "addrZh": "港島",
  "district": "港島 Hong Kong Island",
  "area": "island",
  "lat": 22.27552,
  "lng": 114.17504,
  "aliases": [
   "ruttonjee",
   "ruttonjee hospital"
  ],
  "common": true
 },
 {
  "id": "hk041",
  "en": "Hong Kong Sanatorium & Hospital",
  "zh": "養和醫院",
  "addrEn": "Hong Kong Island",
  "addrZh": "港島",
  "district": "港島 Hong Kong Island",
  "area": "island",
  "lat": 22.26946,
  "lng": 114.18295,
  "aliases": [
   "hksh",
   "hong kong sanatorium & hospital",
   "sanatorium",
   "養和"
  ],
  "common": true
 },
 {
  "id": "hk042",
  "en": "Hong Kong Adventist Hospital",
  "zh": "港安醫院（司徒拔道）",
  "addrEn": "Hong Kong Island",
  "addrZh": "港島",
  "district": "港島 Hong Kong Island",
  "area": "island",
  "lat": 22.26452,
  "lng": 114.18437,
  "aliases": [
   "adventist",
   "hong kong adventist hospital",
   "港安"
  ],
  "common": true
 },
 {
  "id": "hk043",
  "en": "Canossa Hospital",
  "zh": "嘉諾撒醫院",
  "addrEn": "Hong Kong Island",
  "addrZh": "港島",
  "district": "港島 Hong Kong Island",
  "area": "island",
  "lat": 22.27704,
  "lng": 114.15401,
  "aliases": [
   "canossa",
   "canossa hospital"
  ],
  "common": true
 },
 {
  "id": "hk044",
  "en": "Matilda International Hospital",
  "zh": "明德醫院",
  "addrEn": "Hong Kong Island",
  "addrZh": "港島",
  "district": "港島 Hong Kong Island",
  "area": "island",
  "lat": 22.2632,
  "lng": 114.1521,
  "aliases": [
   "matilda",
   "matilda international hospital"
  ],
  "common": true
 },
 {
  "id": "hk045",
  "en": "Grantham Hospital",
  "zh": "葛量洪醫院",
  "addrEn": "Hong Kong Island",
  "addrZh": "港島",
  "district": "港島 Hong Kong Island",
  "area": "island",
  "lat": 22.25161,
  "lng": 114.17277,
  "aliases": [
   "grantham",
   "grantham hospital"
  ],
  "common": true
 },
 {
  "id": "hk046",
  "en": "Gleneagles Hospital",
  "zh": "港怡醫院",
  "addrEn": "Hong Kong Island",
  "addrZh": "港島",
  "district": "港島 Hong Kong Island",
  "area": "island",
  "lat": 22.25155,
  "lng": 114.17647,
  "aliases": [
   "gleneagles",
   "gleneagles hospital",
   "港怡"
  ],
  "common": true
 },
 {
  "id": "hk047",
  "en": "St. Paul's Hospital",
  "zh": "聖保祿醫院",
  "addrEn": "Hong Kong Island",
  "addrZh": "港島",
  "district": "港島 Hong Kong Island",
  "area": "island",
  "lat": 22.27807,
  "lng": 114.18826,
  "aliases": [
   "st paul's",
   "st pauls",
   "st. paul's hospital",
   "聖保祿"
  ],
  "common": true
 },
 {
  "id": "hk048",
  "en": "Tsim Sha Tsui",
  "zh": "尖沙咀",
  "addrEn": "Kowloon",
  "addrZh": "九龍",
  "district": "九龍 Kowloon",
  "area": "kowloon",
  "lat": 22.29798,
  "lng": 114.17224,
  "aliases": [
   "tsim sha tsui",
   "tst",
   "尖沙咀站"
  ],
  "common": true
 },
 {
  "id": "hk049",
  "en": "Tsim Sha Tsui East",
  "zh": "尖東",
  "addrEn": "Kowloon",
  "addrZh": "九龍",
  "district": "九龍 Kowloon",
  "area": "kowloon",
  "lat": 22.2947,
  "lng": 114.17409,
  "aliases": [
   "east tsim sha tsui",
   "tsim sha tsui east",
   "tst east",
   "尖東站"
  ],
  "common": true
 },
 {
  "id": "hk050",
  "en": "Jordan",
  "zh": "佐敦",
  "addrEn": "Kowloon",
  "addrZh": "九龍",
  "district": "九龍 Kowloon",
  "area": "kowloon",
  "lat": 22.30469,
  "lng": 114.17156,
  "aliases": [
   "jordan",
   "佐敦站"
  ],
  "common": true
 },
 {
  "id": "hk051",
  "en": "Austin",
  "zh": "柯士甸",
  "addrEn": "Kowloon",
  "addrZh": "九龍",
  "district": "九龍 Kowloon",
  "area": "kowloon",
  "lat": 22.30375,
  "lng": 114.16685,
  "aliases": [
   "austin",
   "柯士甸站"
  ],
  "common": true
 },
 {
  "id": "hk052",
  "en": "Yau Ma Tei",
  "zh": "油麻地",
  "addrEn": "Kowloon",
  "addrZh": "九龍",
  "district": "九龍 Kowloon",
  "area": "kowloon",
  "lat": 22.31237,
  "lng": 114.17079,
  "aliases": [
   "yau ma tei",
   "ymt",
   "油麻地站"
  ],
  "common": true
 },
 {
  "id": "hk053",
  "en": "Mong Kok",
  "zh": "旺角",
  "addrEn": "Kowloon",
  "addrZh": "九龍",
  "district": "九龍 Kowloon",
  "area": "kowloon",
  "lat": 22.3197,
  "lng": 114.17097,
  "aliases": [
   "mk",
   "mong kok",
   "mongkok",
   "旺角站"
  ],
  "common": true
 },
 {
  "id": "hk054",
  "en": "Mong Kok East",
  "zh": "旺角東",
  "addrEn": "Kowloon",
  "addrZh": "九龍",
  "district": "九龍 Kowloon",
  "area": "kowloon",
  "lat": 22.32269,
  "lng": 114.17223,
  "aliases": [
   "mong kok east",
   "旺角東站"
  ],
  "common": true
 },
 {
  "id": "hk055",
  "en": "Prince Edward",
  "zh": "太子",
  "addrEn": "Kowloon",
  "addrZh": "九龍",
  "district": "九龍 Kowloon",
  "area": "kowloon",
  "lat": 22.32458,
  "lng": 114.16828,
  "aliases": [
   "prince edward",
   "太子站"
  ],
  "common": true
 },
 {
  "id": "hk056",
  "en": "Sham Shui Po",
  "zh": "深水埗",
  "addrEn": "Kowloon",
  "addrZh": "九龍",
  "district": "九龍 Kowloon",
  "area": "kowloon",
  "lat": 22.33014,
  "lng": 114.16325,
  "aliases": [
   "sham shui po",
   "ssp",
   "深水埗站"
  ],
  "common": true
 },
 {
  "id": "hk057",
  "en": "Cheung Sha Wan",
  "zh": "長沙灣",
  "addrEn": "Kowloon",
  "addrZh": "九龍",
  "district": "九龍 Kowloon",
  "area": "kowloon",
  "lat": 22.33533,
  "lng": 114.15637,
  "aliases": [
   "cheung sha wan",
   "長沙灣站"
  ],
  "common": true
 },
 {
  "id": "hk058",
  "en": "Lai Chi Kok",
  "zh": "荔枝角",
  "addrEn": "Kowloon",
  "addrZh": "九龍",
  "district": "九龍 Kowloon",
  "area": "kowloon",
  "lat": 22.33667,
  "lng": 114.14798,
  "aliases": [
   "lai chi kok",
   "荔枝角站"
  ],
  "common": true
 },
 {
  "id": "hk059",
  "en": "Mei Foo",
  "zh": "美孚",
  "addrEn": "Kowloon",
  "addrZh": "九龍",
  "district": "九龍 Kowloon",
  "area": "kowloon",
  "lat": 22.33776,
  "lng": 114.13957,
  "aliases": [
   "mei foo",
   "美孚新邨",
   "美孚站"
  ],
  "common": true
 },
 {
  "id": "hk060",
  "en": "Nam Cheong",
  "zh": "南昌",
  "addrEn": "Kowloon",
  "addrZh": "九龍",
  "district": "九龍 Kowloon",
  "area": "kowloon",
  "lat": 22.32829,
  "lng": 114.1538,
  "aliases": [
   "nam cheong",
   "南昌站"
  ],
  "common": true
 },
 {
  "id": "hk061",
  "en": "Olympic",
  "zh": "奧運",
  "addrEn": "Kowloon",
  "addrZh": "九龍",
  "district": "九龍 Kowloon",
  "area": "kowloon",
  "lat": 22.31887,
  "lng": 114.16064,
  "aliases": [
   "olympic",
   "大角咀",
   "奧運站"
  ],
  "common": true
 },
 {
  "id": "hk062",
  "en": "Kowloon Station",
  "zh": "九龍站",
  "addrEn": "Kowloon",
  "addrZh": "九龍",
  "district": "九龍 Kowloon",
  "area": "kowloon",
  "lat": 22.3051,
  "lng": 114.16187,
  "aliases": [
   "airport express kowloon",
   "kowloon station",
   "九龍站"
  ],
  "common": true
 },
 {
  "id": "hk063",
  "en": "West Kowloon Station",
  "zh": "西九高鐵站",
  "addrEn": "Kowloon",
  "addrZh": "九龍",
  "district": "九龍 Kowloon",
  "area": "kowloon",
  "lat": 22.3039,
  "lng": 114.1658,
  "aliases": [
   "high speed rail",
   "west kowloon station",
   "xrl",
   "高鐵站"
  ],
  "common": true
 },
 {
  "id": "hk064",
  "en": "Ho Man Tin",
  "zh": "何文田",
  "addrEn": "Kowloon",
  "addrZh": "九龍",
  "district": "九龍 Kowloon",
  "area": "kowloon",
  "lat": 22.30896,
  "lng": 114.18154,
  "aliases": [
   "ho man tin",
   "何文田站"
  ],
  "common": true
 },
 {
  "id": "hk065",
  "en": "Hung Hom",
  "zh": "紅磡",
  "addrEn": "Kowloon",
  "addrZh": "九龍",
  "district": "九龍 Kowloon",
  "area": "kowloon",
  "lat": 22.30274,
  "lng": 114.18196,
  "aliases": [
   "hung hom",
   "紅磡火車站",
   "紅磡站"
  ],
  "common": true
 },
 {
  "id": "hk066",
  "en": "Whampoa",
  "zh": "黃埔",
  "addrEn": "Kowloon",
  "addrZh": "九龍",
  "district": "九龍 Kowloon",
  "area": "kowloon",
  "lat": 22.30504,
  "lng": 114.18952,
  "aliases": [
   "whampoa",
   "黃埔站",
   "黃埔花園"
  ],
  "common": true
 },
 {
  "id": "hk067",
  "en": "To Kwa Wan",
  "zh": "土瓜灣",
  "addrEn": "Kowloon",
  "addrZh": "九龍",
  "district": "九龍 Kowloon",
  "area": "kowloon",
  "lat": 22.31676,
  "lng": 114.18954,
  "aliases": [
   "to kwa wan",
   "土瓜灣站"
  ],
  "common": true
 },
 {
  "id": "hk068",
  "en": "Sung Wong Toi",
  "zh": "宋皇臺",
  "addrEn": "Kowloon",
  "addrZh": "九龍",
  "district": "九龍 Kowloon",
  "area": "kowloon",
  "lat": 22.32614,
  "lng": 114.19041,
  "aliases": [
   "sung wong toi",
   "宋皇臺站"
  ],
  "common": true
 },
 {
  "id": "hk069",
  "en": "Kai Tak",
  "zh": "啟德",
  "addrEn": "Kowloon",
  "addrZh": "九龍",
  "district": "九龍 Kowloon",
  "area": "kowloon",
  "lat": 22.32977,
  "lng": 114.201,
  "aliases": [
   "kai tak",
   "啟德站"
  ],
  "common": true
 },
 {
  "id": "hk070",
  "en": "Kowloon City",
  "zh": "九龍城",
  "addrEn": "Kowloon",
  "addrZh": "九龍",
  "district": "九龍 Kowloon",
  "area": "kowloon",
  "lat": 22.33016,
  "lng": 114.18994,
  "aliases": [
   "kowloon city",
   "九龍城寨公園"
  ],
  "common": true
 },
 {
  "id": "hk071",
  "en": "Kowloon Tong",
  "zh": "九龍塘",
  "addrEn": "Kowloon",
  "addrZh": "九龍",
  "district": "九龍 Kowloon",
  "area": "kowloon",
  "lat": 22.33648,
  "lng": 114.17623,
  "aliases": [
   "kowloon tong",
   "九龍塘站"
  ],
  "common": true
 },
 {
  "id": "hk072",
  "en": "Shek Kip Mei",
  "zh": "石硤尾",
  "addrEn": "Kowloon",
  "addrZh": "九龍",
  "district": "九龍 Kowloon",
  "area": "kowloon",
  "lat": 22.3318,
  "lng": 114.16799,
  "aliases": [
   "shek kip mei",
   "石硤尾站"
  ],
  "common": true
 },
 {
  "id": "hk073",
  "en": "Lok Fu",
  "zh": "樂富",
  "addrEn": "Kowloon",
  "addrZh": "九龍",
  "district": "九龍 Kowloon",
  "area": "kowloon",
  "lat": 22.33791,
  "lng": 114.18693,
  "aliases": [
   "lok fu",
   "樂富廣場",
   "樂富站"
  ],
  "common": true
 },
 {
  "id": "hk074",
  "en": "Wong Tai Sin",
  "zh": "黃大仙",
  "addrEn": "Kowloon",
  "addrZh": "九龍",
  "district": "九龍 Kowloon",
  "area": "kowloon",
  "lat": 22.3412,
  "lng": 114.19448,
  "aliases": [
   "wong tai sin",
   "wong tai sin temple",
   "黃大仙祠",
   "黃大仙站"
  ],
  "common": true
 },
 {
  "id": "hk075",
  "en": "Diamond Hill",
  "zh": "鑽石山",
  "addrEn": "Kowloon",
  "addrZh": "九龍",
  "district": "九龍 Kowloon",
  "area": "kowloon",
  "lat": 22.33956,
  "lng": 114.20277,
  "aliases": [
   "diamond hill",
   "plaza hollywood",
   "荷里活廣場",
   "鑽石山站"
  ],
  "common": true
 },
 {
  "id": "hk076",
  "en": "Choi Hung",
  "zh": "彩虹",
  "addrEn": "Kowloon",
  "addrZh": "九龍",
  "district": "九龍 Kowloon",
  "area": "kowloon",
  "lat": 22.33404,
  "lng": 114.21017,
  "aliases": [
   "choi hung",
   "彩虹站",
   "彩虹邨"
  ],
  "common": true
 },
 {
  "id": "hk077",
  "en": "Kowloon Bay",
  "zh": "九龍灣",
  "addrEn": "Kowloon",
  "addrZh": "九龍",
  "district": "九龍 Kowloon",
  "area": "kowloon",
  "lat": 22.32348,
  "lng": 114.21409,
  "aliases": [
   "kowloon bay",
   "telford",
   "九龍灣站",
   "德福"
  ],
  "common": true
 },
 {
  "id": "hk078",
  "en": "Ngau Tau Kok",
  "zh": "牛頭角",
  "addrEn": "Kowloon",
  "addrZh": "九龍",
  "district": "九龍 Kowloon",
  "area": "kowloon",
  "lat": 22.31454,
  "lng": 114.22023,
  "aliases": [
   "ngau tau kok",
   "牛頭角站"
  ],
  "common": true
 },
 {
  "id": "hk079",
  "en": "Kwun Tong",
  "zh": "觀塘",
  "addrEn": "Kowloon",
  "addrZh": "九龍",
  "district": "九龍 Kowloon",
  "area": "kowloon",
  "lat": 22.31132,
  "lng": 114.22752,
  "aliases": [
   "kwun tong",
   "觀塘站"
  ],
  "common": true
 },
 {
  "id": "hk080",
  "en": "Lam Tin",
  "zh": "藍田",
  "addrEn": "Kowloon",
  "addrZh": "九龍",
  "district": "九龍 Kowloon",
  "area": "kowloon",
  "lat": 22.30669,
  "lng": 114.23361,
  "aliases": [
   "lam tin",
   "藍田站"
  ],
  "common": true
 },
 {
  "id": "hk081",
  "en": "Yau Tong",
  "zh": "油塘",
  "addrEn": "Kowloon",
  "addrZh": "九龍",
  "district": "九龍 Kowloon",
  "area": "kowloon",
  "lat": 22.29867,
  "lng": 114.23783,
  "aliases": [
   "yau tong",
   "油塘站"
  ],
  "common": true
 },
 {
  "id": "hk082",
  "en": "Ladies' Market",
  "zh": "女人街",
  "addrEn": "Kowloon",
  "addrZh": "九龍",
  "district": "九龍 Kowloon",
  "area": "kowloon",
  "lat": 22.31765,
  "lng": 114.17093,
  "aliases": [
   "ladies market",
   "ladies' market",
   "通菜街"
  ],
  "common": true
 },
 {
  "id": "hk083",
  "en": "Temple Street",
  "zh": "廟街",
  "addrEn": "Kowloon",
  "addrZh": "九龍",
  "district": "九龍 Kowloon",
  "area": "kowloon",
  "lat": 22.30418,
  "lng": 114.16972,
  "aliases": [
   "temple street",
   "廟街夜市"
  ],
  "common": true
 },
 {
  "id": "hk084",
  "en": "Avenue of Stars",
  "zh": "星光大道",
  "addrEn": "Kowloon",
  "addrZh": "九龍",
  "district": "九龍 Kowloon",
  "area": "kowloon",
  "lat": 22.29415,
  "lng": 114.17579,
  "aliases": [
   "avenue of stars"
  ],
  "common": true
 },
 {
  "id": "hk085",
  "en": "Tsim Sha Tsui Star Ferry",
  "zh": "尖沙咀天星碼頭",
  "addrEn": "Kowloon",
  "addrZh": "九龍",
  "district": "九龍 Kowloon",
  "area": "kowloon",
  "lat": 22.29352,
  "lng": 114.16798,
  "aliases": [
   "clock tower",
   "star ferry",
   "star ferry tst",
   "tsim sha tsui star ferry",
   "天星碼頭",
   "鐘樓"
  ],
  "common": true
 },
 {
  "id": "hk086",
  "en": "West Kowloon Cultural District",
  "zh": "西九文化區",
  "addrEn": "Kowloon",
  "addrZh": "九龍",
  "district": "九龍 Kowloon",
  "area": "kowloon",
  "lat": 22.30171,
  "lng": 114.16298,
  "aliases": [
   "m+",
   "palace museum",
   "west kowloon cultural district",
   "戲曲中心",
   "故宮",
   "香港故宮"
  ],
  "common": true
 },
 {
  "id": "hk087",
  "en": "Kai Tak Cruise Terminal",
  "zh": "啟德郵輪碼頭",
  "addrEn": "Kowloon",
  "addrZh": "九龍",
  "district": "九龍 Kowloon",
  "area": "kowloon",
  "lat": 22.30606,
  "lng": 114.21336,
  "aliases": [
   "cruise terminal",
   "kai tak cruise terminal",
   "郵輪碼頭"
  ],
  "common": true
 },
 {
  "id": "hk088",
  "en": "Hong Kong Coliseum",
  "zh": "紅磡體育館",
  "addrEn": "Kowloon",
  "addrZh": "九龍",
  "district": "九龍 Kowloon",
  "area": "kowloon",
  "lat": 22.30132,
  "lng": 114.18198,
  "aliases": [
   "coliseum",
   "hong kong coliseum",
   "hung hom coliseum",
   "紅館"
  ],
  "common": true
 },
 {
  "id": "hk089",
  "en": "Kowloon Park",
  "zh": "九龍公園",
  "addrEn": "Kowloon",
  "addrZh": "九龍",
  "district": "九龍 Kowloon",
  "area": "kowloon",
  "lat": 22.30053,
  "lng": 114.17012,
  "aliases": [
   "kowloon park"
  ],
  "common": true
 },
 {
  "id": "hk090",
  "en": "Science Museum",
  "zh": "香港科學館",
  "addrEn": "Kowloon",
  "addrZh": "九龍",
  "district": "九龍 Kowloon",
  "area": "kowloon",
  "lat": 22.30093,
  "lng": 114.17752,
  "aliases": [
   "history museum",
   "science museum",
   "歷史博物館",
   "科學館"
  ],
  "common": true
 },
 {
  "id": "hk091",
  "en": "Harbour City",
  "zh": "海港城",
  "addrEn": "Kowloon",
  "addrZh": "九龍",
  "district": "九龍 Kowloon",
  "area": "kowloon",
  "lat": 22.297,
  "lng": 114.16842,
  "aliases": [
   "harbour city",
   "海港城"
  ],
  "common": true
 },
 {
  "id": "hk092",
  "en": "K11 MUSEA",
  "zh": "K11 MUSEA",
  "addrEn": "Kowloon",
  "addrZh": "九龍",
  "district": "九龍 Kowloon",
  "area": "kowloon",
  "lat": 22.29457,
  "lng": 114.17456,
  "aliases": [
   "k11",
   "k11 musea",
   "musea",
   "新世界中心"
  ],
  "common": true
 },
 {
  "id": "hk093",
  "en": "iSQUARE",
  "zh": "國際廣場",
  "addrEn": "Kowloon",
  "addrZh": "九龍",
  "district": "九龍 Kowloon",
  "area": "kowloon",
  "lat": 22.29731,
  "lng": 114.17204,
  "aliases": [
   "i square",
   "isquare"
  ],
  "common": true
 },
 {
  "id": "hk094",
  "en": "Elements",
  "zh": "圓方",
  "addrEn": "Kowloon",
  "addrZh": "九龍",
  "district": "九龍 Kowloon",
  "area": "kowloon",
  "lat": 22.30492,
  "lng": 114.16199,
  "aliases": [
   "elements",
   "圓方商場"
  ],
  "common": true
 },
 {
  "id": "hk095",
  "en": "Langham Place",
  "zh": "朗豪坊",
  "addrEn": "Kowloon",
  "addrZh": "九龍",
  "district": "九龍 Kowloon",
  "area": "kowloon",
  "lat": 22.31883,
  "lng": 114.1685,
  "aliases": [
   "langham place",
   "朗豪坊"
  ],
  "common": true
 },
 {
  "id": "hk096",
  "en": "Festival Walk",
  "zh": "又一城",
  "addrEn": "Kowloon",
  "addrZh": "九龍",
  "district": "九龍 Kowloon",
  "area": "kowloon",
  "lat": 22.33731,
  "lng": 114.17459,
  "aliases": [
   "festival walk",
   "又一城"
  ],
  "common": true
 },
 {
  "id": "hk097",
  "en": "Olympian City",
  "zh": "奧海城",
  "addrEn": "Kowloon",
  "addrZh": "九龍",
  "district": "九龍 Kowloon",
  "area": "kowloon",
  "lat": 22.31748,
  "lng": 114.16461,
  "aliases": [
   "olympian city",
   "奧海城"
  ],
  "common": true
 },
 {
  "id": "hk098",
  "en": "apm",
  "zh": "APM",
  "addrEn": "Kowloon",
  "addrZh": "九龍",
  "district": "九龍 Kowloon",
  "area": "kowloon",
  "lat": 22.3122,
  "lng": 114.22514,
  "aliases": [
   "apm",
   "創紀之城"
  ],
  "common": true
 },
 {
  "id": "hk099",
  "en": "MegaBox",
  "zh": "MegaBox",
  "addrEn": "Kowloon",
  "addrZh": "九龍",
  "district": "九龍 Kowloon",
  "area": "kowloon",
  "lat": 22.31979,
  "lng": 114.20849,
  "aliases": [
   "mega box",
   "megabox"
  ],
  "common": true
 },
 {
  "id": "hk100",
  "en": "Telford Plaza",
  "zh": "德福廣場",
  "addrEn": "Kowloon",
  "addrZh": "九龍",
  "district": "九龍 Kowloon",
  "area": "kowloon",
  "lat": 22.32306,
  "lng": 114.21282,
  "aliases": [
   "telford plaza",
   "德福"
  ],
  "common": true
 },
 {
  "id": "hk101",
  "en": "Queen Elizabeth Hospital",
  "zh": "伊利沙伯醫院",
  "addrEn": "Kowloon",
  "addrZh": "九龍",
  "district": "九龍 Kowloon",
  "area": "kowloon",
  "lat": 22.30903,
  "lng": 114.17435,
  "aliases": [
   "qeh",
   "queen elizabeth hospital",
   "伊院"
  ],
  "common": true
 },
 {
  "id": "hk102",
  "en": "Kwong Wah Hospital",
  "zh": "廣華醫院",
  "addrEn": "Kowloon",
  "addrZh": "九龍",
  "district": "九龍 Kowloon",
  "area": "kowloon",
  "lat": 22.31513,
  "lng": 114.17208,
  "aliases": [
   "kwong wah",
   "kwong wah hospital",
   "廣華"
  ],
  "common": true
 },
 {
  "id": "hk103",
  "en": "United Christian Hospital",
  "zh": "基督教聯合醫院",
  "addrEn": "Kowloon",
  "addrZh": "九龍",
  "district": "九龍 Kowloon",
  "area": "kowloon",
  "lat": 22.3225,
  "lng": 114.22738,
  "aliases": [
   "uch",
   "united christian",
   "united christian hospital",
   "聯合醫院"
  ],
  "common": true
 },
 {
  "id": "hk104",
  "en": "Caritas Medical Centre",
  "zh": "明愛醫院",
  "addrEn": "Kowloon",
  "addrZh": "九龍",
  "district": "九龍 Kowloon",
  "area": "kowloon",
  "lat": 22.34156,
  "lng": 114.1534,
  "aliases": [
   "caritas",
   "caritas medical centre",
   "明愛"
  ],
  "common": true
 },
 {
  "id": "hk105",
  "en": "Hong Kong Children's Hospital",
  "zh": "香港兒童醫院",
  "addrEn": "Kowloon",
  "addrZh": "九龍",
  "district": "九龍 Kowloon",
  "area": "kowloon",
  "lat": 22.31576,
  "lng": 114.20886,
  "aliases": [
   "children's hospital",
   "hong kong children's hospital",
   "兒童醫院"
  ],
  "common": true
 },
 {
  "id": "hk106",
  "en": "Hong Kong Baptist Hospital",
  "zh": "浸會醫院",
  "addrEn": "Kowloon",
  "addrZh": "九龍",
  "district": "九龍 Kowloon",
  "area": "kowloon",
  "lat": 22.3389,
  "lng": 114.1796,
  "aliases": [
   "baptist hospital",
   "hong kong baptist hospital",
   "浸會醫院"
  ],
  "common": true
 },
 {
  "id": "hk107",
  "en": "St. Teresa's Hospital",
  "zh": "聖德肋撒醫院",
  "addrEn": "Kowloon",
  "addrZh": "九龍",
  "district": "九龍 Kowloon",
  "area": "kowloon",
  "lat": 22.32616,
  "lng": 114.18478,
  "aliases": [
   "st teresa",
   "st. teresa's hospital",
   "法國醫院"
  ],
  "common": true
 },
 {
  "id": "hk108",
  "en": "City University of Hong Kong",
  "zh": "城市大學",
  "addrEn": "Kowloon",
  "addrZh": "九龍",
  "district": "九龍 Kowloon",
  "area": "kowloon",
  "lat": 22.3364,
  "lng": 114.1724,
  "aliases": [
   "city university",
   "city university of hong kong",
   "cityu",
   "城大"
  ],
  "common": true
 },
 {
  "id": "hk109",
  "en": "Hong Kong Baptist University",
  "zh": "浸會大學",
  "addrEn": "Kowloon",
  "addrZh": "九龍",
  "district": "九龍 Kowloon",
  "area": "kowloon",
  "lat": 22.334,
  "lng": 114.18203,
  "aliases": [
   "baptist university",
   "hkbu",
   "hong kong baptist university",
   "浸大"
  ],
  "common": true
 },
 {
  "id": "hk110",
  "en": "Hong Kong Metropolitan University",
  "zh": "香港都會大學",
  "addrEn": "Kowloon",
  "addrZh": "九龍",
  "district": "九龍 Kowloon",
  "area": "kowloon",
  "lat": 22.31639,
  "lng": 114.1802,
  "aliases": [
   "hkmu",
   "hong kong metropolitan university",
   "ouhk",
   "公開大學",
   "都大"
  ],
  "common": true
 },
 {
  "id": "hk111",
  "en": "Tsuen Wan",
  "zh": "荃灣",
  "addrEn": "New Territories",
  "addrZh": "新界",
  "district": "新界 New Territories",
  "area": "nt",
  "lat": 22.37403,
  "lng": 114.11767,
  "aliases": [
   "tsuen wan",
   "荃灣站"
  ],
  "common": true
 },
 {
  "id": "hk112",
  "en": "Tsuen Wan West",
  "zh": "荃灣西",
  "addrEn": "New Territories",
  "addrZh": "新界",
  "district": "新界 New Territories",
  "area": "nt",
  "lat": 22.3677,
  "lng": 114.11096,
  "aliases": [
   "tsuen wan west",
   "荃灣西站"
  ],
  "common": true
 },
 {
  "id": "hk113",
  "en": "Citywalk",
  "zh": "荃新天地",
  "addrEn": "New Territories",
  "addrZh": "新界",
  "district": "新界 New Territories",
  "area": "nt",
  "lat": 22.36998,
  "lng": 114.11352,
  "aliases": [
   "citywalk",
   "荃新天地"
  ],
  "common": true
 },
 {
  "id": "hk114",
  "en": "Kwai Fong",
  "zh": "葵芳",
  "addrEn": "New Territories",
  "addrZh": "新界",
  "district": "新界 New Territories",
  "area": "nt",
  "lat": 22.35644,
  "lng": 114.12801,
  "aliases": [
   "kwai fong",
   "metroplaza",
   "新都會廣場",
   "葵芳站"
  ],
  "common": true
 },
 {
  "id": "hk115",
  "en": "Kwai Hing",
  "zh": "葵興",
  "addrEn": "New Territories",
  "addrZh": "新界",
  "district": "新界 New Territories",
  "area": "nt",
  "lat": 22.36309,
  "lng": 114.13146,
  "aliases": [
   "kwai hing",
   "葵興站"
  ],
  "common": true
 },
 {
  "id": "hk116",
  "en": "Lai King",
  "zh": "荔景",
  "addrEn": "New Territories",
  "addrZh": "新界",
  "district": "新界 New Territories",
  "area": "nt",
  "lat": 22.34844,
  "lng": 114.12689,
  "aliases": [
   "lai king",
   "荔景站"
  ],
  "common": true
 },
 {
  "id": "hk117",
  "en": "Tsing Yi",
  "zh": "青衣",
  "addrEn": "New Territories",
  "addrZh": "新界",
  "district": "新界 New Territories",
  "area": "nt",
  "lat": 22.36021,
  "lng": 114.10759,
  "aliases": [
   "maritime square",
   "tsing yi",
   "青衣城",
   "青衣站"
  ],
  "common": true
 },
 {
  "id": "hk118",
  "en": "Sham Tseng",
  "zh": "深井",
  "addrEn": "New Territories",
  "addrZh": "新界",
  "district": "新界 New Territories",
  "area": "nt",
  "lat": 22.36772,
  "lng": 114.05833,
  "aliases": [
   "sham tseng",
   "深井燒鵝"
  ],
  "common": true
 },
 {
  "id": "hk119",
  "en": "Sha Tin",
  "zh": "沙田",
  "addrEn": "New Territories",
  "addrZh": "新界",
  "district": "新界 New Territories",
  "area": "nt",
  "lat": 22.38353,
  "lng": 114.18797,
  "aliases": [
   "sha tin",
   "shatin",
   "沙田站"
  ],
  "common": true
 },
 {
  "id": "hk120",
  "en": "New Town Plaza",
  "zh": "新城市廣場",
  "addrEn": "New Territories",
  "addrZh": "新界",
  "district": "新界 New Territories",
  "area": "nt",
  "lat": 22.38114,
  "lng": 114.18837,
  "aliases": [
   "new town plaza",
   "ntp",
   "新城市"
  ],
  "common": true
 },
 {
  "id": "hk121",
  "en": "Tai Wai",
  "zh": "大圍",
  "addrEn": "New Territories",
  "addrZh": "新界",
  "district": "新界 New Territories",
  "area": "nt",
  "lat": 22.37267,
  "lng": 114.1799,
  "aliases": [
   "tai wai",
   "大圍站"
  ],
  "common": true
 },
 {
  "id": "hk122",
  "en": "Che Kung Temple",
  "zh": "車公廟",
  "addrEn": "New Territories",
  "addrZh": "新界",
  "district": "新界 New Territories",
  "area": "nt",
  "lat": 22.37477,
  "lng": 114.18618,
  "aliases": [
   "che kung temple",
   "車公廟站"
  ],
  "common": true
 },
 {
  "id": "hk123",
  "en": "Sha Tin Wai",
  "zh": "沙田圍",
  "addrEn": "New Territories",
  "addrZh": "新界",
  "district": "新界 New Territories",
  "area": "nt",
  "lat": 22.37768,
  "lng": 114.19508,
  "aliases": [
   "sha tin wai",
   "沙田圍站"
  ],
  "common": true
 },
 {
  "id": "hk124",
  "en": "City One",
  "zh": "第一城",
  "addrEn": "New Territories",
  "addrZh": "新界",
  "district": "新界 New Territories",
  "area": "nt",
  "lat": 22.38277,
  "lng": 114.20367,
  "aliases": [
   "city one",
   "沙田第一城",
   "第一城站"
  ],
  "common": true
 },
 {
  "id": "hk125",
  "en": "Shek Mun",
  "zh": "石門",
  "addrEn": "New Territories",
  "addrZh": "新界",
  "district": "新界 New Territories",
  "area": "nt",
  "lat": 22.3877,
  "lng": 114.2086,
  "aliases": [
   "shek mun",
   "石門站"
  ],
  "common": true
 },
 {
  "id": "hk126",
  "en": "Tai Shui Hang",
  "zh": "大水坑",
  "addrEn": "New Territories",
  "addrZh": "新界",
  "district": "新界 New Territories",
  "area": "nt",
  "lat": 22.40789,
  "lng": 114.22293,
  "aliases": [
   "tai shui hang"
  ],
  "common": true
 },
 {
  "id": "hk127",
  "en": "Ma On Shan",
  "zh": "馬鞍山",
  "addrEn": "New Territories",
  "addrZh": "新界",
  "district": "新界 New Territories",
  "area": "nt",
  "lat": 22.42383,
  "lng": 114.23193,
  "aliases": [
   "ma on shan",
   "mos",
   "新港城",
   "馬鞍山站"
  ],
  "common": true
 },
 {
  "id": "hk128",
  "en": "Wu Kai Sha",
  "zh": "烏溪沙",
  "addrEn": "New Territories",
  "addrZh": "新界",
  "district": "新界 New Territories",
  "area": "nt",
  "lat": 22.42852,
  "lng": 114.24312,
  "aliases": [
   "wu kai sha",
   "烏溪沙站"
  ],
  "common": true
 },
 {
  "id": "hk129",
  "en": "Fo Tan",
  "zh": "火炭",
  "addrEn": "New Territories",
  "addrZh": "新界",
  "district": "新界 New Territories",
  "area": "nt",
  "lat": 22.39512,
  "lng": 114.19831,
  "aliases": [
   "fo tan",
   "火炭站"
  ],
  "common": true
 },
 {
  "id": "hk130",
  "en": "Racecourse (Sha Tin)",
  "zh": "馬場站",
  "addrEn": "New Territories",
  "addrZh": "新界",
  "district": "新界 New Territories",
  "area": "nt",
  "lat": 22.40048,
  "lng": 114.2029,
  "aliases": [
   "racecourse (sha tin)",
   "sha tin racecourse",
   "沙田馬場"
  ],
  "common": true
 },
 {
  "id": "hk131",
  "en": "University Station",
  "zh": "大學站",
  "addrEn": "New Territories",
  "addrZh": "新界",
  "district": "新界 New Territories",
  "area": "nt",
  "lat": 22.4138,
  "lng": 114.20962,
  "aliases": [
   "university station",
   "大學站"
  ],
  "common": true
 },
 {
  "id": "hk132",
  "en": "Chinese University of Hong Kong",
  "zh": "中文大學",
  "addrEn": "New Territories",
  "addrZh": "新界",
  "district": "新界 New Territories",
  "area": "nt",
  "lat": 22.41751,
  "lng": 114.20376,
  "aliases": [
   "chinese university",
   "chinese university of hong kong",
   "cuhk",
   "中大"
  ],
  "common": true
 },
 {
  "id": "hk133",
  "en": "Science Park",
  "zh": "科技園",
  "addrEn": "New Territories",
  "addrZh": "新界",
  "district": "新界 New Territories",
  "area": "nt",
  "lat": 22.42795,
  "lng": 114.21035,
  "aliases": [
   "hkstp",
   "science park",
   "白石角"
  ],
  "common": true
 },
 {
  "id": "hk134",
  "en": "Tai Po",
  "zh": "大埔",
  "addrEn": "New Territories",
  "addrZh": "新界",
  "district": "新界 New Territories",
  "area": "nt",
  "lat": 22.4445,
  "lng": 114.1704,
  "aliases": [
   "tai po",
   "tai po mega mall",
   "大埔墟",
   "大埔墟站",
   "大埔超級城"
  ],
  "common": true
 },
 {
  "id": "hk135",
  "en": "Tai Wo",
  "zh": "太和",
  "addrEn": "New Territories",
  "addrZh": "新界",
  "district": "新界 New Territories",
  "area": "nt",
  "lat": 22.45105,
  "lng": 114.16074,
  "aliases": [
   "tai wo",
   "太和站"
  ],
  "common": true
 },
 {
  "id": "hk136",
  "en": "Education University of Hong Kong",
  "zh": "教育大學",
  "addrEn": "New Territories",
  "addrZh": "新界",
  "district": "新界 New Territories",
  "area": "nt",
  "lat": 22.46932,
  "lng": 114.1947,
  "aliases": [
   "education university of hong kong",
   "eduhk",
   "教大"
  ],
  "common": true
 },
 {
  "id": "hk137",
  "en": "Fanling",
  "zh": "粉嶺",
  "addrEn": "New Territories",
  "addrZh": "新界",
  "district": "新界 New Territories",
  "area": "nt",
  "lat": 22.49176,
  "lng": 114.13935,
  "aliases": [
   "fanling",
   "粉嶺站"
  ],
  "common": true
 },
 {
  "id": "hk138",
  "en": "Sheung Shui",
  "zh": "上水",
  "addrEn": "New Territories",
  "addrZh": "新界",
  "district": "新界 New Territories",
  "area": "nt",
  "lat": 22.50104,
  "lng": 114.12774,
  "aliases": [
   "sheung shui",
   "上水廣場",
   "上水站"
  ],
  "common": true
 },
 {
  "id": "hk139",
  "en": "Lo Wu",
  "zh": "羅湖",
  "addrEn": "New Territories",
  "addrZh": "新界",
  "district": "新界 New Territories",
  "area": "nt",
  "lat": 22.52887,
  "lng": 114.11314,
  "aliases": [
   "lo wu",
   "羅湖口岸",
   "羅湖站"
  ],
  "common": true
 },
 {
  "id": "hk140",
  "en": "Lok Ma Chau",
  "zh": "落馬洲",
  "addrEn": "New Territories",
  "addrZh": "新界",
  "district": "新界 New Territories",
  "area": "nt",
  "lat": 22.51532,
  "lng": 114.06677,
  "aliases": [
   "lok ma chau",
   "落馬洲口岸",
   "落馬洲站"
  ],
  "common": true
 },
 {
  "id": "hk141",
  "en": "Shenzhen Bay Port",
  "zh": "深圳灣口岸",
  "addrEn": "New Territories",
  "addrZh": "新界",
  "district": "新界 New Territories",
  "area": "nt",
  "lat": 22.50218,
  "lng": 113.94444,
  "aliases": [
   "shenzhen bay",
   "shenzhen bay port",
   "深圳灣"
  ],
  "common": true
 },
 {
  "id": "hk142",
  "en": "Tuen Mun",
  "zh": "屯門",
  "addrEn": "New Territories",
  "addrZh": "新界",
  "district": "新界 New Territories",
  "area": "nt",
  "lat": 22.39467,
  "lng": 113.97367,
  "aliases": [
   "tuen mun",
   "tuen mun town plaza",
   "屯門市廣場",
   "屯門站"
  ],
  "common": true
 },
 {
  "id": "hk143",
  "en": "Tuen Mun Hospital",
  "zh": "屯門醫院",
  "addrEn": "New Territories",
  "addrZh": "新界",
  "district": "新界 New Territories",
  "area": "nt",
  "lat": 22.40754,
  "lng": 113.97583,
  "aliases": [
   "tmh",
   "tuen mun hospital"
  ],
  "common": true
 },
 {
  "id": "hk144",
  "en": "Lingnan University",
  "zh": "嶺南大學",
  "addrEn": "New Territories",
  "addrZh": "新界",
  "district": "新界 New Territories",
  "area": "nt",
  "lat": 22.41236,
  "lng": 113.98128,
  "aliases": [
   "lingnan",
   "lingnan university",
   "嶺大"
  ],
  "common": true
 },
 {
  "id": "hk145",
  "en": "Yuen Long",
  "zh": "元朗",
  "addrEn": "New Territories",
  "addrZh": "新界",
  "district": "新界 New Territories",
  "area": "nt",
  "lat": 22.44609,
  "lng": 114.03438,
  "aliases": [
   "yoho",
   "yoho mall",
   "yuen long",
   "元朗站"
  ],
  "common": true
 },
 {
  "id": "hk146",
  "en": "Pok Oi Hospital",
  "zh": "博愛醫院",
  "addrEn": "New Territories",
  "addrZh": "新界",
  "district": "新界 New Territories",
  "area": "nt",
  "lat": 22.44541,
  "lng": 114.04157,
  "aliases": [
   "pok oi",
   "pok oi hospital"
  ],
  "common": true
 },
 {
  "id": "hk147",
  "en": "Tin Shui Wai",
  "zh": "天水圍",
  "addrEn": "New Territories",
  "addrZh": "新界",
  "district": "新界 New Territories",
  "area": "nt",
  "lat": 22.44692,
  "lng": 114.00285,
  "aliases": [
   "tin shui wai",
   "tsw",
   "嘉湖山莊",
   "天水圍站"
  ],
  "common": true
 },
 {
  "id": "hk148",
  "en": "Tseung Kwan O",
  "zh": "將軍澳",
  "addrEn": "New Territories",
  "addrZh": "新界",
  "district": "新界 New Territories",
  "area": "nt",
  "lat": 22.30863,
  "lng": 114.26017,
  "aliases": [
   "tko",
   "tseung kwan o",
   "將軍澳站"
  ],
  "common": true
 },
 {
  "id": "hk149",
  "en": "Hang Hau",
  "zh": "坑口",
  "addrEn": "New Territories",
  "addrZh": "新界",
  "district": "新界 New Territories",
  "area": "nt",
  "lat": 22.31582,
  "lng": 114.26445,
  "aliases": [
   "hang hau",
   "坑口站"
  ],
  "common": true
 },
 {
  "id": "hk150",
  "en": "Po Lam",
  "zh": "寶琳",
  "addrEn": "New Territories",
  "addrZh": "新界",
  "district": "新界 New Territories",
  "area": "nt",
  "lat": 22.32288,
  "lng": 114.25818,
  "aliases": [
   "po lam",
   "寶琳站"
  ],
  "common": true
 },
 {
  "id": "hk151",
  "en": "Tiu Keng Leng",
  "zh": "調景嶺",
  "addrEn": "New Territories",
  "addrZh": "新界",
  "district": "新界 New Territories",
  "area": "nt",
  "lat": 22.30489,
  "lng": 114.25296,
  "aliases": [
   "tiu keng leng",
   "調景嶺站"
  ],
  "common": true
 },
 {
  "id": "hk152",
  "en": "LOHAS Park",
  "zh": "康城",
  "addrEn": "New Territories",
  "addrZh": "新界",
  "district": "新界 New Territories",
  "area": "nt",
  "lat": 22.29569,
  "lng": 114.26834,
  "aliases": [
   "lohas park",
   "康城站",
   "日出康城"
  ],
  "common": true
 },
 {
  "id": "hk153",
  "en": "Tseung Kwan O Hospital",
  "zh": "將軍澳醫院",
  "addrEn": "New Territories",
  "addrZh": "新界",
  "district": "新界 New Territories",
  "area": "nt",
  "lat": 22.31828,
  "lng": 114.26966,
  "aliases": [
   "tko hospital",
   "tseung kwan o hospital"
  ],
  "common": true
 },
 {
  "id": "hk154",
  "en": "HKUST",
  "zh": "科技大學",
  "addrEn": "New Territories",
  "addrZh": "新界",
  "district": "新界 New Territories",
  "area": "nt",
  "lat": 22.3364,
  "lng": 114.2654,
  "aliases": [
   "hkust",
   "ust",
   "科大"
  ],
  "common": true
 },
 {
  "id": "hk155",
  "en": "Sai Kung",
  "zh": "西貢",
  "addrEn": "New Territories",
  "addrZh": "新界",
  "district": "新界 New Territories",
  "area": "nt",
  "lat": 22.38225,
  "lng": 114.27283,
  "aliases": [
   "sai kung",
   "西貢市中心",
   "西貢碼頭"
  ],
  "common": true
 },
 {
  "id": "hk156",
  "en": "Princess Margaret Hospital",
  "zh": "瑪嘉烈醫院",
  "addrEn": "New Territories",
  "addrZh": "新界",
  "district": "新界 New Territories",
  "area": "nt",
  "lat": 22.34124,
  "lng": 114.13458,
  "aliases": [
   "pmh",
   "princess margaret",
   "princess margaret hospital",
   "瑪嘉烈"
  ],
  "common": true
 },
 {
  "id": "hk157",
  "en": "Yan Chai Hospital",
  "zh": "仁濟醫院",
  "addrEn": "New Territories",
  "addrZh": "新界",
  "district": "新界 New Territories",
  "area": "nt",
  "lat": 22.36975,
  "lng": 114.11942,
  "aliases": [
   "yan chai",
   "yan chai hospital",
   "仁濟"
  ],
  "common": true
 },
 {
  "id": "hk158",
  "en": "North District Hospital",
  "zh": "北區醫院",
  "addrEn": "New Territories",
  "addrZh": "新界",
  "district": "新界 New Territories",
  "area": "nt",
  "lat": 22.49671,
  "lng": 114.1242,
  "aliases": [
   "ndh",
   "north district hospital"
  ],
  "common": true
 },
 {
  "id": "hk159",
  "en": "Alice Ho Miu Ling Nethersole Hospital",
  "zh": "那打素醫院",
  "addrEn": "New Territories",
  "addrZh": "新界",
  "district": "新界 New Territories",
  "area": "nt",
  "lat": 22.45992,
  "lng": 114.17423,
  "aliases": [
   "alice ho miu ling nethersole hospital",
   "nethersole",
   "那打素",
   "雅麗氏"
  ],
  "common": true
 },
 {
  "id": "hk160",
  "en": "Prince of Wales Hospital",
  "zh": "威爾斯親王醫院",
  "addrEn": "New Territories",
  "addrZh": "新界",
  "district": "新界 New Territories",
  "area": "nt",
  "lat": 22.37961,
  "lng": 114.20219,
  "aliases": [
   "prince of wales",
   "prince of wales hospital",
   "pwh",
   "威院"
  ],
  "common": true
 },
 {
  "id": "hk161",
  "en": "Ma Wan",
  "zh": "馬灣",
  "addrEn": "New Territories",
  "addrZh": "新界",
  "district": "新界 New Territories",
  "area": "nt",
  "lat": 22.34912,
  "lng": 114.05811,
  "aliases": [
   "ma wan",
   "park island",
   "珀麗灣"
  ],
  "common": true
 },
 {
  "id": "hk162",
  "en": "Tung Chung",
  "zh": "東涌",
  "addrEn": "Lantau",
  "addrZh": "大嶼山",
  "district": "大嶼山 Lantau",
  "area": "lantau",
  "lat": 22.28931,
  "lng": 113.94145,
  "aliases": [
   "citygate",
   "tung chung",
   "東涌站",
   "東薈城"
  ],
  "common": true
 },
 {
  "id": "hk163",
  "en": "Ngong Ping 360",
  "zh": "昂坪360",
  "addrEn": "Lantau",
  "addrZh": "大嶼山",
  "district": "大嶼山 Lantau",
  "area": "lantau",
  "lat": 22.2559,
  "lng": 113.9036,
  "aliases": [
   "big buddha",
   "ngong ping",
   "ngong ping 360",
   "大佛",
   "寶蓮寺",
   "昂坪"
  ],
  "common": true
 },
 {
  "id": "hk164",
  "en": "Hong Kong Disneyland",
  "zh": "迪士尼樂園",
  "addrEn": "Lantau",
  "addrZh": "大嶼山",
  "district": "大嶼山 Lantau",
  "area": "lantau",
  "lat": 22.31631,
  "lng": 114.04574,
  "aliases": [
   "disney",
   "disneyland",
   "hong kong disneyland",
   "迪士尼"
  ],
  "common": true
 },
 {
  "id": "hk165",
  "en": "Sunny Bay",
  "zh": "欣澳",
  "addrEn": "Lantau",
  "addrZh": "大嶼山",
  "district": "大嶼山 Lantau",
  "area": "lantau",
  "lat": 22.33285,
  "lng": 114.02822,
  "aliases": [
   "sunny bay",
   "欣澳站"
  ],
  "common": true
 },
 {
  "id": "hk166",
  "en": "Airport Terminal 2",
  "zh": "機場二號客運大樓",
  "addrEn": "Lantau",
  "addrZh": "大嶼山",
  "district": "大嶼山 Lantau",
  "area": "lantau",
  "lat": 22.317,
  "lng": 113.937,
  "aliases": [
   "airport terminal 2",
   "t2",
   "terminal 2",
   "二號客運大樓",
   "機場t2"
  ],
  "common": true
 },
 {
  "id": "hk167",
  "en": "AsiaWorld-Expo",
  "zh": "亞洲國際博覽館",
  "addrEn": "Lantau",
  "addrZh": "大嶼山",
  "district": "大嶼山 Lantau",
  "area": "lantau",
  "lat": 22.32125,
  "lng": 113.94297,
  "aliases": [
   "asiaworld expo",
   "asiaworld-expo",
   "awe",
   "亞博",
   "博覽館"
  ],
  "common": true
 },
 {
  "id": "hk168",
  "en": "HZMB Hong Kong Port",
  "zh": "港珠澳大橋口岸",
  "addrEn": "Lantau",
  "addrZh": "大嶼山",
  "district": "大嶼山 Lantau",
  "area": "lantau",
  "lat": 22.3008,
  "lng": 113.9545,
  "aliases": [
   "hzmb",
   "hzmb hong kong port",
   "大橋口岸",
   "港珠澳",
   "港珠澳大橋"
  ],
  "common": true
 },
 {
  "id": "hk169",
  "en": "Mui Wo",
  "zh": "梅窩",
  "addrEn": "Lantau",
  "addrZh": "大嶼山",
  "district": "大嶼山 Lantau",
  "area": "lantau",
  "lat": 22.26701,
  "lng": 113.99647,
  "aliases": [
   "mui wo",
   "梅窩碼頭"
  ],
  "common": true
 },
 {
  "id": "hk170",
  "en": "Discovery Bay",
  "zh": "愉景灣",
  "addrEn": "Lantau",
  "addrZh": "大嶼山",
  "district": "大嶼山 Lantau",
  "area": "lantau",
  "lat": 22.29938,
  "lng": 114.01457,
  "aliases": [
   "db",
   "discovery bay",
   "愉景灣"
  ],
  "common": true
 }
];
  const P = window.KAIFONG_PLACES;
  extra.forEach(e => {
    const same = P.find(p => p.zh === e.zh || p.en.toLowerCase() === e.en.toLowerCase());
    if (same) { e.aliases.forEach(a => { if (!same.aliases.includes(a)) same.aliases.push(a); }); return; }
    P.push(e);
  });
})();
