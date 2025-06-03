let spoilerExt = function () { // Spoiler extension for Markdown converter
  let spoiler = {
    type: 'lang',
    regex: /~([ \S]+?)~/g,
    replace: '<span class="spoiler">$1</span>'
  };
  return [spoiler];
}

const markdownConverter = new showdown.Converter({ // Set up Markdown converter
  tables: true,
  strikethrough: true,
  noHeaderID: true,
  parseImgDimensions: true,
  simpleLineBreaks: true,
  extensions: [spoilerExt]
});

const reviewIDChars = "abcdefghijklmnopqrstuvwxyz1234567890"; // Used for generating random review IDs
let steamId = ""; // Store user's steamID
let library; // This object will store user's library, received from BLAEO
let user; // This will store user stats and info, received from BLAEO
let gameNameArray = []; // Stores game names, used for game search, populated by createGameNameArray()
let gameIDArray = []; // Stores game AppIDs, used for game search, populated by createGameIDArray()
let fetchError; // Used to show fetch errors
function byId(id) {
  return document.getElementById(id)
}; // Use elementId() as a shorthand for document.getElementById()
const eIds = { // Store HTML element IDs
  bar: {
    search: byId("bargamesearch"),
    title: byId("bargametitle"),
    appID: byId("barappid"),
    playtime: byId("barplaytime"),
    achEarned: byId("barachearned"),
    achTotal: byId("barachtotal"),
    screenshotOn: byId("barscreenshoton"),
    screenshotOff: byId("barscreenshotoff"),
    platform: byId("barplatform"),
    customText: byId("barcustomtext"),
    bgType: byId("barbgtype"),
    bgColor1: byId("barbgcolor1"),
    bgColor2: byId("barbgcolor2"),
    bgColor3: byId("barbgcolor3"),
    bgColor1Text: byId("barbgcolor1text"),
    bgColor2Text: byId("barbgcolor2text"),
    bgColor3Text: byId("barbgcolor3text"),
    bgMoreColors: byId("barbgmorecolors"),
    imageType: byId("barimagetype"),
    imagePos: byId("barimagepos"),
    imageCustomRow: byId("barcustomimagerow"),
    imageCustomUrl: byId("barcustomimage"),
    imageCustomLink: byId("barcustomimagelink"),
    compPos: byId("barcomppos"),
    compColor: byId("barcompcolor"),
    titleColorPick: byId("bartitlecolorpick"),
    titleColor: byId("bartitlecolor"),
    textColorPick: byId("bartextcolorpick"),
    textColor: byId("bartextcolor"),
    height: byId("barheight"),
    textShadowsOn: byId("bartextshadowson"),
    textShadowsOff: byId("bartextshadowsoff"),
    showInfoOn: byId("barshowinfoon"),
    showInfoOff: byId("barshowinfooff"),
    reviewTrigger: byId("barreviewtrigger"),
    reviewButtonRow: byId("barbuttonrow"),
    reviewButtonPick: byId("barbuttoncolorpick"),
    reviewButton: byId("barbuttoncolor"),
    reviewButtonTextPick: byId("barbuttontextcolorpick"),
    reviewButtonText: byId("barbuttontextcolor"),
    review: byId("barreviewfield"),
    preview: byId("barpreview"),
    code: byId("bargenerated"),
    codeCopy: byId("barcopycode"),
    save: byId("barsave"),
    load: byId("barload")
  },
  panel: {
    search: byId("panelgamesearch"),
    title: byId("panelgametitle"),
    appID: byId("panelappid"),
    playtime: byId("panelplaytime"),
    achEarned: byId("panelachearned"),
    achTotal: byId("panelachtotal"),
    rating: byId("panelrating"),
    customText: byId("panelcustomtext"),
    platform: byId("panelplatform"),
    screenshotOn: byId("panelscreenshoton"),
    screenshotOff: byId("panelscreenshotoff"),
    preset: byId("panelpreset"),
    compColor: byId("panelcompcolor"),
    backgroundAndTextDiv1: byId("panelbgcolordiv1"),
    backgroundAndTextDiv2: byId("panelbgcolordiv2"),
    backgroundAndTextDiv3: byId("panelbgcolordiv3"),
    bgType: byId("panelbgtype"),
    bgColor1: byId("panelbgcolor1"),
    bgColor2: byId("panelbgcolor2"),
    bgColor3: byId("panelbgcolor3"),
    bgColor1Text: byId("panelbgcolor1text"),
    bgColor2Text: byId("panelbgcolor2text"),
    bgColor3Text: byId("panelbgcolor3text"),
    textColorPick: byId("paneltextcolorpick"),
    textColor: byId("paneltextcolor"),
    iconColorPick: byId("paneliconcolorpick"),
    iconColor: byId("paneliconcolor"),
    imageHeaderBtn: byId("panelheaderimage"),
    imageCustomBtn: byId("panelcustomimage"),
    imageCustomRow: byId("panelcustomimagerow"),
    imageCustomUrl: byId("panelcustomimageurl"),
    imageCustomLink: byId("panelcustomimagelink"),
    reviewTrigger: byId("panelreviewtrigger"),
    review: byId("panelreviewfield"),
    preview: byId("panelpreview"),
    code: byId("panelcode"),
    codeCopy: byId("panelcopycode"),
    save: byId("panelsave"),
    load: byId("panelload")
  },
  box: {
    search: byId("boxgamesearch"),
    title: byId("boxgametitle"),
    appID: byId("boxappid"),
    playtime: byId("boxplaytime"),
    achEarned: byId("boxachearned"),
    achTotal: byId("boxachtotal"),
    platform: byId("boxplatform"),
    screenshotOn: byId("boxscreenshoton"),
    screenshotOff: byId("boxscreenshotoff"),
    minimalOn: byId("boxminimalon"),
    minimalOff: byId("boxminimaloff"),
    preset: byId("boxpreset"),
    compColor: byId("boxcompcolor"),
    backgroundAndTextDiv1: byId("boxbgcolordiv1"),
    backgroundAndTextDiv2: byId("boxbgcolordiv2"),
    bgType: byId("boxbgtype"),
    bgColor1: byId("boxbgcolor1"),
    bgColor2: byId("boxbgcolor2"),
    bgColor3: byId("boxbgcolor3"),
    bgColor1Text: byId("boxbgcolor1text"),
    bgColor2Text: byId("boxbgcolor2text"),
    bgColor3Text: byId("boxbgcolor3text"),
    textColorPick: byId("boxtextcolorpick"),
    textColor: byId("boxtextcolor"),
    imageType: byId("boximagetype"),
    imageCustomRow: byId("boxcustomimagerow"),
    imageCustomUrl: byId("boxcustomimageurl"),
    imageCustomLink: byId("boxcustomimagelink"),
    preview: byId("boxpreview"),
    code: byId("boxcode"),
    codeCopy: byId("boxcopycode"),
    save: byId("boxsave"),
    load: byId("boxload")
  },
  progressBar: {
    autofill: byId("pbauto"),
    barDropdown: byId("pbbardecor"),
    completed: byId("pbcompleted"),
    completedDecor: byId("pbcompleteddecor"),
    beaten: byId("pbbeaten"),
    beatenDecor: byId("pbbeatendecor"),
    unfinished: byId("pbunfinished"),
    unfinishedDecor: byId("pbunfinisheddecor"),
    neverPlayed: byId("pbneverplayed"),
    neverPlayedDecor: byId("pbneverplayeddecor"),
    wontPlay: byId("pbwontplay"),
    wontPlayDecor: byId("pbwontplaydecor"),
    round: byId("pbround"),
    preview: byId("pbpreview"),
    code: byId("pbcode"),
    codeCopy: byId("pbcopycode")
  },
  hero: {
    search: byId("herogamesearch"),
    title: byId("herogametitle"),
    appID: byId("heroappid"),
    playtime: byId("heroplaytime"),
    achEarned: byId("heroachearned"),
    achTotal: byId("heroachtotal"),
    screenshotOn: byId("heroscreenshoton"),
    screenshotOff: byId("heroscreenshotoff"),
    platform: byId("heroplatform"),
    customText: byId("herocustomtext"),
    colorPreset: byId("herocolorpreset"),
    borderColor: byId("herobordercolor"),
    borderColorText: byId("herobordercolortext"),
    tileBgColor: byId("herotilebgcolor"),
    tileBgColorText: byId("herotilebgcolortext"),
    tileContentColor: byId("herotilecontentcolor"),
    tileContentColorText: byId("herotilecontentcolortext"),
    imageHeroBtn: byId("heroheroimage"),
    imageCustomBtn: byId("herocustomimage"),
    imageMinHeight: byId("heroimageminheight"),
    imageMaxHeight: byId("heroimagemaxheight"),
    imageCustomRow: byId("herocustomimagerow"),
    imageCustomUrl: byId("herocustomimageurl"),
    imageCustomLink: byId("herocustomimagelink"),
    logoPosition: byId("herologopos"),
    logoSize: byId("herologosize"),
    logoCustomUrl: byId("herocustomlogourl"),
    logoSizeCalcHeight: byId("herologocalcheight"),
    logoSizeCalcWidth: byId("herologocalcwidth"),
    logoXOffset: byId("heroxoffset"),
    logoYOffset: byId("heroyoffset"),
    reviewTrigger: byId("heroreviewtrigger"),
    review: byId("heroreviewfield"),
    preview: byId("heropreview"),
    code: byId("herocode"),
    codeCopy: byId("herocopycode"),
    save: byId("herosave"),
    load: byId("heroload"),
    imageError: byId("heroimageerror")
  },
  settings: {
    steamId: byId("steamid"),
    syncButton: byId("syncbutton"),
    autoSyncOn: byId("autosyncon"),
    autoSyncOff: byId("autosyncoff"),
    syncingMsg: byId("statssyncing"),
    lastSync: byId("lastsync"),
    lastSyncDate: byId("lastsyncdate"),
    userStats: byId("userstats")
  },
  saveModal: {
    label: byId("savemodallabel"),
    saveNameDiv: byId("savemodalnamediv"),
    saveName: byId("savemodalname"),
    loadsaveMsg: byId("savemodalloadsavemsg"),
    btn: byId("savemodalbtn")
  },
  loadModal: {
    label: byId("loadmodallabel"),
    btn: byId("loadmodalbtn")
  },
  loadsaveResetModal: {
    label: byId("loadsaveresetmodallabel"),
    btn: byId("loadsaveresetmodalbtn")
  },
  other: {
    firstVisitMsg: byId("firstvisitmsg"),
    firstVisitMsgBtn: byId("firstvisitmsgbtn"),
    firstVisitMsgSettingsLink: byId("firstvisitmsg-settingslink")
  }
};
const bar = {
  code: "",
  update() {
    eIds.bar.code.value = eIds.bar.preview.innerHTML = bar.code = `<div ${bar.review.triggerCodeBar}style="position: relative; min-height: ${bar.height}px; ${bar.textShadows}${bar.completionBar.code} ${bar.review.cursor} ${bar.background.code}">
${bar.image.code}
<div style="padding-left: 1rem; width: ${bar.infoDiv.width} ${bar.infoDiv.margin}">
${bar.title.code} 
${bar.info.code}
</div> ${bar.review.triggerCodeBar2} ${bar.review.triggerCodeButton}
</div> 
${bar.review.code}<br>`;
  },
  updEverything() {
    $(eIds.bar.appID).trigger("blur");
    $(eIds.bar.title).trigger("blur");
    $(eIds.bar.playtime).trigger("blur");
    $(eIds.bar.achEarned).trigger("blur");
    $(eIds.bar.achTotal).trigger("blur");
    $(eIds.bar.platform).trigger("change");
    $(eIds.bar.customText).trigger("blur");
    if (eIds.bar.screenshotOn.classList.contains("active")) {
      $(eIds.bar.screenshotOn).trigger("click")
    } else {
      $(eIds.bar.screenshotOff).trigger("click")
    };
    $(eIds.bar.bgType).trigger("change");
    $(eIds.bar.bgColor1).trigger("input");
    $(eIds.bar.bgColor1Text).trigger("input");
    $(eIds.bar.bgColor2).trigger("input");
    $(eIds.bar.bgColor2Text).trigger("input");
    $(eIds.bar.bgColor3).trigger("input");
    $(eIds.bar.bgColor3Text).trigger("input");
    $(eIds.bar.imageType).trigger("change");
    $(eIds.bar.imagePos).trigger("change");
    $(eIds.bar.imageCustomUrl).trigger("blur");
    $(eIds.bar.imageCustomLink).trigger("blur");
    $(eIds.bar.compPos).trigger("change");
    $(eIds.bar.compColor).trigger("change");
    $(eIds.bar.titleColorPick).trigger("input")
    $(eIds.bar.titleColor).trigger("input")
    $(eIds.bar.textColorPick).trigger("input")
    $(eIds.bar.textColor).trigger("input");
    $(eIds.bar.height).trigger("change");
    if (eIds.bar.textShadowsOn.classList.contains("active")) {
      $(eIds.bar.textShadowsOn).trigger("click")
    } else {
      $(eIds.bar.textShadowsOff).trigger("click")
    };
    if (eIds.bar.showInfoOn.classList.contains("active")) {
      $(eIds.bar.showInfoOn).trigger("click")
    } else {
      $(eIds.bar.showInfoOff).trigger("click")
    };
    $(eIds.bar.reviewTrigger).trigger("change");
    $(eIds.bar.reviewButtonPick).trigger("input")
    $(eIds.bar.reviewButton).trigger("input")
    $(eIds.bar.reviewButtonTextPick).trigger("input")
    $(eIds.bar.reviewButtonText).trigger("input");
    $(eIds.bar.review).trigger("blur")
  },
  gameInfo: {
    name: "Half-Life 2",
    id: "220",
    arrayPos: ""
  },
  height: 69,
  updHeight(height) {
    switch (height) {
      case "small":
        bar.height = "55";
        break;
      case "medium":
        bar.height = "69";
        break;
      case "large":
        bar.height = "83";
        break;
    }
    bar.updImage();
  },
  textShadows: "text-shadow: 1px 1px 0 black; ",
  updTextShadow(set) {
    set
      ?
      (bar.textShadows = "text-shadow: 1px 1px 0 black; ") :
      (bar.textShadows = "");
  },
  completionBar: {
    pos: "left", // Position of completion bar. Can be "left", "right" or "none"
    col: "completed", // Color of bar in hex
    code: "border-left: 10px solid #5BC0DE;"
  },
  updCompletionBar(position, color) {
    if (position) bar.completionBar.pos = position;
    if (color == "auto") {
      if (library.games[bar.gameInfo.arrayPos].progress != undefined) {
        bar.completionBar.col = library.games[bar.gameInfo.arrayPos].progress;
      }
    } else if (color != (undefined || null)) bar.completionBar.col = color;
    let tempColor;
    switch (bar.completionBar.col) {
      case "completed":
        tempColor = "#5BC0DE";
        break;
      case "beaten":
        tempColor = "#5CB85C";
        break;
      case "unfinished":
        tempColor = "#F0AD4E";
        break;
      case "wont play":
        tempColor = "#D9534F";
        break;
      case "never played":
        tempColor = "#EEEEEE";
        break;
    }
    if (bar.completionBar.pos === "none") {
      // If position is "none", don't show the completion bar
      bar.completionBar.code = "";
    } else {
      bar.completionBar.code = `border-${bar.completionBar.pos}: 10px solid ${tempColor};`;
    }
  },
  image: {
    type: "capsule", // Image type. Can be "capsule", "header", "logo", "custom" or "none"
    pos: "right", // Position of image. Can be "left" or "right"
    url: "", // URL of image. Used only if type is "custom"
    link: "",
    code: '<div style="float: right; height: 69px;"><a href="https://store.steampowered.com/app/220/" target="_blank"><img style="height: 100%;" src="https://steamcdn-a.akamaihd.net/steam/apps/220/capsule_184x69.jpg"></a></div>'
  },
  updImage(type, position, url, link) {
    if (type) bar.image.type = type;
    if (position) bar.image.pos = position;
    if (url) bar.image.url = url;
    if (link != (undefined || null)) bar.image.link = link;
    let tempURL;
    if (bar.image.type === "none") {
      bar.image.code = "";
      bar.infoDiv.margin = "";
      bar.infoDiv.width = '100%;';
      if (bar.review.trigger == "bar" &&
        eIds.bar.review.value != "") {
        bar.review.triggerCodeBar2 = `<span style="color: ${bar.info.color}; right: 0; position: absolute; bottom: 0; padding-right: 2px; font-size: 1.2rem;">Click to expand <i class="fa fa-level-down"></i></span>`;
      } else {
        bar.review.triggerCodeBar2 = "";
      }
    } else {
      switch (bar.image.type) {
        case "capsule":
          tempURL = `https://steamcdn-a.akamaihd.net/steam/apps/${bar.gameInfo.id}/capsule_184x69.jpg`;
          break;
        case "header":
          tempURL = `https://steamcdn-a.akamaihd.net/steam/apps/${bar.gameInfo.id}/header.jpg`;
          break;
        case "custom":
          tempURL = bar.image.url;
          break;
      }
      if (bar.image.pos === "left") {
        bar.infoDiv.margin = "margin-left: auto;";
      } else {
        bar.infoDiv.margin = "";
      }
      let imgLink;
      if (bar.image.type == "custom" && bar.image.link !== "") {
        imgLink = bar.image.link;
      } else {
        imgLink = `https://store.steampowered.com/app/${bar.gameInfo.id}/`;
      }
      let tempImg = new Image();
      tempImg.onload = function () {
        let aspectRatio = tempImg.width / tempImg.height;
        let res = Math.ceil(bar.height * aspectRatio);
        bar.infoDiv.width = `calc(100% - ${res}px);`;
        if (
          bar.image.pos === "right" &&
          bar.review.trigger == "bar" &&
          eIds.bar.review.value != ""
        ) {
          bar.review.triggerCodeBar2 = `<span style="color: ${bar.info.color}; right: ${res}px; position: absolute; bottom: 0; padding-right: 2px; font-size: 1.2rem;">Click to expand <i class="fa fa-level-down"></i></span>`;
        } else if (
          bar.image.pos === "left" &&
          bar.review.trigger == "bar" &&
          eIds.bar.review.value != ""
        ) {
          bar.review.triggerCodeBar2 = `<span style="color: ${bar.info.color}; right: 0; position: absolute; bottom: 0; padding-right: 2px; font-size: 1.2rem;">Click to expand <i class="fa fa-level-down"></i></span>`;
        }
        bar.image.code = `<div style="float: ${bar.image.pos}; height: ${bar.height}px;"><a href="${imgLink}" target="_blank"><img style="height: 100%;" src="${tempURL}" /></a></div>`;
        bar.update();
      };
      tempImg.src = tempURL;
      tempImg.onerror = async function () {
        console.log("Failed to load image!");
        if (bar.image.type === "capsule") {
          let altImg = await getAltCapsule(bar.gameInfo.id);
          console.log(altImg);
          if (altImg && tempURL !== altImg) {
            tempURL = tempImg.src = altImg;
          }
        }
      };
    }
  },
  background: {
    type: "solid", // Type of background. Can be "solid", "hor-gradient" or "vert-gradient"
    color1: "#000000",
    color2: "#000000", // Used only with "hor-gradient" and "ver-gradient"
    color3: "#000000",
    code: "background: #000000"
  },
  updBackground(type, col1, col2, col3) {
    if (type) bar.background.type = type;
    if (col1) bar.background.color1 = col1;
    if (col2) bar.background.color2 = col2;
    if (col3) bar.background.color3 = col3;
    switch (bar.background.type) {
      case "solid":
        bar.background.code = `background: ${bar.background.color1}`;
        break;
      case "hor-gradient":
        bar.background.code = `background: linear-gradient(to right, ${bar.background.color1}, ${bar.background.color2});`;
        break;
      case "vert-gradient":
        bar.background.code = `background: linear-gradient(to bottom, ${bar.background.color1}, ${bar.background.color2});`;
        break;
      case "hor-gradient3":
        bar.background.code = `background: linear-gradient(to right, ${bar.background.color1}, ${bar.background.color2}, ${bar.background.color3});`;
        break;
      case "vert-gradient3":
        bar.background.code = `background: linear-gradient(to bottom, ${bar.background.color1}, ${bar.background.color2}, ${bar.background.color3});`;
        break;
    }
  },
  title: {
    color: "#FFFFFF",
    screenshot: false,
    platform: "none",
    screenshotCode: "",
    platformCode: "",
    code: `<h2 style="margin-bottom: 0px; padding-top: 5px; color: #FFFFFF">Half-Life 2</h2>`
  },
  updTitle(col, screenshot, plat) {
    if (col != (undefined || null)) bar.title.color = col;
    if (screenshot != (undefined || null)) bar.title.screenshot = screenshot;
    if (plat != (undefined || null)) bar.title.platform = plat;
    if (bar.title.screenshot && steamId != "") {
      bar.title.screenshotCode = `<a style="color: ${bar.title.color}" href="https://steamcommunity.com/profiles/${steamId}/screenshots/?appid=${bar.gameInfo.id}" title="View Steam screenshots"><i class="fa fa-camera" style="font-size: 80%"></i></a>`;
    } else {
      bar.title.screenshotCode = "";
    }
    switch (bar.title.platform) {
      case "steam":
        bar.title.platformCode = `<img style="vertical-align: baseline;" src="https://img.icons8.com/metro/21/${bar.title.color.slice(1)}/steam.png" title="Played on Steam">`;
        break;
      case "gog":
        bar.title.platformCode = `<img style="vertical-align: baseline;" src="https://img.icons8.com/ios-filled/21/${bar.title.color.slice(1)}/gog-galaxy.png" title="Played on GoG">`;
        break;
      case "epicstore":
        bar.title.platformCode = `<img style="vertical-align: baseline;" src="https://img.icons8.com/ios-filled/21/${bar.title.color.slice(1)}/epic-games.png" title="Played on Epic Store">`;
        break;
      case "origin":
        bar.title.platformCode = `<img style="vertical-align: baseline;" src="https://img.icons8.com/ios-filled/21/${bar.title.color.slice(1)}/origin.png" title="Played on Origin">`;
        break;
      case "uplay":
        bar.title.platformCode = `<img style="vertical-align: baseline;" src="https://img.icons8.com/ios-filled/21/${bar.title.color.slice(1)}/uplay.png" title="Played on uPlay">`;
        break;
      case "microsoftstore":
        bar.title.platformCode = `<img style="vertical-align: baseline;" src="https://img.icons8.com/windows/21/${bar.title.color.slice(1)}/windows-10-store.png" title="Played on Microsoft Store">`;
        break;
      case "battlenet":
        bar.title.platformCode = `<img style="vertical-align: baseline;" src="https://img.icons8.com/ios-filled/21/${bar.title.color.slice(1)}/battle-net.png" title="Played on Battle.net">`;
        break;
      case "rockstargames":
        bar.title.platformCode = `<img style="vertical-align: baseline;" src="https://img.icons8.com/ios-filled/21/${bar.title.color.slice(1)}/rockstar-games.png" title="Played on Rockstar Games Launcher">`;
        break;
      case "itchio":
        bar.title.platformCode = `<img style="vertical-align: baseline;" src="https://img.icons8.com/ios-glyphs/21/${bar.title.color.slice(1)}/itch-io.png" title="Played on itch.io">`;
        break;
      case "amazon":
        bar.title.platformCode = `<i class="fa fa-amazon" title="Played on Amazon"></i>`;
        break;
      case "drmfree":
        bar.title.platformCode = '<i class="fa fa-unlock-alt" title="DRM-free"></i>';
        break;
      case "android":
        bar.title.platformCode = '<i class="fa fa-android" title="Played on Android"></i>';
        break;
      case "ios":
        bar.title.platformCode = `<i class="fa fa-apple" title="Played on iOS"></i>`;
        break;
      case "xbox":
        bar.title.platformCode = `<img style="vertical-align: baseline;" src="https://img.icons8.com/metro/21/${bar.title.color.slice(1)}/xbox.png" title="Played on Xbox">`;
        break;
      case "xgp":
        bar.title.platformCode = `<span style="font-weight: bold; margin-left: 4px" title="Played on Xbox Game Pass"><img style="opacity: 1; height: 21px; width: 21px; vertical-align: baseline;" src="https://img.icons8.com/metro/21/${bar.title.color.slice(1)}/xbox.png"><span style="display: inline-block; line-height: 12px; margin: 0 3px 0 2px; text-align: left; font-size: 12px;">GAME<br>PASS</span></span>`
        break;
      case "playstation":
        bar.title.platformCode = `<img style="vertical-align: baseline;" src="https://img.icons8.com/metro/21/${bar.title.color.slice(1)}/play-station.png" title="Played on PlayStation">`;
        break;
      case "switch":
        bar.title.platformCode = `<img style="vertical-align: baseline;" src="https://img.icons8.com/ios-filled/21/${bar.title.color.slice(1)}/nintendo-switch.png" title="Played on Switch">`;
        break;
      case "none":
        bar.title.platformCode = "";
        break;
    }
    bar.title.code = `<h2 style="margin-bottom: 0px; padding-top: 5px; color: ${bar.title.color}">${bar.gameInfo.name} ${bar.title.screenshotCode} ${bar.title.platformCode}</h2>`;
  },
  info: {
    playtime: "0",
    achievements: "0",
    achievementsTotal: "0",
    color: "#FFFFFF",
    customText: "",
    enabled: true,
    achievementsCode: "no achievements",
    code: '<p style="margin-bottom: 0; color: #FFFFFF; font-size: 1rem">0 hours, no achievements<br></p>'
  },
  updInfo(playtime, ach, achTotal, color, text, enabled) {
    let playtimeCalc = bar.info.playtime;
    if (playtime == "auto") {
      bar.info.playtime = library.games[bar.gameInfo.arrayPos].playtime;
      if (bar.info.playtime % 60 == 0) {
        playtimeCalc = (bar.info.playtime / 60).toString();
        bar.info.playtime = playtimeCalc;
      } else {
        playtimeCalc = `${Math.floor(bar.info.playtime / 60)}.${Math.floor( (bar.info.playtime % 60) / 6 )}`;
        bar.info.playtime = playtimeCalc;
      }
    } else if (playtime != (undefined || null)) {
      if (playtime == "") {
        playtimeCalc = bar.info.playtime = "0";
      } else {
        playtimeCalc = bar.info.playtime = playtime;
      }
    }
    if (ach == "auto") {
      if (library.games[bar.gameInfo.arrayPos].achievements != undefined) {
        bar.info.achievements =
          library.games[bar.gameInfo.arrayPos].achievements.unlocked;
      } else {
        bar.info.achievements = 0;
      }
    } else if (ach != (undefined || null)) bar.info.achievements = ach;
    if (achTotal == "auto") {
      if (library.games[bar.gameInfo.arrayPos].achievements != undefined) {
        bar.info.achievementsTotal =
          library.games[bar.gameInfo.arrayPos].achievements.total;
      } else {
        bar.info.achievementsTotal = 0;
      }
    } else if (achTotal != (undefined || null))
      bar.info.achievementsTotal = achTotal;
    if (color != (undefined || null)) bar.info.color = color;
    if (text != (undefined || null)) bar.info.customText = text;
    if (enabled != (undefined || null)) bar.info.enabled = enabled;
    if (bar.info.achievementsTotal == 0) {
      bar.info.achievementsCode = "no achievements";
    } else if (steamId && bar.gameInfo.arrayPos != "") {
      bar.info.achievementsCode = `<a style="color: ${bar.info.color}; text-decoration: underline;" href="https://steamcommunity.com/profiles/${steamId}/stats/${bar.gameInfo.id}/?tab=achievements">${bar.info.achievements} of ${bar.info.achievementsTotal} achievements</a>`;
    } else {
      bar.info.achievementsCode = `${bar.info.achievements} of ${bar.info.achievementsTotal} achievements`;
    }
    if (bar.info.enabled) {
      if (bar.height === "55") {
        bar.info.code = `<p style="margin-bottom: 0; padding-bottom: 5px; font-size: 1rem; color: ${bar.info.color}">${playtimeCalc} hours, ${bar.info.achievementsCode}</p>`;
      } else {
        bar.info.code = `<p style="margin-bottom: 0; padding-bottom: 5px; font-size: 1rem; color: ${bar.info.color}">${playtimeCalc} hours, ${bar.info.achievementsCode}<br>${bar.info.customText}</p>`;
      }
    } else {
      bar.info.code = `<p style="margin-bottom: 0; padding-bottom: 5px; font-size: 1rem; color: ${bar.info.color}">${bar.info.customText}</p>`;
    }
  },
  review: {
    trigger: "bar",
    cursor: "",
    buttonColor: "#AAAAAA",
    buttonTextColor: "#FFFFFF",
    id: "",
    triggerCodeBar: "",
    triggerCodeBar2: "",
    triggerCodeButton: "",
    code: ""
  },
  updReview(trigger, btnColor, txtColor) {
    if (trigger != (undefined || null)) bar.review.trigger = trigger;
    if (btnColor != (undefined || null)) bar.review.buttonColor = btnColor;
    if (txtColor != (undefined || null)) bar.review.buttonTextColor = txtColor;
    let reviewConv = markdownConverter.makeHtml(eIds.bar.review.value); // Get review from textarea and convert it Markdown to HTML
    if (reviewConv) {
      // If review is empty, it will be disabled
      let random = "";
      while (random.length < 5) {
        random +=
          reviewIDChars[Math.floor(Math.random() * reviewIDChars.length)];
      }
      bar.review.id = `barreview_${bar.gameInfo.id}_${steamId}_${random}`;
      if (bar.review.trigger == "bar") {
        if (bar.image.pos === "right") {
          bar.updImage();
        } else {
          bar.review.triggerCodeBar2 = `<span style="color: ${bar.info.color}; right: 0; position: absolute; bottom: 0; padding-right: 2px; font-size: 1.2rem;">Click to expand <i class="fa fa-level-down"></i></span>`;
        }
        bar.review.triggerCodeBar = `data-target="#${bar.review.id}" data-toggle="collapse" `;
        bar.review.triggerCodeButton = "";
        bar.review.cursor = "cursor: pointer;";
        bar.review.code = `<div style="padding: 0px 20px 0px 20px; border: 1px solid #dee2e6; border-top: 0px; border-radius: .25rem;" id="${bar.review.id}" class="collapse"><div style="height: 10px"></div>${reviewConv}</div>`;
      } else if (bar.review.trigger == "button") {
        bar.review.triggerCodeBar = "";
        bar.review.triggerCodeBar2 = "";
        bar.review.triggerCodeButton = `<div data-target="#${bar.review.id}" data-toggle="collapse" style="cursor: pointer; position: absolute; width: 150px; height: 22px; left: 0; right: 0;bottom: -15px; background-color: ${bar.review.buttonColor}; border-radius: 8px; text-align: center; margin: 0 auto; color: ${bar.review.buttonTextColor}; z-index: 1;" class="collapsed"><p style="padding-top: 2px;">More <i class="fa fa-level-down"></i></p></div>`;
        bar.review.cursor = "";
        bar.review.code = `<div style="padding: 0px 20px 0px 20px; border: 1px solid #dee2e6; border-top: 0px; border-radius: .25rem;" id="${bar.review.id}" class="collapse"><div style="height: 16px"></div>${reviewConv}</div>`;
      } else {
        bar.review.triggerCodeBar = "";
        bar.review.triggerCodeBar2 = "";
        bar.review.triggerCodeButton = "";
        bar.review.cursor = "";
        bar.review.code = `<div style="padding: 0px 20px 0px 20px; border: 1px solid #dee2e6; border-top: 0px; border-radius: .25rem;" id="${bar.review.id}"><div style="height: 10px"></div>${reviewConv}</div>`;
      }
    } else {
      bar.review.triggerCodeBar = "";
      bar.review.triggerCodeBar2 = "";
      bar.review.triggerCodeButton = "";
      bar.review.cursor = "";
      bar.review.code = "";
    }
  },
  infoDiv: {
    width: "calc(100% - 184px);",
    margin: ""
  }
};
const panel = {
  code: "",
  update() {
    eIds.panel.code.value = eIds.panel.preview.innerHTML = panel.code = `<div class="panel ${panel.bgAndText.code1}" ${panel.bgAndText.code3}>
<div ${panel.review.triggerCode1} class="panel-heading" style="min-height: 115px; ${panel.bgAndText.code2}">
<div style="${panel.completionBar.code}float: left; padding-right: 10px;">${panel.image.code}</div>
<div class="media-body">${panel.title.customTextCode}<h4 class="media-heading">${panel.title.code}</h4>
${panel.info.code}${panel.review.triggerCode2}
</div></div>${panel.review.code}
</div>`;
  },
  updEverything() {
    $(eIds.panel.appID).trigger("blur");
    $(eIds.panel.title).trigger("blur");
    $(eIds.panel.playtime).trigger("blur");
    $(eIds.panel.achEarned).trigger("blur");
    $(eIds.panel.achTotal).trigger("blur");
    $(eIds.panel.platform).trigger("change");
    $(eIds.panel.rating).trigger("blur");
    $(eIds.panel.customText).trigger("blur");
    if (eIds.panel.screenshotOn.classList.contains("active")) {
      $(eIds.panel.screenshotOn).trigger("click")
    } else {
      $(eIds.panel.screenshotOff).trigger("click")
    };
    $(eIds.panel.preset).trigger("change");
    $(eIds.panel.compColor).trigger("change");
    $(eIds.panel.bgType).trigger("change");
    $(eIds.panel.bgColor1).trigger("input");
    $(eIds.panel.bgColor1Text).trigger("input");
    $(eIds.panel.bgColor2).trigger("input");
    $(eIds.panel.bgColor2Text).trigger("input");
    $(eIds.panel.bgColor3).trigger("input");
    $(eIds.panel.bgColor3Text).trigger("input");
    $(eIds.panel.textColorPick).trigger("input")
    $(eIds.panel.textColor).trigger("input");
    $(eIds.panel.iconColorPick).trigger("input")
    $(eIds.panel.iconColor).trigger("input");
    if (eIds.panel.imageHeaderBtn.classList.contains("active")) {
      $(eIds.panel.imageHeaderBtn).trigger("click")
    } else {
      $(eIds.panel.imageCustomBtn).trigger("click")
    };
    $(eIds.panel.imageCustomUrl).trigger("blur");
    $(eIds.panel.imageCustomLink).trigger("blur");
    $(eIds.panel.reviewTrigger).trigger("change");
    $(eIds.panel.review).trigger("blur")
  },
  gameInfo: {
    name: "Half-Life 2",
    id: "220",
    arrayPos: ""
  },
  completionBar: {
    col: "#5BC0DE", // Color of bar in hex
    code: "border-left: 10px solid #5BC0DE;"
  },
  updCompletionBar(color) {
    if (color == "auto") {
      if (library.games[panel.gameInfo.arrayPos].progress != undefined) {
        panel.completionBar.col = library.games[panel.gameInfo.arrayPos].progress;
      }
    } else if (color != (undefined || null)) panel.completionBar.col = color;
    let tempColor;
    switch (panel.completionBar.col) {
      case "completed":
        tempColor = "#5BC0DE";
        break;
      case "beaten":
        tempColor = "#5CB85C";
        break;
      case "unfinished":
        tempColor = "#F0AD4E";
        break;
      case "wont play":
        tempColor = "#D9534F";
        break;
      case "never played":
        tempColor = "#EEEEEE";
        break;
    }
    if (panel.completionBar.col === "disabled") {
      // If position is "none", don't show the completion bar
      panel.completionBar.code = "";
    } else {
      panel.completionBar.code = `border-left: 10px solid ${tempColor}; `;
    }
  },
  image: {
    type: "header", // Image type. Can be "header" or "custom"
    url: "", // URL of image. Used only if type is "custom"
    link: "",
    code: '<a href="https://store.steampowered.com/app/220"><img alt="Half-Life 2" src="https://steamcdn-a.akamaihd.net/steam/apps/220/header.jpg" style="height: 90px; width: 193px;"></a>'
  },
  updImage(type, url, link) {
    if (type) panel.image.type = type;
    if (url) panel.image.url = url;
    if (link != (undefined || null)) panel.image.link = link;
    let tempURL;
    switch (panel.image.type) {
      case "header":
        tempURL = `https://steamcdn-a.akamaihd.net/steam/apps/${panel.gameInfo.id}/header.jpg`;
        break;
      case "custom":
        tempURL = panel.image.url;
        break;
    }
    if (panel.image.type == "custom" && panel.image.link !== "") {
      imgLink = panel.image.link;
    } else {
      imgLink = `https://store.steampowered.com/app/${panel.gameInfo.id}/`;
    }
    panel.image.code = `<a href="${imgLink}"><img alt="Half-Life 2" src="${tempURL}" style="height: 90px;"></a>`;
  },
  bgAndText: {
    preDefMode: "completed",
    type: "solid", // Can be "solid", "hor-gradient" or "vert-gradient"
    bgColor1: "#000000",
    bgColor2: "#000000", // Used only with "hor-gradient" and "ver-gradient"
    bgColor3: "#000000",
    textColor: "#FFFFFF",
    platformColor: "#31708F",
    bgCode: "background: #000000",
    code1: "panel-info",
    code2: "",
    code3: ""
  },
  updBgAndTextColor(preDefMode, type, bgCol1, bgCol2, bgCol3, textCol) {
    if (preDefMode) panel.bgAndText.preDefMode = preDefMode;
    if (type) panel.bgAndText.type = type;
    if (bgCol1) panel.bgAndText.bgColor1 = bgCol1;
    if (bgCol2) panel.bgAndText.bgColor2 = bgCol2;
    if (bgCol3) panel.bgAndText.bgColor3 = bgCol3;
    if (textCol) panel.bgAndText.textColor = textCol;
    switch (panel.bgAndText.preDefMode) {
      case "info":
        panel.bgAndText.platformColor = "#31708F";
        panel.bgAndText.code1 = "panel-info";
        panel.bgAndText.code2 = "";
        panel.bgAndText.code3 = "";
        break;
      case "success":
        panel.bgAndText.platformColor = "#3C673D";
        panel.bgAndText.code1 = "panel-success";
        panel.bgAndText.code2 = "";
        panel.bgAndText.code3 = "";
        break;
      case "warning":
        panel.bgAndText.platformColor = "#8A6D3B";
        panel.bgAndText.code1 = "panel-warning";
        panel.bgAndText.code2 = "";
        panel.bgAndText.code3 = "";
        break;
      case "danger":
        panel.bgAndText.platformColor = "#A94442";
        panel.bgAndText.code1 = "panel-danger";
        panel.bgAndText.code2 = "";
        panel.bgAndText.code3 = "";
        break;
      case "default":
        panel.bgAndText.platformColor = "#333333";
        panel.bgAndText.code1 = "panel-default";
        panel.bgAndText.code2 = "";
        panel.bgAndText.code3 = "";
        break;
      case "custom":
        panel.bgAndText.platformColor = panel.bgAndText.textColor;
        switch (panel.bgAndText.type) {
          case "solid":
            panel.bgAndText.bgCode = `background: ${panel.bgAndText.bgColor1};`;
            break;
          case "hor-gradient":
            panel.bgAndText.bgCode = `background: linear-gradient(to right, ${panel.bgAndText.bgColor1}, ${panel.bgAndText.bgColor2});`;
            break;
          case "vert-gradient":
            panel.bgAndText.bgCode = `background: linear-gradient(to bottom, ${panel.bgAndText.bgColor1}, ${panel.bgAndText.bgColor2});`;
            break;
          case "hor-gradient3":
            panel.bgAndText.bgCode = `background: linear-gradient(to right, ${panel.bgAndText.bgColor1}, ${panel.bgAndText.bgColor2}, ${panel.bgAndText.bgColor3});`;
            break;
          case "vert-gradient3":
            panel.bgAndText.bgCode = `background: linear-gradient(to bottom, ${panel.bgAndText.bgColor1}, ${panel.bgAndText.bgColor2}, ${panel.bgAndText.bgColor3});`;
            break;
        }
        panel.bgAndText.code1 = "";
        panel.bgAndText.code2 = `color: ${panel.bgAndText.textColor}; ${panel.bgAndText.bgCode} border-color: ${panel.bgAndText.bgColor1};`;
        panel.bgAndText.code3 = `style="border-color: ${panel.bgAndText.bgColor1}"`;
        break;
    }
    panel.updTitle();
  },
  title: {
    screenshot: false,
    platform: "none",
    screenshotCode: "",
    platformCode: "",
    customText: "",
    customTextCode: "",
    code: `Half-Life 2`
  },
  updTitle(screenshot, plat, customText) {
    if (screenshot != (undefined || null)) panel.title.screenshot = screenshot;
    if (plat != (undefined || null)) panel.title.platform = plat;
    if (customText != (undefined || null)) panel.title.customText = customText;
    if (panel.title.screenshot && steamId != "") {
      panel.title.screenshotCode = `<a href="https://steamcommunity.com/profiles/${steamId}/screenshots/?appid=${panel.gameInfo.id}" title="View Steam screenshots"><i class="fa fa-camera" style="color: ${panel.bgAndText.platformColor}; font-size: 16px"></i></a>`;
    } else {
      panel.title.screenshotCode = "";
    }
    switch (panel.title.platform) {
      case "steam":
        panel.title.platformCode = `<img style="vertical-align: -3px" src="https://img.icons8.com/metro/21/${panel.bgAndText.platformColor.slice(1)}/steam.png" title="Played on Steam">`;
        break;
      case "gog":
        panel.title.platformCode = `<img style="vertical-align: -3px" src="https://img.icons8.com/ios-filled/21/${panel.bgAndText.platformColor.slice(1)}/gog-galaxy.png" title="Played on GoG">`;
        break;
      case "epicstore":
        panel.title.platformCode = `<img style="vertical-align: -3px" src="https://img.icons8.com/ios-filled/21/${panel.bgAndText.platformColor.slice(1)}/epic-games.png" title="Played on Epic Store">`;
        break;
      case "origin":
        panel.title.platformCode = `<img style="vertical-align: -3px" src="https://img.icons8.com/ios-filled/21/${panel.bgAndText.platformColor.slice(1)}/origin.png" title="Played on Origin">`;
        break;
      case "uplay":
        panel.title.platformCode = `<img style="vertical-align: -3px" src="https://img.icons8.com/ios-filled/21/${panel.bgAndText.platformColor.slice(1)}/uplay.png" title="Played on uPlay">`;
        break;
      case "microsoftstore":
        panel.title.platformCode = `<img style="vertical-align: -3px" src="https://img.icons8.com/windows/21/${panel.bgAndText.platformColor.slice(1)}/windows-10-store.png" title="Played on Microsoft Store">`;
        break;
      case "battlenet":
        panel.title.platformCode = `<img style="vertical-align: -3px" src="https://img.icons8.com/ios-filled/21/${panel.bgAndText.platformColor.slice(1)}/battle-net.png" title="Played on Battle.net">`;
        break;
      case "rockstargames":
        panel.title.platformCode = `<img style="vertical-align: -3px" src="https://img.icons8.com/ios-filled/21/${panel.bgAndText.platformColor.slice(1)}/rockstar-games.png" title="Played on Rockstar Games Launcher">`;
        break;
      case "itchio":
        panel.title.platformCode = `<img style="vertical-align: -3px;" src="https://img.icons8.com/ios-glyphs/21/${panel.bgAndText.platformColor.slice(1)}/itch-io.png" title="Played on itch.io">`;
        break;
      case "amazon":
        panel.title.platformCode = `<i class="fa fa-amazon" title="Played on Amazon"></i>`;
        break;
      case "drmfree":
        panel.title.platformCode = `<i class="fa fa-unlock-alt" title="DRM-free"></i>`;
        break;
      case "android":
        panel.title.platformCode = '<i class="fa fa-android" title="Played on Android"></i>';
        break;
      case "ios":
        panel.title.platformCode = `<i class="fa fa-apple" title="Played on iOS"></i>`;
        break;
      case "playstation":
        panel.title.platformCode = `<img style="vertical-align: -3px" src="https://img.icons8.com/metro/21/${panel.bgAndText.platformColor.slice(1)}/play-station.png" title="Played on PlayStation">`;
        break;
      case "xbox":
        panel.title.platformCode = `<img style="vertical-align: -3px" src="https://img.icons8.com/metro/21/${panel.bgAndText.platformColor.slice(1)}/xbox.png" title="Played on Xbox">`;
        break;
      case "xgp":
        panel.title.platformCode = `<span style="font-weight: bold; vertical-align: -4px; margin-left: 4px; display: inline-block; height: 24px;" title="Played on Xbox Game Pass"><img style="opacity: 1; height: 21px; width: 21px; vertical-align: baseline;" src="https://img.icons8.com/metro/21/${panel.bgAndText.platformColor.slice(1)}/xbox.png"><span style="display: inline-block; line-height: 12px; margin: 0 3px 0 2px; text-align: left; font-size: 12px;">GAME<br>PASS</span></span>`
        break;
      case "switch":
        panel.title.platformCode = `<img style="vertical-align: -3px" src="https://img.icons8.com/ios-filled/21/${panel.bgAndText.platformColor.slice(1)}/nintendo-switch.png" title="Played on Switch">`;
        break;
      case "none":
        panel.title.platformCode = "";
        break;
    }
    if (panel.title.customText != "") {
      panel.title.customTextCode = `<div style="float: right;">${panel.title.customText}</div>`;
    } else {
      panel.title.customTextCode = "";
    }
    panel.title.code = `${panel.gameInfo.name} ${panel.title.screenshotCode} ${panel.title.platformCode}`;
  },
  info: {
    playtime: "0",
    achievements: "0",
    achievementsTotal: "0",
    rating: "",
    iconColor: "#FFFFFF",
    iconColorCode: "",
    achievementsCode: "no achievements",
    ratingCode: '',
    code: '<div><i class="fa fa-clock-o" aria-hidden="true"></i> 0 hours</div><span><i aria-hidden="true" class="fa fa-trophy"></i> no achievements</span>'
  },
  updInfo(playtime, ach, achTotal, rating, iconColor) {
    let playtimeCalc = panel.info.playtime;
    if (playtime == "auto") {
      panel.info.playtime = library.games[panel.gameInfo.arrayPos].playtime;
      if (panel.info.playtime % 60 == 0) {
        playtimeCalc = (panel.info.playtime / 60).toString();
        panel.info.playtime = playtimeCalc;
      } else {
        playtimeCalc = `${Math.floor(panel.info.playtime / 60)}.${Math.floor(
          (panel.info.playtime % 60) / 6
        )}`;
        panel.info.playtime = playtimeCalc;
      }
    } else if (playtime != (undefined || null)) {
      if (playtime == "") {
        playtimeCalc = panel.info.playtime = "0";
      } else {
        playtimeCalc = panel.info.playtime = playtime;
      }
    }
    if (ach == "auto") {
      if (library.games[panel.gameInfo.arrayPos].achievements != undefined) {
        panel.info.achievements =
          library.games[panel.gameInfo.arrayPos].achievements.unlocked;
      } else {
        panel.info.achievements = 0;
      }
    } else if (ach != (undefined || null)) panel.info.achievements = ach;
    if (achTotal == "auto") {
      if (library.games[panel.gameInfo.arrayPos].achievements != undefined) {
        panel.info.achievementsTotal =
          library.games[panel.gameInfo.arrayPos].achievements.total;
      } else {
        panel.info.achievementsTotal = 0;
      }
    } else if (achTotal != (undefined || null))
      panel.info.achievementsTotal = achTotal;
    if (rating != (undefined || null)) panel.info.rating = rating;
    if (iconColor != (undefined || null)) panel.info.iconColor = iconColor;
    if (panel.info.achievementsTotal == 0) {
      panel.info.achievementsCode = "no achievements";
    } else if (steamId && panel.gameInfo.arrayPos != "") {
      panel.info.achievementsCode = `<a href="https://steamcommunity.com/profiles/${steamId}/stats/${panel.gameInfo.id}/?tab=achievements">${panel.info.achievements} of ${panel.info.achievementsTotal} achievements</a>`;
    } else {
      panel.info.achievementsCode = `${panel.info.achievements} of ${panel.info.achievementsTotal} achievements`;
    }
    if (panel.bgAndText.preDefMode == "custom") {
      panel.info.iconColorCode = `style="color: ${panel.info.iconColor};" `;
    } else {
      panel.info.iconColorCode = ``;
    }
    if (panel.info.rating == "") {
      panel.info.ratingCode = "";
    } else {
      panel.info.ratingCode = `<div><i ${panel.info.iconColorCode}class="fa fa-star"></i> ${panel.info.rating}</div>`;
    }
    panel.info.code = `${panel.info.ratingCode}<div><i ${panel.info.iconColorCode}class="fa fa-clock-o" aria-hidden="true"></i> ${panel.info.playtime} hours</div><span><i ${panel.info.iconColorCode}class="fa fa-trophy"></i> ${panel.info.achievementsCode}</span>`;
  },
  review: {
    id: "",
    trigger: "panel",
    triggerCode1: "",
    triggerCode2: "",
    code: ""
  },
  updReview(trigger) {
    if (trigger) panel.review.trigger = trigger;
    let reviewConv = markdownConverter.makeHtml(eIds.panel.review.value); // Get review from textarea and convert it Markdown to HTML
    if (reviewConv) {
      // If review is empty, it will be disabled
      let random = "";
      while (random.length < 5) {
        random +=
          reviewIDChars[Math.floor(Math.random() * reviewIDChars.length)];
      }
      panel.review.id = `panelreview_${panel.gameInfo.id}_${steamId}_${random}`;
      if (panel.review.trigger === "panel") {
        panel.review.triggerCode1 = `data-target="#${panel.review.id}" data-toggle="collapse" `;
        panel.review.code = `<div style="padding: 0px 20px 0px 20px; border-bottom: 1px solid transparent;" id="${panel.review.id}" class="collapse"><div style="height: 10px"></div>${reviewConv}</div>`;
        if (panel.info.rating === "") {
          panel.review.triggerCode2 = `<div></div><div style="float: right; padding-right:10px;" class="collapsed" aria-expanded="false">More <i class="fa fa-level-down"></i></div>`;
        } else {
          panel.review.triggerCode2 = `<div style="float: right; padding-right:10px;" class="collapsed" aria-expanded="false">More <i class="fa fa-level-down"></i></div>`;
        }
      } else {
        panel.review.triggerCode1 = ``;
        panel.review.triggerCode2 = ``;
        panel.review.code = `<div style="padding: 0px 20px 0px 20px; border-bottom: 1px solid transparent;" id="${panel.review.id}"><div style="height: 10px"></div>${reviewConv}</div>`;
      }
    } else {
      panel.review.triggerCode1 = "";
      panel.review.triggerCode2 = "";
      panel.review.code = "";
    }
  }
};
const box = {
  code: "",
  update() {
    eIds.box.code.value = eIds.box.preview.innerHTML = box.code = `<li class="game-thumbnail game ${box.completionBar.code}" style="${box.background.code}">
<div class="title" ${box.image.height}>${box.gameInfo.name}</div>
${box.image.code}
${box.caption.code}</li>`;
  },
  updEverything() {
    $(eIds.box.appID).trigger("blur");
    $(eIds.box.title).trigger("blur");
    $(eIds.box.playtime).trigger("blur");
    $(eIds.box.achEarned).trigger("blur");
    $(eIds.box.achTotal).trigger("blur");
    $(eIds.box.platform).trigger("change");
    if (eIds.box.screenshotOn.classList.contains("active")) {
      $(eIds.box.screenshotOn).trigger("click")
    } else {
      $(eIds.box.screenshotOff).trigger("click")
    };
    if (eIds.box.minimalOn.classList.contains("active")) {
      $(eIds.box.minimalOn).trigger("click")
    } else {
      $(eIds.box.minimalOff).trigger("click")
    };
    $(eIds.box.preset).trigger("change");
    $(eIds.box.compColor).trigger("change");
    $(eIds.box.bgType).trigger("change");
    $(eIds.box.bgColor1).trigger("input");
    $(eIds.box.bgColor1Text).trigger("input");
    $(eIds.box.bgColor2).trigger("input");
    $(eIds.box.bgColor2Text).trigger("input");
    $(eIds.box.bgColor3).trigger("input");
    $(eIds.box.bgColor3Text).trigger("input");
    $(eIds.box.textColorPick).trigger("input")
    $(eIds.box.textColor).trigger("input");
    $(eIds.box.imageType).trigger("change");
    $(eIds.box.imageCustomUrl).trigger("blur");
    $(eIds.box.imageCustomLink).trigger("blur");
    $(eIds.box.review).trigger("blur")
  },
  gameInfo: {
    name: "Half-Life 2",
    id: "220",
    arrayPos: ""
  },
  completionBar: {
    col: "completed",
    code: "game-completed"
  },
  updCompletionBar(color) {
    if (color == "auto") {
      if (library.games[box.gameInfo.arrayPos].progress != undefined) {
        box.completionBar.col = library.games[box.gameInfo.arrayPos].progress;
      }
    } else if (color) box.completionBar.col = color;
    switch (box.completionBar.col) {
      case "completed":
        box.completionBar.code = "game-completed";
        break;
      case "beaten":
        box.completionBar.code = "game-beaten";
        break;
      case "unfinished":
        box.completionBar.code = "game-unfinished";
        break;
      case "wont play":
        box.completionBar.code = "game-wont-play";
        break;
      case "never played":
        box.completionBar.code = "game-never-played";
        break;
      case "hidden":
        box.completionBar.code = "";
        break;
    }
  },
  image: {
    type: "capsule", // Image type. Can be "capsule", "header", "logo", "custom" or "none"
    url: "", // URL of image. Used only if type is "custom"
    link: "",
    height: 'style="height: 69px;"',
    code: '<a href="https://store.steampowered.com/app/220/" target="_blank"><img alt="Half-Life 2" src="https://steamcdn-a.akamaihd.net/steam/apps/220/capsule_184x69.jpg"></a>'
  },
  updImage(type, url, link) {
    if (type) box.image.type = type;
    if (url) box.image.url = url;
    if (link != (undefined || null)) box.image.link = link;
    let tempURL;
    switch (box.image.type) {
      case "capsule":
        tempURL = `https://steamcdn-a.akamaihd.net/steam/apps/${box.gameInfo.id}/capsule_184x69.jpg`;
        box.image.height = 'style="height: 69px;"';
        break;
      case "header":
        tempURL = `https://steamcdn-a.akamaihd.net/steam/apps/${box.gameInfo.id}/header.jpg`;
        box.image.height = 'style="height: 86px;"';
        break;
      case "custom":
        tempURL = box.image.url;
        let tempImg = new Image();
        tempImg.src = tempURL;
        tempImg.onload = function () {
          let aspectRatio = tempImg.width / tempImg.height;
          let res = Math.ceil(184 / aspectRatio);
          box.image.height = `style="height: ${res}px;"`;
          box.update();
        };
        tempImg.onerror = async function () {
          console.log("Failed to load image!");
          if (box.image.type === "capsule") {
            let altImg = await getAltCapsule(box.gameInfo.id);
            if (altImg && tempURL !== altImg) {
              tempURL = tempImg.src = altImg;
            }
          }
        };
        break;
    }
    let imgLink;
    if (box.image.type == "custom" && box.image.link !== "") {
      imgLink = box.image.link;
    } else {
      imgLink = `https://store.steampowered.com/app/${box.gameInfo.id}/`;
    }
    box.image.code = `<a href="${imgLink}" target="_blank"><img src="${tempURL}"></a>`;
  },
  background: {
    predef: "none", // Pre-defined background. Can be none, completed, beaten, unfinished, won't play, never played or custom
    type: "solid", // Type of background. Can be "solid", "hor-gradient" or "vert-gradient"
    color1: "#FFFFFF",
    color2: "#FFFFFF", // Used only with "hor-gradient" and "ver-gradient"
    color3: "#FFFFFF",
    code: "",
  },
  updBackground(predef, type, col1, col2, col3) {
    if (predef) box.background.predef = predef;
    if (type) box.background.type = type;
    if (col1) box.background.color1 = col1;
    if (col2) box.background.color2 = col2;
    if (col3) box.background.color3 = col3;
    switch (box.background.predef) {
      case "none":
        box.background.code = "";
        break;
      case "completed":
        box.background.code = `background: linear-gradient(to bottom, #d9edf7, #bce8f1);`;
        break;
      case "beaten":
        box.background.code = `background: linear-gradient(to bottom, #dff0d8, #d6e9c6);`;
        break;
      case "unfinished":
        box.background.code = `background: linear-gradient(to bottom, #fcf8e3, #faebcc);`;
        break;
      case "wont-play":
        box.background.code = `background: linear-gradient(to bottom, #f2dede, #ebccd1);`;
        break;
      case "never-played":
        box.background.code = `background: linear-gradient(to bottom, #f5f5f5, #dddddd);`;
        break;
      case "custom":
        switch (box.background.type) {
          case "solid":
            box.background.code = `background: ${box.background.color1}`;
            break;
          case "hor-gradient":
            box.background.code = `background: linear-gradient(to right, ${box.background.color1}, ${box.background.color2});`;
            break;
          case "vert-gradient":
            box.background.code = `background: linear-gradient(to bottom, ${box.background.color1}, ${box.background.color2});`;
            break;
          case "hor-gradient3":
            box.background.code = `background: linear-gradient(to right, ${box.background.color1}, ${box.background.color2}, ${box.background.color3});`;
            break;
          case "vert-gradient3":
            box.background.code = `background: linear-gradient(to bottom, ${box.background.color1}, ${box.background.color2}, ${box.background.color3});`;
            break;
        }
        break;
    }
  },
  caption: {
    playtime: "0",
    achievements: "0",
    achievementsTotal: "0",
    color: "#000000",
    screenshot: false,
    platform: "none",
    minimalMode: false,
    achievementsCode: "no achievements",
    screenshotCode: "",
    platformCode: "",
    code: `<div class="caption" style="height: auto; padding-bottom: 9px;"><p>0 hours playtime</p><p>no achievements</p></div>`
  },
  updCaption(playtime, ach, achTotal, color, screenshot, platform, minimalMode) {
    let playtimeCalc = box.caption.playtime;
    if (playtime == "auto") {
      box.caption.playtime = library.games[box.gameInfo.arrayPos].playtime;
      if (box.caption.playtime % 60 == 0) {
        playtimeCalc = (box.caption.playtime / 60).toString();
        box.caption.playtime = playtimeCalc;
      } else {
        playtimeCalc = `${Math.floor(box.caption.playtime / 60)}.${Math.floor((box.caption.playtime % 60) / 6)}`;
        box.caption.playtime = playtimeCalc;
      }
    } else if (playtime != (undefined || null)) {
      if (playtime == "") {
        playtimeCalc = box.caption.playtime = "0";
      } else {
        playtimeCalc = box.caption.playtime = playtime;
      }
    }
    if (ach == "auto") {
      if (library.games[box.gameInfo.arrayPos].achievements != undefined) {
        box.caption.achievements =
          library.games[box.gameInfo.arrayPos].achievements.unlocked;
      } else {
        box.caption.achievements = 0;
      }
    } else if (ach != (undefined || null)) box.caption.achievements = ach;
    if (achTotal == "auto") {
      if (library.games[box.gameInfo.arrayPos].achievements != undefined) {
        box.caption.achievementsTotal =
          library.games[box.gameInfo.arrayPos].achievements.total;
      } else {
        box.caption.achievementsTotal = 0;
      }
    } else if (achTotal != (undefined || null))
      box.caption.achievementsTotal = achTotal;
    if (color != (undefined || null)) box.caption.color = color;
    if (screenshot != (undefined || null)) box.caption.screenshot = screenshot;
    if (platform != (undefined || null)) box.caption.platform = platform;
    if (minimalMode != (undefined || null)) box.caption.minimalMode = minimalMode;
    if (box.caption.achievementsTotal == 0) {
      box.caption.achievementsCode = "no achievements";
    } else if (steamId && box.gameInfo.arrayPos != "") {
      box.caption.achievementsCode = `<a href="https://steamcommunity.com/profiles/${steamId}/stats/${box.gameInfo.id}/?tab=achievements">${box.caption.achievements} of ${box.caption.achievementsTotal} achievements</a>`;
    } else {
      box.caption.achievementsCode = `${box.caption.achievements} of ${box.caption.achievementsTotal} achievements`;
    }
    if (box.caption.screenshot && steamId != "") {
      box.caption.screenshotCode = `<a href="https://steamcommunity.com/profiles/${steamId}/screenshots/?appid=${box.gameInfo.id}" title="View Steam screenshots"><i class="fa fa-camera" style="color: ${box.caption.color}; vertical-align: middle; font-size: 20px; padding: 2px 0;"></i></a>`;
    } else {
      box.caption.screenshotCode = "";
    }
    switch (box.caption.platform) {
      case "steam":
        box.caption.platformCode = `<img style="opacity: 1; height: 24px; width: 24px; position: initial;" src="https://img.icons8.com/metro/24/${box.caption.color.slice(1)}/steam.png" title="Played on Steam">`;
        break;
      case "gog":
        box.caption.platformCode = `<img style="opacity: 1; height: 24px; width: 24px; position: initial;" src="https://img.icons8.com/ios-filled/24/${box.caption.color.slice(1)}/gog-galaxy.png" title="Played on GoG">`;
        break;
      case "epicstore":
        box.caption.platformCode = `<img style="opacity: 1; height: 24px; width: 24px; position: initial;" src="https://img.icons8.com/ios-filled/24/${box.caption.color.slice(1)}/epic-games.png" title="Played on Epic Store">`;
        break;
      case "origin":
        box.caption.platformCode = `<img style="opacity: 1; height: 24px; width: 24px; position: initial;" src="https://img.icons8.com/ios-filled/24/${box.caption.color.slice(1)}/origin.png" title="Played on Origin">`;
        break;
      case "uplay":
        box.caption.platformCode = `<img style="opacity: 1; height: 24px; width: 24px; position: initial;" src="https://img.icons8.com/ios-filled/24/${box.caption.color.slice(1)}/uplay.png" title="Played on uPlay">`;
        break;
      case "microsoftstore":
        box.caption.platformCode = `<img style="opacity: 1; height: 24px; width: 24px; position: initial;" src="https://img.icons8.com/windows/24/${box.caption.color.slice(1)}/windows-10-store.png" title="Played on Microsoft Store">`;
        break;
      case "battlenet":
        box.caption.platformCode = `<img style="opacity: 1; height: 24px; width: 24px; position: initial;" src="https://img.icons8.com/ios-filled/24/${box.caption.color.slice(1)}/battle-net.png" title="Played on Battle.net">`;
        break;
      case "rockstargames":
        box.caption.platformCode = `<img style="opacity: 1; height: 24px; width: 24px; position: initial;" src="https://img.icons8.com/ios-filled/24/${box.caption.color.slice(1)}/rockstar-games.png" title="Played on Rockstar Games Launcher">`;
        break;
      case "itchio":
        box.caption.platformCode = `<img style="opacity: 1; height: 24px; width: 24px; position: initial;" src="https://img.icons8.com/ios-glyphs/24/${box.caption.color.slice(1)}/itch-io.png" title="Played on itch.io">`;
        break;
      case "amazon":
        box.caption.platformCode = `<i style="font-size: 24px; vertical-align: middle;" class="fa fa-amazon" title="Played on Amazon"></i>`;
        break;
      case "drmfree":
        box.caption.platformCode = `<i style="font-size: 24px; vertical-align: middle;" class="fa fa-unlock-alt" title="DRM-free"></i>`;
        break;
      case "android":
        box.caption.platformCode = '<i style="font-size: 24px; vertical-align: middle;" class="fa fa-android" title="Played on Android"></i>';
        break;
      case "ios":
        box.caption.platformCode = `<i style="font-size: 24px; vertical-align: middle;" class="fa fa-apple" title="Played on iOS"></i>`;
        break;
      case "playstation":
        box.caption.platformCode = `<img style="opacity: 1; height: 24px; width: 24px; position: initial;" src="https://img.icons8.com/metro/24/${box.caption.color.slice(1)}/play-station.png" title="Played on PlayStation">`;
        break;
      case "xbox":
        box.caption.platformCode = `<img style="opacity: 1; height: 24px; width: 24px; position: initial;" src="https://img.icons8.com/metro/24/${box.caption.color.slice(1)}/xbox.png" title="Played on Xbox">`;
        break;
      case "xgp":
        box.caption.platformCode = `<span style="font-weight: bold;" title="Played on Xbox Game Pass"><img style="opacity: 1; height: 24px; width: 24px; position: initial;" src="https://img.icons8.com/metro/24/${box.caption.color.slice(1)}/xbox.png"><span style="display: inline-block; line-height: 12px; margin: 0 3px 0 2px; vertical-align: middle; text-align: left; font-size: 12px;">GAME<br>PASS</span></span>`
        break;
      case "switch":
        box.caption.platformCode = `<img style="opacity: 1; height: 24px; width: 24px; position: initial;" src="https://img.icons8.com/ios-filled/24/${box.caption.color.slice(1)}/nintendo-switch.png" title="Played on Switch">`;
        break;
      case "none":
        box.caption.platformCode = "";
        break;
    }
    if (box.caption.minimalMode) {
      box.caption.code = "";
    } else {
      box.caption.code = `<div class="caption" style="background-color: transparent; height: auto; padding-bottom: 9px; color: ${box.caption.color}"><p>${box.caption.playtime} hours playtime</p><p>${box.caption.achievementsCode}</p><p>${box.caption.screenshotCode} ${box.caption.platformCode}</p></div>`
    }
  },
};
const progressBar = {
  code: "",
  update() {
    eIds.progressBar.code.value = eIds.progressBar.preview.innerHTML = progressBar.code = `<div class="list-progress">
${progressBar.completedCode}${progressBar.beatenCode}${progressBar.unfinishedCode}${progressBar.neverPlayedCode}${progressBar.wontPlayCode}
</div>`;
  },
  completed: 0,
  completedDecor: "none",
  completedCode: '',
  beaten: 0,
  beatenDecor: "none",
  beatenCode: '',
  unfinished: 0,
  unfinishedDecor: "none",
  unfinishedCode: '',
  neverPlayed: 0,
  neverPlayedDecor: "none",
  neverPlayedCode: '',
  wontPlay: 0,
  wontPlayDecor: "none",
  wontPlayCode: '',
  totalGames: 0,
  format: 0,
  updTotalGames(num1, num2, num3, num4, num5, format) {
    if (num1 == "") {
      progressBar.completed = 0;
    } else if (num1 != (null || undefined)) progressBar.completed = parseInt(num1);
    if (num2 == "") {
      progressBar.beaten = 0;
    } else if (num2 != (null || undefined)) progressBar.beaten = parseInt(num2);
    if (num3 == "") {
      progressBar.unfinished = 0;
    } else if (num3 != (null || undefined)) progressBar.unfinished = parseInt(num3);
    if (num4 == "") {
      progressBar.neverPlayed = 0;
    } else if (num4 != (null || undefined)) progressBar.neverPlayed = parseInt(num4);
    if (num5 == "") {
      progressBar.wontPlay = 0;
    } else if (num5 != (null || undefined)) progressBar.wontPlay = parseInt(num5);
    if (format != (null || undefined)) progressBar.format = parseInt(format);
    progressBar.totalGames = progressBar.completed + progressBar.beaten + progressBar.unfinished + progressBar.neverPlayed + progressBar.wontPlay;
    progressBar.updCompleted();
    progressBar.updBeaten();
    progressBar.updUnfinished();
    progressBar.updNeverPlayed();
    progressBar.updWontPlay();
  },
  updCompleted(decor) {
    if (decor) progressBar.completedDecor = decor;
    let decorCode;
    switch (progressBar.completedDecor) {
      case "none":
        decorCode = "";
        break;
      case "striped":
        decorCode = "progress-bar-striped"
        break;
      case "animated":
        decorCode = "progress-bar-striped active"
        break;
    }
    let width = progressBar.completed / progressBar.totalGames * 100;
    if (progressBar.completed != 0) {
      progressBar.completedCode = `<div class="progress-bar game-completed ${decorCode}" title="completed: ${progressBar.completed} of ${progressBar.totalGames} games" style="width: ${width}%; padding-left: 0px;">${width.toFixed(progressBar.format)}% (${progressBar.completed}/${progressBar.totalGames})</div>`
    } else {
      progressBar.completedCode = '';
    }
  },
  updBeaten(decor) {
    if (decor) progressBar.beatenDecor = decor;
    let decorCode;
    switch (progressBar.beatenDecor) {
      case "none":
        decorCode = "";
        break;
      case "striped":
        decorCode = "progress-bar-striped"
        break;
      case "animated":
        decorCode = "progress-bar-striped active"
        break;
    }
    let width = progressBar.beaten / progressBar.totalGames * 100;
    if (progressBar.beaten != 0) {
      progressBar.beatenCode = `<div class="progress-bar game-beaten ${decorCode}" title="beaten: ${progressBar.beaten} of ${progressBar.totalGames} games" style="width: ${width}%; padding-left: 0px;">${width.toFixed(progressBar.format)}% (${progressBar.beaten}/${progressBar.totalGames})</div>`
    } else {
      progressBar.beatenCode = '';
    }
  },
  updUnfinished(decor) {
    if (decor) progressBar.unfinishedDecor = decor;
    let decorCode;
    switch (progressBar.unfinishedDecor) {
      case "none":
        decorCode = "";
        break;
      case "striped":
        decorCode = "progress-bar-striped"
        break;
      case "animated":
        decorCode = "progress-bar-striped active"
        break;
    }
    let width = progressBar.unfinished / progressBar.totalGames * 100;
    if (progressBar.unfinished != 0) {
      progressBar.unfinishedCode = `<div class="progress-bar game-unfinished ${decorCode}" title="unfinished: ${progressBar.unfinished} of ${progressBar.totalGames} games" style="width: ${width}%; padding-left: 0px;">${width.toFixed(progressBar.format)}% (${progressBar.unfinished}/${progressBar.totalGames})</div>`
    } else {
      progressBar.unfinishedCode = '';
    }
  },
  updNeverPlayed(decor) {
    if (decor) progressBar.neverPlayedDecor = decor;
    let decorCode;
    switch (progressBar.neverPlayedDecor) {
      case "none":
        decorCode = "";
        break;
      case "striped":
        decorCode = "progress-bar-striped"
        break;
      case "animated":
        decorCode = "progress-bar-striped active"
        break;
    }
    let width = progressBar.neverPlayed / progressBar.totalGames * 100;
    if (progressBar.neverPlayed != 0) {
      progressBar.neverPlayedCode = `<div class="progress-bar game-never-played ${decorCode}" title="never played: ${progressBar.neverPlayed} of ${progressBar.totalGames} games" style="width: ${width}%; padding-left: 0px;">${width.toFixed(progressBar.format)}% (${progressBar.neverPlayed}/${progressBar.totalGames})</div>`
    } else {
      progressBar.neverPlayedCode = '';
    }
  },
  updWontPlay(decor) {
    if (decor) progressBar.wontPlayDecor = decor;
    let decorCode;
    switch (progressBar.wontPlayDecor) {
      case "none":
        decorCode = "";
        break;
      case "striped":
        decorCode = "progress-bar-striped"
        break;
      case "animated":
        decorCode = "progress-bar-striped active"
        break;
    }
    let width = progressBar.wontPlay / progressBar.totalGames * 100;
    if (progressBar.wontPlay != 0) {
      progressBar.wontPlayCode = `<div class="progress-bar game-wont-play ${decorCode}" title="won't play: ${progressBar.wontPlay} of ${progressBar.totalGames} games" style="width: ${width}%; padding-left: 0px;">${width.toFixed(progressBar.format)}% (${progressBar.wontPlay}/${progressBar.totalGames})</div>`
    } else {
      progressBar.wontPlayCode = "";
    }
  },
}
const hero = {
  code: "",
  update() {
    eIds.hero.code.value = eIds.hero.preview.innerHTML = hero.code = `<div style="position: relative; z-index: 10;">
<div style="border: 3px solid ${hero.colors.border}; border-radius: 30px; overflow: hidden">
<div style="position: relative; border: 3px solid ${hero.colors.border}; margin: -3px; overflow: hidden;">
${hero.image.code}
</div>
<div class="row" style="display: flex; flex-wrap: wrap; padding: 0 5px; margin-bottom: -1px; text-align: center; background-color: ${hero.colors.tileBg}; color: ${hero.colors.tileText}">
${hero.tiles.playtimeCode}
${hero.tiles.achievementsCode}${hero.tiles.screenshotCode}${hero.tiles.customTextCode}${hero.tiles.platformCode}${hero.review.triggerCode}
</div>
</div>
</div>
${hero.review.code}<br>`;
  },
  updEverything() {
    $(eIds.hero.appID).trigger("blur");
    $(eIds.hero.title).trigger("blur");
    $(eIds.hero.playtime).trigger("blur");
    $(eIds.hero.achEarned).trigger("blur");
    $(eIds.hero.achTotal).trigger("blur");
    $(eIds.hero.platform).trigger("change");
    $(eIds.hero.customText).trigger("blur");
    if (eIds.hero.screenshotOn.classList.contains("active")) {
      $(eIds.hero.screenshotOn).trigger("click")
    } else {
      $(eIds.hero.screenshotOff).trigger("click")
    };
    $(eIds.hero.borderColor).trigger("input");
    $(eIds.hero.borderColorText).trigger("input");
    $(eIds.hero.tileBgColor).trigger("input");
    $(eIds.hero.tileBgColorText).trigger("input");
    $(eIds.hero.tileContentColor).trigger("input");
    $(eIds.hero.tileContentColorText).trigger("blur");
    $(eIds.hero.colorPreset).trigger("change");
    if (eIds.hero.imageHeroBtn.classList.contains("active")) {
      $(eIds.hero.imageHeroBtn).trigger("click")
    } else {
      $(eIds.hero.imageCustomBtn).trigger("click")
    };
    $(eIds.hero.imageMinHeight).trigger("blur");
    $(eIds.hero.imageMaxHeight).trigger("blur");
    $(eIds.hero.imageCustomUrl).trigger("blur");
    $(eIds.hero.imageCustomLink).trigger("blur");
    $(eIds.hero.logoPosition).trigger("change");
    $(eIds.hero.logoSize).trigger("input");
    $(eIds.hero.logoXOffset).trigger("input");
    $(eIds.hero.logoYOffset).trigger("input");
    $(eIds.hero.logoCustomUrl).trigger("blur");
    if (eIds.hero.logoSizeCalcHeight.classList.contains("active")) {
      $(eIds.hero.logoSizeCalcHeight).trigger("click")
    } else {
      $(eIds.hero.logoSizeCalcWidth).trigger("click")
    };
    $(eIds.hero.reviewTrigger).trigger("change");
    $(eIds.hero.review).trigger("blur");
  },
  gameInfo: {
    name: "Half-Life 2",
    id: "220",
    arrayPos: ""
  },
  colors: {
    border: "#4499a9",
    tileText: "#000000",
    tileBg: "#d9edf7"
  },
  updColors(border, tileText, tileBg) {
    if (border) hero.colors.border = border;
    if (tileText) hero.colors.tileText = tileText;
    if (tileBg) hero.colors.tileBg = tileBg;
    this.updReview();
    this.updAllTiles();
  },
  image: {
    type: "hero", // Image type. Can be "hero" or "custom"
    pos: "center", // Position of logo. Can be "left" or "right". Used only if type is "hero"
    xOffset: 0,
    yOffset: 0,
    minHeight: "160",
    maxHeight: "240",
    size: "20", // Logo size. Used only if type is "hero"
    sizeCalc: "height",
    heroUrl: "", // URL of image. Used only if type is "custom"
    link: "",
    logoUrl: "",
    code: `<a href="https://store.steampowered.com/app/220"><img src="https://steamcdn-a.akamaihd.net/steam/apps/220/library_hero.jpg" style="object-fit: cover; min-height: 160px; width: 100%; max-height: 240px;"><img style="position: absolute;left: 50%; top: 50%; height: 20%; transform: translate(-50%, -50%);" src="https://steamcdn-a.akamaihd.net/steam/apps/220/logo.png"></a>`
  },
  updImage(type, pos, size, sizeCalc, xOffset, yOffset, minHeight, maxHeight, heroUrl, link, logoUrl) {
    if (type) hero.image.type = type;
    if (pos) hero.image.pos = pos;
    if (size) hero.image.size = size;
    if (sizeCalc) hero.image.sizeCalc = sizeCalc;
    if (xOffset != (undefined || null)) hero.image.xOffset = parseFloat(xOffset);
    if (yOffset != (undefined || null)) hero.image.yOffset = parseFloat(yOffset);
    if (minHeight != (undefined || null)) hero.image.minHeight = minHeight;
    if (maxHeight != (undefined || null)) hero.image.maxHeight = maxHeight;
    if (heroUrl) hero.image.heroUrl = heroUrl;
    if (link != (undefined || null)) hero.image.link = link;
    if (logoUrl != (undefined || null)) hero.image.logoUrl = logoUrl;
    let tempURL;
    switch (hero.image.type) {
      case "hero":
        tempURL = `https://steamcdn-a.akamaihd.net/steam/apps/${hero.gameInfo.id}/library_hero.jpg`;
        let tempImg = new Image();
        tempImg.src = tempURL;
        tempImg.onload = function () {
          $(eIds.hero.imageError).collapse('hide');
        }
        tempImg.onerror = function () {
          $(eIds.hero.imageError).collapse('show');
        };
        break;
      case "custom":
        tempURL = hero.image.heroUrl;
        break;
    }
    if (hero.image.type == "custom" && hero.image.link !== "") {
      imgLink = hero.image.link;
    } else {
      imgLink = `https://store.steampowered.com/app/${hero.gameInfo.id}/`;
    }
    let vert = "",
      hor = "",
      transform = "";
    switch (hero.image.pos) {
      case "topleft":
        vert = `top: ${0 + hero.image.yOffset}%;`;
        hor = `left: ${0 + hero.image.xOffset}%;`;
        transform = ``;
        break;
      case "topcenter":
        vert = `top: ${0 + hero.image.yOffset}%;`;
        hor = `left: ${50 + hero.image.xOffset}%;`;
        transform = `transform: translateX(-50%);`
        break;
      case "topright":
        vert = `top: ${0 + hero.image.yOffset}%;`;
        hor = `right: ${0 + hero.image.xOffset}%;`;
        transform = ``;
        break;
      case "centerleft":
        vert = `top: ${50 + hero.image.yOffset}%;`;
        hor = `left: ${0 + hero.image.xOffset}%;`;
        transform = `transform: translateY(-50%)`;
        break;
      case "center":
        vert = `top: ${50 + hero.image.yOffset}%;`;
        hor = `left: ${50 + hero.image.xOffset}%;`;
        transform = `transform: translate(-50%, -50%)`;
        break;
      case "centerright":
        vert = `top: ${50 + hero.image.yOffset}%;`;
        hor = `right: ${0 + hero.image.xOffset}%;`;
        transform = `transform: translateY(-50%)`;
        break;
      case "bottomleft":
        vert = `bottom: ${0 + hero.image.yOffset}%;`;
        hor = `left: ${0 + hero.image.xOffset}%;`;
        transform = ``;
        break;
      case "bottomcenter":
        vert = `bottom: ${0 + hero.image.yOffset}%;`;
        hor = `left: ${50 + hero.image.xOffset}%;`;
        transform = `transform: translateX(-50%);`;
        break;
      case "bottomright":
        vert = `bottom: ${0 + hero.image.yOffset}%;`;
        hor = `right: ${0 + hero.image.xOffset}%;`;
        transform = ``;
        break;
      case "hide":
        vert = hor = transform = "";
    };
    let logoTempUrl;
    if (hero.image.logoUrl != "") {
      logoTempUrl = hero.image.logoUrl;
    } else {
      logoTempUrl = `https://steamcdn-a.akamaihd.net/steam/apps/${hero.gameInfo.id}/logo.png`;
    }
    if (hero.image.pos === "hide") {
      hero.image.code = `<a href="${imgLink}"><img src="${tempURL}" style="object-fit: cover; min-height: ${hero.image.minHeight}px; width: 100%; max-height: ${hero.image.maxHeight}px;"></a>`;
    } else {
      hero.image.code = `<a href="${imgLink}"><img src="${tempURL}" style="object-fit: cover; min-height: ${hero.image.minHeight}px; width: 100%; max-height: ${hero.image.maxHeight}px;">
    <img style="position: absolute; object-fit:contain;${vert} ${hor} ${hero.image.sizeCalc}: ${hero.image.size}%; ${transform}" src="${logoTempUrl}"></a>`;
    }
  },
  review: {
    trigger: "button",
    id: "",
    triggerCode: "",
    code: ""
  },
  updReview(trigger) {
    if (trigger) hero.review.trigger = trigger;
    let reviewConv = markdownConverter.makeHtml(eIds.hero.review.value); // Get review from textarea and convert it Markdown to HTML
    if (reviewConv) {
      // If review is empty, it will be disabled
      let random = "";
      while (random.length < 5) {
        random +=
          reviewIDChars[Math.floor(Math.random() * reviewIDChars.length)];
      }
      hero.review.id = `heroreview_${hero.gameInfo.id}_${steamId}_${random}`;
      if (hero.review.trigger == "button") {
        hero.review.triggerCode = `<div data-target="#${hero.review.id}" data-toggle="collapse" style="cursor: pointer;position: absolute;width: 150px;height: 22px;left: 0;right: 0;bottom: -10px;background-color: ${hero.colors.border};border-radius: 8px;text-align: center;margin: 0 auto;color: #FFF;z-index: 1;text-shadow: 1px 1px 0px black;" class="collapsed"><p style="margin: 0;padding-top: 2px;line-height: 20px;">More <i class="fa fa-level-down"></i></p></div>`;
        hero.review.code = `<div style="padding: 38px 20px 0px 20px; border: 3px solid ${hero.colors.border}; border-top: 0; border-radius: 0 0 30px 30px; margin-top: -41px;" id="${hero.review.id}" class="collapse"><p style="padding-top: 10px">${reviewConv}</p></div>`;
      } else {
        hero.review.triggerCode = "";
        hero.review.code = `<div style="padding: 38px 20px 0px 20px; border: 3px solid ${hero.colors.border}; border-top: 0; border-radius: 0 0 30px 30px; margin-top: -41px;" id="${hero.review.id}"><p style="padding-top: 10px">${reviewConv}</p></div>`;
      }
    } else {
      hero.review.triggerCode = "";
      hero.review.code = "";
    }
  },
  tiles: {
    num: 2,
    playtime: "0",
    achievements: "0",
    achievementsTotal: "0",
    customText: "",
    screenshot: false,
    platform: "none",
    playtimeCode: `<div class="col-xs-6" style="padding: 10px 15px; border: 1px solid #4499a9;"><i class="fa fa-clock-o"></i> 0 hours</div>`,
    achievementsCode: `<div class="col-xs-6" style="padding: 10px 15px; border: 1px solid #4499a9;"><i class="fa fa-trophy"></i> None</div>`,
    customTextCode: "",
    screenshotCode: "",
    platformCode: ""
  },
  updTileCount() {
    hero.tiles.num = 2;
    if (hero.tiles.customText != "") hero.tiles.num++;
    if (hero.tiles.screenshot) hero.tiles.num++;
    if (hero.tiles.platform != "none") hero.tiles.num++;
  },
  updPlaytimeTile(playtime, update) {
    let playtimeCalc = hero.tiles.playtime;
    if (playtime == "auto") {
      hero.tiles.playtime = library.games[hero.gameInfo.arrayPos].playtime;
      if (hero.tiles.playtime % 60 == 0) {
        playtimeCalc = (hero.tiles.playtime / 60).toString();
        hero.tiles.playtime = playtimeCalc;
      } else {
        playtimeCalc = `${Math.floor(hero.tiles.playtime / 60)}.${Math.floor( (hero.tiles.playtime % 60) / 6 )}`;
        hero.tiles.playtime = playtimeCalc;
      }
    } else if (playtime != (undefined || null)) {
      if (playtime == "") {
        playtimeCalc = hero.tiles.playtime = "0";
      } else {
        playtimeCalc = hero.tiles.playtime = playtime;
      }
    }
    this.updTileCount();
    let size;
    switch (hero.tiles.num) {
      case 2:
        size = `col-xs-6`;
        break;
      case 3:
        size = `col-xs-4`;
        break;
      case 4:
        size = `col-xs-6 col-md-3`;
        break;
      case 5:
        size = `col-xs-4 col-md-2`;
        break;
    }
    hero.tiles.playtimeCode = `<div class="${size}" style="padding: 10px 15px; border: 1px solid ${hero.colors.border};"><i class="fa fa-clock-o"></i> ${hero.tiles.playtime} hours</div>`;
    if (!update) this.updAllTiles();
  },
  updAchievementTile(ach, achTotal, update) {
    if (ach == "auto") {
      if (library.games[hero.gameInfo.arrayPos].achievements != undefined) {
        hero.tiles.achievements =
          library.games[hero.gameInfo.arrayPos].achievements.unlocked;
      } else {
        hero.tiles.achievements = 0;
      }
    } else if (ach != (undefined || null)) hero.tiles.achievements = ach;
    if (achTotal == "auto") {
      if (library.games[hero.gameInfo.arrayPos].achievements != undefined) {
        hero.tiles.achievementsTotal =
          library.games[hero.gameInfo.arrayPos].achievements.total;
      } else {
        hero.tiles.achievementsTotal = 0;
      }
    } else if (achTotal != (undefined || null)) {
      hero.tiles.achievementsTotal = achTotal;
    }
    this.updTileCount();
    let size;
    switch (hero.tiles.num) {
      case 2:
        size = `col-xs-6`;
        break;
      case 3:
        size = `col-xs-4`;
        break;
      case 4:
        size = `col-xs-6 col-md-3`;
        break;
      case 5:
        size = `col-xs-4 col-md-2`;
        break;
    }
    if (hero.tiles.achievementsTotal == 0) {
      hero.tiles.achievementsCode = `<div class="${size}" style="padding: 10px 15px; border: 1px solid ${hero.colors.border};"><i class="fa fa-trophy"></i> None</div>`;
    } else if (steamId && hero.gameInfo.arrayPos != "") {
      hero.tiles.achievementsCode = `<div class="${size}" style="padding: 10px 15px; border: 1px solid ${hero.colors.border};"><a href="https://steamcommunity.com/profiles/${steamId}/stats/${hero.gameInfo.id}/?tab=achievements"><i class="fa fa-trophy"></i> ${hero.tiles.achievements}/${hero.tiles.achievementsTotal}</a></div>`;
    } else {
      hero.tiles.achievementsCode = `<div class="${size}" style="padding: 10px 15px; border: 1px solid ${hero.colors.border};"><i class="fa fa-trophy"></i> ${hero.tiles.achievements}/${hero.tiles.achievementsTotal}</div>`;
    }
    if (!update) this.updAllTiles();
  },
  updScreenshotTile(enable, update) {
    if (enable != (undefined || null)) hero.tiles.screenshot = enable;
    this.updTileCount();
    let size;
    switch (hero.tiles.num) {
      case 3:
        size = `col-xs-4`;
        break;
      case 4:
        size = `col-xs-6 col-md-3`;
        break;
      case 5:
        size = `col-xs-4 col-md-2`;
        break;
    }
    if (hero.tiles.screenshot) {
      hero.tiles.screenshotCode = `\n<div class="${size}" style="padding: 10px 15px; border: 1px solid ${hero.colors.border};"><a href="https://steamcommunity.com/profiles/${steamId}/screenshots/?appid=${hero.gameInfo.id}"><i class="fa fa-camera"></i> Screenshots</a></div>`;
    } else {
      hero.tiles.screenshotCode = ``;
    }
    if (!update) this.updAllTiles();
  },
  updCustomTile(text, update) {
    if (text != (undefined || null)) hero.tiles.customText = text;
    this.updTileCount();
    let size;
    switch (hero.tiles.num) {
      case 3:
        size = `col-xs-4`;
        break;
      case 4:
      case 5:
        size = `col-xs-6 col-md-3`;
        break;
    }
    if (hero.tiles.customText != "") {
      hero.tiles.customTextCode = `\n<div class="${size}" style="padding: 10px 15px; border: 1px solid ${hero.colors.border};">${hero.tiles.customText}</div>`
    } else {
      hero.tiles.customTextCode = "";
    }
    if (!update) this.updAllTiles();
  },
  updPlatformTile(platform, update) {
    if (platform != (undefined || null)) hero.tiles.platform = platform;
    let platformContent;
    switch (hero.tiles.platform) {
      case "steam":
        platformContent = `<img src="https://img.icons8.com/metro/21/${hero.colors.tileText.slice(1)}/steam.png" title="Played on Steam"> Played on Steam`;
        break;
      case "gog":
        platformContent = `<img src="https://img.icons8.com/ios-filled/21/${hero.colors.tileText.slice(1)}/gog-galaxy.png" title="Played on GoG"> Played on GoG`;
        break;
      case "epicstore":
        platformContent = `<img src="https://img.icons8.com/ios-filled/21/${hero.colors.tileText.slice(1)}/epic-games.png" title="Played on Epic Store"> Played on Epic`;
        break;
      case "origin":
        platformContent = `<img src="https://img.icons8.com/ios-filled/21/${hero.colors.tileText.slice(1)}/origin.png" title="Played on Origin"> Played on Origin`;
        break;
      case "uplay":
        platformContent = `<img src="https://img.icons8.com/ios-filled/21/${hero.colors.tileText.slice(1)}/uplay.png" title="Played on uPlay"> Played on uPlay`;
        break;
      case "microsoftstore":
        platformContent = `<img src="https://img.icons8.com/windows/21/${hero.colors.tileText.slice(1)}/windows-10-store.png" title="Played on Microsoft Store"> Played on Microsoft Store`;
        break;
      case "battlenet":
        platformContent = `<img src="https://img.icons8.com/ios-filled/21/${hero.colors.tileText.slice(1)}/battle-net.png" title="Played on Battle.net"> Played on Battle.net`;
        break;
      case "rockstargames":
        platformContent = `<img src="https://img.icons8.com/ios-filled/21/${hero.colors.tileText.slice(1)}/rockstar-games.png" title="Played on Rockstar Games Launcher"> Played on RGL`;
        break;
      case "itchio":
        platformContent = `<img src="https://img.icons8.com/ios-glyphs/21/${hero.colors.tileText.slice(1)}/itch-io.png" title="Played on itch.io"> Played on itch.io`;
        break;
      case "amazon":
        platformContent = `<i class="fa fa-amazon" title="Played on Amazon"></i> Played on Amazon`;
        break;
      case "drmfree":
        platformContent = `<i class="fa fa-unlock-alt" title="DRM-free"></i> DRM-free`;
        break;
      case "android":
        platformContent = '<i class="fa fa-android" title="Played on Android"></i> Played on Android';
        break;
      case "ios":
        platformContent = `<i class="fa fa-apple" title="Played on iOS"></i> Played on iOS`;
        break;
      case "playstation":
        platformContent = `<img src="https://img.icons8.com/metro/21/${hero.colors.tileText.slice(1)}/play-station.png" title="Played on PlayStation"> Played on Playstation`;
        break;
      case "xbox":
        platformContent = `<img src="https://img.icons8.com/metro/21/${hero.colors.tileText.slice(1)}/xbox.png" title="Played on Xbox"> Played on Xbox`;
        break;
      case "xgp":
        platformContent = `<span style="font-weight: bold;" title="Played on Xbox Game Pass"><img style="opacity: 1; height: 21px; width: 21px; position: initial;" src="https://img.icons8.com/metro/21/${hero.colors.tileText.slice(1)}/xbox.png"><span style="display: inline-block; line-height: 11px; margin: 0 3px 0 2px; vertical-align: middle; text-align: left; font-size: 11px;">GAME<br>PASS</span></span> Played on XGP`
        break;
      case "switch":
        platformContent = `<img src="https://img.icons8.com/ios-filled/21/${hero.colors.tileText.slice(1)}/nintendo-switch.png" title="Played on Switch"> Played on Switch`;
        break;
      case "none":
        platformContent = "";
        break;
    }
    let size;
    this.updTileCount();
    switch (hero.tiles.num) {
      case 3:
        size = `col-xs-4`;
        break;
      case 4:
      case 5:
        size = `col-xs-6 col-md-3`;
        break;
    }
    if (platformContent != "") {
      hero.tiles.platformCode = `\n<div class="${size}" style="padding: 10px 15px; border: 1px solid ${hero.colors.border};">${platformContent}</div>`;
    } else {
      hero.tiles.platformCode = "";
    }
    if (!update) this.updAllTiles();
  },
  updAllTiles() {
    this.updPlaytimeTile(null, true);
    this.updAchievementTile(null, null, true);
    this.updCustomTile(null, true);
    this.updScreenshotTile(null, true);
    this.updPlatformTile(null, true);
  },
}

