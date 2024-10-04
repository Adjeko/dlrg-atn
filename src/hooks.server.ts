import Pocketbase from 'pocketbase'


//wird mit/vor jedem Request ausgeführt
export const handle = async({event, resolve} : any)=>{
  // event.locals.pb = new Pocketbase('http://localhost:8090')
  event.locals.pb = new Pocketbase('https://db.dlrgatn.de/')
  event.locals.pb.authStore.loadFromCookie(event.request.headers.get('cookie') || '')

  try {
		if (event.locals.pb.authStore.isValid) {
			await event.locals.pb.collection('users').authRefresh();
			event.locals.user = event.locals.pb.authStore.model;
		}
	} catch (_) {
		event.locals.pb.authStore.clear();
		event.locals.user = undefined;
	}

  //in diesem resolve passiert die Serverside Logik
  const response = await resolve(event)

  response.headers.set('set-cookie', event.locals.pb.authStore.exportToCookie({secure: false, domain: 'dlrgatn.de'}))
  return response
}