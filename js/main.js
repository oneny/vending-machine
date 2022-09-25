import beverages from "./beverages.js";
import { toKRW } from "./utils.js";

const beveragesList = document.querySelector(".cont-lists");
const txtMyMoneyEl = document.querySelector(".txt-mymoney");

// 음료수 목록 만들기
beverages.forEach(item => {
  const beverageItem = document.createElement("li");
  if (!item["quantity"]) beverageItem.classList.add("sold-out");

  // 아이디 숨겨서
  const beverageId = document.createElement("input");
  beverageId.setAttribute("type", "hidden");
  beverageId.setAttribute("id", item["id"]);
  beverageId.setAttribute("value", item["id"]);
  beverageItem.appendChild(beverageId);
  
  // 수량 숨겨서
  const beverageQuantity = document.createElement("input");
  beverageQuantity.setAttribute("type", "hidden");
  beverageQuantity.setAttribute("id", item["id"] + item["Name"]);
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
    if (myMoney === null) myMoney = "0";
    break;
  }

  e.target.textContent = toKRW(myMoney) + " 원";
});
