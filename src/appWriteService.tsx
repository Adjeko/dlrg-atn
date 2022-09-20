import { Query } from "appwrite";
import { useDLRGStore } from "./useDLRGStore";

function getProfile() {

  const appDatabase = useDLRGStore.getState().appDatabase;
  const user = useDLRGStore.getState().user;
  const setProfile = useDLRGStore.getState().setProfile;

  if (appDatabase != null && user != null) {
    appDatabase.listDocuments('63276283cb336e0e745c', [Query.equal('userId', user.$id)])
        .then(response => {
            if(response.total == 1){
              setProfile(response.documents[0]);
            }
        });
}
}

export {getProfile}
