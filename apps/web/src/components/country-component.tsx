import { Input } from "@chakra-ui/react";
import { useState } from "react";

export function InputCountry({country}: {country: string}) {
    const [inputCountry, setInputCountry] = useState(country);

    return (
        <Input placeholder='Country' value={inputCountry} onChange={(e) => setInputCountry(e.target.value)} />
    )
}