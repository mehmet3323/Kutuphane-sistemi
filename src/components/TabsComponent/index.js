import React from "react";
import { View, TouchableOpacity, Text } from "react-native";
import styles from "./styles";

const TabsComponent = ({ tabs, activeTab, onTabPress, title, onViewAllPress }) => {
  return (
    <View>
      <View style={styles.header}>
        <Text style={styles.title}>{title}</Text>
        <TouchableOpacity onPress={onViewAllPress}>
          <Text style={styles.viewAll}>View all</Text>
        </TouchableOpacity>
      </View>
      <View style={styles.tabs}>
        {tabs.map((tab) => (
          <TouchableOpacity
            key={tab}
            onPress={() => onTabPress(tab)}
            style={[styles.tab, activeTab === tab && styles.activeTab]}
          >
            <Text
              style={[styles.tabText, activeTab === tab && styles.activeTabText]}
            >
              {tab}
            </Text>
          </TouchableOpacity>
        ))}
      </View>
    </View>
  );
};

export default TabsComponent;
