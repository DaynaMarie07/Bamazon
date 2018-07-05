
var mysql = require("mysql");
var inquirer = require("inquirer");
require("console.table");
// connection info
var connection = mysql.createConnection({
   host     : 'localhost',
   port     : 8889,
   user     : 'root',
   password : 'root',
   database : 'bamazon',    
});

connection.connect(function(err) {
    if (err) {
      console.error("error connecting: " + err.stack);
    }
    loadProducts();
  });
// Function to load the products table from the database and print results to the console
function loadProducts() {
    // Selects all of the data from the MySQL products table
    connection.query("SELECT * FROM products", function(err, res) {
      if (err) throw err;
  
      // Draw the table in the terminal using the response
      console.table(res);
  
      // Then prompt the customer for their choice of product, pass all the products to askCustProd
      askCustProd(res);
    });
  }

// Prompt the customer for a product ID
function askCustProd(inventory) {
    // Prompts user for what they would like to purchase
    inquirer
      .prompt([
        {
          type: "input",
          name: "choice",
          message: "What is the ID of the item you would you like to purchase? [Quit with Q]",
          validate: function(val) {
            return !isNaN(val) || val.toLowerCase() === "q";
          }
        }
      ])
      .then(function(val) {
        // Check if the user wants to quit the program
        checkExit(val.choice);
        var choiceId = parseInt(val.choice);
        var product = checkInventory(choiceId, inventory);
  
        // If there is a product with the id the user chose, prompt the customer for a desired quantity
        if (product) {
          // Pass the chosen product to howMany
          howMany(product);
        }
        else {
          // Otherwise let them know the item is not in the inventory, re-run loadProducts
          console.log("\nOops sorry, we dont carry that item.");
          loadProducts();
        }
      });
  }
  
  // Prompt the customer for a product quantity
  function howMany(product) {
    inquirer
      .prompt([
        {
          type: "input",
          name: "quantity",
          message: "How many would you like? [Quit with Q]",
          validate: function(val) {
            return val > 0 || val.toLowerCase() === "q";
          }
        }
      ])
      .then(function(val) {
       checkExit(val.quantity);
        var quantity = parseInt(val.quantity);
  
        // If there isn't enough of the chosen product and quantity, let the user know and re-run loadProducts
        if (quantity > product.stock_quantity) {
          console.log("\nNo Beuno!");
          loadProducts();
        }
        else {
          // Otherwise run makePurchase, give it the product information and desired quantity to purchase
          makePurchase(product, quantity);
        }
      });
  }
  function makePurchase(product, quantity) {
    connection.query(
      "UPDATE products SET stock_quantity = stock_quantity - ? WHERE item_id = ?",
      [quantity, product.item_id],
      function(err, res) {
        // Let the user know the purchase was successful, re-run loadProducts
        console.log("\nSuccessfully purchased " + quantity + " " + product.product_name + "'s!");
        loadProducts();
      }
    );
  }
  
  // Check to see if the product the user chose exists in the inventory
  function checkInventory(choiceId, inventory) {
    for (var i = 0; i < inventory.length; i++) {
      if (inventory[i].item_id === choiceId) {
        // If a matching product is found, return the product
        return inventory[i];
      }
    }
    // Otherwise return null
    return null;
  }
  
  // Check to see if the user wants to quit the program
  functioncheckExit(choice) {
    if (choice.toLowerCase() === "q") {
      // Log a message and exit the current node process
      console.log("Chow!!");
      process.exit(0);
    }
  }
  