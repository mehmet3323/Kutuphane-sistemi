import * as React from 'react';
import {NavigationContainer} from '@react-navigation/native';
import StackRoutes from './StackRoutes';

const App = () => {
  return (
    <NavigationContainer>
      <StackRoutes />
    </NavigationContainer>
  );
};

export default App;
