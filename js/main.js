import beverages from "./beverages.js";
import { toKRW, toNum } from "./utils.js";

// 음료수 목록
const beveragesList = document.querySelector(".cont-lists");

// 소지금
const txtMyMoneyEl = document.querySelector(".txt-mymoney");

// 잔돈
const txtBalanceEl = document.querySelector(".txt-balance");
const btnBalanceEL = document.querySelector(".btn-balance");

// 입금
const inpCreditEl = document.querySelector(".inp-credit");
const btnCreditEl = document.querySelector(".btn-credit");

// 카트
const listCartEl = document.querySelector(".list-cart");
const btnGetEl = document.querySelector(".btn-get");

// 총금액
const txtTotalPriceEl = document.querySelector(".txt-totalPrice");

// 내가 획득한 음료
const myBeveragesList = [];

// 내가 획득한 음료 리스트
const contMyBeverageListEl = document.querySelector(".cont-myBeverageList");

// 음료수 목록 만들기
beverages.forEach((item) => {
  const beverageItem = document.createElement("li");
  if (!item["quantity"]) beverageItem.classList.add("sold-out");

  // 아이디 숨겨서
  const beverageId = document.createElement("input");
  beverageId.setAttribute("type", "hidden");
  beverageId.setAttribute("id", item["id"]);
  beverageId.setAttribute("class", "beverageId");
  beverageItem.appendChild(beverageId);

  // 수량 숨겨서
  const beverageQuantity = document.createElement("input");
  beverageQuantity.setAttribute("type", "hidden");
  beverageQuantity.setAttribute("class", "quantity");
  beverageQuantity.setAttribute("id", item["id"] + item["name"]);
  beverageQuantity.setAttribute("value", item["quantity"]);
  beverageItem.appendChild(beverageQuantity);

  // 버튼 만들고 그 안에 이미지, 이름, 가격 넣기
  const beverageBtn = document.createElement("button");
  beverageBtn.classList.add("btn-item");

  // 이미지
  const beverageImg = document.createElement("img");
  beverageImg.setAttribute("src", item["source"]);
  beverageImg.classList.add("img-item");
  beverageBtn.appendChild(beverageImg);

  // 이름
  const beverageName = document.createElement("strong");
  beverageName.textContent = item["name"];
  beverageName.classList.add("name-item");
  beverageBtn.appendChild(beverageName);

  // 가격
  const beveragePrice = document.createElement("span");
  beveragePrice.textContent = item["price"] + "원";
  beveragePrice.classList.add("price-item");
  beverageBtn.appendChild(beveragePrice);

  beverageItem.appendChild(beverageBtn);
  beveragesList.appendChild(beverageItem);
});

// 소지금 입력하기
function inputMyOwnMoney() {
  let myMoney = prompt("소지금을 입력해주세요!");

  while (true) {
    // 문자가 들어있을 경우
    if (isNaN(myMoney) && myMoney !== null) {
      alert("숫자를 입력해주세요.");
      myMoney = prompt("소지금을 입력해주세요!");
      continue;
    }

    // 취소를 눌렀을 경우
    if (myMoney === null) return (myMoney = txtMyMoneyEl.textContent);
    break;
  }

  txtMyMoneyEl.textContent = toKRW(myMoney) + " 원";
}

txtMyMoneyEl.addEventListener("click", inputMyOwnMoney);

// 입금하기
function deposit() {
  // 소지금, 잔액
  const myMoney = toNum(txtMyMoneyEl.textContent);
  const myBalance = toNum(txtBalanceEl.textContent);

  // 입금액을 입력하지 않은 경우
  if (inpCreditEl.value.length === 0) return alert("입금액을 입력해주세요.");

  // 입금액이 소지금보다 큰 경우
  if (parseInt(inpCreditEl.value, 10) > myMoney) {
    const cf = confirm("소지금이 부족합니다. 소지금을 입력 및 수정하시겠습니까?");
    if (cf) {
      inputMyOwnMoney(); // 소지금 입력하기
    }

    return (inpCreditEl.value = ""); // 다시 빈 칸
  }

  txtBalanceEl.textContent =
    toKRW(myBalance + parseInt(inpCreditEl.value, 10)) + " 원";
  txtMyMoneyEl.textContent =
    toKRW(myMoney - parseInt(inpCreditEl.value, 10)) + " 원";
  inpCreditEl.value = "";
}

btnCreditEl.addEventListener("click", deposit);
inpCreditEl.addEventListener("keyup", (e) => {
  if (e.keyCode === 13) deposit();
});


