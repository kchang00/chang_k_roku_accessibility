(() => {
  console.log("working");

  const video           = document.querySelector("video"),
    videoContainer      = document.querySelector(".video"),
    playButton          = document.querySelector("#playPause"),
    muteButton          = document.querySelector("#mute"),
    fullScreenButton    = document.querySelector("#fullScreen"),
    subtitlesButton     = document.querySelector("#subtitles"),
    timeBar             = document.querySelector("#timeBar"),
    volumeBar           = document.querySelector("#volumeBar"),
    videoOverlay        = document.querySelector(".videoOverlay"),
    videoBtns 			    = document.querySelectorAll('.video-btn'),
    subtitles           = document.querySelector(".subtitles"),
    subtitleMenuButtons = [];
  
  var subtitlesMenu;

  function loadVideo() {      
    video.load();
    video.currentTime = 0;
    video.pause();
  }

  function swapVideoSrc() {
    // get media title from the class list
    // can type this.className.split(" ")[1] into the console
    let targetSrc = this.className.split(" ")[1];
    video.src = `video/${targetSrc}.mp4`;
    subtitles.src = `captions/${targetSrc}.vtt`;
    videoOverlay.style.display = "block";
    // being inserted directly into HTML, no need for changing directories
    videoOverlay.style.backgroundImage = `url(images/${targetSrc}.jpg)`;
  }

  //function to displat rewind button when the video ended
  video.onended = function() {
    playButton.getElementsByTagName('img')[0].src = `images/ctrl_rewind.svg`;
  };

  function playPause() {
    if (video.paused == true) {
      videoOverlay.style.display = "none";
      video.play(); // Play the video
      playButton.getElementsByTagName('img')[0].src = `images/ctrl_pause.svg`; // Update the button text to 'Pause'
    } else {
      video.pause(); // Pause the video
      playButton.getElementsByTagName('img')[0].src = `images/ctrl_play.svg`; // Update the button text to 'Play'
    }

    //rewind the video
    if (video.onended == true) {
      video.play();
    }
  }

  //mute/unmute function
  function muteUnmute() {
    if (video.muted == false) {
      video.muted = true; // Mute the video
      volumeBar.value = 0; // Change the volume bar
      muteButton.getElementsByTagName('img')[0].src = `images/ctrl_muted.svg`; // Change the mute button
    } else {
      video.muted = false; // Unmute the video
      volumeBar.value = video.volume; // Change the volume bar
      muteButton.getElementsByTagName('img')[0].src = `images/ctrl_unmute.svg`; // Change the mute button
    }
  }

  function timeTracker() {
    var totalTime = video.duration * (timeBar.value / 100); // Calculate the new time
    video.currentTime = totalTime; // Update the video time
  }

  // Updates the timeBar slider as the video plays
  function timeUpdater() {
    var totalValue = (100 / video.duration) * video.currentTime; // Calculate the slider value
    timeBar.value = totalValue; // Update the slider value
  }

  function formatTime(s) {
    m = Math.floor(s / 60);
    m = (m >= 10) ? m : "0" + m;
    s = Math.floor(s % 60);
    s = (s >= 10) ? s : "0" + s;
    return m + ":" + s;
  }

  video.addEventListener('timeupdate', function() {
    // Set to minute and seconds
    var time = video.currentTime;
    var seconds = time.toFixed(2);
    var cleanTime = formatTime(seconds);
    var currentTime = document.querySelector('#currentTime');

    // Set the current play value
    currentTime.innerHTML = cleanTime;
});

  video.addEventListener('loadedmetadata', function () {
    // Set to minute and seconds
    var duration = video.duration;
    var seconds = duration.toFixed(2);
    var cleanDuration = formatTime(seconds);
    var durationTime = document.querySelector('#duration');
    // Set the video duration
    durationTime.innerHTML = cleanDuration;
  });

  // Used to pause timeBar when user is dragging handle, DOES NOT control play/pause button
  function videoPause() {
    video.pause();
  }

  function volumeChange() {
    video.muted = false; //unmute video
    video.volume = volumeBar.value; //change volume
    muteButton.getElementsByTagName('img')[0].src = `images/ctrl_unmute.svg`; //change mute button

    if (volumeBar.value == 0) {
      muteButton.getElementsByTagName('img')[0].src = `images/ctrl_muted.svg`; //change mute button if value = 0
    }
    // Update video volume
  }

  function fullScreen() {
    if (video.requestFullscreen) {
      video.requestFullscreen();
    } else if (video.mozRequestFullScreen) {
      video.mozRequestFullScreen(); // Fallback for Firefox
    } else if (video.webkitRequestFullscreen) {
      video.webkitRequestFullscreen(); // Fallback for Chrome and Safari
    }
  }

    // subtitles (https://developer.mozilla.org/en-US/docs/Web/Guide/Audio_and_video_delivery/Adding_captions_and_subtitles_to_HTML5_video)
  // turns off all subtitles (in case browser turns them on by default)
  // loops through each test track (in the case we add future tracks for multiple languages)
  for (var i = 0; i < video.textTracks.length; i++) {
    video.textTracks[i].mode = 'hidden';
  }

  // creates and adds subtitles
  var createMenuItem = function(id, lang, label) {
    var listItem = document.createElement('li');
    var button = listItem.appendChild(document.createElement('button'));
    button.setAttribute('id', id);
    button.className = 'subtitles-button';
    if (lang.length > 0) button.setAttribute('lang', lang);
    button.value = label;
    button.setAttribute('data-state', 'inactive');
    button.appendChild(document.createTextNode(label));
    button.addEventListener('click', function(e) {
        // Set all buttons to inactive
        subtitleMenuButtons.map(function(v, i, a) {
          subtitleMenuButtons[i].setAttribute('data-state', 'inactive');
        });
        // Find the language to activate
        var lang = this.getAttribute('lang');
        for (var i = 0; i < video.textTracks.length; i++) {
          // For the 'subtitles-off' button, the first condition will never match so all will subtitles be turned off
          if (video.textTracks[i].language == lang) {
              video.textTracks[i].mode = 'showing';
              this.setAttribute('data-state', 'active');
          }
          else {
              video.textTracks[i].mode = 'hidden';
          }
        }
        subtitlesMenu.style.display = 'none';
    });
    subtitleMenuButtons.push(button);
    return listItem;
  }

  // menu for displaying subtitle tracks - built dynamically, so that languages can be added or removed later in HTML
  // creates off button
  // then looks through tracks and builds the menu using that data
  if (video.textTracks) {
    var df = document.createDocumentFragment();
    var subtitlesMenu = df.appendChild(document.createElement('ul'));
    subtitlesMenu.className = 'subtitles-menu';
    subtitlesMenu.appendChild(createMenuItem('subtitles-off', '', 'Off'));
    for (var i = 0; i < video.textTracks.length; i++) {
        subtitlesMenu.appendChild(createMenuItem('subtitles-' + video.textTracks[i].language, video.textTracks[i].language, video.textTracks[i].label));
    }
    videoContainer.appendChild(subtitlesMenu);
  }

  function accessibleClick(event){
    if(event.type === 'click'){
        return true;
    }
    else if(event.type === 'keypress'){
        var code = event.charCode || event.keyCode;
        if((code === 32)|| (code === 13)){
            return true;
        }
    }
    else{
        return false;
    }
  }

  // video event listeners
  videoBtns.forEach(btn => btn.addEventListener("click", swapVideoSrc));
  window.addEventListener("load", loadVideo);

  // playing and pausing the video
  playButton.addEventListener("click", playPause);
  video.addEventListener("click", playPause);
  video.addEventListener("keypress", function(e) {
    if(accessibleClick(event) === true){
      playPause();
    }
  });
  videoOverlay.addEventListener("click", playPause);

  //other video controls
  muteButton.addEventListener("click", muteUnmute);
  fullScreenButton.addEventListener("click", fullScreen);
  timeBar.addEventListener("change", timeTracker);
  video.addEventListener("timeupdate", timeUpdater);
  subtitlesButton.addEventListener('click', function(e) {
    if (subtitlesMenu) {
      console.log('subtitles button clicked');
       subtitlesMenu.style.display = (subtitlesMenu.style.display == 'block' ? 'none' : 'block');
    }
  });

  // pauses timebar when user is dragging handle
  timeBar.addEventListener("mousedown", videoPause);
  timeBar.addEventListener("mouseup", playPause);
  volumeBar.addEventListener("change", volumeChange);
})();
  
  // DEV NOTES!
  
  // ** There is a bug: the timeBar displays at half when the page loads.
  