import { Alert } from "@/types/alert"

type AlertFilter = {
    key : keyof Alert
}

export const AlertsFilters: AlertFilter[] = [
     {
        key : "severity"
     },

     {
        key : "status"
     },

]