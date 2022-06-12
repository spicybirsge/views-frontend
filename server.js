require('dotenv').config()
const express = require("express")
const app = express()
const logger = require('morgan');
const cookies = require("cookie-parser")
const cors = require('cors')


app.set('view-engine', 'ejs')
app.use(cors())
app.use(logger('dev'));
app.use(cookies());
const error = require('./middleware/handler');
app.use(express.urlencoded({ extended: false }))
app.use(express.json())
app.use(express.static('public'))
app.use(error)
const isnotauthenticated = require('./middleware/isnotauthenticated')
const isauthenticated = require('./middleware/isauthenticated');
const fetch = require('node-fetch')
//const qs = require('querystring')
app.get('/dashboard/:name/manage', isauthenticated , async (req, res) => {
  const name = req.params.name
  const owner = req.account.name
  const backend = process.env.BACKEND_URL+'/api/crud/getcardwithoutviewsupdate'  
  await fetch(backend, {
    method: 'POST',
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify({owner:owner, name:name})
  }).then(res => res.json()).then(async(data) => {
 if(data.success) {
  return res.render('manage.ejs', {account: req.account, msg: null, data: data.data})
 }
 console.log(data)
 return res.sendStatus(404)
  })
})
app.get('/dashboard/:name/analyze', isauthenticated , async (req, res) => {
  const name = req.params.name
  const owner = req.account.name
  const backend = process.env.BACKEND_URL+'/api/crud/getcardwithoutviewsupdate'  
  await fetch(backend, {
    method: 'POST',
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify({owner:owner, name:name})
  }).then(res => res.json()).then(async(data) => {
 if(data.success) {
  return res.render('analyze.ejs', {account: req.account, msg: null, data: data.data})
 }
 console.log(data)
 return res.sendStatus(404)
  })
})
app.get('/dashboard/:name/settings', isauthenticated , async (req, res) => {
  const name = req.params.name
  const owner = req.account.name
  const backend = process.env.BACKEND_URL+'/api/crud/getcardwithoutviewsupdate'  
  await fetch(backend, {
    method: 'POST',
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify({owner:owner, name:name})
  }).then(res => res.json()).then(async(data) => {
 if(data.success) {
  return res.render('settings.ejs', {account: req.account, msg: null, data: data.data})
 }
 console.log(data)
 return res.sendStatus(404)
  })
})
app.get('/dashboard/:name/links', isauthenticated , async (req, res) => {
  const name = req.params.name
  const owner = req.account.name
  const backend = process.env.BACKEND_URL+'/api/crud/getcardwithoutviewsupdate'  
  await fetch(backend, {
    method: 'POST',
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify({owner:owner, name:name})
  }).then(res => res.json()).then(async(data) => {
 if(data.success) {
  return res.render('links.ejs', {account: req.account, msg: null, data: data.data})
 }
 console.log(data)
 return res.sendStatus(404)
  })
})
app.get('/dashboard/account', isauthenticated, async (req, res) => {
  res.render('account.ejs', {account: req.account, msg: null})
})
app.get('/login', isnotauthenticated , async (req, res) => {

    
    res.render('login.ejs', {msg: false})
})
app.get('/home', isnotauthenticated , async (req, res) => {

    
  res.render('home.ejs')
})
app.get('/', isnotauthenticated , async (req, res) => {

    
  res.render('home.ejs')
})
app.get('/register', isnotauthenticated , async (req, res) => {
    res.render('register.ejs', {msg:""})
})

app.get('/dashboard', isauthenticated , async(req, res) => {
  const backend = process.env.BACKEND_URL+'/api/crud/getallcards'  
  try {
    await fetch(backend, {
      method: 'GET',
      headers: {
        "Content-Type": "application/json",
        "token": req.cookies.token
       
      }
    }).then(res => res.json()).then(async(data) => {
      if(data.success) {
        return res.render('dashboard.ejs', {data: data.data, account: req.account, msg: null})
      }

        return res.render('dashboard.ejs', {data: undefined, account: req.account, msg: null})
      
    })

  } catch (e) {

    res.sendStatus(500)
  }

})

