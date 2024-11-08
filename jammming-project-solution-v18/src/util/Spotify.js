const clientId = ''; // Insert client ID here.
const redirectUri = 'http://localhost:3000/'; // Have to add this to your accepted Spotify redirect URIs on the Spotify API.
let accessToken;

const tracks = [
  {
    "id": "1",
    "name": "Hiss",
    "artist": "Megan Thee Stallion",
    "album": "TBA"
  },
  {
    "id": "2",
    "name": "Cheerleader",
    "artist": "Porter Robinson",
    "album": "Nurture"
  },
  {
    "id": "3",
    "name": "Von Dutch",
    "artist": "Charli XCX",
    "album": "TBA"
  },
  {
    "id": "4",
    "name": "Walkin' Through the Club",
    "artist": "Sexyy Red",
    "album": "TBA"
  },
  {
    "id": "5",
    "name": "Beyoncé's New Country Song",
    "artist": "Beyoncé",
    "album": "TBA"
  },
  {
    "id": "6",
    "name": "The Best of Me",
    "artist": "Billie Eilish",
    "album": "TBA"
  },
  {
    "id": "7",
    "name": "Vampire Weekend's New Track",
    "artist": "Vampire Weekend",
    "album": "TBA"
  },
  {
    "id": "8",
    "name": "Heartbreak Hotel",
    "artist": "Sharon Van Etten",
    "album": "TBA"
  },
  {
    "id": "9",
    "name": "Goodbye Summer",
    "artist": "Miranda Lambert",
    "album": "TBA"
  },
  {
    "id": "10",
    "name": "'Til We Meet Again",
    "artist": "Ed Sheeran",
    "album": "'Til We Meet Again"
  },
  {
    "id": "11",
    "name": "Cruel Summer",
    "artist": "Taylor Swift",
    "album": "Lover"
  },
  {
    "id": "12",
    "name": "Calm Down",
    "artist": "Rema & Selena Gomez",
    "album": "Rave & Roses"
  },
  {
    "id": "13",
    "name": "Paint The Town Red",
    "artist": "Doja Cat",
    "album": "Scarlet"
  },
  {
    "id": "14",
    "name": "Last Last",
    "artist": "Burna Boy",
    "album": "Love, Damini"
  },
  {
    "id": "15",
    "name": "Flowers",
    "artist": "Miley Cyrus",
    "album": "Endless Summer Vacation"
  },
  {
    "id": "16",
    "name": "Everybody (Backstreet's Back)",
    "artist": "Backstreet Boys",
    "album": "Backstreet's Back"
  },
  {
    "id": "17",
    "name": "U Can't Touch This",
    "artist": "MC Hammer",
    "album": "Please Hammer, Don't Hurt 'Em"
  },
  {
    "id": "18",
    "name": "Black Or White",
    "artist": "Michael Jackson",
    "album": "Dangerous"
  },
  {
    "id": "19",
    "name": "Gangsta's Paradise",
    "artist": "Coolio",
    "album": "Gangsta's Paradise"
  },
  {
    "id": "20",
    "name": "Mmmbop",
    "artist": "Hanson",
    "album": "Middle of Nowhere"
  },
  {
    "id": "21",
    "name": "Barbie Girl",
    "artist": "Aqua",
    "album": "Aquarium"
  },
  {
    "id": "22",
    "name": "Smells Like Teen Spirit",
    "artist": "Nirvana",
    "album": "Nevermind"
  },
  {
    "id": "23",
    "name": "More Than Words",
    "artist": "Extreme",
    "album": "III Sides to Every Story"
  },
  {
    "id": "24",
    "name": "The Sign",
    "artist": "Ace of Base",
    "album": "Happy Nation"
  },
  {
    "id": "25",
    "name": "I Swear",
    "artist": "All-4-One",
    "album": "All-4-One"
  }
];

const Spotify = {
  getAccessToken() {
    if (accessToken) {
      return accessToken;
    }

    const accessTokenMatch = window.location.href.match(/access_token=([^&]*)/);
    const expiresInMatch = window.location.href.match(/expires_in=([^&]*)/);
    if (accessTokenMatch && expiresInMatch) {
      accessToken = accessTokenMatch[1];
      const expiresIn = Number(expiresInMatch[1]);
      window.setTimeout(() => accessToken = '', expiresIn * 1000);
      window.history.pushState('Access Token', null, '/'); // This clears the parameters, allowing us to grab a new access token when it expires.
      return accessToken;
    } else {
      const accessUrl = `https://accounts.spotify.com/authorize?client_id=${clientId}&response_type=token&scope=playlist-modify-public&redirect_uri=${redirectUri}`;
      window.location = accessUrl;
    }
  },

  search(term) {

    // const accessToken = Spotify.getAccessToken();
    // return fetch(`https://api.spotify.com/v1/search?type=track&q=${term}`, {
    //   headers: {
    //     Authorization: `Bearer ${accessToken}`
    //   }
    // }).then(response => {
    //   return response.json();
    // }).then(jsonResponse => {
    //   if (!jsonResponse.tracks) {
    //     return [];
    //   }

    //   // return jsonResponse.tracks.items.map(track => ({
    //   //   id: track.id,
    //   //   name: track.name,
    //   //   artist: track.artists[0].name,
    //   //   album: track.album.name,
    //   //   uri: track.uri
    //   // }));
    // });

    return new Promise((resolve, reject) => {
      resolve(tracks.filter(track => track.name.toLowerCase().includes(term.toLowerCase())));
    });
  },

  savePlaylist(name, trackUris) {
    if (!name || !trackUris.length) {
      return;
    }

    const accessToken = Spotify.getAccessToken();
    const headers = { Authorization: `Bearer ${accessToken}` };
    let userId;

    return fetch('https://api.spotify.com/v1/me', { headers: headers }
    ).then(response => response.json()
    ).then(jsonResponse => {
      userId = jsonResponse.id;
      return fetch(`https://api.spotify.com/v1/users/${userId}/playlists`, {
        headers: headers,
        method: 'POST',
        body: JSON.stringify({ name: name })
      }).then(response => response.json()
      ).then(jsonResponse => {
        const playlistId = jsonResponse.id;
        return fetch(`https://api.spotify.com/v1/users/${userId}/playlists/${playlistId}/tracks`, {
          headers: headers,
          method: 'POST',
          body: JSON.stringify({ uris: trackUris })
        });
      });
    });
  }
};

export default Spotify;
