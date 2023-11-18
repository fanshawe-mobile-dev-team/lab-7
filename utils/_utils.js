import * as SQLite from "expo-sqlite";
import * as FileSystem from "expo-file-system";
import * as ImagePicker from "expo-image-picker";

const dbName = "lab7.db";
const db = SQLite.openDatabase(dbName);

// Create Database
export const initializeDatabase = () => {
  db.transaction((tx) => {
    tx.executeSql(
      "CREATE TABLE IF NOT EXISTS ProfileTable (id INTEGER PRIMARY KEY NOT NULL, imageUrl TEXT NOT NULL, caption TEXT NOT NULL);",
      [],
      null,
      (_, result) => console.log("Database Initialization failed:" + result)
    );
  });
};

// Fetch for Profile
export const getLocalProfile = async () => {
  return new Promise((resolve, reject) => {
    db.transaction(
      (tx) => {
        tx.executeSql(
          "SELECT * FROM ProfileTable LIMIT 1;",
          [],
          (_, { rows }) => {
            const firstProfile = rows._array[0];
            console.log("UTILS: First Profile Found", firstProfile);
            resolve(firstProfile);
          },
          (_, error) => {
            console.error("Error retrieving first profile:", error);
            reject(null);
          }
        );
      },
      (error) => {
        console.error("Transaction error:", error);
        reject(null);
      },
      () => {
        console.log("Transaction successful");
      }
    );
  });
};

// Save Profile
export const saveProfile = (imageUrl, caption) => {
  return db.transaction((tx) => {
    tx.executeSql(
      "INSERT INTO ProfileTable (imageUrl, caption) values (?, ?);",
      [imageUrl, caption],
      null,
      (_, result) => console.log("Save Profile failed:" + result)
    );
  });
};

// Move Avatar to Local Storage
export const moveImageToLocalStorage = async (uri) => {
  const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();

  if (status !== "granted") {
    console.error("Permission to access media library was denied");
    return;
  }

  try {
    const localUri = FileSystem.documentDirectory + "profile-image.jpg";

    // Move the image file to the app's local storage
    await FileSystem.moveAsync({
      from: uri,
      to: localUri,
    });

    return localUri;
  } catch (error) {
    console.error("Error moving image to local storage:", error);
  }
};

// Reset Profile
export const dropProfileTable = async () => {
  try {
    await db.transactionAsync(async (tx) => {
      await tx.executeSqlAsync("DROP TABLE IF EXISTS ProfileTable;");
    });

    db.transaction((tx) => {
      tx.executeSql(
        "CREATE TABLE IF NOT EXISTS ProfileTable (id INTEGER PRIMARY KEY NOT NULL, imageUrl TEXT NOT NULL, caption TEXT NOT NULL);"
      );
    });
    console.log("ProfileTable dropped successfully.");
  } catch (error) {
    console.error("Error dropping ProfileTable:", error);
  }
};
