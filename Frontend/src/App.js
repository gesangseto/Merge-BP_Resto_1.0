/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * Generated with the TypeScript template
 * https://github.com/react-native-community/react-native-template-typescript
 *
 * @format
 */

import {NavigationContainer} from '@react-navigation/native';
import React from 'react';
import {navigationRef} from './helper';
import Router from './router';
import {PortalProvider} from '@gorhom/portal';
import Toast from 'react-native-toast-notifications';
import {RenderToastView} from './components/atoms';
import {GestureHandlerRootView} from 'react-native-gesture-handler';
const App = () => {
  return (
    <GestureHandlerRootView style={{flex: 1}}>
      <PortalProvider>
        <NavigationContainer ref={navigationRef}>
          <Router />
          <Toast
            ref={ref => (global['toast'] = ref)}
            offset={'45%'} // offset for both top and bottom toasts
            duration={2000}
            animationDuration={0}
            placement="bottom"
            animationType="zoom-in"
            renderToast={toastOptions => (
              <RenderToastView toastOptions={toastOptions} />
            )}
          />
        </NavigationContainer>
      </PortalProvider>
    </GestureHandlerRootView>
  );
};
export default App;
