// Import stylesheets
import './style.css';

('use strict');

/////////////////////////////////////////////////
/////////////////////////////////////////////////
// BANKIST APP

/////////////////////////////////////////////////
// Data
const account1 = {
  owner: 'Jonas Schmedtmann',
  movements: [200, 450, -400, 3000, -650, -130, 70, 1300],
  interestRate: 1.2, // %
  pin: 1111,
};

const account2 = {
  owner: 'ibrahim sungur',
  movements: [5000, 3400, -150, -790, -3210, -1000, 8500, -30],
  interestRate: 1.5,
  pin: 2222,
};

const account3 = {
  owner: 'Steven Thomas Williams',
  movements: [200, -200, 340, -300, -20, 50, 400, -460],
  interestRate: 0.7,
  pin: 3333,
};

const account4 = {
  owner: 'Sarah Smith',
  movements: [430, 1000, 700, 50, 90],
  interestRate: 1,
  pin: 4444,
};

const accounts = [account1, account2, account3, account4];

/////////////////////////////////////////////////
// Elements
const labelWelcome = document.querySelector('.welcome');
const labelDate = document.querySelector('.date');
const labelBalance = document.querySelector('.balance__value');
const labelSumIn = document.querySelector('.summary__value--in');
const labelSumOut = document.querySelector('.summary__value--out');
const labelSumInterest = document.querySelector('.summary__value--interest');
const labelTimer = document.querySelector('.timer');

const containerApp = document.querySelector('.app');
const containerMovements = document.querySelector('.movements');

const btnLogin = document.querySelector('.login__btn');
const btnTransfer = document.querySelector('.form__btn--transfer');
const btnLoan = document.querySelector('.form__btn--loan');
const btnClose = document.querySelector('.form__btn--close');
const btnSort = document.querySelector('.btn--sort');

const inputLoginUsername = document.querySelector('.login__input--user');
const inputLoginPin = document.querySelector('.login__input--pin');
const inputTransferTo = document.querySelector('.form__input--to');
const inputTransferAmount = document.querySelector('.form__input--amount');
const inputLoanAmount = document.querySelector('.form__input--loan-amount');
const inputCloseUsername = document.querySelector('.form__input--user');
const inputClosePin = document.querySelector('.form__input--pin');

/////////////////////////////////////////////////
// Functions

const displayMovements = (acc) => {
  acc.movements.forEach((mov, i) => {
    const type = mov > 0 ? 'deposit' : 'withdrawal';
    const html = `
      <div class="movements__row">
          <div class="movements__type movements__type--${type}">${i+1} ${type}</div>
          <div class="movements__value">${mov}</div>
        </div>
    `;
    containerMovements.insertAdjacentHTML('afterbegin',html);
  });
};

// displayMovements(account1.movements);

const calcDisplayBalance = (acc)=>{
   acc.balance = acc.movements.reduce((acc,mov)=> acc+mov,0); 
  labelBalance.textContent = `${acc.balance} EUR`;

}

// calcDisplayBalance(account1.movements);

const calcDisplaySummary = (acc)=>{
  const incomes = acc.movements
  .filter(mov => mov>0)
  .reduce((rec,mov) => rec+mov ,0);
  labelSumIn.textContent= `${incomes}???`;
  const outgoings = acc.movements
  .filter(mov => mov <0)
  .reduce((rec,mov) => rec+mov,0)

  labelSumOut.textContent = `${Math.abs(outgoings)}???`;

  const interest = acc.movements
             .filter(mov => mov > 0)
             .map(deposit => (deposit * acc.interestRate)/100)
             .reduce((acc,int)=> acc + int,0 );
  labelSumInterest.textContent = `${interest}???`;

}

// calcDisplaySummary(account1.movements);


const createUsernames = (accs)=>{
  accs.forEach((acc)=>{
    acc.username = acc.owner
    .toLowerCase()
    .split(' ')
    .map(name => name[0])
    .join('')
  })
}

createUsernames(accounts);

const updateUI = (currentAccount)=> {
 
  //Display movements
  displayMovements(currentAccount);
  // Display balance
  calcDisplayBalance(currentAccount);

  //Display summary
  calcDisplaySummary(currentAccount);
}

//Event handler

let currentAccount ;

btnLogin.addEventListener('click', (event)=>{

  //Prevent form submitting
  event.preventDefault();

  currentAccount = accounts.find(acc => acc.username === inputLoginUsername.value);
    
  if(currentAccount?.pin === Number(inputLoginPin.value)){
    
    // Display UI and message
    labelWelcome.textContent = `Welcome back, ${currentAccount.owner.split(' ')[0]}`;

    //Clear input fields
    inputLoginUsername.value = inputLoginPin.value ='';
    inputLoginPin.blur();

    containerApp.style.opacity = 100;


      updateUI(currentAccount);
  
   }

});


btnTransfer.addEventListener('click',(event)=>{

  event.preventDefault();
  const amount = Number(inputTransferAmount.value);
  const receiverAcc = accounts.find( acc => acc.username === inputTransferTo.value);
  
  if(amount > 0 && receiverAcc && currentAccount.balance >= amount &&
     (receiverAcc?.username !== currentAccount.username)){
     currentAccount.movements.push(-amount);
     receiverAcc.movements.push(amount);

     
     updateUI(currentAccount);
  }else{
    console.log('Transfer invalid');
  }

  

  //Clear inputs fields
  inputTransferAmount.value=inputTransferTo.value='';

  //console.log('receiverAcc',receiverAcc);
});

btnLoan.addEventListener('click',(e)=>{
  e.preventDefault();

  const amount  = Number(inputLoanAmount.value);
  console.log(currentAccount.movements.some(mov => mov >= amount*0.1));

  if(amount> 0 && currentAccount.movements.some(mov => mov >= amount*0.1)){
    currentAccount.movements.push(amount);
         
    updateUI(currentAccount);

  }
});


btnClose.addEventListener('click', (e)=>{
  e.preventDefault();

  if(currentAccount.username === inputCloseUsername.value && 
    currentAccount?.pin === Number(inputClosePin.value)){
    // accounts.slice(closeAccount);
    let index = accounts.findIndex( acc => acc.username === currentAccount.username);
    accounts.splice(index,1);
    
    containerApp.style.opacity=0;
      // Display UI and message
      labelWelcome.textContent = `login in to get stared`;
  }


  
});






/////////////////////////////////////////////////////////////////

 const movements= [200, 450, -400, 3000, -650, -130, 70, 1300],

//  const balance = movements.reduce((acc,cur)=> acc+cur,0);

//  console.log(balance);

//  let balance2 = 0;

//  for(const mov of movements) balance2 += mov;

//  console.log(balance2);


//  const max = movements.reduce((acc,mov)=>{
//    if(acc > mov) return acc;
//    else return mov;
//  });


//  console.log(max);

const eurToUsd = 1.1;
const totalDepositsUsd = movements
.filter(mov => mov>0)
.map(mov => mov*eurToUsd)
.reduce((acc,mov)=> acc+mov,0);

