const text = document.querySelector(".text");
const save = document.querySelector(".save");
const list = document.querySelector(".list");
const user = document.querySelector(".user");
const list_box = document.querySelector(".list-box");
const empty = document.querySelector(".empty");
const input = document.querySelector(".input");
let data = [];

function renderData() {
  let str = "";
  data.forEach(function (item, index) {
    str += `
    <ul class="flex items-center justify-between border-b-2 py-4">
      <li class="flex">
        <input class="flex h-[22px] w-[22px] cursor-pointer" type="checkbox"  />
        <p class="ml-4">${item.content}</p>
      </li>
      <li>
        <img src="images/Vector.svg" alt="" data-num="${index}"id="delete" class=" cursor-pointer"/>
      </li>
    </ul>`;
  });
  //塞進list
  const list = document.querySelector(".list");
  list.innerHTML = str;
}

//新增代辦功能
save.addEventListener("click", function (e) {
  if (text.value.trim() == "") {
    alert("請輸入內容");
    return;
  }
  let obj = {};
  obj.content = text.value;
  data.push(obj);
  renderData();
  switch_statues();
  input.reset();
});

//刪除代辦功能
list.addEventListener("click", function (e) {
  if (e.target.getAttribute("id") !== "delete") {
    return;
  }
  let num = e.target.getAttribute("data-num");
  console.log(num);
  data.splice(num, 1);
  renderData();
  switch_statues();
});

// 右上角帶入LocalStorage username
user.innerHTML = localStorage.nickname;

const switch_statues = () => {
  if (data.length == 0) {
    list_box.classList.add("hidden");
    empty.classList.remove("hidden");
  } else if (data.length > 0) {
    list_box.classList.remove("hidden");
    empty.classList.add("hidden");
  }
};
