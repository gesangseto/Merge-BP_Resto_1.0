# IOS Development =>

Requirment:
node v16
npm 8.3.1
nvm 0.39.0

Running Development:

1. Remove folder ios/Pods
2. cd ios && pod install && cd ..
   react-native run-ios --simulator="iPhone 8 Plus"

Change Icon

# npm i @bam.tech/react-native-make

# react-native set-icon --path <path_to_png> --background <icon_background_color> --platform <android|ios>

Rename Package Android

1. npm install react-native-rename -g
2. react-native-rename "MyApp" -b com.mycompany.myapp
3. Change on android/app/src/main/res/values/string.xml <string name="app_name">MyApp</string>
4. npm start --reset-cache

HOW TO BUILD RELEASE AND INSTALL??

1. Delete all file on android/app/build/\*
2. Delete index.android.bundle file on android/app/src/main/assets/index.android.bundle
3. cd android/ && ./gradlew clean
4. cd .. && react-native bundle --platform android --dev false --entry-file index.js --bundle-output android/app/src/main/assets/index.android.bundle --assets-dest android/app/src/main/res
5. cd android/ && ./gradlew assembleRelease OR cd android/ && ./gradlew app:assembleRelease
6. If Error: Duplicate resources
   Delete All Files On android/app/src/main/res/drawable-_ && android/app/src/main/res/raw/_
   then try step 5 again
7. adb install -r android/app/build/outputs/apk/release/app-release.apk

search # Reduce Apk Size for default build APK
