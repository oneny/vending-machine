import beverages from "./beverages.js";
import { toKRW, toNum } from "./utils.js";

// 거스름돈
const beveragesList = document.querySelector(".cont-lists");
const txtMyMoneyEl = document.querySelector(".txt-mymoney");

// 잔돈
const txtBalanceEl = document.querySelector(".txt-balance");
const btnBalanceEL = document.querySelector(".btn-balance");

// 입금
const inpCreditEl = document.querySelector(".inp-credit");
const btnCreditEl = document.querySelector(".btn-credit");

// 카트
const listCartEl = document.querySelector(".list-cart");

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
txtMyMoneyEl.addEventListener("click", (e) => {
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

  e.target.textContent = toKRW(myMoney) + " 원";
});

// 입금하기
btnCreditEl.addEventListener("click", () => {
  // 소지금, 잔액
  const myMoney = parseInt(toNum(txtMyMoneyEl.textContent), 10);
  const myBalance = parseInt(toNum(txtBalanceEl.textContent), 10);

  // 입금액을 입력하지 않은 경우
  if (inpCreditEl.value.length === 0) return alert("입금액을 입력해주세요.");
  
  if (parseInt(inpCreditEl.value, 10) > myMoney) {
    alert("소지금이 부족합니다.");
    return (inpCreditEl.value = "");
  }

  txtBalanceEl.textContent =
    toKRW(myBalance + parseInt(inpCreditEl.value, 10)) + " 원";
  txtMyMoneyEl.textContent =
    toKRW(myMoney - parseInt(inpCreditEl.value, 10)) + " 원";
  inpCreditEl.value = "";
});

// 거스름돈 반환
btnBalanceEL.addEventListener("click", () => {
  const myBalance = parseInt(toNum(txtBalanceEl.textContent), 10);
  
  // 0이면 아래 더 실행안되게
  if (myBalance === 0) return;

  const myMoney = parseInt(toNum(txtMyMoneyEl.textContent), 10);

  txtBalanceEl.textContent = "0 원";
  txtMyMoneyEl.textContent = toKRW(myBalance + myMoney);
});

// 카트 넣기
// 자판기 음료수 버튼
const beverageItemEL = beveragesList.querySelectorAll("li");

beverageItemEL.forEach((el) => {
  el.addEventListener("click", (e) => {

    // 이미 리스트에 있으면 수량만 올려주기
    const beverageCartItem = document.querySelectorAll(".cart-item");
    let change = false;
    if (beverageCartItem.length) {
      beverageCartItem.forEach((cartItem) => {
        // 자판기의 음료id와 카트의 음료id를 가져와서 있는지 확인하기
        const beverageId = el.querySelector(".beverageId").getAttribute("id");
        const beverageIdInCart = cartItem.querySelector(".beverageIdInCart").getAttribute("id");

        if (beverageId === beverageIdInCart) {
          let cartQuantity = cartItem.querySelector(".cart-quantity");
          console.log(cartQuantity);
          cartQuantity.textContent = parseInt(cartQuantity.textContent, 10) + 1;
          change = true;
        }
      });
    }

    // 재고가 없으면 자판기에 카트에 못담게 하기
    const beverageQuantity = el.querySelector(".quantity").value;
    if (beverageQuantity <= 0) {
      return alert("자판기에 남는 재고가 없습니다.");
    } else if (!change) {
      const cartItem = document.createElement("li");
      cartItem.classList.add("cart-item");

      // 음료수아이디 넣기
      const beverageId = el.querySelector(".beverageId").getAttribute("id");
      const beverageIdInCart = document.createElement("input");
      beverageIdInCart.setAttribute("type", "hidden");
      beverageIdInCart.setAttribute("id", beverageId);
      beverageIdInCart.setAttribute("class", "beverageIdInCart");
      cartItem.appendChild(beverageIdInCart);

      // 이미지 넣기
      const img = el.querySelector(".img-item").getAttribute("src");
      const cartImg = document.createElement("img");
      cartImg.setAttribute("src", img);
      cartItem.appendChild(cartImg);

      // 음료 이름 넣기
      const name = el.querySelector(".name-item").textContent;
      const cartName = document.createElement("strong");
      cartName.textContent = name;
      cartItem.appendChild(cartName);

      // 수량
      const cartItemQuantity = document.createElement("span");
      cartItemQuantity.classList.add("cart-quantity");
      cartItemQuantity.textContent = 0;
      cartItem.appendChild(cartItemQuantity);

      listCartEl.append(cartItem);
    }
  });
})