import falcor from "falcor"

const model = new falcor.Model({
  cache: {
    pages: [
      {
        title: "Page 0 title",
        body: "Page 0 body"
      },
      {
        title: "Page 1 title",
        body: "Page 1 body"
      },
      {
        title: "Page 2 title",
        body: "Page 2 body"
      }
    ]
  }
})

export default model.batch()
