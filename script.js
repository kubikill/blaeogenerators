window.onload=function(){
  // Declare variables
  var vGameTitle = "Example title", vAppID = "220", vCheevoEarned = "0", vCheevoAll = "0", vPlaytime = "0", vSteamID = "http://steamcommunity.com/profiles/0000", vCustomText = "", vBgType = "solid", vBgColor1 = "000000", vBgColor2 = "000000", vGradientStyle = "to right", vBarType = "one", vBarColor1 = "#5BC0DE", vBarColor2 = "#5BC0DE", bgCode, barCode, barTwoCode = "", barThreeCode = "", barFourCode = "";
  // Get ID of preview element
  var previewElement = document.getElementById("preview");
  // Get ID of view code element
  var viewCodeElement = document.getElementById("generated");
  // Copy to clipboard button code
  var copyButton = document.querySelector('.copybutton');
  copyButton.addEventListener('click', function(event) {
  var copyArea = document.querySelector('.generatedtext');
  copyArea.select();
  try {
	document.getElementById("generated").select();
    var successful = document.execCommand('copy');
	var copiedStatus = document.getElementById("copiedtext");
	copiedStatus.style.display = "inline";
	setTimeout(function () {
		copiedStatus.style.display = "none";
	}, 5000);
  } catch (err) {
    console.log('Unable to copy');
  }})

  // Add event listeners - those trigger when something gets typed or changed
  document.getElementsByName("gametitle")[0].addEventListener('input', updGameTitle);
  document.getElementsByName("appid")[0].addEventListener('input', updAppID);
  document.getElementsByName("cheevoearned")[0].addEventListener('input', updCheevoEarned);
  document.getElementsByName("cheevoall")[0].addEventListener('input', updCheevoAll);
  document.getElementsByName("playtime")[0].addEventListener('input', updPlaytime);
  document.getElementsByName("steamid")[0].addEventListener('input', updSteamID);
  document.getElementsByName("customtext")[0].addEventListener('input', updCustomText);
  document.getElementsByName("bgtype")[0].addEventListener('change', updBgType);
  document.getElementsByName("bgtype")[1].addEventListener('change', updBgType);
  document.getElementsByName("bgcolor1")[0].addEventListener('input', updBgColor1);
  document.getElementsByName("bgcolor2")[0].addEventListener('input', updBgColor2);
  document.getElementsByName("gradientstyle")[0].addEventListener('change', updGradientStyle);
  document.getElementsByName("gradientstyle")[1].addEventListener('change', updGradientStyle);
  document.getElementsByName("barnum")[0].addEventListener('change', updBarType);
  document.getElementsByName("barnum")[1].addEventListener('change', updBarType);
  document.getElementsByName("barnum")[2].addEventListener('change', updBarType);
  document.getElementsByName("bar1")[0].addEventListener('input', updBar1);
  document.getElementsByName("bar2")[0].addEventListener('input', updBar2);
  // Update variable functions
  function updGameTitle(){
    if (this.value == "") {
      vGameTitle = "Example title";
    }
    else {
      vGameTitle = this.value;
    }
    updPreview();
  }
  function updAppID(){
    if (this.value == "") {
      vAppID = "220";
    }
    else {
      vAppID = this.value;
    }
    updPreview();
  }
  function updCheevoEarned(){
    if (this.value == "") {
      vCheevoEarned = "0";
    }
    else {
      vCheevoEarned = this.value;
    }
    updPreview();
  }
  function updCheevoAll(){
    if (this.value == "") {
      vCheevoAll = "0";
    }
    else {
      vCheevoAll = this.value;
    }
    updPreview();
  }
  function updPlaytime(){
    if (this.value == "") {
      vPlaytime = "0";
    }
    else {
      vPlaytime = this.value;
    }
    updPreview();
  }
  function updSteamID(){
    if (this.value == "") {
      vSteamID = "0";
    }
    else {
      vSteamID = this.value;
    }
    if (vSteamID.match(/[a-z]/i)) {
    vSteamID = "http://steamcommunity.com/id/" + vSteamID;
    }
    else {
    vSteamID = "http://steamcommunity.com/profiles/" + vSteamID;
    }
    updPreview();
  }
  function updCustomText(){
    if (this.value == "") {
      vCustomText = "";
    }
    else {
      vCustomText = this.value;
    }
    updPreview();
  }
  function updBgType(){
    vBgType = this.value;
    var bgColor2 = document.getElementById("bgcolor2");
    var gradientStyle = document.getElementById("gradientstyle");
    if (vBgType == "solid") {
      bgColor2.style.display = "none";
      gradientStyle.style.display = "none";
    }
    else {
      bgColor2.style.display = "block";
      gradientStyle.style.display = "block";
    }
    updPreview();
  }
  function updBgColor1(){
    vBgColor1 = this.value;
    while (vBgColor1.length < 6) {
      vBgColor1 = vBgColor1 + "0"
    }
    updPreview();
  }
  function updBgColor2(){
    vBgColor2 = this.value;
    while (vBgColor2.length < 6) {
      vBgColor2 = vBgColor2 + "0"
    }
    updPreview();
  }
  function updGradientStyle(){
    if (this.value == "horizontal") {
      vGradientStyle = "to right";
    }
    else {
      vGradientStyle = "to bottom";
    }
    updPreview();
  }
  function updBarType(){
    vBarType = this.value;
    var bar1 = document.getElementById("bar1");
    var bar2 = document.getElementById("bar2");
    if (vBarType == "none") {
      bar1.style.display = "none";
      bar2.style.display = "none";
    }
    else if (vBarType == "one") {
      bar1.style.display = "block";
      bar2.style.display = "none";
    }
    else {
      bar1.style.display = "block";
      bar2.style.display = "block";
    }
    updPreview();
  }
  function updBar1(){
    vBarColor1 = this.value;
    updPreview();
  }
  function updBar2(){
    vBarColor2 = this.value;
    updPreview();
  }
  //Update background
  function updBg(){
    if (vBgType == "solid") {
      bgCode = "background: #" + vBgColor1 + "; ";
    }
    else {
      bgCode = "background: linear-gradient(" + vGradientStyle + ", #" + vBgColor1 + ", #" + vBgColor2 + ");";
    }
  }
  //Update bars
  function updBars(){
    if (vBarType == "none") {
      barCode = "";
      barTwoCode = "";
      barThreeCode = "";
      barFourCode = "";
    }
    else if (vBarType == "one") {
      barCode = "border-left: 10px solid " + vBarColor1;
      barTwoCode = "";
      barThreeCode = "";
      barFourCode = "";
    }
    else {
      barCode = "border-left: 10px solid " + vBarColor1;
      barTwoCode = '<div style="border-left: 10px solid ' + vBarColor2 + '; margin-left: -6px; min-height: 68px;">';
      barThreeCode = '<div style="margin-left: 10px;">';
      barFourCode = "</div>";
    }
  }
  //Update preview function, called everytime something gets changed
  function updPreview(){
    updBg();
    updBars();
    preview.innerHTML = '<div style="font-family: Oswald, Arial, sans-serif; line-height: 1; font-weight: 500; box-sizing: border-box; position: relative; min-height: 68px; padding-left: 1rem; ' + bgCode + 'color: #fff; text-shadow: 1px 1px 0 black; ' + barCode + ';">' + barTwoCode + '<div style="float: right;"><a href="http://store.steampowered.com/app/' + vAppID + '/" target="_blank"><img src="http://cdn.akamai.steamstatic.com/steam/apps/' + vAppID + '/capsule_184x69.jpg" /></a></div>' + barThreeCode + '<h2 style="margin-bottom: 0px; padding-top: 5px; font-size: 22px; ">' + vGameTitle + '</h2><p style="font-size: 11px; font-family: Arimo; line-height: 1.4; text-spacing">' + vPlaytime + ' hours of playtime, <a href="' + vSteamID + '/stats/' + vAppID + '/?tab=achievements">' + vCheevoEarned + ' of ' + vCheevoAll + ' achievements</a><br>' + vCustomText + '</p>' + barFourCode + barFourCode + '</div>';
    generated.textContent = '<div style="position: relative; min-height: 69px; padding-left: 1rem; ' + bgCode + 'color: #fff; text-shadow: 1px 1px 0 black; ' + barCode + ';">' + barTwoCode + '<div style="float: right;"><a href="http://store.steampowered.com/app/' + vAppID + '/" target="_blank"><img src="http://cdn.akamai.steamstatic.com/steam/apps/' + vAppID + '/capsule_184x69.jpg" /></a></div>' + barThreeCode + '<h2 style="margin-bottom: 0px; padding-top: 5px; ">' + vGameTitle + '</h2><p style="font-size: 1rem;">' + vPlaytime + ' hours of playtime, <a href="' + vSteamID + '/stats/' + vAppID + '/?tab=achievements">' + vCheevoEarned + ' of ' + vCheevoAll + ' achievements</a><br>' + vCustomText + '</p>' + barFourCode + barFourCode + '</div>';
  }
  updPreview();
}