function createGameNameArray() {
  if (!library) {
    return [];
  }
  gameNameArray = [];
  for (let i = 0; i < library.games.length; i++) {
    gameNameArray.push(library.games[i].name);
  }
  return gameNameArray;
}

function createGameIDArray() {
  if (!library) {
    return [];
  }
  gameIDArray = [];
  for (let i = 0; i < library.games.length; i++) {
    gameIDArray.push(library.games[i].steam_id.toString());
  }
  return gameIDArray;
}

async function fetchStats() { // Fetch user stats from BLAEO
  return fetch(`https://www.backlog-assassins.net/users/+${steamId}.json`, {
      headers: {
        Accept: "application/json"
      }
    })
    .then(res => res.json())
    .then(resjson => {
      user = resjson;
      localStorage.setItem("user", JSON.stringify(user));
      $("#fetcherroralert").hide();
    })
    .catch(() => {
      $("#fetcherror").html("stats");
      $("#fetcherroralert").show();
      return false;
    });
}

async function fetchLibrary() { // Fetch user library from BLAEO
  return fetch(
      `https://www.backlog-assassins.net/users/+${steamId}/games.json`, {
        headers: {
          Accept: "application/json"
        }
      }
    )
    .then(res => res.json())
    .then(resjson => {
      library = resjson;
      localStorage.setItem("library", JSON.stringify(library));
      $("#fetcherroralert").hide();
    })
    .catch(() => {
      $("#fetcherror").html("library");
      $("#fetcherroralert").show();
      return false;
    });
}
let awesompleteItem = function (t, e, n) {
  let progress;
  if (library.games[gameNameArray.indexOf(t.value)].progress != undefined) {
    progress = library.games[gameNameArray.indexOf(t.value)].progress;
    progress = progress.replace(/\s/g, '');
  } else {
    progress = "uncategorized"
  }
  let achievements;
  if (library.games[gameNameArray.indexOf(t.value)].achievements != undefined) {
    if (library.games[gameNameArray.indexOf(t.value)].achievements.unlocked != undefined) {
      achievements = `${library.games[gameNameArray.indexOf(t.value)].achievements.unlocked}/${library.games[gameNameArray.indexOf(t.value)].achievements.total}`;
    } else {
      achievements = `???/${library.games[gameNameArray.indexOf(t.value)].achievements.total}`
    }
  } else {
    achievements = "N/A";
  }
  let span = `<div class="col-auto" style="text-align: right"><i class="fa fa-clock-o"></i> ~${Math.round(library.games[gameNameArray.indexOf(t.value)].playtime / 60)}h <i class="fa fa-trophy"></i> ${achievements}</div>`;
  return Awesomplete.$.create("li", {
    innerHTML: `<div class="row"><div class="col">${"" === e.trim() ? t : t.replace(RegExp(Awesomplete.$.regExpEscape(e.trim()), "gi"), "<mark>$&</mark>")}</div>${span}</div>`,
    role: "option",
    "aria-selected": "false",
    "class": `autocomplete ${progress}`,
    "style": "min-height: 32px",
    id: "awesomplete_list_" + this.count + "_item_" + n
  })
}
// Set up game search
let barGameSearchAutocomplete = new Awesomplete(eIds.bar.search, {
  minChars: 1,
  list: createGameNameArray(),
  item: awesompleteItem
});
let panelGameSearchAutocomplete = new Awesomplete(eIds.panel.search, {
  minChars: 1,
  list: createGameNameArray(),
  item: awesompleteItem
});
let boxGameSearchAutocomplete = new Awesomplete(eIds.box.search, {
  minChars: 1,
  list: createGameNameArray(),
  item: awesompleteItem
});
let heroGameSearchAutocomplete = new Awesomplete(eIds.hero.search, {
  minChars: 1,
  list: createGameNameArray(),
  item: awesompleteItem
});
/* Bar bindings */
{
  eIds.bar.search.addEventListener("awesomplete-selectcomplete", function (name) {
    // After the user clicks searches for a game and then clicks it, look up its AppID, update game name, then update the AppID field
    eIds.bar.title.value = bar.gameInfo.name = name.text.label;
    bar.gameInfo.arrayPos = gameNameArray.indexOf(bar.gameInfo.name);
    bar.gameInfo.id = library.games[bar.gameInfo.arrayPos].steam_id;
    bar.updCompletionBar(null, "auto");
    bar.updImage();
    bar.updTitle();
    bar.updInfo("auto", "auto", "auto");
    // Update fields
    eIds.bar.appID.value = library.games[bar.gameInfo.arrayPos].steam_id;
    eIds.bar.playtime.value = bar.info.playtime;
    eIds.bar.achEarned.value = bar.info.achievements;
    eIds.bar.achTotal.value = bar.info.achievementsTotal;
    eIds.bar.compColor.value = bar.completionBar.col;
    bar.update();
  });

  eIds.bar.appID.onblur = function (el) {
    if (el.target.value === "") {
      bar.gameInfo.id = "220";
      bar.updImage();
      bar.update();
      return 0;
    } else {
      bar.gameInfo.id = el.target.value;
    }
    if (gameIDArray.indexOf(bar.gameInfo.id) != -1) {
      bar.gameInfo.arrayPos = gameIDArray.indexOf(bar.gameInfo.id);
    } else {
      bar.gameInfo.arrayPos = "";
      bar.updImage();
      bar.updInfo();
      bar.update();
      return 0;
    }
    bar.gameInfo.name = library.games[bar.gameInfo.arrayPos].name;
    bar.updCompletionBar(null, "auto");
    bar.updImage();
    bar.updTitle();
    bar.updInfo("auto", "auto", "auto");
    // Update fields
    eIds.bar.title.value = bar.gameInfo.name;
    eIds.bar.playtime.value = bar.info.playtime;
    eIds.bar.achEarned.value = bar.info.achievements;
    eIds.bar.achTotal.value = bar.info.achievementsTotal;
    eIds.bar.compColor.value = bar.completionBar.col;
    bar.update();
  };
  eIds.bar.title.onblur = function (el) {
    bar.gameInfo.name = el.target.value;
    bar.updTitle();
    bar.update();
  };
  eIds.bar.playtime.onblur = function (el) {
    bar.updInfo(el.target.value);
    bar.update();
  };
  // ...[,,,] is used to skip arguments
  eIds.bar.achEarned.onblur = function (el) {
    bar.updInfo(null, el.target.value);
    bar.update();
  };

  eIds.bar.achTotal.onblur = function (el) {
    bar.updInfo(...[, , ], el.target.value);
    bar.update();
  };
  eIds.bar.platform.onchange = function (el) {
    bar.updTitle(...[, , ], el.target.value);
    bar.update();
  };
  eIds.bar.customText.onblur = function (el) {
    bar.updInfo(...[, , , , ], el.target.value);
    bar.update();
  };
  eIds.bar.screenshotOn.onclick = function (el) {
    bar.updTitle(null, true);
    bar.update();
  };
  eIds.bar.screenshotOff.onclick = function (el) {
    bar.updTitle(null, false);
    bar.update();
  };
  eIds.bar.bgType.onchange = function (el) {
    bar.updBackground(el.target.value);
    switch (el.target.value) {
      case "solid":
        eIds.bar.bgColor2.disabled = true;
        eIds.bar.bgColor2Text.disabled = true;
        eIds.bar.bgColor3.disabled = true;
        eIds.bar.bgColor3Text.disabled = true;
        $(eIds.bar.bgMoreColors).collapse("hide");
        break;
      case "hor-gradient":
        eIds.bar.bgColor2.disabled = false;
        eIds.bar.bgColor2Text.disabled = false;
        eIds.bar.bgColor3.disabled = true;
        eIds.bar.bgColor3Text.disabled = true;
        $(eIds.bar.bgMoreColors).collapse("show");
        break;
      case "vert-gradient":
        eIds.bar.bgColor2.disabled = false;
        eIds.bar.bgColor2Text.disabled = false;
        eIds.bar.bgColor3.disabled = true;
        eIds.bar.bgColor3Text.disabled = true;
        $(eIds.bar.bgMoreColors).collapse("show");
        break;
      case "hor-gradient3":
        eIds.bar.bgColor2.disabled = false;
        eIds.bar.bgColor2Text.disabled = false;
        eIds.bar.bgColor3.disabled = false;
        eIds.bar.bgColor3Text.disabled = false;
        $(eIds.bar.bgMoreColors).collapse("show");
        break;
      case "vert-gradient3":
        eIds.bar.bgColor2.disabled = false;
        eIds.bar.bgColor2Text.disabled = false;
        eIds.bar.bgColor3.disabled = false;
        eIds.bar.bgColor3Text.disabled = false;
        $(eIds.bar.bgMoreColors).collapse("show");
        break;
    }
    bar.update();
  };

  eIds.bar.bgColor1.oninput = function (el) {
    eIds.bar.bgColor1Text.value = el.target.value.toUpperCase();
    bar.updBackground(null, el.target.value);
    bar.update();
  };
  eIds.bar.bgColor1Text.oninput = function (el) {
    if (el.target.value.substring(0, 1) != "#") {
      el.target.value = "#" + el.target.value;
    }
    let temp = el.target.value;
    while (temp.length < 7) {
      temp += "0";
    }
    eIds.bar.bgColor1.value = temp;
    bar.updBackground(null, temp);
    bar.update();
  };

  eIds.bar.bgColor2.oninput = function (el) {
    eIds.bar.bgColor2Text.value = el.target.value.toUpperCase();
    bar.updBackground(...[, , ], el.target.value);
    bar.update();
  };
  eIds.bar.bgColor2Text.oninput = function (el) {
    if (el.target.value.substring(0, 1) != "#") {
      el.target.value = "#" + el.target.value;
    }
    let temp = el.target.value;
    while (temp.length < 7) {
      temp += "0";
    }
    eIds.bar.bgColor2.value = temp;
    bar.updBackground(...[, , ], temp);
    bar.update();
  };

  eIds.bar.bgColor3.oninput = function (el) {
    eIds.bar.bgColor3Text.value = el.target.value.toUpperCase();
    bar.updBackground(...[, , , ], el.target.value);
    bar.update();
  };
  eIds.bar.bgColor3Text.oninput = function (el) {
    if (el.target.value.substring(0, 1) != "#") {
      el.target.value = "#" + el.target.value;
    }
    let temp = el.target.value;
    while (temp.length < 7) {
      temp += "0";
    }
    eIds.bar.bgColor3.value = temp;
    bar.updBackground(...[, , , ], temp);
    bar.update();
  };

  eIds.bar.imageType.onchange = function (el) {
    bar.updImage(el.target.value);
    if (el.target.value == "custom") {
      $(eIds.bar.imageCustomRow).collapse("show");
      eIds.bar.imagePos.disabled = false;
    } else if (el.target.value == "none") {
      $(eIds.bar.imageCustomRow).collapse("hide");
      eIds.bar.imagePos.disabled = true;
    } else {
      $(eIds.bar.imageCustomRow).collapse("hide");
      eIds.bar.imagePos.disabled = false;
    }
    bar.update();
  };

  eIds.bar.imagePos.onchange = function (el) {
    bar.updImage(null, el.target.value);
    bar.update();
  };

  eIds.bar.imageCustomUrl.onblur = function (el) {
    bar.updImage(...[, , ], el.target.value);
    bar.update();
  };

  eIds.bar.imageCustomLink.onblur = function (el) {
    bar.updImage(...[, , , ], el.target.value);
    bar.update();
  };

  eIds.bar.compPos.onchange = function (el) {
    bar.updCompletionBar(el.target.value);
    if (el.target.value == "hide") {
      eIds.bar.compColor.disabled = true;
    } else {
      eIds.bar.compColor.disabled = false;
    }
    bar.updImage();
    bar.update();
  };

  eIds.bar.compColor.onchange = function (el) {
    bar.updCompletionBar(null, el.target.value);
    bar.update();
  };

  eIds.bar.titleColorPick.oninput = function (el) {
    eIds.bar.titleColor.value = el.target.value.toUpperCase();
    bar.updTitle(el.target.value);
    bar.update();
  };
  eIds.bar.titleColor.onblur = function (el) {
    if (el.target.value.substring(0, 1) != "#") {
      el.target.value = "#" + el.target.value;
    }
    let temp = el.target.value;
    while (temp.length < 7) {
      temp += "0";
    }
    eIds.bar.titleColorPick.value = temp;
    bar.updTitle(temp);
    bar.update();
  };

  eIds.bar.textColorPick.oninput = function (el) {
    eIds.bar.textColor.value = el.target.value.toUpperCase();
    bar.updInfo(...[, , , ], el.target.value);
    bar.updReview();
    bar.update();
  };
  eIds.bar.textColor.oninput = function (el) {
    if (el.target.value.substring(0, 1) != "#") {
      el.target.value = "#" + el.target.value;
    }
    let temp = el.target.value;
    while (temp.length < 7) {
      temp += "0";
    }
    eIds.bar.textColorPick.value = temp;
    bar.updInfo(...[, , , ], temp);
    bar.updReview();
    bar.update();
  };

  eIds.bar.height.onchange = function (el) {
    bar.updHeight(el.target.value);
    if (el.target.value == "small" && bar.info.enabled) {
      eIds.bar.customText.disabled = true;
    } else {
      eIds.bar.customText.disabled = false;
    }
    bar.updInfo();
    bar.update();
  };

  eIds.bar.textShadowsOn.onclick = function () {
    bar.updTextShadow(true);
    bar.update();
  };
  eIds.bar.textShadowsOff.onclick = function () {
    bar.updTextShadow(false);
    bar.update();
  };
  eIds.bar.showInfoOn.onclick = function () {
    eIds.bar.playtime.disabled = false;
    eIds.bar.achEarned.disabled = false;
    eIds.bar.achTotal.disabled = false;
    if (bar.height == "55") {
      eIds.bar.customText.disabled = true;
    }
    bar.updInfo(...[, , , , , ], true)
    bar.update();
  };
  eIds.bar.showInfoOff.onclick = function () {
    eIds.bar.playtime.disabled = true;
    eIds.bar.achEarned.disabled = true;
    eIds.bar.achTotal.disabled = true;
    if (bar.height == "55") {
      eIds.bar.customText.disabled = false;
    }
    bar.updInfo(...[, , , , , ], false)
    bar.update();
  };

  eIds.bar.reviewTrigger.onchange = function (el) {
    bar.updReview(el.target.value);
    if (el.target.value == "button") {
      $(eIds.bar.reviewButtonRow).collapse("show");
    } else {
      $(eIds.bar.reviewButtonRow).collapse("hide");
    }
    bar.update();
  };

  eIds.bar.reviewButtonPick.oninput = function (el) {
    eIds.bar.reviewButton.value = el.target.value.toUpperCase();
    bar.updReview(null, el.target.value);
    bar.update();
  };
  eIds.bar.reviewButton.oninput = function (el) {
    if (el.target.value.substring(0, 1) != "#") {
      el.target.value = "#" + el.target.value;
    }
    let temp = el.target.value;
    while (temp.length < 7) {
      temp += "0";
    }
    eIds.bar.reviewButtonPick.value = temp;
    bar.updReview(null, temp);
    bar.update();
  };

  eIds.bar.reviewButtonTextPick.oninput = function (el) {
    eIds.bar.reviewButtonText.value = el.target.value.toUpperCase();
    bar.updReview(...[, , ], el.target.value);
    bar.update();
  };
  eIds.bar.reviewButtonText.oninput = function (el) {
    if (el.target.value.substring(0, 1) != "#") {
      el.target.value = "#" + el.target.value;
    }
    let temp = el.target.value;
    while (temp.length < 7) {
      temp += "0";
    }
    eIds.bar.reviewButtonTextPick.value = temp;
    bar.updReview(...[, , ], temp);
    bar.update();
  };
  eIds.bar.review.onblur = function () {
    bar.updReview();
    bar.update();
  };
  eIds.bar.codeCopy.onclick = function (el) {
    eIds.bar.code.select();
    try {
      document.execCommand("copy");
    } catch (err) {
      console.log("Unable to copy");
    }
  };
}
/* Panel bindings */
{
  eIds.panel.search.addEventListener("awesomplete-selectcomplete", function (
    name
  ) {
    // After the user clicks searches for a game and then clicks it, look up its AppID, update game name, then update the AppID field
    eIds.panel.title.value = panel.gameInfo.name = name.text.label;
    panel.gameInfo.arrayPos = gameNameArray.indexOf(panel.gameInfo.name);
    panel.gameInfo.id = library.games[panel.gameInfo.arrayPos].steam_id;
    panel.updImage();
    panel.updTitle();
    panel.updCompletionBar("auto");
    panel.updInfo("auto", "auto", "auto");
    // Update fields
    eIds.panel.appID.value = library.games[panel.gameInfo.arrayPos].steam_id;
    eIds.panel.playtime.value = panel.info.playtime;
    eIds.panel.achEarned.value = panel.info.achievements;
    eIds.panel.achTotal.value = panel.info.achievementsTotal;
    eIds.panel.compColor.value = panel.completionBar.col;
    panel.update();
  });
  eIds.panel.appID.onblur = function (el) {
    if (el.target.value === "") {
      panel.gameInfo.id = "220";
      panel.updImage();
      panel.update();
      return 0;
    } else {
      panel.gameInfo.id = el.target.value;
    }
    if (gameIDArray.indexOf(panel.gameInfo.id) != -1) {
      panel.gameInfo.arrayPos = gameIDArray.indexOf(panel.gameInfo.id);
    } else {
      panel.gameInfo.arrayPos = "";
      panel.updImage();
      panel.updInfo();
      panel.update();
      return 0;
    }
    panel.gameInfo.name = library.games[panel.gameInfo.arrayPos].name;
    panel.updImage();
    panel.updTitle();
    panel.updCompletionBar("auto");
    panel.updInfo("auto", "auto", "auto");
    // Update fields
    eIds.panel.title.value = panel.gameInfo.name;
    eIds.panel.playtime.value = panel.info.playtime;
    eIds.panel.achEarned.value = panel.info.achievements;
    eIds.panel.achTotal.value = panel.info.achievementsTotal;
    eIds.panel.compColor.value = panel.completionBar.col;
    panel.update();
  };
  eIds.panel.title.onblur = function (el) {
    panel.gameInfo.name = el.target.value;
    panel.updTitle();
    panel.update();
  };
  eIds.panel.playtime.onblur = function (el) {
    panel.updInfo(el.target.value);
    panel.update();
  };
  // ...[,,,] is used to skip arguments
  eIds.panel.achEarned.onblur = function (el) {
    panel.updInfo(null, el.target.value);
    panel.update();
  };
  eIds.panel.achTotal.onblur = function (el) {
    panel.updInfo(...[, , ], el.target.value);
    panel.update();
  };
  eIds.panel.platform.onchange = function (el) {
    panel.updTitle(null, el.target.value);
    panel.update();
  };
  eIds.panel.rating.onblur = function (el) {
    panel.updInfo(...[, , , ], el.target.value);
    panel.updReview();
    panel.update();
  };
  eIds.panel.customText.onblur = function (el) {
    panel.updTitle(...[, , ], el.target.value);
    panel.update();
  };
  eIds.panel.screenshotOn.onclick = function (el) {
    panel.updTitle(true);
    panel.update();
  };
  eIds.panel.screenshotOff.onclick = function (el) {
    panel.updTitle(false);
    panel.update();
  };
  eIds.panel.preset.onchange = function (el) {
    if (el.target.value === "custom") {
      $(eIds.panel.backgroundAndTextDiv1).collapse("show");
      $(eIds.panel.backgroundAndTextDiv2).collapse("show");
      $(eIds.panel.backgroundAndTextDiv3).collapse("show");
    } else {
      $(eIds.panel.backgroundAndTextDiv1).collapse("hide");
      $(eIds.panel.backgroundAndTextDiv2).collapse("hide");
      $(eIds.panel.backgroundAndTextDiv3).collapse("hide");
    }
    panel.updBgAndTextColor(el.target.value);
    panel.update();
  };
  eIds.panel.compColor.onchange = function (el) {
    panel.updCompletionBar(el.target.value);
    panel.update();
  };
  eIds.panel.bgType.onchange = function (el) {
    switch (el.target.value) {
      case "solid":
        eIds.panel.bgColor2.disabled = true;
        eIds.panel.bgColor2Text.disabled = true;
        eIds.panel.bgColor3.disabled = true;
        eIds.panel.bgColor3Text.disabled = true;
        break;
      case "hor-gradient":
        eIds.panel.bgColor2.disabled = false;
        eIds.panel.bgColor2Text.disabled = false;
        eIds.panel.bgColor3.disabled = true;
        eIds.panel.bgColor3Text.disabled = true;
        break;
      case "vert-gradient":
        eIds.panel.bgColor2.disabled = false;
        eIds.panel.bgColor2Text.disabled = false;
        eIds.panel.bgColor3.disabled = true;
        eIds.panel.bgColor3Text.disabled = true;
        break;
      case "hor-gradient3":
        eIds.panel.bgColor2.disabled = false;
        eIds.panel.bgColor2Text.disabled = false;
        eIds.panel.bgColor3.disabled = false;
        eIds.panel.bgColor3Text.disabled = false;
        break;
      case "vert-gradient3":
        eIds.panel.bgColor2.disabled = false;
        eIds.panel.bgColor2Text.disabled = false;
        eIds.panel.bgColor3.disabled = false;
        eIds.panel.bgColor3Text.disabled = false;
        break;
    }
    panel.updBgAndTextColor(null, el.target.value);
    panel.update();
  };
  eIds.panel.bgColor1.oninput = function (el) {
    eIds.panel.bgColor1Text.value = el.target.value.toUpperCase();
    panel.updBgAndTextColor(...[, , ], el.target.value);
    panel.update();
  };
  eIds.panel.bgColor1Text.oninput = function (el) {
    if (el.target.value.substring(0, 1) != "#") {
      el.target.value = "#" + el.target.value;
    }
    let temp = el.target.value;
    while (temp.length < 7) {
      temp += "0";
    }
    eIds.panel.bgColor1.value = temp;
    panel.updBgAndTextColor(...[, , ], temp);
    panel.update();
  };

  eIds.panel.bgColor2.oninput = function (el) {
    eIds.panel.bgColor2Text.value = el.target.value.toUpperCase();
    panel.updBgAndTextColor(...[, , , ], el.target.value);
    panel.update();
  };
  eIds.panel.bgColor2Text.oninput = function (el) {
    if (el.target.value.substring(0, 1) != "#") {
      el.target.value = "#" + el.target.value;
    }
    let temp = el.target.value;
    while (temp.length < 7) {
      temp += "0";
    }
    eIds.panel.bgColor2.value = temp;
    panel.updBgAndTextColor(...[, , , ], temp);
    panel.update();
  };

  eIds.panel.bgColor3.oninput = function (el) {
    eIds.panel.bgColor3Text.value = el.target.value.toUpperCase();
    panel.updBgAndTextColor(...[, , , , ], el.target.value);
    panel.update();
  };
  eIds.panel.bgColor3Text.oninput = function (el) {
    if (el.target.value.substring(0, 1) != "#") {
      el.target.value = "#" + el.target.value;
    }
    let temp = el.target.value;
    while (temp.length < 7) {
      temp += "0";
    }
    eIds.panel.bgColor3.value = temp;
    panel.updBgAndTextColor(...[, , , , ], temp);
    panel.update();
  };
  eIds.panel.textColorPick.oninput = function (el) {
    eIds.panel.textColor.value = el.target.value.toUpperCase();
    panel.updBgAndTextColor(...[, , , , , ], el.target.value);
    panel.update();
  };
  eIds.panel.textColor.onblur = function (el) {
    if (el.target.value.substring(0, 1) != "#") {
      el.target.value = "#" + el.target.value;
    }
    let temp = el.target.value;
    while (temp.length < 7) {
      temp += "0";
    }
    eIds.panel.textColorPick.value = temp;
    panel.updBgAndTextColor(...[, , , , , ], temp);
    panel.update();
  };
  eIds.panel.iconColorPick.oninput = function (el) {
    eIds.panel.iconColor.value = el.target.value.toUpperCase();
    panel.updInfo(...[, , , , ], el.target.value);
    panel.update();
  };
  eIds.panel.iconColor.oninput = function (el) {
    if (el.target.value.substring(0, 1) != "#") {
      el.target.value = "#" + el.target.value;
    }
    let temp = el.target.value;
    while (temp.length < 7) {
      temp += "0";
    }
    eIds.panel.iconColorPick.value = temp;
    panel.updInfo(...[, , , , ], temp);
    panel.update();
  };
  eIds.panel.imageHeaderBtn.onclick = function () {
    $(eIds.panel.imageCustomRow).collapse("hide");
    panel.updImage("header");
    panel.update();
  };
  eIds.panel.imageCustomBtn.onclick = function () {
    $(eIds.panel.imageCustomRow).collapse("show");
    panel.updImage("custom");
    panel.update();
  };
  eIds.panel.imageCustomUrl.onblur = function (el) {
    panel.updImage(null, el.target.value);
    panel.update();
  };
  eIds.panel.imageCustomLink.onblur = function (el) {
    panel.updImage(...[, , ], el.target.value);
    panel.update();
  };
  eIds.panel.reviewTrigger.onchange = function (el) {
    panel.updReview(el.target.value);
    panel.update();
  };
  eIds.panel.review.onblur = function () {
    panel.updReview();
    panel.update();
  };
  eIds.panel.codeCopy.onclick = function (el) {
    eIds.panel.code.select();
    try {
      document.execCommand("copy");
    } catch (err) {
      console.log("Unable to copy");
    }
  };
}
/* Box bindings */
{
  eIds.box.search.addEventListener("awesomplete-selectcomplete", function (name) {
    // After the user clicks searches for a game and then clicks it, look up its AppID, update game name, then update the AppID field
    eIds.box.title.value = box.gameInfo.name = name.text.label;
    box.gameInfo.arrayPos = gameNameArray.indexOf(box.gameInfo.name);
    box.gameInfo.id = library.games[box.gameInfo.arrayPos].steam_id;
    box.updImage();
    box.updCompletionBar("auto");
    box.updCaption("auto", "auto", "auto");
    // Update fields
    eIds.box.appID.value = library.games[box.gameInfo.arrayPos].steam_id;
    eIds.box.playtime.value = box.caption.playtime;
    eIds.box.achEarned.value = box.caption.achievements;
    eIds.box.achTotal.value = box.caption.achievementsTotal;
    eIds.box.compColor.value = box.completionBar.col;
    box.update();
  });
  eIds.box.appID.onblur = function (el) {
    if (el.target.value === "") {
      box.gameInfo.id = "220";
      box.updImage();
      box.update();
      return 0;
    } else {
      box.gameInfo.id = el.target.value;
    }
    if (gameIDArray.indexOf(box.gameInfo.id) != -1) {
      box.gameInfo.arrayPos = gameIDArray.indexOf(box.gameInfo.id);
    } else {
      box.gameInfo.arrayPos = "";
      box.updImage();
      box.updCaption();
      box.update();
      return 0;
    }
    box.gameInfo.name = library.games[box.gameInfo.arrayPos].name;
    box.updImage();
    box.updCompletionBar("auto");
    box.updCaption("auto", "auto", "auto");
    // Update fields
    eIds.box.title.value = box.gameInfo.name;
    eIds.box.playtime.value = box.caption.playtime;
    eIds.box.achEarned.value = box.caption.achievements;
    eIds.box.achTotal.value = box.caption.achievementsTotal;
    eIds.box.compColor.value = box.completionBar.col;
    box.update();
  };
  eIds.box.title.onblur = function (el) {
    box.gameInfo.name = el.target.value;
    box.update();
  };
  eIds.box.playtime.onblur = function (el) {
    box.updCaption(el.target.value);
    box.update();
  };
  // ...[,,,] is used to skip arguments
  eIds.box.achEarned.onblur = function (el) {
    box.updCaption(null, el.target.value);
    box.update();
  };

  eIds.box.achTotal.onblur = function (el) {
    box.updCaption(...[, , ], el.target.value);
    box.update();
  };
  eIds.box.platform.onchange = function (el) {
    box.updCaption(...[, , , , , ], el.target.value);
    box.update();
  };
  eIds.box.screenshotOn.onclick = function (el) {
    box.updCaption(...[, , , , ], true);
    box.update();
  };
  eIds.box.screenshotOff.onclick = function (el) {
    box.updCaption(...[, , , , ], false);
    box.update();
  };
  eIds.box.minimalOn.onclick = function (el) {
    eIds.box.playtime.disabled = true;
    eIds.box.achEarned.disabled = true;
    eIds.box.achTotal.disabled = true;
    eIds.box.platform.disabled = true;
    eIds.box.screenshotOn.disabled = true;
    eIds.box.screenshotOff.disabled = true;
    box.updCaption(...[, , , , , , ], true);
    box.update();
  };
  eIds.box.minimalOff.onclick = function (el) {
    eIds.box.playtime.disabled = false;
    eIds.box.achEarned.disabled = false;
    eIds.box.achTotal.disabled = false;
    eIds.box.platform.disabled = false;
    eIds.box.screenshotOn.disabled = false;
    eIds.box.screenshotOff.disabled = false;
    box.updCaption(...[, , , , , , ], false);
    box.update();
  };
  eIds.box.preset.onchange = function (el) {
    if (el.target.value === "custom") {
      $(eIds.box.backgroundAndTextDiv1).collapse("show");
      $(eIds.box.backgroundAndTextDiv2).collapse("show");
    } else {
      $(eIds.box.backgroundAndTextDiv1).collapse("hide");
      $(eIds.box.backgroundAndTextDiv2).collapse("hide");
    }
    box.updBackground(el.target.value);
    box.updCaption();
    box.update();
  };
  eIds.box.compColor.onchange = function (el) {
    box.updCompletionBar(el.target.value);
    box.update();
  };
  eIds.box.bgType.onchange = function (el) {
    switch (el.target.value) {
      case "solid":
        eIds.box.bgColor2.disabled = true;
        eIds.box.bgColor2Text.disabled = true;
        eIds.box.bgColor3.disabled = true;
        eIds.box.bgColor3Text.disabled = true;
        break;
      case "hor-gradient":
        eIds.box.bgColor2.disabled = false;
        eIds.box.bgColor2Text.disabled = false;
        eIds.box.bgColor3.disabled = true;
        eIds.box.bgColor3Text.disabled = true;
        break;
      case "vert-gradient":
        eIds.box.bgColor2.disabled = false;
        eIds.box.bgColor2Text.disabled = false;
        eIds.box.bgColor3.disabled = true;
        eIds.box.bgColor3Text.disabled = true;
        break;
      case "hor-gradient3":
        eIds.box.bgColor2.disabled = false;
        eIds.box.bgColor2Text.disabled = false;
        eIds.box.bgColor3.disabled = false;
        eIds.box.bgColor3Text.disabled = false;
        break;
      case "vert-gradient3":
        eIds.box.bgColor2.disabled = false;
        eIds.box.bgColor2Text.disabled = false;
        eIds.box.bgColor3.disabled = false;
        eIds.box.bgColor3Text.disabled = false;
        break;
    }
    box.updBackground(null, el.target.value);
    box.update();
  };
  eIds.box.bgColor1.oninput = function (el) {
    eIds.box.bgColor1Text.value = el.target.value.toUpperCase();
    box.updBackground(...[, , ], el.target.value);
    box.update();
  };
  eIds.box.bgColor1Text.oninput = function (el) {
    if (el.target.value.substring(0, 1) != "#") {
      el.target.value = "#" + el.target.value;
    }
    let temp = el.target.value;
    while (temp.length < 7) {
      temp += "0";
    }
    eIds.box.bgColor1.value = temp;
    box.updBackground(...[, , ], temp);
    box.update();
  };

  eIds.box.bgColor2.oninput = function (el) {
    eIds.box.bgColor2Text.value = el.target.value.toUpperCase();
    box.updBackground(...[, , , ], el.target.value);
    box.update();
  };
  eIds.box.bgColor2Text.oninput = function (el) {
    if (el.target.value.substring(0, 1) != "#") {
      el.target.value = "#" + el.target.value;
    }
    let temp = el.target.value;
    while (temp.length < 7) {
      temp += "0";
    }
    eIds.box.bgColor2.value = temp;
    box.updBackground(...[, , , ], temp);
    box.update();
  };

  eIds.box.bgColor3.oninput = function (el) {
    eIds.box.bgColor3Text.value = el.target.value.toUpperCase();
    box.updBackground(...[, , , , ], el.target.value);
    box.update();
  };
  eIds.box.bgColor3Text.oninput = function (el) {
    if (el.target.value.substring(0, 1) != "#") {
      el.target.value = "#" + el.target.value;
    }
    let temp = el.target.value;
    while (temp.length < 7) {
      temp += "0";
    }
    eIds.box.bgColor3.value = temp;
    box.updBackground(...[, , , , ], temp);
    box.update();
  };
  eIds.box.textColorPick.oninput = function (el) {
    eIds.box.textColor.value = el.target.value.toUpperCase();
    box.updCaption(...[, , , ], el.target.value);
    box.update();
  };
  eIds.box.textColor.onblur = function (el) {
    if (el.target.value.substring(0, 1) != "#") {
      el.target.value = "#" + el.target.value;
    }
    let temp = el.target.value;
    while (temp.length < 7) {
      temp += "0";
    }
    eIds.box.textColorPick.value = temp;
    box.updCaption(...[, , , ], temp);
    box.update();
  };
  eIds.box.imageType.onchange = function (el) {
    if (el.target.value == "custom") {
      $(eIds.box.imageCustomRow).collapse("show");
    } else {
      $(eIds.box.imageCustomRow).collapse("hide");
    }
    box.updImage(el.target.value);
    box.update();
  };
  eIds.box.imageCustomUrl.onblur = function (el) {
    box.updImage(null, el.target.value);
    box.update();
  };
  eIds.box.imageCustomLink.onblur = function (el) {
    box.updImage(...[, , ], el.target.value);
    box.update();
  };
  eIds.box.codeCopy.onclick = function (el) {
    eIds.box.code.select();
    try {
      document.execCommand("copy");
    } catch (err) {
      console.log("Unable to copy");
    }
  };
}
/* Progress bar bindings */
{
  eIds.progressBar.autofill.onclick = function () {
    eIds.progressBar.completed.value = user.statistics.completed;
    eIds.progressBar.beaten.value = user.statistics.beaten;
    eIds.progressBar.unfinished.value = user.statistics.unfinished;
    eIds.progressBar.neverPlayed.value = user.statistics.never_played;
    eIds.progressBar.wontPlay.value = user.statistics.wont_play;
    progressBar.updTotalGames(user.statistics.completed, user.statistics.beaten, user.statistics.unfinished, user.statistics.never_played, user.statistics.wont_play)
    progressBar.update();
  }
  eIds.progressBar.completed.oninput = function (el) {
    progressBar.updTotalGames(el.target.value);
    progressBar.update();
  }
  eIds.progressBar.beaten.oninput = function (el) {
    progressBar.updTotalGames(null, el.target.value);
    progressBar.update();
  }
  eIds.progressBar.unfinished.oninput = function (el) {
    progressBar.updTotalGames(...[, , ], el.target.value);
    progressBar.update();
  }
  eIds.progressBar.neverPlayed.oninput = function (el) {
    progressBar.updTotalGames(...[, , , ], el.target.value);
    progressBar.update();
  }
  eIds.progressBar.wontPlay.oninput = function (el) {
    progressBar.updTotalGames(...[, , , , ], el.target.value);
    progressBar.update();
  }
  eIds.progressBar.round.onchange = function (el) {
    progressBar.updTotalGames(...[, , , , , ], el.target.value);
    progressBar.update();
  }
  let barDropdowns = eIds.progressBar.barDropdown.getElementsByClassName("pbdropdown");
  [...barDropdowns].forEach(function (el, index) {
    el.onclick = function (el) {
      [...document.getElementsByClassName("pbdropdown")].forEach(function (el) {
        el.getElementsByTagName("span")[0].innerHTML = '';
      });
      completedDropdowns[index].getElementsByTagName("span")[0].innerHTML = '<i class="fa fa-check-circle"></i>';
      beatenDropdowns[index].getElementsByTagName("span")[0].innerHTML = '<i class="fa fa-check-circle"></i>';
      unfinishedDropdowns[index].getElementsByTagName("span")[0].innerHTML = '<i class="fa fa-check-circle"></i>';
      neverPlayedDropdowns[index].getElementsByTagName("span")[0].innerHTML = '<i class="fa fa-check-circle"></i>';
      wontPlayDropdowns[index].getElementsByTagName("span")[0].innerHTML = '<i class="fa fa-check-circle"></i>';
      progressBar.updCompleted(el.target.value);
      progressBar.updBeaten(el.target.value);
      progressBar.updUnfinished(el.target.value);
      progressBar.updNeverPlayed(el.target.value);
      progressBar.updWontPlay(el.target.value);
      progressBar.update();
    }
  })
  let completedDropdowns = eIds.progressBar.completedDecor.getElementsByClassName("pbdropdown");
  [...completedDropdowns].forEach(function (el) {
    el.onclick = function (el) {
      [...completedDropdowns].forEach(function (el) {
        el.getElementsByTagName("span")[0].innerHTML = '';
      });
      el.target.getElementsByTagName("span")[0].innerHTML = '<i class="fa fa-check-circle"></i>';
      progressBar.updCompleted(el.target.value);
      progressBar.update();
    }
  })
  let beatenDropdowns = eIds.progressBar.beatenDecor.getElementsByClassName("pbdropdown");
  [...beatenDropdowns].forEach(function (el) {
    el.onclick = function (el) {
      [...beatenDropdowns].forEach(function (el) {
        el.getElementsByTagName("span")[0].innerHTML = '';
      });
      el.target.getElementsByTagName("span")[0].innerHTML = '<i class="fa fa-check-circle"></i>';
      progressBar.updBeaten(el.target.value);
      progressBar.update();
    }
  })
  let unfinishedDropdowns = eIds.progressBar.unfinishedDecor.getElementsByClassName("pbdropdown");
  [...unfinishedDropdowns].forEach(function (el) {
    el.onclick = function (el) {
      [...unfinishedDropdowns].forEach(function (el) {
        el.getElementsByTagName("span")[0].innerHTML = '';
      });
      el.target.getElementsByTagName("span")[0].innerHTML = '<i class="fa fa-check-circle"></i>';
      progressBar.updUnfinished(el.target.value);
      progressBar.update();
    }
  })
  let neverPlayedDropdowns = eIds.progressBar.neverPlayedDecor.getElementsByClassName("pbdropdown");
  [...neverPlayedDropdowns].forEach(function (el) {
    el.onclick = function (el) {
      [...neverPlayedDropdowns].forEach(function (el) {
        el.getElementsByTagName("span")[0].innerHTML = '';
      });
      el.target.getElementsByTagName("span")[0].innerHTML = '<i class="fa fa-check-circle"></i>';
      progressBar.updNeverPlayed(el.target.value);
      progressBar.update();
    }
  })
  let wontPlayDropdowns = eIds.progressBar.wontPlayDecor.getElementsByClassName("pbdropdown");
  [...wontPlayDropdowns].forEach(function (el) {
    el.onclick = function (el) {
      [...wontPlayDropdowns].forEach(function (el) {
        el.getElementsByTagName("span")[0].innerHTML = '';
      });
      el.target.getElementsByTagName("span")[0].innerHTML = '<i class="fa fa-check-circle"></i>';
      progressBar.updWontPlay(el.target.value);
      progressBar.update();
    }
  })
  eIds.progressBar.codeCopy.onclick = function (el) {
    eIds.progressBar.code.select();
    try {
      document.execCommand("copy");
    } catch (err) {
      console.log("Unable to copy");
    }
  };
}
/* Hero bindings */
{
  eIds.hero.search.addEventListener("awesomplete-selectcomplete", function (name) {
    // After the user clicks searches for a game and then clicks it, look up its AppID, update game name, then update the AppID field
    eIds.hero.title.value = hero.gameInfo.name = name.text.label;
    hero.gameInfo.arrayPos = gameNameArray.indexOf(hero.gameInfo.name);
    hero.gameInfo.id = library.games[hero.gameInfo.arrayPos].steam_id;
    hero.updImage();
    hero.updPlaytimeTile("auto");
    hero.updAchievementTile("auto", "auto");
    switch (library.games[hero.gameInfo.arrayPos].progress) {
      case "completed":
        hero.updColors("#4499a9", "#000000", "#d9edf7");
        break;
      case "beaten":
        hero.updColors("#669a3c", "#000000", "#d6e9c6");
        break;
      case "unfinished":
        hero.updColors("#C07D3E", "#000000", "#faebcc");
        break;
      case "wont play":
        hero.updColors("#d9534f", "#000000", "#f1c2c0");
        break;
      case "never played":
        hero.updColors("#cccccc", "#000000", "#eeeeee");
        break;
    }
    // Update fields
    eIds.hero.appID.value = library.games[hero.gameInfo.arrayPos].steam_id;
    eIds.hero.playtime.value = hero.tiles.playtime;
    eIds.hero.achEarned.value = hero.tiles.achievements;
    eIds.hero.achTotal.value = hero.tiles.achievementsTotal;
    eIds.hero.colorPreset.value = library.games[hero.gameInfo.arrayPos].progress;
    hero.update();
  });

  eIds.hero.appID.onblur = function (el) {
    if (el.target.value === "") {
      hero.gameInfo.id = "220";
      hero.updImage();
      hero.update();
      return 0;
    } else {
      hero.gameInfo.id = el.target.value;
    }
    hero.updImage();
    if (gameIDArray.indexOf(hero.gameInfo.id) != -1) {
      hero.gameInfo.arrayPos = gameIDArray.indexOf(hero.gameInfo.id);
    } else {
      hero.gameInfo.arrayPos = "";
      hero.updImage();
      hero.updAchievementTile();
      hero.update();
      return 0;
    }
    hero.gameInfo.name = library.games[hero.gameInfo.arrayPos].name;
    hero.updPlaytimeTile("auto");
    hero.updAchievementTile("auto", "auto");
    // Update fields
    eIds.hero.title.value = hero.gameInfo.name;
    eIds.hero.playtime.value = hero.tiles.playtime;
    eIds.hero.achEarned.value = hero.tiles.achievements;
    eIds.hero.achTotal.value = hero.tiles.achievementsTotal;
    hero.update();
  };
  eIds.hero.title.onblur = function (el) {
    hero.gameInfo.name = el.target.value;
    hero.update();
  };
  eIds.hero.playtime.onblur = function (el) {
    hero.updPlaytimeTile(el.target.value);
    hero.update();
  };
  // ...[,,,] is used to skip arguments
  eIds.hero.achEarned.onblur = function (el) {
    hero.updAchievementTile(el.target.value);
    hero.update();
  };

  eIds.hero.achTotal.onblur = function (el) {
    hero.updAchievementTile(null, el.target.value);
    hero.update();
  };
  eIds.hero.platform.onchange = function (el) {
    hero.updPlatformTile(el.target.value);
    hero.update();
  };
  eIds.hero.customText.onblur = function (el) {
    hero.updCustomTile(el.target.value);
    hero.update();
  };
  eIds.hero.screenshotOn.onclick = function (el) {
    hero.updScreenshotTile(true);
    hero.update();
  };
  eIds.hero.screenshotOff.onclick = function (el) {
    hero.updScreenshotTile(false);
    hero.update();
  };

  eIds.hero.colorPreset.onchange = function (el) {
    switch (el.target.value) {
      case "completed":
        hero.updColors("#4499a9", "#000000", "#d9edf7");
        break;
      case "beaten":
        hero.updColors("#669a3c", "#000000", "#d6e9c6");
        break;
      case "unfinished":
        hero.updColors("#eb9114", "#000000", "#faebcc");
        break;
      case "wont play":
        hero.updColors("#d9534f", "#000000", "#f1c2c0");
        break;
      case "never played":
        hero.updColors("#cccccc", "#000000", "#eeeeee");
        break;
      case "custom":
        $(eIds.hero.borderColorText).trigger("input");
        $(eIds.hero.tileBgColorText).trigger("input");
        $(eIds.hero.tileContentColorText).trigger("input");
        break;
    }
    if (el.target.value === "custom") {
      eIds.hero.borderColor.disabled = eIds.hero.borderColorText.disabled = eIds.hero.tileBgColor.disabled = eIds.hero.tileBgColorText.disabled = eIds.hero.tileContentColor.disabled = eIds.hero.tileContentColorText.disabled = false;
    } else {
      eIds.hero.borderColor.disabled = eIds.hero.borderColorText.disabled = eIds.hero.tileBgColor.disabled = eIds.hero.tileBgColorText.disabled = eIds.hero.tileContentColor.disabled = eIds.hero.tileContentColorText.disabled = true;
    }
    hero.update();
  };

  eIds.hero.borderColor.oninput = function (el) {
    eIds.hero.borderColorText.value = el.target.value.toUpperCase();
    hero.updColors(el.target.value);
    hero.update();
  };
  eIds.hero.borderColorText.oninput = function (el) {
    if (el.target.value.substring(0, 1) != "#") {
      el.target.value = "#" + el.target.value;
    }
    let temp = el.target.value;
    while (temp.length < 7) {
      temp += "0";
    }
    eIds.hero.borderColor.value = temp;
    hero.updColors(temp);
    hero.update();
  };

  eIds.hero.tileBgColor.oninput = function (el) {
    eIds.hero.tileBgColorText.value = el.target.value.toUpperCase();
    hero.updColors(...[, , ], el.target.value);
    hero.update();
  };
  eIds.hero.tileBgColorText.oninput = function (el) {
    if (el.target.value.substring(0, 1) != "#") {
      el.target.value = "#" + el.target.value;
    }
    let temp = el.target.value;
    while (temp.length < 7) {
      temp += "0";
    }
    eIds.hero.tileBgColor.value = temp;
    hero.updColors(...[, , ], temp);
    hero.update();
  };
  eIds.hero.tileContentColor.oninput = function (el) {
    eIds.hero.tileContentColorText.value = el.target.value.toUpperCase();
    hero.updColors(null, el.target.value);
    hero.update();
  };
  eIds.hero.tileContentColorText.onblur = function (el) {
    if (el.target.value.substring(0, 1) != "#") {
      el.target.value = "#" + el.target.value;
    }
    let temp = el.target.value;
    while (temp.length < 7) {
      temp += "0";
    }
    eIds.hero.tileContentColor.value = temp;
    hero.updColors(null, temp);
    hero.update();
  };
  eIds.hero.imageHeroBtn.onclick = function () {
    $(eIds.hero.imageCustomRow).collapse("hide");
    hero.updImage("hero");
    hero.update();
  };
  eIds.hero.imageCustomBtn.onclick = function () {
    $(eIds.hero.imageCustomRow).collapse("show");
    $(eIds.hero.imageError).collapse('hide');
    hero.updImage("custom");
    hero.update();
  };
  eIds.hero.imageMinHeight.oninput = function (el) {
    if (el.target.value === "" || el.target.value === "0") {
      hero.updImage(...[, , , , , , ], "0")
    } else {
      hero.updImage(...[, , , , , , ], el.target.value)
    }
    hero.update();
  };
  eIds.hero.imageMaxHeight.oninput = function (el) {
    if (el.target.value === "" || el.target.value === "0") {
      hero.updImage(...[, , , , , , , ], "0")
    } else {
      hero.updImage(...[, , , , , , , ], el.target.value)
    }
    hero.update();
  };
  eIds.hero.imageCustomUrl.onblur = function (el) {
    hero.updImage(...[, , , , , , , , ], el.target.value);
    hero.update();
  };
  eIds.hero.imageCustomLink.onblur = function (el) {
    hero.updImage(...[, , , , , , , , , ], el.target.value);
    hero.update();
  };

  eIds.hero.logoPosition.onchange = function (el) {
    hero.updImage(null, el.target.value);
    hero.update();
    if (el.target.value === "hide") {
      eIds.hero.logoCustomUrl.disabled = eIds.hero.logoSize.disabled = eIds.hero.logoXOffset.disabled = eIds.hero.logoYOffset.disabled = true;
    } else {
      eIds.hero.logoCustomUrl.disabled = eIds.hero.logoSize.disabled = eIds.hero.logoXOffset.disabled = eIds.hero.logoYOffset.disabled = false;
    }
  };
  eIds.hero.logoSize.oninput = function (el) {
    if (el.target.value === "" || el.target.value === "0") {
      hero.updImage(...[, , ], "1")
    } else {
      hero.updImage(...[, , ], el.target.value)
    }
    hero.update();
  };
  eIds.hero.logoCustomUrl.onblur = function (el) {
    hero.updImage(...[, , , , , , , , , , ], el.target.value);
    hero.update();
  };
  eIds.hero.logoSizeCalcHeight.onclick = function () {
    hero.updImage(...[, , , ], "height");
    hero.update();
  };
  eIds.hero.logoSizeCalcWidth.onclick = function () {
    hero.updImage(...[, , , ], "width");
    hero.update();
  };
  eIds.hero.logoXOffset.oninput = function (el) {
    if (el.target.value === "") {
      hero.updImage(...[, , , , ], "0");
    } else {
      hero.updImage(...[, , , , ], el.target.value);
    }
    hero.update();
  };
  eIds.hero.logoYOffset.oninput = function (el) {
    if (el.target.value === "") {
      hero.updImage(...[, , , , , ], "0");
    } else {
      hero.updImage(...[, , , , , ], el.target.value);
    }
    hero.update();
  };

  eIds.hero.reviewTrigger.onchange = function (el) {
    hero.updReview(el.target.value);
    hero.update();
  };

  eIds.hero.review.onblur = function () {
    hero.updReview();
    hero.update();
  };

  eIds.hero.codeCopy.onclick = function (el) {
    eIds.hero.code.select();
    try {
      document.execCommand("copy");
    } catch (err) {
      console.log("Unable to copy");
    }
  };
}
/* Settings binds */
{
  eIds.settings.steamId.onblur = function (el) {
    steamId = el.target.value;
  };
  eIds.settings.syncButton.onclick = function () {
    sync();
  };
  eIds.settings.autoSyncOn.onclick = function () {
    localStorage.setItem("autosync", "true");
  };
  eIds.settings.autoSyncOff.onclick = function () {
    localStorage.setItem("autosync", "false");
  };
}

