# Permissions Control App

**Disclaimer: This app is meant for power users only**. I might as well have called this app *footgun*

This app aims to put the user back in control. It is meant for users who are
OK with breaking things and shooting their foot. (Great power, responsibility yadda yadda.)
With this app you will be able to revoke [almost all permissions](# "There are some technical limitations") for every app installed on your Firefox OS
device.

<!-- ##Screenshots
Once this is a bit prettier, add screenshots.
-->


## Install
### Quick & Easy (Firefox OS 1.2+)
* [Download](https://github.com/mozfreddyb/permissions-app/releases) or clone the repo
* Go to *Apps* in the App Manager and select the `permissions-app` folder.
* Connect a phone to the debugger (or run a simulator)
 * If you're new to this, the [App Manager MDN page](https://developer.mozilla.org/en-US/Firefox_OS/Using_the_App_Manager#Quick_setup)
   can help you with the necessary steps.
* Once your phone is connected, select the Permissions App in the App Manager and click "Update".
* The App Manager will push the app to your phone and install it.


### The hard way (All versions)
There is a hard way, which should work with versions previous to Firefox OS 1.2.
It is likely that you will lose data and break things if you follow this path.
You will have to re-build your whole Firefox OS frontend (called "Gaia) and include this app within the distribution.
Make sure to apply the correct version for your phone.
The [Gaia Build System Primer](https://developer.mozilla.org/en-US/Firefox_OS/Developing_Gaia/Build_System_Primer) should be helpful.


## Licensing
* The source code is under MPL 2.0 or greater.
* This apps uses the [Firefox OS Building Blocks](http://buildingfirefoxos.com/building-blocks/). See `[css/](https://github.com/mozfreddyb/permissions-app/tree/master/css)`.
* The privacy icon has been stolen from Firefox and might change in the future.
