import { StyleSheet } from "react-native";

export default StyleSheet.create({
    header: {
      flexDirection: "row",
      justifyContent: "space-between",
      alignItems: "center",
      marginTop: 40,
    
    },
    greeting: {
      fontSize: 24,
      fontWeight: "bold",
      color: "#333333",
    },
    subtitle: {
      fontSize: 16,
      color: "#777777",
    },
    profileImage: {
      width: 50,
      height: 50,
      borderRadius: 25,
    },
  });