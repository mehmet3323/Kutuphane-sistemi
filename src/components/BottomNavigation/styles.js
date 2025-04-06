import { StyleSheet } from 'react-native';

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    flexDirection: 'row',
    backgroundColor: '#ffffff',
    paddingVertical: 12,
    paddingHorizontal: 16,
    justifyContent: 'space-between',
    borderTopWidth: 2,
    borderTopColor: '#1E2F97',
    elevation: 24,
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: -4 },
    shadowOpacity: 0.3,
    shadowRadius: 12,
    zIndex: 1000,
    height: 65,
  },
  tab: {
    alignItems: 'center',
    flex: 1,
    paddingHorizontal: 8,
    justifyContent: 'center',
  },
  tabEmoji: {
    fontSize: 24,
    opacity: 0.7,
    marginBottom: 2,
  },
  activeTabEmoji: {
    opacity: 1,
    transform: [{ scale: 1.2 }],
    color: '#1E2F97',
  },
  tabLabel: {
    fontSize: 11,
    marginTop: 4,
    color: '#757575',
    fontWeight: '500',
  },
  activeTabLabel: {
    color: '#1E2F97',
    fontWeight: '700',
    transform: [{ scale: 1.1 }],
  },
});