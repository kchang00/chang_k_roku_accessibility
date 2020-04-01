(() => {
  console.log("working");

  const video           = document.querySelector("video"),
    videoContainer      = document.querySelector(".video"),
    videoPlayButton     = document.querySelector("#videoPlayPause"),
    videoMuteButton     = document.querySelector("#videoMute"),
    fullScreenButton    = document.querySelector("#fullScreen"),
    subtitlesButton     = document.querySelector("#subtitles"),
    videoTimeBar        = document.querySelector("#videoTimeBar"),
    videoVolumeBar      = document.querySelector("#videoVolumeBar"),
    videoOverlay        = document.querySelector(".videoOverlay"),
    videoBtns 			    = document.querySelectorAll('.video-btn'),
    subtitles           = document.querySelector(".subtitles"),
    subtitleMenuButtons = [],
    audio               = document.querySelector("audio"),
    audioPlayButton     = document.querySelector("#audioPlayPause"),
    audioMuteButton     = document.querySelector("#audioMute"),
    transcriptButton    = document.querySelector('.transcript-btn'),
    transcript    = document.querySelector('.transcript');
  
  var subtitlesMenu;

  function showHideTranscript(){
    transcript.classList.toggle('hidden');
    if (transcript.classList.contains('hidden')){
      transcriptButton.innerHTML = 'Show Transcript';
    }else{
      transcriptButton.innerHTML = 'Hide Transcript';
    }
  }

  function loadVideo() {      
    video.load();
    video.currentTime = 0;
    video.pause();
  }

  function loadAudio() {      
    audio.load();
    audio.currentTime = 0;
    audio.pause();
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

  //function to display rewind button when the video ended
  video.onended = function() {
    videoPlayButton.getElementsByTagName('img')[0].src = `images/ctrl_rewind.svg`;
  };

  audio.onended = function() {
    audioPlayButton.getElementsByTagName('img')[0].src = `images/ctrl_rewind.svg`;
  };

  function playPauseVideo() {
    if (video.paused == true) {
      videoOverlay.style.display = "none";
      video.play(); // Play the video
      videoPlayButton.getElementsByTagName('img')[0].src = `images/ctrl_pause.svg`; // Update the button text to 'Pause'
    } else {
      video.pause(); // Pause the video
      videoPlayButton.getElementsByTagName('img')[0].src = `images/ctrl_play.svg`; // Update the button text to 'Play'
    }

    //rewind the video
    if (video.onended == true) {
      video.play();
    }
  }

  function playPauseAudio() {
    if (audio.paused == true) {
      audio.play(); // Play the audio
      audioPlayButton.getElementsByTagName('img')[0].src = `images/ctrl_pause.svg`; // Update the button text to 'Pause'
    } else {
      audio.pause(); // Pause the video
      audioPlayButton.getElementsByTagName('img')[0].src = `images/ctrl_play.svg`; // Update the button text to 'Play'
    }

    //rewind the audio
    if (audio.onended == true) {
      audio.play();
    }
  }

  //mute/unmute function
  function muteUnmuteVideo() {
    if (video.muted == false) {
      video.muted = true; // Mute the video
      videoVolumeBar.value = 0; // Change the volume bar
      videoMuteButton.getElementsByTagName('img')[0].src = `images/ctrl_muted.svg`; // Change the mute button
    } else {
      video.muted = false; // Unmute the video
      videoVolumeBar.value = video.volume; // Change the volume bar
      videoMuteButton.getElementsByTagName('img')[0].src = `images/ctrl_unmute.svg`; // Change the mute button
    }
  }

  function muteUnmuteAudio() {
    if (audio.muted == false) {
      audio.muted = true; // Mute the video
      audioVolumeBar.value = 0; // Change the volume bar
      audioMuteButton.getElementsByTagName('img')[0].src = `images/ctrl_muted.svg`; // Change the mute button
    } else {
      audio.muted = false; // Unmute the video
      audioVolumeBar.value = video.volume; // Change the volume bar
      audioMuteButton.getElementsByTagName('img')[0].src = `images/ctrl_unmute.svg`; // Change the mute button
    }
  }

  function timeTrackerVideo() {
    var totalTime = video.duration * (videoTimeBar.value / 100); // Calculate the new time
    video.currentTime = totalTime; // Update the video time
  }

  function timeTrackerAudio() {
    var totalTime = audio.duration * (audioTimeBar.value / 100); // Calculate the new time
    audio.currentTime = totalTime; // Update the video time
  }

  // Updates the timeBar slider as the video plays
  function timeUpdaterVideo() {
    var totalValue = (100 / video.duration) * video.currentTime; // Calculate the slider value
    videoTimeBar.value = totalValue; // Update the slider value
  }

  function timeUpdaterAudio() {
    var totalValue = (100 / audio.duration) * audio.currentTime; // Calculate the slider value
    audioTimeBar.value = totalValue; // Update the slider value
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
    var currentTime = document.querySelector('#videoCurrentTime');

    // Set the current play value
    currentTime.innerHTML = cleanTime;
});

  video.addEventListener('loadedmetadata', function () {
    // Set to minute and seconds
    var duration = video.duration;
    var seconds = duration.toFixed(2);
    var cleanDuration = formatTime(seconds);
    var durationTime = document.querySelector('#videoDuration');
    // Set the video duration
    durationTime.innerHTML = cleanDuration;
    // set timebar to 0
    videoTimeBar.value = 0;
  });

  audio.addEventListener('timeupdate', function() {
    // Set to minute and seconds
    var time = audio.currentTime;
    var seconds = time.toFixed(2);
    var cleanTime = formatTime(seconds);
    var currentTime = document.querySelector('#audioCurrentTime');

    // Set the current play value
    currentTime.innerHTML = cleanTime;
});

  audio.addEventListener('loadedmetadata', function () {
    // Set to minute and seconds
    var duration = audio.duration;
    var seconds = duration.toFixed(2);
    var cleanDuration = formatTime(seconds);
    var durationTime = document.querySelector('#audioDuration');
    // Set the audio duration
    durationTime.innerHTML = cleanDuration;
    // set the timebar to 0
    audioTimeBar.value = 0;
  });

  // Used to pause timeBar when user is dragging handle, DOES NOT control play/pause button
  function videoPause() {
    video.pause();
  }

  function audioPause() {
    audio.pause();
  }

  function volumeChangeVideo() {
    video.muted = false; //unmute video
    video.volume = videoVolumeBar.value; //change volume
    videoMuteButton.getElementsByTagName('img')[0].src = `images/ctrl_unmute.svg`; //change mute button

    if (videoVolumeBar.value == 0) {
      videoMuteButton.getElementsByTagName('img')[0].src = `images/ctrl_muted.svg`; //change mute button if value = 0
    }
    // Update video volume
  }

  function volumeChangeAudio() {
    audio.muted = false; //unmute video
    audio.volume = audioVolumeBar.value; //change volume
    audioMuteButton.getElementsByTagName('img')[0].src = `images/ctrl_unmute.svg`; //change mute button

    if (audioVolumeBar.value == 0) {
      audioMuteButton.getElementsByTagName('img')[0].src = `images/ctrl_muted.svg`; //change mute button if value = 0
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

  transcriptButton.addEventListener('click', showHideTranscript);

  // media event listeners
  videoBtns.forEach(btn => btn.addEventListener("click", swapVideoSrc));
  window.addEventListener("load", loadVideo);
  window.addEventListener("load", loadAudio);

  // playing and pausing the video
  videoPlayButton.addEventListener("click", playPauseVideo);
  video.addEventListener("click", playPauseVideo);
  video.addEventListener("keypress", function(e) {
    if(accessibleClick(event) === true){
      playPauseVideo();
    }
  });
  videoOverlay.addEventListener("click", playPauseVideo);

  // audio controls
  audioPlayButton.addEventListener("click", playPauseAudio);
  audioMuteButton.addEventListener("click", muteUnmuteAudio);
  audioTimeBar.addEventListener("change", timeTrackerAudio);
  audio.addEventListener("timeupdate", timeUpdaterAudio);
  audioTimeBar.addEventListener("mousedown", audioPause);
  audioTimeBar.addEventListener("mouseup", playPauseAudio);
  audioVolumeBar.addEventListener("change", volumeChangeAudio);

  //other video controls
  videoMuteButton.addEventListener("click", muteUnmuteVideo);
  fullScreenButton.addEventListener("click", fullScreen);
  videoTimeBar.addEventListener("change", timeTrackerVideo);
  video.addEventListener("timeupdate", timeUpdaterVideo);
  subtitlesButton.addEventListener('click', function(e) {
    if (subtitlesMenu) {
      console.log('subtitles button clicked');
       subtitlesMenu.style.display = (subtitlesMenu.style.display == 'block' ? 'none' : 'block');
    }
  });

  // pauses timebar when user is dragging handle
  videoTimeBar.addEventListener("mousedown", videoPause);
  videoTimeBar.addEventListener("mouseup", playPauseVideo);
  videoVolumeBar.addEventListener("change", volumeChangeVideo);

})();
  
  // DEV NOTES!
  
  // ** There is a bug: the timeBar displays at half when the page loads.
  