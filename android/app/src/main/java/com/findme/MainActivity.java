package com.findme;

import com.facebook.react.ReactActivity;
import com.oblador.vectoricons.VectorIconsPackage;
import com.rota.rngmaps.RNGMapsPackage;
import com.facebook.react.ReactPackage;
import com.airbnb.android.react.maps.MapsPackage;
import com.facebook.react.shell.MainReactPackage;
import java.util.Arrays;
import java.util.List;

//import com.rota.rngmaps.RNGMapsPackage; // <-- import

public class MainActivity extends ReactActivity {
  //@Override
    protected List<ReactPackage> getPackages() {
        return Arrays.<ReactPackage>asList(
            new MainReactPackage(),
            new VectorIconsPackage(),
            new RNGMapsPackage(),
            new MapsPackage(this)
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
