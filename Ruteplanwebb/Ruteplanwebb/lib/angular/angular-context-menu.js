/**
 * ng-context-menu - v0.1.1 - An AngularJS directive to display a context menu when a right-click event is triggered
 *
 * @author Ian Kennington Walter (http://ianvonwalter.com)
 */
angular
  .module('ng-context-menu', [])
  .factory('ContextMenuService', function () {
      return {
          menuElement: null,
          closeContextMenu : null
      };
  })
  .directive('contextMenu', ['$window', '$parse', 'ContextMenuService', function ($window, $parse, ContextMenuService) {
      return {
          restrict: 'A',
          link: function ($scope, element, attrs) {
              var opened = false,
                openTarget,
                disabled = $scope.$eval(attrs.contextMenuDisabled),
                win = angular.element($window),
                fn = $parse(attrs.contextMenu);

              function open(event, element) {
                  element.addClass('open');
                  if ('pageX' in event) {
                      element.css('top', Math.max(event.pageY, 0) + 'px');
                      element.css('left', Math.max(event.pageX, 0) + 'px');
                  } else {
                      element.css('top', Math.max(event.y + document.getElementById(attrs.id).offsetTop, 0) + 'px');
                      element.css('left', Math.max(event.x + document.getElementById(attrs.id).offsetLeft, 0) + 'px');
                  }
                  opened = true;
              }

              function close(element) {
                  opened = false;
                  element.removeClass('open');
              }

              element.bind('contextmenu', function (event) {
                  if (!disabled) {
                      if (ContextMenuService.menuElement !== null) {
                          close(ContextMenuService.menuElement);
                      }
                      ContextMenuService.menuElement = angular.element(document.getElementById(attrs.target));
                      openTarget = event.target;
                      event.preventDefault();
                      event.stopPropagation();

                      var x, y;
                      if ('pageX' in event) {
                          x = event.pageX - document.getElementById(attrs.id).offsetLeft;
                          y = event.pageY - document.getElementById(attrs.id).offsetTop;
                      } else {
                          x = event.x - document.getElementById(attrs.id).offsetLeft;
                          y = event.y - document.getElementById(attrs.id).offsetTop;
                      }


                      $scope.contextMenuLocation = { x: Math.max(0, x), y: Math.max(0, y) };

                      $scope.$apply(function () {
                          fn($scope, { $event: event });
                          open(event, ContextMenuService.menuElement);
                      });
                  }
              });

              win.bind('keyup', function (event) {
                  if (!disabled && opened && event.keyCode === 27) {
                      $scope.$apply(function () {
                          close(ContextMenuService.menuElement);
                      });
                  }
              });

              function handleWindowClickEvent(event) {
                  if (!disabled && opened && (event.button !== 2 || event.target !== openTarget)) {
                      $scope.$apply(function () {
                          close(ContextMenuService.menuElement);
                      });
                  }
              }

              $scope.contextMenuHandleWindowClicked = handleWindowClickEvent;

              // Firefox treats a right-click as a click and a contextmenu event while other browsers
              // just treat it as a contextmenu event
              win.bind('click', handleWindowClickEvent);
              win.bind('contextmenu', handleWindowClickEvent);
          }
      };
  }]);