const path = require('path')
const express = require('express')
const request = require('superagent')
const fetch = require('node-fetch')
const md2ipynb = require('md2ipynb')
const app = express()

async function getMarkdownContent(urlString) {
  try {
    const response = await fetch(urlString, {
      headers: { Accept: 'text/plain' },
    })
    const markdown = await response.text()
    return markdown
  } catch (err) {
    throw new Error(err)
  }
}

app.set('port', process.env.PORT || 5000)
app.use(express.static('public'))

app.get('/download/*', async (req, res, next) => {
  const markdownURL = req.params[0]
  try {
    const markdown = await getMarkdownContent(markdownURL)
    res.type('text/plain')
    res.attachment(path.basename(markdownURL) + '.ipynb')
    res.send(md2ipynb(markdown))
  } catch (err) {
    next(err)
  }
})

app.get('/*', async (req, res, next) => {
  try {
    const markdown = await getMarkdownContent(req.params[0])
    res.type('text/plain')
    res.send(md2ipynb(markdown))
  } catch (err) {
    next(err)
  }
})

app.use((err, req, res) => {
  console.log(err)
  switch (err.code) {
    case 'ECONNREFUSED':
      res.send('Attempt to connect to the server was failed.')
      break
    case 'ENOTFOUND':
      res.send('Requested URL is invalid Markdown file.')
      break
    default:
      res.send(err.message)
  }
})

app.listen(app.get('port'), () => {
  console.log('Node app is running http://localhost:' + app.get('port'))
})
