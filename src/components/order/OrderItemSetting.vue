<template>
    <div>
        <!-- 面包屑导航区域 -->
        <el-breadcrumb separator-class="el-icon-arrow-right">
          <el-breadcrumb-item :to="{ path: '/static/home' }">首页</el-breadcrumb-item>
          <el-breadcrumb-item>订单管理</el-breadcrumb-item>
          <el-breadcrumb-item :to="{ path: '/static/orders' }">订单列表</el-breadcrumb-item>
          <el-breadcrumb-item>订单操作</el-breadcrumb-item>
        </el-breadcrumb>

        <!-- 卡片视图 -->
        <el-card>
          <el-divider content-position="left">订单综合信息</el-divider>

          <el-table :data='[orderForm]'>
            <el-table-column label="检索 ID" prop="o_UniqSearchID" width="210"></el-table-column>
            <el-table-column label="餐桌" prop="t_Name"></el-table-column>
            <el-table-column label="餐桌分类" prop="TT_Name"></el-table-column>
            <el-table-column label="用餐人数" prop="o_NumberOfDiners"></el-table-column>
            <el-table-column label="金额 (元)" prop="o_TotlePrice"></el-table-column>
            <el-table-column label="支付状态">
              <!-- 修改成tag -->
              <template slot-scope="scope">
                <el-tag v-if="scope.row.o_PayStatue == 0" type="danger">未支付</el-tag>
                <el-tag v-if="scope.row.o_PayStatue == 1" type="primary">已完成</el-tag>
                <el-tag v-if="scope.row.o_PayStatue == 2 && scope.row.o_TotlePrice == 0" type="warning">全额退款</el-tag>
                <el-tag v-if="scope.row.o_PayStatue == 2 && scope.row.o_TotlePrice != 0" type="warning">部分退款</el-tag>
                <el-tag v-if="scope.row.o_PayStatue == 3" type="info">未完成</el-tag>
              </template>
            </el-table-column>
            <el-table-column label="下单时间" prop="o_OrderingTime" width="230"></el-table-column>
            <el-table-column label="支付时间" prop="o_PayTime" width="230"></el-table-column>
            <el-table-column label="备注">
                <template slot-scope="scope">
                  <el-popover
                    placement="top-start"
                    title="客人备注"
                    width="200"
                    trigger="click"
                    :content="scope.row.o_Remarks==''?'客人没有特殊要求':scope.row.o_Remarks">
                    <el-button size="mini" type="info" slot="reference" plain>备注</el-button>
                  </el-popover>
                </template>
              </el-table-column>
          </el-table>

          <el-divider content-position="left">订单操作区域</el-divider>

          <el-row :gutter="20" type="flex">
            <el-col :span="2" :lg="3" :md="3" :sm="3" :xs="3">
              <el-button type="primary" v-print="'#printST'">打印客人小票</el-button>
            </el-col>
            <el-col :span="2" :lg="3" :md="3" :sm="3" :xs="3">
              <el-button type="primary" v-print="'#printKT'">打印厨房餐票</el-button>
            </el-col>
            <el-col :span="2" :lg="3" :md="3" :sm="3" :xs="3">
              <el-button type="primary" v-print="'#printMT'">打印餐厅底票</el-button>
            </el-col>
            <el-col :span="2.1" :lg="3.1" :md="3.1" :sm="3.1" :xs="3.1">
              <el-button :disabled="OrderFiDisAble" type="warning" @click="orderFiUnderLine">订单线下支付完成</el-button>
            </el-col>
            <el-col :span="2" :lg="3" :md="3" :sm="3" :xs="3">
              <el-button :disabled="OrderNotFiDisAble" type="warning" @click="orderNotFiUnderLine">订单未完成</el-button>
            </el-col>
            <el-col :span="3" :lg="4" :md="4" :sm="4" :xs="4">
              <el-button :disabled="OrderReturnDisAble" type="danger" @click="returnGoodWithMoney">退 款</el-button>
            </el-col>
            <el-col :span="3" :lg="4" :md="4" :sm="4" :xs="4">
              <el-button :disabled="OrderReturnWithOutMoneyDisAble" type="danger" @click="onlyReturnGood">仅退餐品</el-button>
            </el-col>
          </el-row>

          <el-divider content-position="left">订单综合详情</el-divider>

          <el-table :data="orderDetailForm" :border="false" :stripe="false">
            <el-table-column type="index"></el-table-column>
            <el-table-column label="菜品名称" prop="name"></el-table-column>
            <el-table-column label="价格（元）" prop="price"></el-table-column>
            <el-table-column label="规格">
              <template slot-scope="specs">
                <el-tag type="warning" size="mini" v-if="specs.row.specs">{{specs.row.specs}}</el-tag>
              </template>
            </el-table-column>
            <el-table-column label="属性">
              <template slot-scope="property"  v-if="property.row.property[0] != ''">
                <span v-for="item in property.row.property" :key="item" class="propertySpan">
                  <el-tag type="success" size="mini" v-if="item != ''">{{item}}</el-tag>
                </span>
              </template>
            </el-table-column>
            <el-table-column label="实际数量 (份)" prop="OD_RealNum"></el-table-column>
            <el-table-column label="下单数量 (份)" prop="num"></el-table-column>
            <el-table-column label="退款数量 (份)">
              <template slot-scope="OD_Item">
                <span v-if="OD_Item.row.num - OD_Item.row.OD_RealNum == 0">0</span>
                <el-tag v-else type="danger">{{OD_Item.row.num - OD_Item.row.OD_RealNum}}</el-tag>
              </template>
            </el-table-column>
          </el-table>

        </el-card>

        <el-card class="bottomElCard">
          <el-divider content-position="left">点菜列表</el-divider>
          <div v-for="item in orderAddFormList" :key="item.OA_ID" style="margin-bottom:50px;min-width:1200px;">
            <h4 style="display:inline;">第 {{item.OA_Sort}} 次点菜</h4>
            <span style="margin-left:20px;font-size:15px;color:#909399;font-weight:bold;"><label>下单时间: </label><label style="font-size:20px;color:#F56C6C;">{{item.OA_OrderingTime}}</label></span>
            <span style="margin-left:20px;font-size:15px;color:#909399;font-weight:bold;"><label>金额: </label><label style="font-size:20px;color:#F56C6C;">{{item.OA_TotlePrice}}</label> 元</span>
            <el-button style="margin-left:30px;" type="primary" v-print="'#'+ 'printST' + item.OA_Sort">打印本次客人小票</el-button>
            <el-button style="margin-left:30px;" type="primary" v-print="'#'+ 'printKT' + item.OA_Sort">打印本次厨房餐票</el-button>
            <span style="margin-left:20px;font-size:15px;color:#909399;font-weight:bold;">
              <label style="margin-right:20px;">接单状态</label>
              <el-switch
                v-model="item.OA_IsTaking"
                active-color="#13ce66"
                inactive-color="#ff4949"
                active-value="1"
                inactive-value="0"
                :disabled="item.OA_IsTaking==0?false:true"
                @change="takingOrder($event, item)">
              </el-switch>
            </span>
            <el-table :data="item.orderDetails" :border="false" :stripe="false">
              <el-table-column type="index"></el-table-column>
              <el-table-column label="菜品名称" prop="OD_FName"></el-table-column>
              <el-table-column label="价格（元）" prop="OD_RealPrice"></el-table-column>
              <el-table-column label="规格">
                <template slot-scope="specs">
                  <el-tag type="warning" size="mini" v-if="specs.row.OD_Spec">{{specs.row.OD_Spec}}</el-tag>
                </template>
              </el-table-column>
              <el-table-column label="属性">
                <template slot-scope="property"  v-if="property.row.OD_PropOne != ''">
                  <span class="propertySpan" v-if="property.row.OD_PropOne != ''">
                    <el-tag type="success" size="mini">{{property.row.OD_PropOne}}</el-tag>
                  </span>
                  <span class="propertySpan" v-if="property.row.OD_PropTwo != ''">
                    <el-tag type="success" size="mini">{{property.row.OD_PropTwo}}</el-tag>
                  </span>
                </template>
              </el-table-column>
              <el-table-column label="实际数量 (份)" prop="OD_RealNum"></el-table-column>
              <el-table-column label="下单数量 (份)" prop="OD_Num"></el-table-column>
              <el-table-column label="退款数量 (份)">
                <template slot-scope="OD_Item">
                  <span v-if="OD_Item.row.OD_Num - OD_Item.row.OD_RealNum == 0">0</span>
                  <el-tag v-else type="danger">{{OD_Item.row.OD_Num - OD_Item.row.OD_RealNum}}</el-tag>
                </template>
              </el-table-column>
            </el-table>
          </div>
        </el-card>

        <el-card class="bottomElCard">
          <el-divider content-position="left">支付信息</el-divider>
          <div v-if="JSON.stringify(orderPayForm) != '{}'">
            <span style="margin-left:20px;font-size:15px;color:#909399;font-weight:bold;"><label>支付时间: </label><label style="font-size:20px;color:#F56C6C;">{{orderPayForm.p_Time_End}}</label></span>
            <span style="margin-left:20px;font-size:15px;color:#909399;font-weight:bold;"><label>支付金额: </label><label style="font-size:20px;color:#F56C6C;">{{orderPayForm.p_Totle_Fee/100}}</label> 元</span>
            <el-button style="margin-left:30px;" type="primary" v-print="'#printPT'">打印支付票据</el-button>
            <el-table :data="[orderPayForm]" :border="false" :stripe="false">
              <el-table-column type="index"></el-table-column>
              <el-table-column label="支付单号" prop="p_Transaction_Id" width="220"></el-table-column>
              <el-table-column label="商户单号" width="280">
                <template>
                  {{orderForm.o_OutTradeNo}}
                </template>
              </el-table-column>
              <el-table-column label="支付金额(元)">
                <template slot-scope="scope">
                  {{scope.row.p_Totle_Fee/100}}
                </template>
              </el-table-column>
              <el-table-column label="支付类型" prop="p_Trade_Type"></el-table-column>
              <el-table-column label="银行类型" prop="p_Bank_Type"></el-table-column>
              <el-table-column label="币种" prop="p_Fee_Type"></el-table-column>
              <el-table-column label="支付时间" prop="p_Time_End"></el-table-column>
            </el-table>
          </div>
          <div></div>
        </el-card>

        <el-card class="bottomElCard">
          <el-divider content-position="left">退菜列表</el-divider>
          <div v-for="item in orderReturnFormList" :key="item.OR_ID" style="margin-bottom:50px;min-width:1200px;">
            <h4 style="display:inline;">第 {{item.OR_Sort}} 次退款</h4>
            <span style="margin-left:20px;font-size:15px;color:#909399;font-weight:bold;"><label>退款时间: </label><label style="font-size:20px;color:#F56C6C;">{{item.OR_ReturnTime}}</label></span>
            <span style="margin-left:20px;font-size:15px;color:#909399;font-weight:bold;"><label>金额: </label><label style="font-size:20px;color:#F56C6C;">{{item.OR_TotlePrice}}</label> 元</span>
            <el-button style="margin-left:30px;" type="primary" v-print="'#'+ 'printRT' + item.OR_Sort">打印退菜小票</el-button>
            <el-table :data="item.orderReturnDetails" :border="false" :stripe="false">
              <el-table-column type="index"></el-table-column>
              <el-table-column label="菜品名称" prop="ORD_FName"></el-table-column>
              <el-table-column label="价格（元）" prop="ORD_RealPrice"></el-table-column>
              <el-table-column label="规格">
                <template slot-scope="specs">
                  <el-tag type="warning" size="mini" v-if="specs.row.ORD_Spec">{{specs.row.ORD_Spec}}</el-tag>
                </template>
              </el-table-column>
              <el-table-column label="属性">
                <template slot-scope="property"  v-if="property.row.ORD_PropOne != ''">
                  <span class="propertySpan" v-if="property.row.ORD_PropOne != ''">
                    <el-tag type="success" size="mini">{{property.row.ORD_PropOne}}</el-tag>
                  </span>
                  <span class="propertySpan" v-if="property.row.ORD_PropTwo != ''">
                    <el-tag type="success" size="mini">{{property.row.ORD_PropTwo}}</el-tag>
                  </span>
                </template>
              </el-table-column>
              <el-table-column label="退款数量 (份)">
                <template slot-scope="scope">
                  <el-tag type="danger">{{scope.row.ORD_Num}}</el-tag>
                </template>
              </el-table-column>
            </el-table>
          </div>
        </el-card>

        <el-card class="bottomElCard">
          <el-divider content-position="left">退款信息</el-divider>
          <div v-for="(item, index) in refundFormList" :key="item.R_ID" style="margin-bottom:50px;min-width:1200px;">
            <h4 style="display:inline;">第 {{index+1}} 次退款</h4>
            <el-button style="margin-left:30px;" type="primary" v-print="'#'+ 'printRefundT' + index">打印退款票据</el-button>
            <el-button style="margin-left:30px;" type="primary"
              :disabled="((item.R_Is_OfLine === 1 && item.R_Refund_Status)||item.R_Is_OfLine === 0) ? true : false"
              @click="refundQuery(item.R_ID)" v-if="item">查询退款到账</el-button>
            <el-table :data="[item]" :border="false" :stripe="false">
              <el-table-column type="index"></el-table-column>
              <el-table-column label="退款方式"  v-if="item">
                <template slot-scope="scope">
                  <span v-if="scope.row.R_Is_OfLine === 1">系统退款</span>
                  <span v-if="scope.row.R_Is_OfLine === 0">人工退款</span>
                </template>
              </el-table-column>
              <el-table-column label="退款单号" prop="R_Refund_Id" width="249"></el-table-column>
              <el-table-column label="商户退款单号" prop="R_Out_Refund_No" width="260"></el-table-column>
              <el-table-column label="退款金额(元)">
                <template slot-scope="scope">
                  <span v-if="scope.row.R_Refund_Fee === undefined">{{scope.row.R_Refund_Fee}}</span>
                  <span v-else>{{parseInt(scope.row.R_Refund_Fee)/100}}</span>
                </template>
              </el-table-column>
              <el-table-column label="提交时间" prop="R_Submit_Time" width="150"></el-table-column>
              <el-table-column label="提交退款业务结果" width="150">
                <template slot-scope="scope">
                  <span v-if="scope.row.R_Result_Code === 'SUCCESS'">退款申请接收成功</span>
                  <span v-if="scope.row.R_Result_Code === 'FAIL'">提交退款失败</span>
                </template>
              </el-table-column>
              <el-table-column label="退款到账时间" prop="R_Success_Time" width="150"></el-table-column>
              <el-table-column label="退款结果" width="150">
                <template slot-scope="scope">
                  <span v-if="scope.row.R_Refund_Status === 'SUCCESS'">退款成功(到账)</span>
                  <span v-if="scope.row.R_Refund_Status === 'CHANGE'">退款异常</span>
                  <span v-if="scope.row.R_Refund_Status === 'REFUNDCLOSE'">退款关闭</span>
                </template>
              </el-table-column>
              <el-table-column label="退款账户" prop="R_Refund_Recv_Account" width="150"></el-table-column>
            </el-table>
          </div>
        </el-card>

        <el-card class="bottomElCard">
          <el-divider content-position="left">票据预览</el-divider>
          <div class="BillTicketWrapper">
            <div class="bill-preview">
              <h3>客人小票预览</h3>
              <div id="printST" class="detail">
                <p style="text-align:center;font-size:25px">客人小票</p>
                <h1 class="ST_merName">{{merForm.m_Name}}</h1>
                <div style="border-bottom:#000 dashed 1px;"></div>
                <p><label>单号:</label><label style="font-size:13px;margin-left:10px;">{{orderForm.o_UniqSearchID}}</label></p>
                <p><label>下单时间:</label><label style="font-size:13px;margin-left:10px;">{{orderForm.o_OrderingTime}}</label></p>
                <p><label>支付时间:</label><label style="font-size:13px;margin-left:10px;">{{orderForm.o_PayTime}}</label></p>
                <p><label>餐桌区域:</label><label style="font-size:13px;margin-left:10px;">{{orderForm.TT_Name}}</label></p>
                <p><label>餐桌:</label><label style="font-size:13px;margin-left:10px;">{{orderForm.t_Name}}</label></p>
                <p><label>用餐人数:</label><label style="font-size:13px;margin-left:10px;">{{orderForm.o_NumberOfDiners}}人</label></p>
                <div style="border-bottom:#000 dashed 1px;"></div>
                <p style="width:230px;word-wrap:break-word;"><label>客人备注:</label><label style="font-size:13px;margin-left:10px;">{{orderForm.o_Remarks}}</label></p>
                <p>*****************商品***************</p>
                <div v-for="item in orderDetailForm"><!-- eslint-disable-line -->
                  <p style="width:230px;word-wrap:break-word;">
                    <label style="font-size:20px;">{{item.name}}</label><label style="font-size:17px;margin-left:10px;"><em> {{item.specs}}</em><em v-for="proItem in item.property"> {{proItem}}</em></label><!-- eslint-disable-line -->
                  </p>
                  <p>
                    <label  style="margin-right:20px;margin-left:100px"><span style="font-size:22px;">【<span style="font-size:20px;">x</span></span><span style="font-size:22px;">{{item.OD_RealNum}}</span><span style="font-size:22px;">】</span></label>￥<label style="font-size:20px">{{item.price}}</label>
                  </p>
                </div>
                <div style="border-bottom:#000 dashed 1px;"></div>
                <p><label style="margin-left:100px;font-size:25px;">合计:</label><label style="font-size:25px;margin-left:20px;">￥{{orderForm.o_TotlePrice}}</label></p>
                <p>*************************************</p>
                <div style="border-bottom:#000 dashed 1px;"></div>
                <p><label>打印时间:</label><label style="font-size:13px;margin-left:10px;">{{new Date().toLocaleString()}}</label></p>
                <p><label>餐厅联系电话:</label><label style="font-size:13px;margin-left:10px;">{{merForm.m_Phone}}</label></p>
                <p><label>餐厅地址:</label><label style="font-size:13px;margin-left:10px;">{{merForm.m_Address}}</label></p>
                <p><label style="font-size:13px;">技术供应商:</label><label style="font-size:13px;margin-left:10px;">上海俣珩科技(东华之星™)</label></p>
                <p><label style="font-size:13px;">供应商联系方式:</label><label style="font-size:10px;margin-left:10px;">18860976772</label></p>
                <p><label style="font-size:13px;">供应商联系方式:</label><label style="font-size:10px;margin-left:10px;">1152862327@qq.com</label></p>
              </div>
            </div>

            <div class="bill-preview">
              <h3>厨房餐票预览</h3>
              <div id="printKT" class="detail">
                <p style="text-align:center;font-size:25px">厨房餐票</p>
                <h1 class="ST_merName">{{merForm.m_Name}}</h1>
                <div style="border-bottom:#000 dashed 1px;"></div>
                <p><label>单号:</label><label style="font-size:13px;margin-left:10px;">{{orderForm.o_UniqSearchID}}</label></p>
                <p><label>下单时间:</label><label style="font-size:13px;margin-left:10px;">{{orderForm.o_OrderingTime}}</label></p>
                <p><label>餐桌区域:</label><label style="font-size:13px;margin-left:10px;">{{orderForm.TT_Name}}</label></p>
                <p><label>餐桌:</label><label style="font-size:13px;margin-left:10px;">{{orderForm.t_Name}}</label></p>
                <p><label>用餐人数:</label><label style="font-size:13px;margin-left:10px;">{{orderForm.o_NumberOfDiners}}人</label></p>
                <div style="border-bottom:#000 dashed 1px;"></div>
                <p style="width:230px;word-wrap:break-word;"><label>客人备注:</label><label style="font-size:13px;margin-left:10px;">{{orderForm.o_Remarks}}</label></p>
                <p>*****************商品***************</p>
                <div v-for="item in orderDetailForm"><!-- eslint-disable-line -->
                  <p style="width:230px;word-wrap:break-word;">
                    <label style="font-size:23px;">{{item.name}}</label><label style="font-size:17px;margin-left:10px;"><em> {{item.specs}}</em><em v-for="proItem in item.property"> {{proItem}}</em></label><!-- eslint-disable-line -->
                  </p>
                  <p>
                    <label  style="margin-left:150px"><span style="font-size:22px;">【<span style="font-size:20px;">x</span></span><span style="font-size:30px;">{{item.OD_RealNum}}</span><span style="font-size:22px;">】</span></label>
                  </p>
                </div>
                <p>*************************************</p>
                <div style="border-bottom:#000 dashed 1px;"></div>
                <p><label>打印时间:</label><label style="font-size:13px;margin-left:10px;">{{new Date().toLocaleString()}}</label></p>
                <p><label>餐厅联系电话:</label><label style="font-size:13px;margin-left:10px;">{{merForm.m_Phone}}</label></p>
                <p><label>餐厅地址:</label><label style="font-size:13px;margin-left:10px;">{{merForm.m_Address}}</label></p>
                <p><label style="font-size:13px;">技术供应商:</label><label style="font-size:13px;margin-left:10px;">上海俣珩科技(东华之星™)</label></p>
                <p><label style="font-size:13px;">供应商联系方式:</label><label style="font-size:10px;margin-left:10px;">18860976772</label></p>
                <p><label style="font-size:13px;">供应商联系方式:</label><label style="font-size:10px;margin-left:10px;">1152862327@qq.com</label></p>
              </div>
            </div>

            <div class="bill-preview">
              <h3>支付票据预览</h3>
              <div id="printPT" class="detail">
                <p style="text-align:center;font-size:25px">支付票据</p>
                <h1 class="ST_merName">{{merForm.m_Name}}</h1>
                <div style="border-bottom:#000 dashed 1px;"></div>
                <p><label>单号:</label><label style="font-size:13px;margin-left:10px;">{{orderForm.o_UniqSearchID}}</label></p>
                <p><label>下单时间:</label><label style="font-size:13px;margin-left:10px;">{{orderForm.o_OrderingTime}}</label></p>
                <p><label>餐桌区域:</label><label style="font-size:13px;margin-left:10px;">{{orderForm.TT_Name}}</label></p>
                <p><label>餐桌:</label><label style="font-size:13px;margin-left:10px;">{{orderForm.t_Name}}</label></p>
                <p><label>用餐人数:</label><label style="font-size:13px;margin-left:10px;">{{orderForm.o_NumberOfDiners}}人</label></p>
                <div style="border-bottom:#000 dashed 1px;"></div>
                <p><label style="margin-left:10px;font-size:15px;">支付单号:</label></p>
                <p><label style="font-size:12px;margin-left:20px;">{{orderPayForm.p_Transaction_Id}}</label></p>
                <p><label style="margin-left:10px;font-size:15px;">商户单号:</label></p>
                <p><label style="font-size:12px;margin-left:20px;">{{orderForm.o_OutTradeNo}}</label></p>
                <p><label style="margin-left:10px;font-size:17px;">支付金额:</label><label style="font-size:15px;margin-left:10px;">{{orderPayForm.p_Totle_Fee == undefined? '':orderPayForm.p_Totle_Fee/100}} 元</label></p>
                <p><label style="margin-left:10px;font-size:17px;">支付类型:</label><label style="font-size:15px;margin-left:10px;">{{orderPayForm.p_Trade_Type}}</label></p>
                <p><label style="margin-left:10px;font-size:17px;">支付时间:</label><label style="font-size:15px;margin-left:10px;">{{orderPayForm.p_Time_End}}</label></p>
                <p><label style="margin-left:10px;font-size:17px;">银行类型:</label><label style="font-size:15px;margin-left:10px;">{{orderPayForm.p_Bank_Type}}</label></p>
                <div style="border-bottom:#000 dashed 1px;"></div>
                <p><label>打印时间:</label><label style="font-size:13px;margin-left:10px;">{{new Date().toLocaleString()}}</label></p>
                <p><label>餐厅联系电话:</label><label style="font-size:13px;margin-left:10px;">{{merForm.m_Phone}}</label></p>
                <p><label>餐厅地址:</label><label style="font-size:13px;margin-left:10px;">{{merForm.m_Address}}</label></p>
                <p><label style="font-size:13px;">技术供应商:</label><label style="font-size:13px;margin-left:10px;">上海俣珩科技(东华之星™)</label></p>
                <p><label style="font-size:13px;">供应商联系方式:</label><label style="font-size:10px;margin-left:10px;">18860976772</label></p>
                <p><label style="font-size:13px;">供应商联系方式:</label><label style="font-size:10px;margin-left:10px;">1152862327@qq.com</label></p>
              </div>
            </div>

            <div class="bill-preview" v-for="item in orderAddFormList" :key="item.OA_ID">
              <h3>第 {{item.OA_Sort}} 次点菜 客人小票预览</h3>
              <div :id="'printST' + item.OA_Sort" class="detail">
                <p style="text-align:center;font-size:15px">第 {{item.OA_Sort}} 次点菜</p>
                <p style="text-align:center;font-size:25px">客人小票</p>
                <h1 class="ST_merName">{{merForm.m_Name}}</h1>
                <div style="border-bottom:#000 dashed 1px;"></div>
                <p><label>单号:</label><label style="font-size:13px;margin-left:10px;">{{orderForm.o_UniqSearchID}}</label></p>
                <p><label>下单时间:</label><label style="font-size:13px;margin-left:10px;">{{orderForm.o_OrderingTime}}</label></p>
                <p><label>支付时间:</label><label style="font-size:13px;margin-left:10px;">{{orderForm.o_PayTime}}</label></p>
                <p><label>餐桌区域:</label><label style="font-size:13px;margin-left:10px;">{{orderForm.TT_Name}}</label></p>
                <p><label>餐桌:</label><label style="font-size:13px;margin-left:10px;">{{orderForm.t_Name}}</label></p>
                <p><label>用餐人数:</label><label style="font-size:13px;margin-left:10px;">{{orderForm.o_NumberOfDiners}}人</label></p>
                <div style="border-bottom:#000 dashed 1px;"></div>
                <p style="width:230px;word-wrap:break-word;"><label>客人备注:</label><label style="font-size:13px;margin-left:10px;">{{orderForm.o_Remarks}}</label></p>
                <p>*****************商品***************</p>
                <div v-for="itemIn in item.orderDetails"><!-- eslint-disable-line -->
                  <p style="width:230px;word-wrap:break-word;">
                    <label style="font-size:20px;">{{itemIn.OD_FName}}</label>
                    <label style="font-size:17px;margin-left:10px;">
                      <em> {{itemIn.OD_Spec}}</em>
                      <em v-if="itemIn.OD_PropOne"> {{itemIn.OD_PropOne}}</em>
                      <em v-if="itemIn.OD_PropTwo"> {{itemIn.OD_PropTwo}}</em>
                    </label>
                  </p>
                  <p>
                    <label  style="margin-right:20px;margin-left:100px"><span style="font-size:22px;">【<span style="font-size:20px;">x</span></span><span style="font-size:22px;">{{itemIn.OD_RealNum}}</span><span style="font-size:22px;">】</span></label>￥<label style="font-size:20px">{{itemIn.OD_RealPrice}}</label>
                  </p>
                </div>
                <div style="border-bottom:#000 dashed 1px;"></div>
                <p><label style="margin-left:100px;font-size:25px;">合计:</label><label style="font-size:25px;margin-left:20px;">￥{{item.OA_TotlePrice}}</label></p>
                <p>*************************************</p>
                <div style="border-bottom:#000 dashed 1px;"></div>
                <p><label>打印时间:</label><label style="font-size:13px;margin-left:10px;">{{new Date().toLocaleString()}}</label></p>
                <p><label>餐厅联系电话:</label><label style="font-size:13px;margin-left:10px;">{{merForm.m_Phone}}</label></p>
                <p><label>餐厅地址:</label><label style="font-size:13px;margin-left:10px;">{{merForm.m_Address}}</label></p>
                <p><label style="font-size:13px;">技术供应商:</label><label style="font-size:13px;margin-left:10px;">上海俣珩科技(东华之星™)</label></p>
                <p><label style="font-size:13px;">供应商联系方式:</label><label style="font-size:10px;margin-left:10px;">18860976772</label></p>
                <p><label style="font-size:13px;">供应商联系方式:</label><label style="font-size:10px;margin-left:10px;">1152862327@qq.com</label></p>
              </div>
            </div>

            <div class="bill-preview" v-for="item in orderAddFormList" :key="item.OA_ID + '1'">
              <h3>第 {{item.OA_Sort}} 次点菜 厨房餐票预览</h3>
              <div :id="'printKT' + item.OA_Sort" class="detail">
                <p style="text-align:center;font-size:15px">第 {{item.OA_Sort}} 次点菜</p>
                <p style="text-align:center;font-size:25px">厨房餐票</p>
                <h1 class="ST_merName">{{merForm.m_Name}}</h1>
                <div style="border-bottom:#000 dashed 1px;"></div>
                <p><label>单号:</label><label style="font-size:13px;margin-left:10px;">{{orderForm.o_UniqSearchID}}</label></p>
                <p><label>下单时间:</label><label style="font-size:13px;margin-left:10px;">{{orderForm.o_OrderingTime}}</label></p>
                <p><label>餐桌区域:</label><label style="font-size:13px;margin-left:10px;">{{orderForm.TT_Name}}</label></p>
                <p><label>餐桌:</label><label style="font-size:13px;margin-left:10px;">{{orderForm.t_Name}}</label></p>
                <p><label>用餐人数:</label><label style="font-size:13px;margin-left:10px;">{{orderForm.o_NumberOfDiners}}人</label></p>
                <div style="border-bottom:#000 dashed 1px;"></div>
                <p style="width:230px;word-wrap:break-word;"><label>客人备注:</label><label style="font-size:13px;margin-left:10px;">{{orderForm.o_Remarks}}</label></p>
                <p>*****************商品***************</p>
                <div v-for="itemIn in item.orderDetails"><!-- eslint-disable-line -->
                  <p style="width:230px;word-wrap:break-word;">
                    <label style="font-size:20px;">{{itemIn.OD_FName}}</label>
                    <label style="font-size:17px;margin-left:10px;">
                      <em> {{itemIn.OD_Spec}}</em>
                      <em v-if="itemIn.OD_PropOne"> {{itemIn.OD_PropOne}}</em>
                      <em v-if="itemIn.OD_PropTwo"> {{itemIn.OD_PropTwo}}</em>
                    </label>
                  </p>
                  <p>
                    <label  style="margin-right:20px;margin-left:100px"><span style="font-size:22px;">【<span style="font-size:20px;">x</span></span><span style="font-size:22px;">{{itemIn.OD_RealNum}}</span><span style="font-size:22px;">】</span></label>
                  </p>
                </div>
                <p>*************************************</p>
                <div style="border-bottom:#000 dashed 1px;"></div>
                <p><label>打印时间:</label><label style="font-size:13px;margin-left:10px;">{{new Date().toLocaleString()}}</label></p>
                <p><label>餐厅联系电话:</label><label style="font-size:13px;margin-left:10px;">{{merForm.m_Phone}}</label></p>
                <p><label>餐厅地址:</label><label style="font-size:13px;margin-left:10px;">{{merForm.m_Address}}</label></p>
                <p><label style="font-size:13px;">技术供应商:</label><label style="font-size:13px;margin-left:10px;">上海俣珩科技(东华之星™)</label></p>
                <p><label style="font-size:13px;">供应商联系方式:</label><label style="font-size:10px;margin-left:10px;">18860976772</label></p>
                <p><label style="font-size:13px;">供应商联系方式:</label><label style="font-size:10px;margin-left:10px;">1152862327@qq.com</label></p>
              </div>
            </div>

            <!-- 退菜票据 RT -->
            <div class="bill-preview" v-for="item in orderReturnFormList" :key="item.OR_ID + '1'">
              <h3>第 {{item.OR_Sort}} 次退款 退菜票据预览</h3>
              <div :id="'printRT' + item.OR_Sort" class="detail">
                <p style="text-align:center;font-size:15px">第 {{item.OR_Sort}} 次退款</p>
                <p style="text-align:center;font-size:25px">退菜票据</p>
                <h1 class="ST_merName">{{merForm.m_Name}}</h1>
                <div style="border-bottom:#000 dashed 1px;"></div>
                <p><label>单号:</label><label style="font-size:13px;margin-left:10px;">{{orderForm.o_UniqSearchID}}</label></p>
                <p><label>下单时间:</label><label style="font-size:13px;margin-left:10px;">{{orderForm.o_OrderingTime}}</label></p>
                <p><label>支付时间:</label><label style="font-size:13px;margin-left:10px;">{{orderForm.o_PayTime}}</label></p>
                <p><label>餐桌区域:</label><label style="font-size:13px;margin-left:10px;">{{orderForm.TT_Name}}</label></p>
                <p><label>餐桌:</label><label style="font-size:13px;margin-left:10px;">{{orderForm.t_Name}}</label></p>
                <p><label>用餐人数:</label><label style="font-size:13px;margin-left:10px;">{{orderForm.o_NumberOfDiners}}人</label></p>
                <p><label>退菜时间:</label><label style="font-size:13px;margin-left:10px;">{{item.OR_ReturnTime}}</label></p>
                <div style="border-bottom:#000 dashed 1px;"></div>
                <p>*****************商品***************</p>
                <div v-for="itemIn in item.orderReturnDetails"><!-- eslint-disable-line -->
                  <p style="width:230px;word-wrap:break-word;">
                    <label style="font-size:20px;">{{itemIn.ORD_FName}}</label>
                    <label style="font-size:17px;margin-left:10px;">
                      <em> {{itemIn.ORD_Spec}}</em>
                      <em v-if="itemIn.ORD_PropOne"> {{itemIn.ORD_PropOne}}</em>
                      <em v-if="itemIn.ORD_PropTwo"> {{itemIn.ORD_PropTwo}}</em>
                    </label>
                  </p>
                  <p>
                    <label  style="margin-right:20px;margin-left:100px"><span style="font-size:22px;">【<span style="font-size:20px;">x</span></span><span style="font-size:22px;">{{itemIn.ORD_Num}}</span><span style="font-size:22px;">】</span></label>￥<label style="font-size:20px">{{itemIn.ORD_RealPrice}}</label>
                  </p>
                </div>
                <p>*************************************</p>
                <div style="border-bottom:#000 dashed 1px;"></div>
                <p><label>打印时间:</label><label style="font-size:13px;margin-left:10px;">{{new Date().toLocaleString()}}</label></p>
                <p><label>餐厅联系电话:</label><label style="font-size:13px;margin-left:10px;">{{merForm.m_Phone}}</label></p>
                <p><label>餐厅地址:</label><label style="font-size:13px;margin-left:10px;">{{merForm.m_Address}}</label></p>
                <p><label style="font-size:13px;">技术供应商:</label><label style="font-size:13px;margin-left:10px;">上海俣珩科技(东华之星™)</label></p>
                <p><label style="font-size:13px;">供应商联系方式:</label><label style="font-size:10px;margin-left:10px;">18860976772</label></p>
                <p><label style="font-size:13px;">供应商联系方式:</label><label style="font-size:10px;margin-left:10px;">1152862327@qq.com</label></p>
              </div>
            </div>

            <!-- 退款票据 RefundT -->
            <div class="bill-preview" v-for="(item, index) in refundFormList" :key="index">
              <h3>第 {{index + 1}} 次退款 退款票据预览</h3>
              <div :id="'printRefundT' + index" class="detail">
                <p style="text-align:center;font-size:15px">第 {{index + 1}} 次退款</p>
                <p style="text-align:center;font-size:25px">退款票据</p>
                <h1 class="ST_merName">{{merForm.m_Name}}</h1>
                <div style="border-bottom:#000 dashed 1px;"></div>
                <p><label>单号:</label><label style="font-size:13px;margin-left:10px;">{{orderForm.o_UniqSearchID}}</label></p>
                <p><label>下单时间:</label><label style="font-size:13px;margin-left:10px;">{{orderForm.o_OrderingTime}}</label></p>
                <p><label>支付时间:</label><label style="font-size:13px;margin-left:10px;">{{orderForm.o_PayTime}}</label></p>
                <p><label>餐桌区域:</label><label style="font-size:13px;margin-left:10px;">{{orderForm.TT_Name}}</label></p>
                <p><label>餐桌:</label><label style="font-size:13px;margin-left:10px;">{{orderForm.t_Name}}</label></p>
                <p><label>用餐人数:</label><label style="font-size:13px;margin-left:10px;">{{orderForm.o_NumberOfDiners}}人</label></p>
                <div style="border-bottom:#000 dashed 1px;"></div>
                <div  v-if="item"><!-- eslint-disable-line -->
                  <p><label style="margin-left:10px;font-size:17px;">退款方式:</label><label style="font-size:15px;margin-left:10px;">{{item.R_Is_OfLine === 1 ? '系统退款' : '人工退款'}}</label></p>
                  <p><label style="margin-left:10px;font-size:15px;">退款单号:</label></p>
                  <p><label style="font-size:12px;margin-left:20px;">{{item.R_Refund_Id}}</label></p>
                  <p><label style="margin-left:10px;font-size:15px;">商户退款单号:</label></p>
                  <p><label style="font-size:12px;margin-left:20px;">{{item.R_Out_Refund_No}}</label></p>
                  <p><label style="margin-left:10px;font-size:17px;">退款金额:</label><label style="font-size:15px;margin-left:10px;">{{item.R_Refund_Fee == undefined? '':item.R_Refund_Fee/100}} 元</label></p>
                  <p><label style="margin-left:10px;font-size:17px;">提交时间:</label><label style="font-size:15px;margin-left:10px;">{{item.R_Submit_Time}}</label></p>
                  <p><label style="margin-left:10px;font-size:17px;">提交退款业务结果:</label></p>
                  <p>
                    <label style="font-size:15px;margin-left:20px;">
                      <span v-if="item.R_Result_Code === 'SUCCESS'">退款申请接收成功</span>
                      <span v-if="item.R_Result_Code === 'FAIL'">提交退款失败</span>
                    </label>
                  </p>
                  <p><label style="margin-left:10px;font-size:17px;">到账时间:</label><label style="font-size:15px;margin-left:10px;">{{item.R_Success_Time}}</label></p>
                  <p><label style="margin-left:10px;font-size:17px;">退款结果:</label></p>
                  <p>
                    <label style="font-size:15px;margin-left:20px;">
                      <span v-if="item.R_Refund_Status === 'SUCCESS'">退款成功(到账)</span>
                      <span v-if="item.R_Refund_Status === 'CHANGE'">退款异常</span>
                      <span v-if="item.R_Refund_Status === 'REFUNDCLOSE'">退款关闭</span>
                    </label>
                  </p>
                  <p><label style="margin-left:10px;font-size:17px;">退款账户:</label><label style="font-size:15px;margin-left:10px;">{{item.R_Refund_Recv_Account}}</label></p>
                </div>
                <div style="border-bottom:#000 dashed 1px;"></div>
                <p><label>打印时间:</label><label style="font-size:13px;margin-left:10px;">{{new Date().toLocaleString()}}</label></p>
                <p><label>餐厅联系电话:</label><label style="font-size:13px;margin-left:10px;">{{merForm.m_Phone}}</label></p>
                <p><label>餐厅地址:</label><label style="font-size:13px;margin-left:10px;">{{merForm.m_Address}}</label></p>
                <p><label style="font-size:13px;">技术供应商:</label><label style="font-size:13px;margin-left:10px;">上海俣珩科技(东华之星™)</label></p>
                <p><label style="font-size:13px;">供应商联系方式:</label><label style="font-size:10px;margin-left:10px;">18860976772</label></p>
                <p><label style="font-size:13px;">供应商联系方式:</label><label style="font-size:10px;margin-left:10px;">1152862327@qq.com</label></p>
              </div>
            </div>

            <div class="bill-preview">
              <h3>餐厅底票预览</h3>
              <div id="printMT" class="detail">
                <p style="text-align:center;font-size:25px">餐厅底票</p>
                <h1 class="ST_merName">{{merForm.m_Name}}</h1>
                <div style="border-bottom:#000 dashed 1px;"></div>
                <p><label>单号:</label><label style="font-size:13px;margin-left:10px;">{{orderForm.o_UniqSearchID}}</label></p>
                <p><label>下单时间:</label><label style="font-size:13px;margin-left:10px;">{{orderForm.o_OrderingTime}}</label></p>
                <p><label>支付时间:</label><label style="font-size:13px;margin-left:10px;">{{orderForm.o_PayTime}}</label></p>
                <p><label>餐桌区域:</label><label style="font-size:13px;margin-left:10px;">{{orderForm.TT_Name}}</label></p>
                <p><label>餐桌:</label><label style="font-size:13px;margin-left:10px;">{{orderForm.t_Name}}</label></p>
                <p><label>用餐人数:</label><label style="font-size:13px;margin-left:10px;">{{orderForm.o_NumberOfDiners}}人</label></p>
                <div style="border-bottom:#000 dashed 1px;"></div>
                <p style="width:230px;word-wrap:break-word;"><label>客人备注:</label><label style="font-size:13px;margin-left:10px;">{{orderForm.o_Remarks}}</label></p>
                <p>*****************商品***************</p>
                <div v-for="item in orderDetailForm"><!-- eslint-disable-line -->
                  <p style="width:230px;word-wrap:break-word;">
                    <label style="font-size:20px;">{{item.name}}</label><label style="font-size:17px;margin-left:10px;"><em> {{item.specs}}</em><em v-for="proItem in item.property"> {{proItem}}</em></label><!-- eslint-disable-line -->
                  </p>
                  <p>
                    <label  style="margin-right:20px;margin-left:100px"><span style="font-size:22px;">【<span style="font-size:20px;">x</span></span><span style="font-size:22px;">{{item.OD_RealNum}}</span><span style="font-size:22px;">】</span></label>￥<label style="font-size:20px">{{item.price}}</label>
                  </p>
                </div>
                <div style="border-bottom:#000 dashed 1px;"></div>
                <p><label style="margin-left:100px;font-size:25px;">合计:</label><label style="font-size:25px;margin-left:20px;">￥{{orderForm.o_TotlePrice}}</label></p>
                <p>*************************************</p>
                <div style="border-bottom:#000 dashed 1px;"></div>
                <p><label style="margin-left:10px;font-size:15px;">支付单号:</label></p>
                <p><label style="font-size:12px;margin-left:20px;">{{orderPayForm.p_Transaction_Id}}</label></p>
                <p><label style="margin-left:10px;font-size:15px;">商户单号:</label></p>
                <p><label style="font-size:12px;margin-left:20px;">{{orderForm.o_OutTradeNo}}</label></p>
                <p><label style="margin-left:10px;font-size:17px;">支付金额:</label><label style="font-size:15px;margin-left:10px;">{{orderPayForm.p_Totle_Fee == undefined? '':orderPayForm.p_Totle_Fee/100}} 元</label></p>
                <p><label style="margin-left:10px;font-size:17px;">支付类型:</label><label style="font-size:15px;margin-left:10px;">{{orderPayForm.p_Trade_Type}}</label></p>
                <p><label style="margin-left:10px;font-size:17px;">支付时间:</label><label style="font-size:15px;margin-left:10px;">{{orderPayForm.p_Time_End}}</label></p>
                <p><label style="margin-left:10px;font-size:17px;">银行类型:</label><label style="font-size:15px;margin-left:10px;">{{orderPayForm.p_Bank_Type}}</label></p>
                <div v-for="(item, index) in orderReturnFormList" :key="index">
                  <div style="border-bottom:#000 dashed 1px;"></div>
                  <p style="text-align:center;font-size:15px">第 {{item.OR_Sort}} 次退款</p>
                  <p>*************退菜商品***************</p>
                  <div v-for="itemIn in item.orderReturnDetails"><!-- eslint-disable-line -->
                    <p style="width:230px;word-wrap:break-word;">
                      <label style="font-size:20px;">{{itemIn.ORD_FName}}</label>
                      <label style="font-size:17px;margin-left:10px;">
                        <em> {{itemIn.ORD_Spec}}</em>
                        <em v-if="itemIn.ORD_PropOne"> {{itemIn.ORD_PropOne}}</em>
                        <em v-if="itemIn.ORD_PropTwo"> {{itemIn.ORD_PropTwo}}</em>
                      </label>
                    </p>
                    <p>
                      <label  style="margin-right:20px;margin-left:100px"><span style="font-size:22px;">【<span style="font-size:20px;">x</span></span><span style="font-size:22px;">{{itemIn.ORD_Num}}</span><span style="font-size:22px;">】</span></label>￥<label style="font-size:20px">{{itemIn.ORD_RealPrice}}</label>
                    </p>
                  </div>
                  <p>*************************************</p>
                  <div  v-if="refundFormList[index]"><!-- eslint-disable-line -->
                    <p><label style="margin-left:10px;font-size:17px;">退款方式:</label><label style="font-size:15px;margin-left:10px;">{{refundFormList[index].R_Is_OfLine === 1 ? '系统退款' : '人工退款'}}</label></p>
                    <p><label style="margin-left:10px;font-size:15px;">退款单号:</label></p>
                    <p><label style="font-size:12px;margin-left:20px;">{{refundFormList[index].R_Refund_Id}}</label></p>
                    <p><label style="margin-left:10px;font-size:15px;">商户退款单号:</label></p>
                    <p><label style="font-size:12px;margin-left:20px;">{{refundFormList[index].R_Out_Refund_No}}</label></p>
                    <p><label style="margin-left:10px;font-size:17px;">退款金额:</label><label style="font-size:15px;margin-left:10px;">{{refundFormList[index].R_Refund_Fee == undefined? '':refundFormList[index].R_Refund_Fee/100}} 元</label></p>
                    <p><label style="margin-left:10px;font-size:17px;">提交时间:</label><label style="font-size:15px;margin-left:10px;">{{refundFormList[index].R_Submit_Time}}</label></p>
                    <p><label style="margin-left:10px;font-size:17px;">提交退款业务结果:</label></p>
                    <p>
                      <label style="font-size:15px;margin-left:20px;">
                        <span v-if="refundFormList[index].R_Result_Code === 'SUCCESS'">退款申请接收成功</span>
                        <span v-if="refundFormList[index].R_Result_Code === 'FAIL'">提交退款失败</span>
                      </label>
                    </p>
                    <p><label style="margin-left:10px;font-size:17px;">到账时间:</label><label style="font-size:15px;margin-left:10px;">{{refundFormList[index].R_Success_Time}}</label></p>
                    <p><label style="margin-left:10px;font-size:17px;">退款结果:</label></p>
                    <p>
                      <label style="font-size:15px;margin-left:20px;">
                        <span v-if="refundFormList[index].R_Refund_Status === 'SUCCESS'">退款成功(到账)</span>
                        <span v-if="refundFormList[index].R_Refund_Status === 'CHANGE'">退款异常</span>
                        <span v-if="refundFormList[index].R_Refund_Status === 'REFUNDCLOSE'">退款关闭</span>
                      </label>
                    </p>
                    <p><label style="margin-left:10px;font-size:17px;">退款账户:</label><label style="font-size:15px;margin-left:10px;">{{refundFormList[index].R_Refund_Recv_Account}}</label></p>
                  </div>
                </div>
                <div style="border-bottom:#000 dashed 1px;"></div>
                <p><label>打印时间:</label><label style="font-size:13px;margin-left:10px;">{{new Date().toLocaleString()}}</label></p>
                <p><label>餐厅联系电话:</label><label style="font-size:13px;margin-left:10px;">{{merForm.m_Phone}}</label></p>
                <p><label>餐厅地址:</label><label style="font-size:13px;margin-left:10px;">{{merForm.m_Address}}</label></p>
                <p><label style="font-size:13px;">技术供应商:</label><label style="font-size:13px;margin-left:10px;">上海俣珩科技(东华之星™)</label></p>
                <p><label style="font-size:13px;">供应商联系方式:</label><label style="font-size:10px;margin-left:10px;">18860976772</label></p>
                <p><label style="font-size:13px;">供应商联系方式:</label><label style="font-size:10px;margin-left:10px;">1152862327@qq.com</label></p>
              </div>
            </div>
          </div>
        </el-card>

        <el-dialog title="仅退餐品" :visible.sync="onlyReturnGoodDialogVisible" width="70%">

          <el-table :data="onlyReturnGoodOrderDetailForm" :border="false" :stripe="false">
            <el-table-column type="index"></el-table-column>
            <el-table-column label="菜品名称" prop="name"></el-table-column>
            <el-table-column label="价格（元）" prop="price"></el-table-column>
            <el-table-column label="规格">
              <template slot-scope="specs">
                <el-tag type="warning" size="mini" v-if="specs.row.specs">{{specs.row.specs}}</el-tag>
              </template>
            </el-table-column>
            <el-table-column label="属性">
              <template slot-scope="property"  v-if="property.row.property[0] != ''">
                <span v-for="item in property.row.property" :key="item" class="propertySpan">
                  <el-tag type="success" size="mini" v-if="item != ''">{{item}}</el-tag>
                </span>
              </template>
            </el-table-column>
            <el-table-column label="实际数量 (份)" prop="OD_RealNum"></el-table-column>
            <el-table-column label="已下单数量 (份)" prop="num"></el-table-column>
            <el-table-column label="已退款数量 (份)">
              <template slot-scope="OD_Item">
                <span v-if="OD_Item.row.num - OD_Item.row.OD_RealNum == 0">0</span>
                <el-tag v-else type="danger">{{OD_Item.row.num - OD_Item.row.OD_RealNum}}</el-tag>
              </template>
            </el-table-column>
            <el-table-column label="本次仅退餐品数量" width="170">
              <template slot-scope="scope">
                <el-input-number size="small" v-model="scope.row.onlyReturnNum" :min="0" :max="scope.row.OD_RealNum"></el-input-number>
              </template>
            </el-table-column>
          </el-table>

          <span slot="footer" class="dialog-footer">
            <el-button @click="onlyReturnGoodDialogVisible = false">取 消</el-button>
            <el-button type="primary" @click="ensureOnlyReturnGood">确 定</el-button>
          </span>
        </el-dialog>

        <el-dialog title="退款" :visible.sync="returnGoodWithMoneyDialogVisible" width="70%">

          <el-table :data="returnGoodWithMoneyOrderDetailForm" :border="true" :stripe="false" class="returnGoodWithMoneyDialogTab">
            <el-table-column label="点餐列表">
              <template slot-scope="scope">
                <div class="returnGoodWithMoneyDialogTabTitle"><span>第{{scope.row.OA_Sort}}次点餐</span></div>
                <el-table :data="scope.row.orderDetails">
                  <el-table-column type="index" label="序号"></el-table-column>
                  <el-table-column label="菜品名称" prop="OD_FName"></el-table-column>
                  <el-table-column label="价格（元）" prop="OD_RealPrice"></el-table-column>
                  <el-table-column label="规格">
                    <template slot-scope="specs">
                      <el-tag type="warning" size="mini" v-if="specs.row.OD_Spec">{{specs.row.OD_Spec}}</el-tag>
                    </template>
                  </el-table-column>
                  <el-table-column label="属性">
                    <template slot-scope="property"  v-if="property.row.OD_PropOne != ''">
                      <span class="propertySpan" v-if="property.row.OD_PropOne != ''">
                        <el-tag type="success" size="mini">{{property.row.OD_PropOne}}</el-tag>
                      </span>
                      <span class="propertySpan" v-if="property.row.OD_PropTwo != ''">
                        <el-tag type="success" size="mini">{{property.row.OD_PropTwo}}</el-tag>
                      </span>
                    </template>
                  </el-table-column>
                  <el-table-column label="实际数量 (份)" prop="OD_RealNum"></el-table-column>
                  <el-table-column label="已下单数量 (份)" prop="OD_Num"></el-table-column>
                  <el-table-column label="已退款数量 (份)">
                    <template slot-scope="OD_Item">
                      <span v-if="OD_Item.row.OD_Num - OD_Item.row.OD_RealNum == 0">0</span>
                      <el-tag v-else type="danger">{{OD_Item.row.OD_Num - OD_Item.row.OD_RealNum}}</el-tag>
                    </template>
                  </el-table-column>
                  <el-table-column label="本次仅退餐品数量" width="170">
                    <template slot-scope="scope">
                      <el-input-number size="small" v-model="scope.row.returnNum" :min="0" :max="scope.row.OD_RealNum"></el-input-number>
                    </template>
                  </el-table-column>
                </el-table>
              </template>
            </el-table-column>
          </el-table>

          <span slot="footer" class="dialog-footer">
            <el-button @click="returnGoodWithMoneyDialogVisible = false">取 消</el-button>
            <el-button type="primary" @click="ensureReturnGood">确 定</el-button>
          </span>
        </el-dialog>
    </div>
