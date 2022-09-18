import { Client, Models } from 'appwrite'
import create from 'zustand'

interface dlrgState {
    appwriteClient: Client,
    setAppwriteClient: (client: Client) => void
    user: Models.User<Models.Preferences>,
    setUser: (newUser: Models.User<Models.Preferences>) => void,
}

export const useDLRGStore = create<dlrgState>((set) => ({

    appwriteClient: null,
    setAppwriteClient: (client) => set((state) => ({appwriteClient: state.appwriteClient = client})),

    user: null,
    setUser: (newUser) => set((state) => ({user: state.user = newUser})),

}))