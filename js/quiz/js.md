## 填空题

1. c
2. d
3. d
4. b
5. c

## 选择题

1. 浏览器对象模型，浏览器
2. history.go(-2)
3. for='id'
4. 普通for
5.  dom.offsetHeight  +   dom.offsetTop === document.documentElement.clientHeight

## 大题

1.  

   ```javascript
   var arr = [{name: 'cst', age: '18'}, {name: 'jc', age: '20'}, {name: 'dxm', age: '50'}, {name: 'dcg', age: '30'}];
   var newArr = arr
   	.filter(function (value, idx, arr) {
         return !value['name'] || !value['name'].indexOf || value['name'].indexOf('c') >= 0;
     })
   	.map(function (value, idx, arr) {
       for (var key in value) {
         if (value.hasOwnProperty(key)) {
           value['age']++;
         }
       }
       return value;
     });
   ```

2. 