let genSave = [{ // Bar
    save1: [],
    save1Name: "",
    save2: [],
    save2Name: "",
    save3: [],
    save3Name: "",
    exitSave: [],
    exitSaveName: "",
    loadSave: [],
  },
  { // Panel
    save1: [],
    save1Name: "",
    save2: [],
    save2Name: "",
    save3: [],
    save3Name: "",
    exitSave: [],
    exitSaveName: "",
    loadSave: [],
  },
  { // Box
    save1: [],
    save1Name: "",
    save2: [],
    save2Name: "",
    save3: [],
    save3Name: "",
    exitSave: [],
    exitSaveName: "",
    loadSave: [],
  },
  { // Hero
    save1: [],
    save1Name: "",
    save2: [],
    save2Name: "",
    save3: [],
    save3Name: "",
    exitSave: [],
    exitSaveName: "",
    loadSave: [],
  }
];
let inputList = [byId("bargenerator").querySelectorAll("input, select, textarea:not([readonly])"), byId("panelgenerator").querySelectorAll("input, select, textarea:not([readonly])"), byId("boxgenerator").querySelectorAll("input, select"), byId("herogenerator").querySelectorAll("input, select, textarea:not([readonly])")];
let emptyBarSave = [{
    id: 'bargamesearch',
    val: ''
  },
  {
    id: 'bargametitle',
    val: ''
  },
  {
    id: 'barappid',
    val: ''
  },
  {
    id: 'barplaytime',
    val: ''
  },
  {
    id: 'barachearned',
    val: ''
  },
  {
    id: 'barachtotal',
    val: ''
  },
  {
    id: 'barcustomtext',
    val: ''
  },
  {
    id: 'barplatform',
    val: 'none'
  },
  {
    id: 'barscreenshoton',
    val: false
  },
  {
    id: 'barscreenshotoff',
    val: true
  },
  {
    id: 'barbgtype',
    val: 'solid'
  },
  {
    id: 'barbgcolor1',
    val: '#000000'
  },
  {
    id: 'barbgcolor1text',
    val: '#000000'
  },
  {
    id: 'barbgcolor2',
    val: '#000000'
  },
  {
    id: 'barbgcolor2text',
    val: '#000000'
  },
  {
    id: 'barbgcolor3',
    val: '#000000'
  },
  {
    id: 'barbgcolor3text',
    val: '#000000'
  },
  {
    id: 'barimagetype',
    val: 'capsule'
  },
  {
    id: 'barimagepos',
    val: 'right'
  },
  {
    id: 'barcustomimage',
    val: ''
  },
  {
    id: 'barcustomimagelink',
    val: ''
  },
  {
    id: 'barcomppos',
    val: 'left'
  },
  {
    id: 'barcompcolor',
    val: 'completed'
  },
  {
    id: 'bartitlecolorpick',
    val: '#ffffff'
  },
  {
    id: 'bartitlecolor',
    val: '#FFFFFF'
  },
  {
    id: 'bartextcolorpick',
    val: '#ffffff'
  },
  {
    id: 'bartextcolor',
    val: '#FFFFFF'
  },
  {
    id: 'barheight',
    val: 'medium'
  },
  {
    id: 'bartextshadowson',
    val: true
  },
  {
    id: 'bartextshadowsoff',
    val: false
  },
  {
    id: 'barshowinfoon',
    val: true
  },
  {
    id: 'barshowinfooff',
    val: false
  },
  {
    id: 'barreviewtrigger',
    val: 'bar'
  },
  {
    id: 'barbuttoncolorpick',
    val: '#aaaaaa'
  },
  {
    id: 'barbuttoncolor',
    val: '#AAAAAA'
  },
  {
    id: 'barbuttontextcolorpick',
    val: '#ffffff'
  },
  {
    id: 'barbuttontextcolor',
    val: '#FFFFFF'
  },
  {
    id: 'barreviewfield',
    val: ''
  }
];
let emptyPanelSave = [{
    id: 'panelgamesearch',
    val: ''
  },
  {
    id: 'panelgametitle',
    val: ''
  },
  {
    id: 'panelappid',
    val: ''
  },
  {
    id: 'panelplaytime',
    val: ''
  },
  {
    id: 'panelachearned',
    val: ''
  },
  {
    id: 'panelachtotal',
    val: ''
  },
  {
    id: 'panelrating',
    val: ''
  },
  {
    id: 'panelcustomtext',
    val: ''
  },
  {
    id: 'panelplatform',
    val: 'none'
  },
  {
    id: 'panelscreenshoton',
    val: false
  },
  {
    id: 'panelscreenshotoff',
    val: true
  },
  {
    id: 'panelpreset',
    val: 'info'
  },
  {
    id: 'panelbgtype',
    val: 'solid'
  },
  {
    id: 'panelbgcolor1',
    val: '#000000'
  },
  {
    id: 'panelbgcolor1text',
    val: '#000000'
  },
  {
    id: 'panelbgcolor2',
    val: '#000000'
  },
  {
    id: 'panelbgcolor2text',
    val: '#000000'
  },
  {
    id: 'panelbgcolor3',
    val: '#000000'
  },
  {
    id: 'panelbgcolor3text',
    val: '#000000'
  },
  {
    id: 'paneltextcolorpick',
    val: '#ffffff'
  },
  {
    id: 'paneltextcolor',
    val: '#FFFFFF'
  },
  {
    id: 'paneliconcolorpick',
    val: '#ffffff'
  },
  {
    id: 'paneliconcolor',
    val: '#FFFFFF'
  },
  {
    id: 'panelheaderimage',
    val: true
  },
  {
    id: 'panelcustomimage',
    val: false
  },
  {
    id: 'panelcompcolor',
    val: 'completed'
  },
  {
    id: 'panelcustomimageurl',
    val: ''
  },
  {
    id: 'panelcustomimagelink',
    val: ''
  },
  {
    id: 'panelreviewfield',
    val: ''
  }
];
let emptyBoxSave = [{
    id: 'boxgamesearch',
    val: ''
  },
  {
    id: 'boxgametitle',
    val: ''
  },
  {
    id: 'boxappid',
    val: ''
  },
  {
    id: 'boxplaytime',
    val: ''
  },
  {
    id: 'boxachearned',
    val: ''
  },
  {
    id: 'boxachtotal',
    val: ''
  },
  {
    id: 'boxplatform',
    val: 'none'
  },
  {
    id: 'boxscreenshoton',
    val: false
  },
  {
    id: 'boxscreenshotoff',
    val: true
  },
  {
    id: 'boxminimalon',
    val: false
  },
  {
    id: 'boxminimaloff',
    val: true
  },
  {
    id: 'boxpreset',
    val: 'none'
  },
  {
    id: 'boxbgtype',
    val: 'solid'
  },
  {
    id: 'boxbgcolor1',
    val: '#ffffff'
  },
  {
    id: 'boxbgcolor1text',
    val: '#FFFFFF'
  },
  {
    id: 'boxbgcolor2',
    val: '#ffffff'
  },
  {
    id: 'boxbgcolor2text',
    val: '#FFFFFF'
  },
  {
    id: 'boxbgcolor3',
    val: '#ffffff'
  },
  {
    id: 'boxbgcolor3text',
    val: '#FFFFFF'
  },
  {
    id: 'boxtextcolorpick',
    val: '#000000'
  },
  {
    id: 'boxtextcolor',
    val: '#000000'
  },
  {
    id: 'boximagetype',
    val: 'capsule'
  },
  {
    id: 'boxcompcolor',
    val: 'completed'
  },
  {
    id: 'boxcustomimageurl',
    val: ''
  },
  {
    id: 'boxcustomimagelink',
    val: ''
  }
];
let emptyHeroSave = [{
  id: "herogamesearch",
  val: ""
}, {
  id: "herogametitle",
  val: ""
}, {
  id: "heroappid",
  val: ""
}, {
  id: "heroplaytime",
  val: ""
}, {
  id: "heroachearned",
  val: ""
}, {
  id: "heroachtotal",
  val: ""
}, {
  id: "herocustomtext",
  val: ""
}, {
  id: "heroplatform",
  val: "none"
}, {
  id: "heroscreenshoton",
  val: false
}, {
  id: "heroscreenshotoff",
  val: true
}, {
  id: "heroreviewtrigger",
  val: "button"
}, {
  id: "heroreviewfield",
  val: ""
}, {
  id: "herocolorpreset",
  val: "completed"
}, {
  id: "herobordercolor",
  val: "#ffffff"
}, {
  id: "herobordercolortext",
  val: "#FFFFFF"
}, {
  id: "herotilebgcolor",
  val: "#ffffff"
}, {
  id: "herotilebgcolortext",
  val: "#FFFFFF"
}, {
  id: "herotilecontentcolor",
  val: "#000000"
}, {
  id: "herotilecontentcolortext",
  val: "#000000"
}, {
  id: "heroheroimage",
  val: true
}, {
  id: "herocustomimage",
  val: false
}, {
  id: "heroimageminheight",
  val: "160"
}, {
  id: "heroimagemaxheight",
  val: "240"
}, {
  id: "herocustomimageurl",
  val: ""
}, {
  id: "herocustomimagelink",
  val: ""
}, {
  id: "herologopos",
  val: "center"
}, {
  id: "herocustomlogourl",
  val: ""
}, {
  id: "herologocalcheight",
  val: true
}, {
  id: "herologocalcwidth",
  val: false
}, {
  id: "herologosize",
  val: "20"
}, {
  id: "heroxoffset",
  val: "0"
}, {
  id: "heroyoffset",
  val: "0"
}];

