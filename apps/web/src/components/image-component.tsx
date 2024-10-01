import { Button, Checkbox, Input, Stack, Table, Image, TableCaption, TableContainer, Tbody, Td, Tfoot, Th, Thead, Tr, Container, Flex } from "@chakra-ui/react"
import { useEffect, useState } from "react";
import { env } from "../env";
import { verifyMessage } from "../functions";
import { useAccount, useSignMessage } from "wagmi";

export const HeaderImage = ({ claimTopic }: { claimTopic: number }) => {
    const { address } = useAccount()
    const { signMessageAsync } = useSignMessage()

    const [imageUrl, setImageUrl] = useState('');
    const [error, setError] = useState('');

    useEffect(() => {
        let isMounted = true;
        let objectUrl = '';

        const fetchImage = async () => {
            try {
                if(!address) {
                    throw new Error("No User"); 
                }
                const getDocgenSignature = await signMessageAsync({ message: verifyMessage(address, 'getDocgen') })
                const response = await fetch(`${env.VITE_API_URL}/claims/claim/docgen/${address}-${claimTopic}`, {
                    headers: {
                        'signature': getDocgenSignature
                    },
                });

                if (!response.ok) {
                    throw new Error(await response.text());
                }

                const blob = await response.blob();
                console.warn(blob)
                objectUrl = URL.createObjectURL(blob);
                console.warn(objectUrl)

                if (isMounted) {
                    setImageUrl(objectUrl);
                    setError('');
                }
            } catch (err: any) {
                if (isMounted) {
                    setError(err.message);
                }
                console.error('Error fetching image:', err);
            }
        };

        fetchImage();

        return () => {
            isMounted = false;
            if (objectUrl) {
                URL.revokeObjectURL(objectUrl);
            }
        };
    }, [address, claimTopic]);

    if (error) {
        return <Stack>Error loading image: {error}</Stack>;
    }

    if (!imageUrl) {
        return <Stack>Loading image...</Stack>;
    }

    return <Image src={imageUrl} alt='Doc' boxSize='75px' />;
}
