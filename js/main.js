import beverages from "./beverages.js";

const beveragesList = document.querySelector(".cont-lists");

// 음료수 목록 만들기
beverages.forEach(item => {
  const beverageItem = document.createElement("li");
  let count = 0;

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
  beverageImg.classList.add("img-item")
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