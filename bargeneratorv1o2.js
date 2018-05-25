$(document).ready(function () {
  $('#autofillwarning').hide();
  // Hide the first-time user message if user dismissed it before
  if (localStorage.firstTimeMsgDismissed) {
    $('#firsttimemsg').hide();
  }
  // Never show up the first-time user message again if the user dismissed it
  document.getElementById("firsttimebtn").onclick = function () {
    localStorage.firstTimeMsgDismissed = true;
  }
  // Set up Markdown converter
  var converter = new showdown.Converter({
    tables: true,
    strikethrough: true,
    noHeaderID: true,
    parseImgDimensions: true,
    simpleLineBreaks: true
  });
  // Declare variables
  var vGameTitle = "Half-Life 2",
    vAppID = "220",
    vCheevoEarned = "0",
    vCheevoAll = "0",
    vPlaytime = "0",
    vSteamID,
    vCustomText = "",
    vBgType = "solid",
    vBgColor1 = "#000000",
    vBgColor2 = "#000000",
    vGradientStyle = "to right",
    vBarType = "left",
    vBarColor = "#5BC0DE",
    bgCode, barCode, useAutofill = 'false',
    boxBarColor = "completed",
    vTitleColor = "#FFFFFF",
    vTextColor = "#FFFFFF",
    vImagePos = "right",
    vPanelColor = "info",
    vLibrary = 0,
    vCompleted = 0,
    vBeaten = 0,
    vUnfinished = 0,
    vNeverPlayed = 0,
    vWontPlay = 0,
    widthCompleted = 0,
    widthBeaten = 0,
    widthUnfinished = 0,
    widthNeverPlayed = 0,
    widthWontPlay = 0,
    vCompletedDecor = "",
    vCompletedDecorPreview = "",
    vBeatenDecor = "",
    vBeatenDecorPreview = "",
    vUnfinishedDecor = "",
    vUnfinishedDecorPreview = "",
    vNeverPlayedDecor = "",
    vNeverPlayedDecorPreview = "",
    vWontPlayDecor = "",
    vWontPlayDecorPreview = "",
    achievementCode,
    achievementCodeBox,
    review = "",
    reviewIDBar = "",
    reviewIDPanel = "",
    reviewPointer = "",
    reviewCodeBar = "",
    reviewCodePanel = "",
    reviewCode2Bar = "",
    reviewCode2Panel = "",
    reviewCode3 = "",
    reviewCodeButton = "",
    vReviewTrigger = "bar",
    useMargin = "",
    vRating = "8/10",
    randomString,
    randomStringPool = "abcdefghijklmnopqrstuvwxyz1234567890";
  vSteamID = localStorage.steamID;
  // Get IDs of stuff
  var previewElement = document.getElementById("preview");
  var boxPreview = document.getElementById("boxpreview");
  var viewCodeElement = document.getElementById("generated");
  var boxViewCodeElement = document.getElementById("boxgenerated");
  var panelPreview = document.getElementById("panelpreview");
  var panelViewCodeElement = document.getElementById("panelgenerated");
  var progressBarPreview = document.getElementById("progressbarpreview");
  var progressBarViewCodeElement = document.getElementById("progressbargenerated");
  var barColor = document.getElementById("barcolor");
  var bg1 = document.getElementById("bgcolor1");
  var bg1text = document.getElementById("bgcolor1text");
  var bg2 = document.getElementById("bgcolor2");
  var bg2text = document.getElementById("bgcolor2text");
  var titleColorText = document.getElementById("titlecolor");
  var titleColorPick = document.getElementById("titlecolorpick");
  var textColorPick = document.getElementById("textcolorpick");
  var textColorText = document.getElementById("textcolor");
  var gameTitleField = document.getElementById("gametitle");
  var playtimeField = document.getElementById("playtime");
  var steamIDField = document.getElementById("steamid");
  // Copy to clipboard button code
  var copyButton = document.querySelector('.copybutton');
  copyButton.addEventListener('click', function (event) {
    var copyArea = document.querySelector('.generatedtext');
    copyArea.select();
    try {
      viewCodeElement.select();
      var successful = document.execCommand('copy');
    } catch (err) {
      console.log('Unable to copy');
    }
  })
  var boxCopyButton = document.querySelector('#boxcopybutton');
  boxCopyButton.addEventListener('click', function (event) {
    var copyArea = document.querySelector('.boxgeneratedtext');
    copyArea.select();
    try {
      boxViewCodeElement.select();
      var successful = document.execCommand('copy');
    } catch (err) {
      console.log('Unable to copy');
    }
  })
  var panelCopyButton = document.querySelector('#panelcopybutton');
  panelCopyButton.addEventListener('click', function (event) {
    var copyArea = document.querySelector('.panelgeneratedtext');
    copyArea.select();
    try {
      panelViewCodeElement.select();
      var successful = document.execCommand('copy');
    } catch (err) {
      console.log('Unable to copy');
    }
  })
  var progressBarCopyButton = document.querySelector('#progressbarcopybutton');
  progressBarCopyButton.addEventListener('click', function (event) {
    var copyArea = document.querySelector('.progressbargenerated');
    copyArea.select();
    try {
      progressBarViewCodeElement.select();
      var successful = document.execCommand('copy');
    } catch (err) {
      console.log('Unable to copy');
    }
  })
  // Load review from autosave buttons
  for (i = 0; i < document.getElementsByClassName("autosave").length; i++) {
    document.getElementsByClassName("autosave")[i].addEventListener('click', function () {
      var confirmLoad = confirm("Are you sure you want to load the autosave? \nYour current review will be wiped!");
      if (confirmLoad) {
        for (i = 0; i < document.getElementsByClassName("review").length; i++) {
          document.getElementsByClassName("review")[i].value = localStorage.reviewAutoSave;
          updReview("useless", localStorage.reviewAutoSave);
          $(this.value).popover('show');
          $(this.value).popover('toggle');
        }
      }
    })
  }
  for (i = 0; i < document.getElementsByClassName("save1load").length; i++) {
    document.getElementsByClassName("save1load")[i].addEventListener('click', function () {
      var confirmLoad = confirm('Are you sure you want to load Save 1' + localStorage.reviewSave1Title + '? \nYour current review will be wiped!');
      if (confirmLoad) {
        for (i = 0; i < document.getElementsByClassName("review").length; i++) {
          document.getElementsByClassName("review")[i].value = localStorage.reviewSave1;
          updReview("so useless", localStorage.reviewSave1);
          $(this.value).popover('show');
          $(this.value).popover('toggle');
        }
      }
    })
  }
  for (i = 0; i < document.getElementsByClassName("save2load").length; i++) {
    document.getElementsByClassName("save2load")[i].addEventListener('click', function () {
      var confirmLoad = confirm('Are you sure you want to load Save 2' + localStorage.reviewSave2Title + '? \nYour current review will be wiped!');
      if (confirmLoad) {
        for (i = 0; i < document.getElementsByClassName("review").length; i++) {
          document.getElementsByClassName("review")[i].value = localStorage.reviewSave2;
          updReview("don't ask", localStorage.reviewSave2);
          $(this.value).popover('show');
          $(this.value).popover('toggle');
        }
      }
    })
  }
  for (i = 0; i < document.getElementsByClassName("save3load").length; i++) {
    document.getElementsByClassName("save3load")[i].addEventListener('click', function () {
      var confirmLoad = confirm('Are you sure you want to load Save 3' + localStorage.reviewSave3Title + '? \nYour current review will be wiped!');
      if (confirmLoad) {
        for (i = 0; i < document.getElementsByClassName("review").length; i++) {
          document.getElementsByClassName("review")[i].value = localStorage.reviewSave3;
          updReview("it's a workaround", localStorage.reviewSave3);
          $(this.value).popover('show');
          $(this.value).popover('toggle');
        }
      }
    })
  }
  for (i = 0; i < document.getElementsByClassName("save1").length; i++) {
    document.getElementsByClassName("save1")[i].addEventListener('click', function () {
      var saveTitle = prompt('Enter name for Save 1. Press Cancel to abort');
      if (saveTitle != null) {
        localStorage.reviewSave1 = document.getElementsByClassName("review")[0].value;
        localStorage.reviewSave1Title = " - " + saveTitle;
        $(this.value).popover('show');
        $(this.value).popover('toggle');
        for (i = 0; i < document.getElementsByClassName("save1title").length; i++) {
          document.getElementsByClassName("save1title")[i].innerHTML = localStorage.reviewSave1Title;
        }
      }
    })
  }
  for (i = 0; i < document.getElementsByClassName("save2").length; i++) {
    document.getElementsByClassName("save2")[i].addEventListener('click', function () {
      var saveTitle = prompt('Enter name for Save 2. Press Cancel to abort');
      if (saveTitle != null) {
        localStorage.reviewSave2 = document.getElementsByClassName("review")[0].value;
        localStorage.reviewSave2Title = " - " + saveTitle;
        $(this.value).popover('show');
        $(this.value).popover('toggle');
        for (i = 0; i < document.getElementsByClassName("save2title").length; i++) {
          document.getElementsByClassName("save2title")[i].innerHTML = localStorage.reviewSave2Title;
        }
      }
    })
  }
  for (i = 0; i < document.getElementsByClassName("save3").length; i++) {
    document.getElementsByClassName("save3")[i].addEventListener('click', function () {
      var saveTitle = prompt('Enter name for Save 3. Press Cancel to abort');
      if (saveTitle != null) {
        localStorage.reviewSave3 = document.getElementsByClassName("review")[0].value;
        localStorage.reviewSave3Title = " - " + saveTitle;
        $(this.value).popover('show');
        $(this.value).popover('toggle');
        for (i = 0; i < document.getElementsByClassName("save3title").length; i++) {
          document.getElementsByClassName("save3title")[i].innerHTML = localStorage.reviewSave3Title;
        }
      }
    })
  }
  // Load/save button popovers
  $('.load').popover({
    trigger: 'manual',
    template: '<div class="popover" role="tooltip"><div class="arrow"></div><div class="popover-body"></div></div>',
    title: "Loaded!",
    placement: "bottom",
    delay: {
      hide: 3000
    }
  });
  $('.save').popover({
    trigger: 'manual',
    template: '<div class="popover" role="tooltip"><div class="arrow"></div><div class="popover-body"></div></div>',
    title: "Saved!",
    placement: "bottom",
    delay: {
      hide: 3000
    }
  });
  // Fetch cool stuff from BLAEO function. Also, update appID
  var fetchBLAEO = function () {
    vAppID = this.value;
    var objLength = document.getElementsByClassName("appid").length;
    for (i = 0; i < objLength; i++) {
      document.getElementsByClassName("appid")[i].value = vAppID;
    }
    // Do not fetch if SteamID/AppID is invalid or autofilling is off
    if (!vSteamID || useAutofill == "false") {
      updPreview();
      return 0;
    }
    if (!vAppID) {
      vAppID = "220";
      updPreview();
      return 0;
    }
    fetch('https://www.backlog-assassins.net/users/+' + vSteamID + '/games/' + this.value, {
      headers: {
        'Accept': 'application/json'
      }
    })
      .then(res => res.json())
      .then(data => stats = data)
      .then(function () {
        var tempPlaytime = stats.game.playtime / 60;
        updGameTitle("hey what do you think you're doing", stats.game.name);
        updPlaytime("looking for easter eggs?", tempPlaytime.toFixed(1));
        updBar1("guess you found one", stats.game.progress);
        if (stats.game.hasOwnProperty('achievements')) {
          for (i = 0; i < document.getElementsByClassName("cheevoearned").length; i++) {
            document.getElementsByClassName("cheevoearned")[i].value = stats.game.achievements.unlocked;
            document.getElementsByClassName("cheevoall")[i].value = stats.game.achievements.total;
          }
          updCheevoEarned("welp, i can't stop you ¯\_(ツ)_/¯", stats.game.achievements.unlocked);
          updCheevoAll("i could leave this empty but i decided to put some silly stuff here soooo uhhhh, have a nice day", stats.game.achievements.total);
        } else {
          updCheevoEarned("foo", "0");
          updCheevoAll("bar", "0");
          updPreview();
          for (i = 0; i < document.getElementsByClassName("cheevoearned").length; i++) {
            document.getElementsByClassName("cheevoearned")[i].value = "0";
            document.getElementsByClassName("cheevoall")[i].value = "0";
          }
        }

        gameTitleField.value = stats.game.name;
        playtimeField.value = tempPlaytime.toFixed(1);
        barColor.value = stats.game.progress
        $('#autofillerror1').fadeOut();
        $('#autofillerror2').fadeOut();
      })
      .catch(function (response) {
        $('#autofillerror1').fadeIn();
        $('#autofillerror2').fadeIn();
        if (!vSteamID) {
          achievementCode = vCheevoEarned + ' of ' + vCheevoAll + ' achievements'
        } else {
          achievementCode = '<a style="color: ' + vTextColor + '; text-decoration: underline;" href="https://steamcommunity.com/profiles/' + vSteamID + '/stats/' + vAppID + '/?tab=achievements">' + vCheevoEarned + ' of ' + vCheevoAll + ' achievements</a>'
        }
        updPreview();
      });

  }
  // Fetch library stats function
  var fetchLibrary = function () {
    fetch('https://www.backlog-assassins.net/users/+' + vSteamID, {
      headers: {
        'Accept': 'application/json',
      }
    })
      .then(res => res.json())
      .then(data => stats = data)
      .then(function () {
        vCompleted = stats.statistics.completed;
        document.getElementById("completed").value = vCompleted;
        vBeaten = stats.statistics.beaten;
        document.getElementById("beaten").value = vBeaten;
        vUnfinished = stats.statistics.unfinished;
        document.getElementById("unfinished").value = vUnfinished;
        vNeverPlayed = stats.statistics.never_played;
        document.getElementById("neverplayed").value = vNeverPlayed;
        vWontPlay = stats.statistics.wont_play;
        document.getElementById("wontplay").value = vWontPlay;
        vLibrary = Number(vCompleted) + Number(vBeaten) + Number(vUnfinished) + Number(vNeverPlayed) + Number(vWontPlay);
        calculateWidth();
        updProgressBarPreview();
        $('#libraryerror').fadeOut();
        if (stats.statistics.uncategorized >= 1) {
          document.getElementById("uncategorized").innerHTML = stats.statistics.uncategorized;
          document.getElementById("uncategorizedlink").innerHTML = '<a href="https://www.backlog-assassins.net/users/+' + vSteamID + '/games/uncategorized">here</a>';
          if (stats.statistics.uncategorized >= 2) {
            document.getElementById("multipleuncategorized").innerHTML = 's!';
            document.getElementById("multipleuncategorized2").innerHTML = 'them';
          } else {
            document.getElementById("multipleuncategorized").innerHTML = '!';
            document.getElementById("multipleuncategorized2").innerHTML = 'it';
          }
          $('#uncategorizedwarning').fadeIn();
        } else {
          $('#uncategorizedwarning').fadeOut();
        }
      })
      .catch(function () {
        $('#libraryerror').fadeIn();
      });
  }
  // Add event listeners - those trigger when something gets typed or changed or clicked
  document.getElementById("steamid").addEventListener('blur', updSteamID);
  for (i = 0; i < document.getElementsByClassName("gametitle").length; i++) {
    document.getElementsByClassName("gametitle")[i].addEventListener('input', updGameTitle)
  }
  for (i = 0; i < document.getElementsByClassName("appid").length; i++) {
    document.getElementsByClassName("appid")[i].addEventListener('blur', fetchBLAEO)
  }
  for (i = 0; i < document.getElementsByClassName("playtime").length; i++) {
    document.getElementsByClassName("playtime")[i].addEventListener('input', updPlaytime)
  }
  for (i = 0; i < document.getElementsByClassName("cheevoearned").length; i++) {
    document.getElementsByClassName("cheevoearned")[i].addEventListener('input', updCheevoEarned)
  }
  for (i = 0; i < document.getElementsByClassName("cheevoall").length; i++) {
    document.getElementsByClassName("cheevoall")[i].addEventListener('input', updCheevoAll)
  }
  for (i = 0; i < document.getElementsByClassName("titlecolor").length; i++) {
    document.getElementsByClassName("titlecolor")[i].addEventListener('input', updTitleColor)
  }
  for (i = 0; i < document.getElementsByClassName("textcolor").length; i++) {
    document.getElementsByClassName("textcolor")[i].addEventListener('input', updTextColor)
  }
  for (i = 0; i < document.getElementsByClassName("barcolor").length; i++) {
    document.getElementsByClassName("barcolor")[i].addEventListener('input', updBar1)
  }
  for (i = 0; i < document.getElementsByClassName("review").length; i++) {
    document.getElementsByClassName("review")[i].addEventListener('blur', updReview)
  }
  for (i = 0; i < document.getElementsByClassName("completeddecor").length; i++) {
    document.getElementsByClassName("completeddecor")[i].addEventListener('click', updCompletedDecor)
  }
  for (i = 0; i < document.getElementsByClassName("beatendecor").length; i++) {
    document.getElementsByClassName("beatendecor")[i].addEventListener('click', updBeatenDecor)
  }
  for (i = 0; i < document.getElementsByClassName("unfinisheddecor").length; i++) {
    document.getElementsByClassName("unfinisheddecor")[i].addEventListener('click', updUnfinishedDecor)
  }
  for (i = 0; i < document.getElementsByClassName("neverplayeddecor").length; i++) {
    document.getElementsByClassName("neverplayeddecor")[i].addEventListener('click', updNeverPlayedDecor)
  }
  for (i = 0; i < document.getElementsByClassName("wontplaydecor").length; i++) {
    document.getElementsByClassName("wontplaydecor")[i].addEventListener('click', updWontPlayDecor)
  }
  document.getElementsByClassName("rating")[0].addEventListener('input', updRating);
  document.getElementsByName("bgtype")[0].addEventListener('change', updBgType);
  document.getElementsByClassName("imagepos")[0].addEventListener('change', updImagePos);
  document.getElementsByName("bgcolor1")[0].addEventListener('input', updBgColor1);
  document.getElementsByName("bgcolor1text")[0].addEventListener('input', updBgColor1);
  document.getElementsByName("bgcolor2")[0].addEventListener('input', updBgColor2);
  document.getElementsByName("bgcolor2text")[0].addEventListener('input', updBgColor2);
  document.getElementsByClassName("barpos")[0].addEventListener('change', updBarType);
  document.getElementsByClassName("customtext")[0].addEventListener('input', updCustomText);
  document.getElementById("completed").addEventListener('input', updCompleted);
  document.getElementById("beaten").addEventListener('input', updBeaten);
  document.getElementById("unfinished").addEventListener('input', updUnfinished);
  document.getElementById("neverplayed").addEventListener('input', updNeverPlayed);
  document.getElementById("wontplay").addEventListener('input', updWontPlay);
  document.getElementById("fetchlibrary").addEventListener('click', fetchLibrary);
  document.getElementById("panelcolor").addEventListener('change', updPanelColor);
  document.getElementById("reviewtrigger").addEventListener('change', updReviewTrigger);
  // Makes the Yes/No buttons work
  var autofillOn = document.getElementById("autofillon");
  var autofillOff = document.getElementById("autofilloff");
  $(autofillOn).click(function () {
    useAutofill = "true";
    localStorage.autofill = true;
    if (!vSteamID) {
      $('#autofillwarning').show();
    } else {
      $('#autofillwarning').hide();
    };
  });
  $(autofillOff).click(function () {
    useAutofill = "false";
    localStorage.autofill = false;
    $('#autofillwarning').hide();
    $('#autofillerror').fadeOut();
  });
  $('.copybutton').popover({
    trigger: 'focus',
    template: '<div class="popover" role="tooltip" style="background-color: #5CB85C;"><div class="arrow copyarrow"></div><div class="popover-body" style="color: #FFFFFF;"></div></div>',
    title: "Copied!",
    placement: "right",
    delay: {
      hide: 3000
    }
  });

  // Update variable functions

  function updRating() {
    var tempVar = this.value;
    if (tempVar == "") {
      vRating = "8/10";
    } else {
      vRating = tempVar;
    }
    for (i = 0; i < document.getElementsByClassName("rating").length; i++) {
      document.getElementsByClassName("rating")[i].value = tempVar;
    }
    updPreview();
  }

  function updGameTitle(useless, arg) {
    if (this.value || !arg) {
      var tempVar = this.value;
    } else {
      var tempVar = arg;
    }
    if (tempVar == "") {
      vGameTitle = "Half-Life 2";
    } else {
      vGameTitle = tempVar;
    }
    for (i = 0; i < document.getElementsByClassName("gametitle").length; i++) {
      document.getElementsByClassName("gametitle")[i].value = tempVar;
    }
    updPreview();
  }

  function updCheevoEarned(useless, arg) {
    if (this.value || !arg) {
      var tempVar = this.value;
    } else {
      var tempVar = arg;
    }
    if (!tempVar) {
      vCheevoEarned = "0";
    } else {
      vCheevoEarned = tempVar;
    }
    for (i = 0; i < document.getElementsByClassName("cheevoearned").length; i++) {
      document.getElementsByClassName("cheevoearned")[i].value = tempVar;
    }
    if (vCheevoAll == 0) {
      achievementCode = 'no achievements';
      achievementCodeBox = 'no achievements';
    } else {
      if (!vSteamID) {
        achievementCode = vCheevoEarned + ' of ' + vCheevoAll + ' achievements'
        achievementCodeBox = vCheevoEarned + ' of ' + vCheevoAll + ' achievements'
      } else {
        achievementCode = '<a style="color: ' + vTextColor + '; text-decoration: underline;" href="https://steamcommunity.com/profiles/' + vSteamID + '/stats/' + vAppID + '/?tab=achievements">' + vCheevoEarned + ' of ' + vCheevoAll + ' achievements</a>'
        achievementCodeBox = '<a href="https://steamcommunity.com/profiles/' + vSteamID + '/stats/' + vAppID + '/?tab=achievements">' + vCheevoEarned + ' of ' + vCheevoAll + ' achievements</a>'
      }
    }
    updPreview();
  }

  function updCheevoAll(useless, arg) {
    if (this.value || !arg) {
      var tempVar = this.value;
    } else {
      var tempVar = arg;
    }
    if (tempVar == "") {
      vCheevoAll = "0";
    } else {
      vCheevoAll = tempVar;
    }
    for (i = 0; i < document.getElementsByClassName("cheevoall").length; i++) {
      document.getElementsByClassName("cheevoall")[i].value = tempVar;
    }
    if (vCheevoAll == 0) {
      achievementCode = 'no achievements';
      achievementCodeBox = 'no achievements';
    } else {
      if (!vSteamID) {
        achievementCode = vCheevoEarned + ' of ' + vCheevoAll + ' achievements'
        achievementCodeBox = vCheevoEarned + ' of ' + vCheevoAll + ' achievements'
      } else {
        achievementCode = '<a style="color: ' + vTextColor + '; text-decoration: underline;" href="https://steamcommunity.com/profiles/' + vSteamID + '/stats/' + vAppID + '/?tab=achievements">' + vCheevoEarned + ' of ' + vCheevoAll + ' achievements</a>'
        achievementCodeBox = '<a href="https://steamcommunity.com/profiles/' + vSteamID + '/stats/' + vAppID + '/?tab=achievements">' + vCheevoEarned + ' of ' + vCheevoAll + ' achievements</a>'
      }
    }
    updPreview();
  }

  function updPlaytime(useless, arg) {
    if (this.value || !arg) {
      var tempVar = this.value;
    } else {
      var tempVar = arg;
    }
    if (tempVar == "") {
      vPlaytime = "0";
    } else {
      vPlaytime = tempVar;
    }
    for (i = 0; i < document.getElementsByClassName("playtime").length; i++) {
      document.getElementsByClassName("playtime")[i].value = tempVar;
    }
    updPreview();
  }

  function updSteamID() {
    if (this.value == "") {
      vSteamID = "";
    } else {
      vSteamID = this.value;
    }
    localStorage.steamID = vSteamID;
    if (!vSteamID && useAutofill == "true") {
      $('#autofillwarning').show();
    } else {
      $('#autofillwarning').hide();
    }
    if (!vSteamID) {
      achievementCode = vCheevoEarned + ' of ' + vCheevoAll + ' achievements'
    } else {
      achievementCode = '<a style="color: ' + vTextColor + '; text-decoration: underline;" href="https://steamcommunity.com/profiles/' + vSteamID + '/stats/' + vAppID + '/?tab=achievements">' + vCheevoEarned + ' of ' + vCheevoAll + ' achievements</a>'
    }
    updPreview();
  }

  function updCustomText() {
    if (this.value == "") {
      vCustomText = "";
    } else {
      vCustomText = this.value;
    }
    updPreview();
  }

  function updBgType() {
    vBgType = this.value;
    if (vBgType == "solid") {
      bg2.setAttribute("disabled", "true");
      bg2text.setAttribute("disabled", "true");
    } else {
      bg2.removeAttribute("disabled");
      bg2text.removeAttribute("disabled");
    }
    updPreview();
  }

  function updTitleColor() {
    vTitleColor = this.value;
    if (vTitleColor.substring(0, 1) != "#") {
      vTitleColor = "#" + vTitleColor;
    }
    titleColorText.value = vTitleColor;
    while (vTitleColor.length < 7) {
      vTitleColor = vTitleColor + "0"
    }
    titleColorPick.value = vTitleColor;
    updPreview();
  }

  function updTextColor() {
    vTextColor = this.value;
    if (vTextColor.substring(0, 1) != "#") {
      vTextColor = "#" + vTextColor;
    }
    textColorText.value = vTextColor;
    while (vTextColor.length < 7) {
      vTextColor = vTextColor + "0"
    }
    textColorPick.value = vTextColor;
    if (vCheevoAll == 0) {
      achievementCode = 'no achievements';
      achievementCodeBox = 'no achievements';
    } else {
      if (!vSteamID) {
        achievementCode = vCheevoEarned + ' of ' + vCheevoAll + ' achievements'
      } else {
        achievementCode = '<a style="color: ' + vTextColor + '; text-decoration: underline;" href="https://steamcommunity.com/profiles/' + vSteamID + '/stats/' + vAppID + '/?tab=achievements">' + vCheevoEarned + ' of ' + vCheevoAll + ' achievements</a>'
      }
    }
    updPreview();
  }

  function updBgColor1() {
    vBgColor1 = this.value;
    if (vBgColor1.substring(0, 1) != "#") {
      vBgColor1 = "#" + vBgColor1;
    }
    bg1text.value = vBgColor1;
    while (vBgColor1.length < 7) {
      vBgColor1 = vBgColor1 + "0"
    }
    bg1.value = vBgColor1;
    updPreview();
  }

  function updBgColor2() {
    vBgColor2 = this.value;
    if (vBgColor2.substring(0, 1) != "#") {
      vBgColor2 = "#" + vBgColor2;
    }
    bg2text.value = vBgColor2;
    while (vBgColor2.length < 7) {
      vBgColor2 = vBgColor2 + "0"
    }
    bg2.value = vBgColor2;
    updPreview();
  }

  function updImagePos() {
    vImagePos = this.value;
    if (vImagePos == "right") {
      useMargin = "";
    } else {
      useMargin = "margin-left: auto;";
    }
    updPreview();
  }

  function updBarType() {
    vBarType = this.value;
    if (vBarType == "hide") {
      barColor.disabled = true;
    } else {
      barColor.disabled = false;
    }
    updPreview();
  }

  function updPanelColor() {
    vPanelColor = this.value;
    updPreview();
  }

  function updBar1(useless, arg) {
    if (this.value || !arg) {
      var tempVar = this.value;
    } else {
      var tempVar = arg;
    }
    boxBarColor = tempVar;
    switch (tempVar) {
      case "completed":
        vBarColor = "#5BC0DE";
        break;
      case "beaten":
        vBarColor = "#5CB85C";
        break;
      case "unfinished":
        vBarColor = "#F0AD4E";
        break;
      case "wont play":
        vBarColor = "#D9534F";
        boxBarColor = "wont-play";
        break;
      case "wont-play":
        tempVar = "wont play";
        vBarColor = "#D9534F";
        break;
      case "never played":
        vBarColor = "#EEEEEE";
        boxBarColor = "never-played";
        break;
      case "never-played":
        tempVar = "never played";
        vBarColor = "#EEEEEE";
        break;
      default:
        vBarColor = tempVar;
    }
    for (i = 0; i < document.getElementsByClassName("barcolor").length; i++) {
      document.getElementsByClassName("barcolor")[i].value = tempVar;
    }
    updPreview();
  }
  //Update background
  function updBg() {
    if (vBgType == "solid") {
      bgCode = "background: " + vBgColor1 + "; ";
    } else {
      bgCode = "background: linear-gradient(" + vBgType + ", " + vBgColor1 + ", " + vBgColor2 + ");";
    }
  }
  //Update bar
  function updBars() {
    if (vBarType == "hide") {
      barCode = "";
    } else {
      barCode = "border-" + vBarType + ": 10px solid " + vBarColor;
    }
  }

  function updReview(useless, arg) {
    if (this.value && !arg) {
      review = this.value;
    } else if (!this.value && arg) {
      review = arg;
    } else {
      review = "";
    }
    console.log(review);
    for (i = 0; i < document.getElementsByClassName("review").length; i++) {
      document.getElementsByClassName("review")[i].value = review;
    }
    var reviewConv = converter.makeHtml(review);
    if (reviewConv) {
      randomString = "";
      while (randomString.length < 10) {
        randomString += randomStringPool[Math.floor(Math.random() * randomStringPool.length)];
      }
      reviewIDBar = 'bargame' + vAppID + '_review' + randomString;
      reviewIDPanel = 'panelgame' + vAppID + '_review' + randomString;
      reviewCodePanel = '<div style="padding: 10px 20px; width: 100%;" id="' + reviewIDPanel + '" class="collapse">' + reviewConv + '</div>';
      reviewCode2Panel = 'data-target="#' + reviewIDPanel + '" data-toggle="collapse" ';
      reviewCode3 = '<div style="float: right; padding-right:10px;" class="collapsed" aria-expanded="false">More <i class="fa fa-level-down"></i></div>';
      if (vReviewTrigger == "bar") {
        reviewPointer = "cursor: pointer;";
        reviewCode2Bar = 'data-target="#' + reviewIDBar + '" data-toggle="collapse" ';
        reviewCodeButton = "";
        reviewCodeBar = '<div style="padding: 10px 20px 0px 20px; border: 1px solid #dee2e6; border-top: 0px; border-radius: .25rem;" id="' + reviewIDBar + '" class="collapse">' + reviewConv + '</div>';
      }
      else {
        reviewPointer = "";
        reviewCode2Bar = "";
        reviewCodeButton = '<div data-target="#' + reviewIDBar + '" data-toggle="collapse" style="cursor: pointer; position: absolute; width: 150px; height: 22px; left: 0; right: 0; bottom: -15px; background-color: #AAAAAA; border-radius: 8px; text-align: center; margin: 0 auto; color: #FFFFFF; z-index: 1;"><p style="padding-top: 2px;">More <i class="fa fa-level-down"></i></p></div>';
        reviewCodeBar = '<div style="padding: 15px 20px 0px 20px; border: 1px solid #dee2e6; border-top: 0px; border-radius: .25rem;" id="' + reviewIDBar + '" class="collapse">' + reviewConv + '</div>';
      }
    }
    else {
      reviewPointer = "";
      reviewIDBar = "";
      reviewIDPanel = "";
      reviewCodeBar = "";
      reviewCodePanel = "";
      reviewCode2Bar = "";
      reviewCode2Panel = "";
      reviewCode3 = "";
      reviewCodeButton = "";
    }
    updPreview();
  }

  function updReviewTrigger() {
    vReviewTrigger = this.value;
    updReview("foo", review);
  }
  // Progress bar update functions
  function updCompleted() {
    var tempVar = this.value;
    if (tempVar == "") {
      vCompleted = 0;
    } else {
      vCompleted = tempVar;
    }
    vLibrary = Number(vCompleted) + Number(vBeaten) + Number(vUnfinished) + Number(vNeverPlayed) + Number(vWontPlay);
    calculateWidth();
    updProgressBarPreview();
  }

  function updBeaten() {
    var tempVar = this.value;
    if (tempVar == "") {
      vBeaten = 0;
    } else {
      vBeaten = tempVar;
    }
    vLibrary = Number(vCompleted) + Number(vBeaten) + Number(vUnfinished) + Number(vNeverPlayed) + Number(vWontPlay);
    calculateWidth();
    updProgressBarPreview();
  }

  function updUnfinished() {
    var tempVar = this.value;
    if (tempVar == "") {
      vUnfinished = 0;
    } else {
      vUnfinished = tempVar;
    }
    vLibrary = Number(vCompleted) + Number(vBeaten) + Number(vUnfinished) + Number(vNeverPlayed) + Number(vWontPlay);
    calculateWidth();
    updProgressBarPreview();
  }

  function updNeverPlayed() {
    var tempVar = this.value;
    if (tempVar == "") {
      vNeverPlayed = 0;
    } else {
      vNeverPlayed = tempVar;
    }
    vLibrary = Number(vCompleted) + Number(vBeaten) + Number(vUnfinished) + Number(vNeverPlayed) + Number(vWontPlay);
    calculateWidth();
    updProgressBarPreview();
  }

  function updWontPlay() {
    var tempVar = this.value;
    if (tempVar == "") {
      vWontPlay = 0;
    } else {
      vWontPlay = tempVar;
    }
    vLibrary = Number(vCompleted) + Number(vBeaten) + Number(vUnfinished) + Number(vNeverPlayed) + Number(vWontPlay);
    calculateWidth();
    updProgressBarPreview();
  }

  function updCompletedDecor() {
    switch (this.value) {
      case "none":
        vCompletedDecor = '';
        vCompletedDecorPreview = '';
        document.getElementById('completednone').innerHTML = '<i class="fa fa-check-circle"></i> ';
        document.getElementById('completedstriped').innerHTML = '';
        document.getElementById('completedanimated').innerHTML = '';
        break;
      case "striped":
        vCompletedDecor = 'progress-bar-striped';
        vCompletedDecorPreview = 'progress-bar-striped';
        document.getElementById('completednone').innerHTML = '';
        document.getElementById('completedstriped').innerHTML = '<i class="fa fa-check-circle"></i> ';
        document.getElementById('completedanimated').innerHTML = '';
        break;
      case "animated":
        vCompletedDecor = 'progress-bar-striped active';
        vCompletedDecorPreview = 'progress-bar-striped progress-bar-animated';
        document.getElementById('completednone').innerHTML = '';
        document.getElementById('completedstriped').innerHTML = '';
        document.getElementById('completedanimated').innerHTML = '<i class="fa fa-check-circle"></i> ';
        break;
    }
    updProgressBarPreview();
  }

  function updBeatenDecor() {
    switch (this.value) {
      case "none":
        vBeatenDecor = '';
        vBeatenDecorPreview = '';
        document.getElementById('beatennone').innerHTML = '<i class="fa fa-check-circle"></i> ';
        document.getElementById('beatenstriped').innerHTML = '';
        document.getElementById('beatenanimated').innerHTML = '';
        break;
      case "striped":
        vBeatenDecor = 'progress-bar-striped';
        vBeatenDecorPreview = 'progress-bar-striped';
        document.getElementById('beatennone').innerHTML = '';
        document.getElementById('beatenstriped').innerHTML = '<i class="fa fa-check-circle"></i> ';
        document.getElementById('beatenanimated').innerHTML = '';
        break;
      case "animated":
        vBeatenDecor = 'progress-bar-striped active';
        vBeatenDecorPreview = 'progress-bar-striped progress-bar-animated';
        document.getElementById('beatennone').innerHTML = '';
        document.getElementById('beatenstriped').innerHTML = '';
        document.getElementById('beatenanimated').innerHTML = '<i class="fa fa-check-circle"></i> ';
        break;
    }
    updProgressBarPreview();
  }

  function updUnfinishedDecor() {
    switch (this.value) {
      case "none":
        vUnfinishedDecor = '';
        vUnfinishedDecorPreview = '';
        document.getElementById('unfinishednone').innerHTML = '<i class="fa fa-check-circle"></i> ';
        document.getElementById('unfinishedstriped').innerHTML = '';
        document.getElementById('unfinishedanimated').innerHTML = '';
        break;
      case "striped":
        vUnfinishedDecor = 'progress-bar-striped';
        vUnfinishedDecorPreview = 'progress-bar-striped';
        document.getElementById('unfinishednone').innerHTML = '';
        document.getElementById('unfinishedstriped').innerHTML = '<i class="fa fa-check-circle"></i> ';
        document.getElementById('unfinishedanimated').innerHTML = '';
        break;
      case "animated":
        vUnfinishedDecor = 'progress-bar-striped active';
        vUnfinishedDecorPreview = 'progress-bar-striped progress-bar-animated';
        document.getElementById('unfinishednone').innerHTML = '';
        document.getElementById('unfinishedstriped').innerHTML = '';
        document.getElementById('unfinishedanimated').innerHTML = '<i class="fa fa-check-circle"></i> ';
        break;
    }
    updProgressBarPreview();
  }

  function updNeverPlayedDecor() {
    switch (this.value) {
      case "none":
        vNeverPlayedDecor = '';
        vNeverPlayedDecorPreview = '';
        document.getElementById('neverplayednone').innerHTML = '<i class="fa fa-check-circle"></i> ';
        document.getElementById('neverplayedstriped').innerHTML = '';
        document.getElementById('neverplayedanimated').innerHTML = '';
        break;
      case "striped":
        vNeverPlayedDecor = 'progress-bar-striped';
        vNeverPlayedDecorPreview = 'progress-bar-striped';
        document.getElementById('neverplayednone').innerHTML = '';
        document.getElementById('neverplayedstriped').innerHTML = '<i class="fa fa-check-circle"></i> ';
        document.getElementById('neverplayedanimated').innerHTML = '';
        break;
      case "animated":
        vNeverPlayedDecor = 'progress-bar-striped active';
        vNeverPlayedDecorPreview = 'progress-bar-striped progress-bar-animated';
        document.getElementById('neverplayednone').innerHTML = '';
        document.getElementById('neverplayedstriped').innerHTML = '';
        document.getElementById('neverplayedanimated').innerHTML = '<i class="fa fa-check-circle"></i> ';
        break;
    }
    updProgressBarPreview();
  }

  function updWontPlayDecor() {
    switch (this.value) {
      case "none":
        vWontPlayDecor = '';
        vWontPlayDecorPreview = '';
        document.getElementById('wontplaynone').innerHTML = '<i class="fa fa-check-circle"></i> ';
        document.getElementById('wontplaystriped').innerHTML = '';
        document.getElementById('wontplayanimated').innerHTML = '';
        break;
      case "striped":
        vWontPlayDecor = 'progress-bar-striped';
        vWontPlayDecorPreview = 'progress-bar-striped';
        document.getElementById('wontplaynone').innerHTML = '';
        document.getElementById('wontplaystriped').innerHTML = '<i class="fa fa-check-circle"></i> ';
        document.getElementById('wontplayanimated').innerHTML = '';
        break;
      case "animated":
        vWontPlayDecor = 'progress-bar-striped active';
        vWontPlayDecorPreview = 'progress-bar-striped progress-bar-animated';
        document.getElementById('wontplaynone').innerHTML = '';
        document.getElementById('wontplaystriped').innerHTML = '';
        document.getElementById('wontplayanimated').innerHTML = '<i class="fa fa-check-circle"></i> ';
        break;
    }
    updProgressBarPreview();
  }

  function calculateWidth() {
    widthCompleted = vCompleted / vLibrary * 100;
    widthCompleted.toFixed(4);
    widthBeaten = vBeaten / vLibrary * 100;
    widthBeaten.toFixed(4);
    widthUnfinished = vUnfinished / vLibrary * 100;
    widthUnfinished.toFixed(4);
    widthNeverPlayed = vNeverPlayed / vLibrary * 100;
    widthNeverPlayed.toFixed(4);
    widthWontPlay = vWontPlay / vLibrary * 100;
    widthWontPlay.toFixed(4);
  }
  //Update preview function, called everytime something gets changed
  function updPreview() {
    updBg();
    updBars();
    // Bar
    preview.innerHTML = '<div ' + reviewCode2Bar + 'style="font-family: Oswald, Arial, sans-serif; line-height: 1; font-weight: 500; box-sizing: border-box; position: relative; min-height: 69px;' + bgCode + '; text-shadow: 1px 1px 0 black; ' + barCode + '; ' + reviewPointer + '"><div style="float: ' + vImagePos + ';"><a href="https://store.steampowered.com/app/' + vAppID + '/" target="_blank"><img src="http://cdn.akamai.steamstatic.com/steam/apps/' + vAppID + '/capsule_184x69.jpg" /></a></div><div style="padding-left: 1rem; ' + useMargin + ' width: calc(100% - 184px);"><h2 style="margin-bottom: 0; padding-top: 5px; font-size: 22px; color: ' + vTitleColor + '">' + vGameTitle + '</h2><p style="margin-bottom: 0; padding-bottom: 6px; font-size: 11px; font-family: Arimo; line-height: 1.4; color: ' + vTextColor + '">' + vPlaytime + ' hours, ' + achievementCode + '<br>' + vCustomText + '</p></div> ' + reviewCodeButton + '</div>' + reviewCodeBar + '<br>';
    viewCodeElement.textContent = '<div ' + reviewCode2Bar + 'style="position: relative; min-height: 69px; ' + bgCode + '; text-shadow: 1px 1px 0 black; ' + reviewPointer + barCode + ';"><div style="float: ' + vImagePos + ';"><a href="https://store.steampowered.com/app/' + vAppID + '/" target="_blank"><img src="http://cdn.akamai.steamstatic.com/steam/apps/' + vAppID + '/capsule_184x69.jpg" /></a></div><div style="padding-left: 1rem; ' + useMargin + ' width: calc(100% - 184px);"><h2 style="margin-bottom: 0px; padding-top: 5px; color: ' + vTitleColor + '">' + vGameTitle + '</h2><p style="margin-bottom: 0; padding-bottom: 6px; font-size: 1rem; color: ' + vTextColor + '">' + vPlaytime + ' hours, ' + achievementCode + '<br>' + vCustomText + '</p></div> ' + reviewCodeButton + '</div>' + reviewCodeBar + '<br>';
    // Game box
    boxPreview.innerHTML = '<ul class="games"><li class="game-thumbnail game game-' + boxBarColor + '"><div class="title">' + vGameTitle + '</div><a href="https://store.steampowered.com/app/' + vAppID + '/" target="_blank"><img alt="' + vGameTitle + '" src="http://cdn.akamai.steamstatic.com/steam/apps/' + vAppID + '/capsule_184x69.jpg"></a><div class="caption"><p>' + vPlaytime + ' hours playtime</p><p>' + achievementCodeBox + '</p></div></li></ul>';
    boxViewCodeElement.textContent = '<li class="game-thumbnail game game-' + boxBarColor + '"><div class="title">' + vGameTitle + '</div><a href="https://store.steampowered.com/app/' + vAppID + '/" target="_blank"><img alt="' + vGameTitle + '" src="http://cdn.akamai.steamstatic.com/steam/apps/' + vAppID + '/capsule_184x69.jpg"></a><div class="caption"><p>' + vPlaytime + ' hours playtime</p><p>' + achievementCodeBox + '</p></div></li>';
    // Panel
    panelPreview.innerHTML = '<div class="panel panel-' + vPanelColor + '"><div ' + reviewCode2Panel + ' class="panel-heading"><div style="' + barCode + '; float: left; padding-right: 10px;"><img alt="' + vGameTitle + '" src="https://steamcdn-a.akamaihd.net/steam/apps/' + vAppID + '/header.jpg" style="min-height: 90px; max-height: 90px; width: 192.55px;"></div><div class="media-body"><h4 class="media-heading">' + vGameTitle + ' <a href="https://store.steampowered.com/app/' + vAppID + '" target="_blank"><font size="2px"><i aria-hidden="true" class="fa fa-external-link"></i></font></a></h4><div><i aria-hidden="true" class="fa fa-star"></i> ' + vRating + '</div><div><i class="fa fa-clock-o" aria-hidden="true"></i> ' + vPlaytime + ' hours</div><span><i aria-hidden="true" class="fa fa-trophy"></i> ' + achievementCodeBox + '</span>' + reviewCode3 + '</div></div>' + reviewCodePanel + '</div>';
    panelViewCodeElement.textContent = '<div class="panel panel-' + vPanelColor + '"><div ' + reviewCode2Panel + ' class="panel-heading"><div style="' + barCode + '; float: left; padding-right: 10px;"><img alt="' + vGameTitle + '" src="https://steamcdn-a.akamaihd.net/steam/apps/' + vAppID + '/header.jpg" style="min-height: 90px; max-height: 90px; width: 192.55px;"></div><div class="media-body"><h4 class="media-heading">' + vGameTitle + ' <a href="https://store.steampowered.com/app/' + vAppID + '" target="_blank"><font size="2px"><i aria-hidden="true" class="fa fa-external-link"></i></font></a></h4><div><i aria-hidden="true" class="fa fa-star"></i> ' + vRating + '</div><div><i class="fa fa-clock-o" aria-hidden="true"></i> ' + vPlaytime + ' hours</div><span><i aria-hidden="true" class="fa fa-trophy"></i> ' + achievementCodeBox + '</span>' + reviewCode3 + '</div></div> ' + reviewCodePanel + '</div>';
  }

  function updProgressBarPreview() {
    progressBarPreview.innerHTML = '<div class="list-progress"><div class="progress-bar game-completed ' + vCompletedDecorPreview + '" title="completed: ' + vCompleted + ' of ' + vLibrary + ' games" style="width: ' + widthCompleted + '%; padding-left: 0px;">' + Math.round(widthCompleted) + '%</div><div class="progress-bar game-beaten ' + vBeatenDecorPreview + '" title="beaten: ' + vBeaten + ' of ' + vLibrary + ' games" style="width: ' + widthBeaten + '%; padding-left: 0px;">' + Math.round(widthBeaten) + '%</div><div class="progress-bar game-unfinished ' + vUnfinishedDecorPreview + '" title="unfinished: ' + vUnfinished + ' of ' + vLibrary + ' games" style="width: ' + widthUnfinished + '%; padding-left: 0px;">' + Math.round(widthUnfinished) + '%</div><div class="progress-bar game-never-played ' + vNeverPlayedDecorPreview + '" title="never played: ' + vNeverPlayed + ' of ' + vLibrary + ' games" style="width: ' + widthNeverPlayed + '%; padding-left: 0px;">' + Math.round(widthNeverPlayed) + '%</div><div class="progress-bar game-wont-play ' + vWontPlayDecorPreview + '" title="won\'t play: ' + vWontPlay + ' of ' + vLibrary + ' games" style="width: ' + widthWontPlay + '%; padding-left: 0px;"> ' + Math.round(widthWontPlay) + '%</div></div>';
    progressBarViewCodeElement.textContent = '<div class="list-progress"><div class="progress-bar game-completed ' + vCompletedDecor + '" title="completed: ' + vCompleted + ' of ' + vLibrary + ' games" style="width: ' + widthCompleted + '%; padding-left: 0px;">' + Math.round(widthCompleted) + '%</div><div class="progress-bar game-beaten ' + vBeatenDecor + '" title="beaten: ' + vBeaten + ' of ' + vLibrary + ' games" style="width: ' + widthBeaten + '%; padding-left: 0px;">' + Math.round(widthBeaten) + '%</div><div class="progress-bar game-unfinished ' + vUnfinishedDecor + '" title="unfinished: ' + vUnfinished + ' of ' + vLibrary + ' games" style="width: ' + widthUnfinished + '%; padding-left: 0px;">' + Math.round(widthUnfinished) + '%</div><div class="progress-bar game-never-played ' + vNeverPlayedDecor + '" title="never played: ' + vNeverPlayed + ' of ' + vLibrary + ' games" style="width: ' + widthNeverPlayed + '%; padding-left: 0px;">' + Math.round(widthNeverPlayed) + '%</div><div class="progress-bar game-wont-play ' + vWontPlayDecor + '" title="won\'t play: ' + vWontPlay + ' of ' + vLibrary + ' games" style="width: ' + widthWontPlay + '%; padding-left: 0px;"> ' + Math.round(widthWontPlay) + '%</div></div>';
  }
  if (vCheevoAll == 0) {
    achievementCode = 'no achievements';
    achievementCodeBox = 'no achievements';
  } else {
    if (!vSteamID) {
      achievementCode = vCheevoEarned + ' of ' + vCheevoAll + ' achievements'
      achievementCodeBox = vCheevoEarned + ' of ' + vCheevoAll + ' achievements'
    } else {
      achievementCode = '<a style="color: ' + vTextColor + '; text-decoration: underline;"href="https://steamcommunity.com/profiles/' + vSteamID + '/stats/' + vAppID + '/?tab=achievements">' + vCheevoEarned + ' of ' + vCheevoAll + ' achievements</a>'
      achievementCodeBox = '<a href="https://steamcommunity.com/profiles/' + vSteamID + '/stats/' + vAppID + '/?tab=achievements">' + vCheevoEarned + ' of ' + vCheevoAll + ' achievements</a>'
    }
  }
  updPreview();
  updProgressBarPreview();
  steamIDField.value = localStorage.steamID;
  useAutofill = localStorage.autofill;
  if (localStorage.getItem('reviewAutoSave') === null) {
    localStorage.reviewAutoSave = "";
    localStorage.reviewAutoSaveDate = "Empty";
  }
  if (localStorage.getItem('reviewSave1') === null) {
    localStorage.reviewSave1 = "";
    localStorage.reviewSave1Title = " - Empty";
  }
  if (localStorage.getItem('reviewSave2') === null) {
    localStorage.reviewSave2 = "";
    localStorage.reviewSave2Title = " - Empty";
  }
  if (localStorage.getItem('reviewSave3') === null) {
    localStorage.reviewSave3 = "";
    localStorage.reviewSave3Title = " - Empty";
  }
  for (i = 0; i < document.getElementsByClassName("autosavedate").length; i++) {
    document.getElementsByClassName("autosavedate")[i].innerHTML = localStorage.reviewAutoSaveDate;
  }
  for (i = 0; i < document.getElementsByClassName("save1title").length; i++) {
    document.getElementsByClassName("save1title")[i].innerHTML = localStorage.reviewSave1Title;
  }
  for (i = 0; i < document.getElementsByClassName("save2title").length; i++) {
    document.getElementsByClassName("save2title")[i].innerHTML = localStorage.reviewSave2Title;
  }
  for (i = 0; i < document.getElementsByClassName("save3title").length; i++) {
    document.getElementsByClassName("save3title")[i].innerHTML = localStorage.reviewSave3Title;
  }
  if (useAutofill == "true") {
    document.getElementById("autofillon").classList.add("active");
  } else {
    document.getElementById("autofilloff").classList.add("active");
  }
  if (!vSteamID && useAutofill == "true") {
    $('#autofillwarning').show();
  }
  $('[data-toggle="popover"]').popover()
});
// Review autosave
window.onbeforeunload = function () {
  if (document.getElementsByClassName('review')[0].value) {
    var currentDate = new Date();
    var minutes = currentDate.getMinutes();
    minutes = minutes > 9 ? minutes : '0' + minutes;
    const monthNames = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
    localStorage.reviewAutoSaveDate = currentDate.getHours() + ":" + minutes + " - " + currentDate.getDate() + " " + monthNames[currentDate.getMonth()] + " " + currentDate.getFullYear();
    localStorage.reviewAutoSave = document.getElementsByClassName('review')[0].value;
  }
}