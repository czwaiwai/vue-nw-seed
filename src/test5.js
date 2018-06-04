// var execPrint = require('./utils/execPrint')
// execPrint("<b>哈哈哈</b>", 'POS58', function (err, res){
//   console.log(err, res)
// })

 var arr = [ { calPath: ',root,front',
  deep: 2,
  isValid: 1,
  sort: 100,
  _id: '5b0f7cd645d39b13b0a08e34',
  nameCn: '首页',
  name: 'home',
  relativeUrl: '/',
  imgUrl: '',
  useTpl: '',
  shopName: 'mShop',
  __v: 0 },
  { calPath: ',root,front',
    deep: 2,
    isValid: 1,
    sort: 100,
    _id: '5b0f7d8a45d39b13b0a08e35',
    nameCn: '关于我们',
    name: 'about',
    relativeUrl: '/page/about',
    imgUrl: '',
    useTpl: '',
    shopName: 'mShop',
    __v: 0 },
  { calPath: ',root,front',
    deep: 2,
    isValid: 1,
    sort: 100,
    _id: '5b0f7db045d39b13b0a08e36',
    nameCn: '我们的服务',
    name: 'services',
    relativeUrl: '#',
    imgUrl: '',
    useTpl: '',
    shopName: 'mShop',
    __v: 0 },
  { calPath: ',root,front,services',
    deep: 3,
    isValid: 1,
    sort: 100,
    _id: '5b0f808145d39b13b0a08e42',
    nameCn: '作战室',
    name: 'war_room',
    relativeUrl: '/page/war_room',
    imgUrl: '',
    useTpl: '',
    shopName: 'mShop',
    __v: 0 },
  { calPath: ',root,front,services',
    deep: 3,
    isValid: 1,
    sort: 100,
    _id: '5b0f80cf45d39b13b0a08e43',
    nameCn: '规划室',
    name: 'planning_room',
    relativeUrl: '/page/planning_room',
    imgUrl: '',
    useTpl: '',
    shopName: 'mShop',
    __v: 0 },
  { calPath: ',root,front,services',
    deep: 3,
    isValid: 1,
    sort: 100,
    _id: '5b0f810945d39b13b0a08e44',
    nameCn: '培训室',
    name: 'training_room',
    relativeUrl: '/page/training_room',
    imgUrl: '',
    useTpl: '',
    shopName: 'mShop',
    __v: 0 },
  { calPath: ',root,front,services',
    deep: 3,
    isValid: 1,
    sort: 100,
    _id: '5b0f813245d39b13b0a08e45',
    nameCn: '模拟室',
    name: 'simulation_room',
    relativeUrl: '/page/simulation_room',
    imgUrl: '',
    useTpl: '',
    shopName: 'mShop',
    __v: 0 },
  { calPath: ',root,front,services',
    deep: 3,
    isValid: 1,
    sort: 100,
    _id: '5b0f815a45d39b13b0a08e46',
    nameCn: '设计室',
    name: 'design_room',
    relativeUrl: '/page/design_room',
    imgUrl: '',
    useTpl: '',
    shopName: 'mShop',
    __v: 0 },
  { calPath: ',root,front',
    deep: 2,
    isValid: 1,
    sort: 100,
    _id: '5b0f7df645d39b13b0a08e37',
    nameCn: '营销见解',
    name: 'sell',
    relativeUrl: '/page/sell',
    imgUrl: '',
    useTpl: '',
    shopName: 'mShop',
    __v: 0 },
  { calPath: ',root,front',
    deep: 2,
    isValid: 1,
    sort: 100,
    _id: '5b0f7e1945d39b13b0a08e38',
    nameCn: '最新动态',
    name: 'news',
    relativeUrl: '/article/list/news',
    imgUrl: '',
    useTpl: 'article',
    shopName: 'mShop',
    __v: 0 },
  { calPath: ',root,front',
    deep: 2,
    isValid: 1,
    sort: 100,
    _id: '5b0f7e3445d39b13b0a08e39',
    nameCn: '联系我们',
    name: 'contact',
    relativeUrl: '/page/contact',
    imgUrl: '',
    useTpl: '',
    shopName: 'mShop',
    __v: 0 } ]
// console.log(arr)

// function covertArr (arr, before, res) {
//   let item = arr.shift()
//   // 当前元素是不是上一个对象的子元素
//   if (!item) return
//   if (before) {
//     if (before.calPath + ',' + before.name === item.calPath) { // 说明是子元素
//       let tmp = [item]
//       covertArr(arr, item, tmp)
//       before.children = tmp
//       // if (before.children) {
//       //   before.children.push(item)
//       // } else {
//       //   before.children = [item]
//       // }
//     } else {
//       // if (before.deep > item.deep) {
//       //       //   coverArr()
//       //       // }
//       if (before.deep === item.deep) {
//         res.push(item)
//         covertArr(arr, item, res)
//       }
//     }
//   } else {
//     res.push(item)
//     covertArr(arr, item, res)
//   }
// }

// function covert(arr, before, res) {
//   var tmp = []
//   var item = arr.shift()
//   console.log(item)
// }
function findChild (before, arr) {
  return arr.filter(item => {
    return before.calPath + ',' + before.name === item.calPath
  })
}
function cover (arr, res) {
  var item = arr.shift()
  if (!item) return
  var children = findChild(item, arr)
  if (children && children.length > 0) {
    item.children = children
  }
  res.push(item)
  cover(arr, res)
}

// function cover1 (sub) {
//   res.forEach(item => {
//      if(item.calPath + ',' + item.name === sub.calPath) {
//        item.children.push(sub)
//      }
//   })
// }
// var res = []
// cover(arr, res)
// console.log(res)
function coverDeep (arr,deep) {
  return arr.filter(item => item.deep === deep)
}
function cover2(arr) {
  let tmp = []
  var dee2Arr = coverDeep(arr, 2)
  dee2Arr.forEach(item => {
    var newArr = coverDeep(arr, 3)
    item.children = []
    tmp.push(item)
    newArr.forEach(subItem => {
      if(item.calPath + ',' + item.name === subItem.calPath) {
        item.children.push(subItem)
      }
    })
  })
  return tmp
}

function cover3 (child, num = 2) {
  var deepArr = arr
  var deep = num || 2
  if(child.length === 0) return
  if (num === 2) {
    deepArr = coverDeep(arr, num)
  } else {
    deepArr = child
  }
  deepArr.forEach(item => {
    var newArr = coverDeep(arr, ++deep)
    item.children = []
    newArr.forEach(subItem => {
      if (item.calPath + ',' + item.name === subItem.calPath) {
        item.children.push(subItem)
      }
    })
    cover3(item.children, ++num)
  })
  return deepArr
}
// console.log(cover2(arr))
console.log(cover3(arr))