app.post('/login', async (req, res) => {
    const backend = process.env.BACKEND_URL+'/api/auth/login'  
    try {
    await fetch(backend, {
        method: 'POST',
        headers: {
          "Content-Type": "application/json",
         
        },
        body: JSON.stringify({
            email: req.body.email,
            password: req.body.password
        })
      }).then(res => res.json()).then(async(data) => {
          if(data.success) {
            res.cookie('token',data.token, { maxAge: 900000000000000, httpOnly: true })
            return res.redirect('/dashboard')
          } else {
            res.render('login.ejs', {msg:data.msg || data.errors[0].msg})
          }

      })
    } catch{
      res.sendStatus(500)
    }

})
app.post('/register', async (req, res) => {
  const blacklist = new RegExp("^[A-Za-z0-9._~()'!*:@,;+?-]*$", 'i')
  if(!blacklist.test(req.body.name)) {
    return res.render('register.ejs', {msg: 'Name cannot have spaces, or non url friendly characters.'})
  }
    const backend = process.env.BACKEND_URL+'/api/auth/register'  
    try {
    await fetch(backend, {
        method: 'POST',
        headers: {
          "Content-Type": "application/json",
         
        },
        body: JSON.stringify({
            name: req.body.name,
           
            email: req.body.email,
            password: req.body.password
        })
      }).then(res => res.json()).then(async(data) => {
          if(data.success) {
          
            return res.render('registered.ejs')
          } else {
            res.render('register.ejs', {msg:data.msg || data.errors[0].msg})
          }

      })
    } catch{
      res.sendStatus(500)
    }

})
app.get('/verify/:id',  isnotauthenticated , async (req, res) => {
    const id = req.params.id
    if(!id) {
        return res.send("Cannot verify your account.")
    }
    const backend = process.env.BACKEND_URL+'/api/auth/verify'
    await fetch(backend, {
        method: 'POST',
        headers: {
          "Content-Type": "application/json",
         
        },
        body: JSON.stringify({
           ID:id
        })
      }).then(res => res.json()).then(async(data) => {
          if(data.success) {
            res.cookie('token',data.token, { maxAge: 900000000000000, httpOnly: true })
            return res.redirect('/dashboard')
          } else {
            return res.send("Cannot verify your account.")
          }

      })  
    
})
app.post('/dashboard/new', isauthenticated, async(req, res) => {
  const backend = process.env.BACKEND_URL+'/api/crud/create'
const token = req.cookies.token;
const blacklist = new RegExp("^[A-Za-z0-9._~()'!*:@,;+?-]*$", 'i')

if(!blacklist.test(req.body.name)) {
  return res.send(`Name cannot have spaces, or non url friendly characters. Go <a href='/dashboard'>back?</a>`)
}
 try {
  await fetch(backend, {
    method: 'POST',
    headers: {
      "Content-Type": "application/json",
      "token": token
     
    },
    body: JSON.stringify({ name: req.body.name,
      tags: req.body.tags }),
    
  }).then(res => res.json()).then(async(data) => {

    if(data.success) {
      res.redirect(`/dashboard/${req.body.name}/manage`)
    } else {
      res.send(`${data.msg || data.errors[0].msg || 'Unknown Error'} go <a href='/dashboard'>back?</a> `)
    }
  })
} catch {
  res.sendStatus(500)
}


})


app.post('/dashboard/:name/delete', isauthenticated, async(req , res) => {
  const backend = process.env.BACKEND_URL+'/api/crud/delete'
  const token = req.cookies.token
  const name = req.params.name

  try {
    await fetch(backend, {
      headers: {
        'Content-Type': 'application/json',
        'token': token
      },
      method: 'DELETE',
      body: JSON.stringify({name: name})
    }).then(res => res.json()).then(async(data) => {
      if(data.success) {
        return res.redirect('/dashboard')
      } else {
        res.sendStatus(404)
      }
    })
    
  } catch {
    res.sendStatus(500)
  }
})
app.post('/dashboard/account', isauthenticated, async(req , res) => { 
 
const backend = process.env.BACKEND_URL+'/api/auth/changepassword'
const password = req.body.password
const newpassword = req.body.newpassword
const confirmnewpassword = req.body.confirmnewpassword
try {
await fetch(backend, {
  method: 'POST',
  headers: {
    'token': req.cookies.token,
    'Content-Type': 'application/json'
  },
  body: JSON.stringify({password: password, newpassword: newpassword, confirmnewpassword: confirmnewpassword})
}).then(res => res.json()).then(async(data) => {
  if(data.success) {
    res.cookie('token',data.token, { maxAge: 900000000000000, httpOnly: true })
    return res.render('account.ejs', {account: req.account, msg: 'Password has been updated'})
  } else {
    return res.render('account.ejs', {account: req.account, msg: data.msg || data.errors[0].msg || "Unkown error occured."})
  }
})
} catch {
  return res.sendStatus(500)
}
})
app.get('/dashboard/docs', async (req, res) => {
  res.render('docs.ejs')
})
app.get('/logout', isauthenticated, async (req , res)=> {
   res.clearCookie("token");
  return res.redirect('/')
})

