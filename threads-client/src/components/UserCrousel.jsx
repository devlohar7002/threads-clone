import * as React from "react"
import { useEffect, useState } from "react"

import { Card, CardContent } from "@/components/ui/card"
import {
    Carousel,
    CarouselContent,
    CarouselItem,
    CarouselNext,
    CarouselPrevious,
} from "@/components/ui/carousel"
import axios from "axios"
import { Spinner } from '@radix-ui/themes';
import useShowToast from "@/hooks/useShowToast"

export function UserCrousel() {
    const [users, setUsers] = useState([])
    const [updating, setUpdating] = useState(false)
    const { toast, showToast } = useShowToast();
    const [following, setFollowing] = useState(false)

    useEffect(() => {
        const fetchUsers = async () => {
            try {
                const response = await axios("/api/users/randomUsers");
                console.log(response.data);
                setUsers(response.data);
            } catch (error) {
                console.log(error);
            }
        };

        fetchUsers();
    }, []);

    const handleFollowUnfollow = async (user) => {

        setUpdating(true)
        try {
            const response = await axios.post(`/api/users/follow/${user._id}`)

            if (following) {
                showToast(false, `Unfollwed ${user.username}`);
                user.followers.pop()
            } else {
                showToast(false, `Follwed ${user.username}`);
                user.followers.push(currentUser._id)
            }
            setFollowing((prev) => !prev)
        } catch (error) {
            showToast(true, error.message);
        } finally {
            setUpdating(false)
        }
    }

    return (
        users.length > 0 && <Carousel
            opts={{
                align: "start",
            }}
            className="w-full max-w-sm"
        >
            <CarouselContent >
                {users.map((ele, index) => (
                    <CarouselItem key={index} className={` ${users.length >= 2 ? 'basis-1/2' : ''} ${users.length >= 3 ? 'md:basis-1/3' : ''}`}>
                        <div className="p-1">
                            <Card>
                                <CardContent className="flex flex-col aspect-square items-center justify-between p-6">
                                    <div className="flex flex-col justify-center items-center gap-4">
                                        <img className=" w-52 h-52 rounded-full border border-zinc-200 dark:border-zinc-800" src={ele.profilePic || '/default-avatar.jpg'} alt="" />
                                        <div className="text-3xl font-semibold">{ele.username}</div>
                                    </div>

                                    <div className='flex justify-between items-center text-center w-full gap-4 '>
                                        <button disabled={updating} onClick={() => handleFollowUnfollow(ele)} className='flex items-center justify-center gap-2 border w-full text-sm font-semibold  bg-zinc-800 text-white dark:bg-zinc-50 dark:text-black rounded-xl py-[6px]'>
                                            {updating ? <Spinner /> : <span>Follow</span>}

                                        </button>
                                    </div>

                                </CardContent>
                            </Card>
                        </div>
                    </CarouselItem>
                ))}
            </CarouselContent>
            <CarouselPrevious />
            <CarouselNext />
        </Carousel>
    )
}
