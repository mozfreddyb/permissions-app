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
  //////////////// https://github.com/mozilla-b2g/gaia/blob/5709345df31c5fab5cc5c051d591d4e76ca4f706/apps/settings/js/panels/app_permissions_list/app_permissions_list.js#L247
  var _getBestIconURL = function pl__get_best_icon_URL(app, icons) {
    if (!icons || !Object.keys(icons).length) {
      return '../style/images/default.png';
    }

    // The preferred size is 30 by the default. If we use HDPI device, we may
    // use the image larger than 30 * 1.5 = 45 pixels.
    var preferredIconSize = 30 * (window.devicePixelRatio || 1);
    var preferredSize = Number.MAX_VALUE;
    var max = 0;

    for (var size in icons) {
      size = parseInt(size, 10);
      if (size > max) {
        max = size;
      }

      if (size >= preferredIconSize && size < preferredSize) {
        preferredSize = size;
      }
    }
    // If there is an icon matching the preferred size, we return the result,
    // if there isn't, we will return the maximum available size.
    if (preferredSize === Number.MAX_VALUE) {
      preferredSize = max;
    }

    var url = icons[preferredSize];

    if (url) {
      return !(/^(http|https|data):/.test(url)) ? app.origin + url : url;
    } else {
      return '../style/images/default.png';
    }
  } ///////////////////
  var setPermission = function (appName, permName, value) {
    var apps_request = navigator.mozApps.mgmt.getAll();
    var permission = navigator.mozPermissionSettings;
    console.log("Setting permission...", permName, appName, value);
    apps_request.onsuccess = function (evt) {
      var appsArr = evt.target.result;
      for (var app of appsArr) {
        if (app.manifest.name === appName) {
          console.log("Found the app!", app.manifest.name, "==", appName, app);
          if (permission.isExplicit(permName, app.manifestURL, app.origin, false)) {
            // Let's ask the user for all permissions requested by the application
            try {
              //XXX still throws sometimes :-(
              // we can't return because onsuccess event...
              permission.set(permName, value, app.manifestURL, app.origin, false);
            }
            catch(e) {
              console.warn("Uh, could not set the permission...", e);
            };
          }
          else {
            console.warn("This is an implicit permission. We can't change it!");
            console.warn(permName, app.manifestURL, app.origin);
          }
        }
      }
    }
  };

  var listPermissions = (function listPermissions() {
    // via https://developer.mozilla.org/en-US/docs/Web/API/Permissions_API
    // Let's check all installed apps
    var apps_request = navigator.mozApps.mgmt.getAll();
    var applist = document.getElementById("applist");


    apps_request.onsuccess = function (evt) {
      var appsArr = evt.target.result;
      var permission = navigator.mozPermissionSettings;

      // Let's check the permission of each app
      appsArr.forEach(function (app) {
        var permName, appName = app.manifest.name;

        var app_entry = document.createElement("li");
        var app_link = document.createElement("a");
        var app_icon_container = document.createElement("aside");
        var app_icon = document.createElement("img");
        app_icon.src = _getBestIconURL(app, app.manifest.icons)
        app_icon_container.appendChild(app_icon);
        var app_title = document.createElement("p");
        app_link.appendChild(app_icon_container);
        app_link.appendChild(app_title);
        app_entry.appendChild(app_link);
        app_title.textContent = appName;

        app_link.addEventListener("click", (function() {
          var app_view = document.getElementById("app-view-name");
          app_view.textContent = this.manifest.name;
          var perm_list = document.getElementById("permlist");
          for (permName in this.manifest.permissions) {
            // Let's get the current permission for each permission request by the application
            var p = permission.get(permName, this.manifestURL, this.origin, false);
            var perm_entry = document.createElement("li");
            var perm_link = document.createElement("button");
            var perm_icon_container = document.createElement("aside");
            var perm_icon = document.createElement("img");
            if (["allow", "prompt", "deny", "unknown"].indexOf(p) != -1) {
              perm_icon.src = "/img/" + p + ".png"
            }
            perm_icon_container.appendChild(perm_icon)
            perm_link.appendChild(perm_icon_container);
            perm_entry.dataset.p = p;
            if (p !== "unknown") {
              perm_link.addEventListener("click", function () {
                // invoke select
                var select = document.getElementById("change-perms");
                select.dataset.permName = permName;
                select.dataset.appName = appName;
                var current = select.querySelector('[value="' + this.parentNode.dataset.p + '"]');
                current.setAttribute("selected", true);
                select.focus();
                select.onchange = function() {
                  setPermission(this.dataset.appName, this.dataset.permName, this.value);
                  // change image
                  var entries = perm_list.querySelectorAll("p");
                  for (var item of entries) {
                    if (item.textContent == this.dataset.permName) {
                      item.previousSibling.querySelector("img").src = "/img/" + this.value + ".png";
                      break;
                    }
                  }
                }
              })
            }
            else {
              perm_link.addEventListener("click", function() {
                alert("This permission is currently set to 'unknown'. For safety reasons, we prevent you from changing it :(");
              })
            }
            /*var attributeSafeName = app.manifest.name.replace(/\W+/g, '_');

            var perm_label = document.createElement('label');
            perm_label.setAttribute("class", "pack-checkbox danger");
            var perm_checkbox = document.createElement('input');
            perm_checkbox.setAttribute("id", "checkbox-"+attributeSafeName);
            perm_checkbox.setAttribute("type", "checkbox");
            perm_checkbox.setAttribute("checked", "false");
            //perm_checkbox.checked = false;
            if (p == "allow") {
              perm_checkbox.checked = true;
            } else if (p == "deny") {
              perm_checkbox.checked = false;
            } else if (p == "prompt") {

              perm_checkbox.indeterminate = true;
            }
            perm_label.appendChild(perm_checkbox);
            var perm_span = document.createElement('span');
            perm_label.appendChild(perm_span);
            perm_entry.appendChild(perm_label);*/

            perm_entry.appendChild(perm_link);
            var perm_value = document.createElement("p");
            perm_value.textContent = permName;
            perm_link.appendChild(perm_value);
            perm_list.appendChild(perm_entry);
           }

          scrolled = window.scrollY;
          scrollTo(0,0);
          // Show app view
          document.getElementById("app-view").classList.add("move-in");
          document.getElementById("app-view").classList.remove("move-out");
          document.getElementById("list-view").style.display = "none";


        }).bind(app))
        applist.appendChild(app_entry);
      });

    }
  });
  listPermissions();
  //document.getElementById("btnreload").addEventListener("click", function() { listPermissions() });
});



/* app settings view show/hide */
// Close app view
var scrolled;
var appViewClose = document.getElementById("close-app");
appViewClose.addEventListener("click", function () {
  document.getElementById("permlist").innerHTML = "";
  document.getElementById("app-view").classList.remove("move-in");
  document.getElementById("app-view").classList.add("move-out");
  document.getElementById("list-view").style.display = "block";
  scrollTo(0, scrolled);
})