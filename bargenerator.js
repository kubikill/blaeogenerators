$(document).ready(function() {
	$('#autofillwarning').hide();
	if (localStorage.firstTimeMsgDismissed) {
		$('#firsttimemsg').hide();
	}
	document.getElementById("firsttimebtn").onclick = function() {
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
    vBarType = "one",
    vBarColor = "#5BC0DE",
    bgCode, barCode, useAutofill = 'false',
    barAlwaysPreview,
    boxBarColor = "completed",
    vTextColor = "#FFFFFF",
    achievementCode,
    noAchievements = false;
    vSteamID = localStorage.steamID;
	if (!vSteamID) {
	achievementCode = vCheevoEarned + ' of ' + vCheevoAll + ' achievements';
	}
	else {
	achievementCode = '<a href="http://steamcommunity.com/profiles/' + vSteamID + '/stats/' + vAppID + '/?tab=achievements">' + vCheevoEarned + ' of ' + vCheevoAll + ' achievements</a>'
	}
  // Get IDs of stuff
  var previewElement = document.getElementById("preview");
  var boxPreview = document.getElementById("boxpreview");
  var viewCodeElement = document.getElementById("generated");
  var boxViewCodeElement = document.getElementById("boxgenerated");
  var barColor = document.getElementById("barcolor");
  var bg1 = document.getElementById("bgcolor1");
  var bg1text = document.getElementById("bgcolor1text");
  var bg2 = document.getElementById("bgcolor2");
  var bg2text = document.getElementById("bgcolor2text");
  var textColorPick = document.getElementById("textcolorpick");
  var textColorText = document.getElementById("textcolor");
  var gameTitleField = document.getElementById("gametitle");
  var playtimeField = document.getElementById("playtime");
  var barField = document.getElementById("barcolor");
  var steamIDField = document.getElementById("steamid");
  // Copy to clipboard button code
  var copyButton = document.querySelector('.copybutton');
  copyButton.addEventListener('click', function(event) {
    var copyArea = document.querySelector('.generatedtext');
    copyArea.select();
    try {
      document.getElementById("generated").select();
      var successful = document.execCommand('copy');
    } catch (err) {
      console.log('Unable to copy');
    }
  })
  var barCopyButton = document.querySelector('#boxcopybutton');
  barCopyButton.addEventListener('click', function(event) {
    var copyArea = document.querySelector('.boxgeneratedtext');
    copyArea.select();
    try {
      document.getElementById("boxgenerated").select();
      var successful = document.execCommand('copy');
    } catch (err) {
      console.log('Unable to copy');
    }
  })
  // Fetch cool stuff from BLAEO function. Also, update appID
  var fetchBLAEO = function() {
    vAppID = this.value;
    for (i=0; i < document.getElementsByName("appid").length; i++) {
      document.getElementsByName("appid")[i].value = vAppID;
    }
	if (!vSteamID) {
	achievementCode = vCheevoEarned + ' of ' + vCheevoAll + ' achievements';
	}
	else {
	achievementCode = '<a href="http://steamcommunity.com/profiles/' + vSteamID + '/stats/' + vAppID + '/?tab=achievements">' + vCheevoEarned + ' of ' + vCheevoAll + ' achievements</a>'
	}
    // Do not fetch if SteamID/AppID is invalid or autofilling is off
    if (!vAppID || !vSteamID || useAutofill == "false") {
	  updPreview();
	  console.log("nope");
      return 0;
    }
    fetch('https://www.backlog-assassins.net/users/+' + vSteamID + '/games/' + this.value, {
        headers: {
          'Accept': 'application/json'
        }
      })
      .then(res => res.json())
      .then(data => stats = data)
      .then(function() {
        var tempPlaytime = stats.game.playtime / 60;
        updGameTitle("hey what do you think you're doing", stats.game.name);
        updPlaytime("looking for easter eggs?", tempPlaytime.toFixed(1));
        updBar1("guess you found one", stats.game.progress);
        if (stats.game.hasOwnProperty('achievements')) {
          for (i=0; i < document.getElementsByName("cheevoearned").length; i++) {
          document.getElementsByName("cheevoearned")[i].readOnly = false;
          document.getElementsByName("cheevoearned")[i].value = stats.game.achievements.unlocked;
          document.getElementsByName("cheevoall")[i].readOnly = false;
          document.getElementsByName("cheevoall")[i].value = stats.game.achievements.total;
          document.getElementsByName("noachievements")[i].classList.remove('active');
        }
          if (!vSteamID) {
				achievementCode = vCheevoEarned + ' of ' + vCheevoAll + ' achievements'
			}
			else {
				achievementCode = '<a href="http://steamcommunity.com/profiles/' + vSteamID + '/stats/' + vAppID + '/?tab=achievements">' + vCheevoEarned + ' of ' + vCheevoAll + ' achievements</a>'
			}
          updCheevoEarned("welp, i can't stop you ¯\_(ツ)_/¯", stats.game.achievements.unlocked);
          updCheevoAll("i could leave this empty but i decided to put some silly stuff here soooo uhhhh, have a nice day", stats.game.achievements.total);
        }
        else {
          achievementCode = "no achievements";
          updPreview();
          vCheevoEarned = "0";
          vCheevoAll = "0";
          for (i=0; i < document.getElementsByName("cheevoearned").length; i++) {
          document.getElementsByName("cheevoearned")[i].value = "0";
          document.getElementsByName("cheevoall")[i].value = "0";
          document.getElementsByName("cheevoearned")[i].readOnly = true;
          document.getElementsByName("cheevoall")[i].readOnly = true;
          document.getElementsByName("noachievements")[i].classList.add('active');
        }
        }

        gameTitleField.value = stats.game.name;
        playtimeField.value = tempPlaytime.toFixed(1);
        barField.value = stats.game.progress
        $('#autofillerror').fadeOut();
      })
      .catch(function(response) {
        $('#autofillerror').fadeIn();
		updPreview();
      });
	  
  }
  // Add event listeners - those trigger when something gets typed or changed
  document.getElementsByName("steamid")[0].addEventListener('blur', updSteamID);
	for (i=0; i < document.getElementsByName("gametitle").length; i++) {
        document.getElementsByName("gametitle")[i].addEventListener('input', updGameTitle)
      }
	for (i=0; i < document.getElementsByName("appid").length; i++) {
        document.getElementsByName("appid")[i].addEventListener('blur', fetchBLAEO)
      }
	for (i=0; i < document.getElementsByName("playtime").length; i++) {
        document.getElementsByName("playtime")[i].addEventListener('input', updPlaytime)
    }
	for (i=0; i < document.getElementsByName("cheevoearned").length; i++) {
        document.getElementsByName("cheevoearned")[i].addEventListener('input', updCheevoEarned)
    }
	for (i=0; i < document.getElementsByName("cheevoall").length; i++) {
        document.getElementsByName("cheevoall")[i].addEventListener('input', updCheevoAll)
    }
	for (i=0; i < document.getElementsByName("textcolor").length; i++) {
        document.getElementsByName("textcolor")[i].addEventListener('input', updTextColor)
    }
	for (i=0; i < document.getElementsByName("barcolor").length; i++) {
        document.getElementsByName("barcolor")[i].addEventListener('input', updBar1)
    }
  document.getElementsByName("bgtype")[0].addEventListener('change', updBgType);
  document.getElementsByName("bgcolor1")[0].addEventListener('input', updBgColor1);
  document.getElementsByName("bgcolor1text")[0].addEventListener('input', updBgColor1);
  document.getElementsByName("bgcolor2")[0].addEventListener('input', updBgColor2);
  document.getElementsByName("bgcolor2text")[0].addEventListener('input', updBgColor2);
  document.getElementsByName("barnum")[0].addEventListener('change', updBarType);
  document.getElementsByName("customtext")[0].addEventListener('input', updCustomText);

  // Makes the Yes/No buttons work
  var barOn = document.getElementById("baron");
  var barOff = document.getElementById("baroff");
  var autofillOn = document.getElementById("autofillon");
  var autofillOff = document.getElementById("autofilloff");
  var barAlwaysPreviewOn = document.getElementById("baralwayspreviewon");
  var barAlwaysPreviewOff = document.getElementById("baralwayspreviewoff");
  function handleClickNo1() {
    if (document.getElementsByName("noachievements")[0].classList.contains('active')) {
      for (i=0; i < document.getElementsByName("cheevoearned").length; i++) {
        document.getElementsByName("cheevoearned")[i].readOnly = false;
        document.getElementsByName("cheevoall")[i].readOnly = false;
      }
      document.getElementsByName("noachievements")[1].classList.remove('active');
      if (!vSteamID) {
	achievementCode = vCheevoEarned + ' of ' + vCheevoAll + ' achievements'
	}
	else {
	achievementCode = '<a href="http://steamcommunity.com/profiles/' + vSteamID + '/stats/' + vAppID + '/?tab=achievements">' + vCheevoEarned + ' of ' + vCheevoAll + ' achievements</a>'
	}
  }
    else {
      for (i=0; i < document.getElementsByName("cheevoearned").length; i++) {
        document.getElementsByName("cheevoearned")[i].readOnly = true;
        document.getElementsByName("cheevoall")[i].readOnly = true;
      }
      document.getElementsByName("noachievements")[1].classList.add('active');
      achievementCode = "no achievements";
  }
  updPreview();
  }
  function handleClickNo2() {
    if (document.getElementsByName("noachievements")[1].classList.contains('active')) {
      for (i=0; i < document.getElementsByName("cheevoearned").length; i++) {
        document.getElementsByName("cheevoearned")[i].readOnly = false;
        document.getElementsByName("cheevoall")[i].readOnly = false;
      }
      document.getElementsByName("noachievements")[0].classList.remove('active');
      if (!vSteamID) {
	achievementCode = vCheevoEarned + ' of ' + vCheevoAll + ' achievements'
	}
	else {
	achievementCode = '<a href="http://steamcommunity.com/profiles/' + vSteamID + '/stats/' + vAppID + '/?tab=achievements">' + vCheevoEarned + ' of ' + vCheevoAll + ' achievements</a>'
	}

  }
    else {
      for (i=0; i < document.getElementsByName("cheevoearned").length; i++) {
        document.getElementsByName("cheevoearned")[i].readOnly = true;
        document.getElementsByName("cheevoall")[i].readOnly = true;
      }
      document.getElementsByName("noachievements")[0].classList.add('active');
      achievementCode = "no achievements";
  }
  updPreview();
  }
  $(document.getElementsByName("noachievements")[0]).click(handleClickNo1);
  $(document.getElementsByName("noachievements")[1]).click(handleClickNo2);
  $(barOn).click(function() {
    vBarType = true;
    barColor.removeAttribute("disabled");
    updPreview();
  })
  $(barOff).click(function() {
    vBarType = false;
    barColor.setAttribute("disabled", "true");
    updPreview();
  });
  $(autofillOn).click(function() {
    useAutofill = "true";
    localStorage.autofill = true;
    if (!vSteamID) {
      $('#autofillwarning').show();
    }
    else {
      $('#autofillwarning').hide();
    };
  });
  $(autofillOff).click(function() {
    useAutofill = "false";
    localStorage.autofill = false;
    $('#autofillwarning').hide();
	$('#autofillerror').fadeOut();
  });
  $(barAlwaysPreviewOn).click(function() {
    barAlwaysPreview = true;
    localStorage.barAlwaysPreview = true;
    previewElement.setAttribute("style", "position: sticky; margin: 0; padding-left: 0; bottom: 0; left: 0; width: 100%; z-index: 1000; height: 69px;");
  });
  $(barAlwaysPreviewOff).click(function() {
    barAlwaysPreview = false;
    localStorage.barAlwaysPreview = false;
    previewElement.setAttribute("style", "position: initial; padding-left: 0; bottom: 0; left: 0; width: 100%; z-index: 1000; height: 69px;");
  });
  $('.copybutton').tooltip({
    trigger: "focus",
    template: '<div class="tooltip" role="tooltip"><div class="arrow"></div><div class="tooltip-inner" style="background-color: #28a745;"></div></div>',
    title: "Copied!",
    placement: "right",
    delay: {
      "show": 0,
      "hide": 3000
    }
  });
  // Update variable functions
  function updBarAlwaysPreview() {
    barAlwaysPreview = this.value;
    switch (barAlwaysPreview) {
      case "disable":
        previewElement.setAttribute("style", "position: initial; padding-left: 0; bottom: 0; left: 0; width: 100%; z-index: 1000; height: 69px;");
        break;
      case "bottom":
        previewElement.setAttribute("style", "position: sticky; margin: 0; padding-left: 0; bottom: 0; left: 0; width: 100%; z-index: 1000; height: 69px;");
        break;
    }
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
    for (i=0; i < document.getElementsByName("gametitle").length; i++) {
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
    if (tempVar == "") {
      vCheevoEarned = "0";
    } else {
      vCheevoEarned = tempVar;
    }
    for (i=0; i < document.getElementsByName("cheevoearned").length; i++) {
      document.getElementsByName("cheevoearned")[i].value = tempVar;
    }
    if (!vSteamID) {
	achievementCode = vCheevoEarned + ' of ' + vCheevoAll + ' achievements'
	}
	else {
	achievementCode = '<a href="http://steamcommunity.com/profiles/' + vSteamID + '/stats/' + vAppID + '/?tab=achievements">' + vCheevoEarned + ' of ' + vCheevoAll + ' achievements</a>'
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
    for (i=0; i < document.getElementsByName("cheevoall").length; i++) {
      document.getElementsByName("cheevoall")[i].value = tempVar;
    }
    if (!vSteamID) {
	achievementCode = vCheevoEarned + ' of ' + vCheevoAll + ' achievements'
	}
	else {
	achievementCode = '<a href="http://steamcommunity.com/profiles/' + vSteamID + '/stats/' + vAppID + '/?tab=achievements">' + vCheevoEarned + ' of ' + vCheevoAll + ' achievements</a>'
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
    for (i=0; i < document.getElementsByName("playtime").length; i++) {
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
	}
	else {
	achievementCode = '<a href="http://steamcommunity.com/profiles/' + vSteamID + '/stats/' + vAppID + '/?tab=achievements">' + vCheevoEarned + ' of ' + vCheevoAll + ' achievements</a>'
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

  function updBarType() {
    vBarType = this.value;
    if (vBarType) {
      barColor.readOnly = false;
    } else {
      barColor.readOnly = true;
    }
    updPreview();
  }

  function updBar1(useless, arg) {
    if (this.value || !arg) {
      var tempVar = this.value;
    } else {
      var tempVar = arg;
    }
    boxBarColor = tempVar;
    for (i=0; i < document.getElementsByName("barcolor").length; i++) {
      document.getElementsByName("barcolor")[i].value = tempVar;
    }
    switch(tempVar) {
      case "completed":
        vBarColor = "#5BC0DE";
        break;
      case "beaten":
        vBarColor = "#5CB85C";
        break;
      case "unfinished":
        vBarColor = "#F0AD4E";
        break;
      case "wont-play":
        vBarColor = "#D9534F";
        break;
	  case "never-played":
        vBarColor = "#EEEEEE";
        break;
      default:
        vBarColor = tempVar;
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
    if (!vBarType) {
      barCode = "";
    } else {
      barCode = "border-left: 10px solid " + vBarColor;
    }
  }
  //Update preview function, called everytime something gets changed
  function updPreview() {
    updBg();
    updBars();
    preview.innerHTML = '<div style="font-family: Oswald, Arial, sans-serif; line-height: 1; font-weight: 500; box-sizing: border-box; position: relative; min-height: 69px; padding-left: 1rem; ' + bgCode + 'color: ' + vTextColor + '; text-shadow: 1px 1px 0 black; ' + barCode + ';"><div style="float: right;"><a href="http://store.steampowered.com/app/' + vAppID + '/" target="_blank"><img src="http://cdn.akamai.steamstatic.com/steam/apps/' + vAppID + '/capsule_184x69.jpg" /></a></div><h2 style="margin-bottom: 0px; padding-top: 5px; font-size: 22px; ">' + vGameTitle + '</h2><p style="font-size: 11px; font-family: Arimo; line-height: 1.4; text-spacing">' + vPlaytime + ' hours of playtime, ' + achievementCode + '<br>' + vCustomText + '</p></div>';
    generated.textContent = '<div style="position: relative; min-height: 69px; padding-left: 1rem; ' + bgCode + 'color: ' + vTextColor + '; text-shadow: 1px 1px 0 black; ' + barCode + ';"><div style="float: right;"><a href="http://store.steampowered.com/app/' + vAppID + '/" target="_blank"><img src="http://cdn.akamai.steamstatic.com/steam/apps/' + vAppID + '/capsule_184x69.jpg" /></a></div><h2 style="margin-bottom: 0px; padding-top: 5px; ">' + vGameTitle + '</h2><p style="font-size: 1rem;">' + vPlaytime + ' hours of playtime, ' + achievementCode + '<br>' + vCustomText + '</p></div>';
    boxPreview.innerHTML = '<ul class="games"><li class="game-thumbnail game game-' + boxBarColor + '" data-item="axmqbj7"><div class="title">' + vGameTitle + '</div><a href="http://store.steampowered.com/app/' + vAppID + '/" target="_blank"><img alt="' + vGameTitle + '" src="http://cdn.akamai.steamstatic.com/steam/apps/' + vAppID + '/capsule_184x69.jpg"></a><div class="caption"><p>' + vPlaytime + ' hours playtime</p><p>' + achievementCode + '</p></div></li></ul>'
    boxViewCodeElement.textContent = '<li class="game-thumbnail game game-' + boxBarColor + '" data-item="axmqbj7"><div class="title">' + vGameTitle + '</div><a href="http://store.steampowered.com/app/' + vAppID + '/" target="_blank"><img alt="' + vGameTitle + '" src="http://cdn.akamai.steamstatic.com/steam/apps/' + vAppID + '/capsule_184x69.jpg"></a><div class="caption"><p>' + vPlaytime + ' hours playtime</p><p>' + achievementCode + '</p></div></li>'
  }
  updPreview();
  steamIDField.value = localStorage.steamID;
  useAutofill = localStorage.autofill;
  if (useAutofill == "true") {
    document.getElementById("autofillon").classList.add("active");
  } else {
    document.getElementById("autofilloff").classList.add("active");
  }
  barAlwaysPreview = localStorage.barAlwaysPreview;
  if (barAlwaysPreview == "true") {
    document.getElementById("baralwayspreviewon").classList.add("active");
    previewElement.setAttribute("style", "position: sticky; margin: 0; padding-left: 0; bottom: 0; left: 0; width: 100%; z-index: 1000; height: 69px;");
  } else {
    document.getElementById("baralwayspreviewoff").classList.add("active");
  }
  if (!vSteamID && useAutofill == "true") {
    $('#autofillwarning').show();
  }
});