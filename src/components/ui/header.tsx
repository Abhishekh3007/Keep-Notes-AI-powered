import Link from 'next/link'
import React from 'react'
import Image from 'next/image';
import { shadow } from '@/app/styles/utils';
import {Button} from '@/components/ui/button';
import {ModeToggle} from '@/components/ui/DarkModeToggle'
import LogOutbutton from '@/components/ui/logoutbutton';
import { getUser } from '@/auth/server';

  async function Header() {
    const user=await getUser();
  return (
    
    <header
      className="bg-popover relative flex h-24 w-full items-center justify-between px-3 sm:px-8"
      style={{
        boxShadow: shadow,
      }}
    >
     

      <Link className="flex items-end gap-2" href="/">
        <Image
          src="/luffy.png"
          height={60}
          width={60}
          alt="logo"
          className="rounded-full"
          priority
        />

        <h1 className="flex flex-col pb-1 text-2xl font-semibold leading-6">
          KEEP <span>Notes</span>
        </h1>
      </Link>
      <div className="flex  gap-4">
        {user ? (
           <LogOutbutton/>
        ) : (
           <>
            <Button className="hidden sm:block" asChild><Link href="/sign-up">SignUp</Link></Button>
           <Button  asChild variant='outline'><Link href="/Login">Login</Link></Button>
            
           </>
           
        )}
      </div>
      <ModeToggle />
    </header>
  )
}
export default Header;