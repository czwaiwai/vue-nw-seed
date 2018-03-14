<template>
  <el-container class="main">
    <el-header style="height:44px;">
      <div class="grid-x">
        <div class="logo cell small-6">飞常赞餐饮系统 v{{appVersion}} ({{shop.restName}})</div>
        <div class="cell small-6 text-right" style="line-height:44px;">
          <span class="logo_time">{{currentTime}}</span>
          <span class="light fs12 label" style="">{{shopUser.saleName}}[{{shopUser.mobile}}]</span>
          <a @click="exitClickHandler" style="margin:0" class="button small alert" href="javascript:void(0)" >退出系统</a></div>
      </div>
    </el-header>
    <el-container>
      <el-aside class="el-container  is-vertical" width="400px" style="max-width:400px;">
        <div class="food_mode_quick flex_item" style="width:400px;">
          <div class="padding">
            <!--<h5>快餐模式</h5>-->
            <div class="grid-x ">
              <div class="cell small-6 bold">订单：{{activeOrd.vOrderNo}}</div>
              <div class="cell small-6 bold">桌号：{{activeOrd.tableNum}}</div>
            </div>
            <div class="grid-x ">
              <div class="cell small-6">人数：{{activeOrd.restPerson?activeOrd.restPerson+'位':'1位'}}</div>

              <div v-if="activeOrd.isNew" class="cell small-6">下单人：店员</div>
              <div v-else class="cell small-6">下单人：{{activeOrd.assistantOp===1?'店员':'客户'}}</div>
            </div>
            <div class="grid-x ">
              <div class="cell small-6">状态：{{ orderStatus[activeOrd.status]}}</div>
              <div class="cell small-6">支付方式：<span class="fs13">{{payType[activeOrd.payType]}}</span></div>
            </div>
            <div class="grid-x ">
              <div class="cell small-6">下单时间：<span class="fs14">{{activeOrd.buildTime && activeOrd.buildTime.substr(5) }}</span>
              </div>
              <div class="cell small-6 bold">合计：{{activeOrd.fnActPayAmount | currency}}</div>
            </div>
            <div class="grid-x ">
              <div class="cell small-12">发票状态：<span class="fs14">{{invoiceStatus[activeOrd.invoiceStatus] }}</span>
              </div>
            </div>
            <div class="grid-x ">
              <div class="cell small-12">用户备注：<span class="fs14">{{activeOrd.userRemark }}</span>
              </div>
            </div>
          </div>
          <el-table ref="singleTable" size="small" :data="activeOrderData" highlight-current-row
                    @current-change="handleCurrentChange" style="width:400px;">
            <el-table-column property="restProName" label="菜品名称" ></el-table-column>
            <el-table-column property="buyCount" label="数量" width="60"></el-table-column>
            <el-table-column property="perCash" label="单价" width="80"></el-table-column>
            <el-table-column property="amount" label="小计" width="80"></el-table-column>
            <el-table-column  v-if="activeOrd.isNew" label="操作" width="60">
              <template slot-scope="scope">
                <el-button @click.native.prevent="deleteRow(scope.$index, scope.row)" type="danger" size="mini">-</el-button>
              </template>
            </el-table-column>
          </el-table>
        </div>
        <div class="aside-footer ">
          <div  class="flex_box">
            <div class="row ">
              <div>
                <button :disabled="changeAmtDisabled"  @click="changeAmtClickHandler" type="button" class="button  light">改价</button>
                <button :disabled="cancelOrderDisabled" @click="cancelOrder" type="button" class="button light">取消</button>
                <button :disabled="rePrintClickDisabled" @click="rePrintClickHandler" type="button" class="button light">补打</button>
                <!--<button :disabled="printClickDisabled"  @click="printClickHandler" type="button"  class="button light">打印</button>-->
              </div>
              <div>
                <!--<button type="button" class="button light">下行</button>-->
                <button :disabled="backAmtDisabled"  @click="backAmtClickHandler" type="button" class="button light">退单</button>
                <button :disabled="backCaiDisabled"  @click="backCaiClickHandler" type="button" class="button light">退菜</button>
                <button :disabled="clearActiveDisable"  @click="clearActiveOrder" type="button" class="button light">清空</button>
              </div>
            </div>
            <button @click="createOrderHandle" :disabled="createOrderDisabled" class="button  margin5 flex_item fs20 warn " style="max-width:128px;color:#FFF;">下单</button>
          </div>
        </div>
      </el-aside>
      <el-container>
        <div class="unit_header padding15-h">{{$route.meta.title}} {{$dev?$route.path:''}}</div>

        <el-main>
          <!--<div class="scroll_content">-->
          <keep-alive>
            <router-view></router-view>
          </keep-alive>
          <!--</div>-->
        </el-main>
        <el-footer style="height:auto;padding:3px;">
          <div class="grid-container full">
            <div class="grid-x food_buttons">
              <div class="cell small-3">
                <button @click="printedOrderHandler"  type="button" class="button  light expanded  margin5   ">{{isBuffet?'已点订单':'点菜'}}</button>
              </div>
              <div class="cell small-3">
                <button type="button" @click="showHandoverClickHandler" class="button light  expanded  margin5   ">交班</button>
              </div>
              <div class="cell small-3">
                <button type="button" @click="workClickHandler" class="button light   expanded  margin5   ">打卡</button>
              </div>
              <div class="cell small-3">
                <button @click="orderCashHandle" type="button"  class="button orange  expanded   margin5   ">结账</button>
              </div>
              <!--<div class="cell small-2">-->
              <!--<button type="button" class="button  warning expanded  margin5   ">结账</button>-->
              <!--</div>-->
            </div>
            <div class="grid-x food_buttons">
              <div class="cell small-3">
                <button type="button" @click="moreFnClickHandler" class="button  light expanded  margin5   ">其他功能</button>
              </div>
              <div class="cell small-3">
                <button type="button" @click="histOrderHandler" class="button  light  expanded  margin5  ">历史订单</button>
              </div>
              <div class="cell small-3">
                <button type="button" @click="showDayClickHandler" class="button  light expanded  margin5   ">日报</button>
              </div>
              <!--<div class="cell small-3">-->
              <!--<button type="button" @click="workClickRecordHandler" class="button light  expanded  margin5   ">打卡记录</button>-->
              <!--</div>-->
              <div class="cell small-3">
                <button type="button" @click="logoutClickHandle" class="button light  expanded  margin5   ">安全退出</button>
              </div>
            </div>
          </div>
        </el-footer>
      </el-container>
    </el-container>

    <el-dialog title="退菜" :visible.sync="backCaiVisible" width="600px">
      <el-table :data="backCaiList" border height="300" style="width: 100%">
        <el-table-column prop="restProName" label="菜名"></el-table-column>
        <el-table-column label="数量" width="120">
          <template slot-scope="scope">
            <span class="padding-right">{{scope.row.buyCount}}</span>  <span v-show="scope.row.tuiNum" class="alert label">退菜 -{{scope.row.tuiNum}}</span>
          </template>
        </el-table-column>
        <el-table-column label="操作" width="80">
          <template slot-scope="scope">
            <el-button size="mini" :disabled="scope.row.btnDisabled" @click="tuiCaiBtnHandle(scope.$index, scope.row)">退菜</el-button>
          </template>
        </el-table-column>
      </el-table>
      <el-form :model="backCaiForm" :rules="backCaiRules" ref="backCaiForm" label-width="120px">
        <el-form-item label="备注" prop="remark" style="margin-bottom:0;padding-top:15px;">
          <el-autocomplete class="inline-input" v-model="backCaiForm.remark" :fetch-suggestions="suggestBackAmt" placeholder="请填写备注"></el-autocomplete>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="backCaiVisible = false">取 消</el-button>
        <el-button type="primary" :loading="btnLoading" @click="backCaiConfirm('backCaiForm')">确定</el-button>
      </span>
    </el-dialog>

    <el-dialog title="改价" :visible.sync="changeAmtVisible" width="600px">
      <el-form :model="changeAmtForm" :rules="changeAmtRules" ref="changeAmt" label-width="120px">
        <el-form-item label="实际支付金额" prop="adjAmt" placeholder="请填写金额">
          <el-input v-model="changeAmtForm.adjAmt"></el-input>
        </el-form-item>
        <el-form-item label="改价备注" prop="adjRemark" >
          <el-autocomplete class="inline-input" v-model="changeAmtForm.adjRemark" :fetch-suggestions="suggestChangeAmt" placeholder="请填写备注"></el-autocomplete>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="changeAmtVisible = false">取 消</el-button>
        <el-button type="primary" :loading="btnLoading" @click="changeAmtConfirm('changeAmt')">确定</el-button>
      </span>
    </el-dialog>


    <el-dialog title="退单" :visible.sync="backAmtVisible" width="600px" >
      <el-form :model="backAmtForm" :rules="backAmtRules" ref="backAmtForm" label-width="120px">
        <el-form-item label="退款金额" prop="refundAmt">
          <el-input v-model="backAmtForm.refundAmt" placeholder="请填写金额"></el-input>
        </el-form-item>
        <el-form-item label="退款备注" prop="refundRemark">
          <el-autocomplete class="inline-input" v-model="backAmtForm.refundRemark" :fetch-suggestions="suggestBackAmt" placeholder="请填写备注"></el-autocomplete>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="backAmtVisible = false">取 消</el-button>
        <el-button type="primary" :loading="btnLoading" @click="backAmtConfirm('backAmtForm')">确定</el-button>
      </span>
    </el-dialog>


    <el-dialog title="打卡" :visible.sync="workDialogVisible" width="600px">
      <div>
        <el-radio v-model="hitCard" label="1" border>上班打卡</el-radio>
        <el-radio v-model="hitCard" label="2" border>下班打卡</el-radio>
        <el-radio v-model="hitCard" label="3" border>交班打卡</el-radio>
      </div>
      <span slot="footer" class="dialog-footer">
        <el-button @click="workDialogVisible = false">取 消</el-button>
        <el-button type="primary" :loading="btnLoading" @click="hitCardClickHandler">确定</el-button>
      </span>
    </el-dialog>

    <el-dialog title="补打" :visible.sync="rePrintVisible" width="600px">
      <div class="text-center">
        <template v-if="activeOrder && activeOrder.orderType === 'pay'">
          <el-button @click="toSinglePrint(1,'zhiDisBtn','XF')" :loading = 'zhiDisBtn' >支付凭证</el-button>
        </template>
        <template v-else>
          <el-button @click="toSinglePrint(1,'xiaoDisBtn','XF')" :loading = 'xiaoDisBtn' >消费单</el-button>
          <el-button @click="toSinglePrint(2,'jieDisBtn','JZ')" :loading = 'jieDisBtn' >结账单</el-button>
          <el-button v-if="shop.restType!=2" @click="toSinglePrint(3,'chuDisBtn','CD')" :loading = 'chuDisBtn' >厨打单</el-button>
          <template v-if="activeOrder && (activeOrder.invoiceStatus === 0 || activeOrder.invoiceStatus === -1)">
            <!--<el-button @click="sendInvoice()" :loading = 'invoiceBtn' >开发票单</el-button>-->
            <el-button @click="toSinglePrint(4,'invoiceBtn','INV')" :loading = 'invoiceBtn' >开发票单</el-button>
          </template>
        </template>
      </div>
      <span slot="footer" class="dialog-footer">
        <el-button @click="rePrintVisible = false">关闭</el-button>
      </span>
    </el-dialog>

    <el-dialog title="日报预览" :visible.sync="dayDialogVisible" width="600px">
      <div class="day_paper">
        <h5>日报</h5>
        <p>店铺：{{shop.restName}}</p>
        <p>统计日期：{{dateRange[0] | mydate('-') }}</p>
        <!--<p>统计结束日期：{{dateRange[1]}}</p>-->
        <hr/>
        <p>已支付：{{dayPaperData.count}}笔 <span style="float:right">实收金额：{{dayPaperData.actualAmt}}</span></p>
        <hr/>
        <p>现金支付：{{dayPaperData.actOfflpayAmt}}</p>
        <p>线上支付：{{dayPaperData.actBankpayAmt}}</p>
        <p>飞常赞支付：{{dayPaperData.actAcctpayAmt}}</p>
        <hr/>
        <p>此小票为日报，请妥善保管</p>
      </div>
      <span slot="footer" class="dialog-footer">
        <el-button @click="dayDialogVisible = false">取 消</el-button>
        <el-button type="primary"  @click="printDayPaper">打印</el-button>
      </span>
    </el-dialog>


    <el-dialog title="交班单" :visible.sync="handoverDialogVisible" width="600px">
      <div>日期：<label style="display:inline-block">{{ dateRange[0] | mydate('-') }}</label></div>
      <div class="handover">
        <div class="grid-container full">
          <div class="grid-x grid-margin-x">
            <div class="cell small-4"><span class="handover_label">账单数：</span><span class="ho_text">{{dayPaperData.count}}</span></div>
            <div class="cell small-4"><span class="handover_label">消费额：</span><span class="ho_text">{{dayPaperData.totalAmt}}</span></div>
            <div class="cell small-4"><span class="handover_label">优惠券：</span><span class="ho_text">{{dayPaperData.couponAmt}}</span></div>
          </div>
          <div class="grid-x grid-margin-x">
            <div class="cell small-4"><span class="handover_label">改价折扣金额：</span><span class="ho_text">{{dayPaperData.saveAmt}}</span></div>
            <div class="cell small-4"><span class="handover_label">退款金额：</span><span class="ho_text">{{dayPaperData.refundAmt}}</span></div>
            <div class="cell small-4"><span class="handover_label">实收金额：</span><span class="ho_text">{{dayPaperData.actualAmt}}</span>
            </div>
          </div>
          <div class="grid-x grid-margin-x">
            <div class="cell small-4"><span class="handover_label">用餐人数：</span><span class="ho_text">{{dayPaperData.restPerson}}</span></div>
          </div>
        </div>
        <div class="handover_all_amount">
          <span class="handover_label">收款明细（{{dayPaperData.count}}笔)：</span><span class="alert  ho_text" style="color:red;">{{dayPaperData.actualAmt}}</span>
        </div>
      </div>
      <span slot="footer" class="dialog-footer">
        <el-button @click="handoverDialogVisible = false">取 消</el-button>
        <el-button type="primary"  @click="printHandover">打印</el-button>
      </span>
    </el-dialog>

    <el-dialog title="打卡记录" :visible.sync="hitRcodeVisible" width="600px">
      <div class="block">
        <span class="demonstration">日期选择</span>
        <el-date-picker
          v-model="hitDate"
          type="date"
          placeholder="选择日期" @change="hitDateChange">
        </el-date-picker>
      </div>
      <div class="hit_record">
        <el-table   height="250" :data="hitRecordTable">
          <el-table-column type="index"  label="序号" width="50"></el-table-column>
          <el-table-column property="saleName" label="姓名" width="100"></el-table-column>
          <el-table-column property="buildTime" label="打卡时间"></el-table-column>
          <el-table-column property="remark" label="打卡类型"></el-table-column>
        </el-table>
      </div>
      <span slot="footer" class="dialog-footer">
        <el-button @click="hitRcodeVisible = false">关 闭</el-button>
      </span>
    </el-dialog>

    <!--<el-dialog  width="600px" title="现金支付" :visible.sync="cashPayVisible" append-to-body>-->
      <!---->
    <!--</el-dialog>-->
    <el-dialog title="结账" @open="cashOrderOpen"  :close-on-click-modal="false"  :visible.sync="cashOrderVisible" width="700px">
      <el-dialog width="600px"  @open="payStyleOpen"   @close="payStyleClose" :close-on-click-modal="false"  :title="payStyleTitle" :visible.sync="wxPayVisible" append-to-body>
        <div v-loading="wxPayLoading">
          <el-form  label-width="80px" >
            <div class="grid-x">
              <div class="small-6">
                <el-form-item label="支付金额">
                  <el-input readonly v-model="payMoney" ></el-input>
                </el-form-item>
                <el-form-item label="支付码">
                  <el-input  v-if="wxPayVisible" ref="payAuthNoInput" v-model="payAuthNo" ></el-input>
                </el-form-item>
                <el-form-item>
                  <el-button type="primary" @click="onlinePayConfirm">确认支付</el-button>
                  <el-button @click="wxPayVisible=false">取消</el-button>
                </el-form-item>
              </div>
              <div class="small-6 text-right">
                <vir-keyboard mode="bind" v-model="payAuthNo" :input="$refs.payAuthNoInput && $refs.payAuthNoInput.$el.querySelector('input')" style="margin-top:-5px;width:250px;display:inline-block;"></vir-keyboard>
              </div>
            </div>
          </el-form>
        </div>
        <div v-show="wxPayLoading" class="pay_sure_mask"><el-button type="primary" @click="userClickRes">确认收到款项</el-button></div>
      </el-dialog>
      <el-dialog  width="600px" title="折扣率" @open="discountOpen" :visible.sync="discountVisible" append-to-body>
          <div class="grid-x">
            <div class="discount_wrap small-7 text-center padding-right">
              <div class="title">快速选择</div>
              <div class="grid-x grid-margin">
                <div class="small-4">
                  <button type="button" @click="discPercent" data-percent="100" style="height:100px;" class="button   expanded  margin5 ">100%</button>
                </div>
                <div class="small-4">
                  <button type="button" @click="discPercent" data-percent="95"  style="height:100px;" class="button   expanded  margin5 ">95%</button>
                </div>
                <div class="small-4">
                  <button type="button" @click="discPercent" data-percent="90" style="height:100px;" class="button   expanded  margin5 ">90%</button>
                </div>
              </div>
              <div class="grid-x grid-margin">
                <div class="small-4">
                  <button type="button" @click="discPercent" data-percent="88" style="height:100px;" class="button   expanded  margin5 ">88%</button>
                </div>
                <div class="small-4">
                  <button type="button" @click="discPercent" data-percent="85" style="height:100px;" class="button   expanded  margin5 ">85%</button>
                </div>
                <div class="small-4">
                  <button type="button" @click="discPercent" data-percent="70" style="height:100px;" class="button   expanded  margin5 ">70%</button>
                </div>
              </div>
              <div class="grid-x grid-margin">
                <div class="small-4">
                  <button type="button" @click="discPercent" data-percent="65" style="height:100px;" class="button   expanded  margin5 ">65%</button>
                </div>
                <div class="small-4">
                  <button type="button" @click="discPercent" data-percent="60" style="height:100px;" class="button   expanded  margin5 ">60%</button>
                </div>
                <div class="small-4">
                  <button type="button" @click="discPercent" data-percent="50"   style="height:100px;" class="button   expanded  margin5 ">50%</button>
                </div>
              </div>
            </div>
            <div class="small-5">
              <el-form :inline="true"  class="form-inline">
                <el-form-item label="折扣率" class="no-margin">
                  <el-input v-model="discPercentModel" ref="discPercentInput" placeholder="支付金额" style="text-align:right;width:178px;">
                    <template slot="append">%</template>
                  </el-input>
                </el-form-item>
                <div style="margin-top:-5px;" class="padding-bottom15 text-center">
                  <vir-keyboard style="display:inline-block;width:240px;" mode="bind" v-model="discPercentModel" :input="$refs.discPercentInput && $refs.discPercentInput.$el.querySelector('input')"></vir-keyboard></div>
                <el-form-item class="padding-left">
                  <el-button type="primary" @click="discPercent(discPercentModel)">确认</el-button>
                  <el-button type="info" @click="discountVisible=false">取消</el-button>
                </el-form-item>
              </el-form>
            </div>
          </div>
      </el-dialog>

      <div style="margin-top:-15px;" v-loading="payLoading" class="grid-x food_buttons">
        <div v-if="activeOrder" class="cell small-5">
          <p ><span class="inline-block text-right padding-right5"  style="width:70px;">消费额：</span>{{activeOrder.fnActPayAmount | currency}}</p>
          <p class="alert" style="color:red;"><span class="inline-block  text-right padding-right5" style="width:70px;">-整单折：</span>{{ activeOrder.cashMoney | currency}} <span class="padding-left">折扣率：{{ activeOrder.cashDisc }}%</span></p>
          <!--<p class="alert" style="color:red;"><span class="inline-block  text-right padding-right5" style="width:70px;">-折让额：</span>0.75 </p>-->
          <p class="alert" ><span class="inline-block  text-right padding-right5" style="width:70px;">舍入额：</span>{{activeOrder.cashRound | currency}}</p>
          <hr />
          <p>=应收：<span class="bold" style="color:#333;">{{activeOrder.cashNeedPay | currency}}元</span></p>
        </div>
        <div class="cell small-7" style="padding-left: 15px;">
          <div class="grid-x">
            <div class="small-9">
              <el-form :inline="true"  class="form-inline">
                <el-form-item label="支付金额" class="no-margin">
                  <el-input  ref="cashInput"  v-model="payMoney" placeholder="支付金额" style="text-align:right;width:206px;"></el-input>
                </el-form-item>
                <vir-keyboard  mode="bind" v-model="payMoney" :input="$refs.cashInput && $refs.cashInput.$el.querySelector('input')" style="width:280px;"></vir-keyboard>
              </el-form>
              <div style="border-top:1px solid #e3e3e3;margin-top:20px;">
                <div class="text-center" style="margin: 20px 0">
                  <el-button plain @click="$message.info('直接点击结账即为现金收款哦~')">现金</el-button>
                  <el-button @click="wxPayClickHandle" type="success" plain>扫码收款</el-button>
                  <!--<el-button @click="aliPayClickHandle" type="primary" plain>支付宝</el-button>-->
                </div>
              </div>
            </div>
            <div class="small-3">
              <ul class="jie_btn_list" >
                <li><el-button  @click="cashDoneHandle" type="primary">结账</el-button></li>
                <li><el-button  @click="discountHandle">折扣</el-button></li>
                <li><el-button  @click="computeIntHandle">取整</el-button></li>
                <!--<li><el-button  @click="quanHandle" >礼券</el-button></li>-->
                <!--<li><el-button  @click="discountVisible=true">折让</el-button></li>-->
                <!--<li><el-button  @click="discountVisible=true">礼券</el-button></li>-->
                <!--<li><el-button  @click="discountVisible=true">删除</el-button></li>-->
                <!--<li><el-button  @click="discountVisible=true">退款</el-button></li>-->
                <!--<li><el-button  @click="discountVisible=true">会员</el-button></li>-->
                <li><el-button type="info" @click="cashOrderVisible=false" >取消</el-button></li>
              </ul>
            </div>
          </div>
        </div>
          <!--<button type="button" class="button ">现金</button>-->
          <!--<button type="button" class="button ">微信</button>-->
          <!--<button type="button" class="button ">支付宝</button>-->
      </div>
    </el-dialog>
    <!--<el-dialog width="600px" title="登录认证" :visible.sync="loginVisible" append-to-body>-->
      <!--<el-form  label-width="80px" :model="loginForm" :rules="loginFormRules" ref="loginForm" >-->
        <!--<div class="grid-x">-->
          <!--<div class="small-6">-->
            <!--<el-form-item label="账户" prop="mobile">-->
              <!--<el-input  @focus="inputFocus" v-model="loginForm.mobile"></el-input>-->
            <!--</el-form-item>-->
            <!--<el-form-item label="密码" prop="pwd">-->
              <!--<el-input  @focus="inputFocus" v-model="loginForm.pwd"  type="password"></el-input>-->
            <!--</el-form-item>-->
            <!--<el-form-item>-->
              <!--<el-button type="primary" @click="loginConfirm('loginForm')" >确定</el-button>-->
              <!--<el-button @click="loginVisible=false">取消</el-button>-->
            <!--</el-form-item>-->
          <!--</div>-->
          <!--<div class="small-6 text-right">-->
            <!--<vir-keyboard mode="focus" :input="input"  style="margin-top:-5px;width:250px;display:inline-block;"></vir-keyboard>-->
          <!--</div>-->
        <!--</div>-->
      <!--</el-form>-->
    <!--</el-dialog>-->
  </el-container>
