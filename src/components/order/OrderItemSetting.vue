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
                <el-tag v-if="scope.row.o_PayStatue == 2 && scope.row.O_TotlePrice == 0" type="warning">全额退款</el-tag>
                <el-tag v-if="scope.row.o_PayStatue == 2 && scope.row.O_TotlePrice != 0" type="warning">部分退款</el-tag>
                <el-tag v-if="scope.row.o_PayStatue == 3" type="info">未完成</el-tag>
              </template>
            </el-table-column>
            <el-table-column label="下单时间" prop="o_OrderingTime" width="230"></el-table-column>
            <el-table-column label="支付时间" prop="o_PayTime" width="230"></el-table-column>
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
              <el-button :disabled="OrderFiDisAble" type="warning">订单支付完成</el-button>
            </el-col>
            <el-col :span="2" :lg="3" :md="3" :sm="3" :xs="3">
              <el-button :disabled="OrderNotFiDisAble" type="warning">订单未完成</el-button>
            </el-col>
            <el-col :span="3" :lg="4" :md="4" :sm="4" :xs="4">
              <el-button :disabled="OrderReturnDisAble" type="danger">退 款</el-button>
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
            <el-button style="margin-left:30px;" type="primary" v-print="'#'+ 'printMT' + item.OA_Sort">打印本次餐厅底票</el-button>
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
          <el-divider content-position="left">退菜列表</el-divider>
          <div></div>
        </el-card>

        <el-card class="bottomElCard">
          <el-divider content-position="left">支付信息</el-divider>
          <div v-if="JSON.stringify(orderPayForm) != '{}'">
            <span style="margin-left:20px;font-size:15px;color:#909399;font-weight:bold;"><label>支付时间: </label><label style="font-size:20px;color:#F56C6C;">{{orderPayForm.p_Time_End}}</label></span>
            <span style="margin-left:20px;font-size:15px;color:#909399;font-weight:bold;"><label>支付金额: </label><label style="font-size:20px;color:#F56C6C;">{{orderPayForm.p_Totle_Fee/100}}</label> 元</span>
            <el-button style="margin-left:30px;" type="primary" v-print="'#printPT'">打印支付票据</el-button>
            <el-table :data="[orderPayForm]" :border="false" :stripe="false">
              <el-table-column type="index"></el-table-column>
              <el-table-column label="支付单号" prop="p_Transaction_Id"></el-table-column>
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
          <el-divider content-position="left">退款信息</el-divider>
          <div></div>
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
                <p><label>客人备注:</label><label style="font-size:13px;margin-left:10px;">{{orderForm.o_Remarks}}</label></p>
                <p>*****************商品***************</p>
                <div v-for="item in orderDetailForm"><!-- eslint-disable-line -->
                  <p>
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
                <p><label>支付时间:</label><label style="font-size:13px;margin-left:10px;">{{orderForm.o_PayTime}}</label></p>
                <p><label>餐桌区域:</label><label style="font-size:13px;margin-left:10px;">{{orderForm.TT_Name}}</label></p>
                <p><label>餐桌:</label><label style="font-size:13px;margin-left:10px;">{{orderForm.t_Name}}</label></p>
                <p><label>用餐人数:</label><label style="font-size:13px;margin-left:10px;">{{orderForm.o_NumberOfDiners}}人</label></p>
                <div style="border-bottom:#000 dashed 1px;"></div>
                <p><label>客人备注:</label><label style="font-size:13px;margin-left:10px;">{{orderForm.o_Remarks}}</label></p>
                <p>*****************商品***************</p>
                <div v-for="item in orderDetailForm"><!-- eslint-disable-line -->
                  <p>
                    <label style="font-size:23px;">{{item.name}}</label><label style="font-size:17px;margin-left:10px;"><em> {{item.specs}}</em><em v-for="proItem in item.property"> {{proItem}}</em></label><!-- eslint-disable-line -->
                  </p>
                  <p>
                    <label  style="margin-left:150px"><span style="font-size:22px;">【<span style="font-size:20px;">x</span></span><span style="font-size:30px;">{{item.OD_RealNum}}</span><span style="font-size:22px;">】</span></label>
                  </p>
                </div>
                <p>*************************************</p>
              </div>
            </div>

            <div class="bill-preview">
              <h3>餐厅底票预览</h3>
              <div id="printMT" class="detail">
                <p style="text-align:center;font-size:25px">餐厅底票</p>
                <h1 class="ST_merName">{{merForm.m_Name}}</h1>
                <br/>
                <hr/><!-- 分割线 -->
                <p><label>单号:</label><label>100006032</label></p>
                <p><label>交易时间:</label><label>2021-01-09 13:29:23</label></p>
                <hr/><!-- 分割线 -->
                <div v-for="item in orderDetailForm"><!-- eslint-disable-line -->
                  <p>
                    <label>{{item.name}}</label><em> {{item.specs}}</em><em v-for="proItem in item.property"> {{proItem}}</em><!-- eslint-disable-line -->
                  </p>
                  <p>
                    <label  style="margin-right:30px;margin-left:120px">x{{item.OD_RealNum}}</label><label>￥{{item.price}}</label>
                  </p>
                </div>
                <hr/>
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
                <p><label style="margin-left:10px;font-size:17px;">支付金额:</label><label style="font-size:15px;margin-left:10px;">{{orderPayForm.p_Totle_Fee/100}} 元</label></p>
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
                <p style="text-align:center;font-size:25px">客人小票</p>
                <h1 class="ST_merName">{{merForm.m_Name}}</h1>
                <br/>
                <hr/><!-- 分割线 -->
                <p><label>单号:</label><label>100006032</label></p>
                <p><label>交易时间:</label><label>2021-01-09 13:29:23</label></p>
                <hr/><!-- 分割线 -->
                <div v-for="item2 in item.orderDetails"><!-- eslint-disable-line -->
                  <p>
                    <label>{{item2.OD_FName}}</label><em> {{item2.OD_Spec}}</em><em v-if="item2.OD_PropOne != ''"> {{item2.OD_PropOne}}</em><em v-if="item2.OD_PropTwo != ''"> {{item2.OD_PropTwo}}</em>
                  </p>
                  <p>
                    <label  style="margin-right:30px;margin-left:120px">x{{item2.OD_RealNum}}</label><label>￥{{item2.OD_RealPrice}}</label>
                  </p>
                </div>
                <hr/>
              </div>
            </div>

            <div class="bill-preview" v-for="item in orderAddFormList" :key="item.OA_ID + '1'">
              <h3>第 {{item.OA_Sort}} 次点菜 厨房餐票预览</h3>
              <div :id="'printKT' + item.OA_Sort" class="detail">
                <p style="text-align:center;font-size:25px">厨房餐票</p>
                <h1 class="ST_merName">{{merForm.m_Name}}</h1>
                <br/>
                <hr/><!-- 分割线 -->
                <p><label>单号:</label><label>100006032</label></p>
                <p><label>交易时间:</label><label>2021-01-09 13:29:23</label></p>
                <hr/><!-- 分割线 -->
                <div v-for="item2 in item.orderDetails"><!-- eslint-disable-line -->
                  <p>
                    <label>{{item2.OD_FName}}</label><em> {{item2.OD_Spec}}</em><em v-if="item2.OD_PropOne != ''"> {{item2.OD_PropOne}}</em><em v-if="item2.OD_PropTwo != ''"> {{item2.OD_PropTwo}}</em>
                  </p>
                  <p>
                    <label  style="margin-right:30px;margin-left:120px">x{{item2.OD_RealNum}}</label><label>￥{{item2.OD_RealPrice}}</label>
                  </p>
                </div>
                <hr/>
              </div>
            </div>

            <div class="bill-preview" v-for="item in orderAddFormList" :key="item.OA_ID + '2'">
              <h3>第 {{item.OA_Sort}} 次点菜 餐厅底票预览</h3>
              <div :id="'printMT' + item.OA_Sort" class="detail">
                <p style="text-align:center;font-size:25px">餐厅底票</p>
                <h1 class="ST_merName">{{merForm.m_Name}}</h1>
                <br/>
                <hr/><!-- 分割线 -->
                <p><label>单号:</label><label>100006032</label></p>
                <p><label>交易时间:</label><label>2021-01-09 13:29:23</label></p>
                <hr/><!-- 分割线 -->
                <div v-for="item2 in item.orderDetails"><!-- eslint-disable-line -->
                  <p>
                    <label>{{item2.OD_FName}}</label><em> {{item2.OD_Spec}}</em><em v-if="item2.OD_PropOne != ''"> {{item2.OD_PropOne}}</em><em v-if="item2.OD_PropTwo != ''"> {{item2.OD_PropTwo}}</em>
                  </p>
                  <p>
                    <label  style="margin-right:30px;margin-left:120px">x{{item2.OD_RealNum}}</label><label>￥{{item2.OD_RealPrice}}</label>
                  </p>
                </div>
                <hr/>
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
      printObj: {
        id: 'printMe',
        popTitle: 'good print',
        extraCss: '',
        extraHead: '<meta http-equiv="Content-Language"content="zh-cn"/>'
      },
      onlyReturnGoodDialogVisible: false,
      onlyReturnGoodOrderDetailForm: []
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
  },
  methods: {
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
      } else if (this.O_PayStatue === 2) {
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
    }
  }
}
</script>

<style lang="less" scoped>
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
