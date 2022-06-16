// Copyright (c) 2022 Views

const BASE_URL = 'https://views.gq'
async function updatedescription(x, y) {
    const URL = BASE_URL+`/dashboard/description/${y}/update`
    var info = document.getElementById('somerandomdiv');
    info.innerHTML = `<p class="h3">Saving Changes...</p>`

const description = x.value;
    const body = JSON.stringify({description: description, name: y});
    try {
    await fetch(URL, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: body
    }).then(res => res.json()).then(async(data) => {
        if(data.success) {
            info.innerHTML = `<p class='h3'>${data.msg}</p>`;
            return;
        } else {
            info.innerHTML = `<p class='h3'>${data.errors || data.errors[0].msg || data.msg || 'Internal Server Error'}</p>`;
        }
    })
} catch {
    info.innerHTML = `<p class="h3" style="color: red !important;">Error Saving Changes, Retry?</p>`
}
}
async function updateshortbio(x, y) {
    const URL = BASE_URL+`/dashboard/shortbio/${y}/update`
    var info = document.getElementById('somerandomdiv');
    info.innerHTML = `<p class="h3">Saving Changes...</p>`
    const shortbio = x.value;
    const body = JSON.stringify({shortbio: shortbio, name:y})
    try {
        await fetch(URL, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },  
            body: body      
        }).then(res => res.json()).then(async(data) => {
            if(data.success) {
                info.innerHTML = `<p class='h3'>${data.msg}</p>`;
                return;
            } else {
                info.innerHTML = `<p class='h3'>${data.errors || data.errors[0].msg || data.msg || 'Internal Server Error'}</p>`;
            }
        })
    } catch(e) {
   
        info.innerHTML = `<p class="h3" style="color: red !important;">Error Saving Changes, Retry?</p>`
    }

}

async function updatelocation(x, y) {
    const URL = BASE_URL+`/dashboard/location/${y}/update`
    var info = document.getElementById('somerandomdiv');
    info.innerHTML = `<p class="h3">Saving Changes...</p>`
    const location = x.value
    const body = JSON.stringify({location: location, name: y})
    try {
        await fetch(URL, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },  
            body: body   

        }).then(res => res.json()).then(async(data) => {
            if(data.success) {
                info.innerHTML = `<p class='h3'>${data.msg}</p>`;
                return;
            } else {
                info.innerHTML = `<p class='h3'>${data.errors || data.errors[0].msg || data.msg || 'Internal Server Error'}</p>`;
            }
        })
    } catch {
        info.innerHTML = `<p class="h3" style="color: red !important;">Error Saving Changes, Retry?</p>`

    }


}

async function updatetags(y) {
    const URL = BASE_URL+`/dashboard/tags/${y}/update`;
    var info = document.getElementById('updatetagsbtn');
    info.disabled = true;
    info.innerText = `Saving Tags...`;
    const tags = document.getElementById('tags').value;
    const body = JSON.stringify({tags: tags, name: y});
    try {
        await fetch(URL, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: body
        }).then(res => res.json()).then(async(data) => {
            if(data.success) {
                info.innerText = `Changes Saved!`
                setTimeout(() => {
                    info.disabled = false;
                    info.innerText = `Save Tags`;
                }, 2000)
            }
        })
    } catch {
        info.innerText = `Error Saving Changes, Retry?`;
        setTimeout(() => {
            info.disabled = false;
            info.innerText = `Save Tags`;
        }, 2000)
    }
}

async function updatetheme(y) {
    const URL = BASE_URL+`/dashboard/theme/${y}/update`;
    var info = document.getElementById('updatethemebtn')
    info.disabled = true;
    info.innerText = `Saving Theme...`;
    const theme = document.getElementById('theme').value;
    const body = JSON.stringify({theme: theme, name: y});
    try {
        await fetch(URL, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: body


        }).then(res => res.json()).then(async(data) => {
            if(data.success) {
                info.innerText = `Changes Saved!`
                setTimeout(() => {
                    info.disabled = false;
                    info.innerText = `Save Theme`;
                }, 2000)
            }

        })
    } catch {

        info.innerText = `Error Saving Changes, Retry?`;
        setTimeout(() => {
            info.disabled = false;
            info.innerText = `Save Theme`;
        }, 2000)
    }
}

async function updategradient(y) {
    const URL = BASE_URL+`/dashboard/gradient/${y}/update`;
    var info = document.getElementById(`updategradientbtn`);
    info.disabled = true;
    info.innerText = `Saving Gradient...`;
    const gradient = document.getElementById(`gradient`).value;
    const body = JSON.stringify({gradient: gradient, name: y});
    try {
        await fetch(URL, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            }, 
            body: body
        }).then(res => res.json()).then(async(data) => {
            if(data.success) {
                info.innerText = `Changes Saved!`
                setTimeout(() => {
                    info.disabled = false;
                    info.innerText = `Save Gradient`;
                }, 2000)
            }
        })

    } catch {

        info.innerText = `Error Saving Changes, Retry?`;
        setTimeout(() => {
            info.disabled = false;
            info.innerText = `Save Gradient`;
        }, 2000)
    }

}
async function updateavatar(y) {
    const URL = BASE_URL+`/dashboard/avatar/${y}/update`;
    var info = document.getElementById(`updateavatarbtn`);
    info.disabled = true;
    info.innerText = `Saving Avatar...`;
    const avatar = document.getElementById(`avatar`).value;
    const body = JSON.stringify({name: y, avatar: avatar})
    try {
    await fetch(URL, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        }, 
            body: body
        
    }).then(res => res.json()).then(async(data) => {
        if(data.success) {
            info.innerText = `Changes Saved!`
            setTimeout(() => {
                info.disabled = false;
                info.innerText = `Save Avatar`;
            }, 2000)
        }
   
    })
} catch {
    info.innerText = `Error Saving Changes, Retry?`;
    setTimeout(() => {
        info.disabled = false;
        info.innerText = `Save Avatar`;
    }, 2000)

}

}
async function updatefont(y) {
    const URL = BASE_URL+`/dashboard/fontcolor/${y}/update`;
    var info = document.getElementById('updatefontbtn');
    info.disabled = true;
    info.innerText = `Saving Font Color...`
    const fontcolor = document.getElementById('fontcolor').value;
    const body = JSON.stringify({name: y, fontcolor: fontcolor});
    try {
        await fetch(URL, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            }, 
                body: body
            
        }).then(res => res.json()).then(async(data) => {
            if(data.success) {
                info.innerText = `Changes Saved!`
                setTimeout(() => {
                    info.disabled = false;
                    info.innerText = `Save Font`;
                }, 2000)
            }
       
        })
    } catch {
        info.innerText = `Error Saving Changes, Retry?`;
        setTimeout(() => {
            info.disabled = false;
            info.innerText = `Save Font`;
        }, 2000)
    
    }

}
function undisable() {
    var btn = document.getElementById(`deletebtn`)
    var text = document.getElementById(`deleter`).value;
    if(text.toLowerCase() === `i am aware that this decision is final`) {
        btn.disabled = false;
        return;
    } else {
        btn.disabled = true;
    }
}

function load() {
    var x = document.getElementById(`deletebtn`)
    x.disabled = true;
    x.innerText = `Loading...`
}


