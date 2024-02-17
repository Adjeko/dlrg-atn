import Pocketbase from 'pocketbase'


//wird mit/vor jedem Request ausgeführt
export const handle = async({event, resolve} : any)=>{
  // event.locals.pb = new Pocketbase('http://localhost:8090')
  event.locals.pb = new Pocketbase('https://db.dlrgtrack.de/')
  event.locals.pb.authStore.loadFromCookie(event.request.headers.get('cookie') || '')

  if(event.locals.pb.authStore.isValid){
    event.locals.user = event.locals.pb.authStore.model
  }
  else {
    event.locals.user = undefined
  }

  //in diesem resolve passiert die Serverside Logik
  const response = await resolve(event)

  response.headers.set('set-cookie', event.locals.pb.authStore.exportToCookie({secure: false}))
  return response
}