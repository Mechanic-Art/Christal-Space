document.addEventListener("DOMContentLoaded", function() {
  if (window.webampInstance && window.webampInstance.dispose) {
    window.webampInstance.dispose();
  }

  window.webampInstance = new Webamp({
    initialSkin: {
      url: "./assets/skin3.wsz"
    },
    initialTracks: [
      {
        metaData: {
          title: "Bü is dancing",
          artist: "Christal"
        },
        url: "./assets/audio/bu-theme.mp3"
      }
    ]
  });

  window.webampInstance.renderWhenReady(document.getElementById("winamp-container"));
});