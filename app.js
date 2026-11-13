/* 街坊的 Kaifong Taxi: clickable prototype. Everything is simulated except place search,
   which uses the Hong Kong Government's free Address Lookup Service (als.gov.hk). Nothing is booked or sent. */
(function () {
  "use strict";

  const CFG = window.KAIFONG_CONFIG || {};
  const PLACES = window.KAIFONG_PLACES;
  const TARIFF = window.KAIFONG_TARIFF;
  const SUR = window.KAIFONG_SURCHARGE;
  let DPTS = 640; // driver's 街坊分 in the demo; Lv 8 at 700
  const FEAT = window.KAIFONG_FEATURES || {};
  const OFFERS = FEAT.offers === true, FIXED = FEAT.fixedPrice === true;
  const DISC = window.KAIFONG_DISCOUNT || { rate: 0.85, maxOff: 60, floor: { red: 90, green: 80, blue: 80 } };
  // discount rules: below the floor = meter; floor..floor/0.85 = flat floor; above = 85% (max maxOff off)
  function discountOf(meter, colour) {
    const floor = DISC.floor[colour || "red"] || DISC.floor.red;
    const threshold = Math.ceil(floor / DISC.rate);
    let mode, after;
    if (meter < floor) { mode = "full"; after = meter; }
    else if (meter < threshold) { mode = "flat"; after = floor; }
    else { mode = "pct"; after = Math.max(meter * DISC.rate, meter - DISC.maxOff); }
    after = Math.round(after * 10) / 10;
    const capped = mode === "pct" && meter * (1 - DISC.rate) > DISC.maxOff;
    return { mode, floor, threshold, after, off: Math.round((meter - after) * 10) / 10, capped };
  }

  // ================================================================ i18n
  const T = {
    zh: {
      demoBanner: "示範版：未係真服務，資料係假嘅",
      taglineTxt: "屬於街坊的街坊的", driverTop: "陳師傅 · TX 2468", driverChan: "陳師傅", levelBadge: "好師傅 ★★★",
      heroTitle: "走遍全港，街坊幫街坊",
      heroLead: "唔抽佣嘅街坊 Call 的士 App：師傅袋足車資，乘客冇隱藏收費。起步免費。",
      tryRider: "乘客版 Demo", tryDriver: "師傅版 Demo",
      statComm: "佣金", statFee: "起步免費", statFare: "車資歸師傅", statNote: "夠 1,000 個街坊先收每年 HK$30；頭 500 位第一年免費",
      storyTitle: "點解有街坊的？",
      story1: "我係一個普通乘客，唔係呢行嘅人。試過叫極都冇車，又試過覺得俾人兜路。",
      story2: "本地 Call 的士 App 一個個俾人收購、停運，飛的年尾都會收。我哋嘅選擇越嚟越少。",
      story3: "所以我呢個小薯仔學 vibe coding，整咗「街坊的」：唔抽佣、規則公開、街坊幫街坊。",
      painTitle: "你嘅煩惱，街坊的點解決", painRiderTab: "🙋 乘客", painDriverTab: "🚕 師傅",
      whyRiderTitle: "乘客",
      whyR1: "起步免費，冇每程收費；跟錶收費，附加費逐項列明",
      whyR2: "講你嘅語言：打字或者直接講，自動翻譯，用廣東話讀畀師傅聽",
      whyR3: "揀幾時準備好，實況等候時間，唔會「保證」呃你",
      whyR4: "長者、BB 車、輪椅、行李多？一撳就話畀師傅知",
      joinRider: "我想試，通知我 →",
      whyDriverTitle: "師傅",
      whyD1: "0% 佣金：車資、$5 電召附加費同小費全歸你",
      whyD2: "第一年免年費；頭 100 位師傅永久免費",
      whyD3: "交更順路單、淡市預約單；短途有獎賞",
      whyD4: "全部廣東話讀出，唔使打字；收入同獎賞一目了然",
      joinDriver: "我係師傅，想了解 →",
      featTitle: "街坊的特色",
      payTitle: "點樣俾錢？", payNote: "所有的士都收現金。2026 年 4 月起，每架的士最少收兩種電子支付；我哋只派畀收你揀嗰種嘅師傅。",
      payCardNote: "信用卡可能要另加 2–3% 手續費（例如 DASH 收 3%），唔係車資，亦唔係街坊的收；冇最低消費。",
      payNames: { cash: "現金", oct: "八達通", card: "信用卡", fps: "轉數快", alipay: "支付寶HK", wechat: "WeChat Pay", payme: "PayMe", bocpay: "BoC Pay" },
      zoneNote: "已按牌照區域派單。",
      navAppTitle: "導航用", navApps: { google: "Google 地圖", amap: "高德地圖" },
      payMinRule: "規定最少要收一種 QR（支付寶／WeChat Pay／PayMe／BoC Pay）同一種非 QR（八達通／轉數快／信用卡）。",
      payNowTitle: "落車俾錢", payNowOct: "喺師傅部機拍八達通", payNowCash: "俾現金畀師傅", payNowCard: "喺師傅部機拍卡（可能有約 3% 手續費）",
      payNowFps: "用銀行 App 轉數快去師傅：", payNowQR: "用{p}掃師傅收款碼", payNowQRsaved: "師傅嘅收款碼：儲存圖片，喺{p}揀相片付款", payNowSame: "金額同師傅部機一樣",
      codesTitle: "收款碼", codesNote: "儲喺你部機，落車時一撳就顯示畀乘客；錢直接入你戶口，街坊的唔經手。", fpsPh: "FPS ID 或電話", qrUpload: "上載 QR", qrChange: "換 QR",
      showCode: "顯示{p}收款碼", codeFor: "用{p}俾 HK${v}", codeClose: "收好", copyDone: "已複製", rcptPayTo: "{p}：{id}（撳一下複製）",
      profTitle: "登記資料", profNote: "登記時填好，之後隨時可以改。",
      avoidTitle: "接邊啲單", avoidNames: { disc: "折扣單", pet: "寵物", bags: "3 件以上行李", sched: "預約單" }, radiusTitle: "接客距離", radiusOpt: "{k} 公里內", carMineTitle: "我架車", carMine: { five: "5 座位", boot: "大尾箱", tall: "高身易上落" }, carMineNote: "乘客要特別車款，只會派畀有嘅師傅。", avoidNote: "全部都接；撳走唔想接嘅，唔會扣分。過海、機場、新界、大嶼山唔可以濾走（法例）；想返屋企方向就開交更模式。導盲犬一律要接，唔收寵物費。",
      payAcceptTitle: "我收", payAcceptNote: "撳走你唔收嘅。",
      payTag: "俾錢：{p}", pvPay: "俾錢",
      routeLive: "綠點／黃點／紅點係運輸署實時路況：由你嗰區去隧道口要幾耐（綠＝暢通，黃＝慢，紅＝塞）。", routeLiveShort: "隧道口 {m} 分鐘", routeLiveOff: "實時路況暫時攞唔到，時間係估算", routeLoading: "搵緊路線…",
      routeVia: "經 {r}", routeTag: "乘客揀：{r}", routeTagAuto: "乘客畀你揀路：行你熟嘅路就得", routeSuggest: "建議其他路", routeSuggested: "已建議改行另一條路，等乘客確認（示範）",
      routeSuggestBy: "陳師傅建議行：{r}", routeAgreeYes: "好，行呢條", routeAgreeKeep: "照我揀嘅", routeAgreed: "已傾掂路線：{r}。如果師傅行第二條路，App 會即刻通知你。", routeDriverPicks: "你畀師傅揀：陳師傅揀咗最快嗰條，{r}。", routeDriverChose: "你畀師傅揀：陳師傅會行佢熟嘅路，{r}", routeVsFast: "比最快多約 {m} 分鐘、貴約 ${d}", routeOk: "好", routeTakeFast: "問師傅可唔可以行最快", routeAskedFast: "已問陳師傅可唔可以行最快；行邊條路由師傅決定（示範）", routeAgreedAuto: "你畀師傅揀：師傅會行佢熟嘅路，車資照錶計。", dRouteLine: "傾掂路線：{r}",
      mapEta: "約 {m} 分鐘到", mapSoon: "就到", mapHere: "到咗", mapBusy: "送緊上一位乘客", dropFlag: "落客",
      etaBusy: "陳師傅送緊上一位乘客去{p}，落客後過嚟，約 {m} 分鐘到你度（地圖見到路線）",
      optRoute: "路線", optWhen: "時間", optPeople: "人數 · 行李", optNeeds: "特別需要 · 車款", optSave: "想慳啲？出個價", optPay: "俾錢", optFare: "車資同小費", optPreview: "車資明細",
      valNone: "冇特別", valMeter: "跟錶", valNow: "而家", valLater: "預約", valPax: "{n} 人", valBags: "{n} 件行李", valMore: "+{n} 項", valTip: "小費 ${n}", barPick: "揀咗目的地就見到車資",
      sideRider: "試乘客版", sideDriver: "試師傅版", demoLabel: "旁邊部手機試緊：", demoRider: "乘客版", demoDriver: "師傅版", sideSoon: "登記即將開放", sideHint: "用電腦都睇得；用手機打開，體驗更好",
      signTitle: "想第一批試？", signSub: "唔使俾錢、唔使下載。開始試用時，我哋會 WhatsApp 通知你。", signRider: "我係乘客，登記", signDriver: "我係師傅，登記",
      signSoon: "登記就快開放 🙏 遲啲再嚟睇吓", signNear: "或者用旁邊部手機即刻試 →", signBarTxt: "免費登記，開始試用即通知你", signBarBtn: "登記", sbRider: "我係乘客", sbDriver: "我係師傅",
      faqTitle: "常見問題", fbLink: "仲有問題或者想法？俾意見 →", fbSoon: "意見表就快開放 🙏 可以先電郵 kaifongtaxi@gmail.com",
      faq: [["有冇伏？", "師傅唔使俾佣，乘客冇每程收費；冇廣告、唔賣資料。"],
            ["係咪呃人㗎？", "問得好。而家完全唔使俾錢。將來就算收年費，都只會喺 App 入面俾；我哋絕對唔會私訊叫你轉數、傳俾你俾錢連結，亦唔會問你攞銀行資料、身份證或者驗證碼。官方聯絡只有呢個網站同 kaifongtaxi@gmail.com。"],
            ["點維持？", "起步免費；夠 1,000 個街坊先收每年 HK$30，用嚟交伺服器同地圖費，數目公開。"],
            ["有冇牌？", "只做持牌的士，唔涉及私家車。2025 年網約車條例嘅平台牌照，係管用私家車載客嘅平台；按條文，只做的士嘅平台唔喺呢個牌照範圍。"],
            ["會唔會又俾人收購？", "唔會賣。萬一有人想收購，或者我哋做唔落去，程式碼會全部公開，等街坊可以繼續用。"],
            ["幾時有得用？", "夠 10 位師傅同 100 個街坊登記就開始整，目標 2027 年 3 月 1 日試用。"]],
      trustList: ["登記唔使俾錢，唔會問你攞銀行資料或驗證碼", "試用前最多 WhatsApp／電郵你 3 次", "想刪除？回覆「刪除」就得"],
      storySign: "— Flo（發起人）",
      logTitle: "街坊的進度", logMoney: "開支 HK${s} · 收入 HK${i}", logMoneyNote: "網站用免費寄存；有開支會逐筆公開。", logNote: "每星期更新。",
      termsLink: "使用條款", termsTitle: "使用條款（示範版）", termsUpdated: "更新：2026 年 11 月 13 日",
      termsBody: [
        ["我哋嘅角色", "「街坊的」係一個社區項目（未註冊公司或慈善團體），只係提供平台畀乘客同持牌的士司機互相聯絡。我哋唔擁有、唔營運任何的士，亦唔係車程合約嘅一方：每一程車都係乘客同司機之間直接嘅協議。"],
        ["車資同付款", "車資按咪錶同法定附加費計，乘客直接俾司機。App 顯示嘅車資只係估算，以咪錶為準。我哋唔經手任何車資。"],
        ["大家嘅責任", "司機要遵守《道路交通（公共服務車輛）規例》等法例，並為自己嘅駕駛、收費同服務負責。乘客要提供準確資料、以禮待人。每個用戶都要為自己嘅行為負責。"],
        ["投訴同糾紛", "有關車資、駕駛或服務嘅投訴，請向運輸署運輸投訴組或者警方提出。我哋會喺合理範圍內協助，例如提供行程記錄；我哋唔會公開涉及個別人士嘅投訴。"],
        ["責任限制", "喺法律容許嘅範圍內，我哋唔會為司機或乘客嘅行為負責。呢度並唔排除因我哋疏忽而導致死亡或人身傷害嘅責任，亦唔影響你依法享有嘅權利。"],
        ["示範階段", "現時網站只係示範，未有真嘅叫車服務。"],
        ["私隱", "個人資料按私隱政策處理。"],
        ["修改同聯絡", "我哋可能會更新條款；有問題請電郵 {mail}。條款受香港法律管轄。"]
      ],
      privLink: "私隱政策", privTitle: "私隱政策（示範版）", privUpdated: "更新：2026 年 11 月 13 日", privClose: "明白",
      privBody: [
        ["我哋係邊個", "「街坊的」係一個街坊自發、唔係為賺錢嘅社區項目（未註冊公司或慈善團體），而家仲係示範版，冇真嘅預約、冇收錢。"],
        ["示範版收集咩", "唔使登記，我哋唔會收你嘅名或電話。語言、付款方式、大字等設定只會儲喺你部手機（瀏覽器），我哋睇唔到。"],
        ["「目前位置」", "只會喺你同意之後用，用嚟搵附近地址（會傳去 OpenStreetMap 嘅地址服務）；我哋唔會儲存你嘅位置。"],
        ["用到嘅外部服務", ["網站寄存：GitHub Pages", "地圖：OpenStreetMap（地圖程式經 unpkg 載入）", "路線：OSRM", "地址搜尋：政府地址查詢服務", "「目前位置」轉地址：OpenStreetMap Nominatim", "實時交通：運輸署開放數據", "翻譯：MyMemory（只會傳送要翻譯嘅字）", "繁簡轉換：程式經 jsDelivr 載入", "語音輸入：用你瀏覽器內置功能（有啲瀏覽器會將錄音交俾瀏覽器公司處理）", "導航：Google 地圖／高德（你撳先會開）"], "呢啲服務各有自己嘅私隱政策。"],
        ["登記表格", "表格（Google 表格）只收聯絡方法（WhatsApp 或電郵）同你自願答嘅問題，只用嚟通知你試用同問意見（試用前最多 3 次）；唔會賣、唔會分享；回覆「刪除」就即刻刪，項目停咗亦會全部刪除。"],
        ["想刪除資料", "隨時話我哋知（回覆通知訊息，或者電郵 {mail}），我哋會刪除。"],
        ["承諾", "冇廣告、唔賣資料。"]
      ],
      locBtn: "目前位置", locFinding: "搵緊你嘅位置…", locDenied: "攞唔到你嘅位置，可以直接打地址", locAway: "你而家唔喺香港，示範用 IFC 做目前位置", locLabel: "目前位置",
      addAgreed: "已傾掂", addChanged: "同訂單唔同，乘客會見到", addLocked: "乘客出價免咗，唔可以加",
      spendTitle: "車費紀錄", spendMonth: "今個月", spendYear: "今年", spendAvg: "平均每程", spendSaved: "出價慳咗", spendTrips: "{n} 程",
      addTitle: "附加費（撳嚟加減）", addNames: { bags: "行李", pet: "寵物", tunnel: "隧道費", ret: "回程隧道費", booking: "電召", tip: "小費" }, addEach: "每件 ${x}", addWaived: "乘客出價免咗",
      calcTitle: "要收", calcBy: "乘客用{p}俾", calcLine: "咪錶 ${m}{d} + {x}", calcSay: "要收{v}蚊，乘客用{p}俾。",
      navRoute: "跟住傾掂嘅路線導航（{r}）", navAuto: "導航去落車地點",
      soonPrep: { oct: "準備好八達通機", card: "準備好拍卡機", cash: "準備好找贖", code: "收款碼已經準備好", nocode: "準備好你嘅{p}收款碼" },
      keepDriver: "加入我嘅師傅", keepDriverDone: "已加入「我嘅師傅」：下次優先配對", blockDriver: "唔再配對", blockDriverDone: "已記低：之後唔會再配對呢位師傅。對方唔會知；可以喺「我」度取消。",
      keepRider: "加入熟客", keepRiderDone: "已加入熟客：佢下次叫車你會優先收到", blockRider: "唔再接呢位乘客", blockRiderDone: "已記低：之後唔會再派呢位乘客畀你。對方唔會知；可以喺「我」度取消。", undo: "取消",
      sEdit: "改時間或地點", sCancel: "取消預約", sRule: "開車前 2 小時或之前取消免費；之後算遲取消（會記錄）。改咗會通知師傅再確認。",
      sCancelled: "已取消 · 已通知師傅", sEdited: "示範：改時間或地點後，師傅會收到通知再確認",
      dsTake: "接預約單", dsTaken: "已接 ✓", dsCancel: "取消呢張單", dsRule: "開車前 2 小時或之前取消唔會扣分；之後算遲取消。你取消後，App 即刻幫乘客搵過另一位師傅。", dsCancelled: "已取消 · 已通知乘客，App 幫佢搵緊另一位師傅",
      soonTitle: "就快到喇", soonPay: "乘客用{p}俾錢", soonPayDisc: "八五折：記得按規則收", soonNext: "落客附近有 {n} 張新單", soonHold: "落客後先派畀我", soonHeld: "好，落客後第一時間派畀你（示範）", soonGap: "落客後 {m} 分鐘到客 · 乘客等得 {w} 分鐘", soonTake: "接", soonTaken: "已接：落客後直接去{p}，乘客見到你大約 {m} 分鐘到（示範）", soonTakenTag: "已接",
      offTake: "你收 ~${x}", offTime: "約 {m} 分鐘（接客 {p} + 車程 {t}）", offHour: "≈ 時薪 ${h}（按呢單 {m} 分鐘計）",
      offDisc: "已扣折扣 −${d}", offToll: "隧道費 ${x} 實報實銷，唔計入", offReq: "乘客要求",
      offPts: "+{p} 街坊分", offPtsNext: "接完 {a} 分 · 仲差 {n} 分升 Lv {l}", offPtsUp: "接完即升 Lv {l}！",
      ptsWhy: { base: "完成", short: "短途", disc: "折扣單", nosur: "免附加費", pass: "優先卡", care: "照顧需要", wait: "等候獎賞" },
      boardTitle: "附近等緊嘅單 · 等得耐排先", boardWait: "等咗 {m} 分鐘", boardBonus: "等候獎賞 +{p} 分", boardPick: "睇單", boardNote: "單唔會自己消失；等得愈耐，接單獎賞愈多（每 5 分鐘 +5，最多 +30）。",
      dPtsDone: "+{p} 街坊分 · 而家 {a} 分",
      routeTitle: "行邊條路？", routeAuto: "畀師傅揀", routeAutoSub: "師傅行佢熟嘅路，唔使喺下面揀", routeCHT: "紅隧", routeEHC: "東隧", routeWHC: "西隧",
      routeShort: "最短路（慳錶）", routeNoToll: "唔行收費隧道", routeFast: "最快", routeMin: "約 {m} 分鐘",
      routeNoteX: "三條過海隧道，的士隧道費一樣（$25 + 回程 $25）；分別在路程同塞車。時間同車資係估算。",
      routeNoteL: "師傅會跟你揀嘅路線行；上車後想改都可以同師傅講。", pvRoute: "路線",
      feesTitle: "年費用嚟做咩？",
      feesBody: "冇每程收費，唯一收費係年費：夠 1,000 個街坊先收，每年 HK$30（一杯咖啡都唔使）；頭 500 位街坊第一年免費。",
      feesList: [["營運", "伺服器、地圖、短訊，令 App 每日運作"], ["獎賞池", "好師傅、常客獎賞、優先卡"], ["儲備", "3 個月緊急儲備"], ["迎新", "推廣同獎賞，歡迎更多師傅同街坊加入"]],
      feesNote: "冇老闆分紅、冇投資者、冇廣告、唔賣資料：每一蚊都喺「睇數」逐項公開。",
      honestTitle: "我哋係邊個",
      honestBody: "呢個係一個人發起嘅街坊項目，仲係示範階段。我哋會先搵一細班師傅同街坊試，夠人先正式開。起步免費，冇廣告、唔賣資料；派單規則同每一蚊數目全部公開。",
      tryShow: "📇 試吓「畀師傅睇」地址卡",
      pickupLbl: "上車地點", destLbl: "目的地 · 去邊？", pickupPointLbl: "喺邊度等？",
      srcNote: "🔎 搜尋用政府地址資料庫：大部分大廈、屋苑、街道都搵到",
      rideNow: "而家搭", rideLater: "預約", readyLbl: "幾時準備好？", readyNow: "而家", ready5: "5 分鐘", ready10: "10 分鐘", ready15: "15 分鐘",
      readyNoteTxt: "唔使趕：會配對大約 {x} 分鐘後到嘅師傅。師傅見到你幾時落樓，等候寬限由你準備好嗰陣先計。",
      comingDown: "我落緊樓", moreTime: "要多 5 分鐘",
      comingDownToast: "已通知師傅：你落緊樓", moreTimeToast: "已話俾師傅知：遲多 5 分鐘。師傅可以揀等，或者免費取消。",
      etaReady: "實況：師傅會喺你準備好嗰陣（大約 {x} 分鐘後）到",
      prefWheel: "可摺輪椅", prefPet: "帶寵物", prefLug: "行李", prefEng: "講英文", prefSenior: "要多啲時間",
      carLbl: "車款", carAny: "冇所謂", carFive: "5 座", carBoot: "大尾箱", carTall: "高身車", carAccess: "輪椅的士",
      carNote: { five: "只派 5 座位的士", boot: "派尾箱較大嘅的士", tall: "派較高身、易上落嘅新款混能的士（適合長者、BB 車）", access: "無障礙的士要預約，附近數量少：會顯示 Diamond Cab、SynCab 等無障礙車隊嘅預約資料（唔係合作夥伴）" },
      grpLang: "我講嘅語言（師傅會見到翻譯）", lId: "Bahasa Indonesia", lTl: "Tagalog", lUr: "اردو Urdu", lNe: "नेपाली Nepali", lHi: "हिन्दी Hindi",
      langTag: "乘客講{l} · 訊息會自動翻譯做中文", carTag: "乘客要：{c}",
      paxLbl: "人數", bagsLbl: "行李", moreNeeds: "更多", grpWith: "同行", grpMove: "行動", grpPref: "喜好",
      nElder: "有長者", nKids: "有小朋友", nStroller: "有 BB 車", nBabyseat: "自備 BB 座椅", nPregnant: "有孕婦",
      nAccessible: "輪椅的士", nWalker: "用拐杖", nGuidedog: "帶導盲犬",
      nQuiet: "唔想傾偈", nCarsick: "會暈車浪", nMandarin: "講普通話", nAc: "冷氣細啲",
      driverNoteLbl: "同師傅講（自選）", needNotePh: "例如：我喺 B 座大堂，著紅色外套",
      nDeaf: "聽障，打字傾", nBlind: "視障，到咗叫我", deafTag: "聽障乘客：請用訊息，唔好打電話", blindTag: "視障乘客：到咗請落車叫佢／幫手指引",
      needsTag: "乘客備註：{n}", fiveSeat: "5 人：只派 5 座位的士", guideNote: "導盲犬：拒載可能違反《殘疾歧視條例》",
      seniorNote: "師傅會知你需要多啲時間，等候寬限加到 8 分鐘。唔使講原因：長者、行動唔方便、帶小朋友、買咗好多嘢都得。",
      seniorTag: "乘客需要多啲時間 · 寬限 8 分鐘", hospTag: "去醫院 · 計入「覆診天使」徽章",
      graceSenior: "等候寬限 8 分鐘（慢慢嚟）· 師傅同你睇到同一個時間",
      bookBtn: "Call 的士", bookLater: "預約的士",
      searching: "搵緊師傅…", cancelFree: "取消（免費）",
      redTaxi: "紅的", trips: "程", driverTags: "揸車穩陣、幫手搬行李",
      callDriver: "📞 打俾師傅", quickPhrases: "💬 訊息",
      send: "傳送", msgPh: "傳訊息畀師傅…", dMsgPh: "回覆乘客…",
      driverAuto: "收到，我仲有大約 2 分鐘到", driverAuto2: "我到咗喇，喺大堂門口",
      almost: "快到：師傅仲有大約 1 分鐘 · TX 2468", arrivedBanner: "師傅到咗！TX 2468 · 紅的 · 等緊你",
      translatedTag: "已翻譯", heard: "已用廣東話讀出", newMsg: "乘客新訊息",
      micListening: "聽緊…講完會自動傳送", micUnsupported: "呢個瀏覽器唔支援語音輸入，可以打字", micDenied: "未有咪高峰權限",
      langCmn: "師傅講廣東話：你嘅訊息會用廣東話讀畀師傅聽，師傅講嘅嘢會變成文字畀你睇",
      langOther: "介面暫時用英文；你嘅訊息會自動翻譯畀師傅，師傅嘅回覆會翻譯返做你嘅語言",
      trPrevR: "師傅會見到：{x}", trSentR: "師傅見到：{x} · 用廣東話讀咗出嚟", trPrevD: "乘客會見到（{l}）：{x}", trWorking: "翻譯緊…", trDemo: "示範用免費翻譯服務",
      riderIncoming: "我喺大堂，著紅色外套",
      passTag: "乘客用咗「繁忙優先卡」· 接呢單 +15 街坊分",
      voiceFirst: "師傅版：所有訊息同備註都會用廣東話讀出，師傅可以用把聲回覆",
      driverQuick: ["收到", "仲有 2 分鐘", "我到咗喇", "你喺邊個出口？", "塞緊車，遲少少"],
      simArrive: "（示範）師傅到咗 ▶", arrived: "師傅到咗，等緊你",
      grace: "等候寬限 5 分鐘 · 師傅同你睇到同一個時間",
      simBoard: "（示範）上咗車 ▶", doneTitle: "到咗喇，唔該晒！記得帶齊嘢",
      fareOk: "✓ 同咪錶一樣", fareBad: "✗ 唔一樣",
      rateDriver: "評吓陳師傅", again: "再試一次",
      sharedNote: "🤝 你同師傅見到嘅資料一模一樣：時間、車資估算、出價、等候計時",
      goOnline: "開工", goOffline: "收工",
      newJob: "有客！", pickupShort: "上車", dropShort: "落車",
      accept: "接單", decline: "唔接（唔會扣分）",
      goPickup: "去接客", navigate: "🧭 導航", callRider: "📞 打俾客",
      iArrived: "我到咗", enterMeter: "輸入咪錶車資", complete: "完成",
      dDoneTitle: "完成！唔該晒師傅", rateRider: "評吓呢位客",
      shiftSetup: "🔄 交更設定", shiftTimeLbl: "交更時間", shiftAreaLbl: "交更地點（乘客只見到地區）",
      shiftOn: "開交更模式", shiftOff: "關交更模式",
      showTitle: "畀師傅睇", showLead: "揀個地方，放大畀的士師傅睇。喺街上揚手叫的士都用得。", close: "關閉",
      tabs: { ride: "叫車", sched: "預約", fav: "我嘅師傅", me: "我", jobs: "接單", dsched: "預約單", earn: "收入", dme: "我" },
      // dynamic
      nearby: "<b>實況：</b>附近有 {n} 架的士在線 · 最近大約 {m} 分鐘",
      shiftLine: "🔄 其中 2 架交更中，順路去：九龍灣、柴灣。如果你去嗰邊，會優先配對。",
      sent: "已通知 {n} 架的士 · 未有人接 · {t}",
      matchedNow: "師傅接咗單！", matchedLater: "已確認：陳師傅接咗你嘅預約",
      schedBadge: "預約 SCHEDULED · {d}",
      eta: "實況：大約 {a}–{b} 分鐘到 · 實時位置喺地圖",
      cancelWithin: "取消（免費，剩 {t}）", cancelLate: "取消（會記一次遲取消）",
      callToast: "示範版：真 App 會直接打俾師傅（師傅免提接聽）",
      callRiderToast: "示範版：真 App 會直接打俾乘客",
      phraseSent: "已傳送：「{p}」· 師傅會聽到廣東話",
      fareOkToast: "多謝！車資已確認 ✓",
      fareBadToast: "示範版：真 App 會開報告，自動附上行程記錄",
      formSoon: "登記快將開放，請稍後再試 🙏",
      demoToast: "示範版：呢個掣喺真 App 先有用",
      launchTitle: "幾時開？夠人就開！",
      launchStep1: "第一步：開始整真 App", launchStep1D: "{d} 前有 {dr} 位師傅 + {rr} 位街坊登記",
      launchStep2: "第二步：開始試用", launchStep2D: "{dr} 位師傅 + {rr} 位街坊 → {d} 開始試用",
      launchDrivers: "師傅", launchRiders: "街坊", launchNote: "數字每星期更新 · 一齊推，越快夠人越快有得用",
      launchCta: "我想做頭一批",
      quoteNote: "估算，以咪錶為準 · 示範資料",
      waivedLbl: "你出價免咗",
      shortNoteR: "短途（咪錶 ${f} 以下）照錶收。師傅短途要空車去接你，加 $5–10 小費會快啲有人接。全數歸師傅。",
      shortBoost: "短途獎勵：接呢單，落車後 30 分鐘內下一單優先",
      shortChain: "落車附近有 2 張預約單",
      shortNear: "只派俾 3 分鐘內嘅師傅", offerNoSur: "乘客出價：免附加費（行李、寵物、電召、回程隧道費）· 實際隧道費照付",
      items: { meter: "跟錶", disc: "八五折", discFlat: "定額", tunnel: "隧道費", ret: "回程隧道費", booking: "電召附加費", luggage: "行李", pet: "寵物", tip: "小費" },
      previewLabel: "師傅會見到：", stopAt: "等候位置",
      receiptMeter: "咪錶", total: "合共", toDriver: "全歸師傅",
      idleOff: "撳「開工」開始接單",
      idleOn: "等緊單… 你喺銅鑼灣附近",
      statusOn: "實況：呢區下一單大約 6–15 分鐘",
      statusShift: "🔄 交更模式 · {time} 前只派順路單去{area}",
      statusOff: "收咗工",
      offerMeta: "距離 {km} 公里 · 大約 {min} 分鐘到客",
      offerWait: "⏱ 乘客已等 {w} · {ready}",
      readyYes: "準備好", ready5Txt: "5 分鐘後落樓",
      offerRider: "乘客 4.6★ · 23 程 · 好街坊 · 放飛機 0 次",
      offerFare: "估計車資 HK${f}",
      offerNone: "乘客揀：跟錶",
      offer85: "乘客出價：八五折（$90 以下照錶 · $90–106 定額 $90 · 最多減 $60 · 附加費照付）",
      shiftTag: "🔄 交更順路 ✓",
      riderLine: "陳小姐 · 準備好 · 4.6★ 好街坊",
      meterNeeded: "請輸入咪錶車資",
      levelCard: "<b>好師傅 ⭐⭐⭐</b> · 完成率 98% · 4.9★ · 讚賞 42<br><span>派單規則公開：距離先，同距離時好師傅早幾秒收到</span>",
      rateTagsGood: ["準時", "揸車穩陣", "有禮貌", "識路", "幫手搬行李", "車廂乾淨", "幫手扶上車"],
      rateTagsBad: ["遲到", "兜路", "揸車太快", "態度差", "車廂有異味"],
      riderTagsGood: ["準時上車", "有禮貌", "上車位清楚", "幫咗長者上落車"],
      riderTagsBad: ["遲落樓", "放飛機", "態度差", "上車位唔清楚", "整污糟車廂"],
      rateHint: "撳一下就得，想打字都得",
      notePh: "加句說話畀師傅（自選）", notePhD: "加句說話畀乘客（自選）", sendNoteBtn: "送出",
      quickThanks: ["多謝師傅！", "辛苦晒", "揸車好穩", "好準時", "下次再搵你"],
      noteSent: "已送出，師傅會喺「多謝牆」見到 ❤", noteSentD: "已送出",
      thanksInTxt: "陳小姐留言：「多謝師傅，好準時！」",
      stars: [["正！", 5], ["好", 4], ["OK", 3], ["麻麻", 2], ["唔掂", 1]],
      thanksRate: "多謝評分！",
      phrases: ["我喺大堂", "我喺門口等緊", "等我兩分鐘", "有行李要開尾箱"],
      pickupPoints: ["大堂", "正門", "的士站", "落客區", "港鐵站出口"],
      fare: {
        meterT: "跟錶", meterD: "{n} 架的士可以接",
        offerT: "我出價", offerD: "{n} 架會考慮 · 師傅可揀接唔接，唔扣分",
        fixedT: "一口價（車隊）", fixedD: "車隊的士 · 附近 1 架 · 示範",
        o85: "八五折", oOne: "單程隧道費", oNoBook: "免電召費", oNoSur: "免全部附加費", oNoLug: "免行李費", oNoPet: "免寵物費",
        discShort: "八五折點計：咪錶 ${f} 以下照錶 · ${f}–${th} 收 ${f} · 之後八五折（每程最多減 ${m}）",
        saveTitle: "想慳啲？出個價", saveSub: "可以揀多過一個，隧道費照俾。", saveNoTunnel: "呢程唔過海：「單程隧道費」唔適用。",
        discRule: "八五折規則：咪錶 ${f} 以下照錶 · ${f}–${th} 收定額 ${f} · ${th} 以上八五折（最多減 ${m}）· 隧道費同附加費唔打折",
        discNow: "呢程大約減 ${off}", discNowFull: "呢程咪錶未到 ${f}，照錶收", discNowFlat: "呢程收定額 ${f}", discNowCap: "已到封頂，減 ${off}",
        tipLbl: "小費（自願）", tipNone: "唔使", tipCustom: "自訂", tipNote: "全數歸師傅 · 最多 $100 · 落車後都可以再俾", tipPrompt: "小費金額（HK$0–100）："
      },
      searchingLive: "搵緊政府地址資料庫…", noResult: "搵唔到，試吓大廈名或者街名",
      features: [
        ["唔抽佣", "師傅袋足，乘客冇加價"],
        ["自己揀路", "上車前傾掂，大家唔使估"],
        ["車資清楚", "落車前計好，冇爭拗"],
        ["實況到達", "幾時到、去邊，雙方都睇到"],
        ["語言無阻", "自動翻譯，大家都明"],
        ["傷健友善", "一早講明，師傅有準備"]
      ],
      painsRider: [
        ["叫極都冇車", "實況等候時間同師傅位置；交更順路嘅師傅優先載你"],
        ["驚俾人兜路", "上車前自己揀路線，有實時路況；行程有記錄"],
        ["落車先知要加錢", "落車前計好車資，附加費逐項列明，冇隱藏收費"]
      ],
      painsDriver: [
        ["平台抽佣，生意越做越難", "0% 佣金：車資、電召附加費同小費全歸你"],
        ["淡市兜圈空車", "預約單填淡市；就快落客，App 派埋下一單"],
        ["規則黑盒，唔知點解冇單", "派單規則公開；唔接單唔扣分"]
      ],
      panels: {
        schedTitle: "我嘅預約", newSched: "＋ 新預約",
        sched: [
          ["預約 SCHEDULED · 星期二 09:00", "太古城中心 → 瑪麗醫院", "✅ 已確認：陳師傅 · TX 2468 · 好師傅", "🔁 覆診，每星期重複"],
          ["預約 SCHEDULED · 星期五 06:30", "屋企 → 機場一號客運大樓", "⏳ 未確認：搵緊師傅（2 小時前未有人接會通知你）", "🧳 2 件行李"]
        ],
        favTitle: "我嘅師傅", favNote: "鍾意嘅師傅可以直接再搵佢。師傅都可以將你加做「熟客」。", rebook: "再搵佢",
        favs: [["陳師傅", "TX 2468 · 紅的 · 好師傅 ⭐⭐⭐", "4.8★ · 揸車穩陣、幫手搬行李", "上次：10 月 28 日"],
               ["李師傅", "NT 1357 · 綠的", "4.7★ · 好有禮貌、識路", "上次：9 月 15 日"]],
        meTitle: "我", meLevel: "好街坊 ⭐⭐⭐", meStats: "4.9★ · 31 程 · 準時上車 · 放飛機 0 次",
        meNote: "師傅見到你嘅評分，同你見到師傅嘅一樣：雙向透明。",
        historyTitle: "行程記錄",
        history: [["10 月 28 日 · 太古城中心 → 瑪麗醫院", "HK$146 · 已確認咪錶 ✓"], ["10 月 20 日 · 朗豪坊 → 又一城", "HK$58 · 已確認咪錶 ✓"], ["10 月 12 日 · 海港城 → 機場", "HK$298 · 已確認咪錶 ✓"]],
        duesTitle: "街坊年費", duesBody: "而家完全免費。夠 1,000 個街坊先開始收：每年 HK$30（一杯咖啡都唔使，約每月 HK$2.5）；頭 500 位街坊第一年免費。師傅第一年免費（頭 100 位師傅永久免費），之後大家一樣每年 HK$30。收返嚟嘅錢：先交營運成本，餘數全數撥入「街坊獎賞池」，回饋師傅同街坊。",
        booksTitle: "睇數（公開帳目）", booksBody: "示範：每 HK$100 年費點用",
        booksSplit: [["營運成本", 45, "伺服器、地圖、短訊"], ["街坊獎賞池", 45, "洗車券、餐券、好師傅之星"], ["儲備", 10, "3 個月緊急儲備"]],
        booksNote: "冇老闆分紅、冇投資者。每一蚊都逐項公開。",
        settingsTitle: "設定", settings: ["語言：廣東話 · English · Bahasa Indonesia · Tagalog · اردو · नेपाली", "大字同高對比", "讀屏（VoiceOver / TalkBack）同語音輸入", "聽障模式：只用訊息、震動提示", "幫屋企人叫車（長者唔使有手機）", "緊急聯絡人"],
        dschedTitle: "預約單", dschedNote: "預約單唔會撞你嘅交更時間。60 分鐘前要再確認。",
        dsched: [["預約 · 明天 10:30", "美孚新邨 → 伊利沙伯醫院", "覆診 · 估計 HK$95–115 · 淡市時段", "接預約單"],
                 ["預約 · 星期六 05:45", "太古城 → 機場", "🧳 3 件 · 估計 HK$330–390", "接預約單"]],
        earnTitle: "今日", earn: [["8 程", "完成"], ["HK$1,284", "車資"], ["HK$0", "平台佣金"], ["HK$40", "電召附加費（全歸你）"]],
        earnNote: "淡市時段預約單：3 張 · 交更順路單：1 張",
        earnTabs: ["今日", "今個星期", "今個月"],
        earnData: [
          { total: 1374, trips: 8, hours: 6.5, empty: "1 小時 10 分", fare: 1284, booking: 40, tips: 50, goal: 1600 },
          { total: 8420, trips: 51, hours: 41, empty: "7 小時 30 分", fare: 7890, booking: 255, tips: 275, goal: 9000 },
          { total: 31260, trips: 196, hours: 158, empty: "29 小時", fare: 29350, booking: 980, tips: 930, goal: 33000 }
        ],
        earnLbls: { total: "收入", goal: "目標", trips: "程數", hours: "上線", perHour: "每小時", empty: "空車時間", fare: "車資", booking: "電召附加費", tips: "小費", comm: "平台佣金" },
        commSaved: "假如要俾 10% 佣金，呢段時間你會少咗 HK${x}（假設數字）。喺街坊的，全歸你。",
        pointsTitle: "街坊分", pointsNow: "{p} 分", streak: "連續 6 日冇遲取消",
        pointsEarn: [["接用咗優先卡嘅單", "+15"], ["接短途單", "+20"], ["準時到達", "+5"], ["收到讚賞", "+10"], ["確認預約單", "+10"], ["連續 7 日冇取消", "+50"]],
        poolNote: "獎賞由「街坊獎賞池」支付：街坊年費交完營運成本之後嘅餘數，全數回饋社區。",
        redeemTitle: "換領", redeem: [["下一單優先卡", "200 分", "自己用"], ["洗車券", "500 分", "贊助商"], ["茶餐廳餐券", "800 分", "贊助商"]], redeemBtn: "換",
        exportBtn: "匯出收入記錄（報稅用）",
        impactTitle: "今日你嘅單", impact: [["3", "程去醫院"], ["1", "程去機場"], ["2", "位慢慢嚟嘅街坊"]],
        milestone: "今年你載咗 860 位街坊，行咗 12,400 公里",
        wallTitle: "多謝牆", wall: [["陳小姐", "多謝師傅送我阿媽去覆診，好有耐性 ❤"], ["Mr Lee", "Thank you for waiting while I got my bags!"], ["黃生", "揸車好穩，下次再搵你"]],
        storyTitle: "我嘅師傅故事（乘客會見到）", story: "揸咗二十年的士，最熟九龍東。鍾意同乘客傾偈，最開心係送人去機場團聚。", storyEdit: "改",
        questsTitle: "今日任務", questDone: "完成",
        quests: [["接 2 張短途單", 1, 2, "+40"], ["準時到達 5 次", 4, 5, "+25"], ["收 1 個讚賞", 1, 1, "+10"]],
        levelLine: "Lv 7 · 好師傅", levelNext: "仲差 60 分升 Lv 8", levelPct: 70,
        lifetime: "用街坊的以嚟，假如要俾 10% 佣金，你會俾咗 HK$4,860；喺度一蚊都唔使俾",
        restNote: "今日已上線 6.5 小時。揸夠 10 小時會提你休息；任務同分數唔會鼓勵長時間或者快速揸車。",
        badgesTitle: "徽章", badges: [["覆診天使", "去醫院或診所 10 程", 1], ["機場常客", "機場單 20 張", 1], ["交更達人", "交更順路單 15 張", 1], ["短途英雄", "短途單 30 張 · 18/30", 0], ["零取消月", "一個月冇遲取消 · 6/30 日", 0], ["推薦師傅", "推薦 3 位師傅 · 1/3", 0]],
        districtTitle: "18 區收集", districtTxt: "已喺 11 / 18 區接過客 · 下一區：離島", districtN: 11,
        leaderTitle: "九龍區讚賞榜（自願參加）", leaderTxt: "你排第 3 · 只計讚賞同準時，唔計收入或者上線時數",
        rLevel: "Lv 4 · 好街坊", rLevelNext: "仲差 40 分升 Lv 5：解鎖「我嘅師傅優先」", rLevelPct: 75,
        rQuestsTitle: "今個月任務", rQuests: [["準時上車 3 次", 2, 3, "+15"], ["評分師傅 3 次", 3, 3, "+10"], ["試用一次預約", 0, 1, "+20"], ["推薦一位朋友", 0, 1, "+30"]],
        rUnlockTitle: "升級解鎖（唔係錢）", rUnlocks: [["Lv 3", "取消免責卡（每月 1 張）", 1], ["Lv 4", "繁忙時段優先派單", 1], ["Lv 5", "我嘅師傅優先：鍾意嘅師傅先收到你張單", 0], ["Lv 6", "新功能搶先試", 0]],
        loyalTitle: "常客獎賞", loyal: [["常客：今年搭夠 24 程減 $5，夠 52 程減 $10", 18, 52, [[24, "−$5"], [52, "−$10"]]], ["推薦朋友加入：每位送你一張繁忙優先卡（最多 3 位）", 1, 3], ["每 10 程：一張「繁忙優先卡」（落雨、交更、繁忙時段優先派單）", 8, 10]],
        loyalNote: "所有減免加埋最多 HK$20（最少收 HK$10）。車資照錶直接俾師傅，師傅唔會少收。年費先交營運成本同儲備，獎賞只用剩低嘅錢；唔夠就自動減少，App 一定可以繼續運作。",
        rPointsTitle: "街坊分", rPoints: "320 分",
        rPerks: [["取消免責卡", "每月 1 張：遲取消一次都唔記錄", "有 1 張"], ["繁忙時段優先", "好街坊喺交更、落雨時早幾秒派單", "已解鎖"], ["師傅送嘅優先卡", "陳師傅送咗一張畀你：多謝你準時又有禮貌", "有 1 張"]],
        rBadges: [["準時街坊", 1], ["覆診好幫手", 1], ["18 區探索家 · 6/18", 0]],
        rImpact: "你今年搭嘅車資全歸師傅：假如要抽 10% 佣金，師傅就要俾 HK$186",
        dmeTitle: "我", dmeCompl: "讚賞", compliments: [["揸車穩陣", 18], ["幫手搬行李", 11], ["好有禮貌", 9], ["識路", 4]],
        starTitle: "好師傅之星", starBody: "今個月九龍區提名：你排第 3 · 乘客提名 6 個",
        rulesTitle: "派單規則（公開）", rules: ["1. 距離先：最近嘅師傅先收到", "2. 同樣近：好師傅早幾秒收到", "3. 輪流派，唔會次次都係同一批人", "4. 唔接單唔扣分；接咗再取消先計", "5. 等咗 30 分鐘冇單，下一單優先", "6. 短途單只派 3 分鐘內嘅師傅；接短途，落車後 30 分鐘內下一單優先，仲會計多啲好師傅分"],
        giftTitle: "送優先卡畀街坊", giftBody: "好師傅每月有 3 張優先卡，可以送畀熟客、長者，或者你幫過嘅乘客。今個月仲有 2 張。", giftBtn: "送畀熟客",
        dDuesTitle: "師傅年費", dDuesBody: "第一年完全免費。你係頭 100 位師傅之一，會永久免費。之後其他師傅同乘客一樣每年 HK$30。",
        regularsTitle: "我嘅熟客", regulars: "陳小姐（好街坊）· 黃生（覆診，每星期二）"
      }
    },
    en: {
      demoBanner: "Demo only: not a live service, all data is fake",
      taglineTxt: "Hail a neighbour", driverTop: "Driver Chan · TX 2468", driverChan: "Driver Chan", levelBadge: "Top Driver ★★★",
      heroTitle: "Every street, every ride, neighbours side by side",
      heroLead: "A no-commission taxi app run by neighbours. Drivers keep every dollar; riders get no hidden charges. Free to start.",
      tryRider: "Rider demo", tryDriver: "Driver demo",
      statComm: "commission", statFee: "free to start", statFare: "of the fare to the driver", statNote: "HK$30 a year from 1,000 users; the first 500 get year one free",
      storyTitle: "Why 街坊的?",
      story1: "I'm an everyday passenger, not from the taxi trade. I've waited ages for a cab that never came, and felt taken the long way round.",
      story2: "Local taxi apps keep getting bought up and shut down, and FlyTaxi closes at the end of the year. Our choices keep shrinking.",
      story3: "So this small potato started vibe coding and built 街坊的: no commission, open rules, neighbours helping neighbours.",
      painTitle: "What drives you mad, and what we did about it", painRiderTab: "🙋 Passengers", painDriverTab: "🚕 Drivers",
      whyRiderTitle: "Passengers",
      whyR1: "Free to start, nothing to pay per trip; metered fares with every extra listed",
      whyR2: "Use your own language: type or just speak, and it's translated and read to your driver in Cantonese",
      whyR3: "Say when you'll be ready and see real wait times, never a fake \"guarantee\"",
      whyR4: "Travelling with an older person, a stroller, a wheelchair or lots of bags? Tell your driver in one tap",
      joinRider: "I'd like to try it: notify me →",
      whyDriverTitle: "Drivers (師傅)",
      whyD1: "0% commission: the fare, the $5 booking surcharge and tips are all yours",
      whyD2: "No subscription in your first year; the first 100 drivers to join are free for good",
      whyD3: "Jobs on your way to shift change, bookings for quiet hours, and priority rewards for short trips",
      whyD4: "Everything read aloud in Cantonese, no typing, and your earnings and rewards at a glance",
      joinDriver: "I'm a driver: tell me more →",
      featTitle: "The good bits",
      payTitle: "How are you paying?", payNote: "Every taxi takes cash. Since April 2026 every taxi must also take at least two e-payment methods, and we only send your trip to drivers who take yours.",
      payCardNote: "Cards may carry a 2–3% fee (DASH charges 3%). It isn't part of the fare and 街坊的 doesn't charge it; there's no minimum.",
      payNames: { cash: "Cash", oct: "Octopus", card: "Card", fps: "FPS", alipay: "AlipayHK", wechat: "WeChat Pay", payme: "PayMe", bocpay: "BoC Pay" },
      zoneNote: "Jobs already follow your licence area.",
      navAppTitle: "Navigation app", navApps: { google: "Google Maps", amap: "Amap (高德)" },
      payMinRule: "The rules say you must take at least one QR method (AlipayHK, WeChat Pay, PayMe, BoC Pay) and one non-QR method (Octopus, FPS, card).",
      payNowTitle: "Pay at drop-off", payNowOct: "Tap your Octopus on the driver's reader", payNowCash: "Pay the driver in cash", payNowCard: "Tap your card on the driver's reader (a fee of about 3% may apply)",
      payNowFps: "Pay by FPS in your bank app to:", payNowQR: "Scan the driver's code with {p}", payNowQRsaved: "Driver's payment code: save the image and choose it from your photos in {p}", payNowSame: "Same amount as on the driver's screen",
      codesTitle: "Payment codes", codesNote: "Saved on your phone. Tap to show the passenger at drop-off; money goes straight to you, and 街坊的 never handles it.", fpsPh: "FPS ID or phone number", qrUpload: "Upload QR", qrChange: "Change QR",
      showCode: "Show {p} code", codeFor: "Pay HK${v} by {p}", codeClose: "Done", copyDone: "Copied", rcptPayTo: "{p}: {id} (tap to copy)",
      profTitle: "Your registration details", profNote: "Filled in when you sign up; change them any time.",
      avoidTitle: "Jobs I take", avoidNames: { disc: "Discount offers", pet: "Pets", bags: "3+ bags", sched: "Bookings ahead" }, radiusTitle: "Pickup distance", radiusOpt: "within {k} km", carMineTitle: "My taxi", carMine: { five: "5 seats", boot: "Big boot", tall: "Easy-access" }, carMineNote: "Passengers who need a particular taxi only go to drivers who have one.", avoidNote: "All on by default. Tap off what you don't want; no penalty. Cross-harbour, airport, NT and Lantau trips can't be filtered out (the law); to head home, use shift-change mode. Guide dogs are always accepted, with no pet fee.",
      payAcceptTitle: "I take", payAcceptNote: "Tap off any you don't take.",
      payTag: "Pays by {p}", pvPay: "Payment",
      routeLive: "The coloured dots are live from the Transport Department: how long it takes from your area to the tunnel entrance (green = clear, amber = slow, red = jammed).", routeLiveShort: "{m} min to the tunnel", routeLiveOff: "Live traffic isn't available right now, so times are estimates", routeLoading: "Finding routes…",
      routeVia: "via {r}", routeTag: "Passenger's route: {r}", routeTagAuto: "Passenger lets you pick: take whichever way you know best", routeSuggest: "Suggest another route", routeSuggested: "Route suggestion sent; waiting for the passenger to confirm (demo)",
      routeSuggestBy: "Driver Chan suggests: {r}", routeAgreeYes: "OK, take that one", routeAgreeKeep: "Keep mine", routeAgreed: "Route agreed: {r}. If the driver goes another way, you'll get an alert straight away.", routeDriverPicks: "You left it to the driver: Driver Chan picked the fastest, {r}.", routeDriverChose: "You left it to the driver. Driver Chan's usual way: {r}", routeVsFast: "about {m} min longer and ~${d} more than the fastest", routeOk: "OK", routeTakeFast: "Ask for the fastest", routeAskedFast: "Asked Driver Chan about taking the fastest route; the driver decides (demo)", routeAgreedAuto: "You left it to the driver: they'll take the way they know best, and the fare is by the meter.", dRouteLine: "Agreed route: {r}",
      mapEta: "about {m} min away", mapSoon: "almost there", mapHere: "arrived", mapBusy: "finishing a drop-off", dropFlag: "Drop-off",
      etaBusy: "Driver Chan is dropping off another passenger at {p}, then coming to you: about {m} min (route on the map)",
      optRoute: "Route", optWhen: "When", optPeople: "People & bags", optNeeds: "Special needs · taxi type", optSave: "Pay less? Make an offer", optPay: "Payment", optFare: "Fare & tip", optPreview: "Fare details & driver card",
      valNone: "None", valMeter: "Meter", valNow: "Now", valLater: "Booked", valPax: "{n} people", valBags: "{n} bags", valMore: "+{n} more", valTip: "tip ${n}", barPick: "Pick a destination to see the fare",
      sideRider: "Try the passenger app", sideDriver: "Try the driver app", demoLabel: "The phone is showing:", demoRider: "Passenger", demoDriver: "Driver", sideSoon: "Sign-up opening soon", sideHint: "Works on a computer; even better on your phone",
      signTitle: "Want to be among the first?", signSub: "No payment, nothing to download. We'll message you on WhatsApp when the trial opens.", signRider: "Sign up as a passenger", signDriver: "Sign up as a driver",
      signSoon: "Sign-up opens very soon 🙏 please check back", signNear: "Or try the phone beside this, right now →", signBarTxt: "Sign up free, and we'll tell you when the trial opens", signBarBtn: "Sign up", sbRider: "Passenger", sbDriver: "Driver",
      faqTitle: "Questions", fbLink: "Other questions or ideas? Send feedback →", fbSoon: "The feedback form opens soon 🙏 meanwhile, email kaifongtaxi@gmail.com",
      faq: [["What's the catch?", "Drivers pay no commission and passengers pay nothing per trip. No ads, and we never sell your data."],
            ["Is this a scam?", "Fair question. It's completely free right now. Even once the yearly fee starts, you'll only ever pay inside the app. We'll never message you asking for a transfer, never send you a payment link, and never ask for bank details, ID or verification codes. Our only official contacts are this site and kaifongtaxi@gmail.com."],
            ["How does it keep going?", "Free to start; a HK$30 yearly subscription only from 1,000 users, to pay for servers and maps. Every dollar is published."],
            ["Is it licensed?", "Licensed taxis only, no private cars. The 2025 ride-hailing law licenses platforms that carry passengers in private cars; on its wording, a taxi-only platform falls outside that licence."],
            ["Will it get bought and shut down too?", "It's not for sale. If anyone ever tries to buy it, or we can't carry on, the code will be published so the community can keep it running."],
            ["When can I use it?", "We start building once 10 drivers and 100 passengers sign up, aiming for a trial on 1 March 2027."]],
      trustList: ["Signing up is free. We'll never ask for bank details or codes", "At most 3 messages before the trial", "Reply \"delete\" any time to be removed"],
      storySign: "— Flo, who started 街坊的",
      logTitle: "Progress so far", logMoney: "Spent HK${s} · Income HK${i}", logMoneyNote: "The site runs on free hosting; any spending will be listed item by item.", logNote: "Updated every week.",
      termsLink: "Terms", termsTitle: "Terms of use (demo)", termsUpdated: "Updated 13 November 2026",
      termsBody: [
        ["Our role", "街坊的 is a community project (not a registered company or charity) that only helps passengers and licensed taxi drivers connect. We don't own or run taxis and we're not a party to any trip: each trip is an agreement directly between the passenger and the driver."],
        ["Fares and payment", "Fares follow the meter and lawful surcharges, and passengers pay drivers directly. Fares shown in the app are estimates; the meter decides. We never handle fares."],
        ["Everyone's responsibilities", "Drivers must follow the law, including the taxi regulations, and are responsible for their driving, charging and service. Passengers must give accurate details and treat drivers with respect. Every user is responsible for their own conduct."],
        ["Complaints and disputes", "Complaints about fares, driving or service go to the Transport Department's Transport Complaints Unit or the Police. We'll help where reasonable, for example with trip records. We don't publish complaints about named individuals."],
        ["Limits of liability", "To the extent the law allows, we're not responsible for the conduct of drivers or passengers. Nothing here excludes liability for death or personal injury caused by our negligence, or affects your legal rights."],
        ["Demo stage", "The site is currently a demo and does not provide a real booking service."],
        ["Privacy", "Personal data is handled under our privacy policy."],
        ["Changes and contact", "We may update these terms; questions to {mail}. Governed by Hong Kong law."]
      ],
      privLink: "Privacy", privTitle: "Privacy policy (demo)", privUpdated: "Updated 13 November 2026", privClose: "Got it",
      privBody: [
        ["Who we are", "街坊的 (Kaifong Taxi) is a community project, not run for profit (not a registered company or charity). It's a demo: no real bookings, no payments."],
        ["What the demo collects", "No sign-up, and we don't collect your name or number. Settings such as language, payment method and large text stay on your phone (in your browser); we can't see them."],
        ["Current location", "Used only after you allow it, to find a nearby address (sent to OpenStreetMap's address service). We don't store your location."],
        ["Outside services", ["Hosting: GitHub Pages", "Maps: OpenStreetMap (map code loaded from unpkg)", "Routes: OSRM", "Address search: the government's Address Lookup Service", "“Current location” to address: OpenStreetMap Nominatim", "Live traffic: Transport Department open data", "Translation: MyMemory (only the text being translated is sent)", "Chinese script conversion: code loaded from jsDelivr", "Voice input: your browser's built-in feature (some browsers send the audio to the browser maker to process)", "Navigation: Google Maps / Amap (only if you tap)"], "Each has its own privacy policy."],
        ["Sign-up forms", "The forms (Google Forms) only collect a contact (WhatsApp or email) and anything you choose to answer. We use them only to tell you about the trial and ask for feedback (at most 3 messages before the trial). We never sell or share them. Reply “delete” and we remove you straight away; we also delete everything if the project stops."],
        ["Deleting your data", "Ask us any time (reply to our message, or email {mail}) and we'll delete it."],
        ["Our promise", "No ads, and we never sell your data."]
      ],
      locBtn: "Current location", locFinding: "Finding where you are…", locDenied: "Couldn't get your location, so please type the address", locAway: "You're not in Hong Kong right now, so the demo uses IFC as your location", locLabel: "Current location",
      addAgreed: "agreed", addChanged: "differs from the order; the passenger will see this", addLocked: "waived in the passenger's offer, can't be added",
      spendTitle: "What you've spent", spendMonth: "This month", spendYear: "This year", spendAvg: "Average per trip", spendSaved: "Saved with offers", spendTrips: "{n} trips",
      addTitle: "Extras (tap to adjust)", addNames: { bags: "Luggage", pet: "Pet", tunnel: "Tunnel toll", ret: "Return toll", booking: "Booking fee", tip: "Tip" }, addEach: "${x} each", addWaived: "waived by the passenger's offer",
      calcTitle: "Collect", calcBy: "paid by {p}", calcLine: "meter ${m}{d} + {x}", calcSay: "要收{v}蚊，乘客用{p}俾。",
      navRoute: "Navigate: {r}", navAuto: "Navigate to the drop-off",
      soonPrep: { oct: "Get your Octopus reader ready", card: "Get your card reader ready", cash: "Have change ready", code: "Your payment code is ready", nocode: "Get your {p} code ready" },
      keepDriver: "Save driver", keepDriverDone: "Saved to My drivers: matched first next time", blockDriver: "Don't match", blockDriverDone: "Noted: you won't be matched with this driver again. They won't be told; undo any time in Me.",
      keepRider: "Add regular", keepRiderDone: "Saved as a regular: you'll get their bookings first", blockRider: "Don't match", blockRiderDone: "Noted: you won't get this passenger again. They won't be told; undo any time in Me.", undo: "Undo",
      sEdit: "Change", sCancel: "Cancel", sRule: "Free to cancel up to 2 hours before; after that it counts as a late cancellation (recorded). Changes are sent to the driver to reconfirm.",
      sCancelled: "Cancelled · your driver has been told", sEdited: "Demo: after you change the time or place, the driver is notified to reconfirm",
      dsTake: "Take booking", dsTaken: "Taken ✓", dsCancel: "Cancel this booking", dsRule: "No penalty if you cancel 2 hours or more before; after that it counts as a late cancellation. If you cancel, the app finds the passenger another driver straight away.", dsCancelled: "Cancelled · the passenger has been told and the app is finding another driver",
      soonTitle: "Almost there", soonPay: "Passenger pays by {p}", soonPayDisc: "15% off: charge by the rules", soonNext: "{n} new jobs near your drop-off", soonHold: "Send me one after drop-off", soonHeld: "OK, you'll get the first one after drop-off (demo)", soonGap: "{m} min to pickup after drop-off · passenger can wait {w} min", soonTake: "Take", soonTaken: "Taken: head to {p} after drop-off; the passenger sees you're about {m} min away (demo)", soonTakenTag: "Taken",
      offTake: "You get ~${x}", offTime: "about {m} min ({p} to pickup + {t} trip)", offHour: "≈ ${h}/hour (based on this {m}-minute job)",
      offDisc: "after discount −${d}", offToll: "tolls ${x} passed through, not counted", offReq: "Passenger asks for",
      offPts: "+{p} 街坊分 points", offPtsNext: "after this: {a} points · {n} to Lv {l}", offPtsUp: "this trip takes you to Lv {l}!",
      ptsWhy: { base: "trip", short: "short trip", disc: "discount", nosur: "no surcharges", pass: "priority pass", care: "extra care", wait: "long wait" },
      boardTitle: "Waiting nearby · longest wait first", boardWait: "waited {m} min", boardBonus: "wait bonus +{p} pts", boardPick: "View", boardNote: "Orders don't vanish; the longer a passenger waits, the bigger the reward for taking it (+5 every 5 minutes, up to +30).",
      dPtsDone: "+{p} 街坊分 points · now {a}",
      routeTitle: "Your route, your call", routeAuto: "Let the driver pick", routeAutoSub: "Your driver takes the way they know best", routeCHT: "Cross-Harbour Tunnel", routeEHC: "Eastern Harbour Crossing", routeWHC: "Western Harbour Crossing",
      routeShort: "Shortest (lower meter)", routeNoToll: "Avoid toll tunnels", routeFast: "fastest", routeMin: "about {m} min",
      routeNoteX: "Taxis pay the same toll at all three harbour tunnels ($25 + $25 return); what changes is distance and traffic. Times and fares are estimates.",
      routeNoteL: "Your driver follows the route you pick, and you can still change it once you're in the car.", pvRoute: "Route",
      feesTitle: "Where your HK$30 goes",
      feesBody: "Nothing to pay per trip; the only charge is a subscription, which starts at 1,000 users: HK$30 a year (less than a coffee), and the first 500 people to sign up get their first year free.",
      feesList: [["Running the app", "Servers, maps and texts that keep it going every day"], ["Rewards pool", "Top Drivers, frequent-rider rewards, priority passes"], ["Reserve", "A 3-month emergency reserve"], ["Growing the crew", "Spreading the word and rewarding new drivers and neighbours who join"]],
      feesNote: "No shareholders, no ads, and we never sell your data. Every dollar shows up in Open Books.",
      honestTitle: "Who's behind this",
      honestBody: "This is a neighbourhood project started by one person, still at demo stage. We'll start with a small group of drivers and passengers and launch properly once there are enough. Free to start, no ads, no selling your data; dispatch rules and every dollar are published.",
      tryShow: "📇 Show-to-driver card",
      pickupLbl: "Pickup", destLbl: "Where to?", pickupPointLbl: "Where will you wait?",
      srcNote: "🔎 Search uses the Government address database: most buildings, estates and streets",
      rideNow: "Now", rideLater: "Schedule", readyLbl: "When will you be ready?", readyNow: "Now", ready5: "5 min", ready10: "10 min", ready15: "15 min",
      readyNoteTxt: "No rush: we'll match a driver arriving in about {x} min. They see when you'll be down, and the grace period starts from your ready time.",
      comingDown: "Coming down", moreTime: "+5 min",
      comingDownToast: "Your driver knows you're on your way down", moreTimeToast: "Your driver knows you need 5 more minutes. They can wait, or cancel for free.",
      etaReady: "Live: your driver will arrive when you're ready (in about {x} min)",
      prefWheel: "Folding wheelchair", prefPet: "Pet", prefLug: "Luggage", prefEng: "English", prefSenior: "Extra time, please",
      carLbl: "Vehicle", carAny: "Any", carFive: "5 seats", carBoot: "Big boot", carTall: "High roof, easy entry", carAccess: "Accessible",
      carNote: { five: "Only 5-seat taxis", boot: "Taxis with a bigger boot", tall: "Newer taller hybrid taxis that are easier to get into (good for elders, strollers)", access: "Accessible taxis are booked ahead and few nearby: we show booking details for accessible fleets such as Diamond Cab and SynCab (not partners)" },
      grpLang: "My language (the driver sees a translation)", lId: "Bahasa Indonesia", lTl: "Tagalog", lUr: "اردو Urdu", lNe: "नेपाली Nepali", lHi: "हिन्दी Hindi",
      langTag: "Passenger speaks {l} · messages auto-translated to Chinese", carTag: "Passenger wants: {c}",
      paxLbl: "People", bagsLbl: "Bags", moreNeeds: "More options", grpWith: "Travelling with", grpMove: "Mobility", grpPref: "Preferences",
      nElder: "With an older person", nKids: "Kids", nStroller: "Stroller", nBabyseat: "Baby (own car seat)", nPregnant: "Pregnant",
      nAccessible: "Accessible taxi", nWalker: "Walking aid", nGuidedog: "Guide dog",
      nQuiet: "Quiet ride", nCarsick: "Prone to motion sickness", nMandarin: "Mandarin", nAc: "Less air-con",
      driverNoteLbl: "Note for the driver (optional)", needNotePh: "e.g. I'm in Block B lobby, red jacket",
      nDeaf: "Deaf: message me", nBlind: "Blind: call out on arrival", deafTag: "Deaf passenger: message, don't call", blindTag: "Blind passenger: on arrival, step out and call out / guide them",
      needsTag: "Passenger notes: {n}", fiveSeat: "5 people: only 5-seat taxis", guideNote: "Guide dog: refusing may breach the Disability Discrimination Ordinance",
      seniorNote: "Your driver will know you need extra time, and the grace period goes up to 8 minutes. No reason needed: age, mobility, kids or lots of shopping all count.",
      seniorTag: "Passenger needs extra time · 8-min grace", hospTag: "Hospital trip · counts towards the 覆診天使 badge",
      graceSenior: "8-minute grace period (take it slow) · you and your driver see the same timer",
      bookBtn: "Call a taxi", bookLater: "Schedule a taxi",
      searching: "Finding a driver…", cancelFree: "Cancel (free)",
      redTaxi: "Red taxi", trips: "trips", driverTags: "Smooth driving, helps with luggage",
      callDriver: "📞 Call driver", quickPhrases: "💬 Message",
      send: "Send", msgPh: "Message your driver…", dMsgPh: "Reply to passenger…",
      driverAuto: "Got it, about 2 more minutes", driverAuto2: "I'm here, at the lobby entrance",
      almost: "Almost here: about 1 minute away · TX 2468", arrivedBanner: "Your driver is here! TX 2468 · red taxi · waiting for you",
      translatedTag: "Translated", heard: "Read aloud in Cantonese", newMsg: "New message from passenger",
      micListening: "Listening… it sends when you stop", micUnsupported: "Voice input isn't supported in this browser. You can type instead", micDenied: "Microphone permission not granted",
      langCmn: "Drivers speak Cantonese: your messages are read to them in Cantonese, and what they say appears as text for you",
      langOther: "Screens show in English for now; your messages are translated for the driver, and replies come back in your language",
      trPrevR: "Your driver will see: {x}", trSentR: "Driver saw: {x} · read aloud in Cantonese", trPrevD: "Passenger will see ({l}): {x}", trWorking: "Translating…", trDemo: "Demo uses a free translation service",
      riderIncoming: "I'm in the lobby, wearing a red jacket",
      passTag: "Passenger used a busy-time priority pass · take this job for +15 街坊分",
      driverQuick: ["Got it", "2 more min", "I've arrived", "Which exit?", "Traffic, a bit late"],
      simArrive: "(Demo) Driver arrives ▶", arrived: "Your driver is here",
      grace: "5-minute grace period · you and your driver see the same timer",
      simBoard: "(Demo) I'm in the taxi ▶", doneTitle: "You've arrived. Don't forget your things!",
      fareOk: "✓ Matches", fareBad: "✗ Wrong",
      rateDriver: "Rate driver Chan", again: "Try again",
      sharedNote: "🤝 You and your driver see exactly the same info: times, fare estimate, offer, wait timer",
      goOnline: "Online", goOffline: "Offline",
      newJob: "New job!", pickupShort: "Pickup", dropShort: "Drop-off",
      accept: "Accept", decline: "Decline (no penalty)",
      goPickup: "Heading to pickup", navigate: "🧭 Navigate", callRider: "📞 Call",
      iArrived: "I've arrived", enterMeter: "Enter the meter fare", complete: "Finish trip",
      dDoneTitle: "Trip complete. Thanks!", rateRider: "Rate this passenger",
      shiftSetup: "🔄 Shift change (交更) settings", shiftTimeLbl: "Handover time", shiftAreaLbl: "Handover area (passengers see the district only)",
      shiftOn: "Start 交更 mode", shiftOff: "Stop 交更 mode",
      showTitle: "Show to driver", showLead: "Pick a place and show the big Chinese address to any taxi driver, even one you wave down on the street.", close: "Close",
      tabs: { ride: "Ride", sched: "Scheduled", fav: "My drivers", me: "Me", jobs: "Jobs", dsched: "Bookings", earn: "Earnings", dme: "Me" },
      nearby: "<b>Right now:</b> {n} taxis nearby · closest about {m} min away",
      shiftLine: "🔄 2 of them are heading to shift change, towards Kowloon Bay and Chai Wan. If you're going that way, they'll be matched first.",
      sent: "Sent to {n} taxis · nobody has accepted yet · {t}",
      matchedNow: "A driver accepted!", matchedLater: "Confirmed: driver Chan accepted your scheduled ride",
      schedBadge: "預約 SCHEDULED · {d}",
      eta: "About {a}–{b} min away · see them on the map",
      cancelWithin: "Cancel (free, {t} left)", cancelLate: "Cancel (counts as a late cancellation)",
      callToast: "Demo: the real app calls the driver directly (hands-free for them)",
      callRiderToast: "Demo: the real app calls the passenger directly",
      phraseSent: "Sent: \"{p}\" · your driver hears it in Cantonese",
      fareOkToast: "Thanks! Fare confirmed ✓",
      fareBadToast: "Demo: the real app opens a report with the trip record attached",
      formSoon: "Sign-up opening soon. Please check back 🙏",
      demoToast: "Demo: this button works in the real app",
      launchTitle: "When does it start? As soon as there are enough of us!",
      launchStep1: "Step 1: build the real app", launchStep1D: "{dr} drivers + {rr} passengers signed up by {d}",
      launchStep2: "Step 2: open the trial", launchStep2D: "{dr} drivers + {rr} passengers, then the trial opens {d}",
      launchDrivers: "drivers", launchRiders: "riders", launchNote: "Numbers updated weekly · the more people share it, the sooner it starts",
      launchCta: "I want to be in the first group",
      quoteNote: "An estimate. The meter decides · demo data",
      waivedLbl: "Your offer waives",
      shortNoteR: "Short trip (meter under ${f}): full meter. Drivers drive empty to reach you, so a $5–10 tip gets a taxi faster, 100% to the driver.",
      shortBoost: "Short-trip reward: take this and you're first for the next job for 30 min after drop-off",
      shortChain: "2 bookings near your drop-off",
      shortNear: "Only offered to drivers within 3 min", offerNoSur: "Passenger offers: no surcharges (luggage, pet, booking fee, return toll) · actual tunnel toll still paid",
      items: { meter: "Meter", disc: "85% of meter", discFlat: "Flat fare", tunnel: "Tunnel toll", ret: "Return toll", booking: "Booking surcharge", luggage: "Luggage", pet: "Pet", tip: "Tip" },
      previewLabel: "Your driver will see:", stopAt: "Waiting at",
      receiptMeter: "Meter", total: "Total", toDriver: "all yours",
      idleOff: "Tap \"Go online\" to start taking jobs",
      idleOn: "Waiting for jobs… you're near Causeway Bay",
      statusOn: "Next job here usually in 6–15 min",
      statusShift: "🔄 交更 mode · until {time}, only jobs heading to {area}",
      statusOff: "Offline",
      offerMeta: "{km} km away · about {min} min to pickup",
      offerWait: "⏱ Passenger has waited {w} · {ready}",
      readyYes: "ready", ready5Txt: "down in 5 min",
      offerRider: "Passenger 4.6★ · 23 trips · 好街坊 · no-shows: 0",
      offerFare: "Est. fare HK${f}",
      offerNone: "Passenger chose: meter",
      offer85: "Passenger offers: 85% (under $90 full meter · $90–106 flat $90 · max $60 off · surcharges paid)",
      shiftTag: "🔄 On your way to 交更 ✓",
      riderLine: "Ms Chan · ready · 4.6★ 好街坊",
      meterNeeded: "Please enter the meter fare",
      levelCard: "<b>好師傅 ⭐⭐⭐</b> · completion 98% · 4.9★ · 42 compliments<br><span>Open job-offer rules: distance first; among equally close drivers, 好師傅 get a few seconds' head start</span>",
      rateTagsGood: ["On time", "Smooth driving", "Polite", "Knew the way", "Helped with luggage", "Clean taxi", "Helped me in"],
      rateTagsBad: ["Late", "Long route", "Drove too fast", "Rude", "Taxi smelled"],
      riderTagsGood: ["Ready on time", "Polite", "Clear pickup spot", "Helped a senior in and out"],
      riderTagsBad: ["Late coming down", "No-show", "Rude", "Unclear pickup spot", "Left a mess"],
      rateHint: "Just tap, or type if you like",
      notePh: "Add a note for your driver (optional)", notePhD: "Add a note for the passenger (optional)", sendNoteBtn: "Send",
      quickThanks: ["Thank you!", "Thanks for your hard work", "Smooth ride", "Right on time", "See you next time"],
      noteSent: "Sent. Your driver will see it on their thank-you wall", noteSentD: "Sent",
      thanksInTxt: "Ms Chan left a note: \"Thank you, right on time!\"",
      stars: [["Great", 5], ["Good", 4], ["OK", 3], ["Poor", 2], ["Bad", 1]],
      thanksRate: "Thanks for rating!",
      phrases: ["I'm in the lobby", "I'm waiting at the entrance", "2 more minutes", "Please open the boot"],
      pickupPoints: ["Lobby", "Main entrance", "Taxi stand", "Drop-off bay", "MTR exit"],
      fare: {
        meterT: "Meter", meterD: "{n} taxis can take it",
        offerT: "My offer", offerD: "{n} would consider it · drivers can say no, no penalty",
        fixedT: "Fixed price (fleet)", fixedD: "Fleet taxi · 1 nearby · demo",
        o85: "15% off", oOne: "One-way tunnel toll", oNoBook: "No booking fee", oNoSur: "No surcharges", oNoLug: "No luggage fee", oNoPet: "No pet fee",
        discShort: "How 15% off works: meter under ${f} = full meter · ${f}–${th} = flat ${f} · above that 15% off (max ${m} off per trip)",
        saveTitle: "Pay less? Make an offer", saveSub: "Pick as many as you like. Tunnel tolls still apply.", saveNoTunnel: "This trip doesn't cross the harbour, so the one-way toll offer doesn't apply.",
        discRule: "85% rules: meter under ${f} = full meter · ${f}–${th} = flat ${f} · over ${th} = 85% (max ${m} off) · tolls and surcharges not discounted",
        discNow: "about ${off} off this trip", discNowFull: "meter under ${f}: full meter", discNowFlat: "flat ${f} for this trip", discNowCap: "cap reached: ${off} off",
        tipLbl: "Tip (optional)", tipNone: "None", tipCustom: "Custom", tipNote: "100% to the driver · max $100 · you can also tip after the trip", tipPrompt: "Tip amount (HK$0–100):"
      },
      searchingLive: "Searching the Government address database…", noResult: "Nothing found. Try a building or street name",
      features: [
       ["No commission", "Drivers keep it all; riders pay no extra"],
        ["Agreed routes", "Settled before the ride, no guessing"],
        ["Clear fares", "Worked out before drop-off, no arguments"],
        ["Live arrivals", "When and where, both sides can see"],
        ["Any language", "Translated so everyone understands"],
        ["Accessible", "Needs shared upfront, drivers come prepared"]
      ],
      painsRider: [
        ["Can't get a taxi", "Real wait times and your driver's position; drivers heading your way at shift change come first"],
        ["Worried about detours", "Pick your route before the ride, with live traffic; every trip is recorded"],
        ["Surprise charges at the end", "The fare is worked out before you get out, with every extra listed and nothing hidden"]
      ],
      painsDriver: [
        ["Platforms take a cut", "0% commission: the fare, booking surcharge and tips are all yours"],
        ["Empty cruising in quiet hours", "Bookings fill quiet hours, and your next job is lined up before drop-off"],
        ["Black-box rules", "Dispatch rules are public, and saying no never costs you"]
      ],
      panels: {
        schedTitle: "My scheduled rides", newSched: "+ New booking",
        sched: [
          ["預約 SCHEDULED · Tue 09:00", "Cityplaza → Queen Mary Hospital", "✅ Confirmed: driver Chan · TX 2468 · 好師傅", "🔁 Hospital visit, repeats weekly"],
          ["預約 SCHEDULED · Fri 06:30", "Home → Airport Terminal 1", "⏳ Not yet confirmed: we'll tell you if nobody accepts 2 hours before", "🧳 2 bags"]
        ],
        favTitle: "My drivers", favNote: "Book a driver you liked again. Drivers can add you as a regular (熟客) too.", rebook: "Book again",
        favs: [["Driver Chan", "TX 2468 · red taxi · 好師傅 ⭐⭐⭐", "4.8★ · smooth driving, helps with luggage", "Last trip: 28 Oct"],
               ["Driver Lee", "NT 1357 · green taxi", "4.7★ · polite, knows the roads", "Last trip: 15 Sep"]],
        meTitle: "Me", meLevel: "好街坊 ⭐⭐⭐", meStats: "4.9★ · 31 trips · on time · no-shows: 0",
        meNote: "Drivers see your rating the same way you see theirs: transparent both ways.",
        historyTitle: "Trip history",
        history: [["28 Oct · Cityplaza → Queen Mary Hospital", "HK$146 · meter confirmed ✓"], ["20 Oct · Langham Place → Festival Walk", "HK$58 · meter confirmed ✓"], ["12 Oct · Harbour City → Airport", "HK$298 · meter confirmed ✓"]],
        duesTitle: "Subscription (街坊年費)", duesBody: "Completely free for now. From 1,000 users: HK$30 a year (less than one coffee, about HK$2.50 a month); the first 500 people to sign up get their first year free. The money covers running costs first; Drivers are free in year 1 (the first 100 drivers to join free for good), then everyone pays the same HK$30. Everything left after running costs goes into the 街坊獎賞池 community rewards pool.",
        booksTitle: "Open Books (睇數)", booksBody: "Demo: where every HK$100 of subscriptions goes",
        booksSplit: [["Running costs", 45, "servers, maps, SMS"], ["Community rewards pool", 45, "car washes, meals, 好師傅之星"], ["Reserve", 10, "3-month emergency reserve"]],
        booksNote: "No owner profits, no investors. Every dollar listed line by line.",
        settingsTitle: "Settings", settings: ["Language: 廣東話 · English · Bahasa Indonesia · Tagalog · اردو · नेपाली", "Large text and high contrast", "Screen reader (VoiceOver / TalkBack) and voice input", "Deaf mode: messages only, vibration alerts", "Book for family (elders don't need a phone)", "Emergency contact"],
        dschedTitle: "Bookings", dschedNote: "Bookings never clash with your 交更 time. Re-confirm 60 minutes before.",
        dsched: [["Booking · tomorrow 10:30", "Mei Foo Sun Chuen → Queen Elizabeth Hospital", "Hospital visit · est. HK$95–115 · quiet hours", "Take booking"],
                 ["Booking · Sat 05:45", "Taikoo Shing → Airport", "🧳 3 bags · est. HK$330–390", "Take booking"]],
        earnTitle: "Today", earn: [["8 trips", "completed"], ["HK$1,284", "fares"], ["HK$0", "platform commission"], ["HK$40", "booking surcharges (all yours)"]],
        earnNote: "Quiet-hour bookings: 3 · 交更 on-the-way jobs: 1",
        earnTabs: ["Today", "This week", "This month"],
        earnData: [
          { total: 1374, trips: 8, hours: 6.5, empty: "1 h 10 min", fare: 1284, booking: 40, tips: 50, goal: 1600 },
          { total: 8420, trips: 51, hours: 41, empty: "7 h 30 min", fare: 7890, booking: 255, tips: 275, goal: 9000 },
          { total: 31260, trips: 196, hours: 158, empty: "29 h", fare: 29350, booking: 980, tips: 930, goal: 33000 }
        ],
        earnLbls: { total: "Earnings", goal: "Goal", trips: "Trips", hours: "Online", perHour: "Per hour", empty: "Empty time", fare: "Fares", booking: "Booking surcharges", tips: "Tips", comm: "Platform commission" },
        commSaved: "If you paid a 10% commission (a hypothetical), you'd have HK${x} less for this period. With 街坊的, it's all yours.",
        pointsTitle: "街坊分 points", pointsNow: "{p} points", streak: "6 days in a row with no late cancellations",
        pointsEarn: [["Take a priority-pass job", "+15"], ["Take a short trip", "+20"], ["Arrive on time", "+5"], ["Get a compliment", "+10"], ["Confirm a booking", "+10"], ["7 days with no cancellations", "+50"]],
        poolNote: "Rewards are paid from the 街坊獎賞池: whatever subscriptions leave after running costs, all returned to the community.",
        redeemTitle: "Redeem", redeem: [["Next-job priority pass", "200 pts", "from us"], ["Car wash voucher", "500 pts", "sponsor"], ["茶餐廳 meal voucher", "800 pts", "sponsor"]], redeemBtn: "Redeem",
        exportBtn: "Export earnings (tax)",
        impactTitle: "Today's trips", impact: [["3", "to hospitals"], ["1", "to the airport"], ["2", "passengers who needed extra time"]],
        milestone: "This year you've driven 860 neighbours, 12,400 km",
        wallTitle: "Thank-you wall", wall: [["Ms Chan", "Thank you for taking my mum to her check-up, so patient ❤"], ["Mr Lee", "Thank you for waiting while I got my bags!"], ["Mr Wong", "Smooth driving, I'll book you again"]],
        storyTitle: "My driver story (passengers see this)", story: "Twenty years behind the wheel, I know Kowloon East best. I love a chat, and my favourite trips are airport reunions.", storyEdit: "Edit",
        questsTitle: "Today's missions", questDone: "Done",
        quests: [["Take 2 short trips", 1, 2, "+40"], ["Arrive on time 5 times", 4, 5, "+25"], ["Get 1 compliment", 1, 1, "+10"]],
        levelLine: "Lv 7 · 好師傅", levelNext: "60 points to Lv 8", levelPct: 70,
        lifetime: "Since joining 街坊的: if you had paid a 10% commission, it would have been HK$4,860. Here you pay none",
        restNote: "Online 6.5 h today. At 10 h we'll remind you to rest; missions and points never reward driving longer or faster.",
        badgesTitle: "Badges", badges: [["Hospital helper", "10 trips to hospitals or clinics", 1], ["Airport regular", "20 airport trips", 1], ["交更 pro", "15 on-the-way 交更 jobs", 1], ["Short-trip hero", "30 short trips · 18/30", 0], ["Zero-cancel month", "No late cancellations for a month · 6/30 days", 0], ["Driver referrer", "Refer 3 drivers · 1/3", 0]],
        districtTitle: "18-district collection", districtTxt: "Picked up in 11 / 18 districts · next: Islands", districtN: 11,
        leaderTitle: "Kowloon compliments board (opt-in)", leaderTxt: "You're 3rd · counts compliments and punctuality only, never earnings or hours",
        rLevel: "Lv 4 · 好街坊", rLevelNext: "40 points to Lv 5: unlocks favourite-driver priority", rLevelPct: 75,
        rQuestsTitle: "This month's missions", rQuests: [["Be ready on time 3 times", 2, 3, "+15"], ["Rate your driver 3 times", 3, 3, "+10"], ["Try a scheduled ride", 0, 1, "+20"], ["Refer a friend", 0, 1, "+30"]],
        rUnlockTitle: "Level unlocks (not money)", rUnlocks: [["Lv 3", "Cancellation pass (1 per month)", 1], ["Lv 4", "Busy-time priority", 1], ["Lv 5", "Favourite-driver priority: drivers you like see your request first", 0], ["Lv 6", "Early access to new features", 0]],
        loyalTitle: "Frequent-rider rewards", loyal: [["Regulars: 24 rides this year = $5 off, 52 rides = $10 off", 18, 52, [[24, "−$5"], [52, "−$10"]]], ["Bring a friend: a busy-time priority pass for each one who joins (up to 3)", 1, 3], ["Every 10 rides: one busy-time priority pass (rain, shift change, rush hour)", 8, 10]],
        loyalNote: "All discounts together are capped at HK$20 (everyone pays at least HK$10). Fares are paid to the driver at the meter as usual, so drivers never lose out. Subscriptions pay running costs and the reserve first; rewards only use what is left and shrink automatically if needed, so the app always keeps running.",
        rPointsTitle: "街坊分 points", rPoints: "320 points",
        rPerks: [["Cancellation pass", "1 per month: one late cancellation not recorded", "You have 1"], ["Busy-time priority", "好街坊 get matched a few seconds earlier at 交更 and in rain", "Unlocked"], ["Gift from a driver", "Driver Chan gave you a priority pass: thanks for being on time and polite", "You have 1"]],
        rBadges: [["On-time neighbour", 1], ["Hospital-trip helper", 1], ["18-district explorer · 6/18", 0]],
        rImpact: "Every fare you paid this year went fully to drivers: a 10% commission would have cost them HK$186",
        dmeTitle: "Me", dmeCompl: "Compliments", compliments: [["Smooth driving", 18], ["Helped with luggage", 11], ["Polite", 9], ["Knows the roads", 4]],
        starTitle: "好師傅之星 (driver of the month)", starBody: "Kowloon nominations this month: you're 3rd · 6 passenger nominations",
        rulesTitle: "Job-offer rules (public)", rules: ["1. Distance first: the closest driver gets it first", "2. Equally close: 好師傅 get it a few seconds earlier", "3. Rotation, so it's not always the same drivers", "4. Declining never counts; only cancelling after accepting does", "5. No job for 30 minutes? You're first for the next one", "6. Short trips only go to drivers within 3 min; take one and you're first for the next job for 30 min after drop-off, plus extra 好師傅 points"],
        giftTitle: "Gift priority passes", giftBody: "好師傅 get 3 priority passes a month to give to regulars, elderly passengers, or someone you helped. 2 left this month.", giftBtn: "Gift to a regular",
        dDuesTitle: "Driver subscription", dDuesBody: "Free for your first year. As one of the first 100 drivers to join, you're free for good. After that, other drivers pay the same HK$30 a year as passengers.",
        regularsTitle: "My regulars (熟客)", regulars: "Ms Chan (好街坊) · Mr Wong (hospital visits, every Tuesday)"
      }
    }
  };
  const DRIVER_EN = { "收到，我仲有大約 2 分鐘到": "Got it, about 2 more minutes", "我到咗喇，喺大堂門口": "I'm here, at the lobby entrance",
    "收到": "Got it", "仲有 2 分鐘": "2 more minutes", "我到咗喇": "I've arrived", "你喺邊個出口？": "Which exit are you at?", "塞緊車，遲少少": "Traffic, running a little late" };
  (function cleanEn(o) {
    const paren = /\s*\((?:街坊年費|睇數|熟客|師傅|交更|好師傅之星)\)/g;
    const terms = [["好師傅之星", "Driver of the Month"], ["街坊獎賞池", "community rewards pool"], ["街坊年費", "subscription"], ["街坊分", "Kaifong points"],
      ["好街坊", "Top Rider"], ["好師傅", "Top Driver"], ["交更順路", "on the way to shift change"], ["交更", "shift change"], ["實況", "Live"],
      ["一撳講", "Quick phrases"], ["畀師傅睇", "Show to driver"], ["我嘅師傅", "My drivers"], ["熟客", "regulars"], ["茶餐廳", "café"],
      ["預約 SCHEDULED", "SCHEDULED"], ["廣東話", "Cantonese"], ["街坊的", "Kaifong Taxi"], ["睇數", "Open Books"]];
    Object.keys(o).forEach(k => {
      if (typeof o[k] === "string") { let s = o[k].replace(paren, ""); terms.forEach(([a, b]) => { s = s.split(a).join(b); }); o[k] = s; }
      else if (o[k] && typeof o[k] === "object") cleanEn(o[k]);
    });
    const fix = [["Kaifong points points", "Kaifong points"], ["Top Driver get", "Top Drivers get"], ["Top Rider get", "Top Riders get"],
      ["shift change pro", "Shift-change pro"], ["shift change jobs", "shift-change jobs"], ["shift change mode", "shift-change mode"], ["shift change time", "shift-change time"],
      ["Driver of the Month (driver of the month)", "Driver of the Month"], ["café meal voucher", "Café meal voucher"], ["Shift change settings", "Shift-change settings"],
      ["\"Assured mode\" priority", "priority matching (Assured mode)"]];
    (function walk(o) { Object.keys(o).forEach(k => { if (typeof o[k] === "string") { let s = o[k]; fix.forEach(([a, b]) => { s = s.split(a).join(b); }); o[k] = s; } else if (o[k] && typeof o[k] === "object") walk(o[k]); }); })(T.en);
  })(T.en);
  let lang = "zh";
  const t = (k, vars) => {
    let s = (T[lang][k] !== undefined ? T[lang][k] : T.zh[k]);
    if (typeof s === "string" && vars) Object.keys(vars).forEach(v => { s = s.split("{" + v + "}").join(vars[v]); });
    return s;
  };
  const tf = (k, vars) => { let s = T[lang].fare[k]; if (vars) Object.keys(vars).forEach(v => { s = s.split("{" + v + "}").join(vars[v]); }); return s; };


  // ================================================================ icon set (line icons, 24px grid; Lucide-style, ISC licence)
  const ICONS = {
    car: '<path d="M5 11l1.5-4.5A2 2 0 0 1 8.4 5h7.2a2 2 0 0 1 1.9 1.5L19 11"/><rect x="3" y="11" width="18" height="6" rx="2"/><circle cx="7.5" cy="17.5" r="1.5"/><circle cx="16.5" cy="17.5" r="1.5"/><path d="M10 2.5h4"/>',
    user: '<circle cx="12" cy="8" r="4"/><path d="M4 21a8 8 0 0 1 16 0"/>',
    calendar: '<rect x="3" y="5" width="18" height="16" rx="2"/><path d="M16 3v4M8 3v4M3 10h18"/>',
    heart: '<path d="M19 14c1.5-1.5 3-3.2 3-5.5A5.5 5.5 0 0 0 12 5a5.5 5.5 0 0 0-10 3.5c0 2.3 1.5 4 3 5.5l7 7z"/>',
    star: '<path d="M12 3l2.8 5.7 6.2.9-4.5 4.4 1.1 6.2L12 17.3 6.4 20.2l1.1-6.2L3 9.6l6.2-.9z"/>',
    phone: '<path d="M22 16.9v3a2 2 0 0 1-2.2 2 19.8 19.8 0 0 1-8.6-3.1 19.5 19.5 0 0 1-6-6A19.8 19.8 0 0 1 2.1 4.2 2 2 0 0 1 4.1 2h3a2 2 0 0 1 2 1.7c.1.9.4 1.8.7 2.7a2 2 0 0 1-.5 2.1L8 9.8a16 16 0 0 0 6 6l1.3-1.3a2 2 0 0 1 2.1-.4c.9.3 1.8.6 2.7.7a2 2 0 0 1 1.7 2z"/>',
    message: '<path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/>',
    mic: '<rect x="9" y="2" width="6" height="12" rx="3"/><path d="M5 10a7 7 0 0 0 14 0M12 17v4M8 21h8"/>',
    pin: '<path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0z"/><circle cx="12" cy="10" r="3"/>',
    clock: '<circle cx="12" cy="12" r="9"/><path d="M12 7v5l3 2"/>',
    settings: '<circle cx="12" cy="12" r="3"/><path d="M12 2v3M12 19v3M4.9 4.9l2.1 2.1M17 17l2.1 2.1M2 12h3M19 12h3M4.9 19.1L7 17M17 7l2.1-2.1"/>',
    chevron: '<path d="M9 18l6-6-6-6"/>',
    arrow: '<path d="M5 12h14M13 6l6 6-6 6"/>',
    nav: '<path d="M3 11l19-9-9 19-2-8z"/>',
    wallet: '<rect x="2" y="6" width="20" height="14" rx="2"/><path d="M16 13h2M2 10h20"/>',
    shield: '<path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/><path d="M9 12l2 2 4-4"/>',
    globe: '<circle cx="12" cy="12" r="9"/><path d="M3 12h18M12 3a14 14 0 0 1 0 18M12 3a14 14 0 0 0 0 18"/>',
    search: '<circle cx="11" cy="11" r="7"/><path d="M21 21l-4.3-4.3"/>',
    check: '<circle cx="12" cy="12" r="9"/><path d="M8 12l3 3 5-6"/>',
    frown: '<circle cx="12" cy="12" r="9"/><path d="M8.5 16a5 5 0 0 1 7 0M9 9.5h.01M15 9.5h.01"/>',
    wheel: '<circle cx="12" cy="4" r="2"/><path d="M9 21a5 5 0 1 1 6-8M12 7v6h5l2 5"/>',
    paw: '<circle cx="5.5" cy="10" r="2"/><circle cx="9.5" cy="5" r="2"/><circle cx="14.5" cy="5" r="2"/><circle cx="18.5" cy="10" r="2"/><path d="M8 17.5c0-2.5 2-5 4-5s4 2.5 4 5c0 2-2 2.5-4 2.5s-4-.5-4-2.5z"/>',
    luggage: '<rect x="6" y="7" width="12" height="13" rx="2"/><path d="M9 7V4h6v3M10 11v5M14 11v5"/>',
    lang: '<path d="M4 5h8M8 3v2M6 5c0 4 3 7 6 8M10 5c-1 4-4 7-7 8M13 21l4-9 4 9M14.5 18h5"/>',
    repeat: '<path d="M17 2l4 4-4 4M3 11V9a3 3 0 0 1 3-3h15M7 22l-4-4 4-4M21 13v2a3 3 0 0 1-3 3H3"/>',
    trophy: '<path d="M8 21h8M12 17v4M7 4h10v5a5 5 0 0 1-10 0zM7 6H4a3 3 0 0 0 3 4M17 6h3a3 3 0 0 1-3 4"/>',
    book: '<path d="M4 4h6a2 2 0 0 1 2 2v14a2 2 0 0 0-2-2H4zM20 4h-6a2 2 0 0 0-2 2v14a2 2 0 0 1 2-2h6z"/>',
    card: '<rect x="3" y="5" width="18" height="14" rx="2"/><path d="M7 10h6M7 14h10"/>',
    eye: '<path d="M2 12s4-7 10-7 10 7 10 7-4 7-10 7S2 12 2 12z"/><circle cx="12" cy="12" r="3"/>',
    coins: '<circle cx="9" cy="9" r="6"/><path d="M15.5 9.6A6 6 0 1 1 9.6 15.5"/>',
    home: '<path d="M3 11l9-8 9 8v10H3z"/><path d="M9 21v-6h6v6"/>',
    alert: '<circle cx="12" cy="12" r="9"/><path d="M12 8v4M12 16h.01"/>'
  };
  const ic = (n, cls = "") => `<svg class="ic ${cls}" viewBox="0 0 24 24" aria-hidden="true">${ICONS[n] || ""}</svg>`;
  const TAXI_MARKER = '<svg width="26" height="26" viewBox="0 0 26 26" aria-hidden="true"><rect x="7" y="3" width="12" height="20" rx="4" fill="#c8102e" stroke="#fff" stroke-width="2"/><rect x="9" y="8" width="8" height="5" rx="1.5" fill="#26323f"/><rect x="10" y="15" width="6" height="3" rx="1" fill="#fff"/></svg>';

  // strip emoji from copy: the UI uses the drawn icon set instead (keeps ★ ✓ ✗)
  const EMOJI = /(?:[\u{1F000}-\u{1FAFF}]|[\u{2600}-\u{2604}\u{2606}-\u{2712}\u{2714}-\u{2716}\u{2718}-\u{27BF}]|[\u{2B00}-\u{2BFF}]|[\u{23E9}-\u{23FA}]|\u{FE0F}|\u{200D})+\s?/gu;
  (function strip(o) { Object.keys(o).forEach(k => { if (typeof o[k] === "string") o[k] = o[k].replace(EMOJI, "").trim(); else if (o[k] && typeof o[k] === "object") strip(o[k]); }); })(T);

  // icons attached to static elements
  const ICON_MAP = [
    [".cta-row [data-go=rider]", "user"], [".cta-row [data-go=driver]", "car"], ["#view-home [data-go=show]", "card"],
    [".seg-btn[data-pain=rider]", "user"], [".seg-btn[data-pain=driver]", "car"],
    ["[data-pref=senior]", "heart"], ["[data-pref=wheelchair]", "wheel"], ["[data-pref=pet]", "paw"], ["[data-pref=luggage]", "luggage"], ["[data-pref=english]", "lang"],
    ["[data-act=call]", "phone"], ["[data-act=phrases]", "message"], ["#navLink", "nav"], ["[data-act=callRider]", "phone"],
    ["#shiftBtn", "repeat"], [".src-note", "search"], [".shared-note", "eye"]
  ];
  const TAB_ICONS = { ride: "car", sched: "calendar", fav: "heart", me: "user", jobs: "car", dsched: "calendar", earn: "coins", dme: "star" };

  // ================================================================ helpers
  const $ = (s, el = document) => el.querySelector(s);
  const $$ = (s, el = document) => Array.from(el.querySelectorAll(s));
  const byId = id => PLACES.find(p => p.id === id);
  const esc = s => String(s == null ? "" : s).replace(/[&<>"]/g, c => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" }[c]));
  function toast(msg) {
    const el = $("#toast"); el.textContent = msg; el.classList.add("show");
    clearTimeout(toast._t); toast._t = setTimeout(() => el.classList.remove("show"), 2800);
  }
  function km(a, b) {
    const R = 6371, dLat = (b.lat - a.lat) * Math.PI / 180, dLng = (b.lng - a.lng) * Math.PI / 180;
    const x = Math.sin(dLat / 2) ** 2 + Math.cos(a.lat * Math.PI / 180) * Math.cos(b.lat * Math.PI / 180) * Math.sin(dLng / 2) ** 2;
    return 2 * R * Math.asin(Math.sqrt(x));
  }
  const mmss = s => Math.floor(s / 60) + ":" + String(s % 60).padStart(2, "0");
  const money = n => { const r = Math.round(n * 10) / 10; return r % 1 ? r.toFixed(2) : String(r); }; // meters run in 10-cent steps; e-payments charge exact cents
  const titleCase = s => (s || "").toLowerCase().replace(/\b([a-z])/g, m => m.toUpperCase()).replace(/\bIfc\b/, "IFC");

  function meterFare(distKm, colour) {
    const c = TARIFF[colour];
    let fare = c.flag;
    if (distKm > 2) {
      const steps = Math.ceil((distKm - 2) / 0.2);
      for (let i = 0; i < steps; i++) fare += fare < c.until ? c.step : c.after;
    }
    return fare;
  }
  const inZone = (colour, p) => p.id === "air" || (colour === "red" ? p.area !== "lantau" : colour === "green" ? p.area === "nt" : p.area === "lantau");
  const canServe = (colour, a, b) => inZone(colour, a) && inZone(colour, b);
  // cheapest licence that can do the whole trip: green in the NT, blue on Lantau, otherwise red
  const taxiColour = (p, d) => {
    const pref = p.area === "nt" ? "green" : p.area === "lantau" && p.id !== "air" ? "blue" : "red";
    if (!d) return pref;
    return canServe(pref, p, d) ? pref : canServe("red", p, d) ? "red" : pref;
  };

  // ---------------- place search: local aliases first, then the Government Address Lookup Service
  // common names first: exact name or nickname > starts with > contains
  function localSearch(q) {
    q = (q || "").trim().toLowerCase();
    if (!q) return [];
    const score = p => {
      const en = p.en.toLowerCase(), names = [p.zh, en, ...p.aliases];
      if (p.zh === q || en === q) return 5;
      if (names.some(n => n === q)) return 4;
      if (names.some(n => n.startsWith(q))) return 3;
      if (names.some(n => n.includes(q))) return 2;
      if (p.aliases.some(a => q.length > 2 && a.length > 1 && q.includes(a)) || (!p.common && (p.addrZh.includes(q) || p.addrEn.toLowerCase().includes(q)))) return 1;
      return 0;
    };
    return PLACES.map(p => [p, score(p)]).filter(x => x[1] > 0).sort((x, y) => y[1] - x[1]).slice(0, 5).map(x => x[0]);
  }
  function fromALS(s) {
    try {
      const pa = s.Address.PremisesAddress, eng = pa.EngPremisesAddress || {}, chi = pa.ChiPremisesAddress || {};
      const geo = pa.GeospatialInformation || {};
      const cs = chi.ChiStreet || {}, es = eng.EngStreet || {};
      const cv = chi.ChiVillage || {}, ev = eng.EngVillage || {};
      const enName = titleCase(eng.BuildingName || (eng.EngEstate || {}).EstateName || ev.VillageName || es.StreetName || "");
      const zhName = chi.BuildingName || (chi.ChiEstate || {}).EstateName || cv.VillageName || cs.StreetName || enName;
      const no = cs.BuildingNoFrom ? cs.BuildingNoFrom + (cs.BuildingNoTo ? "-" + cs.BuildingNoTo : "") + "號" : "";
      const addrZh = cs.StreetName ? cs.StreetName + no : (cv.VillageName || "");
      const addrEn = es.StreetName ? ((es.BuildingNoFrom ? es.BuildingNoFrom + (es.BuildingNoTo ? "-" + es.BuildingNoTo : "") + " " : "") + titleCase(es.StreetName)) : titleCase(ev.VillageName || "");
      const dZh = (chi.ChiDistrict || {}).DcDistrict || "";
      const dEn = titleCase(((eng.EngDistrict || {}).DcDistrict || "").replace(/ DISTRICT$/, ""));
      const lat = parseFloat(geo.Latitude), lng = parseFloat(geo.Longitude);
      if (!zhName || isNaN(lat)) return null;
      const region = eng.Region || "";
      const area = region === "HK" ? "island" : region === "KLN" ? "kowloon" : (lng < 114.06 ? "lantau" : "nt");
      return { id: "als-" + (pa.GeoAddress || zhName + addrZh), zh: zhName, en: enName || zhName, addrZh: addrZh || zhName, addrEn: addrEn || enName, district: (dZh + " " + dEn).trim(), area, lat, lng, live: true };
    } catch (e) { return null; }
  }
  const alsCache = new Map();
  async function alsSearch(q) {
    if (alsCache.has(q)) return alsCache.get(q);
    const ctrl = new AbortController(); const timer = setTimeout(() => ctrl.abort(), 6000);
    // ALS returns one language per request (by Accept-Language), so ask for Chinese and English in parallel and merge by GeoAddress
    const url = "https://www.als.gov.hk/lookup?q=" + encodeURIComponent(q) + "&n=8";
    const get = lng => fetch(url + "&lang=" + lng, { headers: { Accept: "application/json", "Accept-Language": lng }, cache: "no-store", signal: ctrl.signal }).then(r => r.json()).catch(() => ({}));
    try {
      const [zh, en] = await Promise.all([get("zh-Hant"), get("en")]);
      const enBy = new Map((en.SuggestedAddress || []).map(s => [s.Address.PremisesAddress.GeoAddress, s.Address.PremisesAddress]));
      const base = (zh.SuggestedAddress && zh.SuggestedAddress.length) ? zh.SuggestedAddress : (en.SuggestedAddress || []);
      const merged = base.map(s => {
        const pa = Object.assign({}, s.Address.PremisesAddress), e = enBy.get(pa.GeoAddress);
        if (e) { pa.EngPremisesAddress = e.EngPremisesAddress; if (!pa.ChiPremisesAddress && e.ChiPremisesAddress) pa.ChiPremisesAddress = e.ChiPremisesAddress; }
        return { Address: { PremisesAddress: pa } };
      });
      const seen = new Set();
      const list = merged.map(fromALS).filter(p => p && !seen.has(p.zh + p.addrZh) && seen.add(p.zh + p.addrZh));
      if (list.length) alsCache.set(q, list);
      return list;
    } catch (e) { return []; } finally { clearTimeout(timer); }
  }
  function attachSearch(input, ul, onPick) {
    let seq = 0, debounce;
    const render = (list, status) => {
      ul.innerHTML = "";
      list.forEach(p => {
        const li = document.createElement("li"); li.tabIndex = 0;
        li.innerHTML = `<div class="r-main">${esc(p.zh)} · ${esc(p.en)}</div><div class="r-sub">${esc(p.addrZh)} / ${esc(p.addrEn)}${p.district ? " · " + esc(p.district.split(" ")[0]) : ""}</div>`;
        const pick = () => { seq++; clearTimeout(debounce); onPick(p); ul.innerHTML = ""; };
        li.addEventListener("click", pick);
        li.addEventListener("keydown", e => { if (e.key === "Enter") pick(); });
        ul.appendChild(li);
      });
      if (status) { const li = document.createElement("li"); li.className = "r-status"; li.textContent = status; ul.appendChild(li); }
    };
    input.addEventListener("input", () => {
      const q = input.value.trim(); const my = ++seq;
      const local = localSearch(q);
      if (!q) { ul.innerHTML = ""; return; }
      render(local, q.length >= 2 ? t("searchingLive") : null);
      clearTimeout(debounce);
      if (q.length < 2) return;
      debounce = setTimeout(async () => {
        const live = await alsSearch(q);
        if (my !== seq) return;
        const merged = local.concat(live.filter(l => !local.some(x => x.zh === l.zh))).slice(0, 8);
        render(merged, merged.length ? null : t("noResult"));
      }, 320);
    });
  }

  // ================================================================ i18n apply
  function applyLang() {
    document.documentElement.lang = lang === "zh" ? "zh-HK" : "en";
    $("#langBtn").textContent = LANG_SHORT[typeof paxLang !== "undefined" ? paxLang : lang] || (lang === "zh" ? "中" : "EN");
    $$("#langMenu [data-lang]").forEach(b => b.classList.toggle("active", b.dataset.lang === (typeof paxLang !== "undefined" ? paxLang : lang)));
    { const on = document.documentElement.classList.contains("big-text"); const sb = $("#sizeBtn"); if (sb) sb.textContent = lang === "zh" ? (on ? "標準" : "大字") : (on ? "Standard" : "Large"); }
    ICON_MAP.forEach(([sel, name]) => $$(sel).forEach(el => { el.dataset.icon = name; }));
    $$("[data-t]").forEach(el => {
      const v = t(el.dataset.t); if (typeof v !== "string") return;
      if (el.dataset.icon) el.innerHTML = ic(el.dataset.icon) + `<span>${esc(v)}</span>`; else el.textContent = v;
    });
    $$("[data-tab]").forEach(b => { const i = b.querySelector(".tab-ic"); if (i) i.innerHTML = ic(TAB_ICONS[b.dataset.tab]); });
    // Chinese headings: keep each phrase together so lines only break at punctuation (no stray characters)
    $$("h1[data-t], h2[data-t], .story-punch[data-t], .status-big[data-t]").forEach(phraseWrap);
    $$("[data-tab]").forEach(b => { const lbl = b.querySelector(".tab-lbl"); if (lbl) lbl.textContent = T[lang].tabs[b.dataset.tab]; });
    renderLaunch(); renderFees(); renderFeatures(); renderPains(); renderReadyNote(); renderNotes();
    { const nn = $("#needNote"); if (nn) nn.placeholder = t("needNotePh"); } renderNearby(); renderPickupPoints(); { const lb = $("#locBtn"); if (lb) lb.innerHTML = ic("pin") + "<span>" + t("locBtn") + "</span>"; } if (typeof renderRoute === "function") renderRoute(); if (typeof renderPay === "function") renderPay(); if (typeof renderSide === "function") renderSide(); if (typeof renderSign === "function") { renderSign(); syncSignBar(); } if (typeof renderAfter === "function") renderAfter(); if (typeof updatePlanRows === "function") updatePlanRows(); if (typeof renderPayAccept === "function") renderPayAccept(); renderFareOptions(); updateQuote(); updateBookBtn();
    renderStars("#riderStars", "rider"); renderStars("#driverStars", "driver"); updateDriverStatus(); renderPanels(); if (typeof renderPayAccept === "function") renderPayAccept();
    $("#levelCard").innerHTML = t("levelCard");
    if (R.pickup) $("#pickupInput").value = `${R.pickup.zh} · ${R.pickup.en}`;
  }
  function fmtDate(s) {
    const d = new Date(s + "T00:00:00+08:00");
    return isNaN(d) ? s : d.toLocaleDateString(lang === "zh" ? "zh-HK" : "en-GB", { year: "numeric", month: "long", day: "numeric" });
  }
  function renderLog() {
    const items = CFG.progress || []; if (!items.length) return;
    const short = s => { const d = new Date(s + "T00:00:00+08:00"); if (isNaN(d)) return s; return lang === "zh" ? `${d.getMonth() + 1} 月 ${d.getDate()} 日` : d.toLocaleDateString("en-GB", { day: "numeric", month: "short" }); };
    const html = `<h2>${t("logTitle")}</h2><ol class="log-list">${items.map(x => `<li><time>${short(x.date)}</time><span>${esc(lang === "en" ? x.en : x.zh)}</span></li>`).join("")}</ol>
      <div class="log-money"><b>${t("logMoney", { s: (CFG.spentHKD || 0).toLocaleString("en-HK"), i: (CFG.incomeHKD || 0).toLocaleString("en-HK") })}</b><span>${t("logMoneyNote")}</span></div><p class="log-note">${t("logNote")}</p>`;
    ["homeLog", "sideLog"].forEach(id => { const el = document.getElementById(id); if (el) el.innerHTML = html; });
  }
  function renderLaunch() {
    renderLog();
    const c = CFG, box = $("#launchBox"); if (!box) return;
    const dr = c.driversSignedUp || 0, rr = c.ridersSignedUp || 0;
    const bar = (have, need, lbl) => {
      const pct = Math.min(100, Math.round(have / Math.max(1, need) * 100));
      return `<div class="lp-row"><span class="lp-lbl">${lbl}</span><span><b>${have}</b> / ${need}</span></div><div class="lp-bar"><i style="width:${pct}%"></i></div>`;
    };
    box.innerHTML = `
      <h2>${t("launchTitle")}</h2>
      <div class="lp-step"><div class="lp-num">1</div><div class="lp-body"><b>${t("launchStep1")}</b><span>${t("launchStep1D", { d: fmtDate(c.buildBy || "2026-12-15"), dr: c.buildDrivers || 10, rr: c.buildRiders || 100 })}</span>
        ${bar(dr, c.buildDrivers || 10, ic("car") + t("launchDrivers"))}${bar(rr, c.buildRiders || 100, ic("user") + t("launchRiders"))}</div></div>
      <div class="lp-step"><div class="lp-num">2</div><div class="lp-body"><b>${t("launchStep2")}</b><span>${t("launchStep2D", { d: fmtDate(c.launchDate || "2027-03-01"), dr: c.launchDrivers || 30, rr: c.launchRiders || 300 })}</span>
        ${bar(dr, c.launchDrivers || 30, ic("car") + t("launchDrivers"))}${bar(rr, c.launchRiders || 300, ic("user") + t("launchRiders"))}</div></div>
      <p class="lp-note">${t("launchNote")}</p>
      <div class="btn-row"><a class="btn btn-primary interest" data-form="rider" target="_blank" rel="noopener">${ic("user")}<span>${t("launchRiders")}</span></a><a class="btn btn-tonal-light interest" data-form="driver" target="_blank" rel="noopener">${ic("car")}<span>${t("launchDrivers")}</span></a></div>`;
    wireInterest(box);
  }
  // No stray characters: keep the last 4 Chinese characters (or last 2 English words) of short text blocks together
  const NOWIDOW = "p, li, .stat-note, .fee-item span, .save-sub, .offer-tags .tag, .short-note.car span, .unlock span, .wall-msg, .impact-grid span, .milestone, .thanks-in span, .short-note.senior span, .saved-banner span, .rest-note span, .perk span, .q-row span, .lv-row span, .driver-line em, .short-note span, .disc-rule > span, .waived span, .pc-line, .pain-q span, .pain-a span, .fo-desc, .status-sub, .eta, .nearby span, .shift-hint span, .ready-note span, .shared-note span, .feat-desc, .lp-body > span, .offer-foot, .src-note span, .tip-note, .r-sub, .bubble, .msg-meta, .arrive-banner span, .pnote, .badge span, .sp-a, .sf span, .route-note, .ro-meta, .faq-item p";
  function noWidow(el) {
    if (el.dataset.nw === el.textContent && (el.dataset.nwcut === "0" || el.querySelector(".nobr"))) return;
    const walker = document.createTreeWalker(el, NodeFilter.SHOW_TEXT); let last = null, n;
    while ((n = walker.nextNode())) if (n.data.trim()) last = n;
    if (!last || (last.parentElement && last.parentElement.classList.contains("nobr"))) { el.dataset.nw = el.textContent; return; }
    const s = last.data.replace(/\s+$/, "");
    let cut;
    if (/[\u3000-\u9fff\uff00-\uffef]$/.test(s)) { let count = 0, i = s.length; while (i > 0 && count < 4) { i--; if (!/[\s。，、！？：；）」』….,!?)]/.test(s[i])) count++; } cut = i; }
    else { const m = s.match(/(\S+\s+\S+)$/); cut = m && m[1].length <= 18 ? s.length - m[1].length : 0; } // long English pairs (e.g. "favourite-driver priority") would overrun narrow rows
    if (cut > 0) {
      const span = document.createElement("span"); span.className = "nobr"; span.textContent = s.slice(cut);
      last.data = s.slice(0, cut); last.parentNode.insertBefore(span, last.nextSibling);
    }
    el.dataset.nwcut = cut > 0 ? "1" : "0";
    el.dataset.nw = el.textContent;
  }
  let nwPending = false;
  function fixWidows() { nwPending = false; if (SIMP) convertTree(true); $$(NOWIDOW).forEach(noWidow); }
  new MutationObserver(() => { if (!nwPending) { nwPending = true; requestAnimationFrame(fixWidows); } })
    .observe(document.body, { childList: true, subtree: true, characterData: true });
  function phraseWrap(el) {
    const txt = el.textContent;
    if (!/[\u4e00-\u9fff]/.test(txt)) return;
    const parts = txt.split(/(?<=[、，。：；！？])/);
    el.innerHTML = parts.map(p => `<span class="phrase">${esc(p)}</span>`).join("");
  }
  function renderFees() {
    const box = document.getElementById("feesBox"); if (!box) return;
    box.innerHTML = `<h2>${t("feesTitle")}</h2><p class="fees-body">${t("feesBody")}</p>
      <div class="fees-grid">${T[lang].feesList.map(([a, b], i) => `<div class="fee-item"><span class="sw s${Math.min(i, 2)}"></span><b>${a}</b><span>${b}</span></div>`).join("")}</div>
      <p class="fees-note">${t("feesNote")}</p>`;
  }
  function renderFeatures() {
    $("#featTitle").textContent = t("featTitle");
    $("#featList").innerHTML = T[lang].features.map(([n, d]) => `<div class="feat"><span class="feat-name">${n}</span><span class="feat-desc">${d}</span></div>`).join("");
    $$("#featList .feat-desc").forEach(phraseWrap);
  }
  let painTab = "rider";
  function renderPains() {
    const list = painTab === "rider" ? T[lang].painsRider : T[lang].painsDriver;
    $("#painList").innerHTML = list.map(([p, f]) => `<div class="pain"><div class="pain-q">${ic("frown")}<span>${p}</span></div><div class="pain-a">${ic("check")}<span>${f}</span></div></div>`).join("");
    $$(".seg-btn").forEach(b => b.classList.toggle("active", b.dataset.pain === painTab));
  }
  $$(".seg-btn").forEach(b => b.addEventListener("click", () => { painTab = b.dataset.pain; renderPains(); }));

  // ---------------- tab panels (scheduled, favourites, me; driver bookings, today, me)
  // passenger spending: past trips (demo history) plus trips taken in this session
  const SPENT = { extra: [], saved: 38 };
  function renderSpend() {
    const P = T[lang].panels, past = P.history.map(h => +((h[1] || "").match(/HK\$(\d+)/) || [0, 0])[1]).filter(Boolean);
    const all = past.concat(SPENT.extra), month = SPENT.extra.concat(past.slice(0, 1));
    const sum = a => a.reduce((s, x) => s + x, 0), yr = sum(all) + 1240;
    const n = all.length + 18;
    return `<div class="pcard spend"><div class="pc-head">${ic("coins")}<span>${t("spendTitle")}</span></div>
      <div class="spend-grid">
        <div><span>${t("spendMonth")}</span><b>HK$${money(sum(month))}</b><small>${t("spendTrips", { n: month.length })}</small></div>
        <div><span>${t("spendYear")}</span><b>HK$${money(yr)}</b><small>${t("spendTrips", { n })}</small></div>
        <div><span>${t("spendAvg")}</span><b>HK$${Math.round(yr / n)}</b></div>
        ${OFFERS ? `<div class="saved"><span>${t("spendSaved")}</span><b>HK$${money(SPENT.saved)}</b></div>` : ""}
      </div></div>`;
  }
  const SCHED = { rider: new Set(), driver: { 0: "taken" } };
  document.addEventListener("click", e => {
    const r = e.target.closest("[data-schedact]"), dr = e.target.closest("[data-dschedact]");
    if (!r && !dr) return;
    if (r) { const [a, i] = r.dataset.schedact.split(":"); if (a === "edit") { toast(t("sEdited")); return; } SCHED.rider.add(+i); toast(t("sCancelled")); }
    if (dr) { const [a, i] = dr.dataset.dschedact.split(":"); SCHED.driver[+i] = a === "take" ? "taken" : "cancelled"; if (a === "cancel") toast(t("dsCancelled")); }
    renderPanels();
  });
  function renderPanels() {
    const P = T[lang].panels;
    const card = (lines, cls = "") => `<div class="pcard ${cls}">${lines.map((l, i) => i === 0 ? `<div class="pc-head">${l}</div>` : `<div class="pc-line">${l}</div>`).join("")}</div>`;
    const set = (id, html) => { const el = document.getElementById(id); if (el) el.innerHTML = html; };
    set("panel-sched", `<h2>${P.schedTitle}</h2>` + P.sched.map((s, i) => SCHED.rider.has(i)
        ? `<div class="pcard sched cancelled"><div class="pc-head">${s[0]}</div><div class="pc-line">${s[1]}</div><div class="pc-line muted">${t("sCancelled")}</div></div>`
        : card(s, "sched").replace(/<\/div>\s*$/, "") + `<div class="sched-act"><button class="btn btn-ghost btn-sm" data-schedact="edit:${i}">${t("sEdit")}</button><button class="btn btn-ghost btn-sm s-cancel" data-schedact="cancel:${i}">${t("sCancel")}</button></div></div>`).join("") +
      `<p class="pnote">${t("sRule")}</p>` + `<button class="btn btn-primary btn-block" data-demo>${ic("calendar")}<span>${P.newSched}</span></button>`);
    set("panel-fav", `<h2>${P.favTitle}</h2><p class="pnote">${P.favNote}</p>` + P.favs.map(f => `<div class="pcard fav"><div class="pc-head"><span class="avatar">${f[0].replace(/^Driver /, "").slice(0, 1)}</span>${f[0]}</div><div class="pc-line">${f[1]}</div><div class="pc-line">${f[2]}</div><div class="pc-line muted">${f[3]}</div><button class="btn btn-tonal" data-demo>${ic("repeat")}<span>${P.rebook}</span></button></div>`).join(""));
    set("panel-me", `<div class="pcard me"><div class="pc-head"><span class="avatar big">${ic("user")}</span>${P.meLevel}</div><div class="pc-line">${P.meStats}</div><div class="pc-line muted">${P.meNote}</div></div>` +
      `<div class="pcard rlevel"><div class="lv-row"><b>${P.rLevel}</b><span>${P.rLevelNext}</span></div><div class="lp-bar"><i style="width:${P.rLevelPct}%"></i></div></div>` +
      `<div class="pcard loyal"><div class="pc-head">${ic("star")}<span>${P.loyalTitle}</span></div>${P.loyal.map(([q, have, need, marks]) => `<div class="quest"><div class="q-row"><span>${q}</span><b>${have}/${need}</b></div><div class="lp-bar tiers"><i style="width:${Math.min(100, have / need * 100)}%"></i>${(marks || []).map(([at, lbl]) => `<em class="tier ${have >= at ? "got" : ""}" style="left:${at / need * 100}%"><span>${lang === "en" ? at + " rides " : at + " 程 "}${lbl}</span></em>`).join("")}</div></div>`).join("")}<div class="pc-line muted">${P.loyalNote}</div></div>` +
      `<div class="pcard rquests"><div class="pc-head">${ic("check")}<span>${P.rQuestsTitle}</span></div>${P.rQuests.map(([q, have, need, pts]) => `<div class="quest ${have >= need ? "done" : ""}"><div class="q-row"><span>${q}</span><b>${have >= need ? P.questDone + " " + pts : pts}</b></div><div class="lp-bar"><i style="width:${Math.round(have / need * 100)}%"></i></div></div>`).join("")}</div>` +
      `<div class="pcard"><div class="pc-head">${ic("star")}<span>${P.rUnlockTitle}</span></div>${P.rUnlocks.map(([lv, txt, got]) => `<div class="unlock ${got ? "got" : ""}"><b>${lv}</b><span>${txt}</span>${ic(got ? "check" : "clock")}</div>`).join("")}</div>` +
      `<div class="pcard rpoints"><div class="pc-head">${ic("star")}<span>${P.rPointsTitle} · ${P.rPoints}</span></div>${P.rPerks.map(([a, b, c]) => `<div class="perk"><div><b>${a}</b><span>${b}</span></div><em>${c}</em></div>`).join("")}<div class="rbadges">${P.rBadges.map(([n, got]) => `<span class="rbadge ${got ? "got" : ""}">${ic(got ? "star" : "clock")}${n}</span>`).join("")}</div><div class="pc-line muted">${P.rImpact}</div></div>` +
      renderSpend() +
      `<h3>${P.historyTitle}</h3>` + P.history.map(h => card(h)).join("") +
      card([P.duesTitle, P.duesBody], "dues") +
      `<div class="pcard books"><div class="pc-head">${ic("book")}<span>${P.booksTitle}</span></div><div class="pc-line muted">${P.booksBody}</div>
        <div class="split-bar">${P.booksSplit.map(([n, p], i) => `<i class="s${i}" style="width:${p}%"></i>`).join("")}</div>
        ${P.booksSplit.map(([n, p, d], i) => `<div class="split-row"><span class="sw s${i}"></span><b>${n} ${p}%</b><span>${d}</span></div>`).join("")}
        <div class="pc-line muted">${P.booksNote}</div></div>` +
      `<h3>${P.settingsTitle}</h3><div class="list-group">${P.settings.map((s, i) => `<button class="list-row" data-demo><span class="lr-ic">${ic(["globe", "eye", "message", "phone", "user", "shield"][i] || "settings")}</span><span class="lr-txt">${s}</span>${ic("chevron", "lr-chev")}</button>`).join("")}</div>`);
    set("panel-dsched", `<h2>${P.dschedTitle}</h2><p class="pnote">${P.dschedNote}</p>` + P.dsched.map((d, i) => {
        const st = SCHED.driver[i] || "open";
        const acts = st === "cancelled" ? `<div class="pc-line muted">${t("dsCancelled")}</div>`
          : st === "taken" ? `<div class="sched-act"><span class="ds-taken">${t("dsTaken")}</span><button class="btn btn-ghost btn-sm s-cancel" data-dschedact="cancel:${i}">${t("dsCancel")}</button></div>`
          : `<button class="btn btn-accept small" data-dschedact="take:${i}">${t("dsTake")}</button>`;
        return `<div class="pcard dark ${st}"><div class="pc-head">${d[0]}</div><div class="pc-line big">${d[1]}</div><div class="pc-line">${d[2]}</div>${acts}</div>`;
      }).join("") + `<p class="pnote">${t("dsRule")}</p>`);
    renderEarn();
    set("panel-dme", `<div id="driverProfile" class="route-box pay-accept"></div><div class="pcard dark story-card"><div class="pc-head">${ic("user")}<span>${P.storyTitle}</span></div><div class="pc-line">「${P.story}」</div><button class="btn btn-dark-on mini" data-demo>${P.storyEdit}</button></div>` +
      `<h3>${P.wallTitle}</h3>` + P.wall.map(([who, msg]) => `<div class="pcard dark wall"><div class="wall-msg">${msg}</div><div class="wall-who">— ${who}</div></div>`).join("") +
      `<div class="pcard dark">${t("levelCard")}</div>` +
      `<h3>${P.dmeCompl}</h3><div class="pcard dark">${P.compliments.map(c => `<div class="pc-line setting">${c[0]} <b>×${c[1]}</b></div>`).join("")}</div>` +
      `<h3>${P.badgesTitle}</h3><div class="badge-grid">${P.badges.map(([n, d, got]) => `<div class="badge ${got ? "got" : ""}">${ic(got ? "star" : "clock")}<b>${n}</b><span>${d}</span></div>`).join("")}</div>` +
      `<div class="pcard dark"><div class="pc-head">${ic("pin")}<span>${P.districtTitle}</span></div><div class="dots18">${Array.from({ length: 18 }, (_, i) => `<i class="${i < P.districtN ? "on" : ""}"></i>`).join("")}</div><div class="pc-line">${P.districtTxt}</div></div>` +
      `<div class="pcard dark"><div class="pc-head">${ic("trophy")}<span>${P.leaderTitle}</span></div><div class="pc-line">${P.leaderTxt}</div></div>` +
      `<div class="pcard dark star"><div class="pc-head">${ic("trophy")}<span>${P.starTitle}</span></div><div class="pc-line">${P.starBody}</div></div>` +
      `<div class="pcard dark gift"><div class="pc-head">${ic("heart")}<span>${P.giftTitle}</span></div><div class="pc-line">${P.giftBody}</div><button class="btn btn-online small-btn" data-demo>${P.giftBtn}</button></div>` +
      `<div class="pcard dark dues-d"><div class="pc-head">${ic("wallet")}<span>${P.dDuesTitle}</span></div><div class="pc-line">${P.dDuesBody}</div></div>` +
      `<div class="pcard dark"><div class="pc-head">${P.regularsTitle}</div><div class="pc-line">${P.regulars}</div></div>` +
      `<h3>${P.rulesTitle}</h3><div class="pcard dark">${P.rules.map(r => `<div class="pc-line">${r}</div>`).join("")}</div>`);
  }
  let earnPeriod = 0;
  function renderEarn() {
    const P = T[lang].panels, d = P.earnData[earnPeriod], L = P.earnLbls, el = document.getElementById("panel-earn"); if (!el) return;
    const fmt = n => "HK$" + Math.round(n).toLocaleString("en-HK");
    const pct = Math.min(100, Math.round(d.total / d.goal * 100));
    el.innerHTML = `
      <div class="seg dark-seg">${P.earnTabs.map((x, i) => `<button class="seg-btn ${i === earnPeriod ? "active" : ""}" data-earn="${i}">${x}</button>`).join("")}</div>
      <div class="earn-hero"><span>${L.total}</span><b>${fmt(d.total)}</b>
        <div class="goal-row"><span>${L.goal} ${fmt(d.goal)}</span><span>${pct}%</span></div>
        <div class="lp-bar"><i style="width:${pct}%"></i></div></div>
      <div class="pcard dark impact"><div class="pc-head">${ic("heart")}<span>${P.impactTitle}</span></div>
        <div class="impact-grid">${P.impact.map(([n, l]) => `<div><b>${n}</b><span>${l}</span></div>`).join("")}</div>
        <div class="pc-line milestone">${P.milestone}</div></div>
      <div class="pcard dark level"><div class="lv-row"><b>${P.levelLine}</b><span>${P.levelNext}</span></div><div class="lp-bar"><i style="width:${P.levelPct}%"></i></div></div>
      <div class="pcard dark quests"><div class="pc-head">${ic("check")}<span>${P.questsTitle}</span></div>
        ${P.quests.map(([q, have, need, pts]) => `<div class="quest ${have >= need ? "done" : ""}"><div class="q-row"><span>${q}</span><b>${have >= need ? P.questDone + " " + pts : pts}</b></div><div class="lp-bar"><i style="width:${Math.round(have / need * 100)}%"></i></div><span class="q-prog">${have}/${need}</span></div>`).join("")}</div>
      <div class="saved-banner">${ic("wallet")}<span>${P.lifetime}</span></div>
      <div class="earn-grid">
        <div class="earn"><b>${d.trips}</b><span>${L.trips}</span></div>
        <div class="earn"><b>${d.hours} h</b><span>${L.hours}</span></div>
        <div class="earn"><b>${fmt(d.total / d.hours)}</b><span>${L.perHour}</span></div>
        <div class="earn"><b class="muted-b">${d.empty}</b><span>${L.empty}</span></div>
      </div>
      <div class="pcard dark breakdown">
        <div class="pc-line setting"><span>${L.fare}</span><b>${fmt(d.fare)}</b></div>
        <div class="pc-line setting"><span>${L.booking}</span><b>${fmt(d.booking)}</b></div>
        <div class="pc-line setting"><span>${L.tips}</span><b>${fmt(d.tips)}</b></div>
        <div class="pc-line setting"><span>${L.comm}</span><b class="zero">HK$0</b></div>
      </div>
      <p class="pnote">${P.commSaved.split("{x}").join(Math.round(d.total * 0.1).toLocaleString("en-HK"))}</p>
      <h3>${P.pointsTitle}</h3>
      <div class="pcard dark points"><div class="pc-head">${ic("star")}<span>${P.pointsNow.split("{p}").join(String(DPTS))}</span></div>
        <div class="pc-line streak">${ic("check")}<span>${P.streak}</span></div>
        ${P.pointsEarn.map(([a, b]) => `<div class="pc-line setting"><span>${a}</span><b>${b}</b></div>`).join("")}</div>
      <h3>${P.redeemTitle}</h3><p class="pnote">${P.poolNote}</p>
      ${P.redeem.map(([a, b, c]) => `<div class="pcard dark redeem"><div class="rd-txt"><b>${a}</b><span>${b} · ${c}</span></div><button class="btn btn-online small-btn" data-demo>${P.redeemBtn}</button></div>`).join("")}
      <div class="rest-note">${ic("shield")}<span>${P.restNote}</span></div>
      <button class="btn btn-dark-on btn-block" data-demo>${ic("book")}<span>${P.exportBtn}</span></button>`;
  }
  document.addEventListener("click", e => {
    const eb = e.target.closest("[data-earn]"); if (eb) { earnPeriod = +eb.dataset.earn; renderEarn(); return; }
    if (e.target.closest("[data-demo]")) { toast(t("demoToast")); return; }
    const tab = e.target.closest("[data-tab]"); if (!tab) return;
    const view = tab.closest(".view");
    $$("[data-tab]", view).forEach(b => b.classList.toggle("active", b === tab));
    $$(".tab-panel", view).forEach(p => p.classList.toggle("active", p.dataset.panel === tab.dataset.tab));
    const shell = $(".app-shell"); if (shell) shell.scrollTop = 0; window.scrollTo(0, 0);
    if (tab.dataset.tab === "ride") setTimeout(() => R.map && R.map.invalidateSize(), 60);
  });

  // ================================================================ navigation
  function syncDemoSwitch() {
    const v = ($(".view.active") || {}).id || "";
    $$("#sideDemo [data-side]").forEach(b => { const on = v === "view-" + b.dataset.side; b.classList.toggle("on", on); b.setAttribute("aria-pressed", on ? "true" : "false"); });
  }
  function go(view) {
    $$(".view").forEach(v => v.classList.toggle("active", v.id === "view-" + view));
    const shell = $(".app-shell"); if (shell) shell.scrollTop = 0;
    if (!matchMedia("(min-width: 900px)").matches) window.scrollTo(0, 0);
    setTimeout(syncDemoSwitch, 0);
    if (view === "rider") initRider();
    if (view !== "driver") stopDriverTimers();
  }
  $$("[data-go]").forEach(b => b.addEventListener("click", () => go(b.dataset.go)));
  // language picker: zh / en change the interface; other languages use English screens and set the passenger's chat language
  let paxLang = "zh";
  const LANG_SHORT = { zh: "中", "cmn-s": "简", "cmn-t": "國", en: "EN", id: "ID", tl: "TL", ur: "UR", ne: "NE", hi: "HI" };
  // Simplified Chinese screens for mainland visitors (OpenCC converter, loaded on demand); original text is kept to switch back
  let SIMP = false, toSimp = null;
  function convertTree(on) {
    const w = document.createTreeWalker(document.body, NodeFilter.SHOW_TEXT); let n;
    while ((n = w.nextNode())) {
      if (n.parentElement && /^(SCRIPT|STYLE)$/.test(n.parentElement.tagName)) continue;
      if (on && toSimp) { if (n.__orig === undefined) { const c = toSimp(n.data); if (c !== n.data) { n.__orig = n.data; n.data = c; } } }
      else if (!on && n.__orig !== undefined) { n.data = n.__orig; delete n.__orig; }
    }
  }
  function ensureSimp(cb) {
    if (toSimp) return cb();
    const s = document.createElement("script"); s.src = "https://cdn.jsdelivr.net/npm/opencc-js@1.0.5/dist/umd/full.js";
    s.onload = () => { try { toSimp = OpenCC.Converter({ from: "hk", to: "cn" }); } catch (e) {} cb(); };
    document.head.appendChild(s);
  }
  $("#langBtn").addEventListener("click", e => { e.stopPropagation(); const m = $("#langMenu"); m.classList.toggle("hidden"); $("#langBtn").setAttribute("aria-expanded", m.classList.contains("hidden") ? "false" : "true"); });
  document.addEventListener("click", e => { if (!e.target.closest(".lang-wrap")) { $("#langMenu").classList.add("hidden"); $("#langBtn").setAttribute("aria-expanded", "false"); } });
  $("#langMenu").addEventListener("click", e => {
    const b = e.target.closest("[data-lang]"); if (!b) return;
    setPaxLang(b.dataset.lang, false);
  });
  // first visit: follow the phone's language (tourists and other non-Cantonese phones get their language, else English); later visits: remember the choice
  // Chinese (Cantonese) by default for everyone; only a choice made in the language menu changes it (and is remembered)
  function detectLang() {
    try { const s = localStorage.getItem("kaifong-lang"); if (s && LANG_SHORT[s]) return s; } catch (e) {}
    return "zh";
  }

  function setPaxLang(code, quiet) {
    paxLang = code;
    try { localStorage.setItem("kaifong-lang", code); } catch (e) {}
    ["lang-id", "lang-tl", "lang-ur", "lang-ne", "lang-hi", "lang-cmn"].forEach(k => R.prefs.delete(k));
    const mand = paxLang.startsWith("cmn");
    lang = (paxLang === "zh" || mand) ? "zh" : "en";
    if (mand) { R.prefs.add("lang-cmn"); if (!quiet) toast(t("langCmn")); }
    else if (!["zh", "en"].includes(paxLang)) { R.prefs.add("lang-" + paxLang); if (!quiet) toast(t("langOther")); }
    if (SIMP) { SIMP = false; convertTree(false); }
    $("#langMenu").classList.add("hidden");
    applyLang();
    if (paxLang === "cmn-s") ensureSimp(() => { SIMP = true; convertTree(true); });
  }
  // 大字模式 (large text): bigger type and targets, stronger contrast; remembered on this device
  function setBig(on) {
    document.documentElement.classList.toggle("big-text", on);
    const b = $("#sizeBtn"); b.setAttribute("aria-pressed", on ? "true" : "false"); b.classList.toggle("on", on);
    b.textContent = lang === "zh" ? (on ? "標準" : "大字") : (on ? "Standard" : "Large");
    try { localStorage.setItem("kaifong-big", on ? "1" : "0"); } catch (e) {}
    setTimeout(() => R.map && R.map.invalidateSize(), 80);
  }
  $("#sizeBtn").addEventListener("click", () => setBig(!document.documentElement.classList.contains("big-text")));

  function wireInterest(root) {
    $$(".interest", root).forEach(a => {
      if (a.dataset.wired) return; a.dataset.wired = "1";
      const url = a.dataset.form === "rider" ? CFG.riderFormUrl : CFG.driverFormUrl;
      if (url) a.href = url;
      else { a.href = "#"; a.addEventListener("click", e => { e.preventDefault(); toast(t("formSoon")); }); }
    });
  }
  wireInterest(document);
  if (CFG.contactEmail) $("#contactLine").textContent = "✉️ " + CFG.contactEmail;

  // ================================================================ rider
  const R = { route: "auto", pay: (() => { try { return localStorage.getItem("kaifong-pay") || "cash"; } catch (e) { return "cash"; } })(), routes: null, routeLayer: null, map: null, me: null, taxis: [], pickup: byId("ifc"), dest: null, when: "now", ready: 0, point: 0,
              prefs: new Set(), fareMode: "meter", offers: new Set(), tip: 0, chatN: 0, pax: 1, bags: 0, car: "any", timers: [] };
  const TIP_MAX = 100;
  function clearRiderTimers() { R.timers.forEach(clearInterval); R.timers.forEach(clearTimeout); R.timers = []; }

  function initRider() {
    if (!R.map && window.L) {
      R.map = L.map("riderMap", { zoomControl: false }).setView([R.pickup.lat, R.pickup.lng], 15);
      L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", { maxZoom: 19, attribution: "© OpenStreetMap" }).addTo(R.map);
      R.me = L.marker([R.pickup.lat, R.pickup.lng], { icon: L.divIcon({ className: "", html: '<div class="me-marker"></div>', iconSize: [18, 18] }) }).addTo(R.map);
      spawnTaxis();
    }
    setTimeout(() => R.map && R.map.invalidateSize(), 60);
    renderNearby();
  }
  function recentre() { if (!R.map) return; R.map.setView([R.pickup.lat, R.pickup.lng], 15); R.me.setLatLng([R.pickup.lat, R.pickup.lng]); }
  function spawnTaxis() {
    if (!R.map) return;
    R.taxis.forEach(m => m.remove()); R.taxis = [];
    const p = R.pickup;
    let near = PLACES.filter(x => x.id !== p.id && km(x, p) < 8);
    if (!near.length) near = PLACES.filter(x => x.id !== p.id).sort((a, b) => km(a, p) - km(b, p)).slice(0, 3);
    for (let i = 0; i < 5; i++) {
      const target = near[i % near.length];
      const frac = 0.03 + Math.random() * 0.12;
      const lat = p.lat + (target.lat - p.lat) * frac + (Math.random() - 0.5) * 0.0008;
      const lng = p.lng + (target.lng - p.lng) * frac + (Math.random() - 0.5) * 0.0008;
      R.taxis.push(L.marker([lat, lng], { icon: L.divIcon({ className: "", html: '<div class="taxi-marker">' + TAXI_MARKER + '</div>', iconSize: [26, 26] }) }).addTo(R.map));
    }
  }
  function renderNearby() {
    $("#nearbyLine").innerHTML = `<div class="nb-main">${ic("car")}<span>${t("nearby", { n: 5, m: 3 })}</span></div><div class="shift-hint">${ic("repeat")}<span>${t("shiftLine")}</span></div>`;
  }
  function renderPickupPoints() {
    $("#pickupPoints").innerHTML = T[lang].pickupPoints.map((p, i) => `<button class="chip ${i === R.point ? "active" : ""}" data-point="${i}">${p}</button>`).join("");
  }
  $("#pickupPoints").addEventListener("click", e => {
    const b = e.target.closest("[data-point]"); if (!b) return; R.point = +b.dataset.point; renderPickupPoints(); updateQuote();
  });

  function setPickup(p) {
    R.pickup = p; $("#pickupInput").value = `${p.zh} · ${p.en}`; recentre(); spawnTaxis(); renderRoute(); updateQuote(); renderFareOptions();
  }
  attachSearch($("#pickupInput"), $("#pickupResults"), setPickup);
  // 目前位置: phone GPS, then the nearest address from OpenStreetMap (demo; a real app would use the government's location data)
  const ISLAND_DISTRICTS = /Central and Western|Wan Chai|Eastern|Southern|中西區|灣仔|東區|南區/;
  $("#locBtn").addEventListener("click", () => {
    if (!navigator.geolocation) { toast(t("locDenied")); return; }
    toast(t("locFinding"));
    navigator.geolocation.getCurrentPosition(async pos => {
      const lat = pos.coords.latitude, lng = pos.coords.longitude;
      if (lat < 22.14 || lat > 22.58 || lng < 113.82 || lng > 114.45) { toast(t("locAway")); const d = byId("ifc"); setPickup(Object.assign({}, d, { id: "here", zh: T.zh.locLabel + "（" + d.zh + "）", en: T.en.locLabel + " (" + d.en + ")" })); return; }
      const rev = lg => fetch(`https://nominatim.openstreetmap.org/reverse?format=jsonv2&zoom=18&lat=${lat}&lon=${lng}&accept-language=${lg}`).then(r => r.json()).catch(() => ({}));
      const [zh, en] = await Promise.all([rev("zh-HK"), rev("en")]);
      const nm = (j, f) => j.name || (j.address && (j.address.building || j.address.amenity || j.address.road)) || f;
      const road = j => j.address ? [j.address.house_number, j.address.road].filter(Boolean).join(" ") : "";
      const ea = en.address || {}, dist = ea.suburb || ea.city_district || "", region = (ea.city_district || "") + " " + (ea.suburb || "") + " " + ((zh.address || {}).city_district || "");
      const area = /Hong Kong Island|香港島/.test(region) || ISLAND_DISTRICTS.test(region) ? "island" : lng < 114.06 ? "lantau" : /Kowloon|九龍/.test(region) ? "kowloon" : /New Territories|新界/.test(region) ? "nt" : lat < 22.345 ? "kowloon" : "nt";
      setPickup({ id: "here", zh: T.zh.locLabel + "（" + nm(zh, "📍") + "）", en: T.en.locLabel + " (" + nm(en, "📍") + ")", addrZh: road(zh) || nm(zh, ""), addrEn: road(en) || nm(en, ""), district: dist, area, lat, lng, aliases: [] });
    }, () => toast(t("locDenied")), { enableHighAccuracy: true, timeout: 10000, maximumAge: 60000 });
  });
  attachSearch($("#destInput"), $("#destResults"), p => {
    R.dest = p; R.route = "auto"; R.driverPick = null; $("#destInput").value = `${p.zh} · ${p.en}`; renderRoute(); renderFareOptions(); updateQuote(); updateBookBtn();
  });

  $$(".chip-toggle[data-when]").forEach(b => b.addEventListener("click", () => {
    $$(".chip-toggle[data-when]").forEach(x => x.classList.toggle("active", x === b));
    R.when = b.dataset.when;
    const w = $("#whenInput"); w.classList.toggle("hidden", R.when !== "later");
    if (R.when === "later" && !w.value) {
      const d = new Date(Date.now() + 864e5); d.setHours(9, 0, 0, 0);
      w.value = new Date(d.getTime() - d.getTimezoneOffset() * 6e4).toISOString().slice(0, 16);
    }
    updateBookBtn();
  }));
  function renderReadyNote() {
    const n = $("#readyNote"); if (!n) return;
    n.classList.toggle("hidden", !R.ready);
    if (R.ready) n.innerHTML = ic("clock") + `<span>${t("readyNoteTxt", { x: R.ready })}</span>`;
  }
  $$(".chip-toggle[data-ready]").forEach(b => b.addEventListener("click", () => {
    $$(".chip-toggle[data-ready]").forEach(x => x.classList.toggle("active", x === b)); R.ready = +b.dataset.ready; renderReadyNote();
  }));
  $$(".chip-toggle[data-car]").forEach(b => b.addEventListener("click", () => {
    $$(".chip-toggle[data-car]").forEach(x => x.classList.toggle("active", x === b)); R.car = b.dataset.car;
    if (R.car === "five" && R.pax < 5) { R.pax = 5; $("#paxVal").textContent = 5; }
    renderFareOptions(); updateQuote();
  }));
  $("#moreNeedsBtn").addEventListener("click", e => { e.stopPropagation(); $("#moreNeeds").classList.toggle("hidden"); $("#moreNeedsBtn").classList.toggle("active"); });
  $$("[data-step-k]").forEach(b => b.addEventListener("click", () => {
    const k = b.dataset.stepK, d = +b.dataset.d, lim = k === "pax" ? [1, 5] : [0, 6];
    R[k] = Math.max(lim[0], Math.min(lim[1], R[k] + d));
    $("#" + k + "Val").textContent = R[k];
    if (k === "bags") { R.bags > 0 ? R.prefs.add("luggage") : R.prefs.delete("luggage"); }
    renderFareOptions(); updateQuote();
  }));
  $$("#moreNeeds .chip").forEach(c => c.addEventListener("click", () => {
    c.classList.toggle("active");
    c.classList.contains("active") ? R.prefs.add(c.dataset.pref) : R.prefs.delete(c.dataset.pref);
    renderFareOptions(); updateQuote();
  }));
  $$("#prefChips .chip:not(.more-toggle)").forEach(c => c.addEventListener("click", () => {
    c.classList.toggle("active");
    c.classList.contains("active") ? R.prefs.add(c.dataset.pref) : R.prefs.delete(c.dataset.pref);
    renderFareOptions(); updateQuote();
  }));

  const isHospital = p => /醫院|診所|醫療|Hospital|Clinic|Medical/i.test((p.zh || "") + " " + (p.en || ""));
  // Harbour tunnel portals (approximate) and typical extra traffic delay, for demo estimates only
  const TUNNELS = {
    cht: { isl: { lat: 22.2846, lng: 114.1812 }, kln: { lat: 22.3036, lng: 114.1816 }, len: 1.9, jam: 9 },
    ehc: { isl: { lat: 22.2873, lng: 114.2146 }, kln: { lat: 22.3077, lng: 114.2302 }, len: 2.2, jam: 3 },
    whc: { isl: { lat: 22.2885, lng: 114.1449 }, kln: { lat: 22.3069, lng: 114.1580 }, len: 2.0, jam: 0 }
  };
  function viaTunnel(p, d, k) {
    const tn = TUNNELS[k], pIsl = p.area === "island";
    const dist = (km(p, pIsl ? tn.isl : tn.kln) + km(pIsl ? tn.kln : tn.isl, d)) * 1.3 + tn.len;
    return { k, dist, min: Math.round(dist / 0.45 + tn.jam + 3) };
  }
  function routeOptions(p, d) {
    const cross = (p.area === "island") !== (d.area === "island");
    if (cross) {
      const opts = ["cht", "ehc", "whc"].map(k => viaTunnel(p, d, k));
      const best = opts.reduce((a, b) => (b.min < a.min ? b : a));
      return { cross, best: best.k, opts };
    }
    const base = Math.max(1, km(p, d) * 1.4);
    return { cross, best: "auto", opts: [{ k: "short", dist: Math.max(1, km(p, d) * 1.28), min: Math.round(base / 0.4 + 6) }, { k: "notoll", dist: base * 1.08, min: Math.round(base * 1.08 / 0.42 + 5) }], base };
  }
  // Live tunnel journey times: Transport Department open data (free, no key). Island sensors H*, Kowloon K*.
  const LIVE = { at: 0, data: null, busy: false };
  function fetchLive(cb) {
    if (LIVE.data && Date.now() - LIVE.at < 120000) return cb && cb();
    if (LIVE.busy) return; LIVE.busy = true;
    fetch("https://resource.data.one.gov.hk/td/jss/Journeytimev2.xml", { cache: "no-store" }).then(r => r.text()).then(tx => {
      const doc = new DOMParser().parseFromString(tx, "text/xml"), acc = { island: {}, kowloon: {} };
      [...doc.getElementsByTagName("jtis_journey_time")].forEach(n => {
        const g = k => (n.getElementsByTagName(k)[0] || {}).textContent;
        const loc = g("LOCATION_ID") || "", dst = g("DESTINATION_ID"), side = /^H/.test(loc) ? "island" : /^K/.test(loc) ? "kowloon" : null;
        const key = { CH: "cht", EH: "ehc", WH: "whc" }[dst];
        if (!side || !key || g("JOURNEY_TYPE") !== "1") return;
        (acc[side][key] = acc[side][key] || []).push({ m: +g("JOURNEY_DATA"), c: +g("COLOUR_ID") });
      });
      const med = a => { const s = a.map(x => x.m).sort((x, y) => x - y); return s[Math.floor(s.length / 2)]; };
      const out = {};
      Object.keys(acc).forEach(side => { out[side] = {}; Object.keys(acc[side]).forEach(k => { out[side][k] = { m: med(acc[side][k]), c: Math.min(...acc[side][k].map(x => x.c)) }; }); });
      LIVE.data = out; LIVE.at = Date.now();
    }).catch(() => { LIVE.data = null; }).finally(() => { LIVE.busy = false; cb && cb(); });
  }
  const TUNNEL_MID = { cht: [114.1812, 22.2940], ehc: [114.2225, 22.2975], whc: [114.1515, 22.2975] };
  const splitName = (s, lg) => { if (!s) return ""; const m = s.match(/^([^A-Za-z]*?)\s*([A-Za-z].*)$/); if (!m) return s; return lg === "en" ? m[2] : (m[1] || m[2]); };
  function fetchRoutes() {
    const p = R.pickup, d = R.dest; if (!p || !d) return;
    const key = p.id + "|" + d.id + "|" + p.lat + "," + d.lat;
    if (R.routes && R.routes.key === key) return;
    R.routes = { key, loading: true, list: [] };
    const base = "https://router.project-osrm.org/route/v1/driving/", a = p.lng + "," + p.lat, b = d.lng + "," + d.lat;
    const cross = (p.area === "island") !== (d.area === "island");
    const get = u => fetch(u).then(r => r.json());
    let job;
    if (cross) {
      job = Promise.all(Object.keys(TUNNEL_MID).map(k => get(base + a + ";" + TUNNEL_MID[k].join(",") + ";" + b + "?overview=full&geometries=geojson")
        .then(j => ({ k, dist: j.routes[0].distance / 1000, min: Math.round(j.routes[0].duration / 60), coords: j.routes[0].geometry.coordinates.map(c => [c[1], c[0]]) }))
        .catch(() => null)));
    } else {
      job = get(base + a + ";" + b + "?overview=full&geometries=geojson&alternatives=3&steps=true").then(j => j.routes.slice(0, 3).map((r, i) => {
        const steps = r.legs[0].steps || [], tun = [...new Set(steps.map(s => s.name).filter(n => /隧道|Tunnel/.test(n)))];
        return { k: "r" + i, dist: r.distance / 1000, min: Math.round(r.duration / 60), coords: r.geometry.coordinates.map(c => [c[1], c[0]]), summary: r.legs[0].summary || "", tunnels: tun };
      }));
    }
    job.then(list => { if (!R.routes || R.routes.key !== key) return; R.routes = { key, cross, list: (list || []).filter(Boolean) }; })
      .catch(() => { if (R.routes && R.routes.key === key) R.routes = { key, cross, list: [] }; })
      .finally(() => { if (R.routes && R.routes.key === key) { R.routes.loading = false; fetchLive(() => { renderRoute(); renderFareOptions(); updateQuote(); }); } });
  }
  function liveFor(k) { const side = R.pickup.area === "island" ? "island" : "kowloon"; return LIVE.data && LIVE.data[side] && LIVE.data[side][k]; }
  function realRoutes() {
    if (!R.routes || R.routes.loading || !R.routes.list.length || !R.dest) return null;
    return R.routes.list.map(r => { const lv = R.routes.cross ? liveFor(r.k) : null; return Object.assign({}, r, { live: lv, total: r.min + (lv ? Math.max(0, lv.m - 4) : 0) }); });
  }
  function drawRoutes() {
    if (!R.map || !window.L) return;
    if (R.routeLayer) { R.routeLayer.remove(); R.routeLayer = null; }
    const rr = realRoutes(); if (!rr) return;
    const sel = chosenRoute(rr);
    R.routeLayer = L.layerGroup().addTo(R.map);
    rr.filter(r => r !== sel).forEach(r => L.polyline(r.coords, { color: "#8a8f98", weight: 5, opacity: .55, dashArray: "6 8" }).on("click", () => pickRoute(r.k)).addTo(R.routeLayer));
    if (sel) L.polyline(sel.coords, { color: "#d6242c", weight: 6, opacity: .95 }).addTo(R.routeLayer);
    try { R.map.fitBounds(L.latLngBounds(rr.flatMap(r => r.coords)), { padding: [24, 24] }); } catch (e) {}
  }
  function chosenRoute(rr) {
    if (!rr) return null;
    const fastest = rr.reduce((x, y) => (y.total < x.total ? y : x));
    if (R.route === "auto") return (R.driverPick && rr.find(r => r.k === R.driverPick)) || fastest;
    return rr.find(r => r.k === R.route) || fastest;
  }
  function pickRoute(k) { R.route = k; renderRoute(); renderFareOptions(); updateQuote(); }
  function routeName(r, lg) {
    if (r.k in TUNNELS) return routeLabel(r.k, T[lg]);
    const via = r.tunnels && r.tunnels.length ? splitName(r.tunnels[0], lg) : splitName((r.summary || "").split(",")[0], lg);
    return via ? T[lg].routeVia.replace("{r}", via) : T[lg].routeVia.replace("{r}", String.fromCharCode(65 + +r.k.slice(1)));
  }
  function routeDist(p, d) {
    const rr = p === R.pickup && d === R.dest ? realRoutes() : null;
    if (rr) return chosenRoute(rr).dist;
    const ro = routeOptions(p, d);
    if (ro.cross) { const k = R.route in TUNNELS ? R.route : ro.best; return ro.opts.find(o => o.k === k).dist; }
    const o = ro.opts.find(x => x.k === R.route);
    return o ? o.dist : ro.base;
  }
  function baseQuote(p, d, prefs) {
    const dist = Math.max(1, routeDist(p, d));
    return { dist, colour: taxiColour(p, d), meter: meterFare(dist, taxiColour(p, d)), cross: (p.area === "island") !== (d.area === "island"), prefs };
  }
  function routeLabel(k, L) { if (/^r\d$/.test(k) && R.routes && R.routes.list) { const r = R.routes.list.find(x => x.k === k); if (r) return routeName(r, L === T.en ? "en" : "zh"); } return ({ auto: L.routeAuto, cht: L.routeCHT, ehc: L.routeEHC, whc: L.routeWHC, short: L.routeShort, notoll: L.routeNoToll })[k]; }
  function renderRoute() {
    const box = $("#routeBox"); if (!box) return;
    if (!R.dest) { box.classList.add("hidden"); box.innerHTML = ""; if (R.routeLayer) { R.routeLayer.remove(); R.routeLayer = null; } return; }
    fetchRoutes();
    const col = taxiColour(R.pickup, R.dest), rr = realRoutes();
    if (rr) {
      const fastest = rr.reduce((x, y) => (y.total < x.total ? y : x)), shortest = rr.reduce((x, y) => (y.dist < x.dist ? y : x));
      if (R.route !== "auto" && !rr.find(r => r.k === R.route)) R.route = "auto";
      const dot = c => `<i class="live-dot c${c}"></i>`;
      const rowR = (k, name, sub, price, tag) => `<button class="route-opt ${R.route === k ? "active" : ""}" data-route="${k}">
        <span class="ro-name">${name}${tag ? ` <em class="ro-tag">${tag}</em>` : ""}</span><span class="ro-meta">${sub}${price ? " · ~$" + price : ""}</span></button>`;
      const sub = r => t("routeMin", { m: r.total }) + " · " + r.dist.toFixed(1) + " km" + (r.live ? " · " + dot(r.live.c) + t("routeLiveShort", { m: r.live.m }) : "");
      box.innerHTML = `<div class="route-head">${ic("pin")}<b>${t("routeTitle")}</b></div>
        ${rowR("auto", t("routeAuto"), t("routeAutoSub"), "", "")}
        ${rr.map(r => rowR(r.k, routeName(r, lang), sub(r), Math.round(meterFare(r.dist, col)), r === fastest ? t("routeFast") : (r === shortest && !R.routes.cross ? (lang === "en" ? "shortest" : "最短") : ""))).join("")}
        <p class="route-note">${R.routes.cross ? (LIVE.data ? t("routeLive") + " " : t("routeLiveOff") + " · ") + t("routeNoteX") : t("routeNoteL")}</p>`;
      box.classList.remove("hidden"); drawRoutes(); return;
    }
    const ro = routeOptions(R.pickup, R.dest);
    if (ro.cross && !(R.route === "auto" || R.route in TUNNELS)) R.route = "auto";
    if (!ro.cross && R.route in TUNNELS) R.route = "auto";
    const row = (k, sub, price, tag) => `<button class="route-opt ${R.route === k ? "active" : ""}" data-route="${k}">
        <span class="ro-name">${routeLabel(k, T[lang])}${tag ? ` <em class="ro-tag">${tag}</em>` : ""}</span>
        <span class="ro-meta">${sub}${price ? " · ~$" + price : ""}</span></button>`;
    const bestOpt = ro.cross ? ro.opts.find(o => o.k === ro.best) : null;
    const autoSub = ro.cross ? routeLabel(ro.best, T[lang]) + " · " + t("routeMin", { m: bestOpt.min }) : t("routeMin", { m: Math.round(ro.base / 0.42 + 4) });
    box.innerHTML = `<div class="route-head">${ic("pin")}<b>${t("routeTitle")}</b></div>
      ${row("auto", autoSub, Math.round(meterFare(ro.cross ? bestOpt.dist : ro.base, col)), "")}
      ${ro.opts.map(o => row(o.k, t("routeMin", { m: o.min }), Math.round(meterFare(o.dist, col)), ro.cross && o.k === ro.best ? t("routeFast") : "")).join("")}
      ${R.routes && R.routes.loading ? `<p class="route-note">${t("routeLoading")}</p>` : ""}
      <p class="route-note">${t(ro.cross ? "routeNoteX" : "routeNoteL")}</p>`;
    box.classList.remove("hidden");
  }
  function priced(q, mode, offers) {
    const items = [];
    const disc = mode === "offer" && offers.has("85");
    const dd = disc ? discountOf(q.meter, q.colour) : null;
    const meter = disc ? dd.after : q.meter;
    items.push([disc ? (dd.mode === "flat" ? "discFlat" : dd.mode === "full" ? "meter" : "disc") : "meter", meter]);
    const noSur = mode === "offer" && offers.has("nosur");
    const waived = [];
    if (q.cross) {
      items.push(["tunnel", SUR.harbourTunnel]);
      if (noSur || (mode === "offer" && offers.has("one"))) waived.push("ret"); else items.push(["ret", SUR.returnToll]);
    }
    if (noSur || (mode === "offer" && offers.has("nobook"))) waived.push("booking"); else items.push(["booking", SUR.booking]);
    const bags = q.prefs === R.prefs ? R.bags : (q.prefs.has("luggage") ? 1 : 0);
    const noLug = noSur || (mode === "offer" && offers.has("nolug")), noPet = noSur || (mode === "offer" && offers.has("nopet"));
    if (bags > 0) { if (noLug) waived.push("luggage"); else items.push(["luggage", SUR.luggage * bags]); }
    if (q.prefs.has("pet")) { if (noPet) waived.push("pet"); else items.push(["pet", SUR.pet]); }
    if (mode !== "fixed" && R.tip > 0) items.push(["tip", R.tip]);
    const extra = items.slice(1).reduce((s, i) => s + i[1], 0);
    if (mode === "fixed") { const fx = Math.round((q.meter * 1.06 + extra) / 5) * 5; return { items, extra, low: fx, high: fx, fixed: true, meter, waived: [] }; }
    return { items, extra, meter, waived, dd, low: meter * 0.95 + extra, high: meter * 1.2 + extra };
  }
  function isShortTrip() {
    if (!R.dest) return false;
    const q = baseQuote(R.pickup, R.dest, R.prefs);
    return q.meter < (DISC.floor[q.colour] || DISC.floor.red);
  }
  function offerCount() {
    let n = 6;
    if (isShortTrip() && R.tip < 5) n -= 2;
    if (R.offers.has("85")) n -= 3; if (R.offers.has("nosur")) n -= 2; if (R.offers.has("nolug")) n -= 1; if (R.offers.has("nopet")) n -= 1; if (R.offers.has("one")) n -= 1; if (R.offers.has("nobook")) n -= 1; if (R.tip >= 10) n += 1; if (R.tip >= 20) n += 1;
    if (R.prefs.has("wheelchair")) n = Math.min(n, 1); if (R.prefs.has("pet")) n -= 1;
    return Math.max(1, Math.min(6, n));
  }
  document.addEventListener("click", e => {
    const b = e.target.closest("[data-route]"); if (!b) return;
    R.route = b.dataset.route; renderRoute(); renderFareOptions(); updateQuote();
  });
  const PAY_KEYS = ["cash", "oct", "card", "fps", "alipay", "wechat", "payme", "bocpay"];
  function renderPay() {
    const box = $("#payBox"); if (!box) return;
    const N = T[lang].payNames;
    box.innerHTML = `<div class="route-head">${ic("wallet")}<b>${t("payTitle")}</b></div>
      <div class="chips small pay-chips">${PAY_KEYS.map(k => `<button class="chip ${R.pay === k ? "active" : ""}" data-pay="${k}">${N[k]}</button>`).join("")}</div>
      <p class="route-note">${t("payNote")}${R.pay === "card" ? " " + t("payCardNote") : ""}</p>`;
  }
  document.addEventListener("click", e => { const b = e.target.closest("[data-pay]"); if (!b) return; R.pay = b.dataset.pay; try { localStorage.setItem("kaifong-pay", R.pay); } catch (er) {} renderPay(); renderFareOptions(); updateQuote(); });
  function renderFareOptions() {
    const box = $("#fareOptions");
    if (!R.dest) {
      box.classList.add("hidden");
      renderSaveBox([["nosur", "oNoSur"], ["nolug", "oNoLug"], ["nopet", "oNoPet"], ["nobook", "oNoBook"], ["one", "oOne"], ["85", "o85"]]
        .map(([k, lbl]) => `<button class="chip ${R.offers.has(k) ? "active" : ""}" data-offer="${k}">${tf(lbl)}</button>`).join(""), null);
      return;
    }
    const q = baseQuote(R.pickup, R.dest, R.prefs);
    const m = priced(q, "meter", R.offers), o = priced(q, "offer", R.offers), f = priced(q, "fixed", R.offers);
    const shortTrip = q.meter < (DISC.floor[q.colour] || DISC.floor.red);
    let baseN = R.prefs.has("accessible") ? 1 : R.prefs.has("wheelchair") ? 3 : (R.prefs.has("pet") ? 4 : 6);
    if (R.pax >= 5 || R.car === "five") baseN = Math.min(baseN, 2);
    if (R.car === "boot" || R.car === "tall") baseN = Math.min(baseN, 3);
    if (R.car === "access") baseN = 1;
    if (R.bags >= 3 || R.prefs.has("stroller")) baseN = Math.max(1, baseN - 1);
    if (R.pay === "card" || R.pay === "fps") baseN = Math.max(1, baseN - 2); else if (R.pay === "payme") baseN = Math.max(1, baseN - 1);
    if (shortTrip) baseN = Math.max(1, baseN - (R.tip >= 10 ? 0 : R.tip >= 5 ? 1 : 2));
    const offerChips = [["nosur", "oNoSur"], ["nolug", "oNoLug"], ["nopet", "oNoPet"], ["nobook", "oNoBook"], ["one", "oOne"], ["85", "o85"]]
      .map(([k, lbl]) => `<button class="chip ${R.offers.has(k) ? "active" : ""}" data-offer="${k}">${tf(lbl)}</button>`).join("");
    const ddq = discountOf(q.meter, q.colour);
    const nowTxt = ddq.mode === "full" ? tf("discNowFull", { f: ddq.floor }) : ddq.mode === "flat" ? tf("discNowFlat", { f: ddq.floor }) : ddq.capped ? tf("discNowCap", { off: money(ddq.off) }) : tf("discNow", { off: money(ddq.off) });
    const ruleLine = `<span class="disc-rule">${ic("alert")}<span>${tf("discRule", { f: ddq.floor, th: ddq.threshold, m: DISC.maxOff })}${R.offers.has("85") ? " · <b>" + nowTxt + "</b>" : ""}</span></span>`;
    box.innerHTML = `
      <button class="fare-opt ${R.fareMode === "meter" ? "active" : ""}" data-mode="meter">
        <span class="fo-title">${tf("meterT")}</span><span class="fo-price">HK$${Math.round(m.low)}–${Math.round(m.high)}</span>
        <span class="fo-desc">${tf("meterD", { n: baseN })}</span></button>
      <div class="fare-opt ${R.fareMode === "offer" ? "active" : ""}" data-mode="offer" role="button" tabindex="0">
        <span class="fo-title">${tf("offerT")}</span><span class="fo-price">HK$${Math.round(o.low)}–${Math.round(o.high)}</span>
        <span class="fo-desc">${tf("offerD", { n: offerCount() })}</span>
        ${ruleLine}</div>
      ${R.car !== "any" ? `<div class="short-note car">${ic("car")}<span>${T[lang].carNote[R.car]}</span></div>` : ""}
      ${R.prefs.has("senior") ? `<div class="short-note senior">${ic("heart")}<span>${t("seniorNote")}</span></div>` : ""}
      ${shortTrip ? `<div class="short-note">${ic("clock")}<span>${t("shortNoteR", { f: DISC.floor[q.colour] || DISC.floor.red })}</span></div>` : ""}
      <div class="tip-row"><span class="tip-lbl">${tf("tipLbl")}</span>
        ${[0, 5, 10, 20].map(v => `<button class="chip ${R.tip === v ? "active" : ""}" data-tip="${v}">${v ? "$" + v : tf("tipNone")}</button>`).join("")}
        <button class="chip ${[0, 5, 10, 20].includes(R.tip) ? "" : "active"}" data-tip="custom">${[0, 5, 10, 20].includes(R.tip) ? tf("tipCustom") : "$" + R.tip}</button>
        <span class="tip-note">${tf("tipNote")}</span></div>
      <button class="fare-opt ${R.fareMode === "fixed" ? "active" : ""}" data-mode="fixed">
        <span class="fo-title">${tf("fixedT")}</span><span class="fo-price">HK$${f.low}</span>
        <span class="fo-desc">${tf("fixedD")}</span></button>`;
    if (!OFFERS) { const o = box.querySelector('[data-mode="offer"]'); if (o) o.remove(); if (R.fareMode === "offer") R.fareMode = "meter"; }
    if (!FIXED) { const f = box.querySelector('[data-mode="fixed"]'); if (f) f.remove(); if (R.fareMode === "fixed") R.fareMode = "meter"; }
    box.classList.remove("hidden");
    renderSaveBox(offerChips, q);
  }
  function renderSaveBox(chips, q) {
    if (!OFFERS) { const sb0 = $("#saveBox"); if (sb0) { sb0.innerHTML = ""; sb0.classList.add("hidden"); } R.offers.clear(); return; }
    const sb = $("#saveBox"); if (!sb) return;
    sb.innerHTML = `<div class="save-head">${ic("wallet")}<b>${tf("saveTitle")}</b></div><p class="save-sub">${tf("saveSub")}</p>
      <div class="chips small offer-chips">${chips}</div>
      ${R.offers.has("85") ? (() => { const fl = (q && DISC.floor[q.colour]) || DISC.floor.red; return `<p class="save-sub disc-line">${tf("discShort", { f: fl, th: Math.ceil(fl / DISC.rate), m: DISC.maxOff })}</p>`; })() : ""}
      ${q && !q.cross ? `<p class="save-sub">${tf("saveNoTunnel")}</p>` : ""}`;
  }
  $("#saveBox").addEventListener("click", e => {
    const chip = e.target.closest("[data-offer]"); if (!chip) return;
    const k = chip.dataset.offer; R.offers.has(k) ? R.offers.delete(k) : R.offers.add(k);
    R.fareMode = R.offers.size ? "offer" : "meter"; renderFareOptions(); updateQuote();
  });
  $("#fareOptions").addEventListener("click", e => {
    const tipB = e.target.closest("[data-tip]");
    if (tipB) {
      let v = tipB.dataset.tip;
      if (v === "custom") { const ans = prompt(tf("tipPrompt"), "30"); if (ans === null) return; v = Math.round(parseFloat(ans) || 0); }
      R.tip = Math.max(0, Math.min(TIP_MAX, +v)); renderFareOptions(); updateQuote(); return;
    }
    const chip = e.target.closest("[data-offer]");
    if (chip) { const k = chip.dataset.offer; R.offers.has(k) ? R.offers.delete(k) : R.offers.add(k); R.fareMode = "offer"; renderFareOptions(); updateQuote(); return; }
    const opt = e.target.closest("[data-mode]"); if (!opt) return;
    R.fareMode = opt.dataset.mode; renderFareOptions(); updateQuote();
  });

  function updateQuote() {
    const box = $("#quote");
    if (!R.dest) { box.classList.add("hidden"); return; }
    const q = baseQuote(R.pickup, R.dest, R.prefs), pr = priced(q, R.fareMode, R.offers), L = T[lang].items;
    const price = pr.fixed ? `HK$ ${pr.low}` : `HK$ ${Math.round(pr.low)} – ${Math.round(pr.high)}`;
    box.innerHTML = `
      <div class="fare">${price}</div>
      <div class="items">${pr.items.map(([k, v], i) => `${i ? " + " : ""}${L[k]} ${i ? "$" + v : "~$" + Math.round(v)}`).join("")} · ${q.dist.toFixed(1)} km</div>
      ${pr.waived && pr.waived.length ? `<div class="waived">${ic("check")}<span>${t("waivedLbl")}${lang === "en" ? ": " : "："}${pr.waived.map(k => L[k]).join(lang === "en" ? ", " : "、")}</span></div>` : ""}
      <div class="note">${t("quoteNote")}</div>
      <div class="preview"><div class="pv-label">${t("previewLabel")}</div>
        <div class="pv-zh">${esc(R.dest.zh)}</div><div class="pv-road">${esc(R.dest.addrZh)}${R.dest.district ? "（" + esc(R.dest.district.split(" ")[0]) + "）" : ""}</div>
        ${lang === "en" ? `<div class="pv-sub">${esc(R.dest.en)} · ${esc(R.dest.addrEn)}</div>` : ""}
        ${R.route !== "auto" ? `<div class="pv-sub"><b>${T.zh.pvRoute}：${routeLabel(R.route, T.zh)}</b>${lang === "en" ? " · " + routeLabel(R.route, T.en) : ""}</div>` : ""}
        <div class="pv-sub">${T.zh.pvPay}：${T.zh.payNames[R.pay]}${lang === "en" ? " · " + T.en.payNames[R.pay] : ""}</div>
        <div class="pv-sub">${t("stopAt")}${lang === "en" ? ": " + esc(R.pickup.en) + " · " + T.en.pickupPoints[R.point] : "：" + esc(R.pickup.zh) + " · " + T.zh.pickupPoints[R.point]}</div></div>`;
    box.classList.remove("hidden");
  }
  function updateBookBtn() {
    const b = $("#bookBtn"); b.disabled = !R.dest;
    b.textContent = R.when === "later" ? t("bookLater") : t("bookBtn");
  }
  function rcptNote(d) {
    if (d.mode === "full") return lang === "zh" ? "（未到 $" + d.floor + "，照錶）" : " (under $" + d.floor + ", full meter)";
    if (d.mode === "flat") return lang === "zh" ? "（定額 $" + d.floor + "）" : " (flat $" + d.floor + ")";
    return " − HK$" + money(d.off) + (lang === "zh" ? "（八五折" + (d.capped ? "，封頂" : "") + "）" : " (85%" + (d.capped ? ", capped" : "") + ")");
  }
  // Agree the route before the ride: the passenger's pick, or the driver's suggestion if the passenger accepts it
  function renderRouteAgree(state) {
    const box = $("#routeAgree"); if (!box) return;
    const rr = realRoutes(), name = r => routeName(r, lang) + " · " + t("routeMin", { m: r.total }) + " · ~$" + Math.round(meterFare(r.dist, taxiColour(R.pickup, R.dest)));
    if (!rr || !rr.length) { box.innerHTML = ""; box.classList.add("hidden"); return; }
    const mine = chosenRoute(rr);
    if (state === "agreed" || rr.length < 2) { box.innerHTML = `${ic("check")}<span>${R.route === "auto" ? t("routeAgreedAuto") : t("routeAgreed", { r: routeName(chosenRoute(rr), lang) })}</span>`; box.className = "route-agree done"; return; }
    // driver's choice: whatever way the driver knows best (maps miss local shortcuts), so no comparison and no off-route alert
    if (R.route === "auto") { R.driverPick = null; box.innerHTML = `${ic("check")}<span>${t("routeAgreedAuto")}</span>`; box.className = "route-agree done"; return; }
    const alt = rr.filter(r => r !== mine).reduce((x, y) => (y.total < x.total ? y : x));
    R.altRoute = alt.k;
    box.innerHTML = `<div class="ra-line">${ic("message")}<span>${t("routeSuggestBy", { r: name(alt) })}</span></div>
      <div class="ra-btns"><button class="btn btn-ghost btn-sm" data-act="routeYes">${t("routeAgreeYes")}</button><button class="btn btn-ghost btn-sm" data-act="routeKeep">${t("routeAgreeKeep")}</button></div>`;
    box.className = "route-agree";
  }
  function showMapEta(min, busy, dropAt) {
    const host = $("#riderMap"); if (!host) return;
    let el = $("#mapEta"); if (!el) { el = document.createElement("div"); el.id = "mapEta"; el.className = "map-eta"; host.appendChild(el); }
    const paint = (txt, sub) => { el.innerHTML = `<b>${txt}</b>${sub ? `<span>${sub}</span>` : ""}`; el.classList.remove("hidden"); };
    paint(t("mapEta", { m: min }), busy ? t("mapBusy") : "");
    R.timers.push(setTimeout(() => paint(t("mapEta", { m: Math.max(1, Math.round(min / 2)) }), ""), 4000));
    R.timers.push(setTimeout(() => paint(t("mapSoon"), ""), 7000));
    R.timers.push(setTimeout(() => paint(t("mapHere"), ""), 13000));
    if (R.etaLayer) { R.etaLayer.remove(); R.etaLayer = null; }
    const m = R.taxis[0];
    if (R.map && window.L && m) {
      const s = m.getLatLng(), pts = busy && dropAt ? [[s.lat, s.lng], [dropAt.lat, dropAt.lng], [R.pickup.lat, R.pickup.lng]] : [[s.lat, s.lng], [R.pickup.lat, R.pickup.lng]];
      R.etaLayer = L.layerGroup().addTo(R.map);
      L.polyline(pts, { color: "#111", weight: 4, opacity: .7, dashArray: "4 8" }).addTo(R.etaLayer);
      if (busy && dropAt) L.marker([dropAt.lat, dropAt.lng], { icon: L.divIcon({ className: "", html: `<div class="drop-flag">${t("dropFlag")}</div>`, iconSize: [56, 24], iconAnchor: [28, 24] }) }).addTo(R.etaLayer);
      try { R.map.fitBounds(L.latLngBounds(pts), { padding: [40, 40], maxZoom: 16 }); } catch (e) {}
    }
  }
  function hideMapEta() { const el = $("#mapEta"); if (el) el.classList.add("hidden"); if (R.etaLayer) { R.etaLayer.remove(); R.etaLayer = null; } }
  function riderStep(name) {
    if (name !== "matched") hideMapEta(); $$("#riderSheet .step").forEach(s => s.classList.toggle("active", s.dataset.step === name)); }

  $("#bookBtn").addEventListener("click", () => {
    riderStep("search");
    const n = R.fareMode === "offer" ? offerCount() : (R.fareMode === "fixed" ? 1 : 5);
    let s = 0;
    const tick = () => { $("#searchSub").textContent = t("sent", { n, t: mmss(s++) }); };
    tick(); R.timers.push(setInterval(tick, 1000));
    R.timers.push(setTimeout(matched, 4200));
  });

  function matched() {
    clearRiderTimers(); riderStep("matched");
    const later = R.when === "later", badge = $("#schedBadge");
    if (later) {
      const d = new Date($("#whenInput").value);
      badge.textContent = t("schedBadge", { d: d.toLocaleString(lang === "zh" ? "zh-HK" : "en-HK", { weekday: "short", month: "short", day: "numeric", hour: "2-digit", minute: "2-digit" }) });
      badge.classList.remove("hidden");
    } else badge.classList.add("hidden");
    $("#matchedTitle").textContent = later ? t("matchedLater") : t("matchedNow");
    const q = baseQuote(R.pickup, R.dest, R.prefs), pr = priced(q, R.fareMode, R.offers), L = T[lang].items;
    $("#offerSummary").textContent = pr.fixed ? tf("fixedT") + " HK$" + pr.low : pr.items.map(([k]) => L[k]).join(" · ");
    renderRouteAgree();
    let left = 180;
    const btn = $("#cancelMatchedBtn");
    const tickCancel = () => { btn.textContent = left > 0 ? t("cancelWithin", { t: mmss(left) }) : t("cancelLate"); left--; };
    tickCancel(); R.timers.push(setInterval(tickCancel, 1000));
    let a = 3, b = 5;
    if (R.ready) { $("#etaLine").textContent = t("etaReady", { x: R.ready }); } else $("#etaLine").textContent = t("eta", { a, b });
    $("#riderChatLog").innerHTML = ""; R.chatN = 0; $("#phraseBox").classList.add("hidden");
    const banner = $("#arriveBanner"); banner.classList.add("hidden");
    R.timers.push(setTimeout(() => { banner.innerHTML = ic("clock") + `<span>${t("almost")}</span>`; banner.className = "arrive-banner"; }, 7000));
    R.timers.push(setTimeout(() => { banner.innerHTML = ic("check") + `<span>${t("arrivedBanner")}</span>`; banner.className = "arrive-banner done"; }, 13000));
    R.matchN = (R.matchN || 0) + 1;
    const busy = R.matchN % 2 === 1 && !later;
    const dropAt = busy ? PLACES.filter(x => x.id !== R.pickup.id && x.id !== (R.dest && R.dest.id)).sort((x, y) => km(x, R.pickup) - km(y, R.pickup))[0] : null;
    const etaMin = R.ready ? Math.max(R.ready, busy ? 9 : 0) : busy ? 9 : 4;
    if (busy) $("#etaLine").textContent = t("etaBusy", { p: lang === "en" ? dropAt.en : dropAt.zh, m: etaMin });
    showMapEta(etaMin, busy, dropAt);
    const m = R.taxis[0]; if (m) {
      const start = m.getLatLng(); let k = 0;
      R.timers.push(setInterval(() => {
        k = Math.min(1, k + 0.08);
        m.setLatLng([start.lat + (R.pickup.lat - start.lat) * k, start.lng + (R.pickup.lng - start.lng) * k]);
        if (k > 0.5 && a !== 1 && !R.ready) { a = 1; b = 3; $("#etaLine").textContent = t("eta", { a, b }); }
      }, 700));
    }
  }

  $("#riderSheet").addEventListener("click", e => {
    const act = e.target.closest("[data-act]"); if (!act) return;
    switch (act.dataset.act) {
      case "cancelSearch": case "cancelMatched": clearRiderTimers(); riderStep("plan"); break;
      case "call": toast(t("callToast")); break;
      case "comingDown": toast(t("comingDownToast")); break;
      case "moreTime": toast(t("moreTimeToast")); break;
      case "phrases": {
        const box = $("#phraseBox"); box.classList.toggle("hidden");
        $("#riderQuick").innerHTML = T[lang].phrases.map((p, i) => `<button class="chip" data-phrase="${i}">${p}</button>`).join("");
        $("#riderMsg").placeholder = t("msgPh");
        break;
      }
      case "arrive": {
        clearRiderTimers(); riderStep("arrived");
        $("#view-rider [data-t=grace]").textContent = R.prefs.has("senior") ? t("graceSenior") : t("grace");
        let s = 0; $("#waitTimer").textContent = "0:00";
        R.timers.push(setInterval(() => { $("#waitTimer").textContent = mmss(++s); }, 1000));
        break;
      }
      case "startTrip": {
        clearRiderTimers(); riderStep("done");
        const q = baseQuote(R.pickup, R.dest || byId("qmh"), R.prefs), pr = priced(q, R.fareMode, R.offers), L = T[lang].items;
        let rows, total;
        if (pr.fixed) { rows = `<div class="row"><span>${tf("fixedT")}</span><span>HK$${pr.low}</span></div>`; total = pr.low; }
        else {
          const meterReading = Math.round(q.meter * 1.08 * 2) / 2, disc = R.fareMode === "offer" && R.offers.has("85");
          const rd = disc ? discountOf(meterReading, q.colour) : null;
          const meterPart = disc ? rd.after : meterReading;
          rows = `<div class="row"><span>${t("receiptMeter")} HK$${money(meterReading)}${disc ? rcptNote(rd) : ""}</span><span>HK$${money(meterPart)}</span></div>` +
            pr.items.slice(1).map(([k, v]) => `<div class="row"><span>${L[k]}</span><span>HK$${v}</span></div>`).join("");
          total = meterPart + pr.extra;
        }
        $("#receipt").innerHTML = rows + `<div class="row total"><span>${t("total")}</span><span>HK$${money(total)}</span></div>`;
        {
          const N = T[lang].payNames, k = R.pay, code = D.codes && D.codes[k];
          let how;
          if (k === "fps") how = `<div class="pn-how">${t("payNowFps")}</div>${code ? `<button class="pay-to" data-copy="${esc(code)}"><b>${esc(code)}</b><span>${t("copyDone").replace(/.+/, lang === "en" ? "tap to copy" : "撳一下複製")}</span></button>` : ""}`;
          else if (["wechat", "alipay", "payme", "bocpay"].includes(k)) how = code ? `<div class="pn-how">${t("payNowQRsaved", { p: N[k] })}</div><img class="pn-qr" src="${code}" alt="QR">` : `<div class="pn-how">${t("payNowQR", { p: N[k] })}</div>`;
          else how = `<div class="pn-how">${t(k === "oct" ? "payNowOct" : k === "card" ? "payNowCard" : "payNowCash")}</div>`;
          $("#receipt").insertAdjacentHTML("afterbegin", `<div class="pay-now"><div class="pn-top"><span>${ic("wallet")}${t("payNowTitle")}</span><b>HK$${money(total)}</b></div>${how}<div class="pn-same">${ic("check")}${t("payNowSame")}</div></div>`);
        }
        SPENT.extra.push(Math.round(total));
        if (!pr.fixed && R.fareMode === "offer") { const base = priced(q, "meter", new Set()); SPENT.saved += Math.max(0, Math.round((base.low + base.high) / 2 - (pr.low + pr.high) / 2)); }
        renderPanels();
        break;
      }
      case "fareOk": toast(t("fareOkToast")); break;
      case "sendNote": { const v = $("#riderNote").value.trim(); toast(v ? t("noteSent") : t("thanksRate")); $("#riderNote").value = ""; break; }
      case "fareBad": toast(t("fareBadToast")); break;
      case "routeYes": R.route = R.altRoute || R.route; renderRouteAgree("agreed"); drawRoutes(); break;
      case "routeKeep": renderRouteAgree("agreed"); break;
      case "routeFast": toast(t("routeAskedFast")); renderRouteAgree("agreed"); break;
      case "restartRider": AFTER.rider = null; renderAfter(); riderStep("plan"); R.dest = null; R.route = "auto"; R.driverPick = null; renderRoute(); $("#destInput").value = ""; R.offers.clear(); R.fareMode = "meter"; R.tip = 0; renderFareOptions(); updateQuote(); updateBookBtn(); spawnTaxis(); break;
    }
  });
  // ---- live translation (demo: free MyMemory service; the real app would use a translation API with proper privacy terms)
  const trCache = new Map();
  const LANG_CODE = { "lang-id": "id", "lang-tl": "tl", "lang-ur": "ur", "lang-ne": "ne", "lang-hi": "hi" };
  const LANG_NAME = { en: "English", id: "Bahasa Indonesia", tl: "Tagalog", ur: "اردو", ne: "नेपाली", hi: "हिन्दी" };
  const hasCJK = s => /[\u3400-\u9fff]/.test(s);
  function riderLangCode() { for (const k in LANG_CODE) if (R.prefs.has(k)) return LANG_CODE[k]; return "en"; }
  async function translate(text, from, to) {
    const key = from + "|" + to + "|" + text; if (trCache.has(key)) return trCache.get(key);
    const ctrl = new AbortController(); const tm = setTimeout(() => ctrl.abort(), 6000);
    try {
      const r = await fetch("https://api.mymemory.translated.net/get?q=" + encodeURIComponent(text) + "&langpair=" + from + "|" + to, { signal: ctrl.signal });
      const j = await r.json(); const out = j && j.responseData && j.responseData.translatedText;
      if (out) trCache.set(key, out); return out || null;
    } catch (e) { return null; } finally { clearTimeout(tm); }
  }
  function livePreview(input, box, makeLine, fromFn, toFn) {
    let deb, seq = 0;
    input.addEventListener("input", () => {
      const v = input.value.trim(), my = ++seq; clearTimeout(deb);
      if (!v) { box.textContent = ""; return; }
      const from = fromFn(v), to = toFn(v); if (from === to) { box.textContent = ""; return; }
      box.textContent = t("trWorking");
      deb = setTimeout(async () => { const out = await translate(v, from, to); if (my === seq) box.innerHTML = out ? makeLine(out) + `<small>${t("trDemo")}</small>` : ""; }, 500);
    });
  }

  // ---- voice input (browser speech recognition): speak -> text -> translate -> read aloud
  const SR = window.SpeechRecognition || window.webkitSpeechRecognition;
  const SR_LANG = { en: "en-US", id: "id-ID", tl: "fil-PH", ur: "ur-PK", ne: "ne-NP", hi: "hi-IN" };
  function dictate(btn, input, langFn, onDone) {
    btn.innerHTML = ic("mic");
    btn.addEventListener("click", () => {
      if (!SR) { toast(t("micUnsupported")); return; }
      if (btn._rec) { btn._rec.stop(); return; }
      const rec = new SR(); rec.lang = langFn(); rec.interimResults = true; rec.maxAlternatives = 1;
      btn._rec = rec; btn.classList.add("on"); toast(t("micListening"));
      rec.onresult = e => { input.value = Array.from(e.results).map(r => r[0].transcript).join(""); input.dispatchEvent(new Event("input")); };
      rec.onerror = e => { if (e.error === "not-allowed") toast(t("micDenied")); };
      rec.onend = () => { btn.classList.remove("on"); btn._rec = null; if (input.value.trim()) onDone(); };
      try { rec.start(); } catch (err) { btn.classList.remove("on"); btn._rec = null; }
    });
  }

  // ---- chat (simulated): passenger <-> driver, quick phrases pre-translated, driver hears messages in Cantonese
  function chatAdd(logSel, who, text, opts = {}) {
    const log = $(logSel); if (!log) return;
    const div = document.createElement("div");
    div.className = "msg " + who;
    div.innerHTML = `<div class="bubble">${esc(text)}</div>` + (opts.orig ? `<div class="msg-meta">${t("translatedTag")} · ${esc(opts.orig)}</div>` : "") + (opts.meta ? `<div class="msg-meta">${esc(opts.meta)}</div>` : "");
    log.appendChild(div); log.scrollTop = log.scrollHeight;
  }
  function riderSendText(zhText, shownText) {
    chatAdd("#riderChatLog", "me", shownText || zhText, lang === "en" && shownText && shownText !== zhText ? { meta: "→ " + zhText } : {});
    R.timers.push(setTimeout(() => {
      const reply = R.chatN++ ? T.zh.driverAuto2 : T.zh.driverAuto;
      if (lang === "zh") chatAdd("#riderChatLog", "them", reply);
      else chatAdd("#riderChatLog", "them", DRIVER_EN[reply] || reply, { orig: reply });
    }, 1800));
  }
  $("#phraseBox").addEventListener("click", e => {
    const b = e.target.closest("[data-phrase]"); if (!b) return;
    const i = +b.dataset.phrase;
    riderSendText(T.zh.phrases[i], lang === "zh" ? T.zh.phrases[i] : T.en.phrases[i]);
  });
  async function riderSendTyped() {
    const inp = $("#riderMsg"), v = inp.value.trim(); if (!v) return;
    inp.value = ""; $("#riderTrPrev").textContent = "";
    if (hasCJK(v)) { riderSendText(v, v); speak("乘客訊息：" + v); return; }
    const src = riderLangCode(), zh = await translate(v, src, "zh-TW");
    chatAdd("#riderChatLog", "me", v, zh ? { meta: t("trSentR", { x: zh }) } : {});
    if (zh) speak("乘客訊息：" + zh);
    R.timers.push(setTimeout(async () => {
      const reply = R.chatN++ ? T.zh.driverAuto2 : T.zh.driverAuto;
      const back = src === "en" && DRIVER_EN[reply] ? DRIVER_EN[reply] : await translate(reply, "zh-TW", src);
      chatAdd("#riderChatLog", "them", back || reply, back ? { orig: reply } : {});
      if (back) speakIn(back, src);
    }, 1800));
  }
  $("#riderSend").addEventListener("click", riderSendTyped);
  dictate($("#riderMic"), $("#riderMsg"), () => (lang === "zh" && riderLangCode() === "en" && !Object.keys(LANG_CODE).some(k => R.prefs.has(k)) ? "yue-Hant-HK" : SR_LANG[riderLangCode()]), () => riderSendTyped());
  livePreview($("#riderMsg"), $("#riderTrPrev"), x => t("trPrevR", { x: esc(x) }), v => (hasCJK(v) ? "zh-TW" : riderLangCode()), () => "zh-TW");
  $("#riderMsg").addEventListener("keydown", e => { if (e.key === "Enter") riderSendTyped(); });

  function renderNotes() {
    const rt = $("#riderThanks"); if (rt) rt.innerHTML = T[lang].quickThanks.map(q => `<button class="chip" data-qt="${esc(q)}">${q}</button>`).join("");
    const rn = $("#riderNote"); if (rn) rn.placeholder = t("notePh");
    const dn = $("#driverNote"); if (dn) dn.placeholder = t("notePhD");
    const ti = $("#thanksIn"); if (ti) ti.innerHTML = ic("heart") + `<span>${t("thanksInTxt")}</span>`;
  }
  document.addEventListener("click", e => {
    const q = e.target.closest("[data-qt]"); if (!q) return;
    const inp = $("#riderNote"); inp.value = (inp.value ? inp.value + " " : "") + q.dataset.qt; q.classList.add("active");
  });
  function renderStars(sel, who) {
    const box = $(sel); if (!box) return;
    const tagBox = who === "rider" ? $("#riderTags") : $("#driverTags");
    const showTags = n => {
      const L = T[lang], tags = who === "rider" ? (n >= 4 ? L.rateTagsGood : L.rateTagsBad) : (n >= 4 ? L.riderTagsGood : L.riderTagsBad);
      if (!tagBox) return;
      tagBox.innerHTML = `<span class="rate-hint">${t("rateHint")}</span>` + tags.map(x => `<button class="chip">${x}</button>`).join("");
      $$(".chip", tagBox).forEach(c => c.onclick = () => c.classList.toggle("active"));
    };
    box.innerHTML = T[lang].stars.map(([label, n]) => `<button data-n="${n}">${n}★<small>${label}</small></button>`).join("");
    showTags(5);
    box.onclick = e => {
      const b = e.target.closest("button"); if (!b) return;
      $$("button", box).forEach(x => x.classList.toggle("active", x === b));
      showTags(+b.dataset.n);
      toast(t("thanksRate"));
    };
  }

  // ================================================================ driver
  const D = { online: false, shift: false, timers: [], n: 0, job: null };
  function stopDriverTimers() { D.timers.forEach(clearInterval); D.timers.forEach(clearTimeout); D.timers = []; }
  function dstep(name) { $$("#view-driver .dstep").forEach(s => s.classList.toggle("active", s.dataset.dstep === name)); }
  // 交更地點: the driver types any place; passengers only see the district
  D.shiftTo = null;
  function shiftAreaName() { const p = D.shiftTo || PLACES.find(x => x.zh === $("#shiftArea").dataset.place) || byId("kt"); return p ? (p.district ? p.district.split(" ")[0] : p.zh) : ""; }
  function updateDriverStatus() {
    $("#driverStatus").textContent = !D.online ? t("statusOff") : (D.shift ? t("statusShift", { time: $("#shiftTime").value, area: shiftAreaName() }) : t("statusOn"));
    $("#idleMsg").textContent = D.online ? t("idleOn") : t("idleOff");
    const b = $("#onlineBtn"); b.textContent = D.online ? t("goOffline") : t("goOnline"); b.classList.toggle("on", D.online);
    $("#shiftToggle").textContent = D.shift ? t("shiftOff") : t("shiftOn"); $("#shiftToggle").classList.toggle("on", D.shift);
  }
  $("#onlineBtn").addEventListener("click", () => {
    D.online = !D.online; stopDriverTimers(); dstep("idle"); updateDriverStatus();
    if (D.online) D.timers.push(setTimeout(showOffer, 2500));
  });
  $("#shiftBtn").addEventListener("click", () => $("#shiftPanel").classList.toggle("hidden"));
  $("#shiftToggle").addEventListener("click", () => {
    D.shift = !D.shift; updateDriverStatus();
    if (D.online) { stopDriverTimers(); dstep("idle"); D.timers.push(setTimeout(showOffer, 2000)); }
  });
  $("#shiftTime").addEventListener("change", updateDriverStatus);
  attachSearch($("#shiftArea"), $("#shiftAreaResults"), p => { D.shiftTo = p; $("#shiftArea").value = `${p.zh} · ${p.en}`; $("#shiftArea").dataset.place = p.zh; updateDriverStatus(); });

  D.accept = new Set(PAY_KEYS);
  D.navApp = "google";
  D.codes = { fps: "DEMO-1234", wechat: null, alipay: null, payme: null, bocpay: null };
  const CODE_KEYS = ["fps", "wechat", "alipay", "payme"];
  document.addEventListener("change", e => {
    const f = e.target.closest("[data-qrfile]"); if (!f || !f.files || !f.files[0]) return;
    const k = f.dataset.qrfile, rd = new FileReader();
    rd.onload = () => { D.codes[k] = rd.result; renderPayAccept(); }; rd.readAsDataURL(f.files[0]);
  });
  document.addEventListener("input", e => { if (e.target.id === "fpsInput") { D.codes.fps = e.target.value.trim(); if (typeof saveDriver === "function") saveDriver(); } });
  function showPayCode(k, amount) {
    const N = T[lang].payNames, el = $("#payShow");
    const body = k === "fps" ? `<div class="ps-fps">${esc(D.codes.fps)}</div>` : `<img src="${D.codes[k]}" alt="${N[k]} QR">`;
    el.innerHTML = `<div class="ps-card"><div class="ps-amt">${t("codeFor", { v: money(amount), p: N[k] })}</div>${body}<div class="ps-who">${esc(T[lang].driverChan)}</div><button class="btn btn-primary btn-block" data-act="closeCode">${t("codeClose")}</button></div>`;
    el.classList.remove("hidden");
  }
  function navUrl(to, via) {
    if (D.navApp === "amap") return `https://uri.amap.com/navigation?to=${to.lng},${to.lat},${encodeURIComponent(to.zh || "")}${via ? `&via=${via[0]},${via[1]}` : ""}&mode=car&coordinate=wgs84&callnative=1`;
    return `https://www.google.com/maps/dir/?api=1&destination=${to.lat},${to.lng}${via ? `&waypoints=${via[1]},${via[0]}` : ""}&travelmode=driving`;
  }
  document.addEventListener("click", e => { const b = e.target.closest("[data-navapp]"); if (!b) return; D.navApp = b.dataset.navapp; renderPayAccept(); });
  D.avoid = new Set(); D.radius = 3; D.car = new Set(["boot"]);
  try {
    const s = JSON.parse(localStorage.getItem("kaifong-driver") || "null");
    if (s) {
      if (s.accept) D.accept = new Set(s.accept); if (s.avoid) D.avoid = new Set(s.avoid.filter(k => ["disc", "pet", "bags", "sched"].includes(k))); if (s.car) D.car = new Set(s.car);
      if (s.radius) D.radius = s.radius; if (s.navApp) D.navApp = s.navApp; if (s.codes) Object.assign(D.codes, s.codes);
    }
  } catch (e) {}
  function saveDriver() {
    const data = { accept: [...D.accept], avoid: [...D.avoid], car: [...D.car], radius: D.radius, navApp: D.navApp, codes: D.codes };
    try { localStorage.setItem("kaifong-driver", JSON.stringify(data)); }
    catch (e) { try { data.codes = { fps: D.codes.fps }; localStorage.setItem("kaifong-driver", JSON.stringify(data)); } catch (e2) {} }
  }
  document.addEventListener("click", e => {
    const r = e.target.closest("[data-radius]"); if (r) { D.radius = +r.dataset.radius; renderPayAccept(); return; }
    const c = e.target.closest("[data-mycar]"); if (c) { const k = c.dataset.mycar; D.car.has(k) ? D.car.delete(k) : D.car.add(k); renderPayAccept(); }
  });
  function renderPayAccept() {
    if (typeof saveDriver === "function") saveDriver();
    const box = $("#payAccept"); if (!box) return;
    const N = T[lang].payNames, A = T[lang].avoidNames;
    box.innerHTML = `<div class="route-head">${ic("alert")}<b>${t("avoidTitle")}</b></div>
      <div class="chips small">${Object.keys(A).filter(k => OFFERS || k !== "disc").map(k => `<button class="chip ${D.avoid.has(k) ? "off" : "active"}" data-avoid="${k}" aria-pressed="${!D.avoid.has(k)}">${A[k]}</button>`).join("")}</div>
      <p class="route-note">${t("zoneNote")} ${t("avoidNote")}</p>
      <div class="route-head">${ic("pin")}<b>${t("radiusTitle")}</b></div>
      <div class="chips small">${[1, 2, 3].map(k => `<button class="chip ${D.radius === k ? "active" : ""}" data-radius="${k}">${t("radiusOpt", { k })}</button>`).join("")}</div>`;
    const pf = $("#driverProfile");
    if (pf) pf.innerHTML = `<div class="route-head">${ic("user")}<b>${t("profTitle")}</b></div><p class="route-note">${t("profNote")}</p>
      <div class="route-head">${ic("car")}<b>${t("carMineTitle")}</b></div>
      <div class="chips small">${Object.keys(T[lang].carMine).map(k => `<button class="chip ${D.car.has(k) ? "active" : ""}" data-mycar="${k}">${T[lang].carMine[k]}</button>`).join("")}</div>
      <p class="route-note">${t("carMineNote")}</p>
      <div class="route-head">${ic("wallet")}<b>${t("payAcceptTitle")}</b></div>
      <div class="chips small">${PAY_KEYS.map(k => `<button class="chip ${D.accept.has(k) ? "active" : "off"}" data-accept="${k}" ${k === "cash" ? "disabled" : ""}>${N[k]}</button>`).join("")}</div>
      <p class="route-note">${t("payAcceptNote")}</p>
      <div class="route-head">${ic("wallet")}<b>${t("codesTitle")}</b></div>
      <p class="route-note">${t("codesNote")}</p>
      <div class="code-rows">
        <label class="code-row"><span>${N.fps}</span><input id="fpsInput" type="text" inputmode="numeric" value="${esc(D.codes.fps || "")}" placeholder="${t("fpsPh")}"></label>
        ${["wechat", "alipay", "payme", "bocpay"].map(k => `<label class="code-row"><span>${N[k]}</span><span class="code-up">${D.codes[k] ? `<img src="${D.codes[k]}" alt="">` : ""}<span class="chip">${D.codes[k] ? t("qrChange") : t("qrUpload")}</span><input type="file" accept="image/*" data-qrfile="${k}" hidden></span></label>`).join("")}
      </div>
      <div class="route-head">${ic("nav")}<b>${t("navAppTitle")}</b></div>
      <div class="chips small">${Object.keys(T[lang].navApps).map(k => `<button class="chip ${D.navApp === k ? "active" : ""}" data-navapp="${k}">${T[lang].navApps[k]}</button>`).join("")}</div>`;

  }
  document.addEventListener("click", e => { const b = e.target.closest("[data-avoid]"); if (!b) return; const k = b.dataset.avoid; D.avoid.has(k) ? D.avoid.delete(k) : D.avoid.add(k); renderPayAccept(); });
  const PAY_QR = ["alipay", "wechat", "payme", "bocpay"], PAY_NONQR = ["oct", "fps", "card"];
  document.addEventListener("click", e => {
    const b = e.target.closest("[data-accept]"); if (!b || b.dataset.accept === "cash") return;
    const k = b.dataset.accept;
    if (D.accept.has(k)) {
      const grp = PAY_QR.includes(k) ? PAY_QR : PAY_NONQR;
      if (grp.filter(x => x !== k && D.accept.has(x)).length === 0) { toast(t("payMinRule")); return; }
      D.accept.delete(k);
    } else D.accept.add(k);
    renderPayAccept();
  });
  // Near the drop-off: say how the passenger pays, and line up nearby jobs so there's no empty drive back
  function arrivingSoon() {
    const j = D.job; if (!j) return;
    const N = T[lang].payNames, payK = j.pay || "oct";
    const near = PLACES.filter(x => x.id !== j.to.id && km(x, j.to) < 6).sort((a, b) => km(a, j.to) - km(b, j.to)).slice(0, 2);
    const items = near.map(x => { const others = PLACES.filter(y => y.id !== x.id && y.id !== j.to.id); const dest = others[(x.lat * 1000 | 0) % others.length]; const qq = baseQuote(x, dest, new Set()); const gap = 3 + Math.round(km(j.to, x) * 1.4 / 0.35), wait = [10, 15, 20][(x.lng * 1000 | 0) % 3]; return { from: x, to: dest, fare: Math.round(qq.meter + (qq.cross ? 50 : 0)), gap, wait }; }).filter(it => it.gap <= it.wait);
    D.nearby = items;
    const box = $("#tripSoon");
    box.innerHTML = `<div class="ts-head">${ic("clock")}<b>${t("soonTitle")}</b></div>
      <div class="ts-pay">${ic("wallet")}<span>${t("soonPay", { p: N[payK] })}${j.offer === "85" ? " · " + t("soonPayDisc") : ""}</span></div>
      <div class="ts-prep">${(() => { const P = T[lang].soonPrep; if (["oct", "card", "cash"].includes(payK)) return P[payK]; return D.codes && D.codes[payK] ? P.code : P.nocode.replace("{p}", N[payK]); })()}</div>
      ${items.length ? `<div class="ts-next"><b>${t("soonNext", { n: items.length })}</b>${items.map((it, i) => `<button class="ts-job" data-act="takeNext" data-i="${i}"><span class="tj-main"><b>${esc(lang === "en" ? it.from.en : it.from.zh)} → ${esc(lang === "en" ? it.to.en : it.to.zh)}</b><small>${t("soonGap", { m: it.gap, w: it.wait })}</small></span><span class="tj-side">~$${it.fare}<em>${t("soonTake")}</em></span></button>`).join("")}
        <button class="btn btn-ghost btn-sm" data-act="holdNext">${t("soonHold")}</button></div>` : ""}`;
    box.classList.remove("hidden");
    speak("就快到喇。乘客用" + T.zh.payNames[payK] + "俾錢，" + (["oct", "card", "cash"].includes(payK) ? T.zh.soonPrep[payK] : D.codes && D.codes[payK] ? T.zh.soonPrep.code : T.zh.soonPrep.nocode.replace("{p}", T.zh.payNames[payK])) + "。" + (j.offer === "85" ? "記得八五折。" : "") + (items.length ? "落客附近有" + items.length + "張新單，" + items.map(it => it.from.zh + "去" + it.to.zh).join("；") + "。" : ""));
  }
  const jobAvoided = j => {
    const cross = (j.from.area === "island") !== (j.to.area === "island") && j.from.area !== "lantau" && j.to.area !== "lantau";
    if (!D.accept.has(j.pay || "oct")) return true;
    if (!canServe(D.colour || "red", j.from, j.to)) return true;
    const pickKm = j.short ? 0.4 : 1.2;
    if (pickKm > D.radius) return true;
    if (D.avoid.has("disc") && j.offer === "85") return true;
    if (D.avoid.has("pet") && j.pet) return true;
    if (D.avoid.has("bags") && j.needs && /行李 [3-9]|[3-9] 件/.test(j.needs.zh.join(" "))) return true;
    if (D.avoid.has("sched") && j.sched) return true;
    if (j.carNeed && !D.car.has(j.carNeed)) return true;
    return false;
  };
  function prefillAddons(j) {
    const q = baseQuote(j.from, j.to, new Set()), noSur = j.offer === "nosur";
    const bagsM = j.needs && j.needs.zh.join(" ").match(/行李 (\d)/);
    D.add = { bags: bagsM ? +bagsM[1] : 1, pet: j.pet ? 1 : 0, tunnel: q.cross ? 1 : 0, ret: q.cross && !noSur && j.offer !== "one" ? 1 : 0, booking: noSur || j.offer === "nobook" ? 0 : 1, tip: 0,
      waived: noSur ? ["bags", "pet", "ret", "booking"] : [] };
    D.agreed = Object.assign({}, D.add);
  }
  function addonItems() {
    const a = D.add || {}, w = a.waived || [], items = [];
    if (a.tunnel) items.push(["tunnel", SUR.harbourTunnel]);
    if (a.ret) items.push(["ret", SUR.returnToll]);
    if (a.booking) items.push(["booking", SUR.booking]);
    if (a.bags && !w.includes("bags")) items.push(["luggage", SUR.luggage * a.bags]);
    if (a.pet && !w.includes("pet")) items.push(["pet", SUR.pet]);
    if (a.tip) items.push(["tip", a.tip]);
    return items;
  }
  function renderAddons() {
    const box = $("#addonBox"); if (!box || !D.add) return;
    const a = D.add, N = T[lang].addNames, w = a.waived || [];
    const g = D.agreed || {}, chg = k => a[k] !== g[k];
    const tog = k => `<button class="chip ${a[k] ? "active" : "off"} ${chg(k) ? "changed" : ""}" data-addtog="${k}" ${w.includes(k) ? "disabled" : ""}>${N[k]} $${k === "tunnel" ? SUR.harbourTunnel : k === "ret" ? SUR.returnToll : k === "booking" ? SUR.booking : SUR.pet}</button>`;
    const anyChg = ["bags", "pet", "tunnel", "ret", "booking"].some(chg);
    box.innerHTML = `<div class="route-head">${ic("coins")}<b>${t("addTitle")}</b></div>
      <div class="add-row"><span>${N.bags} <small>${t("addEach", { x: SUR.luggage })}${w.includes("bags") ? " · " + t("addWaived") : ""}</small></span>
        <span class="stepper ${chg("bags") ? "changed" : ""}"><button class="chip" data-addstep="-1" aria-label="−">−</button><b>${a.bags}</b><button class="chip" data-addstep="1" aria-label="+">+</button></span></div>
      <div class="chips small">${tog("tunnel")}${tog("ret")}${tog("booking")}${tog("pet")}</div>
      <p class="route-note ${anyChg ? "add-warn" : ""}">${anyChg ? ic("alert") + t("addChanged") : ic("check") + t("addAgreed") + (w.length ? " · " + t("addLocked") : "")}</p>
      <div class="add-row"><span>${N.tip}</span><span class="chips small">${[0, 5, 10, 20].map(v => `<button class="chip ${a.tip === v ? "active" : ""}" data-addtip="${v}">${v ? "$" + v : "—"}</button>`).join("")}</span></div>`;
  }
  function refreshCalc() { const mi = $("#meterInput"); if (mi) mi.dispatchEvent(new Event("input", { bubbles: true })); }
  document.addEventListener("click", e => {
    const s = e.target.closest("[data-addstep]"), g = e.target.closest("[data-addtog]"), p = e.target.closest("[data-addtip]");
    if (!s && !g && !p) return;
    if (s) { if ((D.add.waived || []).includes("bags")) { toast(t("addLocked")); return; } D.add.bags = Math.max(0, Math.min(9, D.add.bags + +s.dataset.addstep)); }
    if (g) { const k = g.dataset.addtog; if ((D.add.waived || []).includes(k)) { toast(t("addLocked")); return; } D.add[k] = D.add[k] ? 0 : 1; }
    if (p) D.add.tip = +p.dataset.addtip;
    renderAddons(); refreshCalc();
  });
  document.addEventListener("click", e => { const c = e.target.closest("[data-copy]"); if (!c) return; try { navigator.clipboard.writeText(c.dataset.copy); } catch (er) {} toast(t("copyDone")); });
  document.addEventListener("click", e => { if (e.target.closest("[data-act=closeCode]") || e.target.id === "payShow") $("#payShow").classList.add("hidden"); });
  function finalPay(v) {
    const j = D.job; if (!j || !(v > 0)) return null;
    const disc = j.offer === "85";
    const vd = disc ? discountOf(v, taxiColour(j.from, j.to)) : null, meterPart = disc ? vd.after : v;
    const items = addonItems(), extra = items.reduce((s, i) => s + i[1], 0);
    return { total: meterPart + extra, meterPart, vd, items };
  }
  document.addEventListener("input", e => {
    if (e.target.id !== "meterInput") return;
    const box = $("#meterCalc"), j = D.job, f = finalPay(parseFloat(e.target.value));
    if (!box) return;
    if (!f) { box.classList.add("hidden"); return; }
    const L = T[lang].items, N = T[lang].payNames;
    box.innerHTML = `<div class="mc-top"><span>${t("calcTitle")}</span><b>HK$${money(f.total)}</b></div>
      ${D.codes[j.pay] ? `<button class="btn btn-ghost btn-sm show-code" data-act="showCode">${ic("wallet")}<span>${t("showCode", { p: N[j.pay] })}</span></button>` : ""}
      <div class="mc-sub">${t("calcBy", { p: N[j.pay || "oct"] })} · ${t("calcLine", { m: money(parseFloat(e.target.value)), d: f.vd ? rcptNote(f.vd) : "", x: f.items.map(([k, v]) => L[k] + " $" + v).join(" + ") || "0" })}</div>`;
    box.classList.remove("hidden");
  });
  function nextJob() {
    let j = null;
    for (let i = 0; i < 4; i++) { const c = nextJobRaw(); if (!jobAvoided(c)) { j = c; break; } }
    j = j || nextJobRaw();
    if (!OFFERS) j.offer = "none";
    return j;
  }
  function nextJobRaw() {
    D.n++;
    if (D.shift) return { from: byId("ts"), to: D.shiftTo || PLACES.find(p => p.zh === $("#shiftArea").dataset.place) || byId("kt"), offer: "none", wait: "0:40", ready: true, shift: true };
    const k = D.n % 4;
    if (k === 1) return { from: byId("ts"), to: byId("pp"), offer: "none", wait: "0:30", ready: true, short: true, deaf: true, pay: "wechat" };
    if (k === 2) return { from: byId("ts"), to: byId("qmh"), offer: "none", wait: "1:20", ready: true, senior: true, pay: "cash",
      needs: { zh: ["2 人", "有長者", "用拐杖", "會暈車浪"], en: ["2 people", "With an elderly person", "Walking aid", "Motion sickness, drive gently"] } };
    if (k === 3) return { from: byId("hc"), to: byId("pp"), offer: "nosur", wait: "0:50", ready: true, pass: true, route: "whc", pay: "alipay" };
    return { from: byId("lp"), to: byId("air"), offer: "85", wait: "2:05", ready: false,
      needs: { zh: ["3 人", "尾箱行李 3 件", "有 BB 車"], en: ["3 people", "3 bags in boot", "Stroller"] }, lang: "Bahasa Indonesia", car: { zh: "大尾箱", en: "Big boot" }, carNeed: "boot", pay: "oct" };
  }
  // waiting reward: +5 points for every 5 minutes waited, up to +30
  const waitMinOf = j => { const m = String(j.wait || "0").split(":"); return parseInt(m[0], 10) || 0; };
  const waitBonus = j => Math.min(30, Math.floor(waitMinOf(j) / 5) * 5);
  function boardJobs() {
    const mk = (f, to, w, pay) => ({ from: byId(f), to: byId(to), offer: "none", wait: w + ":00", ready: true, pay });
    return [mk("cp", "qmh", 14, "oct"), mk("lp", "kt", 9, "alipay"), mk("pp", "hku", 4, "cash")]
      .filter(j => j.from && j.to && !jobAvoided(j))
      .sort((a, b) => waitMinOf(b) - waitMinOf(a));
  }
  function renderBoard() {
    const box = $("#offerBoard"); if (!box) return;
    const jobs = boardJobs(); D.board = jobs;
    if (!jobs.length) { box.innerHTML = ""; return; }
    box.innerHTML = `<div class="ob-head">${ic("clock")}<b>${t("boardTitle")}</b></div>` + jobs.map((j, i) => {
      const q = baseQuote(j.from, j.to, new Set()), take = Math.round(q.meter + SUR.booking), b = waitBonus(j);
      return `<button class="ob-row" data-board="${i}"><span class="ob-main"><b>${esc(lang === "en" ? j.from.en : j.from.zh)} → ${esc(lang === "en" ? j.to.en : j.to.zh)}</b><small>${t("boardWait", { m: waitMinOf(j) })}${b ? ` · <em>${t("boardBonus", { p: b })}</em>` : ""}</small></span><span class="ob-side">~$${take}<i>${t("boardPick")}</i></span></button>`;
    }).join("") + `<p class="ob-note">${t("boardNote")}</p>`;
  }
  document.addEventListener("click", e => { const b = e.target.closest("[data-board]"); if (!b) return; const j = (D.board || [])[+b.dataset.board]; if (j) { stopDriverTimers(); showOffer(Object.assign({}, j)); const oc = document.querySelector(".offer-card"); if (oc) oc.scrollIntoView({ block: "start", behavior: "smooth" }); } });
  function showOffer(chosen) {
    const j = D.job = chosen || nextJob(), q = baseQuote(j.from, j.to, new Set(["luggage"])), pr = priced(q, j.offer === "none" ? "meter" : "offer", new Set(j.offer === "none" ? [] : [j.offer]));
    $("#offerMeta").textContent = t("offerMeta", j.short ? { km: "0.4", min: 2 } : { km: "1.2", min: 4 });
    // quick evaluation: take-home, time, hourly rate; tolls are passed through so they're not income
    {
      const pickMin = j.short ? 2 : 4, tripMin = Math.round(Math.min(q.dist, 5) / 0.35 + Math.max(0, q.dist - 5) / 0.9 + 2), allMin = pickMin + tripMin;
      const tolls = pr.items.filter(([k]) => k === "tunnel" || k === "ret").reduce((s, i) => s + i[1], 0);
      const take = Math.round((pr.low + pr.high) / 2 - tolls);
      const dOff = j.offer === "85" ? Math.round(discountOf(q.meter, q.colour).off) : 0;
      $("#offerSum").innerHTML = `<div class="os-take">${t("offTake", { x: take })}</div>
        <div class="os-sub">${t("offTime", { m: allMin, p: pickMin, t: tripMin })} · ${t("offHour", { h: Math.round(take / allMin * 60), m: allMin })}</div>
        ${dOff ? `<div class="os-note disc">${t("offDisc", { d: dOff })}</div>` : ""}${tolls ? `<div class="os-note">${t("offToll", { x: tolls })}</div>` : ""}`;
      // points: shown up front so drivers see the reward for helpful jobs
      const W = T[lang].ptsWhy, parts = [["base", 10]];
      if (j.short) parts.push(["short", 20]);
      if (j.offer === "85") parts.push(["disc", 20]);
      if (j.offer === "nosur") parts.push(["nosur", 10]);
      if (j.pass) parts.push(["pass", 15]);
      if (j.needs || j.senior || j.deaf) parts.push(["care", 10]);
      if (waitBonus(j)) parts.push(["wait", waitBonus(j)]);
      const pts = parts.reduce((s, x) => s + x[1], 0), after = DPTS + pts, lvl = Math.floor(DPTS / 100) + 1, target = lvl * 100;
      j.pts = pts;
      const pctNow = Math.min(100, (DPTS % 100)), pctAfter = Math.min(100, after >= target ? 100 : after % 100);
      $("#offerPts").innerHTML = `<div class="op-head">${ic("star")}<b>${t("offPts", { p: pts })}</b><span>${parts.map(([k, v]) => W[k] + " +" + v).join(" · ")}</span></div>
        <div class="op-bar"><i class="now" style="width:${pctNow}%"></i><i class="add" style="left:${pctNow}%;width:${Math.max(0, pctAfter - pctNow)}%"></i></div>
        <div class="op-next">${after >= target ? t("offPtsUp", { l: lvl + 1 }) : t("offPtsNext", { a: after, n: target - after, l: lvl + 1 })}</div>`;
    }
    $("#offerTags").innerHTML = (j.shift ? `<span class="tag tag-shift">${ic("repeat")}${t("shiftTag")}</span>` : "") +
      (j.needs ? `<span class="tag tag-needs">${ic("user")}${t("needsTag", { n: j.needs[lang].join(" · ") })}</span>` : "") +
      (j.pass ? `<span class="tag tag-boost">${ic("star")}${t("passTag")}</span>` : "") +
      (j.lang ? `<span class="tag tag-incl">${ic("globe")}${t("langTag", { l: j.lang })}</span>` : "") +
      (j.car ? `<span class="tag tag-needs">${ic("car")}${t("carTag", { c: j.car[lang] })}</span>` : "") +
      (j.deaf ? `<span class="tag tag-incl">${ic("message")}${t("deafTag")}</span>` : "") +
      (j.senior ? `<span class="tag tag-senior">${ic("heart")}${t("seniorTag")}</span>` : "") +
      (isHospital(j.to) ? `<span class="tag tag-hosp">${ic("check")}${t("hospTag")}</span>` : "") +
      (j.short ? `<span class="tag tag-boost">${ic("star")}${t("shortBoost")}</span><span class="tag">${ic("calendar")}${t("shortChain")}</span><span class="tag">${ic("pin")}${t("shortNear")}</span>` : "") +
      `<span class="tag">${ic("clock")}${t("offerWait", { w: j.wait, ready: j.ready ? t("readyYes") : t("ready5Txt") })}</span>` +
      `<span class="tag">${ic("wallet")}${t("payTag", { p: T[lang].payNames[j.pay || "oct"] })}</span>` +
      `<span class="tag tag-route">${ic("pin")}${j.route ? t("routeTag", { r: routeLabel(j.route, T[lang]) }) : t("routeTagAuto")}</span>` +
      (j.route ? `<button class="btn-link route-suggest" data-act="suggestRoute">${t("routeSuggest")}</button>` : "");
    const enLine = p => (lang === "en" ? " · " + p.en : "");
    $("#offerPickupZh").textContent = j.from.zh + enLine(j.from); $("#offerPickupRoad").textContent = j.from.addrZh + (lang === "en" ? " · " + j.from.addrEn : "");
    $("#offerDropZh").textContent = j.to.zh + enLine(j.to); $("#offerDropRoad").textContent = j.to.addrZh + (lang === "en" ? " · " + j.to.addrEn : "");
    $("#offerFoot").innerHTML = `${t("offerFare", { f: `${Math.round(pr.low)}–${Math.round(pr.high)}` })}<br><b class="${j.offer !== "none" ? "hl" : ""}">${j.offer === "85" ? t("offer85") : j.offer === "nosur" ? t("offerNoSur") : t("offerNone")}</b><br>${t("offerRider")} · 🧳 1`;
    dstep("offer");
    renderBoard();
    // demo: the offer stays until the driver taps accept or decline (the real app would give 15 seconds)
    $("#offerCountdown").textContent = "15s";
    $("#offerCountdown").title = lang === "en" ? "In the real app, drivers have 15 seconds to accept" : "真 App 會有 15 秒時間接單";
    speak(`有客！${j.from.zh}去${j.to.zh}。` + (j.route ? "乘客揀行" + routeLabel(j.route, T.zh) + "。" : "") + (j.needs ? "乘客備註：" + j.needs.zh.join("，") + "。" : "") + (j.lang ? "乘客唔講廣東話，訊息會翻譯同讀出。" : "") + (j.deaf ? "聽障乘客，請用訊息。" : ""));
  }

  // Always Cantonese, never Mandarin: pick a Cantonese voice explicitly; silent if the device has none.
  function cantoneseVoice() {
    if (!("speechSynthesis" in window)) return null;
    const vs = window.speechSynthesis.getVoices();
    return vs.find(v => /^yue/i.test(v.lang)) || vs.find(v => /^zh[-_]HK/i.test(v.lang)) || vs.find(v => /cantonese|粵|廣東|sin-?ji/i.test(v.name)) || null;
  }
  if ("speechSynthesis" in window) { window.speechSynthesis.getVoices(); window.speechSynthesis.onvoiceschanged = () => window.speechSynthesis.getVoices(); }
  const TTS_LANG = { en: "en", id: "id", tl: "fil", ur: "ur", ne: "ne", hi: "hi" };
  function speakIn(text, code) {
    try {
      if (!("speechSynthesis" in window)) return;
      const want = TTS_LANG[code] || "en", v = window.speechSynthesis.getVoices().find(x => x.lang.toLowerCase().startsWith(want));
      if (!v) return;
      const u = new SpeechSynthesisUtterance(text); u.voice = v; u.lang = v.lang;
      window.speechSynthesis.cancel(); window.speechSynthesis.speak(u);
    } catch (e) { /* optional */ }
  }
  function speak(text) {
    try {
      const v = cantoneseVoice(); if (!v) return;
      const u = new SpeechSynthesisUtterance(text); u.voice = v; u.lang = v.lang; u.rate = 1;
      window.speechSynthesis.cancel(); window.speechSynthesis.speak(u);
    } catch (e) { /* optional */ }
  }

  $("#driverQuick").addEventListener("click", e => {
    const b = e.target.closest("[data-dq]"); if (!b) return;
    chatAdd("#driverChatLog", "me", T.zh.driverQuick[+b.dataset.dq]);
  });
  const driverPaxLang = () => (D.job && D.job.lang === "Bahasa Indonesia" ? "id" : "en");
  async function driverSendTyped() {
    const inp = $("#driverMsg"), v = inp.value.trim(); if (!v) return;
    inp.value = ""; $("#driverTrPrev").textContent = "";
    const to = driverPaxLang(), out = await translate(v, "zh-TW", to);
    chatAdd("#driverChatLog", "me", v, out ? { meta: t("trPrevD", { l: LANG_NAME[to], x: out }) } : {});
  }
  $("#driverSend").addEventListener("click", driverSendTyped);
  dictate($("#driverMic"), $("#driverMsg"), () => "yue-Hant-HK", () => driverSendTyped());
  livePreview($("#driverMsg"), $("#driverTrPrev"), x => t("trPrevD", { l: LANG_NAME[driverPaxLang()], x: esc(x) }), () => "zh-TW", () => driverPaxLang());
  $("#driverMsg").addEventListener("keydown", e => { if (e.key === "Enter") driverSendTyped(); });
  $("#view-driver").addEventListener("click", e => {
    const act = e.target.closest("[data-act]"); if (!act) return;
    const j = D.job;
    switch (act.dataset.act) {
      case "accept":
        stopDriverTimers(); dstep("enroute");
        $("#enPickupZh").textContent = j.from.zh + (lang === "en" ? " · " + j.from.en : ""); $("#enPickupRoad").textContent = j.from.addrZh + (lang === "en" ? " · " + j.from.addrEn : "");
        $("#riderLine").textContent = t("riderLine") + (j.route ? " · " + t("dRouteLine", { r: routeLabel(j.route, T[lang]) }) : "");
        $("#navLink").href = navUrl(j.from);
        $("#driverChatLog").innerHTML = "";
        $("#driverQuick").innerHTML = T[lang].driverQuick.map((p, i) => `<button class="chip" data-dq="${i}">${p}</button>`).join("");
        $("#driverMsg").placeholder = t("dMsgPh");
        D.timers.push(setTimeout(() => {
          chatAdd("#driverChatLog", "them", T.zh.riderIncoming, { meta: t("heard") });
          toast(t("newMsg") + "：" + T.zh.riderIncoming);
          speak("乘客訊息：" + T.zh.riderIncoming);
        }, 2500));
        break;
      case "suggestRoute": toast(t("routeSuggested")); break;
      case "holdNext": toast(t("soonHeld")); break;
      case "showCode": { const f = finalPay(parseFloat($("#meterInput").value)); if (f) showPayCode(j.pay, f.total); break; }
      case "takeNext": { const it = (D.nearby || [])[+act.dataset.i]; if (!it) break;
        $$("#tripSoon .ts-job").forEach(b => { b.classList.toggle("taken", b === act); b.disabled = b !== act; });
        act.querySelector(".tj-side em").textContent = t("soonTakenTag");
        toast(t("soonTaken", { p: lang === "en" ? it.from.en : it.from.zh, m: it.gap }));
        speak("已接下一單：落客後直接去" + it.from.zh + "。"); break; }
      case "decline": stopDriverTimers(); dstep("idle"); D.timers.push(setTimeout(showOffer, 4000)); break;
      case "callRider": toast(t("callRiderToast")); break;
      case "dArrived": {
        const nav = $("#tripNav");
        nav.href = navUrl(j.to, j.route && TUNNEL_MID[j.route] ? TUNNEL_MID[j.route] : null);
        nav.innerHTML = ic("pin") + "<span>" + (j.route ? t("navRoute", { r: routeLabel(j.route, T[lang]) }) : t("navAuto")) + "</span>";
      }
        prefillAddons(j); renderAddons();
        $("#tripSoon").innerHTML = ""; $("#tripSoon").classList.add("hidden"); D.timers.push(setTimeout(arrivingSoon, 5000)); dstep("ontrip"); $("#tripDropZh").textContent = j.to.zh + (lang === "en" ? " · " + j.to.en : ""); $("#tripDropRoad").textContent = j.to.addrZh + (lang === "en" ? " · " + j.to.addrEn : ""); $("#meterInput").value = ""; $("#meterCalc").classList.add("hidden"); break;
      case "dComplete": {
        const v = parseFloat($("#meterInput").value);
        if (!(v > 0)) { toast(t("meterNeeded")); return; }
        const fp = finalPay(v), L = T[lang].items;
        $("#dReceipt").innerHTML =
          `<div class="row"><span>${t("receiptMeter")} HK$${money(v)}${fp.vd ? rcptNote(fp.vd) : ""}</span><span>HK$${money(fp.meterPart)}</span></div>` +
          fp.items.map(([k, val]) => `<div class="row"><span>${L[k]}</span><span>HK$${val}</span></div>`).join("") +
          `<div class="row total"><span>${t("total")} · ${t("toDriver")}</span><span>HK$${money(fp.total)}</span></div>`;
        { const f = finalPay(v); if (f) speak(t("calcSay", { v: money(f.total), p: T.zh.payNames[j.pay || "oct"] })); }
        if (j.pts) { DPTS += j.pts; toast(t("dPtsDone", { p: j.pts, a: DPTS })); j.pts = 0; }
        dstep("dDone"); break;
      }
      case "sendDNote": $("#driverNote").value = ""; toast(t("noteSentD")); break;
      case "restartDriver": AFTER.driver = null; renderAfter(); dstep("idle"); if (D.online) D.timers.push(setTimeout(showOffer, 2500)); break;
    }
  });

  // ================================================================ show to driver
  attachSearch($("#showInput"), $("#showResults"), p => {
    $("#showZh").textContent = p.zh; $("#showAddr").textContent = p.addrZh;
    $("#showEn").textContent = `${p.en} · ${p.addrEn}`; $("#showCard").classList.remove("hidden");
  });
  $("#view-show").addEventListener("click", e => { if (e.target.closest("[data-act='closeShow']")) $("#showCard").classList.add("hidden"); });

  // ---------------- compact booking screen
  function buildPlanRows() {
    const plan = $("[data-step=plan]"); if (!plan || $("#optList")) return;
    const after = plan.querySelector(".src-note");
    const list = document.createElement("div"); list.id = "optList"; list.className = "opt-list";
    after.insertAdjacentElement("afterend", list);
    const group = (key, nodes) => {
      const det = document.createElement("details"); det.className = "opt"; det.dataset.opt = key;
      det.innerHTML = `<summary><span class="opt-lbl"></span><span class="opt-val"></span></summary><div class="opt-body"></div>`;
      const body = det.querySelector(".opt-body"); nodes.filter(Boolean).forEach(n => body.appendChild(n));
      list.appendChild(det); return det;
    };
    const whenRow = $("[data-when=now]").parentElement, readyLbl = plan.querySelector("[data-t=readyLbl]"), carLbl = plan.querySelector("[data-t=carLbl]");
    group("route", [$("#routeBox")]);
    const laterBtn = whenRow.querySelector("[data-when=later]"), nowBtn = whenRow.querySelector("[data-when=now]"), whenInput = $("#whenInput");
    $("#readyRow").appendChild(laterBtn);
    whenRow.classList.add("hidden"); if (readyLbl) readyLbl.classList.add("hidden");
    $("#readyRow").addEventListener("click", e => {
      if (e.target.closest("[data-ready]") && R.when === "later") nowBtn.click();
      if (e.target.closest("[data-when=later]")) $$("#readyRow [data-ready]").forEach(b => b.classList.remove("active"));
    }, true);
    group("when", [$("#readyRow"), whenInput, $("#readyNote")]);
    if (OFFERS) group("save", [$("#saveBox")]); else $("#saveBox").classList.add("hidden");
    group("fare", [$("#fareOptions"), $("#quote")]);
    group("pay", [$("#payBox")]);
    group("needs", [carLbl, $("#carRow"), $("#prefChips"), $("#moreNeeds")]);
    group("people", [plan.querySelector(".steppers")]);
    list.addEventListener("toggle", e => { if (e.target.open) list.querySelectorAll("details[open]").forEach(o => { if (o !== e.target) o.open = false; }); }, true);
    // pinned bar: fare estimate + Call button
    const bar = document.createElement("div"); bar.id = "bookBar"; bar.className = "book-bar";
    bar.innerHTML = `<div class="bb-price" id="bbPrice"></div>`;
    bar.appendChild($("#bookBtn"));
    plan.appendChild(bar);
    updatePlanRows();
  }
  function updatePlanRows() {
    const list = $("#optList"); if (!list) return;
    const set = (k, lbl, val, show = true) => { const d = list.querySelector(`[data-opt=${k}]`); if (!d) return; d.querySelector(".opt-lbl").textContent = lbl; d.querySelector(".opt-val").textContent = val; d.classList.toggle("hidden", !show); };
    const offerLbl = { nosur: "oNoSur", nolug: "oNoLug", nopet: "oNoPet", nobook: "oNoBook", one: "oOne", "85": "o85" };
    set("route", t("optRoute"), R.route === "auto" ? t("routeAuto") : routeLabel(R.route, T[lang]), !!R.dest);
    set("when", t("optWhen"), R.when === "later" ? t("valLater") : R.ready ? t("ready" + R.ready) : t("valNow"));
    set("people", t("optPeople"), [t("valPax", { n: R.pax }), R.bags ? t("valBags", { n: R.bags }) : ""].filter(Boolean).join(" · "));
    const carName = R.car && R.car !== "any" ? t({ five: "carFive", boot: "carBoot", tall: "carTall", access: "carAccess" }[R.car]) : "";
    const nPrefs = [...R.prefs].filter(p => !/^lang-/.test(p)).length;
    set("needs", t("optNeeds"), [carName, nPrefs ? t("valMore", { n: nPrefs }) : ""].filter(Boolean).join(" · ") || t("valNone"));
    set("save", t("optSave"), R.offers.size ? [...R.offers].map(k => tf(offerLbl[k])).join("、") : t("valMeter"));
    set("pay", t("optPay"), T[lang].payNames[R.pay]);
    set("fare", t("optFare"), (R.fareMode === "fixed" ? tf("fixedT") : R.fareMode === "offer" ? (R.offers.size ? [...R.offers].map(k => tf(offerLbl[k])).join(lang === "en" ? ", " : "、") : tf("offerT")) : tf("meterT")) + (R.tip ? " · " + t("valTip", { n: R.tip }) : ""), !!R.dest);
    { const sn = $("[data-step=plan] .src-note"); if (sn) sn.classList.toggle("hidden", !!R.dest); }
    const bp = $("#bbPrice"), fare = $("#quote .fare");
    if (bp) bp.innerHTML = R.dest && fare ? `<b>${fare.textContent.replace(/\s+/g, "")}</b><span>${esc(lang === "en" ? R.dest.en : R.dest.zh)}</span>` : `<span>${t("barPick")}</span>`;
  }
  document.addEventListener("click", () => setTimeout(updatePlanRows, 0));
  document.addEventListener("input", () => setTimeout(updatePlanRows, 0));

  // after a ride: save the person, or never be matched again (private; can be undone)
  const AFTER = { rider: null, driver: null };
  function renderAfter() {
    const r = $("#riderAfter"), d = $("#driverAfter");
    const row = (side, keepK, blockK, doneKeep, doneBlock) => {
      const st = AFTER[side];
      if (st) return `<div class="ar-done ${st}">${ic(st === "keep" ? "heart" : "alert")}<span>${t(st === "keep" ? doneKeep : doneBlock)}</span><button class="btn-link" data-after="${side}:undo">${t("undo")}</button></div>`;
      return `<button class="btn btn-ghost btn-sm" data-after="${side}:keep">${ic("heart")}<span>${t(keepK)}</span></button><button class="btn btn-ghost btn-sm ar-block" data-after="${side}:block">${t(blockK)}</button>`;
    };
    if (r) r.innerHTML = row("rider", "keepDriver", "blockDriver", "keepDriverDone", "blockDriverDone");
    if (d) d.innerHTML = row("driver", "keepRider", "blockRider", "keepRiderDone", "blockRiderDone");
  }
  document.addEventListener("click", e => {
    const b = e.target.closest("[data-after]"); if (!b) return;
    const [side, act] = b.dataset.after.split(":");
    AFTER[side] = act === "undo" ? null : act; renderAfter();
  });

  // ---------------- sign-up: the main call to action
  const signBtns = (cls = "") => `<a class="btn btn-primary sign-btn ${cls}" data-sign="rider" href="${CFG.riderFormUrl || "#"}" target="_blank" rel="noopener">${ic("user")}<span>${t("signRider")}</span></a><a class="btn sign-btn sign-alt ${cls}" data-sign="driver" href="${CFG.driverFormUrl || "#"}" target="_blank" rel="noopener">${ic("car")}<span>${t("signDriver")}</span></a>`;
  document.addEventListener("click", e => {
    const a = e.target.closest("[data-sign]"); if (!a) return;
    const url = a.dataset.sign === "rider" ? CFG.riderFormUrl : CFG.driverFormUrl;
    if (!url) { e.preventDefault(); toast(t("signSoon")); }
  });
  function faqHTML() { return `<h2>${t("faqTitle")}</h2>` + T[lang].faq.map(([q, a]) => `<details class="faq-item"><summary>${q}</summary><p>${a}</p></details>`).join("") + `<a class="faq-fb" data-feedback href="${CFG.feedbackFormUrl || "#"}" target="_blank" rel="noopener">${t("fbLink")}</a>`; }
  document.addEventListener("click", e => { const a = e.target.closest("[data-feedback]"); if (!a) return; if (!CFG.feedbackFormUrl) { e.preventDefault(); toast(t("fbSoon")); } });
  function showTerms() {
    const el = $("#privacyModal"); if (!el) return;
    const mail = CFG.contactEmail || "kaifongtaxi@gmail.com";
    el.innerHTML = `<div class="pv-card" role="dialog" aria-modal="true" aria-label="${t("termsTitle")}"><h2>${t("termsTitle")}</h2>
      ${T[lang].termsBody.map(([h, p]) => `<h3>${h}</h3><p>${p.replace("{mail}", esc(mail))}</p>`).join("")}
      <p class="pv-upd">${t("termsUpdated")} · <a href="#" data-privacy>${t("privLink")}</a></p><button class="btn btn-primary btn-block" data-act="closePriv">${t("privClose")}</button></div>`;
    el.classList.remove("hidden");
  }
  document.addEventListener("click", e => { if (e.target.closest("[data-terms]")) { e.preventDefault(); showTerms(); } });
  function showPrivacy() {
    const el = $("#privacyModal"); if (!el) return;
    const mail = CFG.contactEmail || (lang === "en" ? "(email coming soon)" : "（電郵稍後公布）");
    el.innerHTML = `<div class="pv-card" role="dialog" aria-modal="true" aria-label="${t("privTitle")}"><h2>${t("privTitle")}</h2>
      ${T[lang].privBody.map(([h, p, note]) => `<h3>${h}</h3>` + (Array.isArray(p) ? `<ul class="pv-list">${p.map(it => { const m = it.match(/^(.+?)(：|: )(.*)$/); return `<li>${m ? `<b>${m[1]}</b>${m[2]}${m[3]}` : it}</li>`; }).join("")}</ul>` + (note ? `<p>${note}</p>` : "") : `<p>${p.replace("{mail}", esc(mail))}</p>`)).join("")}
      <p class="pv-upd">${t("privUpdated")}</p><button class="btn btn-primary btn-block" data-act="closePriv">${t("privClose")}</button></div>`;
    el.classList.remove("hidden");
  }
  document.addEventListener("click", e => {
    if (e.target.closest("[data-privacy]")) { e.preventDefault(); showPrivacy(); return; }
    if (e.target.closest("[data-act=closePriv]") || e.target.id === "privacyModal") $("#privacyModal").classList.add("hidden");
  });
  function renderSign() {
    const hf = $("#homeFaq"); if (hf) hf.innerHTML = faqHTML();
    const sf = $("#sideFaq"); if (sf) sf.innerHTML = faqHTML();
    const hs = $("#heroSign"); if (hs) hs.innerHTML = "";
    const bar = $("#signBar"); if (bar) bar.innerHTML = `<div class="sb-btns"><a class="btn btn-primary" data-sign="rider" href="${CFG.riderFormUrl || "#"}" target="_blank" rel="noopener">${ic("user")}<span>${t("sbRider")}</span></a><a class="btn sb-alt" data-sign="driver" href="${CFG.driverFormUrl || "#"}" target="_blank" rel="noopener">${ic("car")}<span>${t("sbDriver")}</span></a></div>`;
    const n = (have, need) => `<div class="sg-prog"><div class="sg-bar"><i style="width:${Math.min(100, have / need * 100)}%"></i></div><span>${have} / ${need}</span></div>`;
    const trust = `<ul class="sg-trust">${T[lang].trustList.map(x => `<li>${x}</li>`).join("")}</ul>`;
    const signCard = links => `<h2>${t("signTitle")}</h2><p>${t("signSub")}</p><div class="sg-btns">${signBtns("big")}</div>${trust}
      <div class="sg-progs"><div><b>${t("launchRiders")}</b>${n(CFG.ridersSignedUp || 0, CFG.buildRiders || 100)}</div><div><b>${t("launchDrivers")}</b>${n(CFG.driversSignedUp || 0, CFG.buildDrivers || 10)}</div></div>` + (links ? `<p class="sg-links"><a href="#" data-terms>${t("termsLink")}</a> · <a href="#" data-privacy>${t("privLink")}</a></p>` : "");
    const card = $("#sideSign"); if (card) card.innerHTML = signCard(false);
    const hcard = $("#homeSign"); if (hcard) hcard.innerHTML = signCard(true);
  }
  // the sticky bar only shows on the phone home page
  function syncSignBar() { const bar = $("#signBar"); if (!bar) return; const home = $("#view-home"); const on = !!(home && home.classList.contains("active")); bar.classList.toggle("show", on); document.body.classList.toggle("has-signbar", on); }
  document.addEventListener("click", () => setTimeout(syncSignBar, 0));
  (function barAutoHide() {
    let lastY = window.scrollY, cardSeen = false;
    const apply = away => { const bar = $("#signBar"); if (bar) bar.classList.toggle("away", away); };
    window.addEventListener("scroll", () => {
      const y = window.scrollY, dy = y - lastY;
      if (Math.abs(dy) < 6) return;
      apply(cardSeen || (dy > 0 && y > 120));
      lastY = y;
    }, { passive: true });
    const watch = () => { const hc = $("#homeSign"); if (!hc || !("IntersectionObserver" in window)) return;
      new IntersectionObserver(es => { cardSeen = es.some(e => e.isIntersecting); apply(cardSeen); }, { threshold: 0.15 }).observe(hc); };
    if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", watch); else watch();
  })();

  // ---------------- desktop landing panel beside the phone frame
  function renderSide() {
    const S = id => document.getElementById(id); if (!S("sideTitle")) return;
    S("sideTitle").textContent = t("heroTitle");
    S("sideCopy").textContent = t("heroLead");
    S("sideCta").innerHTML = signBtns();
    const sd = S("sideDemo"); if (sd) sd.innerHTML = `<span>${t("demoLabel")}</span><div class="sd-seg" role="group"><button data-side="rider">${ic("user")}${t("demoRider")}</button><button data-side="driver">${ic("car")}${t("demoDriver")}</button></div>`;
    syncDemoSwitch();
    S("sideStats").innerHTML = [["0%", t("statComm")], ["$0", t("statFee")], ["100%", t("statFare")]].map(([b, s]) => `<div><b>${b}</b><span>${s}</span></div>`).join("");
    S("sideFeats").innerHTML = T[lang].features.map(([n, d]) => `<div class="sf"><b>${n}</b><span>${d}</span></div>`).join("");
    $$("#sideFeats .sf span").forEach(phraseWrap);
    S("sideStory").innerHTML = `<h2>${t("storyTitle")}</h2><p>${t("story1")}</p><p>${t("story2")}</p><p class="side-punch">${t("story3")}</p><p class="side-signoff">${t("storySign")}</p>`;
    const pl = (title, list) => `<div class="sp-col"><h3>${title}</h3>${list.map(([q, a]) => `<div class="sp-row"><span class="sp-q">${q}</span><span class="sp-a">${a}</span></div>`).join("")}</div>`;
    S("sidePains").innerHTML = `<h2>${t("painTitle")}</h2><div class="sp-grid">${pl(T[lang].whyRiderTitle, T[lang].painsRider)}${pl(T[lang].whyDriverTitle.replace(/\s*\(.*\)$/, ""), T[lang].painsDriver)}</div>`;

    const link = (url, lbl) => url ? `<a class="side-link" href="${url}" target="_blank" rel="noopener">${lbl}</a>` : `<span class="side-link soon">${lbl.replace(/\s*→\s*$/, "")} · ${t("sideSoon")}</span>`;
    S("sideJoin").innerHTML = "";
    S("sideHint").innerHTML = `${esc(t("sideHint"))} · <a href="#" class="priv-link inline" data-terms>${t("termsLink")}</a> · <a href="#" class="priv-link inline" data-privacy>${t("privLink")}</a>`;
  }
  document.addEventListener("click", e => { const b = e.target.closest("[data-side]"); if (!b) return; go(b.dataset.side); });

  // ---------------- desktop: wrap the app in a realistic phone (bezel, Dynamic Island, status bar)
  (function wrapDevice() {
    const shell = document.querySelector(".app-shell"); if (!shell || shell.closest(".device")) return;
    const dev = document.createElement("div"); dev.className = "device";
    dev.innerHTML = '<span class="dv-btn dv-silent"></span><span class="dv-btn dv-vol1"></span><span class="dv-btn dv-vol2"></span><span class="dv-btn dv-power"></span><div class="dv-screen"><div class="dv-status"><b>9:41</b><span class="dv-island"></span><i class="dv-icons"><svg viewBox="0 0 18 12" width="18" height="12"><rect x="0" y="8" width="3" height="4" rx="1"/><rect x="5" y="5" width="3" height="7" rx="1"/><rect x="10" y="2.5" width="3" height="9.5" rx="1"/><rect x="15" y="0" width="3" height="12" rx="1"/></svg><svg viewBox="0 0 26 12" width="26" height="12"><rect x=".5" y=".5" width="22" height="11" rx="3" fill="none" stroke="currentColor"/><rect x="2" y="2" width="17" height="8" rx="2"/><rect x="23.5" y="4" width="2" height="4" rx="1"/></svg></i></div></div>';
    shell.parentNode.insertBefore(dev, shell);
    dev.querySelector(".dv-screen").appendChild(shell);
    // scale the whole phone evenly to fit the window height (keeps real iPhone proportions)
    const fit = () => { const top = innerHeight < 780 ? 28 : 64; const z = Math.max(0.6, Math.min(1, (innerHeight - top - 12) / 892)); dev.style.setProperty("--dz", z.toFixed(3)); };
    fit(); addEventListener("resize", fit);
  })();

  // ---------------- live sign-up counts from published "count" tabs (numbers only, no personal data)
  function loadCounts() {
    const get = url => url ? fetch(url + (url.includes("?") ? "&" : "?") + "t=" + Date.now(), { cache: "no-store" }).then(r => r.text()).then(tx => { const n = parseInt(String(tx).replace(/[^0-9]/g, " ").trim().split(/\s+/)[0], 10); return isNaN(n) ? null : n; }).catch(() => null) : Promise.resolve(null);
    const both = CFG.countCsv ? fetch(CFG.countCsv + (CFG.countCsv.includes("?") ? "&" : "?") + "t=" + Date.now(), { cache: "no-store" }).then(r => r.text()).then(tx => {
      let r = null, dr = null; const rest = [];
      String(tx).split(/\r?\n/).forEach(line => { const m = line.match(/(\d+)/); if (!m) return; const n = +m[1];
        if (/driver|師傅|司機/i.test(line)) dr = n; else if (/passeng|rider|乘客|街坊/i.test(line)) r = n; else rest.push(...line.split(/[^0-9]+/).filter(Boolean).map(Number)); });
      if (r === null && rest.length) r = rest.shift();
      if (dr === null && rest.length) dr = rest.shift();
      return [r, dr]; }).catch(() => [null, null]) : null;
    (both || Promise.all([get(CFG.riderCountCsv), get(CFG.driverCountCsv)])).then(([r, dr]) => {
      let changed = false;
      if (r !== null && r !== CFG.ridersSignedUp) { CFG.ridersSignedUp = r; changed = true; }
      if (dr !== null && dr !== CFG.driversSignedUp) { CFG.driversSignedUp = dr; changed = true; }
      if (changed) { renderLaunch(); if (typeof renderSign === "function") renderSign(); }
    });
  }

  // reward / quest / perk texts: break only at punctuation so each idea stays together
  const __renderPanelsOrig = renderPanels;
  renderPanels = function () {
    __renderPanelsOrig();
    $$(".pcard .q-row > span, .pcard .perk span, .pcard .unlock > span, .pcard .badge span").forEach(el => { if (!el.querySelector(".phrase")) phraseWrap(el); });
  };

  // ================================================================ boot
  buildPlanRows();
  loadCounts();
  // direct link to the privacy policy (used by the sign-up forms): ...#privacy
  if (location.hash === "#privacy") setTimeout(showPrivacy, 300);
  if (location.hash === "#terms") setTimeout(showTerms, 300);
  addEventListener("hashchange", () => { if (location.hash === "#privacy") showPrivacy(); if (location.hash === "#terms") showTerms(); });
  // on a computer the details are in the panel beside the phone, so the phone opens straight into the app
  if (window.matchMedia && matchMedia("(min-width: 900px)").matches) setTimeout(() => go("rider"), 0);
  setPaxLang(detectLang(), true);
  let bigSaved = false; try { bigSaved = localStorage.getItem("kaifong-big") === "1"; } catch (e) {}
  setBig(bigSaved);
})();
