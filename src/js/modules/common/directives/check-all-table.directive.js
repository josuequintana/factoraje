/**=========================================================
 * Module: heckAllTableDirective
 * Allows to use a checkbox to check all the rest in the same
 * columns in a Bootstrap table
 =========================================================*/
(function() {
    'use strict';

    angular
        .module('naut')
        .directive('checkAll', checkAll);
    
    function checkAll() {
      
      controller.$inject = ['$scope', '$element'];
      return {
        restrict: 'A',
        controller: controller
      };

      function controller($scope, $element){
        
        $element.on('change', function() {

          var th = angular.element(this);
          var index = indexInParent(this);
          var checkbox = th.find('input'); // assumes checkbox
          var table = th.parent().parent().parent(); // table > thead > tr > th

          angular.forEach( table.find('tbody').find('tr'),
            function(tr, key) {
              var tds = angular.element(tr).find('td');
              var chk = tds.eq(index).find('input'); // assumes checkbox
              if(chk && chk.length)
                chk[0].checked = checkbox[0].checked
            });

        });
      }

      function indexInParent(node) {
        var children = node.parentNode.childNodes;
        var num = 0;
        for (var i=0; i<children.length; i++) {
           if (children[i]==node) return num;
           if (children[i].nodeType==1) num++;
        }
        return -1;
      }

    }

})();
