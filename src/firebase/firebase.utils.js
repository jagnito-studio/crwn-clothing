import { initializeApp } from 'firebase/app';
import { getFirestore, collection, doc, getDoc, setDoc } from "firebase/firestore";

import { getAuth, signInWithPopup, GoogleAuthProvider } from "firebase/auth";

const config = {
    apiKey: "AIzaSyAVLecMR_yvA8AsMKBAd1pC-FgAoPN7JRU",
    authDomain: "crwn-db-8a7ac.firebaseapp.com",
    projectId: "crwn-db-8a7ac",
    storageBucket: "crwn-db-8a7ac.appspot.com",
    messagingSenderId: "382737986447",
    appId: "1:382737986447:web:e44c3bffad5fbd122111fa",
    measurementId: "G-NJF70NBTN0"
};


export const createUserProfileDocument = async (userAuth, additionalData) => {
    if (!userAuth) return;

    const userRef = doc(collection(firestore, "users"), `${userAuth.uid}`);
    const snapShot = await getDoc(userRef);

    // For new user, create an entry in firestore
    if (!snapShot.exists()) {
        const { displayName, email } = userAuth;
        const createdAt = new Date();
        try {
            await setDoc(userRef, {
                displayName, 
                email, 
                createdAt,
                ...additionalData
            })
        } catch (error) {
            console.log('error creating user', error.message);
        }
    }

    return userRef;
}

const app = initializeApp(config);

export const auth = getAuth();
export const firestore = getFirestore(app);

const provider = new GoogleAuthProvider();
provider.setCustomParameters({ prompt: 'select_account' });
export const signInWithGoogle = () => signInWithPopup(auth, provider)
    .then(function(result) {
        // result.user.tenantId should be ‘TENANT_PROJECT_ID’.
    }).catch(function(error) {
        // Handle error.
    });

export default app;