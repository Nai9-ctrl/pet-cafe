// 商品数据
const petGoods = [
  {id:1,name:"主食猫罐头",desc:"慕斯质地，营养补水",price:18},
  {id:2,name:"猫咪逗猫棒",desc:"羽毛款，解闷神器",price:15},
  {id:3,name:"四季猫窝",desc:"柔软透气，可水洗",price:69},
  {id:4,name:"宠物指甲剪",desc:"安全防剪血线",price:22},
  {id:5,name:"狗狗益生菌",desc:"调理肠胃软便",price:35},
  {id:6,name:"飞盘玩具",desc:"户外互动耐咬",price:26},
  {id:7,name:"冻干零食",desc:"鸡胸肉冻干",price:42},
  {id:8,name:"猫抓板",desc:"瓦楞纸耐磨",price:29},
];
const coffeeList = [
  {id:101,name:"拿铁",desc:"奶香浓郁，咖啡柔和，适合新手入门",price:22},
  {id:102,name:"美式咖啡",desc:"清爽纯粹，微苦回甘，黑咖啡爱好者首选",price:18},
  {id:103,name:"Dirty",desc:"先苦后甜，冷热碰撞，咖啡老饕必点",price:26},
  {id:104,name:"耶加雪菲手冲",desc:"柑橘调，茉莉花香气，果酸明亮",price:30},
  {id:105,name:"澳白",desc:"奶泡绵密，咖啡风味突出",price:24},
  {id:106,name:"红茶拿铁",desc:"茶香柔和，不含咖啡因",price:20},
  {id:107,name:"燕麦拿铁",desc:"燕麦奶基底，顺滑低负担",price:25},
  {id:108,name:"宠物奶油杯",desc:"毛孩子专属，无乳糖",price:16,noSpec:true},
];
// 全局变量
let cart = JSON.parse(localStorage.getItem("cart")) || [];
let orderList = JSON.parse(localStorage.getItem("orderList")) || [];
let userInfo = JSON.parse(localStorage.getItem("userInfo")) || null;
let currentCoffee = null;
let selectSpec = {temp:"热",ice:"正常冰",sugar:"全糖",num:1};

