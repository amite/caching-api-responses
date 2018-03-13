import React from "react";
import {
  StyleSheet,
  Text,
  View,
  ScrollView,
  Image,
  ImageBackground,
  Dimensions
} from "react-native";

const dimensions = Dimensions.get("window");
const imageHeight = Math.round(dimensions.width * 9 / 16);
const imageWidth = dimensions.widt;

export default class App extends React.Component {
  state = {
    photos: []
  };

  async componentDidMount() {
    const fetchedPhotos = await fetch(
      `http://jsonplaceholder.typicode.com/photos`
    );
    const photos = await fetchedPhotos.json();
    this.setState({ photos });
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
        {this.state.photos.slice(0, 20).map(this.renderPhotos)}
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
