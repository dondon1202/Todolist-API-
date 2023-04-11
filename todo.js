const text = document.querySelector(".text");
const save = document.querySelector(".save");
const list = document.querySelector(".list");
const user = document.querySelector(".user");
const list_box = document.querySelector(".list-box");
const empty = document.querySelector(".empty");
const input = document.querySelector(".input");
const logoutBtn = document.querySelector(".logoutBtn");
const edit = document.querySelector(".edit");
const checkBox = document.querySelector(".checkbox");
let data = [];

const _url = "https://todoo.5xcamp.us";
const token = localStorage.getItem("authorization");
const nickname = localStorage.getItem("nickname");
console.log(token);

// 檢查是否是登入狀態 沒有token可以自動回到登入頁面 但是登入後目前無法使用功能 //
// const checkLocal = () => {
//   if (token == null || nickname == null) {
//     location.href = "index.html";
//   }
//   getTodo();
// };
// checkLocal();

// 取得 todo
const getTodo = () => {
  axios
    .get(`${_url}/todos`, {
      headers: {
        authorization: token,
      },
    })
    .then((response) => {
      // console.log(response.data);
      data = response.data.todos;
      renderData(data);
      switch_statues();
    });
};

// 在一進入網頁時就呼叫 getTodo()
axios
  .get(`${_url}/check`, {
    headers: {
      authorization: token,
    },
  })
  .then(() => {
    user.textContent = `${nickname}的待辦`;
    getTodo();
  })
  .catch(() => {
    location.href = "index.html";
  });

// 渲染TODO
const renderData = () => {
  const str = data
    .map((item, index) => {
      // console.log(item.id);
      return `
        <ul class="flex items-center justify-between border-b-2 py-4">
          <li class="flex">
            <img class="checkbox flex h-[22px] w-[22px] cursor-pointer " type="checkbox" data-num="${
              item.id
            }" src="${
        item.completed_at !== null
          ? "./images/check.svg"
          : "./images/checkbox.svg"
      }" />
            <p class="${
              item.completed_at !== null
                ? "ml-4 edit line-through"
                : "ml-4 edit"
            }">${item.content}</p>
          </li>
          <li>
            <img src="images/Vector.svg" alt="" data-num="${
              item.id
            }" id="delete" class=" cursor-pointer"/>
          </li>
        </ul>
      `;
    })
    .join("");
  list.innerHTML = str;
};

// 新增todo
save.addEventListener("click", (e) => {
  if (text.value.trim() == "") {
    alert("請輸入內容");
    return;
  }
  const obj = {};
  obj.content = text.value;
  console.log(obj);
  data.push(obj);
  renderData();
  switch_statues();

  let addObj = {
    todo: {
      content: text.value,
    },
  };

  //輸入後表單清空
  input.reset();

  axios
    .post(`${_url}/todos`, addObj, {
      headers: {
        authorization: token,
      },
    })
    .then((response) => {
      // console.log(response.data);
      console.log(response);
      data.push(response.data);
      getTodo();
    })
    .catch((error) => {
      alert(error);
    });
});

// 刪除todo
list.addEventListener("click", (e) => {
  if (e.target.getAttribute("id") !== "delete") {
    return;
  }
  // 拿到todo列表的id
  const targetId = e.target.getAttribute("data-num");

  data = data.filter((item, index) => index !== Number(targetId));
  renderData();
  switch_statues();
  console.log(e.target.parentNode);

  // console.log(targetId);
  const targetItem = data.filter((item) => item.id === targetId)[0];
  console.log(targetItem);

  axios
    .delete(`${_url}/todos/${targetId}`, {
      headers: {
        authorization: token,
      },
    })
    .then(() => {
      data.splice(data.indexOf(targetItem), 1);
      renderData();
      switch_statues();
    });
});

// 編輯todo
// list.addEventListener("click", (e) => {
//   if (e.target.getAttribute("class") !== "edit") {
//     return;
//   }
//   // 拿到todo列表的id
//   const targetId = e.target.getAttribute("data-num");

//   data = data.filter((item, index) => index !== Number(targetId));
//   renderData();
//   switch_statues();
//   console.log(e.target.parentNode);

//   // console.log(targetId);
//   const targetItem = data.filter((item) => item.id === targetId)[0];
//   console.log(targetItem);

//   axios
//     .delete(`${_url}/todos/${targetId}`, {
//       headers: {
//         authorization: token,
//       },
//     })
//     .then(() => {
//       data.splice(data.indexOf(targetItem), 1);
//       renderData();
//       switch_statues();
//     });
// });
// 判斷0筆跟有資料的時候切換背景圖

const switch_statues = () => {
  if (data.length == 0) {
    list_box.classList.add("hidden");
    empty.classList.remove("hidden");
  } else if (data.length > 0) {
    list_box.classList.remove("hidden");
    empty.classList.add("hidden");
  }
};

// 登出功能
const logout = () => {
  axios
    .delete(`${_url}/users/sign_out`, {
      headers: {
        authorization: token,
      },
    })
    .then((response) => {
      localStorage.removeItem("authorization");
      localStorage.removeItem("nickname");
      alert(response.data.message);
      location.href = "index.html";
    })
    .catch((error) => {
      console.log(error);
      alert("登出失敗");
    });
};
// 當登出被點擊
logoutBtn.addEventListener("click", () => {
  logout();
});

// 切換狀態
list.addEventListener("click", (e) => {
  // if (e.target.getAttribute("id") !== "delete") {
  //   return;
  // }
  // 拿到todo列表的id
  const targetId = e.target.getAttribute("data-num");
  let targetObj = data.filter((item) => item.id === targetId)[0]; // 找出被勾選的整筆資料
  // data = data.filter((item, index) => index !== Number(targetId));
  // renderData();
  // switch_statues();
  // console.log(e.target.parentNode);

  // // console.log(targetId);
  // const targetItem = data.filter((item) => item.id === targetId)[0];
  // console.log(targetItem);

  axios
    .patch(`${_url}/todos/${targetId}/toggle`, "", {
      headers: {
        authorization: token,
      },
    })
    .then((res) => {
      console.log("res", res);
      data.splice(data.indexOf(targetObj), 1, res.data); //從data中把被勾選的資料拿掉，把新的資料放進去
      console.log("data >>>", data);
      renderData();
      switch_statues();
    });
});