// 页面切换
const $ = s=>document.querySelector(s);
const $$ = s=>document.querySelectorAll(s);
function switchPage(pageName){
  $$(".page").forEach(p=>p.classList.remove("active"));
  $(`.${pageName}-page`).classList.add("active");
  $$(".tab-item").forEach(t=>t.classList.remove("active"));
  $$(`.tab-item[data-page="${pageName}"]`)[0]?.classList.add("active");
}
// 购物车角标刷新
function refreshBadge(){
  const total = cart.reduce((sum,item)=>sum+item.num,0);
  $(".cart-badge").textContent = total;
  $(".float-badge").textContent = total;
  if(total>0){
    $(".cart-badge").classList.remove("hide");
    $(".float-badge").classList.remove("hide");
  }else{
    $(".cart-badge").classList.add("hide");
    $(".float-badge").classList.add("hide");
  }
}
// 渲染宠物用品
function renderPetGoods(){
  const wrap = $("#petGoodsList");
  wrap.innerHTML = petGoods.map(item=>`
    <div class="goods-item">
      <div class="goods-name">${item.name}</div>
      <div class="goods-desc">${item.desc}</div>
      <div class="goods-price">¥${item.price}</div>
      <button class="add-btn" data-id="${item.id}">加入购物车</button>
    </div>`).join("");
  wrap.querySelectorAll(".add-btn").forEach(btn=>{
    btn.onclick = ()=>{
      const goods = petGoods.find(g=>g.id == btn.dataset.id);
      addCart({...goods,spec:""});
    }
  })
}
// 渲染咖啡
function renderCoffee(){
  const wrap = $("#coffeeList");
  wrap.innerHTML = coffeeList.map(item=>`
    <div class="goods-item">
      <div class="goods-name">${item.name}</div>
      <div class="goods-desc">${item.desc}</div>
      <div class="goods-price">¥${item.price}</div>
      <button class="add-btn" data-id="${item.id}">加入购物车</button>
    </div>`).join("");
  wrap.querySelectorAll(".add-btn").forEach(btn=>{
    btn.onclick = ()=>{
      const coffee = coffeeList.find(c=>c.id == btn.dataset.id);
      if(coffee.noSpec){
        addCart({...coffee,spec:""});
      }else{
        currentCoffee = coffee;
        selectSpec = {temp:"热",ice:"正常冰",sugar:"全糖",num:1};
        $(".ice-row").classList.add("hide");
        $("#buyNum").value = 1;
        $$(".spec-option").forEach(o=>o.classList.remove("active"));
        $$(".temp-group .spec-option")[0].classList.add("active");
        $$(".ice-group .spec-option")[0].classList.add("active");
        $$(".sugar-group .spec-option")[0].classList.add("active");
        $("#specMask").classList.remove("hide");
      }
    }
  })
}
// 加入购物车
function addCart(item){
  const idx = cart.findIndex(c=>c.id===item.id && c.spec===item.spec);
  if(idx>-1){
    cart[idx].num += item.num || 1;
  }else{
    cart.push({...item,num:item.num||1});
  }
  saveCart();
  refreshBadge();
  showToast("已加入购物车");
}
function saveCart(){
  localStorage.setItem("cart",JSON.stringify(cart));
}
// 渲染购物车
function renderCart(){
  const wrap = $("#cartList");
  if(cart.length === 0){
    $("#cartEmpty").classList.remove("hide");
    wrap.innerHTML = "";
    $("#totalPrice").textContent = "0.00";
    return;
  }
  $("#cartEmpty").classList.add("hide");
  wrap.innerHTML = cart.map((item,i)=>`
    <div class="cart-item">
      <div class="cart-info">
        <div class="cart-name">${item.name}</div>
        ${item.spec?`<div class="cart-spec">${item.spec}</div>`:""}
        <div class="cart-price">¥${item.price}</div>
      </div>
      <div class="cart-num">
        <button class="minus" data-idx="${i}">-</button>
        <span>${item.num}</span>
        <button class="plus" data-idx="${i}">+</button>
      </div>
    </div>`).join("");
  let total = cart.reduce((sum,item)=>sum + item.price*item.num,0);
  $("#totalPrice").textContent = total.toFixed(2);
  wrap.querySelectorAll(".minus").forEach(b=>b.onclick=()=>{
    const i = +b.dataset.idx;
    cart[i].num--;
    if(cart[i].num <=0) cart.splice(i,1);
    saveCart();renderCart();refreshBadge();
  })
  wrap.querySelectorAll(".plus").forEach(b=>b.onclick=()=>{
    const i = +b.dataset.idx;
    cart[i].num++;
    saveCart();renderCart();refreshBadge();
  })
}
// 结算页面
function renderCheck(){
  const wrap = $("#checkList");
  wrap.innerHTML = cart.map(item=>`
    <div class="cart-item">
      <div class="cart-info">
        <div class="cart-name">${item.name}</div>
        ${item.spec?`<div class="cart-spec">${item.spec}</div>`:""}
        <div class="cart-price">¥${item.price} × ${item.num}</div>
      </div>
    </div>`).join("");
  let total = cart.reduce((sum,item)=>sum + item.price*item.num,0);
  $("#checkTotal").textContent = total.toFixed(2);
}
// 提交订单（模拟支付）
function submitOrder(){
  if(cart.length===0) return showToast("购物车为空");
  const remark = $("#remarkInput").value.slice(0,100);
  const newOrder = {
    id:Date.now(),
    goods:[...cart],
    remark,
    total: cart.reduce((sum,item)=>sum + item.price*item.num,0),
    time:new Date().toLocaleString(),
    status:"支付成功（模拟）"
  }
  orderList.unshift(newOrder);
  localStorage.setItem("orderList",JSON.stringify(orderList));
  cart = [];
  saveCart();refreshBadge();
  showToast("模拟支付成功");
  setTimeout(()=>{switchPage("order-list");renderOrder();},1200);
}
// 订单列表
function renderOrder(){
  const wrap = $("#orderList");
  if(orderList.length===0){
    $("#orderEmpty").classList.remove("hide");
    wrap.innerHTML = "";
    return;
  }
  $("#orderEmpty").classList.add("hide");
  wrap.innerHTML = orderList.map(o=>`
    <div class="order-item">
      <div class="order-top">
        <span>订单号：${o.id}</span>
        <span class="order-status">${o.status}</span>
      </div>
      <div class="order-goods">${o.goods.map(g=>g.name+(g.spec?`(${g.spec})`:"")).join("、")}</div>
      <div>合计：¥${o.total.toFixed(2)}</div>
      <div style="font-size:12px;color:#999;margin-top:4px">${o.time}</div>
      ${o.remark?`<div class="order-remark">备注：${o.remark}</div>`:""}
    </div>`).join("");
}
// 登录
function login(){
  userInfo = {name:"宠友",avatar:"👤"};
  localStorage.setItem("userInfo",JSON.stringify(userInfo));
  $("#userName").textContent = userInfo.name;
  $("#logoutBtn").classList.remove("hide");
}
function logout(){
  userInfo = null;
  localStorage.removeItem("userInfo");
  $("#userName").textContent = "点击登录";
  $("#logoutBtn").classList.add("hide");
}
// Toast
function showToast(txt){
  $("#toast").textContent = txt;
  $("#toast").classList.remove("hide");
  setTimeout(()=>$("#toast").classList.add("hide"),1600);
}
// 初始化
function init(){
  // tab切换
  $$(".tab-item").forEach(t=>{
    t.onclick = ()=>switchPage(t.dataset.page);
  })
  // 跳转按钮
  $$("[data-goto]").forEach(el=>{
    el.onclick = ()=>switchPage(el.dataset.goto);
  })
  // 咖啡规格弹窗
  $$(".temp-group .spec-option").forEach(o=>{
    o.onclick = ()=>{
      $$(".temp-group .spec-option").forEach(x=>x.classList.remove("active"));
      o.classList.add("active");
      selectSpec.temp = o.dataset.val;
      if(o.dataset.val === "冰") $(".ice-row").classList.remove("hide");
      else $(".ice-row").classList.add("hide");
    }
  })
  $$(".ice-group .spec-option").forEach(o=>{
    o.onclick = ()=>{
      $$(".ice-group .spec-option").forEach(x=>x.classList.remove("active"));
      o.classList.add("active");
      selectSpec.ice = o.dataset.val;
    }
  })
  $$(".sugar-group .spec-option").forEach(o=>{
    o.onclick = ()=>{
      $$(".sugar-group .spec-option").forEach(x=>x.classList.remove("active"));
      o.classList.add("active");
      selectSpec.sugar = o.dataset.val;
    }
  })
  $(".num-minus").onclick = ()=>{
    let v = +$("#buyNum").value;
    if(v>1) $("#buyNum").value = v-1;
  }
  $(".num-plus").onclick = ()=> $("#buyNum").value = +$("#buyNum").value +1;
  $(".modal-cancel").onclick = ()=>$("#specMask").classList.add("hide");
  $(".modal-confirm").onclick = ()=>{
    selectSpec.num = +$("#buyNum").value;
    let specText = `${selectSpec.temp}`;
    if(selectSpec.temp === "冰") specText += `/${selectSpec.ice}`;
    specText += `/${selectSpec.sugar}`;
    addCart({...currentCoffee,spec:specText,num:selectSpec.num});
    $("#specMask").classList.add("hide");
  }
  // 快捷备注标签
  $$(".quick-tag span").forEach(tag=>{
    tag.onclick = ()=>{
      const val = $("#remarkInput").value;
      $("#remarkInput").value = val + (val?" ":"") + tag.dataset.text;
    }
  })
  $("#goCheck").onclick = ()=>{switchPage("check");renderCheck();}
  $("#payBtn").onclick = submitOrder;
  $("#userName").onclick = ()=>{if(!userInfo) login();}
  $("#logoutBtn").onclick = logout;
  // 渲染
  renderPetGoods();
  renderCoffee();
  renderCart();
  renderOrder();
  refreshBadge();
  if(userInfo){
    $("#userName").textContent = userInfo.name;
    $("#logoutBtn").classList.remove("hide");
  }
}
init();