</template>
<style rel="stylesheet/scss" type="text/scss" lang="scss">
  .pay_sure_mask{
    position: absolute;
    height: 200px;
    left: 0;
    right: 0;
    top: 40px;
    z-index: 10000;
    text-align: center;
  }
  .discount_wrap{
    .title {
      text-align:left;
      font-weight:bold;
    }
    .small-4 + .small-4 {
      padding-left:5px;
    }
    .small-4> button {
      margin:0 0 5px 0;
    }
  }
  .form-inline .no-margin {
    margin-right:0 !important;
  }
  .form-inline .el-input__inner{
    text-align:right;
  }
  .jie_btn_list{
    list-style:none;
    li {
      margin-bottom:5px;
    }
  }
  .el-dialog .el-input{
    width:200px;
  }
  .unit_header{
    height:34px;
    line-height:34px;
    background:#f0f0f0;
    border:1px solid #e3e3e3;
  }
  .handover {
    font-size: 14px;
    & .handover_label {
      font-weight: bold;
    }
    & .cell {
      padding: 5px;
    }
    & .handover_all_amount {
      border-top: 1px solid #e3e3e3;
      background: #f0f0f0;
      padding: 10px;
    }
  }

  .day_paper {
    padding: 10px;
    border: 1px solid #e3e3e3;
    & hr {
      margin: 10px auto;
    }
    & p {
      margin-bottom: 5px;
    }
  }

  .main {
    height: 100%;

  }

  .logo {
    font-size: 20px;
    color: #FFF;
  }

  .logo_time {
    color: #FFF;
  }

  .food_buttons .cell {
    padding: 0px 3px;
  }

  @media (max-width: 1010px) {
    .food_buttons .button {
      font-size: 13px;
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;
    }
  }

  .aside-footer {
    padding: 5px;
    background: #f0f0f0;
    & .button {
      margin-bottom: 5px;
    }
  }

  .el-header {
    background-color: #252728;
    color: #333;
    line-height: 44px;
  }

  .el-footer {
    background-color: #f0f0f0;
    color: #333;
  }

  .el-aside {
    background-color: #D3DCE6;
    color: #333;

    & .aside-main {
      padding: 0;
    }
  }

  .el-table__header {
    margin-bottom: 0;
  }

  .el-main {
    background-color: #E9EEF3;
    color: #333;
  }
  .order_item.no_pay{
    background:#0E72BF;
    border:2px solid #0E72BF;
  }
  .scroll_content {
    height: 100%;
  }
