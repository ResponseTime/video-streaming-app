import React from 'react'
import Image from 'next/image'
import styles from "./navbar.module.css"
import Link from 'next/link'
export default function navbar() {
    return (
        <div className={styles.nav}>
            <Link href="/">
                <Image src="/next.svg" alt="img" width={90} height={20} />
            </Link>
        </div>
    )
}