</template>

<script>
export default {
  data () {
    return {
      O_ID: '',
      orderForm: {},
      orderPayForm: {},
      merForm: {},
      orderDetailForm: [],
      orderAddFormList: [],
      returnTotlePrice: '',
      O_PayStatue: '',
      OrderFiDisAble: true,
      OrderNotFiDisAble: true,
      OrderReturnDisAble: true,
      OrderReturnWithOutMoneyDisAble: true,
      onlyReturnGoodDialogVisible: false,
      onlyReturnGoodOrderDetailForm: [],
      returnGoodWithMoneyDialogVisible: false,
      returnGoodWithMoneyOrderDetailForm: [],
      orderReturnFormList: [],
      refundFormList: []
    }
  },
  computed: {
  },
  created () {
    this.initOrderDetailForm()
  },
  mounted () {
    window.$bus.$on('updateOrderItemSetting', (val) => {
      this.initOrderDetailForm()
    })
    window.$bus.$on('returnSuccess', (val) => {
      this.initOrderDetailForm()
    })
  },
  methods: {
    // 查询退款到账
    async refundQuery (R_ID) {
      const { data: res } = await this.$http.post('refundQuery', { R_ID: R_ID })
      if (res.meta.status !== 200) {
        this.$message.error('查询退款到账失败!')
        return
      }
      // 修改为，只更新退款部分数据
      this.getRefundFormList()
    },
    // 获取退款信息列表
    async getRefundFormList () {
      const { data: res } = await this.$http.post('getRefundFormList', { O_ID: this.O_ID })
      if (res.meta.status !== 200) {
        this.$message.error('获取退款信息失败')
        return
      }
      this.refundFormList = res.data.refundFormList
    },
    // 真正的退款请求
    async realEnsureReturnGood (value) {
      // 将下面得内容转到输入完交易密码后
      var mmngctUserName = window.sessionStorage.getItem('mmngctUserName')
      const { data: res1 } = await this.$http.post('checkTradePassword', { tradePas: value, mmngctUserName: mmngctUserName })
      if (res1.meta.status === undefined) {
        this.$message.error('验证交易密码失败!请联系管理员!')
        return
      }
      if (res1.meta.msg !== 'OK') {
        this.$message.error('交易密码错误!')
        return
      }
      // 发送请求，在失败中提示，退点餐品失败，在成功中刷新页面
      const { data: res } = await this.$http.post('returnGoodsWithMoney', { returnGoodWithMoneyOrderDetailForm: this.returnGoodWithMoneyOrderDetailForm, O_ID: this.O_ID })
      if (res.meta.status !== 201 && res.meta.status !== 200) {
        this.$message.error('退菜失败!退款失败！请联系管理员!')
        return
      }
      this.$confirm(res.meta.msg, 'Tips', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'info'
      }).then(() => {
      }).catch(() => {
      })
      this.initOrderDetailForm()
      this.returnGoodWithMoneyDialogVisible = false
    },
    ensureReturnGood () {
      // 更新orderDetail,更新order-总价，订单状态,更新加菜orderadd,插入returnOrder,插入returnOrderDetail
      // 从微信支付退款
      var returnGoodWithMoneyTotleNum = 0
      for (var index = 0; index < this.returnGoodWithMoneyOrderDetailForm.length; index++) {
        for (var innerIndex = 0; innerIndex < this.returnGoodWithMoneyOrderDetailForm[index].orderDetails.length; innerIndex++) {
          returnGoodWithMoneyTotleNum += this.returnGoodWithMoneyOrderDetailForm[index].orderDetails[innerIndex].returnNum
        }
      }
      if (returnGoodWithMoneyTotleNum === 0) {
        this.$message.info('未选择退款餐品')
      } else {
        // 先验证交易密码，成功了才可以退款，失败了，不可以操作
        this.$prompt('请输入交易密码', '', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          // 密码是6-16位字母加数字的正则表达式
          inputPattern: /^(?![0-9]+$)(?![a-zA-Z]+$)[0-9A-Za-z]{6,16}$/,
          inputErrorMessage: '密码格式不正确',
          inputType: 'password',
          closeOnClickModal: false
        }).then(({ value }) => {
          // 这里验证交易密码
          this.realEnsureReturnGood(value)
        }).catch(() => {
          // 取消时，让退款dialog一并消失
          this.returnGoodWithMoneyDialogVisible = false
        })
      }
    },
    // 退款
    returnGoodWithMoney () {
      if (this.orderPayForm.p_Trade_Type === '线下支付') {
        this.$confirm('客人订单付款方式为: 线下支付。系统未收到客人支付款项，请退菜后人工退款', 'Tips', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'info'
        }).then(() => {
          this.returnGoodWithMoneyOrderDetailForm = JSON.parse(JSON.stringify(this.orderAddFormList))
          for (var index = 0; index < this.returnGoodWithMoneyOrderDetailForm.length; index++) {
            for (var innerIndex = 0; innerIndex < this.returnGoodWithMoneyOrderDetailForm[index].orderDetails.length; innerIndex++) {
              this.$set(this.returnGoodWithMoneyOrderDetailForm[index].orderDetails[innerIndex], 'returnNum', 0)
            }
          }
          this.returnGoodWithMoneyDialogVisible = true
        }).catch(() => {
        })
      } else {
        this.returnGoodWithMoneyOrderDetailForm = JSON.parse(JSON.stringify(this.orderAddFormList))
        for (var index = 0; index < this.returnGoodWithMoneyOrderDetailForm.length; index++) {
          for (var innerIndex = 0; innerIndex < this.returnGoodWithMoneyOrderDetailForm[index].orderDetails.length; innerIndex++) {
            this.$set(this.returnGoodWithMoneyOrderDetailForm[index].orderDetails[innerIndex], 'returnNum', 0)
          }
        }
        this.returnGoodWithMoneyDialogVisible = true
      }
    },
    // 订单未完成，主动操作按钮
    async orderNotFiUnderLine () {
      const { data: res } = await this.$http.post('orderNotFiUnderLine', this.orderForm)
      if (res.meta.status !== 200) {
        if (res.meta.status !== 500) {
          this.$message.error('客户正在付款，请稍后重试!')
          return
        }
        this.$message.error('标记订单未完成失败!')
        return
      }
      this.$message.success('标记订单未完成成功!')
      this.initOrderDetailForm()
    },
    // 订单支付完成
    async orderFiUnderLine () {
      const { data: res } = await this.$http.post('orderFiUnderLine', this.orderForm)
      if (res.meta.status !== 200) {
        if (res.meta.status !== 500) {
          this.$message.error('客户正在付款，请稍后重试!')
          return
        }
        this.$message.error('标记线下支付失败!')
        return
      }
      this.$message.success('标记线下支付成功!')
      this.initOrderDetailForm()
    },
    // 接单
    async takingOrder (event, item) {
      const { data: res } = await this.$http.post('takingOrder', item)
      if (res.meta.status !== 200) {
        this.$message.error('接单失败!')
        return
      }
      this.$message.success('接单成功!')
      this.initOrderDetailForm()
    },
    async ensureOnlyReturnGood () {
      var onlyReturnGoodTotleNum = 0
      for (var index in this.onlyReturnGoodOrderDetailForm) {
        onlyReturnGoodTotleNum += this.onlyReturnGoodOrderDetailForm[index].onlyReturnNum
      }
      if (onlyReturnGoodTotleNum === 0) {
        this.$message.info('未选择退点餐品')
      } else {
        // 发送请求，在失败中提示，退点餐品失败，在成功中刷新页面
        const { data: res } = await this.$http.post('onlyReturnGoods', { onlyReturnGoodOrderDetailForm: this.onlyReturnGoodOrderDetailForm, O_ID: this.O_ID })
        if (res.meta.status !== 200) {
          this.$message.error('退点餐品失败')
          return
        }
        this.$message.success('退点餐品成功')
        this.initOrderDetailForm()
      }
      this.onlyReturnGoodDialogVisible = false
    },
    // 仅退餐品
    onlyReturnGood () {
      this.onlyReturnGoodOrderDetailForm = JSON.parse(JSON.stringify(this.orderDetailForm))
      for (var index in this.onlyReturnGoodOrderDetailForm) {
        this.$set(this.onlyReturnGoodOrderDetailForm[index], 'onlyReturnNum', 0)
      }
      this.onlyReturnGoodDialogVisible = true
    },
    // 初始化订单操作界面数据
    async initOrderDetailForm () {
      this.O_ID = this.$route.query.O_ID

      const { data: res } = await this.$http.post('orderDetails', { O_ID: this.O_ID })
      if (res.meta.status !== 200) {
        this.$message.error('获取订单详情失败')
        return
      }
      this.orderDetailForm = res.data

      const { data: res2 } = await this.$http.post('getOrderForm', { O_ID: this.O_ID })
      if (res2.meta.status !== 200) {
        this.$message.error('获取订单综合信息失败')
        return
      }
      this.orderForm = res2.data.orderForm
      this.merForm = res2.data.merForm
      // 根据最新订单情况，更新按钮
      this.OrderFiDisAble = true
      this.OrderNotFiDisAble = true
      this.OrderReturnDisAble = true
      this.OrderReturnWithOutMoneyDisAble = true
      this.O_PayStatue = this.orderForm.o_PayStatue
      if (this.O_PayStatue === 0) {
        // 未完成
        this.OrderNotFiDisAble = false
        // 已完成
        this.OrderFiDisAble = false
        // 退点
        this.OrderReturnWithOutMoneyDisAble = false
      } else if (this.O_PayStatue === 1) {
        // 退款
        this.OrderReturnDisAble = false
      } else if (this.O_PayStatue === 2 && this.orderForm.o_TotlePrice !== 0) {
        // 退款
        this.OrderReturnDisAble = false
      }

      const { data: res3 } = await this.$http.post('getOrderAddFormList', { O_ID: this.O_ID })
      if (res3.meta.status !== 200) {
        this.$message.error('获取加餐信息失败')
        return
      }
      this.orderAddFormList = res3.data.orderAddFormList

      const { data: res4 } = await this.$http.post('getOrderPayForm', { O_ID: this.O_ID })
      if (res4.meta.status !== 200) {
        this.$message.error('获取支付信息失败')
        return
      }
      this.orderPayForm = res4.data.orderPayForm

      const { data: res5 } = await this.$http.post('getOrderReturnFormList', { O_ID: this.O_ID })
      if (res5.meta.status !== 200) {
        this.$message.error('获取退菜信息失败')
        return
      }
      this.orderReturnFormList = res5.data.orderReturnFormList

      const { data: res6 } = await this.$http.post('getRefundFormList', { O_ID: this.O_ID })
      if (res6.meta.status !== 200) {
        this.$message.error('获取退款信息失败')
        return
      }
      this.refundFormList = res6.data.refundFormList
    }
  }
}
</script>

