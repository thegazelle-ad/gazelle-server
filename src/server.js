import express from "express"

const app = express()

app.use("/", (req, res) => {
  res.send("Hello World!")
})

app.listen(3000, err => {
  if (err) {
    console.log(err)
    return
  }

  console.log("Server started on port 3000");
})
