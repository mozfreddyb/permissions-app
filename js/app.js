// DOMContentLoaded is fired once the document has been loaded and parsed,
// but without waiting for other external resources to load (css/images/etc)
// That makes the app more responsive and perceived as faster.
// https://developer.mozilla.org/Web/Reference/Events/DOMContentLoaded
window.addEventListener('DOMContentLoaded', function() {

  // We'll ask the browser to use strict code to help us catch errors earlier.
  // https://developer.mozilla.org/Web/JavaScript/Reference/Functions_and_function_scope/Strict_mode
  'use strict';

  var translate = navigator.mozL10n.get;

  // We want to wait until the localisations library has loaded all the strings.
  // So we'll tell it to let us know once it's ready.
  navigator.mozL10n.once(start);

  // ---

  function start() {

    /*var message = document.getElementById('message');
    message.textContent = translate('message');*/

  }

  var listPermissions = (function listPermissions() {
    // via https://developer.mozilla.org/en-US/docs/Web/API/Permissions_API
    // Let's check all installed apps
    var apps = navigator.mozApps.mgmt.getAll();
    var applist = document.getElementById("applist");


    apps.onsuccess = function () {
      var permission = navigator.mozPermissionSettings;

      // Let's check the permission of each app
      apps.result.forEach(function (app) {
        var request, appName = app.manifest.name;

        var app_entry = document.createElement("li");
        var app_title = document.createElement("h5");
        app_title.addEventListener("click", function(e) {
          var el = e.target;
          var permlist = el.nextSibling;
          console.log("(un)hiding ", permlist);
          permlist.classList.toggle("hidden");
        });
        var app_permissions = document.createElement("ul");
        app_entry.appendChild(app_title);
        app_permissions.classList.add("hidden");
        app_entry.appendChild(app_permissions);

        app_title.textContent = appName;
        console.group();
        console.log("permissions for ", appName);
        console.log(app);
        for (request in app.manifest.permissions) {
          // Let's get the current permission for each permission request by the application

          var p = permission.get(request, app.manifestUrl, app.origin, false);
          console.log(request, app.manifestURL, app.origin);
          console.log(request, ">", p)
          var perm_entry = document.createElement("li");
          perm_entry.textContent = request + ': ' + p;
          app_permissions.appendChild(perm_entry);
        }
        console.groupEnd();
        applist.appendChild(app_entry);
      });

    }
  });
  listPermissions();
  document.getElementById("btnreload").addEventListener("click", function() { listPermissions() });
});