function checkIfSaveModified(el) {
  if (byId(el.id).tagName === "LABEL") {
    if (byId(el.id).classList.contains("active") != el.val) {
      return true;
    }
  } else {
    if (byId(el.id).value != el.val) {
      return true;
    }
  }
};
window.addEventListener("beforeunload", function () { // Trigger autosave when site is closed
  let saved = false;
  let barCustom = emptyBarSave.some(checkIfSaveModified);
  let panelCustom = emptyPanelSave.some(checkIfSaveModified);
  let boxCustom = emptyBoxSave.some(checkIfSaveModified);
  let heroCustom = emptyHeroSave.some(checkIfSaveModified);
  let time = new Date();
  if (barCustom) {
    saved = true;
    save(0, "exitSave", time.toLocaleString())
  }
  if (panelCustom) {
    saved = true;
    save(1, "exitSave", time.toLocaleString())
  }
  if (boxCustom) {
    saved = true;
    save(2, "exitSave", time.toLocaleString())
  }
  if (heroCustom) {
    saved = true;
    save(3, "exitSave", time.toLocaleString())
  }
  if (saved) {
    localStorage.setItem("save", JSON.stringify(genSave));
  }
});

[...document.getElementsByClassName("savedropdown")].forEach((gen, genIndex) => {
  [...gen.getElementsByClassName("dropdown-item")].forEach((el, index) => {
    el.onclick = function () {
      triggerSaveModal(genIndex, index, el)
    }
  });
});
[...document.getElementsByClassName("loaddropdown")].forEach((gen, genIndex) => {
  [...gen.getElementsByClassName("dropdown-item")].forEach((el, index) => {
    el.onclick = function () {
      triggerLoadModal(genIndex, index)
    }
  });
});
[...byId("loadsavereset").getElementsByClassName("btn")].forEach((el, index) => {
  el.onclick = function () {
    triggerLoadsaveResetModal(index)
  }
});
const genNames = ["bar", "panel", "box", "hero"];

