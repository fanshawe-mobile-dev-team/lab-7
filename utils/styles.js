import { StyleSheet } from "react-native";

export default StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    alignItems: "center",
    justifyContent: "center",
    padding: 20,
  },
  headerText: {
    fontSize: 24,
    fontWeight: "bold",
  },
  avatar: {
    width: 150,
    height: 150,
    backgroundColor: "black",
    borderRadius: 100,
    marginVertical: 20,
  },
  caption: {
    width: "100%",
    marginBottom: 20,
  },
  captionInputContainer: {
    borderWidth: 1,
    width: "100%",
    padding: 10,
    height: 100,
    borderRadius: 5,
    marginBottom: 20,
  },
  captionInput: {
    width: "100%",
    paddingVertical: 0,
  },
  btn: {
    width: "100%",
    padding: 10,
    borderRadius: 5,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "black",
  },
  btnLabel: {
    color: "white",
  },
  modalView: {
    gap: 20,
  },
});
