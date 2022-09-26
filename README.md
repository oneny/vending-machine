# 벤딩 머신

### [데모 사이트](http://127.0.0.1:5500/vending-machine/index.html)

### 기능 구현

<details>
  <summary>자판기 음료수 목록 만들기</summary>

[코드 보러가기](https://github.com/oneny/vending-machine/blob/main/js/main.js#L29)

```html
<ul class="cont-lists">
  <!-- 음료수 목록 -->
</ul>
```

```js
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
```

- [beverages.js](https://github.com/oneny/vending-machine/blob/main/js/beverages.js)에서 음료수 데이터를 불러와 `ul.cont-list`의 자식 요소로 렌더링되도록 작성했다.

</details>

<details>
  <summary>자판기 음료수 버튼</summary>

[코드 보러가기](https://github.com/oneny/vending-machine/blob/main/js/main.js#L136)

```js
const beverageItemEL = beveragesList.querySelectorAll("li");

beverageItemEL.forEach((el) => {
  el.addEventListener("click", (e) => {
    //...

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
    // ...

  }
}
```

- 음료수 목록에 있는 음료수 id와 카트 목록에 있는 음료수 id를 카트 아이템들을 루프 돌면서 같은 id가 있으면 카트 리스트에 추가하지 않고 수량만 올릴 수 있도록 작성했다.
  - 카트 리스트의 음료수 id: `const beverageIdInCart = cartItem.querySelector(".beverageIdInCart").getAttribute("id");`
  - 자판기 리스트의 음료수 id: `const beverageIdInCart = cartItem.querySelector(".beverageIdInCart").value;`

```html
<ul class="list-cart">
  <!-- 음료수 장바구니 리스트 -->
</ul>
```

```js
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

  // ...

  listCartEl.append(cartItem);
  updateCartListItem();
}
```

- `!change`는 id가 같은 것이 없다면 새로운 음료수가 카트에 추가된 것이므로 해당 코드처럼 `ul.list-cart`의 자식 요소로 렌더링되도록 작성했다.
- `updateCartListItem()` 함수는 새로운 `li` 자식 요소가 생기면 해당 요소에 이벤트를 설정하는 로직을 작성했다.
</details>

<details>
  <summary>카트 리스트 버튼</summary>

[코드 보러가기](https://github.com/oneny/vending-machine/blob/main/js/main.js#L218)

```js
// 카트 리스트 수량 내리고 자판기 수량 올리고 카트 리스트 아이템의 수량 0이 되면 제거
function updateCartListItem() {
  const cartListItem = listCartEl.querySelectorAll("li");

  // 카트 아이템이 들어오면 가장 최신 카트 아이템에 이벤트 리스너 설정
  const lastedCartItem = cartListItem[cartListItem.length - 1];
  const beverageIdInCart =
    lastedCartItem.querySelector(".beverageIdInCart").value;

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
```

- 요구사항에서 버튼 누르면 카트 리스트에 아이템 1개씩 추가되는 것은 있었지만 해당 요구사항은 없어서 추가적으로 만들어 봤다.
- `const lastedCartItem = cartListItem[cartListItem.length - 1];`를 통해서 가장 최근에 들어온 `li` 요소에 이벤트 설정이 가도록 작성했다.
  - 이렇게 하지 않고 그냥 `forEach`문을 사용하면 이전의 `li` 요소의 이벤트가 중복으로 계속 생긴다.
- `if (beravegeQuantityInCart.textContent === "0") {}`
  - 카트 아이템의 수량이 0이 되면 카트 리스트에서 제거되도록 작성했다.
- `if (vendingItemQuantity.value > 0) {}`
  - 자판기 음료수의 수량이 0이 되면 품절 스티커가 붙는데 카트에서 수량 하나 줄이면 1개가 되므로 품절 스티커 없애도록 작성했다.

</details>

<details>
  <summary>획득 버튼 구현</summary>

[코드 보러가기](https://github.com/oneny/vending-machine/blob/main/js/main.js#L250)

```js
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
```

- 획득 하기 전에 총 가격을 구하고 그 가격이 잔액보다 크다면 그냥 경고만하도록 작성하고
- 아니라면, 잔액에서 총 구매 가격을 빼도록 작성했다.

```js
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
}
```

- 카트 아이템이 가지고 있는 정보를 변수에 할당하여 만약 획득한 음료 리스트에 같은 id가 있다면 수량만 구매하려는 음료수의 수량만 증가하도록 작성했다.
- 그리고 만약 같은 id가 없다면 새로운 음료수를 산 것이기 때문에 myBeverageList에 추가했다.

</details>

<details>
  <summary>획득한 음료 리스트 렌더링</summary>

[코드 보러가기](https://github.com/oneny/vending-machine/blob/main/js/main.js#L311)

```html
<ul class="cont-myBeverageList"></ul>
```

```js
// 내가 획득한 음료
const myBeveragesList = [];

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

    // ...

    contMyBeverageListEl.appendChild(myBeverageLi);

    // 내가 구매한 총가격 구하기
    myTotalPrice =
      myTotalPrice + item["beverageQuantity"] * item["beveragePrice"];
  });

  txtTotalPriceEl.textContent = toKRW(myTotalPrice);
}
```

- 같은 id를 찾으면서 음료수 id가 같으면 수량만 올리도록 할 수도 있었지만 이번에는 다른 방식으로 `ul.cont-myBeverageList`에 렌더링해봤다.
- `while (contMyBeverageListEl.hasChildNodes()) {}`
  - `ul.cont-myBeverageList`에 있는 자식 노드들을 모두 먼저 제거했다.
- 위에서 업데이트된 `myBeveragesList`를 `forEach` 메서드를 사용하여 다시 렌더링되도록 작성했다.

</details>

<details>
  <summary>소지금 입력하기</summary>

[코드 보러가기](https://github.com/oneny/vending-machine/blob/main/js/main.js#L75)

```js
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
```

- 소지금을 입력했을 때 만약 문자가 섞여있다면 다시 입력하도록 설정
- 취소를 눌렀을 경우에는 가격 그대로 유지한다.
- 그리고 `toKRW()` 함수를 만들어서 utils.js에서 따로 관리할 수 있도록 작성했다.
  - `toKRW()`는 원화 콤마찍는 함수이다.

</details>

<details>
  <summary>입금하기</summary>

[코드 보러가기](https://github.com/oneny/vending-machine/blob/main/js/main.js#L95)

```js
function deposit() {
  // 소지금, 잔액
  const myMoney = toNum(txtMyMoneyEl.textContent);
  const myBalance = toNum(txtBalanceEl.textContent);

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
}

btnCreditEl.addEventListener("click", deposit);
inpCreditEl.addEventListener("keyup", (e) => {
  if (e.keyCode === 13) deposit();
});
```

- 입금하기 경우, input 요소에 아무것도 적지 않았거나 소지금보다 많으면 경고만 하도록 작성했다.
- 그리고 클릭이나 input 요소에 focus 상태에서 enter키를 누르면 해당 이벤트가 발생하도록 작성했다.

</details>

<details>
  <summary>거스름돈 반환</summary>

[코드 보러가기](https://github.com/oneny/vending-machine/blob/main/js/main.js#L122)

```js
btnBalanceEL.addEventListener("click", () => {
  const myBalance = toNum(txtBalanceEl.textContent);

  // 0이면 아래 더 실행안되게
  if (myBalance === 0) return;

  const myMoney = toNum(txtMyMoneyEl.textContent);

  txtBalanceEl.textContent = "0 원";
  txtMyMoneyEl.textContent = toKRW(myBalance + myMoney) + " 원";
});
```

- 거스름돈 반환하면 소지금에 추가되도록 작성했다.

</details>

### git 커밋 켄벤션

| 태그 이름 | 설명                         |
| --------- | ---------------------------- |
| Feat      | 새로운 기능을 추가할 경우    |
| Fix       | 버그를 고친 경우             |
| Design    | CSS 등 사용자 UI 디자인 변경 |
| Docs      | 문서를 수정한 경우           |

### 요구사항 명세

1. 판매할 음료에 대한 데이터는 따로 분리되어 있어야 합니다. (혹은 API로 받아야 합니다.)
2. 돈의 입금과 음료의 선택 시점은 자유롭지만 돈이 모자라면 음료가 나와서는 안됩니다.
3. 거스름돈이 나와야 합니다.
4. 버튼을 누르면 상품이 1개씩 추가됩니다. (일반적인 자판기와 동일)
