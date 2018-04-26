
var mysql = require('mysql');
var inquirer = require("inquirer");

// connection info
var connection = mysql.createConnection({
   host     : 'localhost',
   user     : 'root',
   password : 'root',
   port     : 8889,
   database : 'bamazon',    
});

// connect server and database
connection.connect(function(err) {
   if (err) throw err;
});
//  console.log('The solution is: ', results[0].solution);
// });

connection.end();

// create search function 
function idSearch() {
   inquirer.prompt({
     name: "productID",
     type: "rawlist",
     message: "What is the product's six-digit ID number?",
     choices: ["378645"]
   })
   .then(function(answer) {
       var chosenItem;
       for (var i = 0; i < results.length; i++) {
           if (answer.productID === answer.choices) {
            chosenItem = results[i];
           } else {
               console.log(answer);
           }
       }
   })
};

idSearch();