<style lang="less" scoped>
.returnGoodWithMoneyDialogTab {
  // /deep/ .el-table__header-wrapper {
  //   display: none;
  // }
  .returnGoodWithMoneyDialogTabTitle {
    color:#333;
    padding:0 5px 0 5px;
    height:45px;
    line-height:45px;
    border:1px solid #eee;display:flex;
    justify-content: space-between;
    background:rgb(233, 225, 225);
    padding-left: 30px;
    font-weight: 600;
    font-size: 16px;
  }
}
@page{
  size:  auto;   /* auto is the initial value */
  margin: 0;  /* this affects the margin in the printer settings */
}

html{
  background-color: #FFFFFF;
  margin: 0;  /* this affects the margin on the html before sending to printer */
}

body{
  border: solid 1px blue ;
  margin: 0 0 0 0; /* margin you want for the content */
}
.BillTicketWrapper {
  display: flex;
  flex-wrap: wrap;
}
.detail {
  width: 270px;
  margin-left: 0px;
  margin-right: 0px;
  padding-left: 0px;
  padding-right: 0px;
}
.ST_merName {
  text-align: center;
  font-size: 30px;
  font-weight: normal;
}
.bill-preview {
  h3 {
    margin-top: 0;
    margin-bottom: 0;

    height: 32px;
    line-height: 32px;
    background-color: #83AF9B;
    font-size: 14px;
    font-weight: normal;
    color: #fff;
    padding-left: 20px;
  }
  width:270px;
  margin-right: 50px;
  margin-bottom: 50px;
  border-bottom: #000000 dashed 1px;
}
.bottomElCard {
  margin-top: 30px;
}
.el-row {
    margin-bottom: 20px;
    &:last-child {
      margin-bottom: 0;
    }
  }
  .el-col {
    border-radius: 4px;
    margin-right: 30px;
  }
</style>
