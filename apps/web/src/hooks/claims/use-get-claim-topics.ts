import { useQuery } from "@tanstack/react-query"
import { env } from "../../env"

const CLAIM_TOPICS = [0, 1]

export const useGetClaimTopics = () => {
    return {claimTopicsData: CLAIM_TOPICS }
}