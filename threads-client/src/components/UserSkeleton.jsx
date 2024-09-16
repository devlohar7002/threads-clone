import React from 'react'
import { Skeleton } from '@radix-ui/themes'
import { Container, Flex, Text } from '@radix-ui/themes'

function UserSkeleton() {
    return (
        <div>

            <div className="flex flex-col gap-2 p-6">
                <div className="flex flex-row justify-between">
                    <div className='flex flex-col'>
                        <Container size="1">
                            <Flex direction="column" gap="3">
                                <Flex direction="column" gap="1">
                                    <Text>
                                        <Skeleton>
                                            Loremipsumdolsdlfjalksdj
                                        </Skeleton>

                                    </Text>
                                    <Text>
                                        <Skeleton>
                                            Loremidfja
                                        </Skeleton>

                                    </Text>
                                </Flex>


                                <Text>
                                    <Skeleton>
                                        Lorem ipsum dolor sit amet, consectetur adipiscing elit. Pellentesque
                                        felis tellus, efficitur id convallis a, viverra eget
                                    </Skeleton>
                                </Text>
                            </Flex>
                        </Container>

                        <hr className="h-px my-6 bg-zinc-200 border-0 dark:bg-zinc-800"></hr>

                        <Container size="1">
                            <Flex direction="column" gap="3">
                                <Flex direction="column" gap="1">
                                    <Text>
                                        <Skeleton>
                                            Loremidfja
                                        </Skeleton>

                                    </Text>
                                </Flex>

                                <Text>
                                    <Skeleton>
                                        Lorem ipsum dolor sit amet, con
                                        felis tellus, efficitur id convallis a, viverra eget
                                    </Skeleton>
                                </Text>
                            </Flex>
                        </Container>

                        <hr className="h-px my-6 bg-zinc-200 border-0 dark:bg-zinc-800"></hr>

                        <Container size="1">
                            <Flex direction="column" gap="3">
                                <Flex direction="column" gap="1">
                                    <Text>
                                        <Skeleton>
                                            Loremidfja
                                        </Skeleton>

                                    </Text>
                                </Flex>

                                <Text>
                                    <Skeleton>
                                        Lorem ipsum dolor sit amet, con
                                        felis tellus, efficitur id convallis a, viverra eget
                                    </Skeleton>
                                </Text>
                            </Flex>
                        </Container>

                        <hr className="h-px my-6 bg-zinc-200 border-0 dark:bg-zinc-800"></hr>

                        <Container size="1">
                            <Flex direction="column" gap="3">
                                <Flex direction="column" gap="1">
                                    <Text>
                                        <Skeleton>
                                            Loremidfja
                                        </Skeleton>

                                    </Text>
                                </Flex>

                                <Text>
                                    <Skeleton>
                                        Lorem ipsum dolor sit amet, con
                                        felis tellus, efficitur id convallis a, viverra eget
                                    </Skeleton>
                                </Text>
                            </Flex>
                        </Container>

                        <hr className="h-px my-6 bg-zinc-200 border-0 dark:bg-zinc-800"></hr>

                        <Container size="1">
                            <Flex direction="column" gap="3">
                                <Flex direction="column" gap="1">
                                    <Text>
                                        <Skeleton>
                                            Loremidfja
                                        </Skeleton>

                                    </Text>
                                </Flex>

                                <Text>
                                    <Skeleton>
                                        Lorem ipsum dolor sit amet, con
                                        felis tellus, efficitur id convallis a, viverra eget
                                    </Skeleton>
                                </Text>
                            </Flex>

                            <hr className="h-px my-6 bg-zinc-200 border-0 dark:bg-zinc-800"></hr>

                            <Container size="1">
                                <Flex direction="column" gap="3">
                                    <Flex direction="column" gap="1">
                                        <Text>
                                            <Skeleton>
                                                Loremidfja
                                            </Skeleton>

                                        </Text>
                                    </Flex>

                                    <Text>
                                        <Skeleton>
                                            Lorem ipsum dolor sit amet, con
                                            felis tellus, efficitur id convallis a, viverra eget
                                        </Skeleton>
                                    </Text>
                                </Flex>
                            </Container>
                        </Container>
                    </div>

                    {/* <button onClick={() => setOpenModal(true)} className="flex justify-center items-center">
                        <img className="rounded-full w-14 h-14 object-cover" src={`${user?.profilePic || 'default-avatar.jpg'}`} alt="Avatar" />
                    </button> */}
                </div>
                {/* <div className='mt-4'>{user?.bio}</div> */}

                {/* <Flex justify="between" align="center" className="text-zinc-400">
                    <Flex gap="2" justify="between" align="center" maxWidth={"80%"}>

                        <Text wrap="nowrap">{user?.followers?.length || 0} followers</Text>
                        <div className="bg-zinc-400 w-[3px] h-[3px] rounded-full">
                        </div>

                     
                        <Text wrap="nowrap">{user?.following?.length || 0} following</Text>

                    </Flex>

                    <Flex>
                        <div className="p-2 hover:bg-zinc-50 dark:hover:bg-zinc-800 rounded-full">
                            <BsInstagram className="w-6 h-6 text-black dark:text-white cursor-pointer" />
                        </div>
                        {currentUser._id !== user._id &&
                            <DropdownMenu.Root>
                                <DropdownMenu.Trigger>
                                    <div className="p-2 hover:bg-zinc-50 dark:hover:bg-zinc-800 rounded-full">
                                        <CgMoreO className="w-6 h-6 text-black dark:text-white cursor-pointer" />
                                    </div>
                                </DropdownMenu.Trigger>
                                <DropdownMenu.Content >
                                    <DropdownMenu.Item className="bg-dropdown" onClick={copyURL}>Copy Link</DropdownMenu.Item>
                                </DropdownMenu.Content>
                            </DropdownMenu.Root>
                        }
                    </Flex>

                </Flex> */}

                {/* {currentUser._id === user._id &&
                    <div className='flex justify-between items-center text-center w-full gap-4 '>
                        <Link to={'/update'} className='border w-full text-sm font-semibold border-zinc-300 dark:border-zinc-700 rounded-xl py-[6px]'>Edit Profile</Link>
                        <button onClick={copyURL} className='border w-full text-sm font-semibold border-zinc-300 dark:border-zinc-700 rounded-xl py-[6px]'>Share Profile</button>
                    </div>
                } */}

                {/* {currentUser._id !== user._id &&
                    <div className='flex justify-between items-center text-center w-full gap-4 '>
                        {!following ? <button disabled={updating} onClick={handleFollowUnfollow} className='flex items-center justify-center gap-2 border w-full text-sm font-semibold  bg-zinc-800 text-white dark:bg-zinc-50 dark:text-black rounded-xl py-[6px]'>
                            {updating ? <Spinner /> : <span>Follow</span>}

                        </button>
                            : <button disabled={updating} onClick={handleFollowUnfollow} className='flex items-center justify-center border w-full text-sm font-semibold border-zinc-300 dark:border-zinc-700 rounded-xl py-[6px]'>
                                {updating ? <Spinner /> : <span>Following</span>}
                            </button>
                        }
                        <button onClick={copyURL} className='border w-full text-sm font-semibold border-zinc-300 dark:border-zinc-700 rounded-xl py-[6px]'>Share Profile</button>
                    </div>
                } */}

            </div>
        </div>
    )
}

export default UserSkeleton