const PLAYLIST_CONTAINER = document.getElementById("playlistGrid");
const userEmail = localStorage.getItem("email");

async function fetchLibraryPlaylists() {
  const authToken = localStorage.getItem("authToken");
  if (!authToken) {
    alert("Please sign in to view your library.");
    window.location.href = "SignUpIn.html";
    return;
  }

  try {
    const response = await fetch(`http://localhost:8080/api/library/${userEmail}`);
    const playlists = await response.json();

    if (!playlists || playlists.length === 0) {
      PLAYLIST_CONTAINER.innerHTML = "<p style='font-size: 1.2rem; color: gray;'>No playlists yet. Add some from the Courses page.</p>";
    } else {
      displayPlaylists(playlists);
    }
  } catch (error) {
    console.error("Failed to fetch library:", error);
    PLAYLIST_CONTAINER.innerHTML = "<p>Error loading library.</p>";
  }
}

function displayPlaylists(playlists) {
  PLAYLIST_CONTAINER.innerHTML = "";

  playlists.forEach((playlist) => {
  const title = playlist.playlistTitle || "Untitled Playlist";
  const thumbnail = playlist.playlistThumbnail || "https://img.youtube.com/vi/default.jpg";
  console.log("Fetched playlists from backend:", playlists);

    const card = `
      <div class="playlist-card">
        <img src="${thumbnail}" alt="${title}" />
        <h3>${title}</h3>
        <button class="watch-btn" onclick="selectPlaylist('${playlist.playlistId}')">View</button>
        <button class="remove-btn" onclick="removeFromLibrary('${playlist.playlistId}')">Remove</button>
      </div>
    `;
    PLAYLIST_CONTAINER.innerHTML += card;
  });
}

function selectPlaylist(playlistId) {
  localStorage.setItem("selectedPlaylist", playlistId);
  window.location.href = "Players.html";
}

//to remove playlist 
async function removeFromLibrary(playlistId) {
  const authToken = localStorage.getItem("authToken");
  try {
    const response = await fetch(`http://localhost:8080/api/library/${userEmail}/${playlistId}`, {
      method: "DELETE",
      headers:{
        "Authorization": `Bearer ${authToken}`
      }
    });

    if (response.ok) {
      alert("Playlist removed!");
      fetchLibraryPlaylists(); // Refresh the library
    } else {
      alert("Failed to remove playlist.");
    }
  } catch (error) {
    console.error("Error removing playlist:", error);
    alert("Something went wrong while removing the playlist.");
  }
}




