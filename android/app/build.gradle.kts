plugins {

    id("com.android.application")

    id("kotlin-android")

    id("dev.flutter.flutter-gradle-plugin")

    id("com.google.gms.google-services")
}

android {

    namespace = "com.example.truthpulse"

    compileSdk = 34

    compileOptions {

        sourceCompatibility =
            JavaVersion.VERSION_17

        targetCompatibility =
            JavaVersion.VERSION_17
    }

    kotlinOptions {

        jvmTarget = JavaVersion.VERSION_17.toString()
    }

    defaultConfig {

        applicationId =
            "com.example.truthpulse"

        minSdk = 21

        targetSdk = 34

        versionCode =
            flutter.versionCode

        versionName =
            flutter.versionName
    }

    buildTypes {

        release {

            signingConfig =
                signingConfigs.getByName(
                    "debug"
                )
        }
    }
}

flutter {

    source = "../.."
}
