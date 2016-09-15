package com.findme;

//RN
import com.facebook.react.ReactActivity;
import com.facebook.react.ReactPackage;
import com.facebook.react.shell.MainReactPackage;

//modules
import com.oblador.vectoricons.VectorIconsPackage;
import com.marianhello.react.BackgroundGeolocationPackage;
import com.airbnb.android.react.maps.MapsPackage;
import com.oblador.vectoricons.VectorIconsPackage;
import com.rt2zz.reactnativecontacts.ReactNativeContacts;
import com.airbnb.android.react.maps.MapsPackage;

//miscs
import java.util.Arrays;
import java.util.List;


public class MainActivity extends ReactActivity {
  //@Override
    protected List<ReactPackage> getPackages() {
        return Arrays.<ReactPackage>asList(
            new MainReactPackage(),
            new VectorIconsPackage(),
            new BackgroundGeolocationPackage(),
            new MapsPackage(),
            new VectorIconsPackage(),
            new MapsPackage(),
            new ReactNativeContacts()
        );
    }

    /**
     * Returns the name of the main component registered from JavaScript.
     * This is used to schedule rendering of the component.
     */
    @Override
    protected String getMainComponentName() {
        return "FindMe";
    }
}
