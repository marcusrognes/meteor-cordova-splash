  # meteor-cordova-splash

Automatic splash screen generator for Meteor with Cordova. Create a splash screen (2208x2208) once in the root folder of your Meteor project and use meteor-cordova-splash  to automatically resize and copy it for Android and iOS.

The generated images will be placed in resources/launch_screens/

### Installation

    $ npm install meteor-cordova-splash -g

### Requirements

- ImageMagick installed (*Mac*: `brew install imagemagick`, *Debian/Ubuntu*: `sudo apt-get install imagemagick`, *Windows*: [See here](http://www.imagemagick.org/script/binary-releases.php#windows))

### Usage

Create a `splash.png` file in the root folder of your Meteor project and run:

    $ meteor-cordova-splash

### Config
Copy relevant contents the configuration below to your mobile-config.js file.

    // mobile-config.js
    App.launchScreens({
      iphone_2x: 'resources/launch_screens/iphone_2x.png',
      iphone5: 'resources/launch_screens/iphone5.png',
      iphone6: 'resources/launch_screens/iphone6.png',
      iphone6p_portrait: 'resources/launch_screens/iphone6p_portrait.png',
      iphone6p_landscape: 'resources/launch_screens/iphone6p_landscape.png',
      ipad_portrait: 'resources/launch_screens/ipad_portrait.png',
      ipad_portrait_2x: 'resources/launch_screens/ipad_portrait_2x.png',
      ipad_landscape: 'resources/launch_screens/ipad_landscape.png',
      ipad_landscape_2x: 'resources/launch_screens/ipad_landscape_2x.png',
      android_mdpi_portrait: 'resources/launch_screens/android_mdpi_portrait.png',
      android_mdpi_landscape: 'resources/launch_screens/android_mdpi_landscape.png',
      android_hdpi_portrait: 'resources/launch_screens/android_hdpi_portrait.png',
      android_hdpi_landscape: 'resources/launch_screens/android_hdpi_landscape.png',
      android_xhdpi_portrait: 'resources/launch_screens/android_xhdpi_portrait.png',
      android_xhdpi_landscape: 'resources/launch_screens/android_xhdpi_landscape.png',
      android_xxhdpi_portrait: 'resources/launch_screens/android_xxhdpi_portrait.png',
      android_xxhdpi_landscape: 'resources/launch_screens/android_xxhdpi_landscape.png',
    });


### Icons

Check out [meteor-cordova-icon](https://github.com/emilbryggare/meteor-cordova-icon)

### Acknowledgements
This is a fork of [cordova-splash](https://github.com/AlexDisler/cordova-splash) by Alex Disler. Most of the work was already done by him.

### License

MIT
