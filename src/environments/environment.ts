// This file can be replaced during build by using the `fileReplacements` array.
// `ng build` replaces `environment.ts` with `environment.prod.ts`.
// The list of file replacements can be found in `angular.json`.

const apiKey: string = 'AIzaSyCtV65qh8OjmZ75uNDO1zw0lYlPYsrnjsc';

export const environment = {
  production: false,
  urlFirebase: `https://smar-software-default-rtdb.firebaseio.com/${localStorage.getItem(
    'localId'
  )}/`,
  urlFirebaseSinLocalId: `https://smar-software-default-rtdb.firebaseio.com/`,
  urlLogin: `https://identitytoolkit.googleapis.com/v1/accounts:signInWithPassword?key=${apiKey}`,
  urlGetUser: `https://identitytoolkit.googleapis.com/v1/accounts:lookup?key=${apiKey}`,
  urlRefreshToken: `https://securetoken.googleapis.com/v1/token?key=${apiKey}`,
  urlStorage: {
    img: `/img/${localStorage.getItem('localId')}`,
  },
  firebaseConfig: {
    apiKey: apiKey,
    authDomain: 'integro-group.firebaseapp.com',
    projectId: 'integro-group',
    storageBucket: 'integro-group.appspot.com',
    messagingSenderId: '387701533633',
    appId: '1:387701533633:web:716a4376a5c6ce52381d40',
    measurementId: 'G-7N5RZ3Q7FE',
  },
  collections: {
    categories: 'categories',
    products: 'products',
    users: 'users',
    counts: 'counts', // Coleccion por fuera de la agrupacion por cuentas
    orders: 'orders',
    disputes: 'disputes',
    messages: 'messages',
    sales: 'sales',
    stores: 'stores',
    versions: 'versions',
    alerts: 'alerts',
    shops_data: 'shops_data',
  },
  urls_program: {
    // No pertenecen a las colecciones de la bd, URL's del programa
    edit_product: 'edit-product',
    new_product: 'new-product',
  },
  version: '1.0.0',
  apiKeyLocation: 'dU1Pc1lYSnBVZDVqcVpSYjhVSkswTGhWTWlRWVZaUHpIdFBuemhINA==',
  urlLocation: `https://api.countrystatecity.in/v1/`,
};

/*
 * For easier debugging in development mode, you can import the following file
 * to ignore zone related error stack frames such as `zone.run`, `zoneDelegate.invokeTask`.
 *
 * This import should be commented out in production mode because it will have a negative impact
 * on performance if an error is thrown.
 */
// import 'zone.js/plugins/zone-error';  // Included with Angular CLI.
