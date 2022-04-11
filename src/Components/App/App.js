import './App.css';
import React from 'react';
import { SearchBar } from '../SearchBar/SearchBar';
import { SearchResults } from '../SearchResults/SearchResults';
import { Playlist } from '../Playlist/Playlist';
import { Spotify } from '../../util/Spotify';

class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      searchResults: [{id:13,name:"Here Comes the Sun",artist:"Beatles",album:"Abbey Road"}],
      playlistName: "myPlaylist",
      playlistTracks: []
    };
    this.addTrack = this.addTrack.bind(this);
    this.removeTrack = this.removeTrack.bind(this);
    this.updatePlaylistName = this.updatePlaylistName.bind(this);
    this.savePlaylist = this.savePlaylist.bind(this);
    this.search = this.search.bind(this);
  }

  addTrack(track) {
    if (!this.state.playlistTracks.includes(track)) {
      let newPlaylistTracks = this.state.playlistTracks.concat([track]);
      this.setState({playlistTracks:newPlaylistTracks});
    }
  }

  removeTrack(track) {
    let newPlaylistTracks = this.state.playlistTracks.filter(pt => pt.id === track.id);
    this.setState({playlistTracks:newPlaylistTracks});
  }

  updatePlaylistName(name) {
    this.setState({playlistName:name});
  }

  savePlaylist() {
    const trackURIs = this.state.playlistTracks.map(track => track.uri);
    Spotify.savePlaylist(this.state.playlistName,this.state.playlistTracks);
    this.setState({playlistName:"New Playlist",playlistTracks:[]});
  }

  async search(term) {
    console.log(term);
    this.setState({searchResults: await Spotify.search(term)});
  }

  render() {
    return (
      <div>
        <h1>Ja<span className="highlight">mmm</span>ing</h1>
        <div className="App">
          <SearchBar onSearch={this.search} />
          <div className="App-playlist">
            <SearchResults
              searchResults={this.state.searchResults}
              onAdd={this.addTrack}
              isRemoval={false} />
            <Playlist
              playlistName={this.state.playlistName}
              playlistTracks={this.state.playlistTracks}
              onRemove={this.removeTrack}
              onNameChange={this.updatePlaylistName}
              onSave={this.savePlaylist} />
          </div>
        </div>
      </div>
    );
  }
}

export default App;
