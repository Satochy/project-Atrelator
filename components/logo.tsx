import Image from "next/image";
import Link from "next/link";
import localFont from "next/font/local";

import { cn } from "@/lib/utils";

const headingFont = localFont({
    src:"../public/fonts/font.woff2"
})

export const Logo = () => {
    return (
        <Link href="/">
            <div className="hover:opacity-75 transition items-center gap-x-2 md:flex">
                <Image 
                    src="/atrelator-logo.png"
                    alt="Logo"
                    height={30}
                    width={30}
                />
                <p className={cn("text-lg text-neutral-700 pb-1", headingFont.className,)}>
                    Atrelator
                </p>
            </div>
        </Link>
    )
}