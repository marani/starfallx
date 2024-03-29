/* 
 * Perfect Scrollbar Wrapper directives,
 */

angular.module('starfallxApp')
    .directive('sfPerfectScrollbar', function($window, $parse){
        return {
            restrict: 'E',
            // restrict: 'A',
            transclude: true,
            template: '<div><div ng-transclude></div></div>',
            replace: true,
            link: function($scope, $elem, $attr) {
                var bgTop = $elem.parent().find('.border-grad-top');
                var bgBtm = $elem.parent().find('.border-grad-btm');

                $elem.perfectScrollbar({
                    wheelSpeed: $parse($attr.wheelSpeed)() || 50,
                    wheelPropagation: $parse($attr.wheelPropagation)() || false,
                    minScrollbarLength: $parse($attr.minScrollbarLength)() || false,
                    suppressScrollX: true
                });
                function updateScrollBar() {
                    setTimeout(function() {
                        $elem.perfectScrollbar('update');
                        updateBorderGrad();
                    }, 10);
                }
                function updateBorderGrad() {
                    if ($elem.scrollTop() == $elem.prop('scrollHeight') - $elem.height()) 
                        bgBtm.css('visibility', 'hidden');
                    else
                        bgBtm.css('visibility', 'visible');

                    if ($elem.scrollTop() == 0) 
                        bgTop.css('visibility', 'hidden');
                    else
                        bgTop.css('visibility', 'visible');
                }
                $elem.on('mousewheel wheel', function() {
                    updateBorderGrad();
                });
                $scope.$on($attr.update, function() {
                    // console.log('scroll updating...');
                    updateScrollBar();
                });
                // $$elem.on('DOMSubtreeModified', function() {
                //     console.log('sub tree modified');
                //     updateScrollBar();
                // });

                // $($window).on('resize', function() {
                //     console.log('window resize');
                //     updateScrollBar();
                // });
            }
        }
    })

/*
 * Flexlayout directives, solving special layout problems
 * manipulate: all course-pref-col elements
 */
    .directive('resultPanel', function($window) {
        return {
            restrict: 'A',
            link: function($scope, $elem, attrs) {
                var scrollPanel = $elem.find('.scroll-panel');
                // var bgTop = $elem.find('.border-grad-top');
                var bgBtm = $elem.find('.border-grad-btm');
                showFloat();
                function showFloat() {
                    // bgTop.css('visibility', 'hidden');
                    bgBtm.css('visibility', 'hidden');
                }
                function showFixed() {
                    // bgTop.css('top', scrollPanel.css('margin-top'));
                    bgBtm.css('bottom', scrollPanel.css('margin-bottom'));
                    // bgTop.css('visibility', '');
                    // bgBtm.css('visibility', '');
                }
                function updateLayout() {
                    // scrollPanel.css('margin-top', 
                    //     (parseFloat(alertCtn.css('top').replace('px', '')) + parseFloat(alertCtn.height())) + 'px');
                    // console.log(scrollPanel.prop('scrollHeight'), scrollPanel.height())
                    setTimeout(function(){
                        if (scrollPanel.prop('scrollHeight') > scrollPanel.height()) 
                            showFixed();
                        else
                            showFloat();    
                    }, 10);
                    
                    $scope.$emit('updateScroll', {});
                }

                scrollPanel.on('DOMSubtreeModified', function() {
                    // console.log('sub tree modified');
                    updateLayout();
                });
                $($window).on('resize', function() {
                    // console.log('win resize');
                    updateLayout();
                });
                $scope.$on('layoutChange', function() {
                    // console.log('layout update from controller');
                    updateLayout();
                });
            }
        }
    })
    .directive('leftPanel', function($window) {
        return {
            restrict: 'A',
            link: function($scope, $elem, attrs) {
                var floatCtn = $elem.find('.ctn-btn-float');
                var fixedCtn = $elem.find('.ctn-btn-fixed');
                var scrollPanel = $elem.find('.scroll-panel');
                var bgTop = $elem.find('.border-grad-top');
                var bgBtm = $elem.find('.border-grad-btm');
                showFloat();
                function showFloat() {
                    fixedCtn.css('visibility', 'hidden');
                    floatCtn.css('display', 'block');
                    scrollPanel.css('margin-bottom', '0px');
                    bgTop.css('visibility', 'hidden');
                    bgBtm.css('visibility', 'hidden');
                }
                function showFixed() {
                    fixedCtn.css('visibility', '');
                    floatCtn.css('display', 'none');
                    scrollPanel.css('margin-bottom', fixedCtn.css('height'));
                    bgTop.css('top', scrollPanel.css('margin-top'));
                    bgBtm.css('bottom', scrollPanel.css('margin-bottom'));
                    // bgTop.css('visibility', '');
                    // bgBtm.css('visibility', '');
                }
                function updateLayout() {
                    // scrollPanel.css('margin-top', 
                    //     (parseFloat(alertCtn.css('top').replace('px', '')) + parseFloat(alertCtn.height())) + 'px');
                    // console.log(scrollPanel.prop('scrollHeight'), scrollPanel.height())
                    setTimeout(function(){
                        if (scrollPanel.prop('scrollHeight') > scrollPanel.height()) 
                            showFixed();
                        else
                            showFloat();  
                        $scope.$emit('updateScroll', {});  
                    }, 10);
                }
                // $elem.on('mousewheel wheel', function() {
                //     updateLayout();
                // });
                scrollPanel.on('DOMSubtreeModified', function() {
                    // console.log('sub tree modified');
                    updateLayout();
                });
                $($window).on('resize', function() {
                    // console.log('win resize');
                    updateLayout();
                });
                $scope.$on('layoutChange', function() {
                    // console.log('layout update from controller');
                    scrollPanel.scrollTop(0);
                    updateLayout();
                });
            }
        }
    })
