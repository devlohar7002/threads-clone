import React from 'react'
import { Container, Skeleton, Flex, Text } from '@radix-ui/themes'

function PostSkeleton() {
    return (
        <div className="flex flex-col gap-2 p-6 py-2">
            <div className="flex flex-row justify-between">
                <div className='flex flex-col'>
                    <Container size="1" >
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
                </div>
            </div>
        </div>
    )
}

export default PostSkeleton