function triggerSaveModal(gen, sav, el) {
  let savString;
  if (sav == 3) {
    savString = "loadsave"
    $(eIds.saveModal.loadsaveMsg).show();
    $(eIds.saveModal.saveNameDiv).hide();
  } else {
    savString = "save " + (sav + 1);
    $(eIds.saveModal.loadsaveMsg).hide();
    $(eIds.saveModal.saveNameDiv).show();
  }
  eIds.saveModal.label.innerHTML = `Saving in ${genNames[gen]} ${savString}`;
  eIds.saveModal.btn.onclick = function () {
    if (eIds.saveModal.saveName.value != "") {
      document.getElementsByClassName("loaddropdown")[gen].getElementsByClassName("saveName")[sav].innerHTML = eIds.saveModal.saveName.value;
      el.getElementsByClassName("saveName")[0].innerHTML = eIds.saveModal.saveName.value;
    } else if (sav != 3) {
      document.getElementsByClassName("loaddropdown")[gen].getElementsByClassName("saveName")[sav].innerHTML = "no name";
      el.getElementsByClassName("saveName")[0].innerHTML = "no name";
      eIds.saveModal.saveName.value = "no name";
    }
    save(gen, sav, eIds.saveModal.saveName.value);
    eIds.saveModal.saveName.value = "";
  }
}

