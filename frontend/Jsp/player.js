const API_KEY = "AIzaSyCzEYxOWd-I4QzHwODO3pbwIC7Q92YO2uc"; 
const PLAYER_IFRAME = document.getElementById("video-player");
const VIDEO_CONTAINER = document.getElementById("video-container");

const playlistId = localStorage.getItem("selectedPlaylist");

if(!playlistId){
    VIDEO_CONTAINER.innerHTML = "<p>No playlist selected. </p>";
}else{
    fetchplaylistVideos(playlistId);
}

async function fetchplaylistVideos(playlistId) {
    const apiUrl = `https://www.googleapis.com/youtube/v3/playlistItems?part=snippet&maxResults=50&playlistId=${playlistId}&key=${API_KEY}`;

    try {
        const response = await fetch(apiUrl);
        const data = await response.json();

        if (data.items && data.items.length > 0) {
            const videos = data.items.map((item) => ({
                videoId: item.snippet.resourceId.videoId,
                title: item.snippet.title,
                thumbnail: `https://img.youtube.com/vi/${item.snippet.resourceId.videoId}/hqdefault.jpg`,
            }));

            displayVideos(videos);
            playVideo(videos[0].videoId);  // Autoplay first video
        } else {
            VIDEO_CONTAINER.innerHTML = "<p>No videos found in this playlist.</p>";
        }
    } catch (error) {
        console.error("Error fetching playlist videos:", error);
        VIDEO_CONTAINER.innerHTML = "<p>Failed to load videos.</p>";
    }  
}

function displayVideos(videos) {
    VIDEO_CONTAINER.innerHTML = ""; // Clear the container before adding new videos
  
    videos.forEach((video) => {
      const videoCard = document.createElement("div");
      videoCard.classList.add("video-card");
  
      videoCard.innerHTML = `
        <img src="${video.thumbnail}" alt="${video.title}">
        <h4>${video.title}</h4>
      `;
  
      videoCard.addEventListener("click", () => playVideo(video.videoId));
      VIDEO_CONTAINER.appendChild(videoCard);
    });
  }
  
  function playVideo(videoId) {
    PLAYER_IFRAME.src = `https://www.youtube.com/embed/${videoId}?rel=0&autoplay=1`;
  }

