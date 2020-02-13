// your code goes here
// Refer back to activity 16, 18, 20, 21, 22 for help with concepts and syntaxes
let transactions = [];
let myChart;

fetch("/api/transaction")
  .then(response => response.json())
  .then(data => {
    //saved data to variable
    transactions = data;
    savedTotal();
    savedTable();
    savedChart();
  });


// added user enter amount to the table through jquery
function savedTable() {
  const tbody = document.querySelector("#tbody");
  tbody.innerHTML = "";

  transactions.forEach(transaction => {
   
    const tr = document.createElement("tr");
    tr.innerHTML = `
      <td>${transaction.name}</td>
      <td>${transaction.value}</td>
    `;

    tbody.appendChild(tr);
  });
}


// added data to chart through jquery with date month year table info
function savedChart() {
  const reversed = transactions.slice().reverse();
  let sum = 0;
  const labels = reversed.map(t => {
    const date = new Date(t.date);
    return `${date.getMonth() + 1}/${date.getDate()}/${date.getFullYear()}`;
  });
  const data = reversed.map(t => {
    sum += parseInt(t.value);
    return sum;
  });
  if (myChart) {
    myChart.destroy();
  }
  const ctx = document.getElementById("myChart").getContext("2d");

  myChart = new Chart(ctx, {
    type: "line",
    data: {
      labels,
      datasets: [
        {
          label: "Total Over Time",
          fill: true,
          backgroundColor: "#6666ff",
          data
        }
      ]
    }
  });
}
//saved total amount
function savedTotal() {
    // reduce transaction amounts to a single total value
    const total = transactions.reduce((total, t) => {
      return total + parseInt(t.value);
    }, 0);
  
    const totalEl = document.querySelector("#total");
    totalEl.textContent = total;
  }

function sendingTransaction(addedRecord) {
  const nameEl = document.querySelector("#t-name");
  const amountEl = document.querySelector("#t-amount");
  const errorEl = document.querySelector(".error");

  //validattion
  if (nameEl.value === "" || amountEl.value === "") {
    errorEl.textContent = "Missing Information";
    return;
  } else {
    errorEl.textContent = "";
  }

  // create record
  const transaction = {
    name: nameEl.value,
    value: amountEl.value,
    date: new Date().toISOString()
  };

  //negative values just incase user add negative amount
  if (!addedRecord) {
    transaction.value *= -1;
  }


  transactions.unshift(transaction);

  //added new info to populate ui with new records
  savedChart();
  savedTable();
  savedTotal();

  //added to server side
  fetch("/api/transaction", {
    method: "POST",
    body: JSON.stringify(transaction),
    headers: {
      Accept: "application/json, text/plain, */*",
      "Content-Type": "application/json"
    }
  })
    .then(response => response.json())
    .then(data => {
      if (data.errors) {
        errorEl.textContent = "Missing Information";
      } else {
        //clear
        nameEl.value = "";
        amountEl.value = "";
      }
    })
    .catch(err => {
      saveRecord(transaction);
      //clear
      nameEl.value = "";
      amountEl.value = "";
    });
}

document.querySelector("#add-btn").addEventListener("click", function(event) {
  event.preventDefault();
  sendingTransaction(true);
});

document.querySelector("#sub-btn").addEventListener("click", function(event) {
  event.preventDefault();
  sendingTransaction(false);
});


//activity 22
// function updateRating(event) {
//   const [id, , rating] = event.currentTarget.getAttribute("for").split("-");
//   fetch(`/api/images/${id}`, {
//     method: "PUT",
//     body: JSON.stringify({ rating }),
//     headers: {
//       "Content-Type": "application/json"
//     }
//   }).then(function() {
//     if (window.location.pathname.includes("/images")) {
//       console.log("yoyo");
//       const id = window.location.pathname.split("/")[2];
//       const container = document.getElementsByClassName("container")[0];
//       loadImage(id).then(image => {
//         container.removeChild(container.firstChild);
//         container.appendChild(createCard(image));
//       });
//     } else {
//       loadImages().then(images => {
//         createCards(images);
//       });
//     }
//   });
// }
