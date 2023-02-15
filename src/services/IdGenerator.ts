import { v4 } from "uuid"

export class idGenerator {
    public generate = (): string => {
        return v4()
    }
}