</style>
<script type="text/ecmascript-6">
  import moment from 'moment'
  import { App } from 'nw.gui'
  import roundTime from '../utils/roundTime'
  import { getLocalPrinters } from '../utils/getLocalPrinters'
  import { mapGetters } from 'vuex'
  import bus from '../utils/bus'
  import scanner from '../utils/scanner'
  import { amount as amountRule, mobile, passWd } from '../utils/elemFormRules'
  import uploadLogs from '../utils/uploadLogs'
  import getConfig from '../utils/getConfig'
  import {clearLogs} from '../utils/clearLogs'
  import {currency} from '../utils/utils'
  let timer
  let now = moment(new Date()).format('YYYY-MM-DD')
  import virKeyboard from '@/components/virKeyboard'
  import loginModal from '@/components/loginModal/'
  import backAmtModal from '../components/backAmtModal/'
  import changeAmtModal from '../components/changeAmtModal/'
  import backVegetablesModal from '../components/backVegetablesModal/'
  import scanPayModal from '../components/scanPayModal/'
  export default{
    data () {
      return {
        test: '123423423',
        appVersion: '',
        btnLoading: false,
        dateRange: [],
        backCaiList: [],  //  退菜List
        isNewPrintState: true, // 正在打印和已打印切换
        dayPaperData: {},
        handoverData: {},
        //  打卡
        hitCard: 0,
        rePrintVisible: false, // 补打显示
        backCaiVisible: false,  //  退菜visible
        hitRcodeVisible: false, //  打卡记录
        workDialogVisible: false,
        handoverDialogVisible: false,
        dayDialogVisible: false, // 日报对话框
        cashOrderVisible: false, // 结账对话框
        wxPayVisible: false, // 微信支付
        cashPayVisible: false, // 现金支付
        discountVisible: false, // 折扣显示

        wxPayLoading: false,
        payLoading: false,
        xiaoDisBtn: false,
        jieDisBtn: false,
        chuDisBtn: false,
        zhiDisBtn: false,
        invoiceBtn: false,

        hitDate: now,
        hitRecordTable: [], // 打卡记录
        currentTime: '',
        now: now,
        payMoney: '',
        input: null, // 虚拟键盘使用
        discPercentModel: '100', //  折扣率默认值
        payStyleTitle: '微信支付', // 标题栏
        payAuthNo: '', // 支付授权框
        //  用户验证
        loginVisible: false, // 登录认证
        loginForm: {
          mobile: '',
          pwd: ''
        },
        loginFormRules: {
          mobile: [
            {required: true, message: '手机号不能为空', trigger: 'blur'},
            {validator: mobile, trigger: 'blur'}
          ],
          pwd: [
            {required: true, message: '密码不能为空', trigger: 'blur'},
            {validator: passWd, trigger: 'blur'}
          ]
        },
        //  改价form
        changeAmtVisible: false,
        changeAmtForm: {
          adjAmt: '',
          adjRemark: ''
        },
        changeAmtRules: {
          adjAmt: [
            {required: true, message: '金额不能为空', trigger: 'blur'},
            {validator: amountRule, trigger: 'blur'}
          ],
          adjRemark: [
            {required: true, message: '备注不能为空', trigger: 'blur'}
          ]
        },
        //  退菜
        backCaiForm: {
          remark: ''
        },
        backCaiRules: {
          remark: [
            {required: true, message: '备注不能为空', trigger: 'blur'}
          ]
        },
        //   退单form
        backAmtVisible: false,
        backAmtForm: {
          id: '',
          refundAmt: '',
          refundRemark: ''
        },
        backAmtRules: {
          refundAmt: [
            {required: true, message: '金额不能为空', trigger: 'blur'},
            {validator: amountRule, trigger: 'blur'}
          ],
          refundRemark: [
            {required: true, message: '备注不能为空', trigger: 'blur'}
          ]
        },
        currentRow: null,
        isMoreFn: false,
        payType: {
          acc: '飞常赞账户支付',
          wx: '微信支付',
          ali: '支付宝支付',
          qq: 'QQ支付',
          offl: '现金支付'
        },
        orderStatus: {
          '-1': '订单已取消',
          '0': '待支付',
          '1': '支付成功',
          '2': '发起支付',
          '3': '支付失败',
          '4': '申请退款',
          '5': '退款成功',
          '7': '已完成',
          '8': '已完成',
          '9': '申请线下支付'
        },
        invoiceStatus: {
          '1': '开票成功',
          '2': '开票失败',
          '3': '开票失败',
          '4': '正在红冲',
          '5': '红冲失败',
          '-1': '红冲成功'
        },
        isCusMode: true,
        isBuffet: true,
        tmpOrder: null,
        tmpData: null
      }
    },
    watch: {
      'printOrders' (newVal, oldVal) {
        if (!newVal || !oldVal) return
        if (newVal.length !== oldVal.length) {
          console.log(newVal, oldVal, '数组变化')
        }
      },
      '$route' (to, from) {
        console.log(to, from, '路由变化')
        if (this.activeOrder) {
          this.$store.commit('clearActiveOrder')
        }
        this.$store.commit('clearOrderList')
      },
      'activeOrder.cashNeedPay' (newVal, oldVal) {
        if (newVal) {
          this.payMoney = newVal + ''
        }
      },
      'payMoney' (newVal) {
        if (newVal && !isNaN(newVal)) {
          this.$store.commit('changeActiveMoney', newVal)
        }
      }
    },
    computed: {
      ...mapGetters({
        'isLogin': 'isLogin',
        'user': 'user',
        'isAuto': 'isAuto',
        'printTpl': 'printTpl',
        'shop': 'shop',
        'shopUser': 'shopUser',
        'shopPrint': 'shopPrint',
        'printOrders': 'printOrders',
        'activeOrder': 'activeOrder',
        'loopTime': 'loopTime'
      }),
      //  ----------------cus页面 start
//      payMoney: {
//        get () {
//          if (this.activeOrder) {
//            return '' + this.activeOrder.fnActPayAmount
//          }
//          return '' + 0
//        },
//        set (val) {
//          return val + ''
//        }
//      },
      //  ----------------cus页面 end
      badgePrint () {
        if (this.printOrders) {
          return this.printOrders.length
        }
        return 0
      },
      isNewPage () {
        return this.$route.name === 'NewOrder'
      },
      isPrintedPage () {
        return this.$route.name === 'PrintedOrder'
      },
      isHistoryPage () {
        return this.$route.name === 'HistoryOrder'
      },
      // 判断是否是点菜页面
      isPointPage () {
        return this.$route.name === 'CusPrintedOrder'
      },
      changeAmtDisabled () {
        return this.disableBtnBy(['onlyChangeAmt', 'payByCash'])
      },
      cancelOrderDisabled () {
        return this.disableBtnBy(['onlyChangeAmt', 'payByCash'])
      },
      createOrderDisabled () {
        if (!this.activeOrder) {
          return true
        } else {
          if (this.activeOrder.isNew) {
            return false
          } else {
            return true
          }
        }
      },
      rePrintClickDisabled () {
        if (this.activeOrder) {
          return false
        }
        return true
      },
      printClickDisabled () {
        if (this.activeOrder) {
          if (!this.activeOrder.isPrint) {
            return false
          }
        }
        return true
      },
      backAmtDisabled () {
        if (this.activeOrder && this.activeOrder.status === 5) {
          return true
        }
        return this.disableBtnBy(['confirmOrder', 'orderDone'])
      },
      backCaiDisabled () {
        if (this.activeOrder && this.activeOrder.orderType === 'pay') {
          return true
        }
        return this.disableBtnBy(['confirmOrder', 'orderDone'])
      },
      clearActiveDisable () {
        if (this.activeOrder) {
          return false
        }
        return true
      },
      confirmBtnDisable () {
        return this.disableBtnBy(['confirmOrder'])
      },
      activeOrderData () {
        if (this.activeOrder) {
          return this.activeOrder.fnAttach
        }
        return []
      },
      activeOrd () {
        if (this.activeOrder) {
          return this.activeOrder
        }
        return {fnAttach: []}
      }
    },
    methods: {
      // ----------cus页面方法start
      // 自动取整
      //  8个参数
//      getStrParam () {
//        let tmp = []
//        this.list.forEach(item =>{
//          let remarkItem = item.remarkItem.replace(';','_')
//          tmp.push(`${item.id};${item.num};${item.guid || 0 };0;0;${item.ruleRemark || ''};;${item.remarkItem || ''}`);
//          if(item.ruleList) {
//            item.ruleList.forEach(sub => {
//              tmp.push(`${sub.id};${sub.num*item.num};0;${item.id};${item.guid};;${sub.fnSubPrintTag || 0};`);
//            })
//          }
//        })
//        return tmp.join('|')
//      },
      // 计算取整
      computeIntHandle () {
        let money = parseFloat(this.payMoney)
        let tmp = currency(money)
        let arr = tmp.match(/\.(\d+)$/)
        if (arr) {
          let mulVal = 10
          if (parseInt(arr[1]) % 10 === 0) {
            mulVal = 1
          }
          this.payMoney = currency(Math.ceil(money * mulVal) / mulVal)
          this.$store.commit('changeActiveMoney', this.payMoney)
        }
      },
      // 剔除添加的商品
      deleteRow (index, item) {
        this.$store.commit('reFoodActiveOrder', item)
      },
      // 计算提交的值
      getCartInfos () {
        let tmp = []
        this.activeOrder.fnAttach.forEach((item) => {
          tmp.push(`${item.id};${item.buyCount};0;0;0;;;`)
        })
        return tmp.join('|')
      },
      createCartInfos () {
        if (!this.activeOrder) return
        let tmp = []
        this.activeOrder.fnAttach.forEach(item => {
          tmp.push(`${item.id};${item.buyCount};0;0;0;;`)
        })
        return tmp.join('|')
      },
      // 仅订单下单
      async orderDown (params) {
        let res = await this.$http.post('/ycRest/doOrder', params)
        console.log('仅订单下单')
        let resData = res.data
        let {order} = resData.data
        this.$store.commit('setActiveOrder', Object.assign({}, this.activeOrder, order, {isNew: false}))
        return order
      },
      // 在线支付
      async orderOnlinePay (params, order) {
        let res = await this.$http.post('/pay/scanPay', params)
        console.log('线上支付成功')
        let resData = res.data
        let {payStatus} = resData.data
        this.tmpData = resData.data
        switch (payStatus) {
          case 1: this.normalSucc(resData.data.restOrder); break
          case 2: this.waitRes(order, resData.data); break
          case 3:
          default: this.errorRes(order, resData.data)
        }
      },
      // 正常成功状态
      normalSucc (order) {
        this.$message.success('下单成功')
        this.cashOrderVisible = false
        this.wxPayVisible = false
        this.$store.commit('clearActiveOrder')
        if (this.isPointPage) {
          this.$store.commit('updateOne', order)
        }
      },
      // 等待支付结果
      waitRes (order, data) {
        data.count = 0
        this.round = roundTime(next => {
          this.$http.get(`/pay/doQueryScanPay?id=${data.id}`).then(res => {
            let resData = res.data
            let {payStatus, payMsg, maxQryCount} = resData.data
            switch (payStatus) {
              case 1:
                next(false)
                this.normalSucc(resData.data.restOrder)
                break
              case 2:
                if (data.count > maxQryCount) {
                  this.wxPayLoading = false
                  this.$message.error('支付超时，重新尝试~')
                  next(false)
                } else {
                  this.$message.warning(payMsg)
                  data.count++
                  next(true)
                }
                break
              default:
                this.errorRes(order, resData.data)
                next(false)
                break
            }
          }).catch(err => {
            console.log(err)
            next(false)
            this.$message.error('网络超时，请重新尝试~')
          })
        }, 3000)
        this.round.start()
      },
      userClickRes () {
        this.$http.post(`/pay/doQueryScanPay`, {id: this.tmpData.id}).then(res => {
          let resData = res.data
          let {payStatus} = resData.data
          if (payStatus === 1) {
            this.round.stop()
            this.round = null
            this.normalSucc(resData.data.restOrder)
          } else if (payStatus === 2) {
            this.$message.warning('还没检测到支付数据，稍等重试')
          } else {
            this.wxPayLoading = false
            this.$message.error('网络超时，请重新尝试~')
            this.round.stop()
            this.round = null
          }
        })
      },
      // 错误支付状态
      errorRes (order, msgObj) {
        this.wxPayLoading = false
        this.$message.error(msgObj.payMsg)
      },
      // 线上支付
      async onlinePayConfirm () {
        if (this.isActiveOrder()) {
          let params = {
            payType: '',
            restShopId: this.shop.id,
            payAmt: this.activeOrder.fnActPayAmount,
            restPerson: '',
            isOfflinePay: 1,
            cartInfos: this.getCartInfos(),
            address: '',
            couponId: '',
            userRemark: '',
            fczPrzAmt: '',
            fczPrzRemark: '',
            dicountAmt: this.activeOrder.cashMoney, // 减免金额
            derateAmt: this.activeOrder.cashRound, // 优惠券金额
            actPayAmt: this.payMoney, // 实付金额
            cashDisc: this.activeOrder.cashDisc, // 折扣率
            doOrderWay: 1,  // 直接付款
            authCode: this.payAuthNo
          }
          this.wxPayLoading = true
          if (this.activeOrder.isNew) {
            try {
              let order = await this.orderDown(params)
              params.orderId = params.refOrderId = order.id
              await this.orderOnlinePay(params, order)
            } catch (e) {
              this.wxPayLoading = false
            }
          } else {
            try {
              params.orderId = params.refOrderId = this.activeOrder.id
              await this.orderOnlinePay(params, this.activeOrder)
            } catch (e) {
              this.wxPayLoading = false
            }
          }
        }
      },
      // 线下付款
      async orderOfflPay (params, order) {
        let res = await this.$http.post('/ycRest/doOfflPay', Object.assign({}, params, {orderId: order.id}))
        let resData = res.data.data
        this.$message.success('下单成功')
        this.cashOrderVisible = false
        this.$store.commit('clearActiveOrder')
        if (this.isPointPage) {
          this.$store.commit('updateOne', resData.order)
        }
      },
      // 线下支付结账 确定线下付款
      async cashDoneHandle () {
        console.log('确定线下付款')
        if (this.isActiveOrder()) {
          if (this.activeOrder.fnAttach && this.activeOrder.fnAttach === 0) {
            return this.$message.warning('当前订单中没有商品')
          }
          if (!this.payMoney) {
            return this.$message.warning('支付金额不能为空')
          }
          let action = await this.$confirm('确定已收到现金款', '提示')
          if (action === 'confirm') {
            let params = {
              payType: 'offl',
              restShopId: this.shop.id,
              payAmt: this.activeOrder.fnActPayAmount,
              restPerson: '',
              isOfflinePay: 1,
              cartInfos: this.getCartInfos(),
              address: '',
              couponId: '',
              userRemark: '',
              fczPrzAmt: '',
              fczPrzRemark: '',
              dicountAmt: this.activeOrder.cashMoney, // 减免金额
              derateAmt: this.activeOrder.cashRound, // 优惠券金额
              actPayAmt: this.payMoney, // 实付金额
              cashDisc: this.activeOrder.cashDisc // 折扣率
            }
            this.payLoading = true
            if (this.activeOrder.isNew) {
              try {
                let order = await this.orderDown(params)
                await this.orderOfflPay(params, order)
                this.payLoading = false
              } catch (e) {
                this.payLoading = false
              }
            } else {
              try {
                await this.orderOfflPay(params, this.activeOrder)
                this.payLoading = false
              } catch (e) {
                this.payLoading = false
              }
            }
          }
        }
//        console.log(this.activeOrder)
      },
      inputFocus (e) {
        this.input = e.target
      },
      async discPercent (e) {
        let percent
        if (typeof e === 'string') {
          percent = e
        } else {
          percent = e.target.dataset.percent
        }
        if (percent) {
          percent = parseInt(percent)
          if (percent > 100) {
            return this.$message.error('请输入100以内的数字')
          }
          if (percent < 100) {
            await this.$confirm('当前折扣需要更高权限认证')
            let res = await loginModal()
            try {
              let resVal = await this.$http.post('/ycRest/validateRight', res)
              this.$store.commit('setActiveDiscount', percent)
              this.discountVisible = false
              console.log('验证结果', resVal)
            } catch (e) {
              console.log(e)
            }
            return
          }
          this.$store.commit('setActiveDiscount', percent)
          this.discountVisible = false
        }
      },
//      loginConfirm (formName) {
//        console.log('-----------------------登录验证确认')
//        this.$refs[formName].validate(valid => {
//          if (valid) {
//            console.log(valid)
//            this.loginVisible = false
//            this.callback && this.callback()
//            this.callback = null
//          }
//        })
//      },
      // 结账
      orderCashHandle () {
        console.log('结账---------')
        if (this.isActiveOrder()) {
          // 新订单
//          if (this.activeOrder.status === 1) {
//            return this.$message.warning('该订单已支付完成了！')
//          }
          if (this.activeOrder.isNew || [0, 9].indexOf(this.activeOrder.status) > -1) {
            if (this.activeOrder.fnAttach && this.activeOrder.fnAttach.length === 0) {
              return this.$message.warning('你还没有添加菜品')
            }
            this.$store.commit('setActiveOrderInfo', {
              cashDisc: 100,
              cashMoney: 0,
              cashRound: 0,
              cashNeedPay: this.activeOrder.fnActPayAmount
            })
            this.cashOrderVisible = true
          } else {
            this.$message.warning('该订单已支付完成了！')
          }
        }
      },
      cashOrderOpen () {
        setTimeout(() => {
          let el = this.$refs.cashInput && this.$refs.cashInput.$el.querySelector('input')
          el.focus()
          el.select()
        }, 300)
      },
      // 折扣率
      discountOpen () {
        setTimeout(() => {
          let el = this.$refs.discPercentInput && this.$refs.discPercentInput.$el.querySelector('input')
          el.focus()
          el.select()
        }, 300)
      },
      discountHandle () {
        this.discountVisible = true
      },
      // 支付方式打开
      payStyleOpen () {
        this.payAuthNo = ''
        setTimeout(() => {
          let el = this.$refs.payAuthNoInput && this.$refs.payAuthNoInput.$el.querySelector('input')
          el.focus()
        }, 300)
      },
      // 支付方式关闭
      payStyleClose () {
        this.wxPayLoading = false
        this.round && this.round.stop()
        this.round = null
      },
      async wxPayClickHandle (title) {
        let self = this
        if (this.activeOrder && this.payMoney) {
//          this.wxPayVisible = true
          this.payStyleTitle = '扫码收款'
          if (typeof title === 'string') {
            this.payStyleTitle = title
          }
          let order = await scanPayModal({
            shopId: this.shop.id,
            payStyleTitle: this.payStyleTitle,
            payAmt: this.payMoney,
            activeOrder: this.activeOrder,
            cartInfos: this.getCartInfos(),
            onClose: function (isChange) {
              if (isChange) {
                self.wxPayVisible = true
              }
            }
          })
          this.cashOrderVisible = false
          this.$message.success('下单成功')
          this.$store.commit('clearActiveOrder')
          if (this.isPointPage) {
            this.$store.commit('updateOne', order)
          }
        } else {
          this.$message.warning('支付金额不能为空')
        }
      },
//      aliPayClickHandle () {
//        if (this.activeOrder && this.payMoney) {
//          this.wxPayClickHandle('支付宝支付')
//        } else {
//          this.$message.warning('支付金额不能为空')
//        }
//      },
      // 下单
      createOrderHandle () {
        console.log('下单')
        if (this.isActiveOrder()) {
          let params = {
            payType: 'offl',
            userRemark: '',
            restShopId: this.shop.id,
            payAmt: this.activeOrder.fnActPayAmount,
            restPerson: '',
            isOfflinePay: 0,
            address: '',
            tableId: 86,
            cartInfos: this.createCartInfos(),
            couponId: '',
            fczPrzAmt: '',
            fczPrzRemark: ''
//            doOrderWay: 0 // 代表仅仅下单
          }
          this.$http.post('/ycRest/doOrder', params).then(res => {
            let resData = res.data
            let {order} = resData.data
            this.$message.success(resData.retMsg)
            this.$store.commit('clearActiveOrder', order)
          })
        }
      },
      // ----------cus页面方法end
      // 获取扫描结果及处理
//      scanerRes (str, done) {
//        console.log('扫描结果:', str)
//        console.log(str, '支付码通常为18位可以在这里开启验证')
//        // if (/^\d{18}$/.test(str)) { // console.log('数字18位')
//        this.payLoading = true
//        this.$http.post('http://localhost:8081/pay', {str: str}).then(res => {
//          console.log(res)
//          this.payLoading = false
//          this.cashOrderVisible = false
//          this.closePay()
//          this.$message.success('支付成功')
//          done()
//        }).catch(() => {
//          this.payLoading = false
//          done()
//        })
//      },
      disableBtnBy (arr) {
        if (this.activeOrder) {
          if (arr.indexOf(this.activeOrder.btnStatus) > -1) {
            return false
          }
        }
        return true
      },
      exitClickHandler () {
        this.$confirm('你确定要退出系统么', '提示').then(() => {
          App.quit()
        })
      },
      // 已打印订单
      printedOrderHandler () {
        if (this.isBuffet) {
          this.$router.replace({name: 'CusPrintedOrder'})
          this.isBuffet = false
//          if (this.$route.name === 'BuffetMode') {
//            this.$router.replace({name: 'CusPrintedOrder'})
//          }
        } else {
          this.$router.replace({name: 'CusBuffetMode'})
          this.isBuffet = true
        }
      },
      // 历史订单
      histOrderHandler () {
        this.$router.replace({name: 'CusHistoryOrder'})
      },
      isActiveOrder () {
        if (!this.activeOrder) {
          this.$message({
            message: '请选择订单',
            type: 'warning'
          })
          return false
        }
        return true
      },
      //  手动打印
      printClickHandler () {
        console.log('手动打印', this.activeOrder)
        if (this.isActiveOrder()) {
          this.activeOrder.params = {
            isHand: true
          }
          this.printService.add(this.activeOrder)
        }
      },
      //  显示补打
      rePrintClickHandler () {
        console.log('-----------------------显示补打')
        if (this.isActiveOrder()) {
          this.tmpOrder = Object.assign({}, this.activeOrder)
          this.rePrintVisible = true
        }
      },
      // 手动补打
      toSinglePrint (type, btnName, newType) {
        this[btnName] = true
        let order = Object.assign({}, this.tmpOrder, {printSingleType: newType})
        console.log('手动补打', btnName)
        this.printService.add(order)
        setTimeout(() => {
          this[btnName] = false
        }, 1500)
      },
      // 手动打印开发票单
//      sendInvoice () {
//        if (this.isActiveOrder()) {
//          let id = this.activeOrder.id
//          this.invoiceBtn = true
//          this.$http.post('/rest/applyInvoice', {restOrderId: id}).then(function () {
//            setTimeout(() => {
//              this.invoiceBtn = false
//              this.$message.success('发票信息已经发送至打印机')
//            }, 1000)
//          }).catch(e => {
//            this.invoiceBtn = false
//          })
//        }
//      },
      rePrintConfirmHandler () {
        this.rePrintVisible = false
      },
      //  确认订单完成
      confirmOrderFinishHandler () {
        console.log('-----------------------确认订单完成')
        if (this.isActiveOrder()) {
          if (!this.activeOrder.isPrint) {
            return this.$message({message: '当前订单还未打印', type: 'warn'})
          }
          let params = {
            id: this.activeOrder.id
          }
          this.$confirm('确认订单已处理完成', '提示', {
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            type: 'info '
          }).then(() => {
            return this.$http.post('/ycRest/checkDishes', params).then(res => {
              let resData = res.data
              console.log(resData)
//              this.$store.commit('removeActiveOrder')
              this.$store.commit('removeActiveOrderMap')
              if (!this.isNewPage) {
                this.$store.commit('removeOneById', params.id)
              }
              this.$message({
                message: '订单确认成功',
                type: 'success'
              })
            })
          }).catch((res) => {})
        }
      },
      //  确定线下收款
      confirmPayCashHandler () {
        console.log('-----------------------确定线下收款')
        if (this.isActiveOrder()) {
          this.$confirm('确认线下收款' + this.activeOrder.fnActPayAmount + '元', '提示', {
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            type: 'info '
          }).then(() => {
            let params = {
              id: this.activeOrder.id,
              adjOpuser: this.shopUser.saleId,
              offlinePayAmt: this.activeOrder.fnActPayAmount
            }
            this.$http.post('/ycRest/newConfirmOfflinePay', params).then(res => {
              let resData = res.data
              let {restOrder} = resData.data
              this.$store.dispatch('setAndRemoreActive', {order: restOrder}).then((newOrder) => {
                if (!newOrder.isPrint) {
//                  this.printService.add(newOrder)
                } else {
                  this.$store.commit('clearActiveOrder')
                }
                if (!this.isNewPage) {
                  this.$store.commit('updateOne', newOrder)
                }
                this.$message({
                  message: '线下收款成功',
                  type: 'success'
                })
              })
            })
          }).catch(() => {})
        }
      },
      //  取消订单
      cancelOrder () {
        console.log('-----------------------取消订单')
        if (this.isActiveOrder()) {
          let id = this.activeOrder.id
          if (this.activeOrder.status !== 9) {
            return this.$message({
              message: '只有未收款订单可以取消订单',
              type: 'warning'
            })
          }
          this.$confirm('你确定要取消订单吗', '提示', {
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            type: 'warning'
          }).then(() => {
            this.$http.post('/ycRest/cancelRestOrder', {id: id}).then(res => {
              let resData = res.data
              let {restOrder} = resData.data
//              this.$store.commit('removeActiveOrder')
              this.$store.commit('removeActiveOrderMap')
              if (!this.isNewPage) {
                this.$store.commit('removeOneById', id)
              }
              this.$message({
                message: '取消订单成功',
                type: 'success'
              })
              this.$store.dispatch('orderCancel', {order: restOrder}).then(newOrder => {
//                if (newOrder.isPrint) {
//                  this.printService.add(newOrder)
//                }
              })
            }).catch(err => {
              console.error('取消订单操作报错', err)
            })
          }).catch(() => {})
        }
      },
      //  清空activeOrder
      clearActiveOrder () {
        this.$store.commit('clearActiveOrder')
      },
      //  改价备注建议
      suggestChangeAmt (queryStr, cb) {
        cb([
          {'value': '员工打折'},
          {'value': '活动优惠'},
          {'value': '产品质量问题'},
          {'value': '系统测试'}
        ])
      },
      suggestBackAmt (queryStr, cb) {
        cb([
          {'value': '员工折让'},
          {'value': '产品质量'},
          {'value': '顾客更换产品'},
          {'value': '产品售完'},
          {'value': '顾客赶时间退餐品'},
          {'value': '测试订单'}
        ])
      },
      setCurrent (row) {
        this.$refs.singleTable.setCurrentRow(row)
      },
      //   上班打卡
      workClickHandler () {
        this.hitCard = 0
        this.workDialogVisible = true
        this.btnLoading = false
      },
      hitCardClickHandler () {
        console.log('-----------------------打卡')
        if (!this.hitCard) {
          return this.$message.warning('请选择你要打的卡')
        }
        this.btnLoading = true
        this.$http.post('/ycRest/assistantSign', {signType: this.hitCard}).then((res) => {
          this.btnLoading = false
          this.$message({
            message: '你已打卡成功',
            type: 'success'
          })
          this.workDialogVisible = false
        }).catch(() => {
          this.btnLoading = false
        })
      },
      //  上班打卡记录
      workClickRecordHandler (e) {
        //  /ycRest/assistantSignRecord
        console.log('-----------------------上班打卡记录')
        this.hitDate = now
        if (typeof e === 'string') {
          this.hitDate = e
        }
        this.$http.post('/ycRest/assistantSignRecord', {buildTime: this.hitDate}).then(res => {
          this.hitRcodeVisible = true
          let resData = res.data
          this.hitRecordTable = resData.data
        })
      },

      hitDateChange (val) {
        let curr = moment(val).format('YYYY-MM-DD')
        this.workClickRecordHandler(curr)
      },
      handleCurrentChange (val) {
        console.log('选中', val)
        this.currentRow = val
      },
      // 改价显示
      changeAmtClickHandler () {
        console.log('-----------------------改价显示')
        if (this.isActiveOrder()) {
          changeAmtModal({
            shopAuth: this.shop.refundNeedRight,
            form: {
              id: this.activeOrder.id,
              adjOpuser: this.shopUser.saleId,
              adjAmt: this.activeOrder.fnActPayAmount,
              adjRemark: ''
            }
          }).then(restOrder => {
            this.$message.success('改价成功')
            this.$store.commit('setActiveOrder', restOrder)
            this.$store.dispatch('isExsitPirntOrder', {order: restOrder}).then((bool) => {
              console.log(bool, '哈哈哈')
              if (bool) {
                this.$store.commit('updatePrintOrderMap', restOrder)
              }
              if (!this.isNewPage) {
                console.log('不是当前newOrder页面更新订单状态')
                this.$store.commit('updateOne', restOrder)
              }
            })
          })
        }
      },
      changeAmtConfirm (formName) {
        console.log('-----------------------确认改价')
        this.$refs[formName].validate(valid => {
          if (valid) {
            this.btnLoading = true
            let params = Object.assign({id: this.tmpOrder.id, adjOpuser: this.shopUser.saleId}, this.changeAmtForm)
            this.$http.post('/ycRest/correctAmout', params).then((res) => {
              this.btnLoading = false
              let resData = res.data
              let {restOrder} = resData.data
              this.$message.success('改价成功')
              this.$store.commit('setActiveOrder', restOrder)
              this.$store.dispatch('isExsitPirntOrder', {order: restOrder}).then((bool) => {
                console.log(bool, '哈哈哈')
                if (bool) {
//                  this.$store.commit('updatePrintOrder', restOrder)
                  this.$store.commit('updatePrintOrderMap', restOrder)
                }
                if (!this.isNewPage) {
                  console.log('不是当前newOrder页面更新订单状态')
                  this.$store.commit('updateOne', restOrder)
                }
              })
              this.changeAmtVisible = false
            }).catch(() => {
              this.btnLoading = false
            })
          }
        })
      },
      // 退单显示
      backAmtClickHandler () {
        console.log('-----------------------退单显示')
        if (this.isActiveOrder()) {
          backAmtModal({
            shopAuth: this.shop.refundNeedRight,
            form: {
              id: this.activeOrder.id,
              refundAmt: currency(this.activeOrder.fnActPayAmount)
            }
          }).then(restOrder => {
            this.$store.dispatch('orderBack', {order: restOrder}).then(newOrder => {
              if (this.isPrintedPage) {
                this.$store.commit('removeOne', newOrder)
              }
              if (this.isHistoryPage) {
                this.$store.commit('updateOne', newOrder)
              }
            })
          })
        }
      },
      backAmtConfirm (formName) {
        console.log('-----------------------退单确认')
        this.$refs[formName].validate(valid => {
          if (valid) {
            this.btnLoading = true
            this.$http.post('/ycRest/refundRestOrder', this.backAmtForm).then((res) => {
              this.btnLoading = false
              let resData = res.data
              let {restOrder} = resData.data
              this.$store.dispatch('orderBack', {order: restOrder}).then(newOrder => {
                this.backAmtVisible = false
//                if (newOrder.isPrint) {
//                  newOrder.refundDetailIds = refundDetailIds
//                  this.printService.add(newOrder)
//                }
                if (this.isPrintedPage || this.isPointPage) {
                  this.$store.commit('removeOne', newOrder)
                }
                if (this.isHistoryPage) {
                  this.$store.commit('updateOne', newOrder)
                }
              })
            }, err => {
              console.log(err)
              this.btnLoading = false
            })
          }
        })
      },
      //  退菜显示
      async backCaiClickHandler () {
        console.log('-----------------------退菜')
        if (this.isActiveOrder()) {
          this.backCaiForm = {
            detailInfos: '',
            remark: ''
          }
          this.btnLoading = false
          let res = await this.$http.post('/ycRest/getRestOrderRefundData', {orderId: this.activeOrder.id})
          let resData = res.data
          let {detailList} = resData.data
          detailList.forEach(item => {
            item.tuiNum = 0
            if (item.buyCount === 0) {
              item.btnDisabled = true
            } else {
              item.btnDisabled = false
            }
          })
          console.log('---------await-------------------')
          let {restOrder, isAllRefund} = await backVegetablesModal({
            form: {
              detailInfos: '',
              remark: ''
            },
            list: detailList,
            shopAuth: this.shop.refundNeedRight
          })
          this.$store.dispatch('orderBack', {order: restOrder}).then(newOrder => {
            this.$message({
              message: '退菜成功',
              type: 'success'
            })
            if (this.isPrintedPage && isAllRefund) {
              this.$store.commit('removeOne', newOrder)
            } else {
              this.$store.commit('updateOne', newOrder)
            }
          })
        }
      },
      tuiCaiBtnHandle (index, item) {
        item.tuiNum ++
        if (item.tuiNum === item.buyCount) {
          item.btnDisabled = true
        }
      },
      backCaiConfirm (formName) {
        console.log('-----------------------退菜确定')
        this.$refs[formName].validate(valid => {
          if (valid) {
            this.btnLoading = true
            let tuiArr = this.backCaiList.map(item => {
              if (item.tuiNum) {
                return item.id + ';' + item.tuiNum
              }
            })
            this.backCaiForm.detailInfos = tuiArr.join('|')
            if (!this.backCaiForm.detailInfos) {
              return this.$message.error('请选择要退的菜品')
            }
            this.$http.post('/ycRest/retreatFood', this.backCaiForm).then(res => {
              this.btnLoading = false
              let resData = res.data
              let {restOrder, isAllRefund} = resData.data
              this.$store.dispatch('orderBack', {order: restOrder}).then(newOrder => {
                this.backCaiVisible = false
                this.$message({
                  message: '退菜成功',
                  type: 'success'
                })
//                if (newOrder.isPrint) {
//                  newOrder.refundDetailIds = refundDetailIds
//                  this.printService.add(newOrder)
//                }
                if ((this.isPrintedPage && isAllRefund) || (this.isPointPage && isAllRefund)) {
                  this.$store.commit('removeOne', newOrder)
                } else {
                  this.$store.commit('updateOne', newOrder)
                }
              })
            }).catch(() => {
              this.btnLoading = false
            })
          }
        })
      },
      //  日报显示
      showDayClickHandler () {
        console.log('-----------------------日报显示')
//        this.$http.post('http://localhost:8081/ycRest/countProSaleData', {restShopId: this.shop.id, returnType: 1, exchangeType: 3}).then(res => {
        this.$http.post('/ycRest/countProSaleData', {restShopId: this.shop.id, returnType: 1, exchangeType: 3}).then(res => {
          this.dayDialogVisible = true
          let resData = res.data
          let {data, saleBeginTime, saleEndTime, printList} = resData.data
          this.dateRange = [saleBeginTime, saleEndTime]
          this.tmpPrintList = printList
          data.saleBeginTime = saleBeginTime
          data.saleEndTime = saleEndTime
          this.dayPaperData = data
          console.log(resData, '日报--------', data)
        })
      },
      dayPaperChange (e) {
        console.log('-----------------------日报修改日期')
        let saleBeginTime = moment(this.dateRange[0]).format('YYYY-MM-DD HH:mm:ss')
        let saleEndTime = moment(this.dateRange[1]).format('YYYY-MM-DD HH:mm:ss')
        this.$http.post('/ycRest/countProSaleData', {saleBeginTime, saleEndTime, returnType: 1, restShopId: this.shop.id}).then(res => {
          let resData = res.data
          let {data, saleBeginTime, saleEndTime, printList} = resData.data
          this.dateRange = [saleBeginTime, saleEndTime]
          data.saleBeginTime = saleBeginTime
          data.saleEndTime = saleEndTime
          this.tmpPrintList = printList
          this.dayPaperData = data
        })
      },
      printDayPaper () {
        console.log('-----------------------打印日报')
        console.log(bus)
//        let dayPaperData = Object.assign({tplName: 'dayPaper', restName: this.shop.restName}, {isOnlyTpl: true, printList: this.tmpPrintList})
//        this.printService.add(dayPaperData)
        this.$store.dispatch('addPrintObj', {printList: this.tmpPrintList})
        this.dayDialogVisible = false
      },
      //  交办单日期变更
      handoverChange () {
        console.log('-----------------------交办单日期变更')
        let saleBeginTime = moment(this.dateRange[0]).format('YYYY-MM-DD HH:mm:ss')
        let saleEndTime = moment(this.dateRange[1]).format('YYYY-MM-DD HH:mm:ss')
        this.$http.post('/ycRest/countProSaleData', {saleBeginTime, saleEndTime, restShopId: this.shop.id}).then(res => {
          this.handoverDialogVisible = true
          let resData = res.data
          let {data, saleBeginTime, saleEndTime, printList} = resData.data
          this.dateRange = [saleBeginTime, saleEndTime]
          data.saleBeginTime = saleBeginTime
          data.saleEndTime = saleEndTime
          this.dayPaperData = data
          this.tmpPrintList = printList
          this.handoverData = resData.data
        })
      },
      //  交办单显示
      showHandoverClickHandler () {
        console.log('-----------------------交办单显示')
        this.$http.post('/ycRest/countProSaleData', {restShopId: this.shop.id, exchangeType: 3}).then(res => {
          this.handoverDialogVisible = true
          let resData = res.data
          let {data, saleBeginTime, saleEndTime, printList} = resData.data
          this.dateRange = [saleBeginTime, saleEndTime]
          data.saleBeginTime = saleBeginTime
          data.saleEndTime = saleEndTime
          this.dayPaperData = data
          this.tmpPrintList = printList
          this.handoverData = resData.data
        })
      },
      printHandover () {
        console.log('-----------------------打印交班单')
//        let handoverData = Object.assign({tplName: 'handover', restName: this.shop.restName}, this.handoverData)
//        this.printService.add(handoverData)
        this.$store.dispatch('addPrintObj', {printList: this.tmpPrintList})
        this.handoverDialogVisible = false
        this.btnLoading = false
        console.log('打印交班单')
      },
      moreFnClickHandler () {
        if (this.$route.path === '/mainCus/otherFn') {
          this.isMoreFn = false
          this.$router.back()
        } else {
          this.isMoreFn = true
          this.$router.push({name: 'CusOtherFn'})
        }
      },
      logoutClickHandle () {
        console.log('-----------------------退出登录')
        this.$confirm('你确定要切换账号么', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          clearLogs()
          this.$http.post('/doLogout').then((res) => {
            if (res.data.retCode === 0) {
              this.$store.dispatch('logoutAction').then(() => {
                this.$router.replace({name: 'Login'})
              })
            }
          })
        }).catch(() => {})
      },
      upLogs (date) {
        console.log('-----------------------拉取日志')
        if (date) {
          uploadLogs(this, this.shop.id, date)
        }
      },
      upStatus (content, title) {
        this.$http.post('/feeback/save', {
          title: title || '查看内容',
          content: content
        })
      }
    },
    components: {
      virKeyboard
    },
    created () {
      let self = this

      getConfig.then((json) => {
        this.appVersion = json.version
      })
      this.scan = scanner(this.scanerRes)
      this.$store.commit('printInit', {
        vue: this,
        shop: this.shop,
        shopPrint: this.shopPrint,
        user: this.user
      })
      this.printService = this.$store.getters.printService
      this.printService.setUser(this.user)
      this.printService.listen({
        start () {
          console.log('----------打印已经开始了---------------')
        },
        before (obj) {
          console.log(obj)
          if (obj.isOrder) {
            console.log('--------正在开始打印的订单Obj:', obj.id, '------------')
            console.log('--------', obj && obj.vOrderNo, '--------------')
          } else {
            console.log('--------普通打印')
          }
        },
        after (obj) {
          if (obj.isOrder) {
            try {
              if (obj.isAutoChange) {
                self.$store.commit('clearActiveOrder')
              }
              self.$store.commit('setFinshPrintOrder', obj)
//              self.$store.commit('removeOrder', obj)
              self.$store.commit('removeOrderMap', obj)
            } catch (e) {
              console.log(e)
            }
            console.log('---------------------结束打印的订单Obj:', obj.id)
            console.log('---------------------', obj && obj.vOrderNo)
          } else {
            console.log('正在进行普通打印')
          }
        },
        error (err, obj, next) {
          console.error(err, '错误：打印机的时候报错了赶紧来看看')
          console.log(obj)
          let vNo = ''
          if (obj.isOrder) {
            vNo = '订单：' + obj.vOrderNo
          }
          self.$confirm(vNo + '打印出错是否继续', '提示', {
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            closeOnClickModal: false,
            type: 'warning'
          }).then(() => {
            console.log('店员点击了true' + vNo)
            next(true) // 为轮询是否就继续
          }).catch(() => {
            console.log('店员点击了false' + vNo)
            next(false)
          })
          self.$http.post('/feeback/save', {
            title: '打印回调内错误',
            content: '出现的错误：' + JSON.stringify(err) + '错误对象' + JSON.stringify(obj)
          })
        },
        //  这个对象放弃打印
        giveup (obj) {
          console.log('错误：----------这个订单被放弃了:', obj.id)
        },
        done () {
          console.log('-----------打印已经完成--------------')
        }
      })
      console.log(this.printService, 'printService')
      console.log('getLocalPrinters()', getLocalPrinters())

      timer = setInterval(() => {
        this.currentTime = moment().format('YYYY年MM月DD日 HH:mm:ss')
      }, 1000)
    },
    destroyed () {
      if (this.round) {
        console.log(this.round, 'stop---执行')
        this.round.stop()
      }
      timer && clearInterval(timer)
    }
  }
</script>
