const SECTION_SUBJECT_PLAYLISTS = {
    SSC: {
      Mathematics: [
        {
          id: "PLjm_mvBNlvBZ8d1EGhXxiVnviM4yPf-Uq",
          title: "SSC Algebra",
        },
        {
          id: "PLjm_mvBNlvBbt8uSpdGmgYY9iiAMt_K_r",
          title: "SSC Goemtry - Full Course",
        }
      ],
      Physics: [
        {
          id: "PLVLoWQFkZbhXAipqg8dmzLQOED1uxgUTx",
          title: "SSC Physics Explained",
        },
        {
          id: "PLSgL45_Cz9Y8GTUNQ8FE-QrvenajHD46R",
          title:"SSC Physics",
        }
      ],
      Chemistry: [
        {
          id: "PLVLoWQFkZbhV8gdBQOVjUpLW_3jwak-uA",
          title: "SSC Chemistry"
        },
        {
          id: "PLXTyt_wUBqQ6CH1N9xkqDNFpuY6eK6QOE",
          title: "SSC Chemistry Revision",
        }
      ],
      Biology: [
        {
          id: "PLVLoWQFkZbhUmaeiHa7xKTQ3ByL6XujcQ",
          title: "SSC Biology"
        },
        {
          id: "PLOIVkOjhZ1iHkq_tcgTS9nMpbLhmDMRrW",
          title: "Biology | Full Chapter Series",
        }
      ]
    },
    HSC: {
      Mathematics: [
        {
          id: "PLVLoWQFkZbhWENNsv70Pwzxb_ddDm8EjM",
          title: "HSC Maths Crash Course",
        },
        {
          id: "PL2xF3HCNxGM8r2rr9jsoFgRGevBAnrJhB",
          title: "'HSC Maths"
        }
      ],
      Physics: [
        {
          id:"PLVLoWQFkZbhU6U0BhqGieiARjUYmyoa8p",
          title:"HSC Physics",
        },
        {
          id: "PLCzaIJYXP5YffCcaVxQnQOp87eCeqr4oy",
          title: "HSC Physics Lectures",
        }
      ],
      Chemistry: [
        {
          id: "PL2xF3HCNxGM-u96iJBHtwY733QgthoGu-",
          title: "HSC Chemistry"
        },
        {
          id: "PLVLoWQFkZbhVdStvLVoS3kU7RBaJR4JTR",
          title: "HSC Chemistry Explained",
        }
      ],
      Biology: [
        {
          id: "PLVLoWQFkZbhXy7if3Grafu9UngDHol9EX",
          title: "HSC Biology Full Series",
        },
        {
          id: "PL2xF3HCNxGM_00mF5cdafSi1DNk48haoA",
          title: "HSC Biology"
        }
      ]
    },
    Technical: {
      Java: [
        {
          id: "PLfqMhTWNBTe3LtFWcvwpqTkUSlB32kJop",
          title: "Core Java",
        }
      ],
      Python: [
        {
          id: "PLGjplNEQ1it8-0CmoljS5yeV-GlKSUEt0",
          title: "Python",
        }
      ],
      JavaScript: [
        {
          id: "PLu71SKxNbfoBuX3f4EOACle2y-tRC5Q37",
          title: "JavaScript",
        }
      ],
      C_Programming: [
        {
          id: "PLxgZQoSe9cg1drBnejUaDD9GEJBGQ5hMt",
          title: "C concepts"
        }
      ],
      Cpp_Programming: [
        {
          id: "PLxgZQoSe9cg0df_GxVjz3DD_Gck5tMXAd",
          title: "C++ concepts"
        }
      ],
      Dsa_in_Cpp: [
        {
          id: "PLgUwDviBIf0oF6QL8m22w1hIDC1vJ_BHz",
          title: "DSA in C++"
        }
      ],
      Dsa_in_Java: [
        {
          id: "PL9gnSGHSqcnr_DxHsP7AW9ftq0AtAyYqJ",
          title: "DSA in Java "
        }
      ],
      Web_Development: [
        {
          id: "PLu0W_9lII9agq5TrH9XLIKQvv0iaF2X3w",
          title: "Web Development Bootcamp",
        }
      ],
      Data_Analytics: [
        {
          id: "PLjVLYmrlmjGdRs1sGqRrTE-EMraLclJga",
          title: "Data Analyst",
        }
      ],
      Cyber_Security: [
        {
          id: "PL9ooVrP1hQOGPQVeapGsJCktzIO4DtI4_",
          title: "Ethical Hacking 101",
        }
      ],
      Machine_Learning: [
        {
          id: "PLeo1K3hjS3uvCeTYTeyfe0-rN5r8zn9rw",
          title: "Intro to AI",
        }
      ],
      Cloud_Computing: [
        {
          id: "PLxCzCOWd7aiHRHVUtR-O52MsrdUSrzuy4",
          title: "Android App Dev for Beginners",
        }
      ],
      UI_UX_Design: [
        {
          id: "PLdvOfoe7PXT0ouChAnR1nHlT8BJIo5hP_",
          title: "UI/UX Design Principles",
        }
      ]
    }
  };
  
