const apiKey = 'AIzaSyBxCouwRSjWYrt9lWcc3GhqYaeUhxYVrWc';

export const environment = {
  production: true,
  urlFirebase: `https://smar-software-default-rtdb.firebaseio.com/${localStorage.getItem(
    'localId'
  )}/`,
  urlLogin: `https://identitytoolkit.googleapis.com/v1/accounts:signInWithPassword?key=${apiKey}`,
  urlGetUser: `https://identitytoolkit.googleapis.com/v1/accounts:lookup?key=${apiKey}`,
  urlRefreshToken: `https://securetoken.googleapis.com/v1/token?key=${apiKey}`,
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
};
