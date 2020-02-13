// your code goes here
let db;

//create an indexDB instance with this name
//creating a index database with the name budgettrack and save it to request
//Refering to this example
// request.onupgradeneeded = function(e) {
//     const db = request.result;
//     db.createObjectStore(storeName, { keyPath: "_id" });
//   };

//   request.onerror = function(e) {
//     console.log("There was an error");
//   };

//   request.onsuccess = function(e) {
//     db = request.result;
//     tx = db.transaction(storeName, "readwrite");
//     store = tx.objectStore(storeName);



  
const request = indexedDB.open("budgetTracker", 1);


request.onupgradeneeded = function(event) {
  const db = event.target.result;
  db.createObjectStore("pending", { autoIncrement: true });
};

//if everything else run well, check db again before going back online
request.onsuccess = function(event) {
  db = event.target.result;

  
  if (navigator.onLine) {
    checkingDB();
  }
};
//     db.onerror = function(e) {
//       console.log("error");
//     };
//     if (method === "put") {
//       store.put(object);
//     }
//     if (method === "clear") {
//       store.clear();
//     }
//     if (method === "get") {
//       const all = store.getAll();
//       all.onsuccess = function() {
//         resolve(all.result);
//       };
//     }
//     tx.oncomplete = function() {
//       db.close();
//     };
//   };


//show errors if exist
request.onerror = function(event) {
  console.log("There was an error! " + event.target.errorCode);
};

function saveInfo(record) {
  const transaction = db.transaction(["pending"], "readwrite");
  const store = transaction.objectStore("pending");

  store.add(record);
}


// request.onsuccess = function(e) {
//     db = request.result;
//     tx = db.transaction(storeName, "readwrite");
//     store = tx.objectStore(storeName);

//     db.onerror = function(e) {
//       console.log("error");
//     };
//     if (method === "put") {
//       store.put(object);
//     }
//     if (method === "clear") {
//       store.clear();
//     }
//     if (method === "get") {
//       const all = store.getAll();
//       all.onsuccess = function() {
//         resolve(all.result);
//       };
//     }
//     tx.oncomplete = function() {
//       db.close();
//     };
//   };


//personal notes: refer to example above to reduce syntax errors
//save our data and info after coming back online to our database
function checkingDB() {
  const transaction = db.transaction(["pending"], "readwrite");
  const store = transaction.objectStore("pending");
  const getAll = store.getAll();

  getAll.onsuccess = function() {
    console.log(getAll.result)
    if (getAll.result.length > 0) {
        console.log(getAll.result)
      fetch("/api/transaction/bulk", {
        method: "POST",
        body: JSON.stringify(getAll.result),
        headers: {
          Accept: "application/json, text/plain, */*",
          "Content-Type": "application/json"
        }
      })
      //delete saved info if everything run successful
      .then(response => response.json())
        .then(() => {
          const transaction = db.transaction(["pending"], "readwrite");
          const store = transaction.objectStore("pending");
          store.clear();
        });
    }
  };
}

window.addEventListener("online", checkingDB);