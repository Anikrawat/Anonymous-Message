import {z} from 'zod'

const acceptingMessagesValidation = z
    .boolean()

const acceptingMessagesSchema = z.object({
    acceptingMessages:acceptingMessagesValidation
})

export default acceptingMessagesSchema