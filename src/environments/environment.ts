// This file can be replaced during build by using the `fileReplacements` array.
// `ng build` replaces `environment.ts` with `environment.prod.ts`.
// The list of file replacements can be found in `angular.json`.

export const environment = {
  production: false,
  urlFirebase: 'https://smar-software-default-rtdb.firebaseio.com/',
  urlLogin:
    'https://identitytoolkit.googleapis.com/v1/accounts:signInWithPassword?key=AIzaSyBxCouwRSjWYrt9lWcc3GhqYaeUhxYVrWc',
  urlGetUser:
    'https://identitytoolkit.googleapis.com/v1/accounts:lookup?key=AIzaSyBxCouwRSjWYrt9lWcc3GhqYaeUhxYVrWc',
  firebaseConfig: {
    apiKey: 'AIzaSyBxCouwRSjWYrt9lWcc3GhqYaeUhxYVrWc',
    authDomain: 'smar-software.firebaseapp.com',
    databaseURL: 'https://smar-software-default-rtdb.firebaseio.com',
    projectId: 'smar-software',
    storageBucket: 'smar-software.appspot.com',
    messagingSenderId: '474388620930',
    appId: '1:474388620930:web:cefbaad0c4c544efe3769b',
    measurementId: 'G-Q0QR49CGXL',
  },
};

/*
 * For easier debugging in development mode, you can import the following file
 * to ignore zone related error stack frames such as `zone.run`, `zoneDelegate.invokeTask`.
 *
 * This import should be commented out in production mode because it will have a negative impact
 * on performance if an error is thrown.
 */
// import 'zone.js/plugins/zone-error';  // Included with Angular CLI.
