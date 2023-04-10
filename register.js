const email = document.querySelector("#email");
const p_account = document.querySelector(".alert-email");

const nickname = document.querySelector("#name");
const p_nickname = document.querySelector(".alert-name");

const pwd = document.querySelector("#pwd");
const p_pwd = document.querySelector(".alert-pwd");

const pwd_check = document.querySelector("#pwd_check");
const p_pwd_check = document.querySelector(".alert-pwdcheck");

const register = document.querySelector(".btn-register");

const register_form = document.querySelector(".form");

const input = document.querySelector(".input");
// 驗證欄位是否空值
let register_verify = (e) => {
  if (email.value.trim() == "") {
    p_account.innerHTML =
      "<div class='text-red-500 font-bold'>帳號尚未填寫</div>";
  }
  if (nickname.value.trim() == "") {
    p_nickname.innerHTML =
      "<div class='text-red-500 font-bold'>暱稱尚未填寫</div>";
  }
  if (pwd.value.trim() == "") {
    p_pwd.innerHTML = "<div class='text-red-500 font-bold'>密碼尚未填寫</div>";
  }
  if (pwd_check.value.trim() == "") {
    p_pwd_check.innerHTML =
      "<div class='text-red-500 font-bold'>確認密碼尚未填寫</div>";
  }
};

//註冊按鈕
register.addEventListener("click", () => {
  // 監聽驗證
  register_verify();
  callSignUp();
});

// let obj = {
//   user: {
//     email: "123@gmail.com",
//     nickname: "string",
//     password: "string",
//   },
// };
const callSignUp = () => {
  let obj = {
    user: {
      email: email.value,
      nickname: nickname.value,
      password: pwd.value,
    },
  };

  axios
    .post("https://todoo.5xcamp.us/users", obj)
    .then((response) => {
      if (response.data.message == "註冊成功") {
        alert("恭喜帳號註冊成功");
      } else if (response.data.message == "註冊發生錯誤") {
        alert("帳號註冊失敗，有可能有人用你的email註冊！");
      }
      register_form.reset();
      location.href = "index.html";
    })
    .catch((error) => {
      alert("此帳號密碼已存在，請重新註冊");
      signUpEmail.value = "";
      signUpNick.value = "";
      signUpPassword.value = "";
      signUpPasswordAgain.value = "";
    });
};
