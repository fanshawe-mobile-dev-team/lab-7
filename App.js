import { StatusBar } from "expo-status-bar";
import { useEffect, useState } from "react";
import {
  Alert,
  Image,
  Modal,
  SafeAreaView,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import * as ImagePicker from "expo-image-picker";
import {
  dropProfileTable,
  getLocalProfile,
  initializeDatabase,
  moveImageToLocalStorage,
  saveProfile,
} from "./utils/_utils";
import styles from "./utils/styles";

// CONSTANT VARIABLES
const PLACEHOLDER_AVATAR = require("./assets/placeholder-avatar.png");
const SHOW_RESET = false; // Set to true if you want to enable resetting of profile

export default function App() {
  // States
  const [avatar, setAvatar] = useState(PLACEHOLDER_AVATAR);
  const [caption, setCaption] = useState();
  const [showModal, setShowModal] = useState(false);
  const [profileExists, setProfileExists] = useState(false);

  // Get Permissions
  const verifyPermissions = async () => {
    const cameraResult = await ImagePicker.requestCameraPermissionsAsync();
    const libraryResult =
      await ImagePicker.requestMediaLibraryPermissionsAsync();

    if (
      cameraResult.status !== "granted" &&
      libraryResult.status !== "granted"
    ) {
      Alert.alert("Grant Permissions firt to use the app", [{ text: "OK" }]);
      return false;
    } else {
      return true;
    }
  };

  // Handlers
  const handleChooseImage = async () => {
    const hasPermissions = await verifyPermissions();

    if (!hasPermissions) {
      console.log("We do not have permissions");
      return false;
    }

    const image = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [1, 1],
      quality: 0.5,
    });

    if (!image.canceled) {
      setAvatar({ uri: image.assets[0].uri });
      setShowModal(!showModal);
    }
  };

  const handleTakePhoto = async () => {
    const hasPermissions = await verifyPermissions();

    if (!hasPermissions) {
      console.log("We do not have permissions");
      return false;
    }

    const image = await ImagePicker.launchCameraAsync({
      allowsEditing: true,
      aspect: [1, 1],
      quality: 0.5,
    });

    if (!image.canceled) {
      setAvatar({ uri: image.assets[0].uri });
      setShowModal(!showModal);
    }
  };

  const handleSave = async () => {
    if (avatar === PLACEHOLDER_AVATAR && !caption) {
      Alert.alert(
        "Requirements Missing",
        "Avatar image and caption is required"
      );
    } else if (avatar === PLACEHOLDER_AVATAR || !avatar) {
      Alert.alert("Requirements Missing", "Avatar image is required");
    } else if (!caption) {
      Alert.alert("Requirements Missing", "Caption is required");
    } else {
      try {
        const imageUri = await moveImageToLocalStorage(avatar.uri);
        saveProfile(imageUri, caption);
        const newProfile = getLocalProfile();
        setProfileExists(!!newProfile);
        setAvatar({ uri: imageUri });
      } catch (error) {
        console.log(error);
      }
    }
  };

  const handleResetProfile = () => {
    try {
      setAvatar(PLACEHOLDER_AVATAR);
      setCaption(null);
      dropProfileTable();
      setProfileExists(false);
    } catch (error) {
      console.log("Error Resetting Profile", error);
    }
  };

  const initializeApp = async () => {
    initializeDatabase();

    const existingProfile = await getLocalProfile();

    if (existingProfile) {
      setProfileExists(!!existingProfile);
      setAvatar({
        uri: existingProfile.imageUrl,
      });
      setCaption(existingProfile.caption);
    }
  };

  // Initialize on App mount
  useEffect(() => {
    initializeApp();
  }, []);

  return (
    <SafeAreaView style={styles.container}>
      <Text style={styles.headerText}>My Favorite Moment</Text>
      <Text style={styles.headerText}>h_robles</Text>
      <TouchableOpacity onPress={() => setShowModal(true)}>
        <Image source={avatar} style={styles.avatar} />
      </TouchableOpacity>
      {profileExists ? (
        <Text style={styles.caption}>{caption}</Text>
      ) : (
        <View style={styles.captionInputContainer}>
          <TextInput
            style={styles.captionInput}
            value={caption}
            onChangeText={setCaption}
            numberOfLines={1}
            multiline={true}
            placeholder="Enter caption"
          />
        </View>
      )}
      {!profileExists && (
        <TouchableOpacity onPress={handleSave} style={styles.btn}>
          <Text style={styles.btnLabel}>Save</Text>
        </TouchableOpacity>
      )}
      {profileExists && SHOW_RESET && (
        <TouchableOpacity onPress={handleResetProfile} style={styles.btn}>
          <Text style={styles.btnLabel}>Reset Profile</Text>
        </TouchableOpacity>
      )}

      {/* Photo Modal */}
      <Modal
        animationType="slide"
        visible={showModal}
        onRequestClose={() => {
          setShowModal(!showModal);
        }}
      >
        <View style={styles.container}>
          <TouchableOpacity
            style={[styles.btn, { marginBottom: 10 }]}
            onPress={handleChooseImage}
          >
            <Text style={styles.btnLabel}>Choose from Library</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.btn, { marginBottom: 10 }]}
            onPress={handleTakePhoto}
          >
            <Text style={styles.btnLabel}>Take new Photo</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[
              styles.btn,
              { backgroundColor: "transparent", borderWidth: 2 },
            ]}
            onPress={() => setShowModal(!showModal)}
          >
            <Text style={[styles.btnLabel, { color: "black" }]}>Cancel</Text>
          </TouchableOpacity>
        </View>
      </Modal>
      <StatusBar style="auto" />
    </SafeAreaView>
  );
}
