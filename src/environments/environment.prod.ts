const apiKey = 'AIzaSyBxCouwRSjWYrt9lWcc3GhqYaeUhxYVrWc';

export const environment = {
  production: true,
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
    authDomain: 'smar-software.firebaseapp.com',
    databaseURL: 'https://smar-software-default-rtdb.firebaseio.com',
    projectId: 'smar-software',
    storageBucket: 'smar-software.appspot.com',
    messagingSenderId: '474388620930',
    appId: '1:474388620930:web:cefbaad0c4c544efe3769b',
    measurementId: 'G-Q0QR49CGXL',
  },
  collections: {
    categories: 'categories',
    products: 'products',
    subCategories: 'sub-categories',
    users: 'users',
    counts: 'counts', // Coleccion por fuera de la agrupacion por cuentas
    orders: 'orders',
    disputes: 'disputes',
    messages: 'messages',
    sales: 'sales',
    stores: 'stores',
  },
  urls_program: {
    // No pertenecen a las colecciones de la bd, URL's del programa
    edit_product: 'edit-product',
    new_product: 'new-product',
  },
  aplications: {
    admin: {
      version: 'aplications/admin/version',
      alerts: {
        allPages: 'aplications/admin/alerts/allPages',
        url: 'aplications/admin/alerts/',
      },
    },
  },
  version: '1.0.0',
  apiKeyLocation: 'dU1Pc1lYSnBVZDVqcVpSYjhVSkswTGhWTWlRWVZaUHpIdFBuemhINA==',
  urlLocation: `https://api.countrystatecity.in/v1/`,
};
