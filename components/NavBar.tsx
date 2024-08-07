"use client"

// import {
//     Sheet,
//     SheetContent,
//     SheetDescription,
//     SheetHeader,
//     SheetTitle,
//     SheetTrigger,
// } from "@/components/ui/sheet"
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger
} from "@/components/ui/dropdown-menu"
import { Button} from "@/components/ui/button";
import Link from "next/link"
import { usePathname} from "next/navigation";
import {NavigationalPaths} from "@/constans";
import UserButton from "@/components/auth/userButton";
import {TextAlignJustifyIcon} from "@radix-ui/react-icons"


const NavBar = () => {
    const pathName = usePathname()
    return (
        <div className="w-full bg-secondary flex justify-between items-center p-4 rounded-xl shadow-sm">

            <div className="hidden lg:flex gap-2">
                {
                    NavigationalPaths.map((path, index) => (
                        <Button
                            variant={path.path === pathName ? "default" : "outline"}
                            key={index}
                            type={"button"}
                            asChild>
                            <Link href={path.path}>{path.name}</Link>
                        </Button>
                    ))
                }

            </div>

            <UserButton />

            <div className="flex lg:hidden">
                <MobileNavigation pathName={pathName} />
            </div>

        </div>
    );
};

export default NavBar;


const MobileNavigation = ({pathName}:{pathName: string}) => {
    return (
        <DropdownMenu>
            <DropdownMenuTrigger>
                <TextAlignJustifyIcon className="w-6 h-6"/>
            </DropdownMenuTrigger>
            <DropdownMenuContent align={"end"}>
                {
                    NavigationalPaths.map((path, index) => (
                        <DropdownMenuItem key={index}>
                            <Button
                                className="w-full"
                                variant={path.path === pathName ? "default" : "outline"}
                                type={"button"}
                                asChild>
                                <Link href={path.path}>{path.name}</Link>
                            </Button>
                        </DropdownMenuItem>
                    ))
                }
            </DropdownMenuContent>
        </DropdownMenu>
    )
}

//sheet component also can use it for mobile navigation

// const MobileNavigation = ({pathName}:{pathName: string}) => {
//     return (
//         <Sheet>
//             <SheetTrigger>
//                 <TextAlignJustifyIcon className="w-6 h-6"/>
//             </SheetTrigger>
//             <SheetContent>
//             <SheetTitle className="text-sm py-2">Navigation Menu</SheetTitle>
//                 <div className="flex flex-col gap-2">
//                     {
//                         NavigationalPaths.map((path, index) => (
//                             <Button
//                                 variant={path.path === pathName ? "default" : "outline"}
//                                 key={index}
//                                 type={"button"}
//                                 asChild>
//                                 <Link href={path.path}>{path.name}</Link>
//                             </Button>
//                         ))
//                     }
//                 </div>
//             </SheetContent>
//         </Sheet>
//     )
// }