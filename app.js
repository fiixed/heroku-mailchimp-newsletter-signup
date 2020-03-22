/*jshint esversion: 6 */

const express = require("express");
const port = process.env.PORT;
const app = express();

app.use(express.static("public"));

const https = require("https");
app.use(express.urlencoded());

app.get("/", function(req, res) {
  res.sendFile(__dirname + "/signup.html");
});

app.post("/", function(req, res) {
  const firstName = req.body.fName;
  const lastName = req.body.lName;
  const email = req.body.email;

  var data = {
    members: [
      {
        email_address: email,
        status: "subscribed",
        merge_fields: {
          FNAME: firstName,
          LNAME: lastName
        }
      }
    ]
  };

  var jsonData = JSON.stringify(data);

  const url = "https://us19.api.mailchimp.com/3.0/lists/2571579b35";

  const options = {
    method: "POST",
    auth: "**********"
  };

  const request = https.request(url, options, function(response) {
    if (response.statusCode === 200) {
      res.sendFile(__dirname + "/success.html");
    } else {
      res.sendFile(__dirname + "/failure.html");
    }
    response.on("data", function(data) {
      console.log(JSON.parse(data));
    });
  });
  request.write(jsonData);
  request.end();
});

app.post("/failure", function(req, res) {
  res.redirect("/");
});

app.listen(port || 3000, () =>
  console.log(`Newsletter app listening on port ${port}!`)
);

// List ID
// 2571579b35
