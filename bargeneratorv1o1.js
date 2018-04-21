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
    achievementCode,
    achievementCodeBox,
    review = "",
    reviewID = "",
    reviewPointer = "",
    reviewCode = "",
    reviewCode2 = "",
    randomString,
    randomStringPool = "abcdefghijklmnopqrstuvwxyz1234567890";
  noAchievements = false;
  vSteamID = localStorage.steamID;
  // Get IDs of stuff
  var previewElement = document.getElementById("preview");
  var boxPreview = document.getElementById("boxpreview");
  var viewCodeElement = document.getElementById("generated");
  var boxViewCodeElement = document.getElementById("boxgenerated");
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
      document.getElementById("generated").select();
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
      document.getElementById("boxgenerated").select();
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
      document.getElementById("progressbargenerated").select();
      var successful = document.execCommand('copy');
    } catch (err) {
      console.log('Unable to copy');
    }
  })
  // Fetch cool stuff from BLAEO function. Also, update appID
  var fetchBLAEO = function () {
    vAppID = this.value;
    for (i = 0; i < document.getElementsByName("appid").length; i++) {
      document.getElementsByName("appid")[i].value = vAppID;
    }
    // Do not fetch if SteamID/AppID is invalid or autofilling is off
    if (!vAppID || !vSteamID || useAutofill == "false") {
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
          for (i = 0; i < document.getElementsByName("cheevoearned").length; i++) {
            document.getElementsByName("cheevoearned")[i].value = stats.game.achievements.unlocked;
            document.getElementsByName("cheevoall")[i].value = stats.game.achievements.total;
          }
          updCheevoEarned("welp, i can't stop you ¯\_(ツ)_/¯", stats.game.achievements.unlocked);
          updCheevoAll("i could leave this empty but i decided to put some silly stuff here soooo uhhhh, have a nice day", stats.game.achievements.total);
        } else {
          updCheevoEarned("foo", "0");
          updCheevoAll("bar", "0");
          updPreview();
          for (i = 0; i < document.getElementsByName("cheevoearned").length; i++) {
            document.getElementsByName("cheevoearned")[i].value = "0";
            document.getElementsByName("cheevoall")[i].value = "0";
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
          achievementCode = '<a style="color: ' + vTextColor + '; text-decoration: underline;" href="http://steamcommunity.com/profiles/' + vSteamID + '/stats/' + vAppID + '/?tab=achievements">' + vCheevoEarned + ' of ' + vCheevoAll + ' achievements</a>'
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
            document.getElementById("multipleuncategorized").innerHTML = 's';
            document.getElementById("multipleuncategorized2").innerHTML = 'them';
          } else {
            document.getElementById("multipleuncategorized").innerHTML = '';
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
  document.getElementsByName("steamid")[0].addEventListener('blur', updSteamID);
  for (i = 0; i < document.getElementsByName("gametitle").length; i++) {
    document.getElementsByName("gametitle")[i].addEventListener('input', updGameTitle)
  }
  for (i = 0; i < document.getElementsByName("appid").length; i++) {
    document.getElementsByName("appid")[i].addEventListener('blur', fetchBLAEO)
  }
  for (i = 0; i < document.getElementsByName("playtime").length; i++) {
    document.getElementsByName("playtime")[i].addEventListener('input', updPlaytime)
  }
  for (i = 0; i < document.getElementsByName("cheevoearned").length; i++) {
    document.getElementsByName("cheevoearned")[i].addEventListener('input', updCheevoEarned)
  }
  for (i = 0; i < document.getElementsByName("cheevoall").length; i++) {
    document.getElementsByName("cheevoall")[i].addEventListener('input', updCheevoAll)
  }
  for (i = 0; i < document.getElementsByName("titlecolor").length; i++) {
    document.getElementsByName("titlecolor")[i].addEventListener('input', updTitleColor)
  }
  for (i = 0; i < document.getElementsByName("textcolor").length; i++) {
    document.getElementsByName("textcolor")[i].addEventListener('input', updTextColor)
  }
  for (i = 0; i < document.getElementsByName("barcolor").length; i++) {
    document.getElementsByName("barcolor")[i].addEventListener('input', updBar1)
  }
  document.getElementsByName("bgtype")[0].addEventListener('change', updBgType);
  document.getElementsByName("imagepos")[0].addEventListener('change', updImagePos);
  document.getElementsByName("bgcolor1")[0].addEventListener('input', updBgColor1);
  document.getElementsByName("bgcolor1text")[0].addEventListener('input', updBgColor1);
  document.getElementsByName("bgcolor2")[0].addEventListener('input', updBgColor2);
  document.getElementsByName("bgcolor2text")[0].addEventListener('input', updBgColor2);
  document.getElementsByName("barpos")[0].addEventListener('change', updBarType);
  document.getElementsByName("customtext")[0].addEventListener('input', updCustomText);
  document.getElementsByName("completed")[0].addEventListener('input', updCompleted);
  document.getElementsByName("beaten")[0].addEventListener('input', updBeaten);
  document.getElementsByName("unfinished")[0].addEventListener('input', updUnfinished);
  document.getElementsByName("neverplayed")[0].addEventListener('input', updNeverPlayed);
  document.getElementsByName("wontplay")[0].addEventListener('input', updWontPlay);
  document.getElementById("fetchlibrary").addEventListener('click', fetchLibrary);
  document.getElementById("review").addEventListener('blur', updReview);
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
    template: '<div class="popover" role="tooltip" style="background-color: #5CB85C;"><div class="arrow copyarrow"></div><div class="popover-body"></div></div>',
    title: "Copied!",
    placement: "right",
    delay: {
      hide: 3000
    }
  });

  // Update variable functions

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
    for (i = 0; i < document.getElementsByName("gametitle").length; i++) {
      document.getElementsByName("gametitle")[i].value = tempVar;
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
    for (i = 0; i < document.getElementsByName("cheevoearned").length; i++) {
      document.getElementsByName("cheevoearned")[i].value = tempVar;
    }
    if (vCheevoAll == 0) {
      achievementCode = 'no achievements';
      achievementCodeBox = 'no achievements';
    } else {
      if (!vSteamID) {
        achievementCode = vCheevoEarned + ' of ' + vCheevoAll + ' achievements'
        achievementCodeBox = vCheevoEarned + ' of ' + vCheevoAll + ' achievements'
      } else {
        achievementCode = '<a style="color: ' + vTextColor + '; text-decoration: underline;" href="http://steamcommunity.com/profiles/' + vSteamID + '/stats/' + vAppID + '/?tab=achievements">' + vCheevoEarned + ' of ' + vCheevoAll + ' achievements</a>'
        achievementCodeBox = '<a href="http://steamcommunity.com/profiles/' + vSteamID + '/stats/' + vAppID + '/?tab=achievements">' + vCheevoEarned + ' of ' + vCheevoAll + ' achievements</a>'
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
    for (i = 0; i < document.getElementsByName("cheevoall").length; i++) {
      document.getElementsByName("cheevoall")[i].value = tempVar;
    }
    if (vCheevoAll == 0) {
      achievementCode = 'no achievements';
      achievementCodeBox = 'no achievements';
    } else {
      if (!vSteamID) {
        achievementCode = vCheevoEarned + ' of ' + vCheevoAll + ' achievements'
        achievementCodeBox = vCheevoEarned + ' of ' + vCheevoAll + ' achievements'
      } else {
        achievementCode = '<a style="color: ' + vTextColor + '; text-decoration: underline;" href="http://steamcommunity.com/profiles/' + vSteamID + '/stats/' + vAppID + '/?tab=achievements">' + vCheevoEarned + ' of ' + vCheevoAll + ' achievements</a>'
        achievementCodeBox = '<a href="http://steamcommunity.com/profiles/' + vSteamID + '/stats/' + vAppID + '/?tab=achievements">' + vCheevoEarned + ' of ' + vCheevoAll + ' achievements</a>'
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
    for (i = 0; i < document.getElementsByName("playtime").length; i++) {
      document.getElementsByName("playtime")[i].value = tempVar;
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
      achievementCode = '<a style="color: ' + vTextColor + '; text-decoration: underline;" href="http://steamcommunity.com/profiles/' + vSteamID + '/stats/' + vAppID + '/?tab=achievements">' + vCheevoEarned + ' of ' + vCheevoAll + ' achievements</a>'
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
        achievementCode = '<a style="color: ' + vTextColor + '; text-decoration: underline;" href="http://steamcommunity.com/profiles/' + vSteamID + '/stats/' + vAppID + '/?tab=achievements">' + vCheevoEarned + ' of ' + vCheevoAll + ' achievements</a>'
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

  function updBar1(useless, arg) {
    if (this.value || !arg) {
      var tempVar = this.value;
    } else {
      var tempVar = arg;
    }
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
        break;
      case "wont-play":
        tempVar = "wont play";
        vBarColor = "#D9534F";
        break;
      case "never played":
        vBarColor = "#EEEEEE";
        break;
      case "never-played":
        tempVar = "never played";
        vBarColor = "#EEEEEE";
        break;
      default:
        vBarColor = tempVar;
    }
    boxBarColor = tempVar;
    for (i = 0; i < document.getElementsByName("barcolor").length; i++) {
      document.getElementsByName("barcolor")[i].value = tempVar;
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

  function updReview() {
    review = this.value;
    review = review.replace(/(?:\r\n|\r|\n)/g, '<br>');
    if (review) {
      randomString = "";
      while (randomString.length < 10) {
        randomString += randomStringPool[Math.floor(Math.random() * randomStringPool.length)];
      }
      reviewPointer = "cursor: pointer;";
      reviewID = 'generatorreview' + randomString;
      reviewCode = '<div id="' + reviewID + '" class="collapse"><p style="padding: 10px 20px; width: 100%; overflow: hidden; border: 1px solid #dee2e6; border-top: 0px; border-radius: .25rem;">' + review + '</p></div>';
      reviewCode2 = 'data-target="#' + reviewID + '" data-toggle="collapse" ';
    } else {
      reviewPointer = "";
      reviewID = "";
      reviewCode = "";
      reviewCode2 = "";
    }
    updPreview();
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
    preview.innerHTML = '<div ' + reviewCode2 + 'style="font-family: Oswald, Arial, sans-serif; line-height: 1; font-weight: 500; box-sizing: border-box; position: relative; min-height: 69px;' + bgCode + '; text-shadow: 1px 1px 0 black; ' + barCode + '; ' + reviewPointer + '"><div style="float: ' + vImagePos + ';"><a href="http://store.steampowered.com/app/' + vAppID + '/" target="_blank"><img src="http://cdn.akamai.steamstatic.com/steam/apps/' + vAppID + '/capsule_184x69.jpg" /></a></div><div style="padding-left: 1rem; float: left; width: calc(100% - 184px);"><h2 style="margin-bottom: 0px; padding-top: 5px; font-size: 22px; color: ' + vTitleColor + '">' + vGameTitle + '</h2><p style="margin-bottom: 0; font-size: 11px; font-family: Arimo; line-height: 1.4; color: ' + vTextColor + '">' + vPlaytime + ' hours of playtime, ' + achievementCode + '<br>' + vCustomText + '</p></div></div>' + reviewCode;
    viewCodeElement.textContent = '<div ' + reviewCode2 + 'style="position: relative; min-height: 69px; ' + bgCode + '; text-shadow: 1px 1px 0 black; ' + reviewPointer + barCode + ';"><div style="float: ' + vImagePos + ';"><a href="http://store.steampowered.com/app/' + vAppID + '/" target="_blank"><img src="http://cdn.akamai.steamstatic.com/steam/apps/' + vAppID + '/capsule_184x69.jpg" /></a></div><div style="padding-left: 1rem; float: left; width: calc(100% - 184px);"><h2 style="margin-bottom: 0px; padding-top: 5px; color: ' + vTitleColor + '">' + vGameTitle + '</h2><p style="margin-bottom: 0; font-size: 1rem; color: ' + vTextColor + '">' + vPlaytime + ' hours of playtime, ' + achievementCode + '<br>' + vCustomText + '</p></div></div>' + reviewCode;
    boxPreview.innerHTML = '<ul class="games"><li class="game-thumbnail game game-' + boxBarColor + '" data-item="axmqbj7"><div class="title">' + vGameTitle + '</div><a href="http://store.steampowered.com/app/' + vAppID + '/" target="_blank"><img alt="' + vGameTitle + '" src="http://cdn.akamai.steamstatic.com/steam/apps/' + vAppID + '/capsule_184x69.jpg"></a><div class="caption"><p>' + vPlaytime + ' hours playtime</p><p>' + achievementCodeBox + '</p></div></li></ul>';
    boxViewCodeElement.textContent = '<li class="game-thumbnail game game-' + boxBarColor + '" data-item="axmqbj7"><div class="title">' + vGameTitle + '</div><a href="http://store.steampowered.com/app/' + vAppID + '/" target="_blank"><img alt="' + vGameTitle + '" src="http://cdn.akamai.steamstatic.com/steam/apps/' + vAppID + '/capsule_184x69.jpg"></a><div class="caption"><p>' + vPlaytime + ' hours playtime</p><p>' + achievementCodeBox + '</p></div></li>';
  }

  function updProgressBarPreview() {
    progressBarPreview.innerHTML = '<div class="list-progress"><div class="progress-bar game-completed" title="completed: ' + vCompleted + ' of ' + vLibrary + ' games" style="width: ' + widthCompleted + '%; padding-left: 0px;">' + Math.round(widthCompleted) + '%</div><div class="progress-bar game-beaten" title="beaten: ' + vBeaten + ' of ' + vLibrary + ' games" style="width: ' + widthBeaten + '%; padding-left: 0px;">' + Math.round(widthBeaten) + '%</div><div class="progress-bar game-unfinished" title="unfinished: ' + vUnfinished + ' of ' + vLibrary + ' games" style="width: ' + widthUnfinished + '%; padding-left: 0px;">' + Math.round(widthUnfinished) + '%</div><div class="progress-bar game-never-played" title="never played: ' + vNeverPlayed + ' of ' + vLibrary + ' games" style="width: ' + widthNeverPlayed + '%; padding-left: 0px;">' + Math.round(widthNeverPlayed) + '%</div><div class="progress-bar game-wont-play" title="won\'t play: ' + vWontPlay + ' of ' + vLibrary + ' games" style="width: ' + widthWontPlay + '%; padding-left: 0px;"> ' + Math.round(widthWontPlay) + '%</div></div>';
    progressBarViewCodeElement.textContent = '<div class="list-progress"><div class="progress-bar game-completed" title="completed: ' + vCompleted + ' of ' + vLibrary + ' games" style="width: ' + widthCompleted + '%; padding-left: 0px;">' + Math.round(widthCompleted) + '%</div><div class="progress-bar game-beaten" title="beaten: ' + vBeaten + ' of ' + vLibrary + ' games" style="width: ' + widthBeaten + '%; padding-left: 0px;">' + Math.round(widthBeaten) + '%</div><div class="progress-bar game-unfinished" title="unfinished: ' + vUnfinished + ' of ' + vLibrary + ' games" style="width: ' + widthUnfinished + '%; padding-left: 0px;">' + Math.round(widthUnfinished) + '%</div><div class="progress-bar game-never-played" title="never played: ' + vNeverPlayed + ' of ' + vLibrary + ' games" style="width: ' + widthNeverPlayed + '%; padding-left: 0px;">' + Math.round(widthNeverPlayed) + '%</div><div class="progress-bar game-wont-play" title="won\'t play: ' + vWontPlay + ' of ' + vLibrary + ' games" style="width: ' + widthWontPlay + '%; padding-left: 0px;"> ' + Math.round(widthWontPlay) + '%</div></div>';
  }
  if (vCheevoAll == 0) {
    achievementCode = 'no achievements';
    achievementCodeBox = 'no achievements';
  } else {
    if (!vSteamID) {
      achievementCode = vCheevoEarned + ' of ' + vCheevoAll + ' achievements'
      achievementCodeBox = vCheevoEarned + ' of ' + vCheevoAll + ' achievements'
    } else {
      achievementCode = '<a style="color: ' + vTextColor + '; text-decoration: underline;"href="http://steamcommunity.com/profiles/' + vSteamID + '/stats/' + vAppID + '/?tab=achievements">' + vCheevoEarned + ' of ' + vCheevoAll + ' achievements</a>'
      achievementCodeBox = '<a href="http://steamcommunity.com/profiles/' + vSteamID + '/stats/' + vAppID + '/?tab=achievements">' + vCheevoEarned + ' of ' + vCheevoAll + ' achievements</a>'
    }
  }
  updPreview();
  updProgressBarPreview();
  steamIDField.value = localStorage.steamID;
  useAutofill = localStorage.autofill;
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