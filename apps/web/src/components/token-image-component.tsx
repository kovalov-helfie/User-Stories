import { Button, Checkbox, Input, Stack, Table, Image, TableCaption, TableContainer, Tbody, Td, Tfoot, Th, Thead, Tr, Container, Flex } from "@chakra-ui/react"
import { useEffect, useState } from "react";
import { env } from "../env";
import { verifyMessage } from "../functions";
import { useAccount, useSignMessage } from "wagmi";
import { useParams } from "react-router-dom";

export const TokenHeaderImage = ({ claimTopic, randomStr }: { claimTopic: number, randomStr: string }) => {
    const { address } = useAccount()
    const { tokenAddress } = useParams()
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
                const getDocgenSignature = await signMessageAsync({ message: verifyMessage(address, 'getDocgen'), account: address })
                const response = await fetch(`${env.VITE_API_URL}/token-claims/claim/docgen/${address}/${tokenAddress}-${claimTopic}?random=${randomStr}`, {
                    headers: {
                        'signature': getDocgenSignature
                    },
                });

                if (!response.ok) {
                    throw new Error(await response.text());
                }

                const blob = await response.blob();
                objectUrl = URL.createObjectURL(blob);

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
    }, [address, claimTopic, randomStr]);

    if (error) {
        return <Stack>Error loading image: {error}</Stack>;
    }

    if (!imageUrl) {
        return <Stack>Loading image...</Stack>;
    }

    return <Image src={imageUrl} alt='Doc' boxSize='75px' />;
}