const API_KEY = "AIzaSyCzEYxOWd-I4QzHwODO3pbwIC7Q92YO2uc"; 
const PLAYLIST_CONTAINER = document.getElementById("playlistGrid");

// Get section and subject from URL
const urlParams = new URLSearchParams(window.location.search);
const level = decodeURIComponent(urlParams.get("level") || "SSC");
const subject = decodeURIComponent(urlParams.get("subject") || "Mathematics");

document.getElementById("subject-title").textContent = `${level} - ${subject} Playlists`;

fetchPlaylists(level, subject);

// Fetch curated playlists based on section & subject
async function fetchPlaylists(section, subject) {
    const playlists = SECTION_SUBJECT_PLAYLISTS[section]?.[subject];
    if (playlists && playlists.length > 0){
      //Now, fetch details from youtube API
      for (const playlist of playlists){
        const playlistDetails = await fetchPlaylistDetails(playlist.id);
        playlist.thumbnail = playlistDetails.thumbnail;
        playlist.title = playlistDetails.title;
      }
        displayPlaylists(playlists);
    } else {
        PLAYLIST_CONTAINER.innerHTML = "<p>No curated playlists for this subject.</p>";
    }
}


// Fetch playlist details using YouTube API
async function fetchPlaylistDetails(playlistId){
  const url = `https://www.googleapis.com/youtube/v3/playlists?part=snippet&id=${playlistId}&key=${API_KEY}`;
    const response = await fetch(url);
    const data = await response.json();

    if (data.items && data.items.length > 0) {
        const playlist = data.items[0].snippet;
        return {
            title: playlist.title,
            thumbnail: playlist.thumbnails.high.url
        };
    } else {
        console.error("Playlist not found!");
        return {
            title: "Unknown Playlist",
            thumbnail: "https://i.ytimg.com/vi/default_thumbnail.jpg"
        };
    }
}

// Display the playlists
function displayPlaylists(playlists) {
    PLAYLIST_CONTAINER.innerHTML = "";

    playlists.forEach((playlist) => {
      const userEmail = localStorage.getItem("email");
        const card = `
        <div class="playlist-card">
            <img src="${playlist.thumbnail}" alt="${playlist.title}" />
            <h3>${playlist.title}</h3>
            <button class="watch-btn" onclick="selectPlaylist('${playlist.id}')">View</button>
            <button class="add-btn" onclick="addToLibrary('${playlist.id}', '${playlist.title}', '${playlist.thumbnail}', '${subject}', '${userEmail}')"> Add to library</button>
        </div>
        `;
        PLAYLIST_CONTAINER.innerHTML += card;
    });
}


// Store selected playlist and redirect
function selectPlaylist(playlistId) {
    localStorage.setItem("selectedPlaylist", playlistId);
    window.location.href = "Players.html";
}

//to add playlist to library
function addToLibrary(playlistId, title, thumbnail, subject, userEmail){
  const data = {
    userEmail,
        playlistId,
        title,
        thumbnail,
        subject
  };

  fetch("http://localhost:8080/api/library/add",{
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify(data)
  })
  .then((response) => {
    if (response.ok){
      alert("Playlist added to library!");
    }else{
      alert("Failed to add playlist.");
    }
  })
  .catch((error) => {
    console.error("Error adding to library: ", error);
  });
}