// 거스름돈 반환
btnBalanceEL.addEventListener("click", () => {
  const myBalance = toNum(txtBalanceEl.textContent);

  // 0이면 아래 더 실행안되게
  if (myBalance === 0) return;

  const myMoney = toNum(txtMyMoneyEl.textContent);

  txtBalanceEl.textContent = "0 원";
  txtMyMoneyEl.textContent = toKRW(myBalance + myMoney) + " 원";
});

// 카트 넣기
// 자판기 음료수 버튼
const beverageItemEL = beveragesList.querySelectorAll("li");

beverageItemEL.forEach((el) => {
  el.addEventListener("click", (e) => {
    // 재고가 없으면 자판기에 카트에 못담게 하기
    const beverageQuantity = el.querySelector(".quantity");
    if (beverageQuantity.value <= 0)
      return alert("자판기에 남는 재고가 없습니다.");

    // 자판기 수량 내리고 0개 되면 품절 스티커 붙이기
    beverageQuantity.value = parseInt(beverageQuantity.value, 10) - 1;
    if (beverageQuantity.value <= 0) el.classList.add("sold-out");

    // 이미 리스트에 있으면 수량만 올려주기
    const beverageCartItem = document.querySelectorAll(".cart-item");
    let change = false;
    if (beverageCartItem.length) {
      beverageCartItem.forEach((cartItem) => {
        // 자판기의 음료id와 카트의 음료id를 가져와서 있는지 확인하기
        const beverageId = el.querySelector(".beverageId").getAttribute("id");
        const beverageIdInCart = cartItem
          .querySelector(".beverageIdInCart").value;

        if (beverageId === beverageIdInCart) {
          let cartQuantity = cartItem.querySelector(".cart-quantity");
          console.log(cartQuantity.textContent);
          cartQuantity.textContent = parseInt(cartQuantity.textContent, 10) + 1;
          change = true;
        }
      });
    }

    // 카트 리스트에 없는 경우
    if (!change) {
      const cartItem = document.createElement("li");
      cartItem.classList.add("cart-item");

      // 음료수아이디 넣기
      const beverageId = el.querySelector(".beverageId").getAttribute("id");
      const beverageIdInCart = document.createElement("input");
      beverageIdInCart.setAttribute("type", "hidden");
      beverageIdInCart.setAttribute("value", beverageId);
      beverageIdInCart.setAttribute("class", "beverageIdInCart");
      cartItem.appendChild(beverageIdInCart);

      // 가격 넣기
      const beveragePrice = el.querySelector(".price-item").textContent;
      const beveragePriceInCart = document.createElement("input");
      beveragePriceInCart.setAttribute("type", "hidden");
      beveragePriceInCart.setAttribute("class", "beveragePriceInCart");
      beveragePriceInCart.setAttribute(
        "value",
        beveragePrice.slice(0, beveragePrice.length - 1)
      );
      cartItem.appendChild(beveragePriceInCart);

      // 이미지 넣기
      const img = el.querySelector(".img-item").getAttribute("src");
      const cartImg = document.createElement("img");
      cartImg.setAttribute("src", img);
      cartItem.appendChild(cartImg);

      // 음료 이름 넣기
      const name = el.querySelector(".name-item").textContent;
      const cartName = document.createElement("strong");
      cartName.classList.add("cart-name");
      cartName.textContent = name;
      cartItem.appendChild(cartName);

      // 수량 넣기
      const cartItemQuantity = document.createElement("span");
      cartItemQuantity.classList.add("cart-quantity");
      cartItemQuantity.textContent = 1;
      cartItem.appendChild(cartItemQuantity);

      listCartEl.append(cartItem);
      updateCartListItem();
    }
  });
});

// 카트 리스트 수량 내리고 자판기 수량 올리고 카트 리스트 아이템의 수량 0이 되면 제거
function updateCartListItem() {
  const cartListItem = listCartEl.querySelectorAll("li");

  // 카트 아이템이 들어오면 가장 최신 카트 아이템에 이벤트 리스너 설정
  const lastedCartItem = cartListItem[cartListItem.length - 1];
  const beverageIdInCart = lastedCartItem
    .querySelector(".beverageIdInCart").value;

  const beverageNameInCart =
    lastedCartItem.querySelector(".cart-name").textContent;
  const beravegeQuantityInCart = lastedCartItem.querySelector(".cart-quantity");

  // 벤딩 아이템의 수량 input을 찾아서 value값 증가 및 카트 아이템의 수량 감소
  lastedCartItem.addEventListener("click", () => {
    const vendingItemQuantity = document.querySelector(
      "#" + beverageIdInCart + beverageNameInCart
    );
    vendingItemQuantity.value = parseInt(vendingItemQuantity.value, 10) + 1;
    beravegeQuantityInCart.textContent =
      parseInt(beravegeQuantityInCart.textContent, 10) - 1;

    // 만약 카트 아이템의 수량이 0이 되면 카트 리스트에서 제거
    if (beravegeQuantityInCart.textContent === "0") {
      listCartEl.removeChild(lastedCartItem);
    }
    if (vendingItemQuantity.value > 0) {
      vendingItemQuantity.parentNode.classList.remove("sold-out");
    }
  });
}

