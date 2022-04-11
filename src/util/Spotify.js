let userAccessToken;
let expirationTimeout = null;
const clientID = "dde4cec1efa14652a5793608e91cedad";
const redirectURI = "https://jelllyjammming.surge.sh/";

const Spotify = {
    getAccessToken: () => {
        if (userAccessToken) return userAccessToken;
        else if (window.location.href.includes("access_token") &&
            window.location.href.includes("expires_in")) {
            let url = window.location.href;
            let queryParams = url.slice(url.indexOf("#")+1).split("&");
            let access_token = queryParams.find(qp => qp.startsWith("access_token")).slice(13);
            let expires_in = Number(queryParams.find(qp => qp.startsWith("expires_in")).slice(11));
            userAccessToken = access_token;
            if (expirationTimeout !== null) clearTimeout(expirationTimeout);
            expirationTimeout = setTimeout(()=>userAccessToken=null,expires_in*1000);

            window.history.pushState('Access Token', null, '/');

            return userAccessToken;
        } else {
            window.location = `https://accounts.spotify.com/authorize?client_id=${clientID}&response_type=token&scope=playlist-modify-public&redirect_uri=${redirectURI}`;
        }
    },

    search: async (term) => {
        const response = await fetch("https://api.spotify.com/v1/search?type=track&q="+term,
                                    {headers: {Authorization: "Bearer "+userAccessToken}});
        const jsonResponse = response.json();
        const tracks = jsonResponse.map(track => ({
            id: track.id,
            name: track.name,
            artist: track.artists[0].name,
            album: track.album.name,
            uri: track.uri
        }));
        return tracks;
    },

    savePlaylist: async (name,trackURIs) => {
        if (name && trackURIs) {
            let accessToken = userAccessToken;
            let headers = {Autorization: "Bearer "+userAccessToken};
            let userID;

            let response = await fetch("https://api.spotify.com/v1/me",
                                        {headers: headers});
            let jsonResponse = response.json();
            userID = jsonResponse.id;

            response = await fetch(`https://api.spotify.com/v1/users/${userID}/playlists?name=${name}`,
                                    {method:"POST", headers: headers});
            jsonResponse = response.json();
            let playlistID = jsonResponse.id;

            const formattedTrackURIs = "spotify:track:"+trackURIs.join(",spotify:track:");
            response = await fetch(`https://api.spotify.com/v1/playlists/${playlistID}/tracks?uris=${formattedTrackURIs}`,
                                    {method:"POST", headers: headers});
            jsonResponse = response.json();
            playlistID = jsonResponse.id;

        } else return;
    }
};


export { Spotify }