function triggerLoadModal(gen, sav) {
  if (sav == 3) {
    savString = "exitsave"
  } else if (sav == 4) {
    savString = "loadsave"
  } else {
    savString = "save " + (sav + 1);
  }
  eIds.loadModal.label.innerHTML = `Loading ${genNames[gen]} ${savString}`;
  eIds.loadModal.btn.onclick = function () {
    load(gen, sav);
  }
}

function triggerLoadsaveResetModal(gen) {
  eIds.loadsaveResetModal.label.innerHTML = `Resetting ${genNames[gen]} loadsave`;
  eIds.loadsaveResetModal.btn.onclick = function () {
    genSave[gen].loadSave = [];
    $.notify("Loadsave reset!", {
      globalPosition: "bottom right",
      className: "success"
    });
  }
}

function load(gen, sav) {
  let savString;
  if (sav == 3) {
    savString = "exitSave"
  } else if (sav == 4) {
    savString = "loadSave"
  } else {
    savString = "save" + (sav + 1);
  }
  genSave[gen][savString].forEach(function (el) {
    if (byId(el.id).tagName === "LABEL") {
      if (el.val) {
        byId(el.id).classList.add("active");
        byId(el.id).setAttribute("aria-pressed", "true");
      } else {
        byId(el.id).classList.remove("active");
        byId(el.id).setAttribute("aria-pressed", "false")
      }
    } else {
      byId(el.id).value = el.val;
    }
  })
  if (sav != 4) {
    $.notify("Load completed!", {
      globalPosition: "bottom right",
      className: "success"
    });
  }
  switch (gen) {
    case 0:
      bar.updEverything();
      break;
    case 1:
      panel.updEverything();
      break;
    case 2:
      box.updEverything();
      break;
    case 3:
      hero.updEverything();
      break;
  }
}