// 내가 획득한 음료 구현(획득 버튼 구현)
btnGetEl.addEventListener("click", () => {
  const cartItems = document.querySelectorAll(".cart-item");
  const myBalance = toNum(txtBalanceEl.textContent.split(" ")[0]); // 내 잔액

  // 총 가격 비교하고 아니면 그냥 리턴
  let totalPrice = 0; // 총 가격 가져오기
  cartItems.forEach((el) => {
    const price = el.querySelector(".beveragePriceInCart").value;
    const quantity = el.querySelector(".cart-quantity").textContent;
    // 총가격
    totalPrice =
      parseInt(totalPrice, 10) + parseInt(price, 10) * parseInt(quantity, 10);
  });
  
  if (myBalance < totalPrice) return alert("소지금이 부족합니다");

  // 잔액에서 총 구매가격 빼기
  txtBalanceEl.textContent = toKRW(myBalance - totalPrice) + " 원";

  // 획득한 음료가 만약 목록에 있으면 수량만 올리고 아니면 리스트에 추가
  cartItems.forEach((el) => {
    const beverageId = el.querySelector(".beverageIdInCart").value;
    const beverageName = el.querySelector(".cart-name").textContent;
    const beverageSource = el.querySelector("img").src;
    const beveragePrice = el.querySelector(".beveragePriceInCart").value;
    const beverageQuantityInCart =
      el.querySelector(".cart-quantity").textContent;

    // myBeveragesList 루프 돌면서 같은 아이디 있으면 카트에 있는 수량만 증가
    let changeQuantity = false;
    for (let i = 0; i < myBeveragesList.length; i++) {
      if (
        myBeveragesList[i]["beverageId"] === beverageId
      ) {
        myBeveragesList[i]["beverageQuantity"] =
          parseInt(myBeveragesList[i]["beverageQuantity"], 10) +
          parseInt(beverageQuantityInCart, 10);
        changeQuantity = true;
      }
    }

    // myBeverageList에서 없다면 추가
    if (!changeQuantity) {
      myBeveragesList.push({
        beverageId,
        beverageName,
        beverageSource,
        beveragePrice: parseInt(beveragePrice, 10),
        beverageQuantity: parseInt(beverageQuantityInCart, 10),
      });
    }

    // 카트 리스트에서 카트 아이템 제거
    listCartEl.removeChild(el);
  });

  // 획득한 음료 리스트에 엘리먼트 렌더링
  renderMyBeverageList();
});

// 획득한 음료 리스트 렌더링
function renderMyBeverageList() {
  // 음료 리스트 제거
  while (contMyBeverageListEl.hasChildNodes()) {
    contMyBeverageListEl.removeChild(contMyBeverageListEl.firstChild);
  }

  // 다시 리렌더링
  let myTotalPrice = 0;
  myBeveragesList.forEach((item) => {
    const myBeverageLi = document.createElement("li");
    myBeverageLi.classList.add("item-myBeverage");

    const myBeverageImgEl = document.createElement("img");
    myBeverageImgEl.classList.add("img-myBeverage");
    myBeverageImgEl.src = item["beverageSource"];
    myBeverageLi.appendChild(myBeverageImgEl);

    const myBeverageNameEl = document.createElement("strong");
    myBeverageNameEl.classList.add("name-myBeverage");
    myBeverageNameEl.textContent = item["beverageName"];
    myBeverageLi.appendChild(myBeverageNameEl);

    const myBeverageQuantityEl = document.createElement("span");
    myBeverageQuantityEl.classList.add("quantity-myBeverage");
    myBeverageQuantityEl.textContent = item["beverageQuantity"];
    myBeverageLi.appendChild(myBeverageQuantityEl);

    contMyBeverageListEl.appendChild(myBeverageLi);

    // 내가 구매한 총가격 구하기
    myTotalPrice = myTotalPrice + item["beverageQuantity"] * item["beveragePrice"];
  });

  txtTotalPriceEl.textContent = toKRW(myTotalPrice);
}
