/*
=========================================
==== Users Data 
=========================================
*/
let users = [
  {
    firstName: "Avi",
    lastName: "Cohen",
    pin: 1234,
    amount: 1000,
  },
  {
    firstName: "Nati",
    lastName: "sakuri",
    pin: 1000,
    amount: 2000,
  },
  {
    firstName: "elhanan",
    lastName: "efraimov",
    pin: 1500,
    amount: 3000,
  },
];
/*
=========================================
==== Get DOM Elemets START
=========================================
*/
const creaditCardImgEl = document.getElementById("credit-card");
const msgToUserEl = document.querySelector(".msg");
const userInpEl = document.querySelector(".userInp");
let keyboardInputsEl = document.querySelectorAll("form input");
let enterOnClickEl = document.querySelector(".enter");
let clearOnClickEl = document.querySelector(".clear");
/*
=========================================
==== Get DOM Elemets END
=========================================
*/

/*
=========================================
==== Helper Function START
=========================================
*/
//create input function help function
function input(type, placeholderInp) {
  let inp = document.createElement("input");
  inp.placeholder = placeholderInp;
  inp.setAttribute("type", type);
  userInpEl.append(inp);
  return inp;
}
//Message to user help function
function msgForUser(msg) {
  msgToUserEl.innerHTML = msg;
}
//ATM menu help function
function menu() {
  msgToUserEl.innerHTML = `
  <div class="menu">
  <h2>ATM MENU:</h2>
  <ol>
    <li>Press button d to Deposite Money</li>
    <li>Press button w to Withdraw Money</li>
    <li>Press button c to Check your Balace</li>
    <li>Press button q to Quit</li>
    <li>Press button p to change PIN_CODE</li>
    <li>Press button R to create Receipt</li>
  </ol>
</div>
  `;
}
/*
=========================================
==== Helper Function END
=========================================
*/

/*
=========================================
==== The logic of the ATM Function START
=========================================
*/
/*
=========================================
==== Global Variables START
=========================================
*/
//get update user details or get before users details
let getUserDetails =
  JSON.parse(localStorage.getItem("userInfo")) === null
    ? users
    : JSON.parse(localStorage.getItem("userInfo"));