function save(gen, sav, name) {
  let savString;
  if (sav == 3) {
    savString = "loadSave"
  } else if (sav == "exitSave") {
    savString = sav;
  } else {
    savString = "save" + (sav + 1);
  }
  genSave[gen][savString] = [];
  for (let item of inputList[gen]) {
    if (item.type === "radio") {
      if (item.parentElement.classList.contains("active")) {
        genSave[gen][savString].push({
          id: item.parentElement.id,
          val: true
        });
      } else {
        genSave[gen][savString].push({
          id: item.parentElement.id,
          val: false
        });
      }
    } else {
      genSave[gen][savString].push({
        id: item.id,
        val: item.value
      });
    }
  }
  if (name) genSave[gen][savString + "Name"] = name;
  localStorage.setItem("save", JSON.stringify(genSave));
  $.notify("Save completed!", {
    globalPosition: "bottom right",
    className: "success"
  });
}

function updateAutocomplete() {
  barGameSearchAutocomplete.list = panelGameSearchAutocomplete.list = boxGameSearchAutocomplete.list = heroGameSearchAutocomplete.list = createGameNameArray();
}

function sync() {
  $(eIds.settings.syncingMsg).show();
  fetchStats()
    .then(() => fetchLibrary())
    .then(() => {
      $(eIds.settings.syncingMsg).hide();
      let time = new Date();
      eIds.settings.lastSyncDate.innerHTML = time.toLocaleString();
      localStorage.setItem("lastSyncString", time.toLocaleString());
      localStorage.setItem("lastsSync", time.getTime());
      eIds.settings.userStats.innerHTML = `BLAEO username: <a href="https://www.backlog-assassins.net/users/${user.id}">${user.display_name}</a><br>
Steam profile: <a href="https://steamcommunity.com/profiles/${steamId}">https://steamcommunity.com/profiles/${steamId}</a><br>
Games: ${user.statistics.games}<br>
Completed games: ${user.statistics.completed}<br>
Beaten games: ${user.statistics.beaten}<br>
Unfinished games: ${user.statistics.unfinished}<br>
Never played games: ${user.statistics.never_played}<br>
Won't play games: ${user.statistics.wont_play}<br>
Uncategorized games: <a href="https://www.backlog-assassins.net/users/${user.id}/games/uncategorized">${user.statistics.uncategorized}</a>`;
      eIds.bar.search.disabled = eIds.panel.search.disabled = eIds.box.search.disabled = eIds.progressBar.autofill.disabled = eIds.hero.search.disabled = false;
      updateAutocomplete();
      createGameIDArray();
      $.notify("Sync completed!", {
        globalPosition: "bottom right",
        className: "success"
      });
    })
    .catch(() => {
      $(eIds.settings.syncingMsg).hide();
      $.notify("Sync failed! Check the options tab for details.", {
        autoHideDelay: 15000,
        globalPosition: "bottom right",
        className: "error"
      });
    });
}
$(".copybutton").popover({
  trigger: "focus",
  template: '<div class="popover" role="tooltip" style="background-color: #5CB85C;"><div class="arrow copyarrow"></div><div class="popover-body" style="color: #FFFFFF;"></div></div>',
  title: "Copied!",
  placement: "right",
  delay: {
    hide: 3000
  }
});

