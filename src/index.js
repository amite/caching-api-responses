import "../ReactotronConfig";
import React from "react";
import Reactotron from "reactotron-react-native";

import {
  StyleSheet,
  Text,
  View,
  ScrollView,
  Image,
  ImageBackground,
  Dimensions,
  AsyncStorage
} from "react-native";

const dimensions = Dimensions.get("window");
const imageHeight = Math.round(dimensions.width * 9 / 16);
const imageWidth = dimensions.width;

const cachedFetch = (url, options) => {
  // Use the URL as the cache key to sessionStorage
  let cacheKey = url;
  return fetch(url, options).then(response => {
    // let's only store in cache if the content-type is
    // JSON or something non-binary
    let ct = response.headers.get("Content-Type");
    if (ct && (ct.match(/application\/json/i) || ct.match(/text\//i))) {
      // There is a .json() instead of .text() but
      // we're going to store it in AsyncStorage as
      // string anyway.
      // If we don't clone the response, it will be
      // consumed by the time it's returned. This
      // way we're being un-intrusive.
      response
        .clone()
        .text()
        .then(content => {
          AsyncStorage.setItem(cacheKey, content);
        });
    }
    return response;
  });
};

export default class App extends React.Component {
  state = {
    photos: []
  };

  async componentDidMount() {
    let url = `http://jsonplaceholder.typicode.com/photos`;

    let photos;
    let photosFromCache = await AsyncStorage.getItem(url);
    if (photosFromCache) {
      Reactotron.log("fetching photos from cache");
      photos = JSON.parse(photosFromCache);
    } else {
      Reactotron.log("fetching photos from network");
      const fetchedPhotos = await fetch(url);
      photos = await fetchedPhotos.json();
      await AsyncStorage.setItem(url, JSON.stringify(photos));
    }
    this.setState({ photos: photos.slice(0, 5) });
  }

  renderPhotos = photo => {
    return (
      <Image
        key={photo.id}
        style={{
          width: imageWidth,
          height: imageHeight
        }}
        source={{ uri: photo.url }}
      />
    );
  };

  render() {
    return (
      <ScrollView style={styles.container}>
        <Text style={{ marginBottom: 20, alignSelf: "center" }}>
          Remote photos
        </Text>
        {this.state.photos.map(this.renderPhotos)}
      </ScrollView>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    paddingVertical: 40
  },
  canvas: {
    position: "absolute",
    top: 0,
    left: 0,
    bottom: 0,
    right: 0
  }
});