/*
=========================================
==== Global Variables END
=========================================
*/
console.log(getUserDetails);
class AccountOperations {
  constructor(userDetailsArr) {
    this.userDetailsArr = userDetailsArr;
  }
  connectWithCreditCard = () => {
    let random = Math.floor(Math.random() * 3);
    let userDetails = this.userDetailsArr[random] || users[random];
    userInpEl.innerHTML = "";
    console.log(userDetails);
    this.checkPinCode(userDetails);
  };
  checkUserName = () => {
    msgForUser(`<h2>Connect with Username or with Credit Card</h2>`);
    let inp = input("text", "Enter Your Name");

    let userDetails;
    let attemptsCount = 0;
    inp.addEventListener("keydown", (e) => {
      if (e.key === "Enter") {
        userDetails = this.userDetailsArr.find((user) => {
          let fN = user.firstName.toLowerCase();
          let lN = user.lastName.toLowerCase();
          let val = inp.value.toLowerCase();
          return `${fN.toLowerCase()} ${lN.toLowerCase()}` === val;
        });
        if (userDetails) {
          userInpEl.innerHTML = "";
          this.checkPinCode(userDetails);
          return true;
        } else {
          inp.value = "";
          attemptsCount++;
          msgForUser(`<h2>Invalid, Try Again...</h2>`);
          inp.style.borderColor = "red";
          setTimeout(() => (inp.style.borderColor = "green"), 1000);
          if (attemptsCount === 3) {
            msgForUser(`<h2>Login option is locked for 5 seconds</h2>`);
            inp.style.display = "none";
            setTimeout(() => (inp.style.display = "block"), 5000);
          }
        }
      }
    });
  };
  checkPinCode = (details) => {
    msgForUser(`<h2>Hi ${details.firstName},<br/>Enter Your PIN Code</h2>`);
    let pinCodeinp = input("text", "Your PIN Code ");
    //Keypad of the buttons in the ATM SECTION START
    keyboardInputsEl.forEach((number) => {
      number.addEventListener("click", () => {
        pinCodeinp.value += Number(number.value);
      });
    });

    clearOnClickEl.addEventListener("click", () => {
      pinCodeinp.value = "";
    });

    enterOnClickEl.addEventListener("click", (e) => {
      if (
        Number(pinCodeinp.value) === details.pin &&
        pinCodeinp.value.length === 4
      ) {
        msgForUser("<h2>The login was successful.</h2>");
        setTimeout(() => menu(), 2000);
        userInpEl.innerHTML = "";
        this.depositeFn(details);
        this.withdrawFn(details);
        this.showBalanceFn(details);
        this.quitFn(details);
        this.changePinCodeFn(details);
        this.receiptFn(details);
      } else if (
        pinCodeinp.value.length === 4 &&
        Number(pinCodeinp.value) !== details.pin
      ) {
        msgForUser("<h2>Invalid Try Again....</h2>");
        pinCodeinp.style.borderColor = "red";
        setTimeout(() => (pinCodeinp.style.borderColor = "green"), 1000);
        pinCodeinp.value = "";
      } else if (
        e.target &&
        Number(pinCodeinp.value) !== details.pin &&
        (pinCodeinp.value.length === 4 || pinCodeinp.value.length < 4)
      ) {
        msgForUser("<h2>Invalid Try Again....</h2>");
        pinCodeinp.style.borderColor = "red";
        setTimeout(() => (pinCodeinp.style.borderColor = "green"), 1000);
        pinCodeinp.value = "";
      }
    });
    //Keypad of the buttons in the ATM SECTION END

    pinCodeinp.addEventListener("input", () => {
      if (
        Number(pinCodeinp.value) === details.pin &&
        pinCodeinp.value.length === 4
      ) {
        msgForUser("<h2>The login was successful.</h2>");
        setTimeout(() => menu(), 2000);
        userInpEl.innerHTML = "";
        this.depositeFn(details);
        this.withdrawFn(details);
        this.showBalanceFn(details);
        this.quitFn(details);
        this.changePinCodeFn(details);
        this.receiptFn(details);
      } else if (
        pinCodeinp.value.length === 4 &&
        Number(pinCodeinp.value) !== details.pin
      ) {
        msgForUser("<h2>Invalid Try Again....</h2>");
        pinCodeinp.style.borderColor = "red";
        pinCodeinp.value = "";
      }
    });
  };
  depositeFn = (userDetail) => {
    const depositeEl = document.querySelector(".deposite");
    depositeEl.addEventListener("click", () => {
      userInpEl.innerHTML = "";
      msgForUser(
        `<h2>${userDetail.firstName}<br/>How much money would you like to deposit?</h2>`
      );
      let depositeInp = input("number", "Enter number");
      depositeInp.value = "";
      //Keypad of the buttons in the ATM SECTION START
      keyboardInputsEl.forEach((number) => {
        number.addEventListener("click", () => {
          depositeInp.value += Number(number.value);
          console.log(depositeInp.value);
        });
      });
      clearOnClickEl.addEventListener("click", () => {
        depositeInp.value = "";
      });

      enterOnClickEl.addEventListener("click", () => {
        this.userDetailsArr.map((user) => {
          if (user.firstName === userDetail.firstName) {
            if (
              (Number(depositeInp.value) % 50 === 0 ||
                Number(depositeInp.value) % 100 === 0 ||
                Number(depositeInp.value) % 20 === 0) &&
              Number(depositeInp.value) >= 0
            ) {
              user.amount = user.amount + Number(depositeInp.value);
              localStorage.setItem(
                "userInfo",
                JSON.stringify(this.userDetailsArr)
              );
              console.log(this.userDetailsArr);
              msgForUser(
                `<h2>${userDetail.firstName}<br/>The operation was successful</h2>`
              );

              setTimeout(() => menu(), 2000);
              userInpEl.innerHTML = "";
            } else if (Number(depositeInp.value) < 20) {
              msgForUser(
                `<h2>${userDetail.firstName}<br/>the minimum deposite is 20 NIS</h2>`
              );
              depositeInp.style.borderColor = "red";
              setTimeout(() => (depositeInp.style.borderColor = "green"), 1000);
              depositeInp.value = "";
            } else if (
              (Number(depositeInp.value) > 20 &&
                Number(depositeInp.value) % 50 !== 0) ||
              Number(depositeInp.value) % 100 !== 0 ||
              Number(depositeInp.value) % 20 !== 0
            ) {
              msgForUser(
                `<h2>${userDetail.firstName}<br/>You can only deposit in multiples of 20,50,100 NIS</h2>`
              );
              depositeInp.style.borderColor = "red";
              setTimeout(() => (depositeInp.style.borderColor = "green"), 1000);
              depositeInp.value = "";
            }
          }
        });
      });
      //Keypad of the buttons in the ATM SECTION END
      //Input from keyboard logic SECTION START
      depositeInp.addEventListener("keydown", (e) => {
        if (e.key === "Enter") {
          this.userDetailsArr.map((user) => {
            if (user.firstName === userDetail.firstName) {
              if (
                (Number(depositeInp.value) % 50 === 0 ||
                  Number(depositeInp.value) % 100 === 0 ||
                  Number(depositeInp.value) % 20 === 0) &&
                Number(depositeInp.value) >= 0
              ) {
                user.amount = user.amount + Number(depositeInp.value);
                localStorage.setItem(
                  "userInfo",
                  JSON.stringify(this.userDetailsArr)
                );
                console.log(this.userDetailsArr);
                msgForUser(
                  `<h2>${userDetail.firstName}<br/>The operation was successful</h2>`
                );

                setTimeout(() => menu(), 2000);
                userInpEl.innerHTML = "";
              } else if (Number(depositeInp.value) < 20) {
                msgForUser(
                  `<h2>${userDetail.firstName}<br/>the minimum deposite is 20 NIS</h2>`
                );
                depositeInp.style.borderColor = "red";
                setTimeout(
                  () => (depositeInp.style.borderColor = "green"),
                  1000
                );
                depositeInp.value = "";
              } else if (
                (Number(depositeInp.value) > 20 &&
                  Number(depositeInp.value) % 50 !== 0) ||
                Number(depositeInp.value) % 100 !== 0 ||
                Number(depositeInp.value) % 20 !== 0
              ) {
                msgForUser(
                  `<h2>${userDetail.firstName}<br/>You can only deposit in multiples of 20,50,100 NIS</h2>`
                );
                depositeInp.style.borderColor = "red";
                setTimeout(
                  () => (depositeInp.style.borderColor = "green"),
                  1000
                );
                depositeInp.value = "";
              }
            }
          });
        }
      });
      //Input from keyboard logic SECTION END
    });
  };
  withdrawFn = (userDetail) => {
    const withdrawEl = document.querySelector(".withdraw");
    withdrawEl.addEventListener("click", () => {
      userInpEl.innerHTML = "";
      let withdrawInp = input("number", "Enter number");
      withdrawInp.value = "";
      msgForUser(
        `<h2>${userDetail.firstName}<br/>How much money would you like to withdraw?<br/>
        <ol class="money-option">
        <li><button value="50" class="money" >50</button></li>
        <li><button value="100" class="money">100</button></li>
        <li><button value="150" class="money">150</button></li>
        <li><button value="300" class="money" >300</button></li>
        <li><button value="other" class="money">other</button></li>
      </ol>
        </h2>`
      );
      //Keypad of the buttons in the ATM SECTION START
      keyboardInputsEl.forEach((number) => {
        number.addEventListener("click", () => {
          withdrawInp.value += Number(number.value);
        });
      });

      clearOnClickEl.addEventListener("click", () => {
        withdrawInp.value = "";
      });
      enterOnClickEl.addEventListener("click", () => {
        this.userDetailsArr.map((user) => {
          if (user.firstName === userDetail.firstName) {
            if (
              userDetail.amount - Number(withdrawInp.value) >= 0 &&
              (Number(withdrawInp.value) % 50 === 0 ||
                Number(withdrawInp.value) % 100 === 0 ||
                Number(withdrawInp.value) % 20 === 0)
            ) {
              user.amount = user.amount - Number(withdrawInp.value);
              localStorage.setItem(
                "userInfo",
                JSON.stringify(this.userDetailsArr)
              );
              msgForUser(
                `<h2>${userDetail.firstName}<br/>The operation was successful</h2>`
              );
              setTimeout(() => menu(), 2000);
              userInpEl.innerHTML = "";
            } else if (userDetail.amount - Number(withdrawInp.value) < 0) {
              msgForUser(
                `<h2>${userDetail.firstName}<br/> You do not have enough money in your account to withdraw ${withdrawInp.value} NIS <br/>,You have at now ${userDetail.amount} NIS</h2>`
              );
              withdrawInp.style.borderColor = "red";
              setTimeout(() => (withdrawInp.style.borderColor = "green"), 1000);
              withdrawInp.value = "";
            } else {
              msgForUser(`<h2>Invalid, Try Again...</h2>`);
              withdrawInp.style.borderColor = "red";
              setTimeout(() => (withdrawInp.style.borderColor = "green"), 1000);
              withdrawInp.value = "";
            }
          }
        });
      });
      //Keypad of the buttons in the ATM SECTION END
      //Input from keyboard logic SECTION START
      let buttons = document.querySelectorAll(".money-option button");
      withdrawInp.style.display = "none";
      //button loop start

      buttons.forEach((btn) => {
        btn.addEventListener("click", () => {
          //other option START
          if (btn.value === "other") {
            withdrawInp.style.display = "block";
            msgForUser(
              `<h2>${userDetail.firstName}<br/>How much money would you like to withdraw?</h2>`
            );
            withdrawInp.addEventListener("keydown", (e) => {
              if (e.key === "Enter") {
                this.userDetailsArr.map((user) => {
                  if (user.firstName === userDetail.firstName) {
                    if (
                      userDetail.amount - Number(withdrawInp.value) >= 0 &&
                      (Number(withdrawInp.value) % 50 === 0 ||
                        Number(withdrawInp.value) % 100 === 0 ||
                        Number(withdrawInp.value) % 20 === 0)
                    ) {
                      user.amount = user.amount - Number(withdrawInp.value);
                      localStorage.setItem(
                        "userInfo",
                        JSON.stringify(this.userDetailsArr)
                      );
                      msgForUser(
                        `<h2>${userDetail.firstName}<br/>The operation was successful</h2>`
                      );
                      setTimeout(() => menu(), 2000);
                      userInpEl.innerHTML = "";
                    } else if (
                      userDetail.amount - Number(withdrawInp.value) <
                      0
                    ) {
                      msgForUser(
                        `<h2>${userDetail.firstName}<br/> You do not have enough money in your account to withdraw ${withdrawInp.value} NIS <br/>,You have at now ${userDetail.amount} NIS</h2>`
                      );
                      withdrawInp.style.borderColor = "red";
                      setTimeout(
                        () => (withdrawInp.style.borderColor = "green"),
                        1000
                      );
                      withdrawInp.value = "";
                    } else {
                      msgForUser(`<h2>Invalid, Try Again...</h2>`);
                      withdrawInp.style.borderColor = "red";
                      setTimeout(
                        () => (withdrawInp.style.borderColor = "green"),
                        1000
                      );
                      withdrawInp.value = "";
                    }
                  }
                });
              }
            });
          } else {
            //else if click on options of the button 50 , 100 , 150 ,300 to widthdraw
            this.userDetailsArr.map((user) => {
              if (user.firstName === userDetail.firstName) {
                if (user.amount - Number(btn.value) >= 0) {
                  user.amount = user.amount - Number(btn.value);
                  localStorage.setItem(
                    "userInfo",
                    JSON.stringify(this.userDetailsArr)
                  );
                  msgForUser(
                    `<h2>${userDetail.firstName}<br/>The operation was successful</h2>`
                  );
                  setTimeout(() => menu(), 2000);
                  userInpEl.innerHTML = "";
                } else {
                  alert(
                    `${userDetail.firstName} \n You do not have enough money in your account to withdraw ${withdrawInp.value} NIS \n,You have at now ${userDetail.amount} NIS`
                  );
                }
              }
            });
          }

          //other option END
        });
      });

      //button loop END
      //Input from keyboard logic SECTION END
    });
  };
  showBalanceFn = (userDetail) => {
    const checkBalanceEl = document.querySelector(".check-balance");
    checkBalanceEl.addEventListener("click", () => {
      userInpEl.innerHTML = "";
      msgForUser(
        `<h2>Hi, ${userDetail.firstName}<br/>Your current balance is: ${userDetail.amount} NIS</h2>`
      );
      setTimeout(() => menu(), 2000);
      userInpEl.innerHTML = "";
    });
  };
  quitFn = (userDetail) => {
    const quitEl = document.querySelector(".quit");
    quitEl.addEventListener("click", () => {
      userInpEl.innerHTML = "";
      msgForUser(`<h2>GOODBAY ${userDetail.firstName}, HAVE A NICE DAY</h2>`);
      creaditCardImgEl.classList.remove("card-animate-on");
      setTimeout(() => init(this.userDetailsArr), 4000);
    });
  };
  changePinCodeFn = (userDetail) => {
    const pinCodeChangeEl = document.querySelector(".pin-code-change");
    pinCodeChangeEl.addEventListener("click", () => {
      userInpEl.innerHTML = "";
      msgForUser(
        `<h2>Hi, ${userDetail.firstName}<br/> Enter Your new PIN Code only 4 digits</h2>`
      );
      let newPinCodeInp = input("number", "Enter number");
      newPinCodeInp.value = "";
      //Keypad of the buttons in the ATM SECTION START
      keyboardInputsEl.forEach((number) => {
        number.addEventListener("click", () => {
          newPinCodeInp.value += Number(number.value);
        });
      });

      clearOnClickEl.addEventListener("click", () => {
        newPinCodeInp.value = "";
      });

      enterOnClickEl.addEventListener("click", () => {
        if (newPinCodeInp.value.length > 4) {
          msgForUser(
            `<h2>Invalid, You can choose a pin code of only 4 digits!<br/> Try Again...</h2>`
          );
          inp.style.borderColor = "red";
          setTimeout(() => (inp.style.borderColor = "green"), 1000);
          newPinCodeInp.value = "";
        } else if (newPinCodeInp.value.length < 4 && e.key === "Enter") {
          msgForUser(
            `<h2>Invalid, You can choose a pin code of only 4 digits!<br/> Try Again...</h2>`
          );
          inp.style.borderColor = "red";
          setTimeout(() => (inp.style.borderColor = "green"), 1000);
        } else if (newPinCodeInp.value.length === 4) {
          this.userDetailsArr.map((user) => {
            if (user.firstName === userDetail.firstName) {
              user.pin = Number(newPinCodeInp.value);
              localStorage.setItem(
                "userInfo",
                JSON.stringify(this.userDetailsArr)
              );
              msgForUser(
                `<h2>${userDetail.firstName}<br/>The operation was successful</h2>`
              );
              setTimeout(() => menu(), 2000);
              userInpEl.innerHTML = "";
            }
          });
        }
      });
      //Keypad of the buttons in the ATM SECTION END

      //Input from keyboard logic SECTION START
      newPinCodeInp.addEventListener("keydown", (e) => {
        if (e.key === "Enter") {
          if (newPinCodeInp.value.length > 4) {
            msgForUser(
              `<h2>Invalid, You can choose a pin code of only 4 digits!<br/> Try Again...</h2>`
            );
            inp.style.borderColor = "red";
            setTimeout(() => (inp.style.borderColor = "green"), 1000);
            newPinCodeInp.value = "";
          } else if (newPinCodeInp.value.length < 4 && e.key === "Enter") {
            msgForUser(
              `<h2>Invalid, You can choose a pin code of only 4 digits!<br/> Try Again...</h2>`
            );
            inp.style.borderColor = "red";
            setTimeout(() => (inp.style.borderColor = "green"), 1000);
          } else if (newPinCodeInp.value.length === 4) {
            this.userDetailsArr.map((user) => {
              if (user.firstName === userDetail.firstName) {
                user.pin = Number(newPinCodeInp.value);
                localStorage.setItem(
                  "userInfo",
                  JSON.stringify(this.userDetailsArr)
                );
                msgForUser(
                  `<h2>${userDetail.firstName}<br/>The operation was successful</h2>`
                );
                setTimeout(() => menu(), 2000);
                userInpEl.innerHTML = "";
              }
            });
          }
        }
      });
      //Input from keyboard logic SECTION END
    });
  };
  receiptFn = (userDetail) => {
    const createReceiptEl = document.querySelector(".create-receipt");
    createReceiptEl.addEventListener("click", () => {
      let date = new Date();
      let fullDate = `${date.getDate()}/${
        date.getMonth() + 1 < 10
          ? "0" + (date.getMonth() + 1)
          : date.getMonth() + 1
      }/${date.getFullYear()}`;
      let fullHour = `${
        date.getHours() < 10 ? "0" + date.getHours() : date.getHours()
      }:${
        date.getMinutes() < 10 ? "0" + date.getMinutes() : date.getMinutes()
      }:${
        date.getSeconds() < 10 ? "0" + date.getSeconds() : date.getSeconds()
      }`;
      msgForUser(`<h2>Hi, ${userDetail.firstName} ${userDetail.lastName}<br/>
      at this time:${fullHour}<br/>
      on this date:${fullDate}<br/>
      You got ${userDetail.amount} NIS in your acount<br/>
       Thank you for using your ATM</h2>`);
      setTimeout(() => menu(), 5000);
      userInpEl.innerHTML = "";
    });
  };
}
//initial check User Name function and connect With Credit Card
function init(userDetail) {
  let methods = new AccountOperations(userDetail);
  creaditCardImgEl.addEventListener("click", () => {
    creaditCardImgEl.classList.add("card-animate-on");
    methods.connectWithCreditCard();
  });
  methods.checkUserName();
}
init(getUserDetails);
/*
=========================================
==== The logic of the ATM Function END
=========================================
*/
