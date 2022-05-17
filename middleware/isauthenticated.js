const fetch = require('node-fetch')
const backend = process.env.BACKEND_URL+'/api/auth/getaccount'
const isauthenticated = async (req, res, next) => {

const token = req.cookies.token;

if(!token) {
    return res.redirect('/login')
}
try {
await fetch(backend, {
  method: 'POST',
  headers: {
    "Content-Type": "application/json",
    "token": token
  }
}).then(res => res.json()).then(async(data) => {
  if(data._id) {
    req.account = data
    next()
  } else {
    res.redirect('/login')
  }
})

} catch {
  res.sendStatus(500)
}

   


}



module.exports = isauthenticated