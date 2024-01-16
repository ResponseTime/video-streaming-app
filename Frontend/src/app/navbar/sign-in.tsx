'use client'
import React, { Fragment } from 'react'
import styles from './sign.module.css'
import { SignInWithGoogle, signOut } from '../firebase/firbase'
import { User } from 'firebase/auth'

interface SignInProps {
    user: User | null;
}
export default function SignIn({ user }: SignInProps) {
    return (
        <Fragment>
            {user ? <button className={styles.signin} onClick={signOut}>
                sign out
            </button> : <button className={styles.signin} onClick={SignInWithGoogle}>
                sign in
            </button>}
        </Fragment>
    )
}
