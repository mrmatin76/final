let total = 0
let users = []
let expenses = []
let details = []
const totalAmount = document.querySelector(".total-amount")
const userName = document.querySelector(".name")
const userAmount = document.querySelector(".amount")
const addUserBtn = document.querySelector(".add-user-btn")
const userList = document.querySelector(".user-list")
const clear = document.querySelector(".clear")
const addExpenseBtn = document.querySelector(".add-expense-btn")
const expenseName = document.querySelector(".expense-name")
const expenseCost = document.querySelector(".expense-cost")
const expensesList = document.querySelector(".expense-list") 
const chartBtn = document.querySelector(".add-chart-btn")
//events
addUserBtn.addEventListener("click",addUser)
//get datas from LS
window.addEventListener("DOMContentLoaded",()=>{
  if(localStorage.getItem("users")===null){
    return
  }else{
    users = JSON.parse(localStorage.getItem("users"))
    details = JSON.parse(localStorage.getItem("details"))
    total = JSON.parse(localStorage.getItem("total"))
  loadUsers()
  loadDetail()
  }
})

//clear btn behavior
clear.addEventListener("click",()=>{
  localStorage.clear()
  window.location.reload()
})
chartBtn.addEventListener("click",generateChart)
addExpenseBtn.addEventListener("click",addNewExpense)

//functions

//ading new users
function addUser(){
  //validate
  if(userName.value ==''||userAmount.value<0||userAmount.value===""){
    alert("مقادیر را به درستی وارد کنید")
  }else{
    total+=Number(userAmount.value)
    let newUser ={userName:userName.value,userAmount:userAmount.value}
  users.push(newUser)
  saveInfoToLs()
  loadUsers()
  }
}

//creating new users in html
function loadUsers(){
  if(localStorage.getItem("users")===null){
    return
  }else{
    userList.innerHTML = ""
  users.forEach(user=>{
    userList.innerHTML+= `
    <li class="d-black list-group-item d-flex justify-content-between align-items-center">
    ${user.userName}
    <span class="badge badge-primary badge-pill">${parseFloat(user.userAmount).toFixed(2)}</span>
</li>
    `
  })
  //showing total in total li
  totalAmount.innerHTML=total
  }
}

//save users data in LS
function saveInfoToLs(){
  localStorage.setItem("users",JSON.stringify(users))
  localStorage.setItem("total",JSON.stringify(total))
  localStorage.setItem("details",JSON.stringify(details)) 
}

//add new expense
function addNewExpense() {
  //validate
  if(expenseName.value ==''||expenseCost.value<0||expenseCost.value===""||expenseCost.value>total){
    alert("مقادیر را به درستی وارد کنید")
  }else{
    let expense = {expenseName:expenseName.value,expenseCost:expenseCost.value}
    expenses.push(expense)
    users.forEach(user=>{
      //calculate each person money is how much from total in percent
      let share = user.userAmount*100/total
      
      //minus price from userAmount according to percentage
      if(user.userAmount<expenseCost.value/100*share){
        alert(`کاربر ${user.userName} بودجه کافی را ندارد`)
        return
      }else{
        user.userAmount -=expenseCost.value/100*share
      }
      //show expenses in UI
      expensesList.innerHTML+= showExpense(user,share,expenseName.value,expenseCost.value)
    })
    //minus total from expenseCost
    total-=expenseCost.value

    //save detail to ls
    saveDetailsToLs()
    //save changes
    saveInfoToLs()
    loadUsers()
    
    
  }
}

function showExpense(user,share,expenseName,expenseCost){
  return `
    <li class="list-group-item expense-detail">
    اقا/خانم
    <b style="color:red;">${user.userName}</b>
    بابت هزینه
    <b style="color:red;">${expenseName}</b>
    مقدار
    <b style="color:red;">${
     parseFloat(expenseCost/100*share).toFixed(1)
    }</b>
    را پرداخت نمود که سهم ایشان
    <b style="color:red;">${parseFloat(share).toFixed(2)}</b>
    درصد بود
    </li>
  `
  
}

function saveDetailsToLs(){
  
  document.querySelectorAll(".expense-detail").forEach(detailElement=>{
    details.push(detailElement.innerHTML)
    console.log(detailElement)
  })

  localStorage.setItem("details",JSON.stringify(details))
}

function loadDetail(){
  if(localStorage.getItem("details")===null){
    return
  }else{
    JSON.parse(localStorage.getItem("details")).forEach(expenseDeatil=>{
      expensesList.innerHTML+=`
        <li class="list-group-item">${expenseDeatil}</li>
      `
    })
  }
}

function generateChart(){
  const ctx = document.querySelector("#canvas")
  ctx.getContext("2d")

  //this code generate colors for chart datas
  let colors = [];
  for (let i = 0; i < users.length; i++) {
    colors.push(generateRondomColors())
  }

  //preparing data for chart class
  let names = []
  let balances = []
  users.forEach( user=> {
    names.push(user.userName)
  })
  users.forEach(user => {
    balances.push(parseFloat(user.userAmount).toFixed(2))
  })
  //makeing new chart and sending confirgurtion
  var chart = new Chart(ctx, {
    type: 'pie',
    data: {
      labels: [...names],
      datasets: [{
        label: "لیست افراد حاضر",
        data: [...balances],
        backgroundColor: [...colors]
      }]
    }
  })
}





//this generate random color for our chart
function generateRondomColors() {
  let main = '#'
  let letters = '0123456789ABCDEF'
  for (let i = 0; i < 6; i++) {
    main += letters[Math.floor(Math.random() * 16)]
  }
  return main
}
