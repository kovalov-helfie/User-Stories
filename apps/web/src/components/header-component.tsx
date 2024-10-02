import { Stack } from "@chakra-ui/react";
import { NavLink } from "react-router-dom";

export function HeaderComponent({userData}: {userData: any}) {
    return (
        <Stack direction={"row"} justifyContent={'space-between'} margin={'30px'} fontWeight={'bold'}>
            <NavLink to={'/'}>Profile</NavLink>
            { userData?.isVerified ? <NavLink to={'/asset'}>Asset</NavLink> : <></>}
            <NavLink to={'/market'}>Market</NavLink>
            {
                userData?.isAdmin 
                ?
                    <>
                        <NavLink to={'/admin-user'}>Admin User</NavLink>
                        <NavLink to={'/admin-claim'}>Admin Claim</NavLink>
                    </>
                :
                    <></>
            }

        </Stack>
    )
}