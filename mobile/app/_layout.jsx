import { Stack } from 'expo-router';
import { Provider } from 'react-redux';
import store from './store';
import './global.css';

function AppContent() {
  return <Stack screenOptions={{ headerShown: false }} />;
}

export default function MainLayout() {
  return (
    <Provider store={store}>
      <AppContent />
    </Provider>
  );
}
