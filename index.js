var fs = require('fs');
var path = require('path');
var xml2js = require('xml2js');
var ig = require('imagemagick');
var colors = require('colors');
var _ = require('underscore');
var Q = require('q');
var wrench = require('wrench');

/**
 * @var {Object} settings - names of the config file and of the splash image
 * TODO: add option to get these values as CLI params
 */
var settings = {};
settings.CONFIG_FILE = 'config.xml';
settings.SPLASH_FILE = 'splash.png';
settings.DESTINATION = 'resources/launch_screens/';
settings.IOS_SPLASHES = [
  {name: 'iphone_2x.png', width: 640, height: 960},
  {name: 'iphone5.png', width: 640, height: 1136},
  {name: 'iphone6.png', width: 750, height: 1334},
  {name: 'iphone6p_portrait.png', width: 1242, height: 2208},
  {name: 'iphone6p_landscape.png', width: 2208, height: 1242},
  {name: 'ipad_portrait.png', width: 768, height: 1024},
  {name: 'ipad_portrait_2x.png', width: 1536, height: 2048},
  {name: 'ipad_landscape.png', width: 1024, height: 768},
  {name: 'ipad_landscape_2x.png', width: 2048, height: 1536}
];
settings.ANDROID_SPLASHES = [
  // Landscape
  {name: 'android_mdpi_landscape.png', width: 480, height: 320},
  {name: 'android_hdpi_landscape.png', width: 800, height: 480},
  {name: 'android_xhdpi_landscape.png', width: 1280, height: 720},
  {name: 'android_xxhdpi_landscape.png', width: 1440, height: 960},
  // Portrait
  {name: 'android_mdpi_portrait.png', width: 320, height: 480},
  {name: 'android_hdpi_portrait.png', width: 480, height: 800},
  {name: 'android_xhdpi_portrait.png', width: 720, height: 1280},
  {name: 'android_xxhdpi_portrait.png', width: 960, height: 1440}
];

/**
 * @var {Object} console utils
 */
var display = {};
display.success = function (str) {
  str = '✓  '.green + str;
  console.log('  ' + str);
};
display.error = function (str) {
  str = '✗  '.red + str;
  console.log('  ' + str);
};
display.header = function (str) {
  console.log('');
  console.log(' ' + str.cyan.underline);
  console.log('');
};

/**
 * Crops and creates a new splash in the platform's folder.
 *
 * @param  {Object} platform
 * @param  {Object} splash
 * @return {Promise}
 */
var generateSplash = function (splash) {
  var deferred = Q.defer();
  var srcPath = settings.SPLASH_FILE;
  var dstPath = settings.DESTINATION + splash.name;
  var dst = path.dirname(dstPath);
  if (!fs.existsSync(dst)) {
    wrench.mkdirSyncRecursive(dst);
  }
  ig.crop({
    srcPath: srcPath,
    dstPath: dstPath,
    quality: 1,
    format: 'png',
    width: splash.width,
    height: splash.height
  }, function (err, stdout, stderr) {
    if (err) {
      deferred.reject(err);
    } else {
      deferred.resolve();
      display.success(splash.name + ' created');
    }
  });
  return deferred.promise;
};

/**
 * Generates splash based on the platform object
 *
 * @param  {Object} platform
 * @return {Promise}
 */
var generateSplashForPlatform = function (platform) {
  var deferred = Q.defer();
  display.header('Generating splash screen for ' + platform);

  var splashes = [];
  if (platform == 'all') {
    splashes = settings.IOS_SPLASHES.concat(settings.ANDROID_SPLASHES);
  } else if (platform == 'ios') {
    splashes = settings.IOS_SPLASHES;
  } else if (platform == 'android') {
    splashes = settings.ANDROID_SPLASHES;
  }

  var all = [];
  var splashes = platform.splash;
  splashes.forEach(function (splash) {
    all.push(generateSplash(splash));
  });
  Q.all(all).then(function () {
    deferred.resolve();
  }).catch(function (err) {
    console.log(err);
  });
  return deferred.promise;
};

/**
 * Goes over all the platforms and triggers splash screen generation
 *
 * @param  {Array} platforms
 * @return {Promise}
 */
var generateSplashes = function (platform) {
  var deferred = Q.defer();
  display.header('Generating splash screen for ' + platform);

  var splashes = [];
  if (platform == 'all') {
    splashes = settings.IOS_SPLASHES.concat(settings.ANDROID_SPLASHES)
  } else if (platform == 'ios') {
    splashes = settings.IOS_SPLASHES
  } else if (platform == 'android') {
    splashes = settings.ANDROID_SPLASHES
  }
  var all = [];
  splashes.forEach(function (splash) {
    all.push(generateSplash(splash));
  });
  return Promise.all(all);
};

/**
 * Checks if a valid splash file exists
 *
 * @return {Promise} resolves if exists, rejects otherwise
 */
var validSplashExists = function () {
  display.header('Checking Splash');
  var deferred = Q.defer();
  fs.exists(settings.SPLASH_FILE, function (exists) {
    if (exists) {
      display.success(settings.SPLASH_FILE + ' exists');
      deferred.resolve();
    } else {
      display.error(settings.SPLASH_FILE + ' does not exist in the root folder');
      deferred.reject();
    }
  });
  return deferred.promise;
};

/**
 * Receives selected platforms for command line input.
 *
 * @return {Promise} resolves if exists, rejects otherwise
 */
var getPlatforms = function () {
  display.header('Checking Arguments');
  var deferred = Q.defer();
  var args = process.argv.slice(2);
  switch (args.length) {
    case 0:
      var platform = 'all';
      display.success('Selected all platforms.');
      deferred.resolve(platform);
      break;
    case 1:
      var platform = args[0];
      if (platform == 'ios' || platform == 'android') {
        display.success('Selected ' + args[0]);
        deferred.resolve(platform);
        break;
      }
    default:
      display.error('Usage: meteor-cordova-icon [ios||android].');
      deferred.reject();
      break;
  }
  return deferred.promise;
};

validSplashExists()
  .then(getPlatforms)
  .then(generateSplashes)
  .catch(function (err) {
    if (err) {
      console.log(err);
    }
  }).then(function () {
  console.log('');
});