bar.update();
panel.update();
box.update();
progressBar.update();
hero.update();
createGameIDArray();
if (localStorage.getItem("autosync") === null) {
  localStorage.setItem("autosync", "true");
}

eIds.other.firstVisitMsgBtn.onclick = () => {
  localStorage.setItem("firstvisit", "true");
}
eIds.other.firstVisitMsgSettingsLink.addEventListener("click", () => {
  $("#settingsnav").tab('show');
});

// Load saved info
if (localStorage.getItem("autosync") === "false") {
  eIds.settings.autoSyncOff.classList.add("active");
  eIds.settings.autoSyncOff.setAttribute("aria-pressed", "true");
  eIds.settings.autoSyncOn.classList.remove("active");
  eIds.settings.autoSyncOn.setAttribute("aria-pressed", "false");
} else {
  eIds.settings.autoSyncOff.classList.remove("active");
  eIds.settings.autoSyncOff.setAttribute("aria-pressed", "false");
  eIds.settings.autoSyncOn.classList.add("active");
  eIds.settings.autoSyncOn.setAttribute("aria-pressed", "true");
}
if (localStorage.getItem("user") !== null) {
  eIds.bar.search.disabled = eIds.panel.search.disabled = eIds.box.search.disabled = eIds.progressBar.autofill.disabled = eIds.hero.search.disabled = false;
  user = JSON.parse(localStorage.getItem("user"));
  steamId = eIds.settings.steamId.value = user.steam_id;
  eIds.settings.userStats.innerHTML = `BLAEO username: <a href="https://www.backlog-assassins.net/users/${user.id}">${user.display_name}</a><br>
Steam profile: <a href="https://steamcommunity.com/profiles/${steamId}">https://steamcommunity.com/profiles/${steamId}</a><br>
Games: ${user.statistics.games}<br>
Completed games: ${user.statistics.completed}<br>
Beaten games: ${user.statistics.beaten}<br>
Unfinished games: ${user.statistics.unfinished}<br>
Never played games: ${user.statistics.never_played}<br>
Won't play games: ${user.statistics.wont_play}<br>
Uncategorized games: <a href="https://www.backlog-assassins.net/users/${user.id}/games/uncategorized">${user.statistics.uncategorized}</a>`;
  library = JSON.parse(localStorage.getItem("library"));
  eIds.settings.lastSyncDate.innerHTML = localStorage.getItem("lastSyncString");
  let time = new Date();
  if (
    parseInt(localStorage.getItem("lastsSync")) + 86400000 <= time.getTime() &&
    localStorage.getItem("autosync") === "true"
  ) {
    // 86400000 milliseconds = 24 hours. If at least 1 day passed since last sync, sync automatically
    $.notify("Automatic sync started...", {
      globalPosition: "bottom right",
      className: "info"
    });
    sync();
  } else {
    updateAutocomplete();
    createGameIDArray();
  }
}
if (localStorage.getItem("save") !== null) {
  let temp = JSON.parse(localStorage.getItem("save"));
  temp.forEach(function (el, index) {
    genSave[index] = temp[index];
  });
  const saveNames = ["save1Name", "save2Name", "save3Name", "exitSaveName"];
  [...document.getElementsByClassName("savedropdown")].forEach((gen, genIndex) => {
    [...gen.getElementsByClassName("saveName")].forEach((el, index) => {
      if (genSave[genIndex][saveNames[index]]) el.innerHTML = genSave[genIndex][saveNames[index]]
      else el.innerHTML = "empty"
    });
  });
  [...document.getElementsByClassName("loaddropdown")].forEach((gen, genIndex) => {
    [...gen.getElementsByClassName("saveName")].forEach((el, index) => {
      if (genSave[genIndex][saveNames[index]]) el.innerHTML = genSave[genIndex][saveNames[index]]
      else el.innerHTML = "empty"
    });
  });
  if (genSave[0].loadSave.length > 0) {
    load(0, 4);
  }
  if (genSave[1].loadSave.length > 0) {
    load(1, 4);
  }
  if (genSave[2].loadSave.length > 0) {
    load(2, 4);
  }
  if (genSave[3].loadSave.length > 0) {
    load(3, 4);
  }
}
if (localStorage.getItem("firstvisit") === null) {
  $(eIds.other.firstVisitMsg).show();
}
/* if (navigator.userAgent.toLowerCase().indexOf('gecko/') > -1) { // Detect Firefox-like browsers
  document.body.classList.add("firefox")
} */

  async function getAltCapsule(steamId) {
      return fetch(`https://blaeoplus.kubikill.dev/hltb/game-capsule-image?steamid=${steamId}`, {
          headers: {
            Accept: "application/json"
          }
        })
        .then(res => res.json())
        .then(resjson => {
          return resjson.capsuleImage;
        })
        .catch(() => {
          return false;
        });
  }