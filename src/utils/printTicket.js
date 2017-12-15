/**
 * Created by Administrator on 2017/12/15 0015.
 */
export function printTicket () {

}
export function covertPrintObj (order, shopPrint) {
  var prints = []
  //  添加消费单
  prints.push(addPrintObj(shopPrint, {btn: 'xiaofei', tpl: 'printTpl1', tplName: '消费单'}, order))
  //  添加结账单
  prints.push(addPrintObj(shopPrint, {btn: 'jiezhang', tpl: 'printTpl3', tplName: '结账单'}, order))
  //  添加厨打单
  Array.prototype.push.apply(prints, addPrintHouObj(shopPrint, {
    btn: 'houchu',
    tpl: 'printTplchu',
    tplName: '厨打单'
  }, order))
  return prints
}
//  消费单和结账单
function addPrintObj (printInfos, btnObj, order) {
  var infos = printInfos.concat()
  //  获取默认打印机
  var defaultPrint = infos.shift()
  var btnPrint
  var printObj
  printInfos.forEach(function (ctx) {
    if (ctx.btn === btnObj.btn) {
      btnPrint = ctx
    }
  })

  // if(!order.restShop){
  //  order.restShop=restShop
  // }

  //  存在按钮设置
  printObj = defaultPrint
  //  print不可以为数组，只有后厨按钮需要数组
  if (btnPrint && typeof btnPrint.print === 'string') {
    btnPrint.name = btnPrint.print
    printObj = btnPrint
  }
  return Object.assign({}, order, {
    printBtn: btnObj.btn,
    printTpl: btnObj.tpl,
    printName: printObj.name,
    printTypeName: btnObj.tplName
  })
}
function getHouPrint (printInfos, btnObj) {
  var infos = printInfos.concat()
  var defaultPrint = infos.shift()
  var btnPrint
  printInfos.forEach(function (ctx) {
    if (ctx.btn === btnObj.btn) {
      btnPrint = ctx
    }
  })
  if (btnPrint) {
    if (typeof btnPrint.print === 'string') {
      return [{type: 'all', name: defaultPrint.print}]
    } else {
      return btnPrint.print
    }
  }
  return [{type: 'all', name: defaultPrint.name}]
}
//  添加后厨对象
function addPrintHouObj (printInfos, btnObj, order) {
  var infos = printInfos.concat()
  var defaultPrint = infos.shift()
  console.log(defaultPrint)
  //  得到所有食物
  var printfoods

  if (!order.isBing) {
    if (order.isBack) {
      printfoods = getAllfoods(order.fnRetreatFoodList, order.isBack)
      console.log(printfoods, 'printfoods')
    } else {
      printfoods = getAllfoods(order.fnAttach, order.isBack)
    }
  } else {
    printfoods = getAllfoods(order.fnChuPrintDetailList)
  }
  //  得到所有的打印机
  var prints = getHouPrint(printInfos, btnObj)
  //  归类食物到指定打印机
  var printList = []
  prints.forEach(function (item) {
    var tmp = Object.assign({}, order, {
      printName: item.name,  //  打印机名称
      printBtn: btnObj.btn, //  点击的按钮
      printTpl: btnObj.tpl, //  要打印的模板
      printTypeName: item.typeName,  //  打印的名称（例如消费单、结账单、）
      pages: []
    })
    if (item.type === 'all') {
      tmp.pages = printfoods
    } else {
      printfoods.forEach(function (pitem) {
        //  真实商品
        if (pitem.restPrintTag) {
          if (pitem.restPrintTag.indexOf(item.type) > -1) {
            tmp.pages.push(pitem)
          }
        } else { // 套餐商品
          if (item.type === pitem.type) {
            tmp.pages.push(pitem)
          }
        }
      })
    }
    if (tmp.pages.length > 0) {
      printList.push(tmp)
    }
  })
  return printList
}

//  检查是否有套餐商品
function getAllfoods (list, isBack) {
  var printList = []
  if (!isBack) {  //  正常商品获取
    list.forEach(function (item) {
      if (item.buyCount < 0) {
        return
      }
      if (item.isMeal && isJSON(item.mealDetail)) {
        var arr = JSON.parse(item.mealDetail)
        arr.forEach(function (mItem) {
          if (mItem.isMain) {
            mItem.attr = item.attr
          }
          mItem.restProName = mItem.name
          mItem.restPrintTag = mItem.type
          mItem.buyCount = mItem.buyCount || 1
          if (item.buyCount > 1) {
            mItem.buyCount = mItem.buyCount * item.buyCount
          }
          printList.push(mItem)
        })
      } else {
        printList.push(item)
      }
    })
  } else { //  退菜商品获取
    list.forEach(function (item) {
      if (item.buyCount > 0 || !item.fnPrintTag) {
        return
      }
      if (item.isMeal && isJSON(item.mealDetail)) {
        var arr = JSON.parse(item.mealDetail)
        arr.forEach(function (mItem) {
          if (mItem.isMain) {
            mItem.attr = item.attr
          }
          mItem.restProName = mItem.name
          mItem.restPrintTag = mItem.type
          mItem.buyCount = mItem.buyCount || 1
          if (item.buyCount) {
            mItem.buyCount = mItem.buyCount * item.buyCount
          }
          printList.push(mItem)
        })
      } else {
        printList.push(item)
      }
    })
  }
  return printList
}

function isJSON (str) {
  if (typeof str === 'string') {
    try {
      var obj = JSON.parse(str)
      console.log(obj)
      if (str.indexOf('{') > -1) {
        return true
      } else {
        return false
      }
    } catch (e) {
      return false
    }
  }
  return false
}
