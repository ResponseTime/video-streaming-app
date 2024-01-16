'use client'
import React, { useEffect, useState } from 'react'
import Image from 'next/image'
import styles from "./navbar.module.css"
import Link from 'next/link'
import SignIn from './sign-in'
import { onAuthStateChangedHeler } from '../firebase/firbase'
import { User } from 'firebase/auth'
export default function navbar() {
    const [user, setUser] = useState<User | null>(null)
    useEffect(() => {
        const unsub = onAuthStateChangedHeler((user) => {
            setUser(user)
        })
        return () => unsub()
    }, [])
    return (
        <div className={styles.nav}>
            <Link href="/">
                <Image src="/next.svg" alt="img" width={90} height={20} />
            </Link>
            <SignIn user={user} />
        </div>
    )
}
