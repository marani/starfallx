/* Preference Panel directives, solving special layout problems
 * manipulate: all course-pref-col elements
 * reuquirement: see paper notes
 */
angular.module('starfallxApp')
    .directive('prefPanel', function($window) {
        return {
            // scope: true,
            restrict: 'A',
            link: function(scope, el, attrs) {
                var floatCtn = $('.ctn-find-btn-float');
                var fixedCtn = $('.ctn-find-btn-fixed');
                var flexPanel = $('.flexPanel');
                var alertCtn = $('.ctn-alert');
                var bgTop = $('.border-grad-top');
                var bgBtm = $('.border-grad-btm');
                showFloat();
                function showFloat() {
                    fixedCtn.css('visibility', 'hidden');
                    floatCtn.css('display', 'block');
                    flexPanel.css('margin-bottom', '0px');
                    bgTop.css('visibility', 'hidden');
                    bgBtm.css('visibility', 'hidden');
                }
                function showFixed() {
                    fixedCtn.css('visibility', '');
                    floatCtn.css('display', 'none');
                    flexPanel.css('margin-bottom', fixedCtn.css('height'));
                    bgTop.css('top', flexPanel.css('margin-top'));
                    bgBtm.css('bottom', flexPanel.css('margin-bottom'));
                    bgTop.css('visibility', '');
                    bgBtm.css('visibility', '');
                }
                function updateLayout() {
                    flexPanel.css('margin-top', 
                        (parseFloat(alertCtn.css('top').replace('px', '')) + parseFloat(alertCtn.height())) + 'px');

                    if (flexPanel.get(0).scrollHeight > flexPanel.height()) 
                        showFixed();
                    else
                        showFloat();
                    scope.$emit('updateScroll', {});
                }
                flexPanel.on('DOMSubtreeModified', function() {
                    // console.log('sub tree modified');
                    updateLayout();
                })
                $($window).on('resize', function() {
                    updateLayout();
                });
                scope.$on('layoutChange', function() {
                    // console.log('layout update from directive');
                    updateLayout();
                })
            }
        }
    })
    .directive('showAndEmit', function() {
        return {
            link: function(scope, el, attrs) {
                scope.$watch(attrs.showAndEmit, function(value) {
                    value != value;
                    // $animator(scope, attrs)[value ? "show" : "hide"]
                    el.css('display', value ? 'block' : 'none');
                    scope.$emit('layoutChange', {});
                })
            }
        }
    });
