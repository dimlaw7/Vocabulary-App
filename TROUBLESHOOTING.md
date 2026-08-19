DOCUMENTING NOTABLE PROBLEMS I FACED vs HOW I SOLVED THEM

(1) PROBLEM:
The project is incompatible with this version of EXPO GO. I ran into this error when I opened the project on EXPO Go after setting up the enviroment.

(1) SOLUTION:
My project SDK uses a newer version than the store build. I installed a compatible version of the build using this method (https://docs.expo.dev/troubleshooting/expo-go-version-mismatch/).

# I could not Install the EXPO GO build with SDK 57 via USB on the website. I had to download the file and install manually via Expo Orbit and Apple Devices.

(2) PROBLEM :
I am currently working on a temporary computer that does not belong to me. I tried to make my first git commit and it asked me to setup author identity with my Github user credentials.

(2) SOLUTION:
Because it's a temprary computer, I used >>git config user.email "your_email@example.com"
git config user.name "Your Name"<< without the --global flag for local configuration.
====================================================================================================
(3) PROBLEM: Solution 1 worked but I could not open my project. The EXPO Go client crashes after loading project at 100%.

(3) SOLUTION: Development builds (https://docs.expo.dev/develop/development-builds/introduction/)
