import { UserInterface } from './../../models/user';

import { Injectable } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/auth';
import { AngularFirestore, AngularFirestoreDocument, AngularFirestoreCollection } from '@angular/fire/firestore';
import { Router } from '@angular/router';
import { BehaviorSubject, Observable, of } from 'rxjs';

import { map, switchMap } from 'rxjs/operators';
import { auth, User } from 'firebase';


@Injectable({
  providedIn: 'root'
})
export class AuthService {
  
  private usersCollection: AngularFirestoreCollection<UserInterface>;
  public user$: Observable<UserInterface>;


  constructor(
    private afAuth: AngularFireAuth,
    private afs: AngularFirestore,
    private router: Router) { 

    


      this.usersCollection = afs.collection<UserInterface>('users');

      this.user$ = this.afAuth.authState.pipe(
        switchMap(user => {
            // Logged in
          if (user) {
            return this.afs.doc<UserInterface>(`users/${user.uid}`).valueChanges();
          } else {
            // Logged out
            return of(null);
          }
        })
      )
    }


    registerUser(user) {
      return new Promise((resolve, reject) => {
        this.afAuth.auth.createUserWithEmailAndPassword(user.email, user.password)
          .then(userData => {
            resolve(userData),
              this.updateUserData(userData.user)
          }).catch(err => console.log(reject(err)))
      });
    }
  
    loginEmailUser(email: string, pass: string) {
      return new Promise((resolve, reject) => {
        this.afAuth.auth.signInWithEmailAndPassword(email, pass)
          .then(userData => resolve(userData),
          err => reject(err));
      });
    }
  
  
   async loginGoogleUser() {
    const provider = new auth.GoogleAuthProvider();
    const credential = await this.afAuth.auth.signInWithPopup(provider);
    return this.updateUserData(credential.user);
    }
  
  async  logoutUser() {
      await this.afAuth.auth.signOut();
      return this.router.navigate(['/landing'])
    }
  
    isAuth() {
      return this.afAuth.authState.pipe(map(auth => auth));
    }
    addUser(user:UserInterface){
      return this.usersCollection.add(user);

    }

   public getUser(userId){
     return this.usersCollection.doc(userId)
    }


    private updateUserData({uid,email, displayName,photoURL, welcome}:UserInterface) {
    return this.usersCollection.doc(uid).set({
          uid:uid ,
          email:email,
          displayName: displayName,
          photoURL:photoURL,
          welcome:welcome,
        }, { merge: true } )
      }
    

      userUpdate(user){
        let idUser = user.uid;
         return  this.usersCollection.doc(idUser).update(user)
   
      }
    
      isUserAdmin(userUid) {
        return this.afs.doc<UserInterface>(`users/${userUid}`).valueChanges();
      }
    }
  
  
  

