
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
app.use(express.static('public'))
app.use(error)
const isnotauthenticated = require('./middleware/isnotauthenticated')
const isauthenticated = require('./middleware/isauthenticated');
const fetch = require('node-fetch')
const qs = require('querystring')
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
app.get('/dashboard/new', isauthenticated , async (req, res) => {
  res.render('new.ejs', {account: req.account, msg: null})
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
        return res.render('dashboard.ejs', {data: data.data, account: req.account})
      }

        return res.render('dashboard.ejs', {data: undefined, account: req.account})
      
    })

  } catch (e) {

    res.sendStatus(500)
  }

})
app.get('/dashboard/:name/delete', isauthenticated, async (req, res) => {
  res.render('delete.ejs', {account: req.account, name: req.params.name})

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
  return res.render('new.ejs', {msg: 'Name cannot have spaces, or non url friendly characters.', account: req.account})
}
 try {
  await fetch(backend, {
    method: 'POST',
    headers: {
      "Content-Type": "application/json",
      "token": token
     
    },
    body: JSON.stringify(req.body)
  }).then(res => res.json()).then(async(data) => {
    if(data.success) {
      res.redirect(`/dashboard/${req.body.name}/manage`)
    } else {
      res.render('new.ejs', {msg: data.msg || data.errors[0].msg, account: req.account})
    }
  })
} catch {
  res.sendStatus(500)
}


})
app.post('/dashboard/:name/manage', isauthenticated, async(req, res) => {
  const backend = process.env.BACKEND_URL+'/api/crud/update'
  const token = req.cookies.token;

   

    
  
   

 try { 

  await fetch(backend, {
    headers: {
      "Content-Type":"application/json",
      "token": token
    },
    method: 'POST',
    body: JSON.stringify({  
      name: req.params.name,
     
      avatar: req.body.avatar || null,
  
  
      tags: req.body.tags,
      location: req.body.location || null,
      theme: req.body.theme || "#3673fc",
      gradient: req.body.gradient || "#000000",
      shortbio: req.body.shortbio,
      description: req.body.description,
      
      link1name: req.body.link1name || null,
      link1avatar: req.body.link1avatar || null,
      link1url: req.body.link1url || null,
    
      link2name: req.body.link2name || null,
      link2avatar: req.body.link2avatar || null,
      link2url: req.body.link2url || null,
    
      link3name: req.body.link3name || null,
      link3avatar: req.body.link3avatar || null,
      link3url: req.body.link3url || null,
      
      link4name: req.body.link4name || null,
      link4avatar: req.body.link4avatar || null,
      link4url: req.body.link4url || null})
  }).then(res => res.json()).then(async(data) => {
    if(data.success) {
      return res.render('manage.ejs',  {account: req.account, msg: null, data: data.datatoupdate})
    }
    console.log(data)
    return res.render('manage.ejs', {account: req.account, msg: "Validation Error Occured!", data: req.body})
  })
} catch(e) {

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

// always keep last
app.get('*', function(req, res){
  res.sendStatus(404)
});

const port = process.env.PORT || 90

app.listen(port, () => {
  console.log(`server started on: ${port}`)
});