app.get('/:owner/:name', async (req , res) => {
  const owner = req.params.owner
  const name = req.params.name 
  const backend = process.env.BACKEND_URL+'/api/crud/getcard'
  try {
await fetch(backend, {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json'
  },
  body: JSON.stringify({owner: owner, name: name})
}).then(res => res.json()).then(async(data) => {
  if(data.success) {
    return res.render('card.ejs', {data: data.data})
  } else {
    return res.sendStatus(404)
  }
})

  } catch {
    res.sendStatus(500)
  }
})

app.get('/trending', async(req, res) => {
  const backend = process.env.BACKEND_URL+'/api/crud/trending'
  try {

    await fetch(backend, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json'
      }
    }).then(res => res.json()).then(async(data) => {
  res.render('trending.ejs', {data: data.data})
})
} catch (e) {
  console.log(e)
  res.sendStatus(500)
}
})
app.get('/terms', async (req, res) => {
  res.render('terms.ejs')
})
app.get('/privacy', async(req, res)=> {
  res.render('privacy.ejs')
})

app.post('/dashboard/:type/:name/update', isauthenticated, async (req, res) => {
  const name = req.params.name
  const type = req.params.type
  const backend = process.env.BACKEND_URL+`/api/crud/update/${type}`
  try {
    await fetch(backend, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'token': req.cookies.token
      }, 
      body: JSON.stringify(req.body)
    }).then(res => res.json()).then(async(data) => {
      if(data.success) {
        return res.json({success: true, msg: 'Changes are UpToDate...'})
      } else {
        return res.json({success: false, msg: data.msg, errors: data.errors[0].msg || data.errors || 'Internal Server Error'})
      }
    })
  } catch {
    res.json({sucess: false, msg: 'Internal Server Error', errors: 'Internal Server Error'})
  }
})

app.post('/dashboard/:name/links', isauthenticated, async (req , res) => {
  const cardname = req.params.name;
  const name = req.body.name;
  const link = req.body.link;
  const avatar = req.body.avatar || null
  const body = JSON.stringify({linkname: name, name: cardname, link: link, avatar: avatar})
  const backend = process.env.BACKEND_URL+`/api/crud/addlink/`
  try {
    await fetch(backend, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'token': req.cookies.token
      },
      body: body
    }).then(res => res.json()).then(async(data) => {
      if(data.success) {
        return res.redirect(`/dashboard/${cardname}/links`)
      } else {
        return res.send(`An error occured: ${data.msg || data.errors[0].msg || data.errors || 'Internal Server Error'}. Go <a href="/dashboard/${cardname}/links">back?</a> `)
      }
    })
  } catch {
    return res.sendStatus(500)
  }
})

app.post('/dashboard/:name/links/delete', isauthenticated, async(req, res) => {
  const name = req.params.name
  const linkname = req.query.linkname
  const body = JSON.stringify({name: name, linkname: linkname})
  const backend = process.env.BACKEND_URL+`/api/crud/deletelink/`
  try {
    await fetch(backend, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'token': req.cookies.token

      },
      body: body
    }).then(res => res.json()).then(async(data) => {
      if(data.success) {
        return res.redirect(`/dashboard/${name}/links`)
      } else {
        return res.send(`An error occured: ${data.msg || data.errors[0].msg || data.errors || 'Internal Server Error'}. Go <a href="/dashboard/${cardname}/links">back?</a> `)
      }
    })
  } catch {
    
    res.sendStatus(500)
  }
  
})

// always keep last
app.get('*', function(req, res){
  res.sendStatus(404)
});

const port = process.env.PORT || 90

app.listen(port, () => {
  console.log(`server started on: ${port}`)
});

