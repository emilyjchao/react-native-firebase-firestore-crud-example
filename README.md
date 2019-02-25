# ENGS 90 Serta Simmons Bedding Children's Sleep Monitoring System Application
## Sponsor: JD Velilla at Serta Simmons
### Code by: Emily Chao & Sheppard Somers
### Project members: Cristian Vences, Dan Choe, Emily Chao, Lily Hanig, Rachel Martin, & Sheppard Somers
### Advisor: Professor Geoffrey Luke
Completed Fall 2018 and Winter 2019

# Overview
Mobile interface for parents to learn more about and thereby improve their children's sleeping habits. This application displays our four metrics of time in bed, movement, bed exits, and bed wetting collected by our hardware product. It is part of a feasibility study for Serta Simmmons Bedding (SSB), as such  it features a complete user interface to view the data and logon, but is lacking in its algorithms and notifications. The application will allow the hardware and user experience to be tested as part of product development for SSB. It is currently set up to be run and built as an iOS application.

# Getting Started
Clone the repository and run ```yarn``` to install the packages and dependencies. The application is run using expo, see [expo installation instructions.](https://docs.expo.io/versions/latest/introduction/installation/).

The application can be started by ```running yarn start``` in the sleep directory and then selecting option ```i``` to run in the iOS simulator or scanning the QR code to download the expo mobile application and run the app. Either way the app will have live reloading upon file saves.

## Building a standalone app
The app can be built by changing the version number in ```app.json``` and running ```expo build:ios```. This will yield a link from which the app file can be downloaded.

## Uploading to TestFlight
After building the app, Xcode and the application uploader can be used to add the app to your AppStore Connect account. Full directions are found on [Expo's website here](https://docs.expo.io/versions/latest/distribution/uploading-apps/). They are summarized as:
* Build standalone app file and download it from the resulting url
* Open XCode and click ```XCode --> Developer Tools --> Application Loader```
* Follow instructions in application loader
* Click the file upload button and select the standalone app file
* Upload the application
* Wait to receive confirmation email of upload  
* Move to the TestFlight tab and select builds, you should see your current build
* Fill in compliance information for build on AppStoreConnect. (The app does not currently use encryption).
* Go to or add a user group:
    * Invited internal testers, added via app ID will immediately be able to download the app. Click the group, then builds then the plus to add a build and add the most recent build.
    * For external testers who can be invited via a link, the app will require Beta App Review from Apple which takes about 24hrs and you will receive an email upon completion. To begin Beta App Review, click on the external user group and click add build as with above, then click submit for Beta App Review.
* Users will be notified of new builds by email by default and can download the new or updated version via the external link or through TestFlight.

# Functionality
This application displays the user's information on the four key metrics mentioned above, sleep, enters and exits, bed wetting, and movement, as well as comparisons to national averages* and various user settings**.

# Recommended Improvements
Moving forward, we recommend that Serta Simmons make several changes to the logic of our sleep algorithms and app, data visualization, and database structure. At the highest level we have generally implemented the front-end, but have not created any logic on the server side. This is the most pressing addition. The server should include logic for better processing data from the arduino and serve specific data to the app rather than all at once.
## Database:
### Current Structure
The current database contains the following hierarchy:
 ```./sleep-Data/userData/[uniqueUID]/[String “mm-dd-yyyy”]/[event type]/[array of timestamps for event]```
```[uniqueUID]/Profile/[various settings]/[0 or 1]```

The database contains no functions, is not cost optimized (does not minimize download), cannot send notifications, and is only partially password protected.
### Read/Write
**Current:** Direct write and read by the hardware and app, app pull all of the users data every time
**Recommendation Short Term:** Downloads must be minimized to minimize cost, the current set up is projected to cost **~$50/user/yr** while an optimized database may only cost **$4.20**, see cost projections below. This optimization likely requires setting up functions for pull requests (likely via HTTP) that only send the most recent day, store old data locally on the device. Data appears to be around 0.35 MB/day so this should not be a burden to the device while downloads have averaged around 150 MB/day, see cost projections below. This will likely require saving days as ```Date Object``` keys instead of ```strings``` so that the days can be sorted easily. It may also require saving the most recent day downloaded in the application.
* If local storage is not desired, data should only be pulled as it is accessed (ie. only pull all data if the user clicks on the "All" view)
* See this article as a warning of what can happen: [Lessons Learnt the Hard Way Using Firebase Realtime Database](https://pamartinezandres.com/lessons-learnt-the-hard-way-using-firebase-realtime-database-c609b52b9afb)

**Recommendation Long Term:** Ultimately another database may be more economical, especially if optimization is not completed

### Cost Projections
Firebase charges for the number of GB stored as well as the number of downloads. Downloads are currently very high as discussed above, which drives almost all of the costs.		
 The formula is the sum of the cost of storing data as it accrues and the average downloads per month.

	$ per user per yr = (stored MB/mo.)*(sum(1-12))*($0.005/MB) + (downloads MB/mo.)*($0.001/MB)

  | Data Structure | Data/mo. (MB) | Downloads/mo. (MB) | Cost ($/yr) |
|----------------|---------------|--------------------|-------------|
| Current        | 9.9           | 4590               | 59.10       |
| Optimized      | 9.9           | 24.9               | 4.20        |

The projected costs/user estimations of using the Firebase database with the current app and the potential cost for a download optimized application.

### Security
**Current:** Read/write rules in firebase are set according to the firebase docs to only allow authorized users to access data under their UID. It does not. The front end requires authentication but the backend can still read and write without authentication.

**Recommendation:** Check rules, test protection, write new rules, seek other authentication or database options.

The database also still contains our old data that is not sorted under a userID. This has not been deleted as it may be of use in displaying example data if sign in is disabled or as example to an unregistered user.

### General
**Timestamps:** Finalize as 10 or 13 digits (with or without milliseconds in Epoch time) and adjust app logic accordingly. Currently is 10 for events and 13 for movements

## Logic/Algorithms
### Improve Sleep Algorithm
**Current:** the app in ```HomeScreen.js``` in ```onFetchData()``` executes a simple algorithm that checks that the child's time in bed is greater than a threshold amount, and that the child's restlessness in the five minutes after the "asleep" period begins is less than a 30 out of 100

**Current:** the napping algorithm (also in ```onFetchData()```) categorizes any "asleep" period as a nap if it is less than 4 hours in duration and between the hours of 10 am and 6 pm

**Recommendation:** Further testing into thresholds or rewrite algorithm completely after larger scale data collection and possibly apply machine learning after testing with a sleep lab or other definitive method. From our experience, machine learning algorithms such as decision trees, regressions, naive Bayes, nearest neighbor, support vector machines, and deep neural networks may be useful.
* After categorizing awake v asleep, identify as normal sleep, restless sleep, or nap.
* Do not report light/deep/REM sleep as this is too complex to be useful for parents and can be misleading (according to DHMC sleep doctor)

### Multiple Children
**Current:** Setting include button to add child but no backend.
Recommendation: Add a page for parents to input their child's information and add a second tracker to their account
**Related:** navigation between children, database structure for support
### National Averages
**Current:** Hard-coded in national averages (only the average hrs of sleep is accurate), opt in/out settings (front end and database)

**Recommendation:** Once SSB has gathered enough data or can access data from existing customers, calculate these averages and split based off of age group demographics
### Multiple Users
**Current:** The app and database support multiple users using Firebase’s email & password method, user data stored under UID (unique user id - automatically generated by Firebase), and read/write rules specified in the database to restrict to authorized and matching users

**Issue:** The hardware is able to write to the database without signing in if it has the UID hard coded in, meaning the Firebase rules are not effective. Again, the rules do deny read permission from the app side if not signed in, so this seems to impact writing from the arduino but not reading from the react native application.

**Recommendation:** Implement other sign on methods, server logic for creating initial user branch of database via the server not the app
### Data Processing/Usage:
**Current:** The app downloads the entire database, processes it from the JSON object of strings into js arrays, analyzes data with algorithms described above. The app then stores multiple arrays in state including every day of data and splits of data for each view. This creates some lag in the application and extraordinarily high download amounts (See section below on Database improvements)

**Recommendation:** Store more useful data in the database, possibly performing all logic on the database and only sending data to be directly used in graphs and data summaries, fetch only relevant data rather than always the whole history, store less movement/restlessness data

## UI
### Tutorial
**Current:** The ```i``` button toggles explanatory/tutorial style text on views, user can read to walk through app functionality, each title also is clickable to bring up an alert about what the metric is. Initial introductory feature video and walk through are linked here

**Recommendation:** Add interactive introductory tutorial walk-through for the first time the user opens the app
### Customize Metric Displays
**Current:** Displays the same metrics regardless of preference, except for main week and month graphs which can be toggled from total hours broken down by awake/asleep/napping and time into and out of bed. Displays trends of data on Month page, details on day page.

**Recommendation:** Allow parents to customize the data metrics shown on the summary page, e.g. show bedwet or don’t, and/or include more averages such as average bedtime or waking time
### National Averages/Recommendations
**Current:** Hardcoded, fake national averages, with recommended line for sleep amount
**Recommendation:** Add recommendations specific to their child about how much sleep to get, how many exits/wets are normal each night, how restless their child should be
* Consult with medical professionals and/or determine "normals" based off testing results
* Clarify movement (on a 0-100 scale) by telling parents what a goal range should be, e.g. Are most children of the same demographic scoring a 30-40? 80?

### Movement Presentation
**Current:** Line graph from low to high of movement. This scale is from 0-100.
**Recommendation:** Clarify range, include some sort of baseline. We tested:
* Averages on the scale of 0-1, 0-10, and 0-100, but the range seems to make no difference in user confusion
* The descriptions (low, normal, high) also confuse people, without them people are even more confused
* We suggest dedicating a portion of the tutorial to explain to users what the movement metrics mean

### Clicking Bar Chart
**Current:** Click on bar to update button above graph to show summary of that day, click button to go to day detail

**Recommendation:** Pop up a little, hovering box detailing important sleep details for that day
* By clicking on that box, parents could then navigate to the daily view
* This will clean up the user interface and make it more intuitive

### General Layout
**Current:** Flat, little busy, no delimitation between sections, see screenshots above

**Recommendation:** Align visual layout more closely with existing SSB sleep tracking apps, slight background shading behind graph to give depth/section it off or possibly borders between sections to visually break up and compartmentalize the main views



This source code is part of [React Native Firebase Tutorial: Build CRUD Firestore App](https://www.djamware.com/post/5bbcd38080aca7466989441b/react-native-firebase-tutorial-build-crud-firestore-app) tutorial.
