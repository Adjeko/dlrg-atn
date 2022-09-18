import { Account, Client, Databases, Models } from 'appwrite'
import create from 'zustand'

interface dlrgState {
    appwriteClient: Client,
    setAppwriteClient: (client: Client) => void,

    appwriteAccount: Account,
    setAppwriteAccount: (account: Account) => void,

    appDatabase: Databases,
    setAppDatabase: (database: Databases) => void,

    session: Models.Session,
    setSession: (session: Models.Session) => void,

    user: Models.User<Models.Preferences>,
    setUser: (newUser: Models.User<Models.Preferences>) => void,
}

export const useDLRGStore = create<dlrgState>((set) => ({

    appwriteClient: null,
    setAppwriteClient: (client) => set((state) => ({appwriteClient: state.appwriteClient = client})),

    appwriteAccount: null,
    setAppwriteAccount: (account) => set((state) => ({appwriteAccount: state.appwriteAccount = account})),

    appDatabase: null,
    setAppDatabase: (database) => set((state) => ({appDatabase: state.appDatabase = database})),

    session: null,
    setSession: (session) => set((state) => ({session: state.session = session})),

    user: null,
    setUser: (newUser) => set((state) => ({user: state.user = newUser})),

}))