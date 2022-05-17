const fetch = require('node-fetch')
const backend = process.env.BACKEND_URL+'/api/auth/getaccount'
const isnotauthenticated = async (req, res, next) => {

const token = req.cookies.token;

if(!token) {
    return next()
}

try {

await fetch(backend, {
  method: 'POST',
  headers: {
    "Content-Type": "application/json",
    "token": token
  }
}).then(res => res.json()).then(async(data) => {
  if(!data._id) {

    return next()
  } else {
return res.redirect('/dashboard')
  }
})

} catch {
  res.sendStatus(500)
}
   


}



module.exports = isnotauthenticated